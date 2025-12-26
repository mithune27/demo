import { useEffect, useState } from "react";
import ReportTabs from "../components/ReportTabs";
import { getDailyReport, getMonthlyReport, getLeaveReport } from "../api/reports";


const Reports = () => {
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
        res = await getDailyReport(today);
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
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>
                    {key.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>
                      {val === null ? "-" : String(val)}
                    </td>
                  ))}
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
