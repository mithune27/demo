import { useEffect, useState } from "react";
import { getMyLeaves } from "../api/leave";

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

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}

      {leaves.length === 0 && !error && (
        <p style={{ textAlign: "center" }}>
          No leave records found
        </p>
      )}

      {leaves.map((leave) => (
        <p key={leave.id}>
          {leave.start_date} → {leave.end_date} :{" "}
          <strong>{leave.status}</strong>
        </p>
      ))}
    </>
  );
};

export default LeaveStatus;
