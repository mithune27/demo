import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const ref = useRef(null);
  const navigate = useNavigate();

  // =============================
  // FETCH PROFILE (ADMIN + STAFF)
  // =============================
  useEffect(() => {
    api
      .get("/accounts/api/me/")
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, []);

  // =============================
  // CLOSE ON OUTSIDE CLICK
  // =============================
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
          e.stopPropagation();
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
        👤 {profile.first_name} {profile.last_name} ▾
      </div>

      {/* Dropdown */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
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
          <p><b>Name:</b> {profile.first_name} {profile.last_name}</p>
          <p><b>Username:</b> {profile.username}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Mobile:</b> {profile.mobile || "-"}</p>
          <p><b>Gender:</b> {profile.gender || "-"}</p>
          <p>
            <b>DOB:</b>{" "}
            {profile.dob
              ? new Date(profile.dob).toLocaleDateString("en-GB")
              : "-"}
          </p>
          <p><b>Role:</b> {profile.role}</p>

          <hr style={{ margin: "10px 0" }} />

          <button
            style={btnStyle}
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
