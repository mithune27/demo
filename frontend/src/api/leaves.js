import api from "./axios";

/* =========================
   APPLY LEAVE
========================= */
export const applyLeave = (data) =>
  api.post("/leaves/apply/", data);

/* =========================
   MY LEAVES
========================= */
export const getMyLeaves = () =>
  api.get("/leaves/my/");
