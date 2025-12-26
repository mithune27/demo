import "./adminProfile.css";

const AdminProfile = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  return (
    <div className="admin-profile-wrapper">
      <div className="admin-profile-card">
        <h2>Admin Profile</h2>
        <p className="subtitle">System Administrator</p>

        <div className="profile-row">
          <span>Username</span>
          <strong>{auth?.username || "Admin"}</strong>
        </div>

        <div className="profile-row">
          <span>Email</span>
          <strong>{auth?.email || "Not available"}</strong>
        </div>

        <div className="profile-row">
          <span>Role</span>
          <strong>ADMIN</strong>
        </div>

        <div className="profile-row">
          <span>Status</span>
          <span className="status active">Active</span>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
