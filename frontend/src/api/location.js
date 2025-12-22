import api from "./axios";

export const sendLocationPing = (lat, lon, isEnabled = true) =>
  api.post("locations/ping/", {
    latitude: lat,
    longitude: lon,
    is_enabled: isEnabled,
  });

export const getLocationStatus = () =>
  api.get("locations/status/");
