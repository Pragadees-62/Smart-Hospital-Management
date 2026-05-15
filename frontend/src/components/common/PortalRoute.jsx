/**
 * PortalRoute
 * Simple role guard for portal-specific apps.
 * Each portal (patient/doctor/admin) only has its own routes,
 * so this just checks: logged in + correct role.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from './LoadingSpinner';

const PortalRoute = ({ role, children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== role) {
    // Wrong role for this portal — send back to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PortalRoute;
