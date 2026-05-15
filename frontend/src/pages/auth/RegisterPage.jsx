/**
 * Register Page — Portal-locked
 *
 *  5173 (Patient Portal)  → Patient registration form only
 *  5151 (Doctor Portal)   → Doctor  registration form only
 *  5152 (Admin Portal)    → Admin   registration form only
 *
 * Role selector is hidden — role is determined by the portal port.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser, FiMail, FiLock, FiPhone,
  FiEye, FiEyeOff, FiActivity, FiShield
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getCurrentPortal } from '../../utils/portalConfig';
import toast from 'react-hot-toast';

// Colour maps
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
  blue:   'text-blue-600',
  green:  'text-green-600',
  purple: 'text-purple-600',
};
const PROGRESS_COLOR = {
  blue:   'bg-blue-600',
  green:  'bg-green-600',
  purple: 'bg-purple-600',
};

const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
  'Dermatology', 'Oncology', 'Gynecology', 'Ophthalmology',
  'General Medicine', 'Surgery', 'Psychiatry', 'Radiology',
];

const RegisterPage = () => {
  const portal   = getCurrentPortal();          // role locked to this portal
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep]               = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);

  // Base fields shared by all roles
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm_password: '', phone: '',
    // patient-specific
    date_of_birth: '', gender: '', blood_group: '',
    // doctor-specific
    specialization: '', experience_years: '', consultation_fee: '', license_number: '',
    // admin-specific
    admin_code: '',   // optional invite code
  });

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  // ── Step 1 validation ──────────────────────────────────────────────────────
  const handleNext = (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm_password) { toast.error('Passwords do not match'); return; }
    setStep(2);
  };

  // ── Final submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Always register with the portal's role — never let the user choose
      const payload = { ...form, role: portal.role };
      await register(payload);
      toast.success('Account created successfully!');
      navigate(portal.dashboard, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const btnClass    = BTN_COLOR[portal.color]    || BTN_COLOR.blue;
  const badgeClass  = BADGE_COLOR[portal.color]  || BADGE_COLOR.blue;
  const linkClass   = LINK_COLOR[portal.color]   || LINK_COLOR.blue;
  const progClass   = PROGRESS_COLOR[portal.color] || PROGRESS_COLOR.blue;

  // ── Step 2 form content differs per role ──────────────────────────────────
  const renderStep2 = () => {
    if (portal.role === 'patient') {
      return (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-5">Personal Details</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Date of Birth</label>
              <input type="date" name="date_of_birth" value={form.date_of_birth}
                onChange={set} className="input-field" />
            </div>
            <div>
              <label className="input-label">Gender</label>
              <select name="gender" value={form.gender} onChange={set} className="input-field">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Blood Group</label>
            <select name="blood_group" value={form.blood_group} onChange={set} className="input-field">
              <option value="">Select Blood Group</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Address (Optional)</label>
            <input type="text" name="address" onChange={set}
              placeholder="City, State" className="input-field" />
          </div>
        </>
      );
    }

    if (portal.role === 'doctor') {
      return (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-5">Professional Details</h2>

          <div>
            <label className="input-label">Specialization *</label>
            <select name="specialization" value={form.specialization} onChange={set}
              className="input-field" required>
              <option value="">Select Specialization</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="input-label">Medical License Number</label>
            <input type="text" name="license_number" value={form.license_number}
              onChange={set} placeholder="e.g. MCI-12345" className="input-field" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Experience (Years)</label>
              <input type="number" name="experience_years" value={form.experience_years}
                onChange={set} placeholder="5" className="input-field" min="0" />
            </div>
            <div>
              <label className="input-label">Consultation Fee (₹)</label>
              <input type="number" name="consultation_fee" value={form.consultation_fee}
                onChange={set} placeholder="500" className="input-field" min="0" />
            </div>
          </div>
        </>
      );
    }

    if (portal.role === 'admin') {
      return (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-5">Admin Details</h2>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-2">
            <div className="flex items-start gap-2">
              <FiShield size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-purple-700">
                Admin accounts have full system access. Ensure you are authorised to create this account.
              </p>
            </div>
          </div>

          <div>
            <label className="input-label">Admin Invite Code (Optional)</label>
            <input type="text" name="admin_code" value={form.admin_code}
              onChange={set} placeholder="Enter invite code if required"
              className="input-field" />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Portal badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <span className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-full ${badgeClass}`}>
            {portal.emoji} {portal.label} — Register
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
            <FiActivity size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Registering as a <span className="font-semibold capitalize">{portal.role}</span>
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-6 px-1">
          {[1, 2].map(s => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                s <= step ? progClass : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Form card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >

          {/* ── STEP 1: Basic info (same for all roles) ── */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Basic Information</h2>

              {/* Full Name */}
              <div>
                <label className="input-label">Full Name *</label>
                <div className="relative">
                  <FiUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="full_name" value={form.full_name} onChange={set}
                    placeholder="Your full name" className="input-field pl-11" required />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="input-label">Email Address *</label>
                <div className="relative">
                  <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" name="email" value={form.email} onChange={set}
                    placeholder="you@example.com" className="input-field pl-11"
                    required autoComplete="email" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="input-label">Phone Number</label>
                <div className="relative">
                  <FiPhone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" name="phone" value={form.phone} onChange={set}
                    placeholder="+91 98765 43210" className="input-field pl-11" />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Password *</label>
                  <div className="relative">
                    <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password" value={form.password} onChange={set}
                      placeholder="Min 6 chars" className="input-field pl-11 pr-10"
                      required minLength={6} autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="input-label">Confirm Password *</label>
                  <div className="relative">
                    <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" name="confirm_password" value={form.confirm_password}
                      onChange={set} placeholder="Repeat password"
                      className="input-field pl-11" required autoComplete="new-password" />
                  </div>
                </div>
              </div>

              <button type="submit" className={`${btnClass} text-white font-semibold w-full py-3 rounded-xl transition-colors mt-2`}>
                Continue →
              </button>
            </form>
          )}

          {/* ── STEP 2: Role-specific details ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderStep2()}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className={`${btnClass} text-white font-semibold flex-1 py-3 rounded-xl transition-colors disabled:opacity-60`}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          {/* Sign in link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className={`font-semibold hover:underline ${linkClass}`}>
              Sign in
            </Link>
          </p>
        </motion.div>

        <p className="text-center text-sm text-gray-400 mt-4">
          <Link to="/" className="hover:text-blue-600 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
