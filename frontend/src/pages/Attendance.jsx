import { useEffect, useState } from "react";
import { getTodayAttendance, checkIn, checkOut } from "../api/attendance";

const Attendance = () => {
  const [status, setStatus] = useState("loading");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isNotLoggedIn = status === "Not Logged In";

  const loadStatus = async () => {
    try {
      const res = await getTodayAttendance();
      setStatus(res.data?.status || "Not Marked");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance");
      setStatus("Not Logged In");
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleCheckIn = async () => {
    if (isNotLoggedIn) return;

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
    if (isNotLoggedIn) return;

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
    <>
      <h2 style={{ textAlign: "center" }}>📍 Attendance</h2>

      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: 12 }}>
          {error}
        </p>
      )}

      <p style={{ textAlign: "center", marginBottom: 16 }}>
        <strong>Status:</strong>{" "}
        {status === "loading" ? "Loading..." : status}
      </p>

      {isNotLoggedIn && (
        <p style={{ color: "red", textAlign: "center", marginBottom: 20 }}>
          Please login to mark attendance
        </p>
      )}

      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <button
          onClick={handleCheckIn}
          disabled={loading || isNotLoggedIn}
        >
          {loading ? "Processing..." : "Check In"}
        </button>

        <button
          onClick={handleCheckOut}
          disabled={loading || isNotLoggedIn}
        >
          Check Out
        </button>
      </div>
    </>
  );
};

export default Attendance;
