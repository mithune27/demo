import { useEffect, useState } from "react";
import { sendLocationPing } from "../api/location";

const LiveLocationStatus = () => {
  const [status, setStatus] = useState("Checking...");
  const [error, setError] = useState("");

  const pingLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await sendLocationPing({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            is_enabled: true,
          });
          setStatus(
            res.data.inside_geofence ? "🟢 Inside Campus" : "🔴 Outside Campus"
          );
          setError("");
        } catch {
          setError("Location check failed");
        }
      },
      () => {
        setError("Location permission denied");
      }
    );
  };

  useEffect(() => {
    pingLocation();
    const interval = setInterval(pingLocation, 30000); // ⏱ every 30 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "10px",
        background: "#f4f4ff",
        textAlign: "center",
        marginBottom: "16px",
      }}
    >
      <strong>📍 Location Status</strong>
      <p style={{ marginTop: 8 }}>{status}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LiveLocationStatus;
