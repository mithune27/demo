const LeaveStatus = () => {
  return (
    <>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        📄 Leave Status
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p>
          12 Jan → 14 Jan : <strong>Pending</strong>
        </p>

        <p>
          01 Jan → 02 Jan : <strong>Approved</strong>
        </p>
      </div>
    </>
  );
};

export default LeaveStatus;
