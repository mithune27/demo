import { Outlet, useNavigate } from "react-router-dom";

export default function StaffLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #7c7cf5, #5a5ae0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* 🔹 Header */}
        <div
          style={{
            padding: "14px 18px",
            background: "#f4f4ff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
          }}
        >
          <strong style={{ color: "#5a5ae0" }}>Staff Portal</strong>

          <button
            onClick={handleLogout}
            style={{
              background: "#ff4d4f",
              border: "none",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
        </div>

        {/* 🔹 Page Content */}
        <div style={{ padding: "32px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
