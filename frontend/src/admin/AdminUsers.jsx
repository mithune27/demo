import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./adminUsers.css";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // TOGGLE
  const [confirmToggle, setConfirmToggle] = useState(null);

  // DELETE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUsername, setDeleteUsername] = useState("");

  // ================= LOAD USERS =================
  const loadUsers = async () => {
    try {
      const res = await api.get("/accounts/admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ================= TOGGLE =================
  const toggleStatus = async () => {
    if (!confirmToggle) return;

    const toastId = toast.loading("Updating user status...");

    try {
      await api.post(
        `/accounts/admin/users/${confirmToggle.id}/toggle/`
      );

      toast.update(toastId, {
        render: "User status updated",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setConfirmToggle(null);
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: "Failed to update user status",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // ================= DELETE =================
  const deleteUser = async () => {
    if (!deleteUserId) {
      toast.error("User ID missing");
      return;
    }

    const toastId = toast.loading("Deleting user...");

    try {
      await api.delete(
        `/accounts/admin/users/${deleteUserId}/delete/`
      );

      toast.update(toastId, {
        render: "User deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setShowDeleteModal(false);
      setDeleteUserId(null);
      setDeleteUsername("");

      loadUsers();
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render:
          err.response?.data?.error || "Delete failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // ================= FILTER =================
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
      {/* HEADER */}
      <div className="users-header">
        <h1>👥 Users Management</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/admin/users/create")}
        >
          + Create User
        </button>
      </div>

      {/* FILTERS */}
      <div className="users-filters">
        <input
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

      {/* TABLE */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th className="action-col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
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

              <td className="actions">
                {!u.is_superuser && (
                  <>
                    {/* TOGGLE */}
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={u.is_active}
                        onChange={() => setConfirmToggle(u)}
                      />
                      <span className="slider"></span>
                    </label>

                    {/* EDIT */}
                    <button
                      className="icon-btn"
                      onClick={() =>
                        navigate(`/admin/users/${u.id}/edit`)
                      }
                    >
                      ✏️
                    </button>

                    {/* DELETE */}
                    <button
                      className="icon-btn danger"
                      onClick={() => {
                        setDeleteUserId(u.id);
                        setDeleteUsername(u.username);
                        setShowDeleteModal(true);
                      }}
                    >
                      🗑️
                    </button>
                  </>
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

      {/* ================= TOGGLE MODAL ================= */}
      {confirmToggle && (
        <ConfirmModal
          title={
            confirmToggle.is_active
              ? "Deactivate User"
              : "Activate User"
          }
          message={`Are you sure you want to ${
            confirmToggle.is_active ? "deactivate" : "activate"
          } ${confirmToggle.username}?`}
          onCancel={() => setConfirmToggle(null)}
          onConfirm={toggleStatus}
        />
      )}

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <ConfirmModal
          danger
          title="Delete User"
          message={`This will permanently delete ${deleteUsername}.`}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={deleteUser}
        />
      )}
    </div>
  );
};

export default AdminUsers;

// ================= MODAL =================
const ConfirmModal = ({
  title,
  message,
  onCancel,
  onConfirm,
  danger,
}) => (
  <div className="modal-backdrop">
    <div className="modal">
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button
          className={danger ? "btn-danger" : "btn-confirm"}
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);
