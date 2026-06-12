import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import RequestRide from "./pages/RequestRide.jsx";
import RiderDashboard from "./pages/RiderDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg text-text font-body">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request" element={<RequestRide />} />
          <Route path="/rider" element={<RiderDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
