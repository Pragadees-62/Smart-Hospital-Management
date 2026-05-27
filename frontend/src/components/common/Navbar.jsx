/** Public Navbar — Login Lamp Theme */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { label:'Home',     href:'/'         },
    { label:'About',    href:'/about'    },
    { label:'Services', href:'/services' },
    { label:'Contact',  href:'/contact'  },
  ];
  const getDashboardPath = () => user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
  const isActive = (href) => location.pathname === href;

  const navStyle = {
    position:'fixed', top:0, left:0, right:0, zIndex:50,
    transition:'all 0.3s',
    background: scrolled ? 'rgba(12,10,6,0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(245,166,35,0.1)' : '1px solid transparent',
    boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:68 }}>
          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#b8860b,#f5a623)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:18, color:'#0c0a06', boxShadow:'0 0 16px rgba(245,166,35,0.4)', transition:'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>H</div>
            <span style={{ fontWeight:800, fontSize:'1.2rem', color:'#f5f0e8', letterSpacing:'-0.02em' }}>
              Smart<span style={{ color:'#f5a623' }}>Hospital</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex" style={{ alignItems:'center', gap:4 }}>
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} style={{
                padding:'8px 16px', borderRadius:12, fontWeight:600, fontSize:'0.875rem', textDecoration:'none', transition:'all 0.2s',
                background: isActive(link.href) ? 'rgba(245,166,35,0.1)' : 'transparent',
                color: isActive(link.href) ? '#f5a623' : 'rgba(245,240,232,0.65)',
                border: isActive(link.href) ? '1px solid rgba(245,166,35,0.2)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive(link.href)) { e.currentTarget.style.color='#f5f0e8'; e.currentTarget.style.background='rgba(245,166,35,0.06)'; }}}
              onMouseLeave={e => { if (!isActive(link.href)) { e.currentTarget.style.color='rgba(245,240,232,0.65)'; e.currentTarget.style.background='transparent'; }}}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex" style={{ alignItems:'center', gap:10 }}>
            {isAuthenticated ? (
              <button onClick={() => navigate(getDashboardPath())} className="btn-teal" style={{ fontSize:'0.875rem', padding:'9px 20px' }}>
                Dashboard <FiArrowRight size={14}/>
              </button>
            ) : (
              <>
                <Link to="/login" style={{ padding:'9px 20px', borderRadius:12, fontWeight:600, fontSize:'0.875rem', textDecoration:'none', color:'rgba(245,240,232,0.7)', border:'1px solid rgba(245,166,35,0.15)', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color='#f5f0e8'; e.currentTarget.style.borderColor='rgba(245,166,35,0.35)'; e.currentTarget.style.background='rgba(245,166,35,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='rgba(245,240,232,0.7)'; e.currentTarget.style.borderColor='rgba(245,166,35,0.15)'; e.currentTarget.style.background='transparent'; }}>
                  Login
                </Link>
                <Link to="/register" className="btn-teal" style={{ fontSize:'0.875rem', padding:'9px 20px', textDecoration:'none' }}>
                  Get Started <FiArrowRight size={14}/>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}
            style={{ background:'rgba(245,166,35,0.08)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:10, padding:8, cursor:'pointer', color:'rgba(245,240,232,0.7)' }}>
            {isOpen ? <FiX size={20}/> : <FiMenu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            style={{ background:'rgba(12,10,6,0.98)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(245,166,35,0.08)', padding:'16px', overflow:'hidden' }}
            className="md:hidden">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)}
                style={{ display:'block', padding:'12px 16px', borderRadius:12, color:'rgba(245,240,232,0.7)', fontWeight:600, textDecoration:'none', marginBottom:4, transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(245,166,35,0.08)'; e.currentTarget.style.color='#f5a623'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(245,240,232,0.7)'; }}>
                {link.label}
              </Link>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:12 }}>
              {isAuthenticated ? (
                <button onClick={() => { navigate(getDashboardPath()); setIsOpen(false); }} className="btn-teal" style={{ flex:1, padding:'12px', fontSize:'0.875rem' }}>Dashboard</button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary" onClick={() => setIsOpen(false)} style={{ flex:1, textAlign:'center', padding:'12px', fontSize:'0.875rem', textDecoration:'none' }}>Login</Link>
                  <Link to="/register" className="btn-teal" onClick={() => setIsOpen(false)} style={{ flex:1, textAlign:'center', padding:'12px', fontSize:'0.875rem', textDecoration:'none' }}>Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
