import api from "./axios";

export const loginUser = (data) => {
  return api.post("/accounts/api/login/", data);
};
