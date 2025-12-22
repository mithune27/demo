import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2 style={{ textAlign: "center" }}>👋 Staff Dashboard</h2>
      <p style={{ textAlign: "center", marginBottom: "24px" }}>
        Choose an option
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <button onClick={() => navigate("/staff/attendance")}>
          📍 Attendance
        </button>

        <button onClick={() => navigate("/staff/apply-leave")}>
          📝 Apply Leave
        </button>

        <button onClick={() => navigate("/staff/leaves")}>
          📄 My Leaves
        </button>
      </div>
    </>
  );
};

export default StaffDashboard;
