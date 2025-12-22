import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StaffDashboard from "./pages/StaffDashboard";
import Attendance from "./pages/Attendance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/attendance" element={<Attendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
