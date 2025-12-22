import { useEffect, useState } from "react";
import { getMyLeaves } from "../api/leave";

const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLeaves()
      .then((res) => setLeaves(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (leaves.length === 0) {
    return <p style={{ textAlign: "center" }}>No leave requests</p>;
  }

  return (
    <>
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>
        📄 Leave Status
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {leaves.map((l, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <strong>
              {l.start_date} → {l.end_date}
            </strong>
            <p>Type: {l.leave_type}</p>
            <p>Status: <strong>{l.status}</strong></p>
          </div>
        ))}
      </div>
    </>
  );
};

export default LeaveStatus;
