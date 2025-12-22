import { Outlet } from "react-router-dom";

export default function StaffLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#7c7cf5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "32px",
          borderRadius: "16px",
          width: "420px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
