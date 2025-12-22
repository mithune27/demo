import { useState } from "react";
import { applyLeave } from "../api/leave";
import "./ApplyLeave.css";

const ApplyLeave = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await applyLeave({
        from_date: from,
        to_date: to,
        reason,
      });

      alert("Leave applied successfully");
      setFrom("");
      setTo("");
      setReason("");
    } catch {
      alert("Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-page">
      <form className="leave-card" onSubmit={submit}>
        <h2>📝 Apply Leave</h2>

        <label>From Date</label>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required />

        <label>To Date</label>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} required />

        <label>Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for leave"
          required
        />

        <button disabled={loading}>
          {loading ? "Submitting..." : "Apply Leave"}
        </button>
      </form>
    </div>
  );
};

export default ApplyLeave;
