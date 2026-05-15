/**
 * Doctor Portal App — runs on localhost:5151
 * Only doctor routes are included. Patient/admin pages are never bundled.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PortalRoute from './components/common/PortalRoute';

import LoginPage           from './pages/auth/LoginPage';
import RegisterPage        from './pages/auth/RegisterPage';

import DoctorDashboard     from './pages/doctor/DoctorDashboard';
import DoctorAppointments  from './pages/doctor/DoctorAppointments';
import DoctorPatients      from './pages/doctor/DoctorPatients';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorAvailability  from './pages/doctor/DoctorAvailability';
import DoctorAnalytics     from './pages/doctor/DoctorAnalytics';
import DoctorProfile       from './pages/doctor/DoctorProfile';

const TOAST_OPTS = {
  duration: 3000,
  style: { borderRadius: '12px', fontWeight: '500', fontSize: '14px' },
  success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
  error:   { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
};

function AppDoctor() {
  return (
    <ThemeProvider>
      <AuthProvider portalRole="doctor">
        <Router>
          <Toaster position="top-right" toastOptions={TOAST_OPTS} />
          <Routes>
            {/* Public */}
            <Route path="/"         element={<Navigate to="/login" replace />} />
            <Route path="/login"    element={<LoginPage    portalRole="doctor" />} />
            <Route path="/register" element={<RegisterPage portalRole="doctor" />} />

            {/* Doctor-only protected routes */}
            <Route path="/doctor/dashboard"     element={<PortalRoute role="doctor"><DoctorDashboard     /></PortalRoute>} />
            <Route path="/doctor/appointments"  element={<PortalRoute role="doctor"><DoctorAppointments  /></PortalRoute>} />
            <Route path="/doctor/patients"      element={<PortalRoute role="doctor"><DoctorPatients      /></PortalRoute>} />
            <Route path="/doctor/prescriptions" element={<PortalRoute role="doctor"><DoctorPrescriptions /></PortalRoute>} />
            <Route path="/doctor/availability"  element={<PortalRoute role="doctor"><DoctorAvailability  /></PortalRoute>} />
            <Route path="/doctor/analytics"     element={<PortalRoute role="doctor"><DoctorAnalytics     /></PortalRoute>} />
            <Route path="/doctor/profile"       element={<PortalRoute role="doctor"><DoctorProfile       /></PortalRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppDoctor;
