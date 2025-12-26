const tabs = [
  "Daily Attendance",
  "Monthly Summary",
  "Attendance History",
  "Leave Details",
];

export default function ReportTabs({ active, setActive }) {
  return (
    <div style={styles.row}>
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          style={{
            ...styles.tab,
            background: active === t ? "#7044ff" : "#eee",
            color: active === t ? "white" : "black",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
    flexWrap: "wrap",
  },
  tab: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #ddd",
    cursor: "pointer",
    fontSize: 13,
  },
};

