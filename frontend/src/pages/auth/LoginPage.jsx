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

/* ─── Interactive Lamp SVG — Premium Arc Floor Lamp ─────────── */
const LampSVG = ({ lampOn, onToggle }) => {
  const [cordPull, setCordPull] = useState(false);

  const handleCordClick = () => {
    setCordPull(true);
    setTimeout(() => setCordPull(false), 350);
    onToggle();
  };

  return (
    <svg
      viewBox="0 0 300 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width:'100%', maxWidth:300, cursor:'default',
        filter: lampOn
          ? 'drop-shadow(0 0 50px rgba(245,166,35,0.55)) drop-shadow(0 0 100px rgba(245,166,35,0.28))'
          : 'drop-shadow(0 0 6px rgba(245,166,35,0.06))',
        transition:'filter 0.9s ease',
      }}
    >
      <defs>
        {/* ── Metallic pole gradient ── */}
        <linearGradient id="pole" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1a1408"/>
          <stop offset="30%"  stopColor="#4a3820"/>
          <stop offset="55%"  stopColor="#c8a050"/>
          <stop offset="75%"  stopColor="#8a6530"/>
          <stop offset="100%" stopColor="#1a1408"/>
        </linearGradient>
        {/* ── Base gradient ── */}
        <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#5a4020"/>
          <stop offset="40%"  stopColor="#3a2810"/>
          <stop offset="100%" stopColor="#1a1008"/>
        </linearGradient>
        {/* ── Base sheen ── */}
        <linearGradient id="baseSheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#c8a050" stopOpacity="0"/>
          <stop offset="40%"  stopColor="#ffd700" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#c8a050" stopOpacity="0"/>
        </linearGradient>
        {/* ── Shade outer ── */}
        <linearGradient id="shadeOuter" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1a1008" stopOpacity={lampOn?'0.9':'0.6'}/>
          <stop offset="20%"  stopColor="#7a5020" stopOpacity={lampOn?'0.95':'0.5'}/>
          <stop offset="50%"  stopColor="#c8860a" stopOpacity={lampOn?'1':'0.45'}/>
          <stop offset="80%"  stopColor="#7a5020" stopOpacity={lampOn?'0.95':'0.5'}/>
          <stop offset="100%" stopColor="#1a1008" stopOpacity={lampOn?'0.9':'0.6'}/>
        </linearGradient>
        {/* ── Shade inner glow ── */}
        <radialGradient id="shadeInner" cx="50%" cy="80%" r="60%">
          <stop offset="0%"   stopColor="#fff9c4" stopOpacity={lampOn?'0.55':'0'}/>
          <stop offset="60%"  stopColor="#f5a623" stopOpacity={lampOn?'0.2':'0'}/>
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0"/>
        </radialGradient>
        {/* ── Shade top cap ── */}
        <linearGradient id="shadeCap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c8a050"/>
          <stop offset="100%" stopColor="#7a5020"/>
        </linearGradient>
        {/* ── Bulb glow ── */}
        <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fffde7" stopOpacity={lampOn?'1':'0'}/>
          <stop offset="35%"  stopColor="#ffd54f" stopOpacity={lampOn?'0.9':'0'}/>
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0"/>
        </radialGradient>
        {/* ── Wide floor glow ── */}
        <radialGradient id="floorGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%"   stopColor="#f5a623" stopOpacity={lampOn?'0.5':'0'}/>
          <stop offset="60%"  stopColor="#f5a623" stopOpacity={lampOn?'0.15':'0'}/>
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0"/>
        </radialGradient>
        {/* ── Cone light ── */}
        <linearGradient id="coneLight" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%"   stopColor="#ffd54f" stopOpacity={lampOn?'0.28':'0'}/>
          <stop offset="70%"  stopColor="#f5a623" stopOpacity={lampOn?'0.06':'0'}/>
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0"/>
        </linearGradient>
        {/* ── Decorative ring gradient ── */}
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#3a2810"/>
          <stop offset="50%"  stopColor="#ffd700"/>
          <stop offset="100%" stopColor="#3a2810"/>
        </linearGradient>
        {/* ── Neck joint ── */}
        <linearGradient id="joint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#2a1e0a"/>
          <stop offset="50%"  stopColor="#c8a050"/>
          <stop offset="100%" stopColor="#2a1e0a"/>
        </linearGradient>
        {/* ── Filters ── */}
        <filter id="blur3"><feGaussianBlur stdDeviation="3"/></filter>
        <filter id="blur6"><feGaussianBlur stdDeviation="6"/></filter>
        <filter id="blur12"><feGaussianBlur stdDeviation="12"/></filter>
        <filter id="blur20"><feGaussianBlur stdDeviation="20"/></filter>
        {/* ── Shade shadow ── */}
        <filter id="shadeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.5"/>
        </filter>
      </defs>

      {/* ══ FLOOR GLOW POOL ══ */}
      <ellipse cx="150" cy="478" rx="130" ry="26"
        fill="url(#floorGlow)" filter="url(#blur12)"
        opacity={lampOn ? 1 : 0} style={{ transition:'opacity 0.9s' }}/>
      <ellipse cx="150" cy="480" rx="80" ry="14"
        fill="#f5a623" opacity={lampOn ? 0.18 : 0} filter="url(#blur6)"
        style={{ transition:'opacity 0.9s' }}/>

      {/* ══ LIGHT CONE ══ */}
      <polygon points="100,178 200,178 265,478 35,478"
        fill="url(#coneLight)"
        opacity={lampOn ? 1 : 0} style={{ transition:'opacity 0.9s' }}/>
      {/* Cone edge rays */}
      {lampOn && <>
        <line x1="100" y1="178" x2="35"  y2="478" stroke="#ffd54f" strokeWidth="0.5" strokeOpacity="0.12"/>
        <line x1="200" y1="178" x2="265" y2="478" stroke="#ffd54f" strokeWidth="0.5" strokeOpacity="0.12"/>
        <line x1="150" y1="178" x2="150" y2="478" stroke="#ffd54f" strokeWidth="0.5" strokeOpacity="0.08"/>
      </>}

      {/* ══ BASE PLATFORM ══ */}
      {/* Base shadow */}
      <ellipse cx="150" cy="472" rx="62" ry="10" fill="#000" opacity="0.5" filter="url(#blur6)"/>
      {/* Base body — stepped design */}
      <rect x="108" y="455" width="84" height="18" rx="9" fill="url(#base)"/>
      <rect x="116" y="448" width="68" height="12" rx="6" fill="url(#base)"/>
      <rect x="124" y="443" width="52" height="10" rx="5" fill="url(#base)"/>
      {/* Base sheen */}
      <rect x="108" y="455" width="84" height="6" rx="3" fill="url(#baseSheen)" opacity="0.6"/>
      {/* Base decorative line */}
      <rect x="112" y="460" width="76" height="1.5" rx="1" fill="#ffd700" opacity="0.3"/>

      {/* ══ VERTICAL POLE ══ */}
      {/* Pole shadow */}
      <rect x="148" y="200" width="10" height="248" rx="5" fill="#000" opacity="0.4" filter="url(#blur3)"/>
      {/* Main pole */}
      <rect x="144" y="200" width="12" height="248" rx="6" fill="url(#pole)"/>
      {/* Pole highlight stripe */}
      <rect x="148" y="200" width="3" height="248" rx="1.5" fill="#ffd700" opacity="0.18"/>
      {/* Pole decorative rings */}
      {[260, 320, 380].map(y => (
        <g key={y}>
          <rect x="140" y={y} width="20" height="7" rx="3.5" fill="url(#ring)"/>
          <rect x="142" y={y+1} width="16" height="2" rx="1" fill="#ffd700" opacity="0.4"/>
        </g>
      ))}

      {/* ══ ARC NECK ══ */}
      {/* Neck shadow */}
      <path d="M150 200 Q148 170 132 155 Q118 142 110 130"
        stroke="#000" strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.3" filter="url(#blur3)"/>
      {/* Neck tube */}
      <path d="M150 200 Q148 170 132 155 Q118 142 110 130"
        stroke="url(#pole)" strokeWidth="12" strokeLinecap="round" fill="none"/>
      {/* Neck highlight */}
      <path d="M150 200 Q148 170 132 155 Q118 142 110 130"
        stroke="#ffd700" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.2"/>
      {/* Neck joint ball */}
      <circle cx="150" cy="200" r="10" fill="url(#joint)"/>
      <circle cx="150" cy="200" r="10" stroke="#ffd700" strokeWidth="1" strokeOpacity="0.4" fill="none"/>
      <circle cx="150" cy="200" r="5"  fill="#c8a050"/>
      <circle cx="148" cy="198" r="2"  fill="#ffd700" opacity="0.6"/>

      {/* ══ SHADE ASSEMBLY ══ */}
      {/* Wide outer glow when ON */}
      {lampOn && (
        <ellipse cx="150" cy="155" rx="90" ry="40"
          fill="#f5a623" opacity="0.12" filter="url(#blur12)"/>
      )}

      {/* Shade body — modern tapered hexagonal look */}
      <path d="M68 178 L82 95 Q90 72 150 68 Q210 72 218 95 L232 178 Z"
        fill="url(#shadeOuter)" filter="url(#shadeShadow)"
        style={{ transition:'opacity 0.7s' }}/>
      {/* Shade inner glow surface */}
      <path d="M72 178 L85 97 Q93 76 150 72 Q207 76 215 97 L228 178 Z"
        fill="url(#shadeInner)" style={{ transition:'opacity 0.7s' }}/>
      {/* Shade outer edge lines (ribs) */}
      {lampOn && [0.25, 0.5, 0.75].map((t, i) => {
        const x1 = 68 + t * (232 - 68);
        const x2 = 82 + t * (218 - 82);
        return (
          <line key={i}
            x1={x1} y1={178} x2={x2} y2={95}
            stroke="#ffd54f" strokeWidth="0.6" strokeOpacity="0.12"/>
        );
      })}
      {/* Shade bottom rim */}
      <ellipse cx="150" cy="178" rx="82" ry="12"
        fill="#7a5020" opacity={lampOn ? 0.9 : 0.5}
        style={{ transition:'opacity 0.7s' }}/>
      <ellipse cx="150" cy="178" rx="82" ry="12"
        stroke="#c8a050" strokeWidth="1.5" fill="none" opacity={lampOn ? 0.6 : 0.2}
        style={{ transition:'opacity 0.7s' }}/>
      {/* Shade bottom inner rim glow */}
      {lampOn && (
        <ellipse cx="150" cy="178" rx="70" ry="8"
          fill="#ffd54f" opacity="0.15" filter="url(#blur3)"/>
      )}
      {/* Shade top cap */}
      <ellipse cx="150" cy="68" rx="32" ry="9" fill="url(#shadeCap)"/>
      <ellipse cx="150" cy="68" rx="32" ry="9" stroke="#ffd700" strokeWidth="1" fill="none" opacity="0.5"/>
      <ellipse cx="150" cy="66" rx="20" ry="5" fill="#ffd700" opacity="0.2"/>
      {/* Shade top opening hole */}
      <ellipse cx="150" cy="68" rx="14" ry="4" fill="#0c0a06" opacity="0.8"/>
      {/* Top glow escape */}
      {lampOn && (
        <ellipse cx="150" cy="65" rx="14" ry="4"
          fill="#fff9c4" opacity="0.35" filter="url(#blur3)"/>
      )}

      {/* ══ BULB ══ */}
      {/* Wide halo */}
      <circle cx="150" cy="148" r="55"
        fill="url(#bulbGlow)" filter="url(#blur12)"
        opacity={lampOn ? 0.8 : 0} style={{ transition:'opacity 0.7s' }}/>
      {/* Medium glow */}
      <circle cx="150" cy="148" r="30"
        fill="#ffd54f" opacity={lampOn ? 0.25 : 0} filter="url(#blur6)"
        style={{ transition:'opacity 0.7s' }}/>
      {/* Bulb glass */}
      <circle cx="150" cy="148" r="16"
        fill={lampOn ? '#fff9c4' : '#1e1810'}
        opacity={lampOn ? 0.95 : 0.7}
        style={{ transition:'fill 0.7s, opacity 0.7s' }}/>
      {/* Bulb filament glow */}
      <circle cx="150" cy="148" r="9"
        fill={lampOn ? '#ffffff' : '#2a2010'}
        style={{ transition:'fill 0.7s' }}/>
      {/* Filament detail */}
      {lampOn && <>
        <path d="M146 148 Q150 143 154 148 Q150 153 146 148"
          stroke="#fff9c4" strokeWidth="1.5" fill="none" opacity="0.8"/>
        <circle cx="146" cy="143" r="2.5" fill="#ffffff" opacity="0.7"/>
      </>}
      {/* Pulse ring */}
      {lampOn && (
        <circle cx="150" cy="148" r="55" fill="#ffd54f" opacity="0" filter="url(#blur6)">
          <animate attributeName="opacity" values="0;0.2;0"  dur="2.6s" repeatCount="indefinite"/>
          <animate attributeName="r"       values="55;75;55" dur="2.6s" repeatCount="indefinite"/>
        </circle>
      )}

      {/* ══ PULL CORD ══ */}
      {/* Cord from shade */}
      <path
        d={cordPull
          ? 'M218 95 Q228 110 224 130 Q221 148 226 168'
          : 'M218 95 Q228 110 224 130 Q221 148 226 155'}
        stroke="#5a3e1a" strokeWidth="2" strokeLinecap="round" fill="none"
        style={{ transition:'all 0.25s' }}
      />

      {/* ══ PULL SWITCH (clickable) ══ */}
      <g onClick={handleCordClick} style={{ cursor:'pointer' }}
        transform={cordPull ? 'translate(0,14)' : 'translate(0,0)'}>
        {/* Outer glow */}
        {lampOn && (
          <circle cx="226" cy="160" r="14" fill="#f5a623" opacity="0.2" filter="url(#blur6)"/>
        )}
        {/* Switch housing */}
        <rect x="216" y="152" width="20" height="28" rx="10"
          fill={lampOn ? '#3a2810' : '#1e1408'}
          stroke={lampOn ? '#c8a050' : '#3a2810'}
          strokeWidth="1.5"
          style={{ transition:'fill 0.5s, stroke 0.5s' }}/>
        {/* Switch button */}
        <rect x="220" y={lampOn ? '156' : '164'} width="12" height="12" rx="6"
          fill={lampOn ? '#f5a623' : '#2a1e0a'}
          style={{ transition:'all 0.4s' }}/>
        {lampOn && (
          <rect x="222" y="158" width="8" height="4" rx="2" fill="#fff9c4" opacity="0.7"/>
        )}
        {/* I / O symbol */}
        <text x="226" y={lampOn ? '172' : '164'}
          fontSize="7" fontWeight="900" fontFamily="Inter,sans-serif"
          textAnchor="middle"
          fill={lampOn ? '#ffd700' : 'rgba(245,166,35,0.3)'}
          style={{ transition:'fill 0.4s', userSelect:'none' }}>
          {lampOn ? 'I' : 'O'}
        </text>
        {/* Cord below */}
        <line x1="226" y1="180" x2="226" y2="194" stroke="#5a3e1a" strokeWidth="2"/>
        <circle cx="226" cy="197" r="4" fill="#3a2810" stroke="#c8a050" strokeWidth="1"/>

        {/* ON/OFF badge */}
        <rect x="234" y="153" width="28" height="14" rx="7"
          fill={lampOn ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.04)'}
          stroke={lampOn ? 'rgba(245,166,35,0.4)' : 'rgba(255,255,255,0.08)'}
          strokeWidth="1"
          style={{ transition:'all 0.4s' }}/>
        <text x="248" y="163"
          fontSize="7.5" fontWeight="800" fontFamily="Inter,sans-serif"
          textAnchor="middle"
          fill={lampOn ? '#f5a623' : 'rgba(245,166,35,0.3)'}
          style={{ transition:'fill 0.4s', userSelect:'none' }}>
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
