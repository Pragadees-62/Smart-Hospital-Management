/** Register Page — Login Lamp Theme */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser,FiMail,FiLock,FiPhone,FiEye,FiEyeOff,FiShield,FiArrowRight,FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getCurrentPortal } from '../../utils/portalConfig';
import toast from 'react-hot-toast';

const SPECIALIZATIONS = ['Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology','Oncology','Gynecology','Ophthalmology','General Medicine','Surgery','Psychiatry','Radiology'];
const G = '#f5a623';
const GOLD = 'linear-gradient(135deg,#b8860b,#f5a623)';
const card = { background:'rgba(20,16,8,0.8)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:20 };

const LampInput = ({ name, type, placeholder, icon:Icon, value, onChange, rightEl, required, min }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:'relative', borderRadius:12, border:`1.5px solid ${focused ? 'rgba(245,166,35,0.55)' : 'rgba(245,166,35,0.12)'}`, background: focused ? 'rgba(245,166,35,0.05)' : 'rgba(245,240,232,0.03)', boxShadow: focused ? '0 0 0 3px rgba(245,166,35,0.1)' : 'none', transition:'all 0.2s' }}>
      <Icon size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color: focused ? G : 'rgba(245,240,232,0.22)', transition:'color 0.2s', pointerEvents:'none' }}/>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} min={min}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width:'100%', padding:'12px 40px 12px 38px', background:'transparent', border:'none', outline:'none', color:'#f5f0e8', fontSize:'0.875rem', fontFamily:'Inter,sans-serif' }}/>
      {rightEl && <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)' }}>{rightEl}</div>}
    </div>
  );
};

export default function RegisterPage() {
  const portal   = getCurrentPortal();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep]               = useState(1);
  const [showPw, setShowPw]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [form, setForm] = useState({ full_name:'',email:'',password:'',confirm_password:'',phone:'',date_of_birth:'',gender:'',blood_group:'',specialization:'',experience_years:'',consultation_fee:'',license_number:'',admin_code:'' });
  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleNext = e => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm_password) { toast.error('Passwords do not match'); return; }
    setStep(2);
  };
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await register({ ...form, role: portal.role }); toast.success('Account created!'); navigate(portal.dashboard, { replace:true }); }
    catch (err) { toast.error(err.response?.data?.message || err.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width:'100%', padding:'12px 14px', background:'rgba(245,240,232,0.03)', border:'1.5px solid rgba(245,166,35,0.12)', borderRadius:12, color:'#f5f0e8', fontSize:'0.875rem', fontFamily:'Inter,sans-serif', outline:'none', transition:'all 0.2s' };
  const labelStyle = { display:'block', fontSize:'0.7rem', fontWeight:700, color:'rgba(245,240,232,0.4)', marginBottom:6, letterSpacing:'0.06em', textTransform:'uppercase' };

  const renderStep2 = () => {
    if (portal.role === 'patient') return (
      <>
        <h3 style={{ fontWeight:800, color:'#f5f0e8', fontSize:'1.05rem', marginBottom:20 }}>Personal Details</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div><label style={labelStyle}>Date of Birth</label><input type="date" name="date_of_birth" value={form.date_of_birth} onChange={set} style={inputStyle} onFocus={e => { e.target.style.borderColor='rgba(245,166,35,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(245,166,35,0.1)'; }} onBlur={e => { e.target.style.borderColor='rgba(245,166,35,0.12)'; e.target.style.boxShadow='none'; }}/></div>
          <div><label style={labelStyle}>Gender</label><select name="gender" value={form.gender} onChange={set} style={{ ...inputStyle, appearance:'none' }} onFocus={e => { e.target.style.borderColor='rgba(245,166,35,0.5)'; }} onBlur={e => { e.target.style.borderColor='rgba(245,166,35,0.12)'; }}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
        </div>
        <div><label style={labelStyle}>Blood Group</label><select name="blood_group" value={form.blood_group} onChange={set} style={{ ...inputStyle, appearance:'none' }} onFocus={e => { e.target.style.borderColor='rgba(245,166,35,0.5)'; }} onBlur={e => { e.target.style.borderColor='rgba(245,166,35,0.12)'; }}><option value="">Select Blood Group</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}</select></div>
        <div><label style={labelStyle}>Address (Optional)</label><input type="text" name="address" onChange={set} placeholder="City, State" style={inputStyle} onFocus={e => { e.target.style.borderColor='rgba(245,166,35,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(245,166,35,0.1)'; }} onBlur={e => { e.target.style.borderColor='rgba(245,166,35,0.12)'; e.target.style.boxShadow='none'; }}/></div>
      </>
    );
    if (portal.role === 'doctor') return (
      <>
        <h3 style={{ fontWeight:800, color:'#f5f0e8', fontSize:'1.05rem', marginBottom:20 }}>Professional Details</h3>
        <div><label style={labelStyle}>Specialization *</label><select name="specialization" value={form.specialization} onChange={set} style={{ ...inputStyle, appearance:'none' }} required onFocus={e => { e.target.style.borderColor='rgba(245,166,35,0.5)'; }} onBlur={e => { e.target.style.borderColor='rgba(245,166,35,0.12)'; }}><option value="">Select Specialization</option>{SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        <div><label style={labelStyle}>Medical License Number</label><input type="text" name="license_number" value={form.license_number} onChange={set} placeholder="e.g. MCI-12345" style={inputStyle} onFocus={e => { e.target.style.borderColor='rgba(245,166,35,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(245,166,35,0.1)'; }} onBlur={e => { e.target.style.borderColor='rgba(245,166,35,0.12)'; e.target.style.boxShadow='none'; }}/></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div><label style={labelStyle}>Experience (Years)</label><input type="number" name="experience_years" value={form.experience_years} onChange={set} placeholder="5" min="0" style={inputStyle} onFocus={e => { e.target.style.borderColor='rgba(245,166,35,0.5)'; }} onBlur={e => { e.target.style.borderColor='rgba(245,166,35,0.12)'; }}/></div>
          <div><label style={labelStyle}>Consultation Fee (₹)</label><input type="number" name="consultation_fee" value={form.consultation_fee} onChange={set} placeholder="500" min="0" style={inputStyle} onFocus={e => { e.target.style.borderColor='rgba(245,166,35,0.5)'; }} onBlur={e => { e.target.style.borderColor='rgba(245,166,35,0.12)'; }}/></div>
        </div>
      </>
    );
    return (
      <>
        <h3 style={{ fontWeight:800, color:'#f5f0e8', fontSize:'1.05rem', marginBottom:20 }}>Admin Details</h3>
        <div style={{ background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:14, padding:'14px', marginBottom:16, display:'flex', alignItems:'flex-start', gap:10 }}>
          <FiShield size={14} style={{ color:G, flexShrink:0, marginTop:1 }}/>
          <p style={{ fontSize:'0.8rem', color:'rgba(245,240,232,0.55)', lineHeight:1.5 }}>Admin accounts have full system access. Ensure you are authorised to create this account.</p>
        </div>
        <div><label style={labelStyle}>Admin Invite Code (Optional)</label><input type="text" name="admin_code" value={form.admin_code} onChange={set} placeholder="Enter invite code if required" style={inputStyle} onFocus={e => { e.target.style.borderColor='rgba(245,166,35,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(245,166,35,0.1)'; }} onBlur={e => { e.target.style.borderColor='rgba(245,166,35,0.12)'; e.target.style.boxShadow='none'; }}/></div>
      </>
    );
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'#0c0a06', fontFamily:'Inter,sans-serif', overflow:'hidden' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input::placeholder,select::placeholder{color:rgba(245,240,232,0.25)} select option{background:#1e1a0e;color:#f5f0e8}`}</style>

      {/* Left panel */}
      <div className="hidden lg:flex" style={{ width:'42%', flexDirection:'column', justifyContent:'space-between', padding:48, position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#0c0a06,#16120a,#1e1a0e)' }}>
        <div style={{ position:'absolute', top:'-20%', left:'-20%', width:'70%', height:'70%', borderRadius:'50%', background:'radial-gradient(circle,rgba(245,166,35,0.12),transparent)', animation:'orb1 9s ease-in-out infinite alternate', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle,rgba(184,134,11,0.08),transparent)', animation:'orb2 11s ease-in-out infinite alternate', pointerEvents:'none' }}/>
        <style>{`@keyframes orb1{from{transform:translate(0,0) scale(1)}to{transform:translate(8%,6%) scale(1.15)}} @keyframes orb2{from{transform:translate(0,0) scale(1)}to{transform:translate(-6%,-8%) scale(1.1)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative', zIndex:2 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:GOLD, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:18, color:'#0c0a06', boxShadow:'0 0 20px rgba(245,166,35,0.4)' }}>H</div>
          <span style={{ fontWeight:800, fontSize:'1.2rem', color:'#f5f0e8' }}>Smart<span style={{ color:G }}>Hospital</span></span>
        </div>
        <div style={{ position:'relative', zIndex:2 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:99, background:'rgba(245,166,35,0.1)', border:'1px solid rgba(245,166,35,0.2)', color:G, fontSize:'0.78rem', fontWeight:600, marginBottom:20 }}>
            {portal.emoji} {portal.label} — Register
          </div>
          <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:900, color:'#f5f0e8', lineHeight:1.1, letterSpacing:'-0.03em', marginBottom:16 }}>
            Join Smart<br/><span style={{ background:'linear-gradient(135deg,#f5c842,#f5a623)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Healthcare Today</span>
          </h2>
          <p style={{ color:'rgba(245,240,232,0.45)', fontSize:'0.95rem', lineHeight:1.7, marginBottom:32 }}>Create your account and get access to world-class healthcare management tools.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {['Free to get started','Secure & private','Instant access'].map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(245,166,35,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <FiCheck size={11} style={{ color:G }}/>
                </div>
                <span style={{ color:'rgba(245,240,232,0.55)', fontSize:'0.875rem', fontWeight:500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ position:'relative', zIndex:2, fontSize:'0.7rem', color:'rgba(245,240,232,0.2)' }}>© 2024 Smart Hospital Management System</p>
      </div>

      {/* Right form panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 24px', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:460, paddingTop:16, paddingBottom:32 }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32, justifyContent:'center' }}>
            <div style={{ width:38, height:38, borderRadius:10, background:GOLD, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#0c0a06' }}>H</div>
            <span style={{ fontWeight:800, fontSize:'1.1rem', color:'#f5f0e8' }}>Smart<span style={{ color:G }}>Hospital</span></span>
          </div>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <div style={{ marginBottom:24 }}>
              <h1 style={{ fontSize:'1.75rem', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.03em', marginBottom:6 }}>Create Account</h1>
              <p style={{ fontSize:'0.875rem', color:'rgba(245,240,232,0.4)' }}>
                Registering as a <span style={{ color:G, fontWeight:700, textTransform:'capitalize' }}>{portal.role}</span>
              </p>
            </div>

            {/* Progress */}
            <div style={{ display:'flex', gap:10, marginBottom:24 }}>
              {[1,2].map(s => (
                <div key={s} style={{ flex:1, height:4, borderRadius:99, background:'rgba(245,166,35,0.1)', overflow:'hidden' }}>
                  <motion.div style={{ height:'100%', borderRadius:99, background:GOLD }}
                    initial={{ width: s < step ? '100%' : s === step ? '50%' : '0%' }}
                    animate={{ width: s < step ? '100%' : s === step ? '100%' : '0%' }}
                    transition={{ duration:0.4 }}/>
                </div>
              ))}
            </div>

            <motion.div key={step} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.3 }}
              style={{ ...card, padding:28 }}>
              {step === 1 && (
                <form onSubmit={handleNext} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <h3 style={{ fontWeight:800, color:'#f5f0e8', fontSize:'1.05rem', marginBottom:4 }}>Basic Information</h3>
                  <div><label style={labelStyle}>Full Name *</label><LampInput name="full_name" type="text" placeholder="Your full name" icon={FiUser} value={form.full_name} onChange={set} required/></div>
                  <div><label style={labelStyle}>Email Address *</label><LampInput name="email" type="email" placeholder="you@example.com" icon={FiMail} value={form.email} onChange={set} required/></div>
                  <div><label style={labelStyle}>Phone Number</label><LampInput name="phone" type="tel" placeholder="+91 98765 43210" icon={FiPhone} value={form.phone} onChange={set}/></div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div><label style={labelStyle}>Password *</label><LampInput name="password" type={showPw ? 'text' : 'password'} placeholder="Min 6 chars" icon={FiLock} value={form.password} onChange={set} required rightEl={<button type="button" onClick={() => setShowPw(p => !p)} style={{ background:'none', border:'none', cursor:'pointer', color: showPw ? G : 'rgba(245,240,232,0.25)', display:'flex', padding:2 }}>{showPw ? <FiEyeOff size={14}/> : <FiEye size={14}/>}</button>}/></div>
                    <div><label style={labelStyle}>Confirm *</label><LampInput name="confirm_password" type="password" placeholder="Repeat" icon={FiLock} value={form.confirm_password} onChange={set} required/></div>
                  </div>
                  <button type="submit" style={{ width:'100%', padding:'13px', borderRadius:14, border:'none', background:GOLD, color:'#0c0a06', fontSize:'0.95rem', fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 20px rgba(245,166,35,0.35)', transition:'all 0.25s', marginTop:4, fontFamily:'Inter,sans-serif' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(245,166,35,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(245,166,35,0.35)'; }}>
                    Continue <FiArrowRight size={16}/>
                  </button>
                </form>
              )}
              {step === 2 && (
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {renderStep2()}
                  <div style={{ display:'flex', gap:12, paddingTop:8 }}>
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ flex:1, padding:'13px', fontSize:'0.9rem' }}>← Back</button>
                    <button type="submit" disabled={loading} style={{ flex:1, padding:'13px', borderRadius:14, border:'none', background:GOLD, color:'#0c0a06', fontSize:'0.9rem', fontWeight:800, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity: loading ? 0.7 : 1, fontFamily:'Inter,sans-serif', transition:'all 0.25s' }}>
                      {loading ? <><span style={{ width:16, height:16, border:'2px solid rgba(0,0,0,0.2)', borderTopColor:'#0c0a06', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }}/> Creating…</> : 'Create Account'}
                    </button>
                  </div>
                </form>
              )}
              <p style={{ textAlign:'center', fontSize:'0.825rem', color:'rgba(245,240,232,0.3)', marginTop:20 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color:G, fontWeight:700, textDecoration:'none' }}>Sign in</Link>
              </p>
            </motion.div>
            <p style={{ textAlign:'center', fontSize:'0.8rem', color:'rgba(245,240,232,0.2)', marginTop:16 }}>
              <Link to="/" style={{ color:'rgba(245,240,232,0.3)', textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color='rgba(245,240,232,0.6)'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(245,240,232,0.3)'}>← Back to Home</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
