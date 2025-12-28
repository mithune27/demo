import { useEffect, useState } from "react";
import { getMyLeaves } from "../api/leaves";

const statusStyle = (status) => {
  if (status === "APPROVED")
    return { background: "#dcfce7", color: "#166534" };
  if (status === "REJECTED")
    return { background: "#fee2e2", color: "#991b1b" };
  return { background: "#fef3c7", color: "#92400e" };
};

const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    getMyLeaves().then((res) => setLeaves(res.data));
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>
          📋 Leave Status
        </h2>

        {leaves.length === 0 && (
          <p style={{ textAlign: "center", color: "#64748b" }}>
            No leave requests
          </p>
        )}

        {leaves.map((l) => (
          <div
            key={l.id}
            style={{
              padding: 14,
              borderRadius: 12,
              background: "#f9f9ff",
              marginBottom: 12,
            }}
          >
            <strong>
              {l.start_date} → {l.end_date}
            </strong>

            <p style={{ margin: "6px 0" }}>
              Type: <b>{l.leave_type}</b>
            </p>

            <span
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                ...statusStyle(l.status),
              }}
            >
              {l.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveStatus;
