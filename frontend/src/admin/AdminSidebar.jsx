import { NavLink } from "react-router-dom";

const AdminSidebar = ({ collapsed, onToggle }) => {
  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    textDecoration: "none",
    color: isActive ? "#fff" : "#cbd5e1",
    background: isActive ? "#2563eb" : "transparent",
    borderRadius: 8,
    marginBottom: 6,
  });

  return (
    <div
      style={{
        width: collapsed ? 80 : 240,
        background: "#0f172a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        {!collapsed && <strong>Admin Panel</strong>}
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Links */}
      <div style={{ padding: 12, flex: 1 }}>
        <NavLink to="/admin" end style={linkStyle}>📊 {!collapsed && "Dashboard"}</NavLink>
        <NavLink to="/admin/users" style={linkStyle}>👥 {!collapsed && "Users"}</NavLink>
        <NavLink to="/admin/attendance" style={linkStyle}>🕒 {!collapsed && "Attendance"}</NavLink>
        <NavLink to="/admin/leaves" style={linkStyle}>📄 {!collapsed && "Leaves"}</NavLink>
        <NavLink to="/admin/geofence" style={linkStyle}>📍 {!collapsed && "Geofence"}</NavLink>
        <NavLink to="/admin/reports" style={linkStyle}>📈 {!collapsed && "Reports"}</NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
