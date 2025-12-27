import api from "./axios";

// Get today's attendance
export const getTodayAttendance = () => {
  return api.get("/attendance/my-attendance/");
};

// Check in
export const checkIn = () => {
  return api.post("/attendance/api/check-in/");
};

// Check out
export const checkOut = () => {
  return api.post("/attendance/api/check-out/");
};
export const downloadMonthlyReport = () =>
  api.get("attendance/export/monthly/", {
    responseType: "blob",
  });
 
export const getAttendanceHistory = () => {
  return api.get("/attendance/history/");
};

