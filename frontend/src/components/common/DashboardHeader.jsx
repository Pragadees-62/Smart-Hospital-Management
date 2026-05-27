/** Dashboard Header — Login Lamp Theme */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const DashboardHeader = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const getProfilePath = () => user?.role === 'doctor' ? '/doctor/profile' : user?.role === 'admin' ? '/admin/dashboard' : '/patient/profile';

  return (
    <header style={{
      background: 'rgba(12,10,6,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(245,166,35,0.1)',
      padding: '12px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 30,
      boxShadow: '0 1px 20px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <button onClick={onMenuClick} className="lg:hidden"
          style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(245,240,232,0.5)', padding:6, borderRadius:10 }}>
          <FiMenu size={20}/>
        </button>
        <h1 style={{ fontSize:'1.05rem', fontWeight:800, color:'#f5f0e8', letterSpacing:'-0.02em' }} className="hidden sm:block">{title}</h1>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {/* Notifications */}
        <button onClick={() => navigate(user?.role === 'patient' ? '/patient/notifications' : '#')}
          style={{ position:'relative', background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.1)', borderRadius:12, padding:9, cursor:'pointer', color:'rgba(245,240,232,0.5)', display:'flex', transition:'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(245,166,35,0.12)'; e.currentTarget.style.color='#f5a623'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(245,166,35,0.06)'; e.currentTarget.style.color='rgba(245,240,232,0.5)'; }}>
          <FiBell size={17}/>
          <span style={{ position:'absolute', top:7, right:7, width:7, height:7, borderRadius:'50%', background:'#f5a623', border:'2px solid #0c0a06', boxShadow:'0 0 6px rgba(245,166,35,0.6)' }}/>
        </button>

        {/* User dropdown */}
        <div style={{ position:'relative' }} ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 12px 6px 6px', borderRadius:14, background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.1)', cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(245,166,35,0.1)'; e.currentTarget.style.borderColor='rgba(245,166,35,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(245,166,35,0.06)'; e.currentTarget.style.borderColor='rgba(245,166,35,0.1)'; }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#b8860b,#f5a623)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0c0a06', fontSize:'0.75rem', fontWeight:800, flexShrink:0, boxShadow:'0 0 10px rgba(245,166,35,0.3)' }}>
              {user?.avatar_url ? <img src={user.avatar_url} alt="" style={{ width:'100%', height:'100%', borderRadius:10, objectFit:'cover' }}/> : getInitials(user?.full_name)}
            </div>
            <span className="hidden sm:block" style={{ fontSize:'0.85rem', fontWeight:700, color:'#f5f0e8', maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.full_name}</span>
            <FiChevronDown size={13} style={{ color:'rgba(245,240,232,0.4)', transform: showDropdown ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}/>
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div initial={{ opacity:0, y:8, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8, scale:0.95 }} transition={{ duration:0.15 }}
                style={{ position:'absolute', right:0, top:'calc(100% + 8px)', width:220, background:'rgba(20,16,8,0.95)', backdropFilter:'blur(20px)', borderRadius:16, border:'1px solid rgba(245,166,35,0.15)', overflow:'hidden', zIndex:50, boxShadow:'0 20px 50px rgba(0,0,0,0.6)' }}>
                <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(245,166,35,0.08)', background:'rgba(245,166,35,0.04)' }}>
                  <p style={{ fontWeight:700, color:'#f5f0e8', fontSize:'0.875rem' }}>{user?.full_name}</p>
                  <p style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.4)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</p>
                </div>
                <div style={{ padding:6 }}>
                  {[
                    { icon:FiUser, label:'Profile', action:() => { navigate(getProfilePath()); setShowDropdown(false); }, color:'rgba(245,240,232,0.7)' },
                    { icon:FiLogOut, label:'Logout', action:handleLogout, color:'rgba(220,38,38,0.7)' },
                  ].map(({ icon:Icon, label, action, color }) => (
                    <button key={label} onClick={action}
                      style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, background:'none', border:'none', cursor:'pointer', color, fontWeight:600, fontSize:'0.85rem', fontFamily:'Inter,sans-serif', transition:'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(245,166,35,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='none'; }}>
                      <Icon size={15}/> {label}
                    </button>
                  ))}
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
