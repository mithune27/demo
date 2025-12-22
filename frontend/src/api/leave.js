import api from "./axios";

/**
 * Apply for leave
 */
export const applyLeave = (data) => {
  return api.post("leaves/apply/", data);
};

/**
 * Get logged-in user's leave history
 */
export const getMyLeaves = () => {
  return api.get("leaves/my/");
};
