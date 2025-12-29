import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome, Admin 👋</h1>

      <p style={{ marginTop: 12 }}>
        Use the sidebar or cards below to manage users, attendance, leaves and geofence.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginTop: 30,
        }}
      >
        <div
          className="card clickable"
          onClick={() => navigate("/admin/users")}
        >
          👥 Users
        </div>

        <div
          className="card clickable"
          onClick={() => navigate("/admin/geofence")}
        >
          📍 Geofence
        </div>

        

        <div
          className="card clickable"
          onClick={() => navigate("/admin/attendance")}
        >
          🕒 Attendance
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
  