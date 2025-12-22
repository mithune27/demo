import api from "../api/axios";

export const sendLocationPing = () => {
  if (!navigator.geolocation) {
    api.post("/locations/ping/", { is_enabled: false });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      api.post("/locations/ping/", {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        is_enabled: true,
      });
    },
    () => {
      api.post("/locations/ping/", { is_enabled: false });
    }
  );
};
