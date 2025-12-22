import api from "./axios";

export const applyLeave = (data) =>
  api.post("leaves/apply/", data);

export const getLeaves = () =>
  api.get("leaves/");
