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
    <div className="page-scroll">
      <div className="card">
        <h2 className="text-center">📄 Apply Leave</h2>

        {msg && (
          <div className="badge badge-warning text-center">{msg}</div>
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
            style={inputStyle}
          />

          <button
            className="btn btn-primary"
            disabled={loading}
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
  borderRadius: "10px",
  border: "1px solid #ddd",
  marginBottom: "14px",
};

export default ApplyLeave;
