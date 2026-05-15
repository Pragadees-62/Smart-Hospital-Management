/**
 * Patient Portal App — runs on localhost:5173
 * Only patient routes are included. Doctor/admin pages are never bundled.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PortalRoute from './components/common/PortalRoute';

import LandingPage      from './pages/public/LandingPage';
import LoginPage        from './pages/auth/LoginPage';
import RegisterPage     from './pages/auth/RegisterPage';

import PatientDashboard  from './pages/patient/PatientDashboard';
import BookAppointment   from './pages/patient/BookAppointment';
import MyAppointments    from './pages/patient/MyAppointments';
import Prescriptions     from './pages/patient/Prescriptions';
import Payments          from './pages/patient/Payments';
import Notifications     from './pages/patient/Notifications';
import PatientProfile    from './pages/patient/PatientProfile';
import Reports           from './pages/patient/Reports';

const TOAST_OPTS = {
  duration: 3000,
  style: { borderRadius: '12px', fontWeight: '500', fontSize: '14px' },
  success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
  error:   { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
};

function AppPatient() {
  return (
    <ThemeProvider>
      <AuthProvider portalRole="patient">
        <Router>
          <Toaster position="top-right" toastOptions={TOAST_OPTS} />
          <Routes>
            {/* Public */}
            <Route path="/"         element={<LandingPage />} />
            <Route path="/login"    element={<LoginPage    portalRole="patient" />} />
            <Route path="/register" element={<RegisterPage portalRole="patient" />} />

            {/* Patient-only protected routes */}
            <Route path="/patient/dashboard"        element={<PortalRoute role="patient"><PatientDashboard /></PortalRoute>} />
            <Route path="/patient/book-appointment" element={<PortalRoute role="patient"><BookAppointment  /></PortalRoute>} />
            <Route path="/patient/appointments"     element={<PortalRoute role="patient"><MyAppointments   /></PortalRoute>} />
            <Route path="/patient/prescriptions"    element={<PortalRoute role="patient"><Prescriptions    /></PortalRoute>} />
            <Route path="/patient/payments"         element={<PortalRoute role="patient"><Payments         /></PortalRoute>} />
            <Route path="/patient/notifications"    element={<PortalRoute role="patient"><Notifications    /></PortalRoute>} />
            <Route path="/patient/reports"          element={<PortalRoute role="patient"><Reports          /></PortalRoute>} />
            <Route path="/patient/profile"          element={<PortalRoute role="patient"><PatientProfile   /></PortalRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppPatient;
