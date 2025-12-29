import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import "./adminProfile.css";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/accounts/admin/users/${id}/`)
      .then(res => setUser(res.data))
      .catch(() => toast.error("Failed to load user"));
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveUser = async () => {
    try {
      await api.put(`/accounts/admin/users/${id}/update/`, user);
      toast.success("User updated");
      navigate("/admin/users");
    } catch {
      toast.error("Update failed");
    }
  };

  if (!user) return null;

  return (
    <div className="admin-profile-wrapper">
      <div className="admin-profile-card">
        <h2>Edit Staff User</h2>
        <p className="subtitle">Staff Details</p>

        <div className="profile-row">
          <span>Username</span>
          <input value={user.username} disabled />
        </div>

        <div className="profile-row">
          <span>Full Name</span>
          <input
            name="full_name"
            value={user.full_name || ""}
            onChange={handleChange}
          />
        </div>

        <div className="profile-row">
          <span>Email</span>
          <input
            name="email"
            value={user.email || ""}
            onChange={handleChange}
          />
        </div>

        <div className="profile-row">
          <span>Date of Birth</span>
          <input
            type="date"
            name="dob"
            value={user.dob || ""}
            onChange={handleChange}
          />
        </div>

        <div className="profile-row">
          <span>Gender</span>
          <select
            name="gender"
            value={user.gender || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="o">Other</option>
          </select>
        </div>

        <div className="profile-row">
          <span>Mobile</span>
          <input
            name="mobile"
            value={user.mobile || ""}
            onChange={handleChange}
          />
        </div>

        <div className="profile-row">
          <span>Role</span>
          <input value={user.role} disabled />
        </div>

        <div className="profile-row">
          <span>Status</span>
          <span className="status active">Active</span>
        </div>

        <div className="actions">
          <button className="btn-primary" onClick={saveUser}>
            Save
          </button>
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditUser;
