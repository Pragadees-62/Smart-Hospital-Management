/**
 * ProtectedRoute — Strict Portal Isolation
 *
 * Port 5173 → PATIENT only  (doctor/admin blocked)
 * Port 5151 → DOCTOR  only  (patient/admin blocked)
 * Port 5152 → ADMIN   only  (patient/doctor blocked)
 *
 * Wrong role → AccessDenied page (not a redirect, a hard block)
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from './LoadingSpinner';
import AccessDenied from '../../pages/auth/AccessDenied';
import { getCurrentPortal } from '../../utils/portalConfig';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  // ── 1. Not logged in → login page ────────────────────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── 2. Portal isolation check ─────────────────────────────────────────────
  // Each port only allows its designated role.
  const portal = getCurrentPortal();          // config for current port
  if (user.role !== portal.role) {
    // User is logged in but belongs to a different portal → show block page
    return <AccessDenied userRole={user.role} />;
  }

  // ── 3. Route-level role check (same portal, wrong route) ─────────────────
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={portal.dashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;
