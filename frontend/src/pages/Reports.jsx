import { useEffect, useState } from "react";
import ReportTabs from "../components/ReportTabs";
import { getDailyReport, getMonthlyReport, getLeaveReport, getMultiDailyReport } from "../api/reports";


const Reports = () => {
  const [openSession, setOpenSession] = useState(null);

  const [active, setActive] = useState("Daily Attendance");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadReport();
  }, [active]);

  const loadReport = async () => {
    setLoading(true);
    try {
      let res;

      if (active === "Daily Attendance") {
        res =await getMultiDailyReport(today);
        res = await getMultiDailyReport(today);
      }

      else if (active === "Monthly Summary") {
        const d = new Date();
        res = await getMonthlyReport(d.getFullYear(), d.getMonth() + 1);
      }

     

      else if (active === "Leave Details") {
        res = await getLeaveReport();
      }

      setData(res?.data || []);
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>📊 Reports</h2>

        <ReportTabs active={active} setActive={setActive} />

        {loading && <p>Loading...</p>}

        {!loading && data.length === 0 && (
          <p>No data available</p>
        )}

        {!loading && data.length > 0 && (
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
            {data.map((row, idx) => (
              <tr key={idx}>
                {/* DATE */}
                <td>{row.date}</td>

                {/* USER */}
                <td>{row.username}</td>

                {/* TOTAL HOURS */}
                <td>
                  {(() => {
                    const totalMinutes = Math.round((row.total_hours || 0) * 60);
                    const h = Math.floor(totalMinutes / 60);
                    const m = totalMinutes % 60;
                    return `${h}h ${m}m`;
                  })()}
                </td>

                {/* STATUS */}
                <td>{row.status}</td>

                {/* SESSIONS DROPDOWN */}
                <td>
                  <button
                    className="btn btn-link"
                    onClick={() => setOpenSession(openSession === idx ? null : idx)}
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
                      {(row.sessions || []).length === 0 ? (
                        <p style={{ margin: 0 }}>No sessions</p>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {(row.sessions || []).map((s, i) => (
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
            ))}
          </tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
