import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./adminCreateUser.css";

const AdminCreateUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    dob: "",
    sex: "",
    mobile: "",
    role: "SECURITY",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const [first_name = "", last_name = ""] = form.full_name.split(" ");

    const payload = {
      username: form.username,
      password: form.password,
      email: form.email,
      first_name,
      last_name,
      dob: form.dob,
      gender: form.gender,
      mobile: form.mobile,
      role: form.role,
    };

    try {
      await api.post("/accounts/admin/users/create/", payload);
      setSuccess(true); // ✅ show modal
    } catch (err) {
      alert("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessOk = () => {
    setSuccess(false);
    navigate("/admin/users"); // ✅ go back to users list
  };

  return (
    <div className="create-user-wrapper">
      <div className="create-user-card">
        <h2>Create Staff User</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              placeholder="Enter username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              name="full_name"
              placeholder="Enter full name"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              placeholder="example@gmail.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" onChange={handleChange}>
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <div className="mobile-input">
              <span>🇮🇳 +91</span>
              <input
                name="mobile"
                maxLength="10"
                value={form.mobile}
                onChange={handleChange}
                placeholder="10 digit number"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" onChange={handleChange}>
              <option value="SECURITY">Security</option>
              <option value="HOUSEKEEPING">Housekeeping</option>
              <option value="CANTEEN">Canteen</option>
            </select>
          </div>

          <div className="actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin/users")}
            >
              Cancel
            </button>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ SUCCESS MODAL */}
      {success && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>User Created</h3>
            <p>The staff user was created successfully.</p>

            <button className="btn-confirm" onClick={handleSuccessOk}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreateUser;
