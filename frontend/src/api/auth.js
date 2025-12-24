import api from "./axios";

export const loginUser = (data) =>
  api.post("accounts/api/login/", data);
export const getMyProfile = () =>
  api.get("accounts/api/me/");
