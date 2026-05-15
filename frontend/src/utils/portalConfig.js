/**
 * Portal Configuration — single source of truth
 *
 *  5173 → patient only
 *  5151 → doctor  only
 *  5152 → admin   only
 */

export const PORTAL_CONFIG = {
  '5173': {
    role:      'patient',
    label:     'Patient Portal',
    emoji:     '🏥',
    color:     'blue',
    dashboard: '/patient/dashboard',
    canRegister: true,          // patients can self-register
  },
  '5151': {
    role:      'doctor',
    label:     'Doctor Portal',
    emoji:     '👨‍⚕️',
    color:     'green',
    dashboard: '/doctor/dashboard',
    canRegister: true,          // doctors can self-register
  },
  '5152': {
    role:      'admin',
    label:     'Admin Portal',
    emoji:     '🔧',
    color:     'purple',
    dashboard: '/admin/dashboard',
    canRegister: true,          // admins can self-register (invite-only in prod)
  },
};

/** Config for the current browser port */
export const getCurrentPortal = () =>
  PORTAL_CONFIG[window.location.port] || PORTAL_CONFIG['5173'];

/** Portal URL for a given role */
export const getPortalUrl = (role) => {
  const entry = Object.entries(PORTAL_CONFIG).find(([, v]) => v.role === role);
  if (!entry) return null;
  const [port, cfg] = entry;
  return {
    url:       `${window.location.protocol}//${window.location.hostname}:${port}`,
    port,
    dashboard: cfg.dashboard,
  };
};
