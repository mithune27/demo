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

