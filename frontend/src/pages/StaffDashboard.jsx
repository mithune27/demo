import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="page-center">
      <div className="card dashboard-card">
        <h2 className="text-center dashboard-title">
          👋 Staff Dashboard
        </h2>

        <p className="text-center text-muted">
          Choose an option
        </p>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* ATTENDANCE */}
          <button
            className="btn dashboard-btn"
            onClick={() => navigate("/staff/attendance")}
          >
            📍 Attendance
          </button>

          {/* APPLY LEAVE */}
          <button
            className="btn dashboard-btn"
            onClick={() => navigate("/staff/apply-leave")}
          >
            📝 Apply Leave
          </button>

          {/* LEAVE STATUS */}
          <button
            className="btn dashboard-btn"
            onClick={() => navigate("/staff/leaves")}
          >
            📄 My Leaves
          </button>

          {/* ✅ REPORTS (NEW) */}
          <button
            className="btn dashboard-btn"
            onClick={() => navigate("/staff/reports")}
          >
            📊 Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

