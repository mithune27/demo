import { useNavigate } from "react-router-dom";

const StaffTopbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      style={{
        height: "60px",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 24px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <button
        onClick={logout}
        style={{
          background: "#ef4444",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default StaffTopbar;
