import api from "./axios";

export const getDailyReport = (date) =>
  api.get(`/attendance/reports/daily/?date=${date}`);

export const getMonthlyReport = (year, month) =>
  api.get(`/attendance/reports/monthly/?year=${year}&month=${month}`);

export const getLeaveReport = () =>
  api.get("/attendance/reports/leaves/");

export const getMultiDailyReport = (date) =>
  api.get("/attendance/api/multi/report/daily/", {
    params: { date },
  });

export const getAttendanceHistory = () =>
  api.get("/attendance/history/");
