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
      return "🔴 GPS OFF · Enable Location";
    }

    return location.inside_geofence
      ? "🟢 GPS ON · Inside Campus"
      : "🟠 GPS ON · Outside Campus";
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>📍 Attendance</h2>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}

      {/* LOCATION STATUS */}
      {location && (
        <p
          style={{
            textAlign: "center",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          {renderLocationBadge()}
        </p>
      )}

      {/* WARNINGS */}
      {location && !location.location_enabled && (
        <p style={{ color: "red", textAlign: "center" }}>
          🔴 Enable GPS to check in
        </p>
      )}

      {location &&
        location.location_enabled &&
        !location.inside_geofence && (
          <p style={{ color: "orange", textAlign: "center" }}>
            🟠 Move inside campus to check in
          </p>
        )}

      {onLeave && (
        <p style={{ color: "orange", textAlign: "center" }}>
          🚫 You are on approved leave today
        </p>
      )}

      <p style={{ textAlign: "center" }}>
        <strong>Status:</strong> {status}
      </p>

      {checkInTime && (
        <p style={{ textAlign: "center" }}>
          ⏱ Check-in: {new Date(checkInTime).toLocaleTimeString()}
        </p>
      )}

      {checkOutTime && (
        <p style={{ textAlign: "center" }}>
          ⏱ Check-out: {new Date(checkOutTime).toLocaleTimeString()}
        </p>
      )}

      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <button
          onClick={handleCheckIn}
          disabled={loading || !canCheckIn}
        >
          {checkedIn ? "Checked In" : "Check In"}
        </button>

        <button
          onClick={handleCheckOut}
          disabled={loading || !checkedIn || checkedOut || onLeave}
        >
          {checkedOut ? "Checked Out" : "Check Out"}
        </button>
      </div>
    </>
  );
};

export default Attendance;
