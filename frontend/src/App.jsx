import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import StaffDashboard from "./pages/StaffDashboard";
import Attendance from "./pages/Attendance";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveStatus from "./pages/LeaveStatus";

import StaffLayout from "./layouts/StaffLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Staff routes with common layout */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="leaves" element={<LeaveStatus />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
