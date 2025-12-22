import api from "./axios";

export const applyLeave = (data) => {
  return api.post("leaves/apply/", data);
};

export const getLeaves = () => {
  return api.get("leaves/");
};
