import { useEffect, useState } from "react";
import ReportTabs from "../components/ReportTabs";
import {
  getMultiDailyReport,
  getMonthlyReport,
  getLeaveReport,
  getAttendanceHistory,
} from "../api/reports";

const Reports = () => {
  const [active, setActive] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSession, setOpenSession] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!active) return;
    loadReport();
    // eslint-disable-next-line
  }, [active]);

  const loadReport = async () => {
    setLoading(true);
    try {
      let res;

      if (active === "Daily Attendance") {
        res = await getMultiDailyReport(today);
      } else if (active === "Monthly Summary") {
        const d = new Date();
        res = await getMonthlyReport(d.getFullYear(), d.getMonth() + 1);
      } else if (active === "Attendance History") {
        res = await getAttendanceHistory();
      } else if (active === "Leave Details") {
        res = await getLeaveReport();
      }

      setData(res?.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (hours) => {
    if (hours >= 7) return "FULL DAY";
    if (hours >= 4) return "HALF DAY";
    return "ABSENT";
  };

  return (
    <div className="page">
      <div className="card">
        <h2>📊 Reports</h2>

        {/* HOME: report list */}
        {active === "" && <ReportTabs setActive={setActive} />}

        {/* BACK BUTTON */}
        {active !== "" && (
          <button
            className="report-back-btn"
            onClick={() => {
              setActive("");
              setData([]);
              setOpenSession(null);
            }}
            style={{ marginBottom: 12 }}
          >
            ← Back
          </button>
        )}

        {loading && <p>Loading...</p>}

        {!loading && active !== "" && data.length === 0 && (
          <p>No data available</p>
        )}

        {/* DAILY ATTENDANCE */}
        {!loading && active === "Daily Attendance" && data.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Username</th>
                <th>Total Hours</th>
                <th>Status</th>
                <th>Sessions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const hours = Number(row.total_hours || 0);
                const status = getStatus(hours);

                const totalMinutes = Math.round(hours * 60);
                const h = Math.floor(totalMinutes / 60);
                const m = totalMinutes % 60;

                return (
                  <tr key={idx}>
                    <td>{row.date}</td>
                    <td>{row.username}</td>
                    <td>{`${h}h ${m}m`}</td>
                    <td>{status}</td>
                    <td>
                      <button
                        className="btn btn-link"
                        onClick={() =>
                          setOpenSession(openSession === idx ? null : idx)
                        }
                      >
                        {openSession === idx
                          ? "Hide"
                          : `View (${row.sessions?.length || 0})`}
                      </button>

                      {openSession === idx && (
                        <div
                          style={{
                            marginTop: 8,
                            padding: 8,
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            background: "#f9fafb",
                          }}
                        >
                          {row.sessions.length === 0 ? (
                            <p>No sessions</p>
                          ) : (
                            <ul>
                              {row.sessions.map((s, i) => (
                                <li key={i}>
                                  {new Date(s.check_in).toLocaleTimeString()} →{" "}
                                  {s.check_out
                                    ? new Date(s.check_out).toLocaleTimeString()
                                    : "—"}{" "}
                                  ({s.minutes} min)
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
