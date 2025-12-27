import { useEffect, useState } from "react";
import api from "../api/axios";

/* STATUS BADGE */
const statusStyle = (status) => {
  if (status === "PENDING") return { background: "#fef3c7", color: "#92400e" };
  if (status === "APPROVED") return { background: "#dcfce7", color: "#166534" };
  if (status === "REJECTED") return { background: "#fee2e2", color: "#991b1b" };
  return {};
};

/* FILTER BAR STYLES (MATCH USERS & ATTENDANCE) */
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

const selectStyle = { ...inputStyle };
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

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  const [userFilter, setUserFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadLeaves = () => {
    api.get("/leaves/admin/leaves/").then((res) => setLeaves(res.data));
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const reviewLeave = (id, action) => {
    api
      .post(`/leaves/admin/leaves/${id}/review/`, { action })
      .then(loadLeaves)
      .catch((err) =>
        alert(err.response?.data?.error || "Action failed")
      );
  };

  const exportExcel = () => {
    window.open(
      "http://127.0.0.1:8000/leaves/admin/leaves/export/",
      "_blank"
    );
  };

  const filteredLeaves = leaves.filter((l) => {
    const matchUser = userFilter
      ? l.user.toLowerCase().includes(userFilter.toLowerCase())
      : true;
    const matchStatus = statusFilter ? l.status === statusFilter : true;
    const matchFrom = fromDate ? l.start_date >= fromDate : true;
    const matchTo = toDate ? l.end_date <= toDate : true;
    return matchUser && matchStatus && matchFrom && matchTo;
  });

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Admin Leaves</h2>

      {/* FILTER BAR */}
      <div style={filterBarStyle}>
        <input
          type="text"
          placeholder="Search username..."
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          style={{ ...inputStyle, width: "220px" }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...selectStyle, width: "160px" }}
        >
          <option value="">All Status</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ ...inputStyle, width: "160px" }} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ ...inputStyle, width: "160px" }} />

        <div style={{ flex: 1 }} />

        <button onClick={exportExcel} style={buttonStyle}>
          Export to Excel
        </button>
      </div>

      {/* TABLE */}
      <table width="100%" style={{ borderCollapse: "collapse", background: "#fff" }}>
        <thead style={{ background: "#f1f5f9" }}>
          <tr>
            {["User", "Type", "From", "To", "Reason", "Status", "Action"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e5e7eb" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map((l) => (
            <tr key={l.id}>
              <td style={{ padding: 10 }}>{l.user}</td>
              <td style={{ padding: 10 }}>{l.leave_type}</td>
              <td style={{ padding: 10 }}>{l.start_date}</td>
              <td style={{ padding: 10 }}>{l.end_date}</td>
              <td style={{ padding: 10 }}>{l.reason}</td>
              <td style={{ padding: 10 }}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    ...statusStyle(l.status),
                  }}
                >
                  {l.status}
                </span>
              </td>
              <td style={{ padding: 10 }}>
                {l.status === "PENDING" ? (
                  <>
                    <button onClick={() => reviewLeave(l.id, "APPROVE")}>Approve</button>{" "}
                    <button onClick={() => reviewLeave(l.id, "REJECT")}>Reject</button>
                  </>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}

          {filteredLeaves.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: 16 }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLeaves;
