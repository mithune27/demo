import { useEffect, useState } from "react";
import { getTodayAttendance, checkIn, checkOut } from "../api/attendance";
import { getLocationStatus, sendLocationPing } from "../api/location";

const Attendance = () => {
  const [status, setStatus] = useState("loading");
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [onLeave, setOnLeave] = useState(false);

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------
  // Load attendance status
  // -------------------------
  const loadStatus = async () => {
    try {
      const res = await getTodayAttendance();
      setStatus(res.data.status);
      setCheckedIn(res.data.checked_in || false);
      setCheckedOut(res.data.checked_out || false);
      setCheckInTime(res.data.check_in_time);
      setCheckOutTime(res.data.check_out_time);
      setOnLeave(res.data.on_leave || false);
    } catch {
      setError("Failed to load attendance");
    }
  };

  // -------------------------
  // Load location status
  // -------------------------
  const loadLocationStatus = async () => {
    try {
      const res = await getLocationStatus();
      setLocation(res.data);
    } catch {
      setLocation(null);
    }
  };

  // -------------------------
  // Auto GPS ping (every 30 mins)
  // -------------------------
  useEffect(() => {
    const ping = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sendLocationPing({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            is_enabled: true,
          });
        },
        () => {
          sendLocationPing({
            latitude: null,
            longitude: null,
            is_enabled: false,
          });
        }
      );
    };

    ping();
    const interval = setInterval(ping, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadStatus();
    loadLocationStatus();
  }, []);

  // -------------------------
  // Permission logic
  // -------------------------
  const canCheckIn =
    location &&
    location.location_enabled &&
    location.inside_geofence &&
    !onLeave &&
    !checkedIn;

  // -------------------------
  // Actions
  // -------------------------
  const handleCheckIn = async () => {
    if (!canCheckIn) return;
    setLoading(true);
    try {
      await checkIn();
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
      await checkOut();
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
    if (!location) return null;

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
    /* ✅ FIXED LAYOUT */
    <div className="attendance-wrapper">
      <div className="card attendance-card">
        <h2 className="text-center" style={{ marginBottom: 12 }}>
          📍 Attendance
        </h2>

        {error && (
          <p className="text-center" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <div className="text-center">{renderLocationBadge()}</div>

        {location && !location.location_enabled && (
          <p className="text-center status-danger">
            🔴 Enable GPS to check in
          </p>
        )}

        {location &&
          location.location_enabled &&
          !location.inside_geofence && (
            <p className="text-center status-warning">
              🟠 Move inside campus to check in
            </p>
          )}

        {onLeave && (
          <p className="text-center status-warning">
            🚫 You are on approved leave today
          </p>
        )}

        <p className="text-center">
          <strong>Status:</strong> {status}
        </p>

        {checkInTime && (
          <p className="text-center">
            ⏱ Check-in: {new Date(checkInTime).toLocaleTimeString()}
          </p>
        )}

        {checkOutTime && (
          <p className="text-center">
            ⏱ Check-out: {new Date(checkOutTime).toLocaleTimeString()}
          </p>
        )}

        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          <button
            className="btn btn-primary"
            onClick={handleCheckIn}
            disabled={loading || !canCheckIn}
          >
            {checkedIn ? "Checked In" : "Check In"}
          </button>

          <button
            className="btn btn-danger"
            onClick={handleCheckOut}
            disabled={loading || !checkedIn || checkedOut || onLeave}
          >
            {checkedOut ? "Checked Out" : "Check Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
