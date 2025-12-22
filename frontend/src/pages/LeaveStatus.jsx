import { useEffect, useState } from "react";
import { getMyLeaves } from "../api/leaves";

const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    getMyLeaves().then((res) => setLeaves(res.data));
  }, []);

  return (
    <div className="page-scroll">
      <div className="card">
        <h2 className="text-center">📋 Leave Status</h2>

        {leaves.length === 0 && (
          <p className="text-center text-muted">
            No leave requests
          </p>
        )}

        {leaves.map((l) => (
          <div key={l.id} style={leaveCard}>
            <strong>
              {l.start_date} → {l.end_date}
            </strong>
            <p>Type: {l.leave_type}</p>
            <span
              className={`badge ${
                l.status === "APPROVED"
                  ? "badge-success"
                  : l.status === "REJECTED"
                  ? "badge-danger"
                  : "badge-warning"
              }`}
            >
              {l.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const leaveCard = {
  padding: "14px",
  borderRadius: "12px",
  background: "#f9f9ff",
  marginBottom: "12px",
};

export default LeaveStatus;
