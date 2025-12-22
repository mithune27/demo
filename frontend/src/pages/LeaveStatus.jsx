import { useEffect, useState } from "react";
import { getMyLeaves } from "../api/leave";

const badgeStyle = (status) => {
  if (status === "APPROVED") return { color: "green" };
  if (status === "REJECTED") return { color: "red" };
  return { color: "orange" };
};

const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyLeaves()
      .then((res) => {
        setLeaves(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load leave history");
      });
  }, []);

  return (
    <>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        📄 Leave Status
      </h2>

      {leaves.length === 0 && (
        <p style={{ textAlign: "center" }}>No leave requests</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {leaves.map((leave) => (
          <p key={leave.id}>
            {leave.start_date} → {leave.end_date} :{" "}
            <strong style={badgeStyle(leave.status)}>
              {leave.status}
            </strong>
          </p>
        ))}
      </div>
    </>
  );
};

export default LeaveStatus;