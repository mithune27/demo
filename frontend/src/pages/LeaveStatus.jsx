import "./StaffLayout.css";

const LeaveStatus = () => {
  return (
    <div className="staff-layout">
      <div className="staff-container">
        <div className="staff-header">
          <h2>My Leaves</h2>
        </div>

        <div className="card">
          <p>12 Jan → 14 Jan : <strong>Pending</strong></p>
          <p>01 Jan → 02 Jan : <strong>Approved</strong></p>
        </div>
      </div>
    </div>
  );
};

export default LeaveStatus;
