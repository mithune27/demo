const tabs = [
  "Daily Attendance",
  "Monthly Summary",
  "Attendance History",
  "Leave Details",
];

const ReportTabs = ({ active, setActive }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",   // ✅ center buttons horizontally
        gap: 12,
        marginBottom: 24,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          style={{
            width: "100%",          // ✅ same width
            maxWidth: 320,          // ✅ button size control
            padding: "12px 18px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: active === tab ? "#6d5dfc" : "#f3f4f6",
            color: active === tab ? "#fff" : "#111827",
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "center",    // ✅ center text
            transition: "all 0.2s ease",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ReportTabs;
