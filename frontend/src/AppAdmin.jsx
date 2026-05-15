/**
 * Admin Portal App — runs on localhost:5152
 * Only admin routes are included. Patient/doctor pages are never bundled.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PortalRoute from './components/common/PortalRoute';

import LoginPage          from './pages/auth/LoginPage';

import AdminDashboard     from './pages/admin/AdminDashboard';
import ManageDoctors      from './pages/admin/ManageDoctors';
import ManagePatients     from './pages/admin/ManagePatients';
import AdminAppointments  from './pages/admin/AdminAppointments';
import ManageDepartments  from './pages/admin/ManageDepartments';
import RevenueAnalytics   from './pages/admin/RevenueAnalytics';
import EmergencyMonitor   from './pages/admin/EmergencyMonitor';
import QueueManagement    from './pages/admin/QueueManagement';

const TOAST_OPTS = {
  duration: 3000,
  style: { borderRadius: '12px', fontWeight: '500', fontSize: '14px' },
  success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
  error:   { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
};

function AppAdmin() {
  return (
    <ThemeProvider>
      <AuthProvider portalRole="admin">
        <Router>
          <Toaster position="top-right" toastOptions={TOAST_OPTS} />
          <Routes>
            {/* Public */}
            <Route path="/"      element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage portalRole="admin" />} />

            {/* Admin-only protected routes */}
            <Route path="/admin/dashboard"    element={<PortalRoute role="admin"><AdminDashboard    /></PortalRoute>} />
            <Route path="/admin/doctors"      element={<PortalRoute role="admin"><ManageDoctors     /></PortalRoute>} />
            <Route path="/admin/patients"     element={<PortalRoute role="admin"><ManagePatients    /></PortalRoute>} />
            <Route path="/admin/appointments" element={<PortalRoute role="admin"><AdminAppointments /></PortalRoute>} />
            <Route path="/admin/departments"  element={<PortalRoute role="admin"><ManageDepartments /></PortalRoute>} />
            <Route path="/admin/revenue"      element={<PortalRoute role="admin"><RevenueAnalytics  /></PortalRoute>} />
            <Route path="/admin/emergency"    element={<PortalRoute role="admin"><EmergencyMonitor  /></PortalRoute>} />
            <Route path="/admin/queue"        element={<PortalRoute role="admin"><QueueManagement   /></PortalRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppAdmin;
