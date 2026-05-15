/**
 * AccessDenied Page
 * Shown when a user tries to access the wrong portal.
 * e.g. a doctor opening localhost:5173 (patient portal)
 */

import { motion } from 'framer-motion';
import { FiShield, FiArrowRight, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getPortalUrl, getCurrentPortal, PORTAL_CONFIG } from '../../utils/portalConfig';

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   btn: 'bg-blue-600 hover:bg-blue-700'   },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  btn: 'bg-green-600 hover:bg-green-700'  },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', btn: 'bg-purple-600 hover:bg-purple-700' },
};

const AccessDenied = ({ userRole }) => {
  const { logout } = useAuth();
  const currentPortal = getCurrentPortal();
  const correctPortal = getPortalUrl(userRole);
  const c = COLOR_MAP[currentPortal.color] || COLOR_MAP.blue;

  const goToCorrectPortal = () => {
    if (correctPortal) {
      window.location.href = correctPortal.url + correctPortal.dashboard;
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Find the correct portal config for the user's role
  const userPortalEntry = Object.values(PORTAL_CONFIG).find(p => p.role === userRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 max-w-md w-full text-center"
      >
        {/* Icon */}
        <div className={`w-20 h-20 ${c.bg} ${c.border} border-2 rounded-3xl flex items-center justify-center mx-auto mb-5`}>
          <FiShield size={36} className={c.text} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Wrong Portal</h1>
        <p className="text-gray-500 mb-6">
          You are logged in as a{' '}
          <span className="font-bold text-gray-800 capitalize">{userRole}</span>.
          This is the{' '}
          <span className={`font-bold ${c.text}`}>
            {currentPortal.emoji} {currentPortal.label}
          </span>
          {' '}which is only for{' '}
          <span className="font-bold text-gray-800 capitalize">{currentPortal.role}s</span>.
        </p>

        {/* Correct portal info */}
        {userPortalEntry && (
          <div className={`${c.bg} ${c.border} border rounded-2xl p-4 mb-6`}>
            <p className="text-sm text-gray-600 mb-1">Your portal is:</p>
            <p className={`text-lg font-bold ${c.text}`}>
              {userPortalEntry.emoji} {userPortalEntry.label}
            </p>
            {correctPortal && (
              <p className="text-sm text-gray-500 mt-1">
                {correctPortal.url}
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          {correctPortal && (
            <button
              onClick={goToCorrectPortal}
              className={`w-full ${c.btn} text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2`}
            >
              Go to My Portal <FiArrowRight size={16} />
            </button>
          )}

          {/* Links to all portals */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {Object.entries(PORTAL_CONFIG).map(([port, cfg]) => (
              <a
                key={port}
                href={`${window.location.protocol}//${window.location.hostname}:${port}/login`}
                className="text-xs py-2 px-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium transition-colors text-center"
              >
                {cfg.emoji}<br />{cfg.label.split(' ')[0]}<br />
                <span className="text-gray-400">:{port}</span>
              </a>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <FiLogOut size={15} /> Logout & Switch Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
