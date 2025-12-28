import { useState } from "react";
import { applyLeave } from "../api/leaves";

const ApplyLeave = () => {
  const [type, setType] = useState("CASUAL");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await applyLeave({
        leave_type: type,
        start_date: start,
        end_date: end,
        reason,
      });
      setMsg("Leave applied successfully");
      setStart("");
      setEnd("");
      setReason("");
    } catch {
      setMsg("Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          📄 Apply Leave
        </h2>

        {msg && (
          <div
            style={{
              textAlign: "center",
              marginBottom: 16,
              padding: 10,
              borderRadius: 8,
              background: "#fef3c7",
              color: "#92400e",
            }}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={inputStyle}
          >
            <option value="CASUAL">Casual</option>
            <option value="SICK">Sick</option>
          </select>

          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            style={inputStyle}
          />

          <textarea
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ ...inputStyle, minHeight: 90 }}
          />

          <button
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: "#6366f1",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {loading ? "Submitting..." : "Apply Leave"}
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  marginBottom: 14,
};

export default ApplyLeave;
