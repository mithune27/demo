import { BrowserRouter, Routes, Route } from "react-router-dom";

// ====================
// AUTH
// ====================
import Login from "./pages/Login";

// ====================
// STAFF
// ====================
import StaffLayout from "./layouts/StaffLayout";
import StaffDashboard from "./pages/StaffDashboard";
import Attendance from "./pages/Attendance";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveStatus from "./pages/LeaveStatus";
import Reports from "./pages/Reports";

// ====================
// ADMIN
// ====================
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminReports from "./admin/AdminReports";
import AdminEditUser from "./admin/AdminEditUser";
import AdminAttendance from "./admin/AdminAttendance";
import AdminProfile from "./admin/AdminProfile";
import AdminGeofence from "./admin/AdminGeofence";
// ====================
// ADMIN CREATE USER
// ====================
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminLeaves from "./admin/AdminLeaves";


// ====================
// COMMON
// ====================
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== */}
        {/* AUTH */}
        {/* ==================== */}
        <Route path="/" element={<Login />} />

        {/* ==================== */}
        {/* STAFF ROUTES */}
        {/* ==================== */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="leaves" element={<LeaveStatus />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* ==================== */}
        {/* ADMIN ROUTES (PROTECTED) */}
        {/* ==================== */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            {/* USERS */}
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/create" element={<AdminCreateUser />} />
            <Route path="users/:id/edit" element={<AdminEditUser />} />

            {/* ATTENDANCE ✅ */}
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="leaves" element={<AdminLeaves />} />
            <Route path="geofence" element={<AdminGeofence />} />



            {/* REPORTS */}
            <Route path="reports" element={<AdminReports />} />

            {/* PROFILE */}
            <Route path="profile" element={<AdminProfile />} />
            <Route path="leaves" element={<AdminLeaves />} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
