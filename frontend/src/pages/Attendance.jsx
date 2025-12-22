import { useEffect, useState } from "react";
import { getTodayAttendance, checkIn, checkOut } from "../api/attendance";

const Attendance = () => {
  const [status, setStatus] = useState("loading");
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [onLeave, setOnLeave] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadStatus = async () => {
    const res = await getTodayAttendance();

    setStatus(res.data.status);
    setCheckedIn(res.data.checked_in || false);
    setCheckedOut(res.data.checked_out || false);
    setCheckInTime(res.data.check_in_time);
    setCheckOutTime(res.data.check_out_time);
    setOnLeave(res.data.on_leave || false);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <>
      <h2 style={{ textAlign: "center" }}>📍 Attendance</h2>

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
          disabled={loading || checkedIn || onLeave}
          onClick={checkIn}
        >
          Check In
        </button>

        <button
          disabled={loading || !checkedIn || checkedOut || onLeave}
          onClick={checkOut}
        >
          Check Out
        </button>
      </div>
    </>
  );
};

export default Attendance;
