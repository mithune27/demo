import { Outlet, useNavigate } from "react-router-dom";
import ProfileDropdown from "../components/ProfileDropdown";

const StaffLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="staff-layout">
      <div className="staff-container">

        {/* ================= HEADER ================= */}
        <div className="staff-header">
          {/* 👤 PROFILE DROPDOWN (TOP-LEFT) */}
          <ProfileDropdown />

          {/* LOGOUT BUTTON (TOP-RIGHT) */}
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
        {/* ========================================== */}

        {/* ================= PAGE CONTENT (CENTERED) ============ */}
        <div className="staff-content-center">
          <Outlet />
        </div>
        {/* ===================================================== */}

      </div>
    </div>
  );
};

export default StaffLayout;
