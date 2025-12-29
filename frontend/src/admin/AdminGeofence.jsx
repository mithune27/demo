import { useEffect, useState } from "react";
import { getAdminLocationLogs } from "../api/location";
import "./admin.css";

const AdminGeofence = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [range, setRange] = useState("today");

  useEffect(() => {
    fetchLogs();
  }, [searchUser, range]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAdminLocationLogs({
        user: searchUser,
        range,
      });
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-geofence">
      <h2 className="page-title">📍 Staff Location Logs</h2>

      {/* 🔍 FILTER BAR */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search staff..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />

        <select
          className="range-select"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* 📊 TABLE */}
      {loading ? (
        <p className="muted-text">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="muted-text">No logs found</p>
      ) : (
        <div className="table-wrapper">
          <table className="clean-table">
            <thead>
              <tr>
                <th>User</th>
                <th>GPS</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td className="username">{log.username}</td>

                  <td>
                    <span
                      className={`badge ${
                        log.gps_enabled ? "badge-green" : "badge-red"
                      }`}
                    >
                      {log.gps_enabled ? "GPS ON" : "GPS OFF"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        log.inside_geofence
                          ? "badge-green"
                          : "badge-orange"
                      }`}
                    >
                      {log.inside_geofence ? "Inside" : "Outside"}
                    </span>
                  </td>

                  <td className="time">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminGeofence;
