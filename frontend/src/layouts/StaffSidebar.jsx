import { NavLink } from "react-router-dom";

const StaffSidebar = ({ collapsed, onToggle }) => {
  const linkStyle = ({ isActive }) => ({
    padding: "12px 16px",
    borderRadius: 10,
    marginBottom: 6,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: isActive ? "#fff" : "#cbd5f5",
    background: isActive ? "#1e40af" : "transparent",
    transition: "all 0.2s ease",
  });

  const menu = [
    { to: "/staff/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/staff/attendance", icon: "⏱", label: "Attendance" },
    { to: "/staff/apply-leave", icon: "📝", label: "Apply Leave" },
    { to: "/staff/leaves", icon: "📄", label: "My Leaves" },
    { to: "/staff/reports", icon: "📊", label: "Reports" },
  ];

  return (
    <div
      style={{
        width: collapsed ? 70 : 240,
        background: "linear-gradient(180deg, #020617, #0f172a)",
        color: "#fff",
        padding: 12,
        transition: "width 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        {!collapsed && <strong style={{ fontSize: 18 }}>Staff Panel</strong>}

        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            color: "#cbd5f5",
            cursor: "pointer",
            fontSize: 16,
            transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          ◀
        </button>
      </div>

      {/* Menu */}
      {menu.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          style={linkStyle}
          onMouseEnter={(e) => {
            if (!e.currentTarget.style.background)
              e.currentTarget.style.background = "#1e293b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "";
          }}
        >
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      ))}
    </div>
  );
};

export default StaffSidebar;
