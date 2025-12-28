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

// Get today's multi-session attendance
export const getTodayAttendanceMulti = () => {
  return api.get("/attendance/api/multi/today/");
};

// Multi check-in
export const checkInMulti = () => {
  return api.post("/attendance/api/multi/check-in/");
};

// Multi check-out
export const checkOutMulti = () => {
  return api.post("/attendance/api/multi/check-out/");
};