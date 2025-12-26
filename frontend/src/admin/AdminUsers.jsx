import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./adminUsers.css";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // 🔔 Modal confirmation state
  const [confirmUser, setConfirmUser] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await api.get("/accounts/admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ Toggle Active / Inactive
  const toggleStatus = async () => {
    if (!confirmUser) return;

    try {
      await api.post(
        `/accounts/admin/users/${confirmUser.id}/toggle/`
      );
      setConfirmUser(null);
      loadUsers();
    } catch (err) {
      console.error("Failed to toggle status");
    }
  };

  // 🔍 FILTER LOGIC
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.username
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-users-page">
      {/* 🔹 HEADER + CREATE BUTTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 className="page-title">👥 Users Management</h1>

        <button
          onClick={() => navigate("/admin/users/create")}
          style={{
            padding: "10px 16px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Create User
        </button>
      </div>

      {/* 🔍 SEARCH + FILTER */}
      <div className="users-filters">
        <input
          type="text"
          placeholder="Search username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="SECURITY">Security</option>
          <option value="HOUSEKEEPING">Housekeeping</option>
          <option value="CANTEEN">Canteen</option>
        </select>
      </div>

      {/* 📋 USERS TABLE */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th className="action-col">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td className="username">{u.username}</td>
              <td>{u.role}</td>

              <td>
                <span
                  className={`status ${
                    u.is_active ? "active" : "inactive"
                  }`}
                >
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </td>

              <td style={{ display: "flex", gap: 12 }}>
                {/* ✏️ EDIT USER */}
                {!u.is_superuser && (
                  <button
                    onClick={() =>
                      navigate(`/admin/users/${u.id}/edit`)
                    }
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid #2563eb",
                      background: "white",
                      color: "#2563eb",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Edit
                  </button>
                )}

                {/* 🔁 TOGGLE STATUS */}
                {!u.is_superuser && (
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={u.is_active}
                      onChange={() => setConfirmUser(u)}
                    />
                    <span className="slider"></span>
                  </label>
                )}
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="4" className="no-data">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ CONFIRMATION MODAL */}
      {confirmUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>
              {confirmUser.is_active
                ? "Deactivate User"
                : "Activate User"}
            </h3>

            <p>
              Are you sure you want to{" "}
              <strong>
                {confirmUser.is_active
                  ? "deactivate"
                  : "activate"}
              </strong>{" "}
              <strong>{confirmUser.username}</strong>?
            </p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setConfirmUser(null)}
              >
                Cancel
              </button>

              <button
                className="btn-confirm"
                onClick={toggleStatus}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
