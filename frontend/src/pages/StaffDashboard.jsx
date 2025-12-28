import { useNavigate } from "react-router-dom";

const cardStyle = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "22px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const StaffDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* HEADER */}
      <h1 style={{ marginBottom: 8 }}>Welcome, Staff 👋</h1>
      <p style={{ color: "#64748b", marginBottom: 32 }}>
        Use the cards below to manage your attendance, leaves, and reports.
      </p>

      {/* CARDS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
        }}
      >
        <div
          style={cardStyle}
          onClick={() => navigate("/staff/attendance")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          ⏱️ <strong>Attendance</strong>
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/staff/apply-leave")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          📝 <strong>Apply Leave</strong>
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/staff/leaves")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          📄 <strong>My Leaves</strong>
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/staff/reports")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          📊 <strong>Reports</strong>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
