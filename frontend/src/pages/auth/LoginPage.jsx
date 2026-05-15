/**
 * Login Page — Portal-locked, no demo credentials
 *
 *  5173 → Patient login only
 *  5151 → Doctor  login only
 *  5152 → Admin   login only
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiActivity, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getCurrentPortal, PORTAL_CONFIG } from '../../utils/portalConfig';
import toast from 'react-hot-toast';

// Colour maps keyed by portal colour
const BTN_COLOR = {
  blue:   'bg-blue-600   hover:bg-blue-700',
  green:  'bg-green-600  hover:bg-green-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
};
const BADGE_COLOR = {
  blue:   'bg-blue-100   text-blue-700',
  green:  'bg-green-100  text-green-700',
  purple: 'bg-purple-100 text-purple-700',
};
const LINK_COLOR = {
  blue:   'text-blue-600   hover:text-blue-700',
  green:  'text-green-600  hover:text-green-700',
  purple: 'text-purple-600 hover:text-purple-700',
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

      // Wrong role for this portal → block immediately
      if (user.role !== portal.role) {
        const correctLabel =
          Object.values(PORTAL_CONFIG).find(p => p.role === user.role)?.label || 'correct portal';
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

  const btnClass   = BTN_COLOR[portal.color]   || BTN_COLOR.blue;
  const badgeClass = BADGE_COLOR[portal.color] || BADGE_COLOR.blue;
  const linkClass  = LINK_COLOR[portal.color]  || LINK_COLOR.blue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Portal badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <span className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-full ${badgeClass}`}>
            {portal.emoji} {portal.label}
          </span>
        </motion.div>

        {/* Logo + heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-7"
        >
          <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
            <FiActivity size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          <p className="text-gray-500 mt-1 text-sm">Smart Hospital Management System</p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="Enter your email"
                  className="input-field pl-11" required autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} placeholder="Enter your password"
                  className="input-field pl-11 pr-11" required autoComplete="current-password"
                />
                <button
                  type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className={`w-full ${btnClass} text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                `Sign In as ${portal.role.charAt(0).toUpperCase() + portal.role.slice(1)}`
              )}
            </button>
          </form>

          {/* Register link — only for portals that allow self-registration */}
          {portal.canRegister && (
            <p className="text-center text-sm text-gray-500 mt-5">
              Don't have an account?{' '}
              <Link to="/register" className={`font-semibold hover:underline ${linkClass}`}>
                Create one
              </Link>
            </p>
          )}
        </motion.div>

        {/* Portal lock notice */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2"
        >
          <FiShield size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <span className="font-bold">Portal locked:</span> Only{' '}
            <span className="font-bold capitalize">{portal.role}s</span> can sign in here.
          </p>
        </motion.div>

        {/* Links to other portals */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-4 grid grid-cols-3 gap-2"
        >
          {Object.entries(PORTAL_CONFIG).map(([port, cfg]) => {
            const isCurrent = port === window.location.port;
            return (
              <a
                key={port}
                href={`${window.location.protocol}//${window.location.hostname}:${port}/login`}
                className={`text-center py-2.5 px-2 rounded-xl text-xs font-medium transition-colors border ${
                  isCurrent
                    ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-default pointer-events-none'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <div className="text-base mb-0.5">{cfg.emoji}</div>
                <div className="font-semibold">{cfg.label.split(' ')[0]}</div>
                <div className="text-gray-400">:{port}</div>
              </a>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default LoginPage;
