import { useState } from "react";
import { applyLeave } from "../api/leave";

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("CASUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await applyLeave({
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
      });

      alert("✅ Leave applied successfully");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err) {
      console.error(err);
      setError("Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>📝 Apply Leave</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        
        <label>Leave Type</label>
        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
          <option value="CASUAL">Casual</option>
          <option value="SICK">Sick</option>
          <option value="EMERGENCY">Emergency</option>
        </select>

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <label>Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Submitting..." : "Apply Leave"}
        </button>
      </form>
    </>
  );
};

export default ApplyLeave;
