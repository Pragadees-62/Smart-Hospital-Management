/**
 * Login Page — Premium Redesign v2.0
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiActivity, FiShield, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getCurrentPortal, PORTAL_CONFIG } from '../../utils/portalConfig';
import toast from 'react-hot-toast';

const portalGrad = {
  blue:   'linear-gradient(135deg, #0f2040, #1e3a8a)',
  green:  'linear-gradient(135deg, #065f46, #059669)',
  purple: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
};
const portalAccent = {
  blue:   '#00d4b8',
  green:  '#34d399',
  purple: '#a78bfa',
};
const portalBadge = {
  blue:   'bg-blue-50 text-blue-700 border border-blue-200',
  green:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  purple: 'bg-violet-50 text-violet-700 border border-violet-200',
};

const LoginPage = () => {
  const portal = getCurrentPortal();
  const [form, setForm]                 = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const { login, logout }               = useAuth();
  const navigate                        = useNavigate();
  const location                        = useLocation();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== portal.role) {
        const correctLabel = Object.values(PORTAL_CONFIG).find(p => p.role === user.role)?.label || 'correct portal';
        toast.error(`This is the ${portal.label}. Please use the ${correctLabel}.`);
        logout();
        setLoading(false);
        return;
      }
      toast.success('Welcome back!');
      const from = location.state?.from?.pathname;
      navigate(from && from !== '/login' ? from : portal.dashboard, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const grad   = portalGrad[portal.color]   || portalGrad.blue;
  const accent = portalAccent[portal.color] || portalAccent.blue;
  const badge  = portalBadge[portal.color]  || portalBadge.blue;

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: grad }}>
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${accent}, transparent)` }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.3))` }}>
            <span className="text-white font-black text-xl">H</span>
          </div>
          <span className="text-white font-black text-2xl tracking-tight">SmartHospital</span>
        </div>

        {/* Center content */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
            style={{ background: `rgba(255,255,255,0.1)`, color: accent, border: `1px solid rgba(255,255,255,0.15)` }}>
            {portal.emoji} {portal.label}
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Welcome back to<br />Smart Healthcare
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Manage appointments, track queues, and access health records — all in one place.
          </p>
          <div className="mt-10 space-y-4">
            {['Secure & encrypted data', 'Real-time queue tracking', 'AI-powered insights'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(255,255,255,0.15)` }}>
                  <span style={{ color: accent }} className="text-xs font-bold">✓</span>
                </div>
                <span className="text-white/70 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/30 text-xs">© 2024 Smart Hospital Management System</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: grad }}>
              <span className="text-white font-black text-lg">H</span>
            </div>
            <span className="font-black text-xl text-gray-900">SmartHospital</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8">
              <span className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-4 ${badge}`}>
                {portal.emoji} {portal.label}
              </span>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sign In</h1>
              <p className="text-gray-500 mt-1.5 text-sm">Enter your credentials to access your dashboard</p>
            </div>

            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="input-label">Email Address</label>
                  <div className="relative">
                    <FiMail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="you@example.com" className="input-field pl-11" required autoComplete="email" />
                  </div>
                </div>

                <div>
                  <label className="input-label">Password</label>
                  <div className="relative">
                    <FiLock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                      onChange={handleChange} placeholder="Enter your password"
                      className="input-field pl-11 pr-11" required autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: grad, boxShadow: `0 4px 20px rgba(0,0,0,0.2)` }}>
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                  ) : (
                    <>Sign In as {portal.role.charAt(0).toUpperCase() + portal.role.slice(1)} <FiArrowRight size={16} /></>
                  )}
                </button>
              </form>

              {portal.canRegister && (
                <p className="text-center text-sm text-gray-500 mt-5">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold hover:underline" style={{ color: accent }}>Create one</Link>
                </p>
              )}
            </div>

            {/* Portal lock */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
              <FiShield size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                <span className="font-bold">Portal locked:</span> Only <span className="font-bold capitalize">{portal.role}s</span> can sign in here.
              </p>
            </div>

            {/* Other portals */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Object.entries(PORTAL_CONFIG).map(([port, cfg]) => {
                const isCurrent = port === window.location.port;
                return (
                  <a key={port}
                    href={`${window.location.protocol}//${window.location.hostname}:${port}/login`}
                    className={`text-center py-3 px-2 rounded-2xl text-xs font-semibold transition-all border ${
                      isCurrent
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-default pointer-events-none'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600 hover:shadow-sm'
                    }`}>
                    <div className="text-lg mb-1">{cfg.emoji}</div>
                    <div className="font-bold">{cfg.label.split(' ')[0]}</div>
                    <div className="text-gray-400 text-[10px]">:{port}</div>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
