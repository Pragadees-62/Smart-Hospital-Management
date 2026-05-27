/**
 * Public Navbar — Premium Redesign v2.0
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home',     href: '/'        },
    { label: 'About',    href: '/about'   },
    { label: 'Services', href: '/services'},
    { label: 'Contact',  href: '/contact' },
  ];

  const getDashboardPath = () => {
    if (user?.role === 'admin')  return '/admin/dashboard';
    if (user?.role === 'doctor') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  const isActive = (href) => location.pathname === href;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100/80'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00d4b8, #0ea5e9)' }}>
              <span className="text-white font-black text-xl">H</span>
            </div>
            <span className={`font-black text-xl tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Smart<span style={{ color: '#00d4b8' }}>Hospital</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive(link.href)
                    ? scrolled ? 'bg-gray-100 text-gray-900' : 'bg-white/15 text-white'
                    : scrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all ${scrolled ? 'text-gray-500 hover:bg-gray-100' : 'text-white/70 hover:bg-white/10'}`}>
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            {isAuthenticated ? (
              <button onClick={() => navigate(getDashboardPath())} className="btn-teal text-sm px-5 py-2.5">
                Dashboard <FiArrowRight size={14} />
              </button>
            ) : (
              <>
                <Link to="/login"
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    scrolled ? 'text-gray-700 hover:bg-gray-100 border border-gray-200' : 'text-white border border-white/25 hover:bg-white/10'
                  }`}>
                  Login
                </Link>
                <Link to="/register" className="btn-teal text-sm px-5 py-2.5">
                  Get Started <FiArrowRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className={`md:hidden p-2.5 rounded-xl transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 px-4 py-5 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href}
                className="block px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:text-gray-900 transition-colors"
                onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex gap-3">
              {isAuthenticated ? (
                <button onClick={() => { navigate(getDashboardPath()); setIsOpen(false); }} className="btn-teal flex-1 py-3 text-sm">
                  Dashboard
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary flex-1 text-center py-3 text-sm" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-teal flex-1 text-center py-3 text-sm" onClick={() => setIsOpen(false)}>Register</Link>
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
