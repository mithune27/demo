import api from "./axios";

export const sendLocationPing = async ({
  latitude,
  longitude,
  is_enabled = true,
}) => {
  return await api.post("locations/ping/", {
    latitude,
    longitude,
    is_enabled,
  });
};

export const getLocationStatus = async () => {
  return await api.get("locations/status/");
};
