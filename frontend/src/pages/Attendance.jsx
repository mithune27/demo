import { useEffect, useState } from "react";
import { getTodayAttendance, checkIn, checkOut,getTodayAttendanceMulti,checkInMulti,checkOutMulti } from "../api/attendance";
import { sendLocationPing } from "../api/location";

const Attendance = () => {
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

  // -------------------------
  // Load attendance
  // -------------------------
  const loadStatus = async () => {
  try {
    const res = await getTodayAttendanceMulti();

    setCheckedIn(res.data.checked_in);
    setCheckedOut(false); // multi-session does not lock checkout permanently
    setStatus(res.data.checked_in ? "PRESENT" : "NOT CHECKED IN");
    setOnLeave(false);

    // optional – keep compatibility
    if (res.data.sessions?.length) {
      const last = res.data.sessions.at(-1);
      setCheckInTime(last.check_in || null);
      setCheckOutTime(last.check_out || null);
    }
  } catch {
    setError("Failed to load attendance");
  }
};


  // -------------------------
  // GPS Ping (FINAL)
  // -------------------------
  const pingLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
  async (pos) => {
    try {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;

      // ✅ LIVE GPS LOGS (THIS IS WHAT WE NEED)
      console.log("LIVE LAT:", latitude);
      console.log("LIVE LON:", longitude);

      const res = await sendLocationPing({
        latitude: latitude,
        longitude: longitude,
        is_enabled: true,
      });

      console.log("GPS RESPONSE:", res.data);

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
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  };

  // -------------------------
  // Initial load
  // -------------------------
  useEffect(() => {
    loadStatus();
    pingLocation();

    const interval = setInterval(pingLocation, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // -------------------------
  // Permission logic
  // -------------------------
  const canCheckIn =
    location.location_enabled &&
    location.inside_geofence &&
    !onLeave &&
    !checkedIn;
    !checkedIn;

  // -------------------------
  // Actions
  // -------------------------
  const handleCheckIn = async () => {
    if (!canCheckIn) return;
    setLoading(true);
    try {
      /*await checkIn();*/
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
      /*await checkOut();*/
      await checkOutMulti();
      await loadStatus();
    } catch {
      setError("Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Location badge
  // -------------------------
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

  return (
    <div className="attendance-wrapper">
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
    </div>
  );
};

export default Attendance;

