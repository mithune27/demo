import { useEffect, useState } from "react";
import { getTodayAttendance, checkIn, checkOut } from "../api/attendance";

const Attendance = () => {
  const [status, setStatus] = useState("loading");
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isNotLoggedIn = status === "Not Logged In";

  const loadStatus = async () => {
    try {
      const res = await getTodayAttendance();

      setStatus(res.data.status);
      setCheckedIn(res.data.checked_in);
      setCheckedOut(res.data.checked_out);
      setCheckInTime(res.data.check_in_time);
      setCheckOutTime(res.data.check_out_time);
      setError("");
    } catch {
      setStatus("Not Logged In");
      setError("Failed to load attendance");
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleCheckIn = async () => {
    if (checkedIn || isNotLoggedIn) return;

    setLoading(true);
    try {
      await checkIn();
      loadStatus();
    } catch {
      setError("Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!checkedIn || checkedOut || isNotLoggedIn) return;

    setLoading(true);
    try {
      await checkOut();
      loadStatus();
    } catch {
      setError("Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>📍 Attendance</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

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
          disabled={loading || checkedIn || isNotLoggedIn}
        >
          {checkedIn ? "Checked In" : "Check In"}
        </button>

        <button
          onClick={handleCheckOut}
          disabled={loading || !checkedIn || checkedOut || isNotLoggedIn}
        >
          {checkedOut ? "Checked Out" : "Check Out"}
        </button>
      </div>
    </>
  );
};

export default Attendance;
