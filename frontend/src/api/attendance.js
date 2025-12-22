import api from "./axios";

export const getTodayAttendance = () =>
  api.get("attendance/today/");

export const checkIn = () =>
  api.post("attendance/checkin/");

export const checkOut = () =>
  api.post("attendance/checkout/");
