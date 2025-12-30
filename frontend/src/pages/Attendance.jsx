import { useEffect, useState } from "react";
import {
  getTodayAttendanceMulti,
  checkInMulti,
  checkOutMulti,
  getAttendanceCalendar,
} from "../api/attendance";
import { sendLocationPing } from "../api/location";
import AttendanceCalendar from "../components/AttendanceCalendar";
import "./attendance.css";

const Attendance = ({ showCheckIn = false }) => {
  console.log("Attendance component rendered");

  const [status, setStatus] = useState("loading");
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [onLeave, setOnLeave] = useState(false);

  const [location, setLocation] = useState({
    location_enabled: false,
    inside_geofence: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 📅 CALENDAR DATA (FROM BACKEND)
  const [calendarData, setCalendarData] = useState([]);

  // ================= LOAD TODAY STATUS =================
  const loadStatus = async () => {
    try {
      const res = await getTodayAttendanceMulti();

      setCheckedIn(res.data.checked_in);
      setCheckedOut(false);
      setStatus(res.data.checked_in ? "PRESENT" : "NOT CHECKED IN");
      setOnLeave(false);

      if (res.data.sessions?.length) {
        const last = res.data.sessions.at(-1);
        setCheckInTime(last.check_in || null);
        setCheckOutTime(last.check_out || null);
      }
    } catch {
      setError("Failed to load attendance");
    }
  };

  // ================= GPS PING =================
  const pingLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await sendLocationPing({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            is_enabled: true,
          });

          setLocation({
            location_enabled: res.data.location_enabled ?? true,
            inside_geofence: !!res.data.inside_geofence,
          });
        } catch (err) {
          console.error(err);
        }
      },
      async () => {
        await sendLocationPing({
          latitude: null,
          longitude: null,
          is_enabled: false,
        });

        setLocation({
          location_enabled: false,
          inside_geofence: false,
        });
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    loadStatus();
    pingLocation();

    const interval = setInterval(pingLocation, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ================= LOAD CALENDAR (ATTENDANCE PAGE ONLY) =================
  useEffect(() => {
    if (showCheckIn) return;

    const today = new Date();
    const month = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;

    getAttendanceCalendar(month)
      .then((res) => setCalendarData(res.data))
      .catch(() => setError("Failed to load calendar"));
  }, [showCheckIn]);

  // ================= PERMISSION =================
  const canCheckIn =
    location.location_enabled &&
    location.inside_geofence &&
    !onLeave &&
    !checkedIn;

  // ================= ACTIONS =================
  const handleCheckIn = async () => {
    if (!canCheckIn) return;
    setLoading(true);
    try {
      await checkInMulti();
      await loadStatus();
    } catch {
      setError("Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await checkOutMulti();
      await loadStatus();
    } catch {
      setError("Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOCATION BADGE =================
  const renderLocationBadge = () => {
    if (!location.location_enabled) {
      return <span className="badge badge-danger">🔴 GPS OFF</span>;
    }
    return location.inside_geofence ? (
      <span className="badge badge-success">🟢 Inside Campus</span>
    ) : (
      <span className="badge badge-warning">🟠 Outside Campus</span>
    );
  };

  // ================= UI =================
  return (
    <div className="attendance-page">
      {/* CHECK-IN / CHECK-OUT → DASHBOARD ONLY */}
      {showCheckIn && (
        <div className="card attendance-card">
          <h2 className="text-center">📍 Attendance</h2>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="text-center">{renderLocationBadge()}</div>

          {!location.location_enabled && (
            <p className="status-danger">🔴 Enable GPS to check in</p>
          )}

          {location.location_enabled && !location.inside_geofence && (
            <p className="status-warning">
              🟠 Move inside campus to check in
            </p>
          )}

          <p className="text-center">
            <strong>Status:</strong> {status}
          </p>

          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            <button
              className="btn btn-primary"
              disabled={!canCheckIn || loading}
              onClick={handleCheckIn}
            >
              {checkedIn ? "Checked In" : "Check In"}
            </button>

            <button
              className="btn btn-danger"
              disabled={!checkedIn || loading}
              onClick={handleCheckOut}
            >
              {checkedOut ? "Checked Out" : "Check Out"}
            </button>
          </div>
        </div>
      )}

      {/* 📅 CALENDAR → ATTENDANCE PAGE ONLY */}
      {!showCheckIn && (
        <div className="card attendance-card" style={{ marginTop: 30 }}>
          <h2 className="text-center">📅 Attendance Calendar</h2>
          <AttendanceCalendar data={calendarData} />
          {/* LEGEND */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginTop: "16px",
            flexWrap: "wrap",
          }}
        >
          <LegendItem color="#15803d" label="Full Day Present" />
          <LegendItem color="#86efac" label="Half Day Present" />
          <LegendItem color="#dc2626" label="Absent" />
          <LegendItem color="#facc15" label="Leave Applied" />
        </div>  
        </div>
      )}
    </div>
  );
};
const LegendItem = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <span
      style={{
        width: 14,
        height: 14,
        background: color,
        borderRadius: 4,
        display: "inline-block",
      }}
    />
    <span style={{ fontSize: 14 }}>{label}</span>
  </div>
);


export default Attendance;
