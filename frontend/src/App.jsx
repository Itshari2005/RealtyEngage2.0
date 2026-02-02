// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ProjectsAdmin from "./pages/admin/Projects";
import Customers from "./pages/admin/Customers";
import EnquiriesAdmin from "./pages/admin/Enquiries";
import PaymentsAdmin from "./pages/admin/Payments";
import SupportAdmin from "./pages/admin/Support";

// Customer Pages
import Home from "./pages/customer/Home";
import Projects from "./pages/customer/Projects";
import MyEnquiries from "./pages/customer/MyEnquiries";
import MyPayments from "./pages/customer/MyPayments";
import SupportForm from "./pages/customer/SupportForm";
import Enquery from "./pages/customer/Enquery";
import Profile from "./pages/customer/Profile";
import Maintenance from "./pages/customer/Maintenance";
import MaintenanceRequest from "./pages/customer/MaintenanceRequest";
import About from "./pages/customer/About";
import Contact from "./pages/customer/Contact";
import AdminMaintenance from "./pages/admin/Maintenance";
import Privacy from "./pages/customer/Privacy";
import Terms from "./pages/customer/Terms";
import Careers from "./pages/customer/Careers";
import ScheduleVisit from "./pages/customer/ScheduleVisit";
import Visits from "./pages/admin/Visits";
import MyVisits from "./pages/customer/MyVisits";


// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Route
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role && role !== userRole) return <Navigate to={`/${userRole}`} />;

  return children;
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="maintenance" element={<AdminMaintenance />} />
          <Route path="customers" element={<Customers />} />
          <Route path="enquiries" element={<EnquiriesAdmin />} />
          <Route path="payments" element={<PaymentsAdmin />} />
          <Route path="support" element={<SupportAdmin />} />
          <Route path="visits" element={<Visits />} />
        </Route>

        {/* Customer */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute role="customer">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          {/* default */}
          <Route index element={<Navigate to="home" />} />

          <Route path="home" element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="enquery" element={<Enquery />} />
          <Route path="enquiries" element={<MyEnquiries />} />
          <Route path="payments" element={<MyPayments />} />
          <Route path="support" element={<SupportForm />} />
          <Route path="profile" element={<Profile />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="my-visits" element={<MyVisits />} />
          <Route
            path="maintenance/request/:memberId"
            element={<MaintenanceRequest />}
          />
          <Route path="visit/:projectId" element={<ScheduleVisit />} />

          {/* Static pages */}
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="careers" element={<Careers />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
