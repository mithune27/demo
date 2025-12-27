import { useEffect, useState } from "react";
import ReportTabs from "../components/ReportTabs";
import {
  getDailyReport,
  getMonthlyReport,
  getLeaveReport,
  getAttendanceHistory,
} from "../api/reports";
import { toast } from "react-toastify";

/* =======================
   CUSTOM HEADERS PER REPORT
======================= */
const REPORT_HEADERS = {
  "Daily Attendance": ["date", "status", "check_in_time", "check_out_time"],
  "Monthly Summary": ["month", "present_days", "absent_days", "leave_days"],
  "Attendance History": ["date", "status", "check_in_time", "check_out_time"],
  "Leave Details": ["username", "from", "to", "status"],
};

/* =======================
   STATUS BADGE STYLE
======================= */
const statusClass = (status) => {
  if (["PRESENT", "APPROVED"].includes(status))
    return "badge badge-success";
  if (["ABSENT", "REJECTED"].includes(status))
    return "badge badge-danger";
  return "badge badge-warning";
};

const Reports = () => {
  const [active, setActive] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  /* =======================
     LOAD REPORT
  ======================= */
  useEffect(() => {
    if (!active) return;
    loadReport();
    // eslint-disable-next-line
  }, [active, selectedDate, month, year]);

  const loadReport = async () => {
    setLoading(true);
    setData([]);

    try {
      let res;

      if (active === "Daily Attendance") {
        res = await getDailyReport(selectedDate);
      } else if (active === "Monthly Summary") {
        res = await getMonthlyReport(year, month);
      } else if (active === "Attendance History") {
        res = await getAttendanceHistory();
      } else if (active === "Leave Details") {
        res = await getLeaveReport();
      }

      setData(res?.data || []);
      toast.success(`${active} loaded`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card dashboard-card" style={{ maxWidth: 900 }}>
        {/* ===== TITLE ===== */}
        <h2 className="text-center">📊 Reports</h2>

        {/* ===== TAB LIST ===== */}
        {active === "" && <ReportTabs setActive={setActive} />}

        {/* ===== BACK BUTTON ===== */}
        {active !== "" && (
          <div className="report-header-bar report-animate">
            <button
              className="report-back-btn"
              onClick={() => {
                setActive("");
                setData([]);
              }}
            >
              ← Back to Reports
            </button>
          </div>
        )}

        {/* ===== FILTERS ===== */}
        {active === "Daily Attendance" && (
          <div className="report-filters-wrapper report-animate">
            <div className="report-filters">
              <label>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="report-input"
              />
            </div>
          </div>
        )}

        {active === "Monthly Summary" && (
          <div className="report-filters-wrapper report-animate">
            <div className="report-filters">
              <select
                value={month}
                onChange={(e) => setMonth(+e.target.value)}
                className="report-select"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Month {i + 1}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={year}
                onChange={(e) => setYear(+e.target.value)}
                className="report-input"
                style={{ width: 120 }}
              />
            </div>
          </div>
        )}

        {/* ===== LOADING ===== */}
        {loading && (
          <p className="text-center text-muted report-animate">
            Loading report…
          </p>
        )}

        {/* ===== EMPTY ===== */}
        {!loading && active && data.length === 0 && (
          <p className="text-center text-muted report-animate">
            No data available
          </p>
        )}

        {/* ===== TABLE ===== */}
        {!loading && data.length > 0 && REPORT_HEADERS[active] && (
          <div key={active} className="report-animate">
            <table className="table report-table">
              <thead>
                <tr>
                  {REPORT_HEADERS[active].map((key) => (
                    <th key={key}>{key.replace(/_/g, " ")}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="fade-in-row">
                    {REPORT_HEADERS[active].map((key) => (
                      <td key={key}>
                        {key === "status" ? (
                          <span className={statusClass(row[key])}>
                            {row[key]}
                          </span>
                        ) : (
                          row[key] ?? "-"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
