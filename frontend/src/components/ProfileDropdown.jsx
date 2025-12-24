import { useEffect, useRef, useState } from "react";
import api from "../api/axios";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const ref = useRef(null);

  // Fetch profile once
  useEffect(() => {
    api.get("accounts/api/me/")
      .then(res => setProfile(res.data))
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!profile) return null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
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
          style={{
            position: "absolute",
            top: "120%",
            left: 0,
            width: 260,
            background: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
            fontSize: 14,
            zIndex: 100,
          }}
        >
          <p><b>Name:</b> {profile.full_name}</p>
          <p><b>Username:</b> {profile.username}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Mobile:</b> {profile.mobile_number || "-"}</p>
          <p><b>Role:</b> {profile.role}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
