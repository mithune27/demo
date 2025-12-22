import { useEffect, useState } from "react";
import { getTodayAttendance, checkIn, checkOut } from "../api/attendance";

const Attendance = () => {
  const [status, setStatus] = useState("loading");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStatus = async () => {
    try {
      const res = await getTodayAttendance();
      setStatus(res.data?.status || "Not Marked");
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance");
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleCheckIn = async () => {
    setLoading(true);
    setError("");
    try {
      await checkIn();
      await loadStatus();
    } catch (err) {
      console.error(err);
      setError("Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError("");
    try {
      await checkOut();
      await loadStatus();
    } catch (err) {
      console.error(err);
      setError("Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>📍 Attendance</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        <strong>Status:</strong>{" "}
        {status === "loading" ? "Loading..." : status}
      </p>

      <button onClick={handleCheckIn} disabled={loading}>
        {loading ? "Processing..." : "Check In"}
      </button>

      <button
        onClick={handleCheckOut}
        disabled={loading}
        style={{ marginLeft: 10 }}
      >
        Check Out
      </button>
    </div>
  );
};

export default Attendance;
