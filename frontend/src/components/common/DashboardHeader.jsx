/**
 * Dashboard Header — Premium Redesign v2.0
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiMoon, FiSun, FiLogOut, FiUser, FiChevronDown, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/helpers';

const DashboardHeader = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const getProfilePath = () => {
    if (user?.role === 'doctor') return '/doctor/profile';
    if (user?.role === 'admin')  return '/admin/dashboard';
    return '/patient/profile';
  };

  const roleColors = {
    admin:   { bg: 'linear-gradient(135deg, #7c3aed, #a78bfa)', ring: 'rgba(139,92,246,0.3)' },
    doctor:  { bg: 'linear-gradient(135deg, #00d4b8, #0ea5e9)', ring: 'rgba(0,212,184,0.3)'  },
    patient: { bg: 'linear-gradient(135deg, #059669, #34d399)', ring: 'rgba(52,211,153,0.3)' },
  };
  const rc = roleColors[user?.role] || roleColors.patient;

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 lg:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30"
      style={{ boxShadow: '0 1px 20px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
          <FiMenu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-black text-gray-900 hidden sm:block tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
        </button>

        {/* Notifications */}
        <button onClick={() => navigate(user?.role === 'patient' ? '/patient/notifications' : '#')}
          className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <FiBell size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: '#ff6b6b' }} />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: rc.bg, boxShadow: `0 0 0 3px ${rc.ring}` }}>
              {user?.avatar_url
                ? <img src={user.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" />
                : getInitials(user?.full_name)
              }
            </div>
            <span className="hidden sm:block text-sm font-bold text-gray-800 max-w-[120px] truncate">
              {user?.full_name}
            </span>
            <FiChevronDown size={13} className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}>
                <div className="p-4 border-b border-gray-50" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}>
                  <p className="font-bold text-gray-900 text-sm">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button onClick={() => { navigate(getProfilePath()); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium">
                    <FiUser size={15} className="text-gray-400" /> Profile
                  </button>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
