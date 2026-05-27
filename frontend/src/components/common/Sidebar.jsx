/**
 * Dashboard Sidebar — Premium Redesign v2.0
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

const patientLinks = [
  { to: '/patient/dashboard',        icon: FiHome,       label: 'Dashboard'        },
  { to: '/patient/appointments',     icon: FiCalendar,   label: 'Appointments'     },
  { to: '/patient/book-appointment', icon: FiClock,      label: 'Book Appointment' },
  { to: '/patient/prescriptions',    icon: FiFileText,   label: 'Prescriptions'    },
  { to: '/patient/reports',          icon: FiFolder,     label: 'Reports'          },
  { to: '/patient/payments',         icon: FiDollarSign, label: 'Payments'         },
  { to: '/patient/notifications',    icon: FiBell,       label: 'Notifications'    },
  { to: '/patient/profile',          icon: FiUser,       label: 'Profile'          },
];

const doctorLinks = [
  { to: '/doctor/dashboard',     icon: FiHome,      label: 'Dashboard'    },
  { to: '/doctor/appointments',  icon: FiCalendar,  label: 'Appointments' },
  { to: '/doctor/patients',      icon: FiUsers,     label: 'My Patients'  },
  { to: '/doctor/prescriptions', icon: FiFileText,  label: 'Prescriptions'},
  { to: '/doctor/availability',  icon: FiClock,     label: 'Availability' },
  { to: '/doctor/analytics',     icon: FiBarChart2, label: 'Analytics'    },
  { to: '/doctor/profile',       icon: FiUser,      label: 'Profile'      },
];

const adminLinks = [
  { to: '/admin/dashboard',    icon: FiGrid,        label: 'Dashboard'   },
  { to: '/admin/doctors',      icon: FiActivity,    label: 'Doctors'     },
  { to: '/admin/patients',     icon: FiUsers,       label: 'Patients'    },
  { to: '/admin/appointments', icon: FiCalendar,    label: 'Appointments'},
  { to: '/admin/departments',  icon: FiSettings,    label: 'Departments' },
  { to: '/admin/revenue',      icon: FiDollarSign,  label: 'Revenue'     },
  { to: '/admin/emergency',    icon: FiAlertCircle, label: 'Emergency'   },
  { to: '/admin/queue',        icon: FiClock,       label: 'Queue'       },
];

const roleConfig = {
  admin:   { label: 'Administrator', badge: 'bg-violet-100 text-violet-700', dot: '#8b5cf6' },
  doctor:  { label: 'Doctor',        badge: 'bg-teal-100 text-teal-700',     dot: '#00d4b8' },
  patient: { label: 'Patient',       badge: 'bg-emerald-100 text-emerald-700', dot: '#34d399' },
};

const SidebarContent = ({ user, links, role, onClose, onLogout }) => {
  const cfg = roleConfig[role] || roleConfig.patient;

  return (
    <div className="flex flex-col h-full" style={{ background: '#ffffff' }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #00d4b8, #0ea5e9)' }}>
            <span className="text-white font-black text-base">H</span>
          </div>
          <span className="font-black text-lg tracking-tight text-gray-900">
            Smart<span style={{ color: '#00d4b8' }}>Hospital</span>
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Close sidebar">
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* User card */}
      <div className="mx-4 mt-4 mb-2 rounded-2xl p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2040, #162d58)' }}>
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
          style={{ background: 'radial-gradient(circle, #00d4b8, transparent)' }} />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #00d4b8, #0ea5e9)' }}>
            {user?.avatar_url
              ? <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-xl object-cover" />
              : getInitials(user?.full_name)
            }
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-sm truncate">{user?.full_name}</p>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto custom-scroll">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-semibold text-sm">
          <FiLogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isDoctor, isAdmin } = useAuth();
  const navigate = useNavigate();

  const links = isAdmin ? adminLinks : isDoctor ? doctorLinks : patientLinks;
  const role  = isAdmin ? 'admin'    : isDoctor ? 'doctor'    : 'patient';

  const handleLogout = () => { logout(); navigate('/login'); };
  const props = { user, links, role, onClose, onLogout: handleLogout };

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-gray-100 shadow-sm">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
            <motion.aside initial={{ x: -290 }} animate={{ x: 0 }} exit={{ x: -290 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden shadow-2xl">
              <SidebarContent {...props} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
