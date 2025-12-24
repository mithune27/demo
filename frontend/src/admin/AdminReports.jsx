import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminReports = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("attendance/reports/daily/")
      .then((res) => setRecords(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading reports...</p>;
  }

  return (
    <div className="page-center">
      <div className="card" style={{ width: "100%", maxWidth: 900 }}>
        <h2 className="text-center">📊 Attendance Reports</h2>

        <table style={{ width: "100%", marginTop: 20 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Staff</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.username}</td>
                <td>{r.status}</td>
                <td>{r.check_in || "-"}</td>
                <td>{r.check_out || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
