import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const raw = localStorage.getItem("user");

  if (!raw) {
    return <Navigate to="/" replace />;
  }

  let user;
  try {
    user = JSON.parse(raw);
  } catch {
    return <Navigate to="/" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
