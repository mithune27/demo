import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../pages/adminCreateUser.css";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    dob: "",
    sex: "",
    mobile: "",
    role: "SECURITY",
    is_active: true,
  });

  // 🔹 LOAD USER DATA
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get(`/accounts/admin/users/${id}/`);
        setForm({
          username: res.data.username || "",
          email: res.data.email || "",
          full_name: res.data.full_name || "",
          dob: res.data.dob || "",
          sex: res.data.sex || "",
          mobile: res.data.mobile || "",
          role: res.data.role || "SECURITY",
          is_active: res.data.is_active,
        });
      } catch (err) {
        alert("Failed to load user");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, navigate]);

  // 🔹 HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 SUBMIT UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/accounts/admin/users/${id}/update/`, form);
      setSuccess(true);
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h2 className="form-title">Edit Staff User</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* USERNAME */}
          <div className="form-group">
            <label>Username</label>
            <input value={form.username} disabled />
          </div>

          {/* FULL NAME */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              required
            />
          </div>

          {/* DOB */}
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          {/* GENDER */}
          <div className="form-group">
            <label>Gender</label>
            <select name="sex" value={form.sex} onChange={handleChange}>
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* MOBILE */}
          <div className="form-group full-width">
            <label>Mobile Number</label>
            <div className="mobile-input">
              <span>🇮🇳 +91</span>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                maxLength={10}
                placeholder="10 digit number"
                required
              />
            </div>
          </div>

          {/* ROLE */}
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="SECURITY">Security</option>
              <option value="HOUSEKEEPING">Housekeeping</option>
              <option value="CANTEEN">Canteen</option>
            </select>
          </div>

          {/* ACTIVE */}
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          {/* ACTIONS */}
          <div className="form-actions full-width">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin/users")}
            >
              Cancel
            </button>

            <button type="submit" className="btn-primary">
              Update User
            </button>
          </div>
        </form>
      </div>

      {/* ✅ SUCCESS MODAL */}
      {success && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>User Updated</h3>
            <p>User details updated successfully.</p>
            <button
              className="btn-confirm"
              onClick={() => navigate("/admin/users")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditUser;
