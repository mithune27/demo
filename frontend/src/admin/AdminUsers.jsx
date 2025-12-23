import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const loadUsers = async () => {
    const res = await api.get("/accounts/admin/users/");
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user) => {
    const confirm = window.confirm(
      `Are you sure you want to ${
        user.is_active ? "deactivate" : "activate"
      } ${user.username}?`
    );

    if (!confirm) return;

    await api.post(`/accounts/admin/users/${user.id}/toggle/`);
    loadUsers();
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
    <div>
      <h1>👥 Users Management</h1>

      {/* 🔍 SEARCH + FILTER */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          placeholder="Search username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="SECURITY">Security</option>
          <option value="HOUSEKEEPING">Housekeeping</option>
          <option value="CANTEEN">Canteen</option>
        </select>
      </div>

      {/* 📋 USERS TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                {u.is_active ? (
                  <span className="badge badge-success">Active</span>
                ) : (
                  <span className="badge badge-danger">Inactive</span>
                )}
              </td>
              <td>
                {!u.is_superuser && (
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => toggleStatus(u)}
                  >
                    Toggle
                  </button>
                )}
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const inputStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
};

export default AdminUsers;
