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
export const getAdminLocationLogs = async ({ user = "", range = "" }) => {
  const params = new URLSearchParams();

  if (user) params.append("user", user);
  if (range) params.append("range", range);

  return await api.get(`locations/admin/logs/?${params.toString()}`);
};

export const getLocationStatus = async () => {
  return await api.get("locations/status/");
};
