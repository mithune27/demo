import { useNavigate } from "react-router-dom";
import "./StaffDashboard.css";

const StaffDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="staff-page">
      <div className="staff-card">
        <h2>👋 Staff Dashboard</h2>
        <p className="subtitle">Choose an option</p>

        <div className="actions">
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
      </div>
    </div>
  );
};

export default StaffDashboard;
