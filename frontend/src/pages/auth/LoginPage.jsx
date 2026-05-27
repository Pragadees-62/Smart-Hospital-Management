/**
 * Login Page — "Login Lamp" with Interactive ON/OFF Toggle
 * Click the pull cord to turn the lamp on or off
 * Portal-locked: 5173→Patient | 5151→Doctor | 5152→Admin
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getCurrentPortal, PORTAL_CONFIG } from '../../utils/portalConfig';
import toast from 'react-hot-toast';

/* ─── Dust particles (opacity driven by lampOn) ─────────────── */
const DustCanvas = ({ lampOn }) => {
  const ref       = useRef(null);
  const lampOnRef = useRef(lampOn);
  useEffect(() => { lampOnRef.current = lampOn; }, [lampOn]);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    let id, pts = [];
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    class Pt {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * c.width;
        this.y  = Math.random() * c.height;
        this.r  = Math.random() * 1.2 + 0.2;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = -Math.random() * 0.4 - 0.1;
        this.a  = Math.random() * 0.35 + 0.05;
      }
      tick() { this.x += this.vx; this.y += this.vy; if (this.y < -4) this.reset(); }
      draw() {
        const alpha = lampOnRef.current ? this.a : this.a * 0.15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,166,35,${alpha})`;
        ctx.fill();
      }
    }
    const init = () => { resize(); pts = Array.from({ length: 90 }, () => new Pt()); };
    const loop = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => { p.tick(); p.draw(); });
      id = requestAnimationFrame(loop);
    };
    window.addEventListener('resize', init);
    init(); loop();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', init); };
  }, []);

  return <canvas ref={ref} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }} />;
};

/* ─── Interactive Lamp SVG ───────────────────────────────────── */
const LampSVG = ({ lampOn, onToggle }) => {
  const [cordPull, setCordPull] = useState(false);

  const handleCordClick = () => {
    setCordPull(true);
    setTimeout(() => setCordPull(false), 400);
    onToggle();
  };

  return (
    <svg
      viewBox="0 0 260 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width:'100%', maxWidth:260, cursor:'default',
        filter: lampOn
          ? 'drop-shadow(0 0 60px rgba(245,166,35,0.5)) drop-shadow(0 0 120px rgba(245,166,35,0.25))'
          : 'drop-shadow(0 0 8px rgba(245,166,35,0.08))',
        transition:'filter 0.8s ease',
      }}
    >
      <defs>
        {/* Shade gradient — always visible */}
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#f5c842" stopOpacity={lampOn ? '0.95' : '0.35'}/>
          <stop offset="60%" stopColor="#c8860a" stopOpacity={lampOn ? '0.9'  : '0.3' }/>
          <stop offset="100%" stopColor="#7a4e00" stopOpacity={lampOn ? '0.85' : '0.25'}/>
        </linearGradient>

        {/* Bulb glow — only when ON */}
        <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff9c4" stopOpacity={lampOn ? '1'   : '0'}/>
          <stop offset="40%"  stopColor="#ffd54f" stopOpacity={lampOn ? '0.9' : '0'}/>
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0"/>
        </radialGradient>

        {/* Floor glow */}
        <radialGradient id="floorGlow" cx="50%" cy="20%" r="50%">
          <stop offset="0%"   stopColor="#f5a623" stopOpacity={lampOn ? '0.45' : '0'}/>
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0"/>
        </radialGradient>

        {/* Light cone */}
        <linearGradient id="coneLight" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%"   stopColor="#ffd54f" stopOpacity={lampOn ? '0.22' : '0'}/>
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0"/>
        </linearGradient>

        <filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter>
        <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>

      {/* ── Floor ambient pool ── */}
      <ellipse cx="130" cy="415" rx="110" ry="22"
        fill="url(#floorGlow)" filter="url(#blur8)"
        style={{ transition:'opacity 0.8s' }}
        opacity={lampOn ? 1 : 0}
      />

      {/* ── Light cone ── */}
      <polygon points="80,148 180,148 230,415 30,415"
        fill="url(#coneLight)"
        style={{ transition:'opacity 0.8s' }}
        opacity={lampOn ? 0.7 : 0}
      />

      {/* ── Stand base ── */}
      <ellipse cx="130" cy="407" rx="52" ry="10" fill="#1a1208" opacity="0.9"/>
      <rect x="108" y="385" width="44" height="24" rx="8" fill="#2a1e0a"/>

      {/* ── Stem ── */}
      <rect x="126" y="160" width="8" height="230" rx="4" fill="#3d2b0e"/>
      <path d="M130 160 Q130 130 118 118" stroke="#3d2b0e" strokeWidth="8" strokeLinecap="round" fill="none"/>

      {/* ── Shade body ── */}
      <path d="M72 148 Q80 80 130 72 Q180 80 188 148 Z" fill="url(#shade)"
        style={{ transition:'opacity 0.6s' }}/>
      <ellipse cx="130" cy="72"  rx="28" ry="7"  fill="#c8860a" opacity={lampOn ? 0.9 : 0.4}
        style={{ transition:'opacity 0.6s' }}/>
      <ellipse cx="130" cy="148" rx="58" ry="10" fill="#7a4e00" opacity={lampOn ? 0.8 : 0.35}
        style={{ transition:'opacity 0.6s' }}/>
      {lampOn && (
        <>
          <path d="M95 148 Q100 100 130 88 Q160 100 165 148" fill="#ffd54f" opacity="0.12"/>
          <path d="M72 148 Q76 110 100 88" stroke="#ffd54f" strokeWidth="1.5" strokeOpacity="0.3" fill="none"/>
        </>
      )}

      {/* ── Bulb ── */}
      <circle cx="130" cy="130" r="32"
        fill="url(#bulbGlow)" filter="url(#blur4)"
        opacity={lampOn ? 0.9 : 0}
        style={{ transition:'opacity 0.6s' }}
      />
      <circle cx="130" cy="130" r="14"
        fill={lampOn ? '#fff9c4' : '#2a2010'}
        opacity={lampOn ? 0.95 : 0.6}
        style={{ transition:'fill 0.6s, opacity 0.6s' }}
      />
      <circle cx="130" cy="130" r="8"
        fill={lampOn ? '#ffffff' : '#1a1408'}
        style={{ transition:'fill 0.6s' }}
      />
      {lampOn && <circle cx="124" cy="124" r="3" fill="#ffffff" opacity="0.7"/>}

      {/* ── Animated pulse (only when ON) ── */}
      {lampOn && (
        <circle cx="130" cy="130" r="50" fill="#ffd54f" opacity="0" filter="url(#blur8)">
          <animate attributeName="opacity" values="0;0.18;0" dur="2.8s" repeatCount="indefinite"/>
          <animate attributeName="r"       values="50;65;50"  dur="2.8s" repeatCount="indefinite"/>
        </circle>
      )}

      {/* ── Hanging cord ── */}
      <path
        d={cordPull
          ? 'M158 72 Q165 90 162 108 Q159 120 163 148'
          : 'M158 72 Q165 90 162 108 Q159 120 163 132'}
        stroke="#5a3e1a" strokeWidth="2.5" strokeLinecap="round" fill="none"
        style={{ transition:'d 0.2s' }}
      />

      {/* ── Pull switch (clickable) ── */}
      <g
        onClick={handleCordClick}
        style={{ cursor:'pointer' }}
        transform={cordPull ? 'translate(0, 16)' : 'translate(0, 0)'}
      >
        {/* Glow ring when ON */}
        {lampOn && (
          <circle cx="163" cy="136" r="10" fill="#f5a623" opacity="0.2" filter="url(#blur4)"/>
        )}
        {/* Switch body */}
        <circle cx="163" cy="136" r="7"
          fill={lampOn ? '#f5a623' : '#3d2b0e'}
          stroke={lampOn ? '#ffd700' : '#5a3e1a'}
          strokeWidth="1.5"
          style={{ transition:'fill 0.4s, stroke 0.4s' }}
        />
        {/* Switch inner dot */}
        <circle cx="163" cy="136" r="3.5"
          fill={lampOn ? '#fff9c4' : '#2a1e0a'}
          style={{ transition:'fill 0.4s' }}
        />
        {/* Cord below switch */}
        <line x1="163" y1="143" x2="163" y2="155" stroke="#5a3e1a" strokeWidth="1.5"/>
        <circle cx="163" cy="157" r="3" fill="#3d2b0e"/>

        {/* ON/OFF label */}
        <text
          x="178" y="140"
          fontSize="9"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
          fill={lampOn ? '#f5a623' : 'rgba(245,166,35,0.35)'}
          style={{ transition:'fill 0.4s', userSelect:'none' }}
        >
          {lampOn ? 'ON' : 'OFF'}
        </text>
      </g>
    </svg>
  );
};

/* ─── Styled input ───────────────────────────────────────────── */
const LampInput = ({ id, name, type, placeholder, icon: Icon, value, onChange, error, rightEl }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{
        position:'relative', borderRadius:12,
        border:`1.5px solid ${error ? 'rgba(239,68,68,0.6)' : focused ? 'rgba(245,166,35,0.6)' : 'rgba(255,255,255,0.08)'}`,
        background: focused ? 'rgba(245,166,35,0.05)' : 'rgba(255,255,255,0.03)',
        boxShadow: focused ? '0 0 0 3px rgba(245,166,35,0.12), 0 0 20px rgba(245,166,35,0.08)' : 'none',
        transition:'all 0.25s',
      }}>
        <Icon size={15} style={{
          position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
          color: focused ? '#f5a623' : 'rgba(255,255,255,0.22)',
          transition:'color 0.2s', pointerEvents:'none',
        }}/>
        <input
          id={id} name={name} type={type} value={value}
          onChange={onChange} placeholder={placeholder}
          autoComplete={name === 'email' ? 'email' : 'current-password'}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width:'100%', padding:'13px 44px 13px 42px', background:'transparent', border:'none', outline:'none', color:'#f5f0e8', fontSize:'0.9rem', fontFamily:'Inter,sans-serif' }}
        />
        {rightEl && <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)' }}>{rightEl}</div>}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ color:'#f87171', fontSize:'0.72rem', fontWeight:500, paddingLeft:4 }}>
            ⚠ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Main LoginPage ─────────────────────────────────────────── */
const LoginPage = () => {
  const portal   = getCurrentPortal();
  const [lampOn, setLampOn]           = useState(true);
  const [form, setForm]               = useState({ email:'', password:'' });
  const [showPw, setShowPw]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});
  const { login, logout }             = useAuth();
  const navigate                      = useNavigate();
  const location                      = useLocation();

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]:'' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== portal.role) {
        const lbl = Object.values(PORTAL_CONFIG).find(p => p.role === user.role)?.label || 'correct portal';
        toast.error(`This is the ${portal.label}. Please use the ${lbl}.`);
        logout(); setLoading(false); return;
      }
      toast.success('Welcome back!');
      const from = location.state?.from?.pathname;
      navigate(from && from !== '/login' ? from : portal.dashboard, { replace:true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const roleLabel = portal.role.charAt(0).toUpperCase() + portal.role.slice(1);

  /* Page background shifts when lamp is OFF */
  const pageBg = lampOn
    ? '#0c0a06'
    : '#060504';

  const ambientOpacity = lampOn ? 0.07 : 0;

  return (
    <div style={{
      minHeight:'100vh', width:'100%',
      background: pageBg,
      display:'flex', flexDirection:'column', alignItems:'center',
      fontFamily:"'Inter',sans-serif",
      position:'relative', overflow:'hidden',
      transition:'background 0.8s ease',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; }
        input::placeholder { color:rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(245,166,35,0.3); border-radius:99px; }
        @keyframes float-card {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-6px); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes lamp-on-pulse {
          0%,100% { opacity:0.55; transform:scale(1); }
          50%      { opacity:0.85; transform:scale(1.04); }
        }
        .lamp-on  { animation: lamp-on-pulse 3s ease-in-out infinite; }
        .lamp-off { animation: none; }
        .login-card { animation: float-card 5s ease-in-out infinite; }
        .btn-gold {
          background: linear-gradient(90deg, #b8860b, #f5a623, #ffd700, #f5a623, #b8860b);
          background-size: 300% auto;
          transition: all 0.3s;
        }
        .btn-gold:hover {
          background-position: right center;
          box-shadow: 0 0 32px rgba(245,166,35,0.55), 0 8px 24px rgba(0,0,0,0.4);
          transform: translateY(-2px);
        }
        .btn-gold:active { transform:translateY(0); }
        @media (max-width: 768px) {
          .lamp-left { display:none !important; }
          .lamp-divider { display:none !important; }
          .lamp-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* Dust particles */}
      <DustCanvas lampOn={lampOn} />

      {/* Ambient radial glow — fades with lamp */}
      <div style={{
        position:'fixed', top:'-10%', left:'50%', transform:'translateX(-50%)',
        width:'70vw', height:'70vh', borderRadius:'50%',
        background:`radial-gradient(ellipse, rgba(245,166,35,${ambientOpacity}) 0%, transparent 70%)`,
        pointerEvents:'none', zIndex:0,
        transition:'background 0.8s ease',
      }}/>

      {/* Top spacing */}
      <div style={{ paddingTop:32, position:'relative', zIndex:2 }}/>

      {/* ── Main layout ── */}
      <div className="lamp-grid" style={{
        flex:1, width:'100%', maxWidth:1100,
        display:'grid', gridTemplateColumns:'1fr auto 1fr',
        alignItems:'center',
        padding:'20px 32px 48px',
        position:'relative', zIndex:2,
      }}>

        {/* ── LEFT: Interactive Lamp ── */}
        <motion.div
          className="lamp-left"
          initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:0.8, delay:0.1, ease:[0.22,1,0.36,1] }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}
        >
          {/* Lamp wrapper — glow animation only when ON */}
          <div className={lampOn ? 'lamp-on' : 'lamp-off'} style={{ position:'relative' }}>
            <LampSVG lampOn={lampOn} onToggle={() => setLampOn(p => !p)} />
          </div>

          {/* Status label */}
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'7px 18px', borderRadius:99,
            background: lampOn ? 'rgba(245,166,35,0.1)' : 'rgba(255,255,255,0.04)',
            border: lampOn ? '1px solid rgba(245,166,35,0.25)' : '1px solid rgba(255,255,255,0.06)',
            transition:'all 0.6s',
          }}>
            {/* Status dot */}
            <span style={{
              width:7, height:7, borderRadius:'50%',
              background: lampOn ? '#f5a623' : '#3d3020',
              boxShadow: lampOn ? '0 0 8px #f5a623' : 'none',
              display:'inline-block',
              transition:'all 0.6s',
            }}/>
            <span style={{
              fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.15em',
              textTransform:'uppercase',
              color: lampOn ? 'rgba(245,166,35,0.7)' : 'rgba(255,255,255,0.2)',
              transition:'color 0.6s',
            }}>
              {lampOn ? 'Lamp is ON' : 'Lamp is OFF'}
            </span>
          </div>

          {/* Hint text */}
          <p style={{
            fontSize:'0.65rem', color:'rgba(255,255,255,0.2)',
            letterSpacing:'0.08em', textAlign:'center',
            transition:'color 0.6s',
          }}>
            Click the cord switch to toggle
          </p>
        </motion.div>

        {/* ── CENTER divider ── */}
        <div className="lamp-divider" style={{
          width:1, height:'60%', minHeight:300,
          background: lampOn
            ? 'linear-gradient(180deg, transparent, rgba(245,166,35,0.25), transparent)'
            : 'linear-gradient(180deg, transparent, rgba(255,255,255,0.05), transparent)',
          margin:'0 32px',
          transition:'background 0.8s',
        }}/>

        {/* ── RIGHT: Login card ── */}
        <motion.div
          initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:0.8, delay:0.15, ease:[0.22,1,0.36,1] }}
          style={{ display:'flex', justifyContent:'center' }}
        >
          <div className="login-card" style={{
            width:'100%', maxWidth:400,
            background: lampOn ? 'rgba(20,15,5,0.75)' : 'rgba(10,8,4,0.85)',
            backdropFilter:'blur(24px)',
            WebkitBackdropFilter:'blur(24px)',
            border: lampOn ? '1px solid rgba(245,166,35,0.15)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius:24,
            padding:'36px 32px 28px',
            boxShadow: lampOn
              ? '0 0 0 1px rgba(245,166,35,0.06), 0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,166,35,0.06)'
              : '0 24px 80px rgba(0,0,0,0.8)',
            transition:'all 0.8s ease',
          }}>
            {/* Card header */}
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <div style={{
                  width:36, height:36, borderRadius:10,
                  background: lampOn ? 'linear-gradient(135deg,#b8860b,#f5a623)' : 'rgba(245,166,35,0.15)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:900, fontSize:16,
                  color: lampOn ? '#0c0a06' : 'rgba(245,166,35,0.5)',
                  boxShadow: lampOn ? '0 0 16px rgba(245,166,35,0.4)' : 'none',
                  transition:'all 0.6s',
                }}>H</div>
                <p style={{ fontSize:'0.65rem', color:'rgba(245,166,35,0.5)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  {portal.emoji} {portal.label}
                </p>
              </div>
              <h2 style={{ fontSize:'1.5rem', fontWeight:800, color:'#f5f0e8', letterSpacing:'-0.02em', marginTop:10 }}>
                Welcome back
              </h2>
              <p style={{ fontSize:'0.825rem', color:'rgba(255,255,255,0.3)', marginTop:4 }}>
                Sign in to your {roleLabel} dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }} noValidate>
              <LampInput id="email" name="email" type="email" placeholder="Email address"
                icon={FiUser} value={form.email} onChange={handleChange} error={errors.email}/>
              <LampInput id="password" name="password"
                type={showPw ? 'text' : 'password'} placeholder="Password"
                icon={FiLock} value={form.password} onChange={handleChange} error={errors.password}
                rightEl={
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{ background:'none', border:'none', cursor:'pointer', color: showPw ? '#f5a623' : 'rgba(255,255,255,0.25)', display:'flex', padding:2, transition:'color 0.2s' }}>
                    {showPw ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
                  </button>
                }
              />

              <button type="submit" disabled={loading} className="btn-gold"
                style={{
                  width:'100%', padding:'14px', borderRadius:14, border:'none',
                  color:'#0c0a06', fontSize:'0.95rem', fontWeight:800,
                  fontFamily:'Inter,sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  marginTop:4, opacity: loading ? 0.7 : 1, letterSpacing:'0.02em',
                }}>
                {loading ? (
                  <><span style={{ width:18, height:18, border:'2.5px solid rgba(0,0,0,0.2)', borderTopColor:'#0c0a06', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }}/> Signing in…</>
                ) : (
                  <>Sign In as {roleLabel} <FiArrowRight size={16}/></>
                )}
              </button>
            </form>

            {portal.canRegister && (
              <p style={{ textAlign:'center', fontSize:'0.8rem', color:'rgba(255,255,255,0.25)', marginTop:20 }}>
                No account?{' '}
                <Link to="/register" style={{ color:'#f5a623', fontWeight:700, textDecoration:'none' }}>
                  Create one free
                </Link>
              </p>
            )}

            <div style={{ height:1, background:'rgba(245,166,35,0.08)', margin:'20px 0 16px' }}/>

            {/* Portal lock */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
              <FiShield size={13} style={{ color:'rgba(245,166,35,0.5)', flexShrink:0, marginTop:1 }}/>
              <p style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.2)', lineHeight:1.5 }}>
                <strong style={{ color:'rgba(245,166,35,0.5)' }}>Portal locked</strong> — only{' '}
                <strong style={{ textTransform:'capitalize', color:'rgba(245,166,35,0.5)' }}>{portal.role}s</strong> can sign in here.
              </p>
            </div>

            {/* Other portals */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:14 }}>
              {Object.entries(PORTAL_CONFIG).map(([port, cfg]) => {
                const isCurrent = port === window.location.port;
                return (
                  <a key={port}
                    href={`${window.location.protocol}//${window.location.hostname}:${port}/login`}
                    style={{
                      textAlign:'center', padding:'9px 6px', borderRadius:10,
                      fontSize:'0.68rem', fontWeight:600, textDecoration:'none',
                      background: isCurrent ? 'rgba(245,166,35,0.06)' : 'rgba(255,255,255,0.02)',
                      border: isCurrent ? '1px solid rgba(245,166,35,0.2)' : '1px solid rgba(255,255,255,0.05)',
                      color: isCurrent ? 'rgba(245,166,35,0.7)' : 'rgba(255,255,255,0.3)',
                      pointerEvents: isCurrent ? 'none' : 'auto',
                      transition:'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!isCurrent) { e.currentTarget.style.borderColor='rgba(245,166,35,0.3)'; e.currentTarget.style.color='rgba(245,166,35,0.8)'; e.currentTarget.style.background='rgba(245,166,35,0.06)'; }}}
                    onMouseLeave={e => { if (!isCurrent) { e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'; e.currentTarget.style.color='rgba(255,255,255,0.3)'; e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}}
                  >
                    <div style={{ fontSize:'1rem', marginBottom:2 }}>{cfg.emoji}</div>
                    <div style={{ fontWeight:700 }}>{cfg.label.split(' ')[0]}</div>
                    <div style={{ fontSize:'0.6rem', opacity:0.5, marginTop:1 }}>:{port}</div>
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <p style={{ position:'relative', zIndex:2, fontSize:'0.68rem', color:'rgba(255,255,255,0.12)', paddingBottom:20, letterSpacing:'0.05em' }}>
        © 2024 Smart Hospital Management System
      </p>
    </div>
  );
};

export default LoginPage;
