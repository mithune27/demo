import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Fetch profile once
  useEffect(() => {
    api
      .get("accounts/api/me/")
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, []);

  // Close on outside click (FIXED)
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!profile) return null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // 🔥 IMPORTANT
          setOpen((prev) => !prev);
        }}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: 600,
        }}
      >
        👤 {profile.full_name || profile.username} ▾
      </div>

      {/* Dropdown */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()} // 🔥 IMPORTANT
          style={{
            position: "absolute",
            top: "120%",
            right: 0,
            width: 280,
            background: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
            fontSize: 14,
            zIndex: 100,
          }}
        >
          {/* Quick Info */}
          <p><b>Name:</b> {profile.full_name}</p>
          <p><b>Username:</b> {profile.username}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Mobile:</b> {profile.mobile_number || "-"}</p>
          <p><b>Role:</b> {profile.role}</p>

          <hr style={{ margin: "10px 0" }} />

          {/* Actions */}
          <button
            style={btnStyle}
            onClick={() => {
              setOpen(false);
              navigate("/admin/profile");
            }}
          >
            Profile
          </button>

          <button
            style={{ ...btnStyle, background: "#ffe5e5", color: "#b00020" }}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const btnStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "none",
  background: "#f1f5f9",
  cursor: "pointer",
  fontWeight: 500,
  marginBottom: 6,
  textAlign: "left",
};

export default ProfileDropdown;
