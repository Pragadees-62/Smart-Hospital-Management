/**
 * Register Page — Premium Redesign v2.0
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiShield, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getCurrentPortal } from '../../utils/portalConfig';
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

const SPECIALIZATIONS = [
  'Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology',
  'Oncology','Gynecology','Ophthalmology','General Medicine','Surgery','Psychiatry','Radiology',
];

const RegisterPage = () => {
  const portal   = getCurrentPortal();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep]               = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm_password: '', phone: '',
    date_of_birth: '', gender: '', blood_group: '',
    specialization: '', experience_years: '', consultation_fee: '', license_number: '',
    admin_code: '',
  });

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleNext = (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm_password) { toast.error('Passwords do not match'); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ ...form, role: portal.role });
      toast.success('Account created successfully!');
      navigate(portal.dashboard, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const grad   = portalGrad[portal.color]   || portalGrad.blue;
  const accent = portalAccent[portal.color] || portalAccent.blue;

  const renderStep2 = () => {
    if (portal.role === 'patient') return (
      <>
        <h3 className="font-black text-gray-900 text-lg mb-5">Personal Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Date of Birth</label>
            <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={set} className="input-field" />
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
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>
        <div>
          <label className="input-label">Address (Optional)</label>
          <input type="text" name="address" onChange={set} placeholder="City, State" className="input-field" />
        </div>
      </>
    );

    if (portal.role === 'doctor') return (
      <>
        <h3 className="font-black text-gray-900 text-lg mb-5">Professional Details</h3>
        <div>
          <label className="input-label">Specialization *</label>
          <select name="specialization" value={form.specialization} onChange={set} className="input-field" required>
            <option value="">Select Specialization</option>
            {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="input-label">Medical License Number</label>
          <input type="text" name="license_number" value={form.license_number} onChange={set} placeholder="e.g. MCI-12345" className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Experience (Years)</label>
            <input type="number" name="experience_years" value={form.experience_years} onChange={set} placeholder="5" className="input-field" min="0" />
          </div>
          <div>
            <label className="input-label">Consultation Fee (₹)</label>
            <input type="number" name="consultation_fee" value={form.consultation_fee} onChange={set} placeholder="500" className="input-field" min="0" />
          </div>
        </div>
      </>
    );

    if (portal.role === 'admin') return (
      <>
        <h3 className="font-black text-gray-900 text-lg mb-5">Admin Details</h3>
        <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <div className="flex items-start gap-2.5">
            <FiShield size={15} className="text-violet-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-violet-700">Admin accounts have full system access. Ensure you are authorised to create this account.</p>
          </div>
        </div>
        <div>
          <label className="input-label">Admin Invite Code (Optional)</label>
          <input type="text" name="admin_code" value={form.admin_code} onChange={set} placeholder="Enter invite code if required" className="input-field" />
        </div>
      </>
    );
    return null;
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: grad }}>
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${accent}, transparent)` }} />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.3))` }}>
            <span className="text-white font-black text-xl">H</span>
          </div>
          <span className="text-white font-black text-2xl tracking-tight">SmartHospital</span>
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
            style={{ background: 'rgba(255,255,255,0.1)', color: accent, border: '1px solid rgba(255,255,255,0.15)' }}>
            {portal.emoji} {portal.label} — Register
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Join Smart<br />Healthcare Today
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Create your account and get access to world-class healthcare management tools.
          </p>
          <div className="mt-8 space-y-3">
            {['Free to get started', 'Secure & private', 'Instant access'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <FiCheck size={12} style={{ color: accent }} />
                </div>
                <span className="text-white/70 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/30 text-xs">© 2024 Smart Hospital Management System</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: grad }}>
              <span className="text-white font-black text-lg">H</span>
            </div>
            <span className="font-black text-xl text-gray-900">SmartHospital</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h1>
              <p className="text-gray-500 mt-1.5 text-sm">
                Registering as a <span className="font-bold capitalize" style={{ color: accent }}>{portal.role}</span>
              </p>
            </div>

            {/* Progress */}
            <div className="flex gap-3 mb-6">
              {[1, 2].map(s => (
                <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
                  <motion.div className="h-full rounded-full" style={{ background: grad }}
                    initial={{ width: s < step ? '100%' : s === step ? '50%' : '0%' }}
                    animate={{ width: s < step ? '100%' : s === step ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }} />
                </div>
              ))}
            </div>

            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              className="card p-8">
              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-4">
                  <h3 className="font-black text-gray-900 text-lg mb-5">Basic Information</h3>
                  <div>
                    <label className="input-label">Full Name *</label>
                    <div className="relative">
                      <FiUser size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="full_name" value={form.full_name} onChange={set}
                        placeholder="Your full name" className="input-field pl-11" required />
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Email Address *</label>
                    <div className="relative">
                      <FiMail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" name="email" value={form.email} onChange={set}
                        placeholder="you@example.com" className="input-field pl-11" required autoComplete="email" />
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Phone Number</label>
                    <div className="relative">
                      <FiPhone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" name="phone" value={form.phone} onChange={set}
                        placeholder="+91 98765 43210" className="input-field pl-11" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="input-label">Password *</label>
                      <div className="relative">
                        <FiLock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={set}
                          placeholder="Min 6 chars" className="input-field pl-11 pr-10" required minLength={6} autoComplete="new-password" />
                        <button type="button" onClick={() => setShowPassword(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Confirm *</label>
                      <div className="relative">
                        <FiLock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="password" name="confirm_password" value={form.confirm_password} onChange={set}
                          placeholder="Repeat" className="input-field pl-11" required autoComplete="new-password" />
                      </div>
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 mt-2"
                    style={{ background: grad, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                    Continue <FiArrowRight size={16} />
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderStep2()}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3.5">← Back</button>
                    <button type="submit" disabled={loading}
                      className="flex-1 py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ background: grad, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                      {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : 'Create Account'}
                    </button>
                  </div>
                </form>
              )}

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="font-bold hover:underline" style={{ color: accent }}>Sign in</Link>
              </p>
            </motion.div>

            <p className="text-center text-sm text-gray-400 mt-4">
              <Link to="/" className="hover:text-gray-600 transition-colors">← Back to Home</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
