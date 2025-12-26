import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import "./adminProfile.css";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  // ================= LOAD PROFILE =================
  const loadProfile = async () => {
    try {
      const res = await api.get("/accounts/api/me/");
      setProfile(res.data);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SAVE PROFILE =================
  const saveProfile = async () => {
    try {
      await api.put("/accounts/api/me/", {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
      });

      toast.success("Profile updated successfully");
      setEditing(false);
      loadProfile();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (!profile) return null;

  return (
    <div className="admin-profile-wrapper">
      <div className="admin-profile-card">
        <h2>Admin Profile</h2>
        <p className="subtitle">System Administrator</p>

        {/* USERNAME */}
        <div className="form-group">
          <label>Username</label>
          <input value={profile.username} disabled />
        </div>

        {/* FIRST NAME */}
        <div className="form-group">
          <label>First Name</label>
          <input
            name="first_name"
            value={profile.first_name || ""}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        {/* LAST NAME */}
        <div className="form-group">
          <label>Last Name</label>
          <input
            name="last_name"
            value={profile.last_name || ""}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={profile.email || ""}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        {/* ROLE */}
        <div className="form-group">
          <label>Role</label>
          <input value="ADMIN" disabled />
        </div>

        {/* STATUS */}
        <div className="status-row">
          <span>Status</span>
          <span className="status active">Active</span>
        </div>

        {/* ACTION BUTTONS */}
        {!editing ? (
          <button
            className="btn-primary"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        ) : (
          <div className="form-actions">
            <button className="btn-primary" onClick={saveProfile}>
              Save
            </button>
            <button
              className="btn-cancel"
              onClick={() => {
                setEditing(false);
                loadProfile();
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
