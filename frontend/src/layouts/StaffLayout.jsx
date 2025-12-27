import { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";
import StaffTopbar from "./StaffTopbar";

const StaffLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <StaffSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <StaffTopbar />

        {/* Content */}
        <div
          style={{
            flex: 1,
            background: "#f8fafc",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "32px 24px",
            overflowY: "auto",
          }}
        >
          <div style={{ width: "100%", maxWidth: 1100 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;
