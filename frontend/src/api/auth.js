import api from "./axios";

export const loginUser = (data) =>
  api.post("accounts/api/login/", data);
