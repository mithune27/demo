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
            <Route path="users" element={<AdminUsers />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
