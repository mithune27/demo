import { useState } from "react";
import { applyLeave } from "../api/leave";

const ApplyLeave = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await applyLeave({
        from_date: from,
        to_date: to,
        reason,
      });

      alert("✅ Leave applied successfully");

      setFrom("");
      setTo("");
      setReason("");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        📝 Apply Leave
      </h2>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}

      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <label>From Date</label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />

        <label>To Date</label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />

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
    </>
  );
};

export default ApplyLeave;
