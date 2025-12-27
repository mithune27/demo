import { useEffect, useState } from "react";
import api from "../api/axios";

/* ======================
   STATUS BADGE STYLES
====================== */
const statusStyle = (status) => {
  if (status === "PRESENT") return { background: "#dcfce7", color: "#166534" };
  if (status === "ABSENT") return { background: "#fee2e2", color: "#991b1b" };
  if (status === "AUTO_CHECKOUT")
    return { background: "#ffedd5", color: "#9a3412" };
  return {};
};

/* ======================
   FILTER BAR STYLES
====================== */
const filterBarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "#ffffff",
  padding: "12px 16px",
  borderRadius: "10px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  marginBottom: "20px",
};

const inputStyle = {
  height: "40px",
  padding: "0 12px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  fontSize: "14px",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

const buttonStyle = {
  height: "40px",
  padding: "0 16px",
  borderRadius: "8px",
  border: "none",
  background: "#6366f1",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  useEffect(() => {
    api
      .get("/attendance/admin/attendance/")
      .then((res) => setAttendance(res.data))
      .catch((err) => console.error(err));
  }, []);

  const exportExcel = () => {
    window.open(
      "http://127.0.0.1:8000/attendance/admin/attendance/export/",
      "_blank"
    );
  };

  const filteredAttendance = attendance.filter((a) => {
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    const matchDate = dateFilter ? a.date === dateFilter : true;
    const matchUser = userFilter
      ? a.user.toLowerCase().includes(userFilter.toLowerCase())
      : true;

    return matchStatus && matchDate && matchUser;
  });

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Admin Attendance</h2>

      {/* ================= FILTER BAR (Users-style) ================= */}
      <div style={filterBarStyle}>
        {/* Search username */}
        <input
          type="text"
          placeholder="Search username..."
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          style={{ ...inputStyle, width: "220px" }}
        />

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...selectStyle, width: "160px" }}
        >
          <option value="">All Status</option>
          <option value="PRESENT">PRESENT</option>
          <option value="ABSENT">ABSENT</option>
          <option value="AUTO_CHECKOUT">AUTO_CHECKOUT</option>
        </select>

        {/* Date */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ ...inputStyle, width: "160px" }}
        />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Export */}
        <button onClick={exportExcel} style={buttonStyle}>
          Export to Excel
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div style={{ overflowX: "auto" }}>
        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              {["User", "Date", "Check In", "Check Out", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((a, i) => (
              <tr key={i}>
                <td style={{ padding: 10 }}>{a.user}</td>
                <td style={{ padding: 10 }}>{a.date}</td>
                <td style={{ padding: 10 }}>{a.check_in_time || "-"}</td>
                <td style={{ padding: 10 }}>{a.check_out_time || "-"}</td>
                <td style={{ padding: 10 }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      ...statusStyle(a.status),
                    }}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredAttendance.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: 16, textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendance;
  