const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>{title}</h3>
        <p style={{ marginTop: 8 }}>{message}</p>

        <div style={actions}>
          <button onClick={onCancel} style={cancelBtn}>
            Cancel
          </button>
          <button onClick={onConfirm} style={confirmBtn}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  borderRadius: 12,
  padding: 24,
  width: 360,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
  marginTop: 24,
};

const cancelBtn = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

const confirmBtn = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer",
};

export default ConfirmModal;
