/** Sidebar — Login Lamp Theme */
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome,FiCalendar,FiFileText,FiDollarSign,FiBell,FiUser,FiUsers,FiBarChart2,FiSettings,FiLogOut,FiClock,FiActivity,FiAlertCircle,FiGrid,FiX,FiFolder } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const patientLinks = [
  { to:'/patient/dashboard',        icon:FiHome,       label:'Dashboard'        },
  { to:'/patient/appointments',     icon:FiCalendar,   label:'Appointments'     },
  { to:'/patient/book-appointment', icon:FiClock,      label:'Book Appointment' },
  { to:'/patient/prescriptions',    icon:FiFileText,   label:'Prescriptions'    },
  { to:'/patient/reports',          icon:FiFolder,     label:'Reports'          },
  { to:'/patient/payments',         icon:FiDollarSign, label:'Payments'         },
  { to:'/patient/notifications',    icon:FiBell,       label:'Notifications'    },
  { to:'/patient/profile',          icon:FiUser,       label:'Profile'          },
];
const doctorLinks = [
  { to:'/doctor/dashboard',     icon:FiHome,      label:'Dashboard'    },
  { to:'/doctor/appointments',  icon:FiCalendar,  label:'Appointments' },
  { to:'/doctor/patients',      icon:FiUsers,     label:'My Patients'  },
  { to:'/doctor/prescriptions', icon:FiFileText,  label:'Prescriptions'},
  { to:'/doctor/availability',  icon:FiClock,     label:'Availability' },
  { to:'/doctor/analytics',     icon:FiBarChart2, label:'Analytics'    },
  { to:'/doctor/profile',       icon:FiUser,      label:'Profile'      },
];
const adminLinks = [
  { to:'/admin/dashboard',    icon:FiGrid,        label:'Dashboard'    },
  { to:'/admin/doctors',      icon:FiActivity,    label:'Doctors'      },
  { to:'/admin/patients',     icon:FiUsers,       label:'Patients'     },
  { to:'/admin/appointments', icon:FiCalendar,    label:'Appointments' },
  { to:'/admin/departments',  icon:FiSettings,    label:'Departments'  },
  { to:'/admin/revenue',      icon:FiDollarSign,  label:'Revenue'      },
  { to:'/admin/emergency',    icon:FiAlertCircle, label:'Emergency'    },
  { to:'/admin/queue',        icon:FiClock,       label:'Queue'        },
];

const SidebarContent = ({ user, links, role, onClose, onLogout }) => (
  <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#0c0a06', borderRight:'1px solid rgba(245,166,35,0.1)' }}>
    {/* Logo */}
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px', borderBottom:'1px solid rgba(245,166,35,0.08)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#b8860b,#f5a623)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#0c0a06', boxShadow:'0 0 16px rgba(245,166,35,0.35)' }}>H</div>
        <span style={{ fontWeight:800, fontSize:'1.1rem', color:'#f5f0e8', letterSpacing:'-0.02em' }}>
          Smart<span style={{ color:'#f5a623' }}>Hospital</span>
        </span>
      </div>
      {onClose && (
        <button onClick={onClose} className="lg:hidden" style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(245,240,232,0.4)', padding:4 }}>
          <FiX size={18}/>
        </button>
      )}
    </div>

    {/* User card */}
    <div style={{ margin:'12px', borderRadius:16, padding:'14px', background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.12)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, right:0, width:80, height:80, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,166,35,0.12),transparent)', transform:'translate(30%,-30%)', pointerEvents:'none' }}/>
      <div style={{ display:'flex', alignItems:'center', gap:10, position:'relative' }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#b8860b,#f5a623)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0c0a06', fontWeight:800, fontSize:'0.8rem', flexShrink:0, boxShadow:'0 0 12px rgba(245,166,35,0.3)' }}>
          {user?.avatar_url ? <img src={user.avatar_url} alt={user.full_name} style={{ width:'100%', height:'100%', borderRadius:12, objectFit:'cover' }}/> : getInitials(user?.full_name)}
        </div>
        <div style={{ minWidth:0 }}>
          <p style={{ fontWeight:700, color:'#f5f0e8', fontSize:'0.85rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.full_name}</p>
          <span style={{ fontSize:'0.68rem', fontWeight:600, color:'#f5a623', background:'rgba(245,166,35,0.12)', padding:'2px 8px', borderRadius:99, display:'inline-block', marginTop:2, textTransform:'capitalize' }}>{role}</span>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav style={{ flex:1, padding:'8px 10px', overflowY:'auto' }} className="custom-scroll">
      {links.map(({ to, icon:Icon, label }) => (
        <NavLink key={to} to={to} onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Icon size={16}/>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>

    {/* Logout */}
    <div style={{ padding:'10px', borderTop:'1px solid rgba(245,166,35,0.08)' }}>
      <button onClick={onLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:14, background:'none', border:'none', cursor:'pointer', color:'rgba(220,38,38,0.7)', fontWeight:600, fontSize:'0.875rem', transition:'all 0.2s', fontFamily:'Inter,sans-serif' }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(220,38,38,0.08)'; e.currentTarget.style.color='#fca5a5'; }}
        onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='rgba(220,38,38,0.7)'; }}>
        <FiLogOut size={16}/> Logout
      </button>
    </div>
  </div>
);

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isDoctor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : isDoctor ? doctorLinks : patientLinks;
  const role  = isAdmin ? 'admin'    : isDoctor ? 'doctor'    : 'patient';
  const handleLogout = () => { logout(); navigate('/login'); };
  const props = { user, links, role, onClose, onLogout: handleLogout };

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0">
        <SidebarContent {...props} />
      </aside>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', zIndex:40 }}
              className="lg:hidden" onClick={onClose}/>
            <motion.aside initial={{ x:-290 }} animate={{ x:0 }} exit={{ x:-290 }}
              transition={{ type:'spring', damping:28, stiffness:300 }}
              style={{ position:'fixed', left:0, top:0, bottom:0, width:280, zIndex:50 }}
              className="lg:hidden">
              <SidebarContent {...props}/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default Sidebar;
