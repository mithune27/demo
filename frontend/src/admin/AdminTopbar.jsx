import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";


const AdminTopbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div style={topbar}>
        <strong>Staff Management</strong>

        <div style={{ position: "relative" }}>
          <button style={profileBtn} onClick={() => setMenuOpen(!menuOpen)}>
            Admin ▾
          </button>

          {menuOpen && (
            <div style={dropdown}>
              <div style={item}>Profile</div>
              <div
                style={item}
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmOpen(true);
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={logout}
      />
    </>
  );
};

const topbar = {
  height: 64,
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
  borderBottom: "1px solid #e5e7eb",
};

const profileBtn = {
  background: "#f1f5f9",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

const dropdown = {
  position: "absolute",
  right: 0,
  top: 44,
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  overflow: "hidden",
};

const item = {
  padding: "10px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
};

export default AdminTopbar;
