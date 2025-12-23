import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/Login";

// Staff
import StaffLayout from "./layouts/StaffLayout";
import StaffDashboard from "./pages/StaffDashboard";
import Attendance from "./pages/Attendance";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveStatus from "./pages/LeaveStatus";

// Admin
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------------------- */}
        {/* Login */}
        {/* -------------------- */}
        <Route path="/" element={<Login />} />

        {/* -------------------- */}
        {/* Staff Routes */}
        {/* -------------------- */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="leaves" element={<LeaveStatus />} />
        </Route>

        {/* -------------------- */}
        {/* Admin Routes (Protected) */}
        {/* -------------------- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />

            {/* Future admin pages */}
            {/* 
            <Route path="users" element={<AdminUsers />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="leaves" element={<AdminLeaves />} />
            <Route path="geofence" element={<AdminGeofence />} />
            <Route path="reports" element={<AdminReports />} />
            */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
