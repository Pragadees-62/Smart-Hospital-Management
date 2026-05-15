/**
 * Dashboard Sidebar Component
 * Shared across patient, doctor, and admin dashboards
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiCalendar, FiFileText, FiDollarSign, FiBell,
  FiUser, FiUsers, FiBarChart2, FiSettings, FiLogOut,
  FiClock, FiActivity, FiAlertCircle, FiGrid, FiX, FiFolder
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

// ─── Nav link definitions (module-level, never recreated) ───────────────────

const patientLinks = [
  { to: '/patient/dashboard',        icon: FiHome,       label: 'Dashboard' },
  { to: '/patient/appointments',     icon: FiCalendar,   label: 'Appointments' },
  { to: '/patient/book-appointment', icon: FiClock,      label: 'Book Appointment' },
  { to: '/patient/prescriptions',    icon: FiFileText,   label: 'Prescriptions' },
  { to: '/patient/reports',          icon: FiFolder,     label: 'Reports' },
  { to: '/patient/payments',         icon: FiDollarSign, label: 'Payments' },
  { to: '/patient/notifications',    icon: FiBell,       label: 'Notifications' },
  { to: '/patient/profile',          icon: FiUser,       label: 'Profile' },
];

const doctorLinks = [
  { to: '/doctor/dashboard',     icon: FiHome,       label: 'Dashboard' },
  { to: '/doctor/appointments',  icon: FiCalendar,   label: 'Appointments' },
  { to: '/doctor/patients',      icon: FiUsers,      label: 'My Patients' },
  { to: '/doctor/prescriptions', icon: FiFileText,   label: 'Prescriptions' },
  { to: '/doctor/availability',  icon: FiClock,      label: 'Availability' },
  { to: '/doctor/analytics',     icon: FiBarChart2,  label: 'Analytics' },
  { to: '/doctor/profile',       icon: FiUser,       label: 'Profile' },
];

const adminLinks = [
  { to: '/admin/dashboard',    icon: FiGrid,        label: 'Dashboard' },
  { to: '/admin/doctors',      icon: FiActivity,    label: 'Doctors' },
  { to: '/admin/patients',     icon: FiUsers,       label: 'Patients' },
  { to: '/admin/appointments', icon: FiCalendar,    label: 'Appointments' },
  { to: '/admin/departments',  icon: FiSettings,    label: 'Departments' },
  { to: '/admin/revenue',      icon: FiDollarSign,  label: 'Revenue' },
  { to: '/admin/emergency',    icon: FiAlertCircle, label: 'Emergency' },
  { to: '/admin/queue',        icon: FiClock,       label: 'Queue' },
];

// ─── SidebarContent — declared at module level so React never recreates it ──

const SidebarContent = ({ user, links, roleLabel, roleColor, onClose, onLogout }) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="flex items-center justify-between p-5 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">H</span>
        </div>
        <span className="font-bold text-lg text-gray-900">
          Smart<span className="text-blue-600">Hospital</span>
        </span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          aria-label="Close sidebar"
        >
          <FiX size={20} />
        </button>
      )}
    </div>

    {/* User Info */}
    <div className="p-4 mx-3 mt-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(user?.full_name)
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{user?.full_name}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColor}`}>
            {roleLabel}
          </span>
        </div>
      </div>
    </div>

    {/* Navigation Links */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scroll">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>

    {/* Logout */}
    <div className="p-3 border-t border-gray-100">
      <button
        onClick={onLogout}
        className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <FiLogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  </div>
);

// ─── Main Sidebar wrapper ────────────────────────────────────────────────────

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isDoctor, isAdmin } = useAuth();
  const navigate = useNavigate();

  const links     = isAdmin ? adminLinks  : isDoctor ? doctorLinks  : patientLinks;
  const roleLabel = isAdmin ? 'Administrator' : isDoctor ? 'Doctor' : 'Patient';
  const roleColor = isAdmin
    ? 'bg-purple-100 text-purple-700'
    : isDoctor
    ? 'bg-blue-100 text-blue-700'
    : 'bg-green-100 text-green-700';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const contentProps = { user, links, roleLabel, roleColor, onClose, onLogout: handleLogout };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 shadow-sm">
        <SidebarContent {...contentProps} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent {...contentProps} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
