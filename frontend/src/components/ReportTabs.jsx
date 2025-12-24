const ReportTabs = ({ active, setActive }) => {
  const tabs = ["Daily", "Monthly", "Leaves", "Geofence", "GPS OFF"];

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`btn ${active === tab ? "btn-primary" : "btn-outline"}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ReportTabs;
