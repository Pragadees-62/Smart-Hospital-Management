/** Landing Page — Login Lamp Theme */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar,FiActivity,FiShield,FiClock,FiUsers,FiStar,FiArrowRight,FiPhone,FiMail,FiMapPin,FiHeart,FiCheckCircle,FiZap,FiAward,FiTrendingUp } from 'react-icons/fi';
import Navbar from '../../components/common/Navbar';

const G = '#f5a623';
const GOLD = 'linear-gradient(135deg,#b8860b,#f5a623,#ffd700)';

const features = [
  { icon:FiCalendar, title:'Smart Scheduling',    desc:'Book appointments with top specialists in seconds. AI-powered slot recommendations.' },
  { icon:FiActivity, title:'Live Queue Tracking', desc:'Real-time queue position updates. Get notified the moment your turn approaches.'    },
  { icon:FiShield,   title:'Encrypted Records',   desc:'Military-grade encryption for all health data with role-based access control.'      },
  { icon:FiClock,    title:'24/7 Emergency Care', desc:'Round-the-clock emergency monitoring with priority case escalation system.'         },
  { icon:FiUsers,    title:'150+ Specialists',    desc:'Access verified doctors across 25+ specializations with verified credentials.'      },
  { icon:FiHeart,    title:'AI Health Insights',  desc:'Preliminary health analysis powered by advanced AI symptom recognition engine.'     },
];

const stats = [
  { value:'10K+', label:'Patients Served',   icon:FiUsers      },
  { value:'150+', label:'Expert Doctors',    icon:FiAward      },
  { value:'25+',  label:'Departments',       icon:FiActivity   },
  { value:'98%',  label:'Satisfaction Rate', icon:FiTrendingUp },
];

const departments = [
  { name:'Cardiology',    icon:'❤️',  count:'12 Doctors' },
  { name:'Neurology',     icon:'🧠',  count:'8 Doctors'  },
  { name:'Orthopedics',   icon:'🦴',  count:'10 Doctors' },
  { name:'Pediatrics',    icon:'👶',  count:'15 Doctors' },
  { name:'Oncology',      icon:'🔬',  count:'7 Doctors'  },
  { name:'Dermatology',   icon:'🌿',  count:'9 Doctors'  },
  { name:'Ophthalmology', icon:'👁️', count:'6 Doctors'  },
  { name:'Gynecology',    icon:'🌸',  count:'11 Doctors' },
];

const testimonials = [
  { name:'Priya Sharma',    role:'Patient',      text:'The online appointment system is incredibly smooth. Booked a consultation in under 2 minutes!', rating:5, av:'PS' },
  { name:'Rahul Mehta',     role:'Patient',      text:'Real-time queue tracking saved me so much waiting time. Highly recommend Smart Hospital.',       rating:5, av:'RM' },
  { name:'Dr. Anita Patel', role:'Cardiologist', text:'The doctor dashboard makes managing appointments and prescriptions completely effortless.',      rating:5, av:'AP' },
];

const fadeUp = (delay=0) => ({
  initial:{ opacity:0, y:30 },
  whileInView:{ opacity:1, y:0 },
  transition:{ duration:0.6, delay, ease:[0.22,1,0.36,1] },
  viewport:{ once:true },
});

const card = { background:'rgba(20,16,8,0.75)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', border:'1px solid rgba(245,166,35,0.12)', borderRadius:20 };

export default function LandingPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#0c0a06', overflowX:'hidden', fontFamily:'Inter,sans-serif' }}>
      <Navbar/>

      {/* ── HERO ── */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', paddingTop:80, paddingBottom:64, overflow:'hidden', background:'linear-gradient(135deg,#0c0a06 0%,#100e08 40%,#16120a 70%,#1e1a0e 100%)' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(245,166,35,0.05) 1px,transparent 1px)', backgroundSize:'24px 24px', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'20%', left:'15%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,166,35,0.1),transparent)', filter:'blur(60px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'20%', right:'15%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(184,134,11,0.08),transparent)', filter:'blur(60px)', pointerEvents:'none' }}/>

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', width:'100%', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }} className="hero-grid">
            <style>{`@media(max-width:900px){.hero-grid{grid-template-columns:1fr!important}}`}</style>

            <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:99, background:'rgba(245,166,35,0.1)', border:'1px solid rgba(245,166,35,0.2)', color:G, fontSize:'0.78rem', fontWeight:600, marginBottom:24 }}>
                <FiZap size={12}/> Smart Healthcare Platform
              </div>
              <h1 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:900, color:'#f5f0e8', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:24 }}>
                Your Health,{' '}
                <span style={{ background:GOLD, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Our Priority</span>
              </h1>
              <p style={{ fontSize:'1.05rem', color:'rgba(245,240,232,0.55)', marginBottom:36, lineHeight:1.7, maxWidth:480 }}>
                Experience world-class healthcare with seamless appointment booking, real-time queue tracking, digital prescriptions, and AI-powered health insights.
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:14, marginBottom:36 }}>
                <Link to="/register" className="btn-teal" style={{ fontSize:'1rem', padding:'13px 28px', textDecoration:'none' }}>
                  Get Started Free <FiArrowRight size={18}/>
                </Link>
                <Link to="/services" style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:'1rem', padding:'13px 28px', fontWeight:600, color:'rgba(245,240,232,0.7)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:14, textDecoration:'none', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(245,166,35,0.06)'; e.currentTarget.style.color='#f5f0e8'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(245,240,232,0.7)'; }}>
                  Explore Services
                </Link>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:20 }}>
                {['No waiting in queues','Digital prescriptions','Secure & private'].map(t => (
                  <div key={t} style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.85rem', color:'rgba(245,240,232,0.5)' }}>
                    <FiCheckCircle size={14} style={{ color:G }}/> {t}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7, delay:0.15, ease:[0.22,1,0.36,1] }} style={{ position:'relative' }}>
              <div style={{ ...card, padding:28, border:'1px solid rgba(245,166,35,0.2)', boxShadow:'0 0 40px rgba(245,166,35,0.08)' }}>
                <p style={{ fontSize:'0.68rem', color:'rgba(245,240,232,0.35)', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:20 }}>Hospital at a Glance</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
                  {stats.map(({ value, label, icon:Icon }) => (
                    <div key={label} style={{ background:'rgba(245,166,35,0.05)', border:'1px solid rgba(245,166,35,0.1)', borderRadius:14, padding:'14px', textAlign:'center' }}>
                      <Icon size={18} style={{ color:G, margin:'0 auto 6px' }}/>
                      <p style={{ fontSize:'1.6rem', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.03em' }}>{value}</p>
                      <p style={{ fontSize:'0.7rem', color:'rgba(245,240,232,0.4)', marginTop:2 }}>{label}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:14, padding:'14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'rgba(245,166,35,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <FiCalendar size={16} style={{ color:G }}/>
                    </div>
                    <div>
                      <p style={{ fontWeight:600, color:'#f5f0e8', fontSize:'0.875rem' }}>Next Available Slot</p>
                      <p style={{ color:G, fontSize:'0.75rem' }}>Today, 2:30 PM</p>
                    </div>
                  </div>
                  <Link to="/register" className="btn-teal" style={{ display:'block', textAlign:'center', fontSize:'0.875rem', padding:'10px', textDecoration:'none', borderRadius:12 }}>
                    Book Now →
                  </Link>
                </div>
              </div>
              {/* Floating badges */}
              <motion.div animate={{ y:[-6,6,-6] }} transition={{ repeat:Infinity, duration:3.5, ease:'easeInOut' }}
                style={{ position:'absolute', top:-20, right:-20, ...card, padding:'10px 14px', display:'flex', alignItems:'center', gap:10, boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(245,166,35,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <FiCheckCircle size={14} style={{ color:G }}/>
                </div>
                <div>
                  <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#f5f0e8' }}>Appointment Confirmed</p>
                  <p style={{ fontSize:'0.65rem', color:'rgba(245,240,232,0.4)' }}>Token: A042</p>
                </div>
              </motion.div>
              <motion.div animate={{ y:[6,-6,6] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut' }}
                style={{ position:'absolute', bottom:-20, left:-20, ...card, padding:'10px 14px', display:'flex', alignItems:'center', gap:10, boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(245,166,35,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <FiActivity size={14} style={{ color:G }}/>
                </div>
                <div>
                  <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#f5f0e8' }}>Queue Position</p>
                  <p style={{ fontSize:'0.65rem', color:'rgba(245,240,232,0.4)' }}>#3 — ~12 min wait</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:'96px 24px', background:'#0c0a06' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:99, background:'rgba(245,166,35,0.08)', border:'1px solid rgba(245,166,35,0.15)', color:G, fontSize:'0.75rem', fontWeight:600, marginBottom:16 }}>Platform Features</div>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.03em', marginBottom:16 }}>Everything You Need</h2>
            <p style={{ fontSize:'1.05rem', color:'rgba(245,240,232,0.45)', maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>A complete healthcare management platform built for patients, doctors, and administrators.</p>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>
            {features.map(({ icon:Icon, title, desc }, i) => (
              <motion.div key={title} {...fadeUp(i*0.08)}
                style={{ ...card, padding:28, cursor:'default', transition:'all 0.3s', position:'relative', overflow:'hidden' }}
                whileHover={{ y:-4, boxShadow:'0 20px 50px rgba(245,166,35,0.1)', borderColor:'rgba(245,166,35,0.25)' }}>
                <div style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg,#b8860b,#f5a623)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, boxShadow:'0 4px 16px rgba(245,166,35,0.3)' }}>
                  <Icon size={22} style={{ color:'#0c0a06' }}/>
                </div>
                <h3 style={{ fontWeight:800, color:'#f5f0e8', fontSize:'1.05rem', marginBottom:8 }}>{title}</h3>
                <p style={{ color:'rgba(245,240,232,0.45)', fontSize:'0.875rem', lineHeight:1.65 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section style={{ padding:'96px 24px', background:'#100e08' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:99, background:'rgba(245,166,35,0.08)', border:'1px solid rgba(245,166,35,0.15)', color:G, fontSize:'0.75rem', fontWeight:600, marginBottom:16 }}>Medical Specialties</div>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.03em', marginBottom:12 }}>Our Departments</h2>
            <p style={{ color:'rgba(245,240,232,0.45)', fontSize:'1rem' }}>Specialized care across all major medical disciplines</p>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {departments.map(({ name, icon, count }, i) => (
              <motion.div key={name} {...fadeUp(i*0.05)}
                style={{ ...card, padding:'24px 16px', textAlign:'center', cursor:'pointer', transition:'all 0.25s' }}
                whileHover={{ y:-4, boxShadow:'0 16px 40px rgba(245,166,35,0.1)', borderColor:'rgba(245,166,35,0.25)' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:12 }}>{icon}</div>
                <h3 style={{ fontWeight:700, color:'#f5f0e8', marginBottom:4, fontSize:'0.95rem' }}>{name}</h3>
                <p style={{ fontSize:'0.78rem', color:'rgba(245,240,232,0.35)', fontWeight:500 }}>{count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'96px 24px', background:'#0c0a06' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:99, background:'rgba(245,166,35,0.08)', border:'1px solid rgba(245,166,35,0.15)', color:G, fontSize:'0.75rem', fontWeight:600, marginBottom:16 }}>Patient Stories</div>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.03em' }}>What People Say</h2>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
            {testimonials.map(({ name, role, text, rating, av }, i) => (
              <motion.div key={name} {...fadeUp(i*0.1)}
                style={{ ...card, padding:28, transition:'all 0.3s' }}
                whileHover={{ y:-4, boxShadow:'0 20px 50px rgba(245,166,35,0.08)', borderColor:'rgba(245,166,35,0.2)' }}>
                <div style={{ display:'flex', gap:4, marginBottom:18 }}>
                  {Array.from({ length:rating }).map((_,j) => <FiStar key={j} size={15} style={{ color:G, fill:G }}/>)}
                </div>
                <p style={{ color:'rgba(245,240,232,0.55)', marginBottom:20, lineHeight:1.65, fontSize:'0.9rem' }}>"{text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#b8860b,#f5a623)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0c0a06', fontWeight:800, fontSize:'0.8rem' }}>{av}</div>
                  <div>
                    <p style={{ fontWeight:700, color:'#f5f0e8', fontSize:'0.875rem' }}>{name}</p>
                    <p style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.35)' }}>{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:'96px 24px', background:'linear-gradient(135deg,#100e08,#1e1a0e)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,166,35,0.08),transparent)', filter:'blur(40px)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <motion.div {...fadeUp()}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:99, background:'rgba(245,166,35,0.1)', border:'1px solid rgba(245,166,35,0.2)', color:G, fontSize:'0.75rem', fontWeight:600, marginBottom:20 }}>Join Us Today</div>
            <h2 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.03em', marginBottom:20 }}>
              Ready to Get{' '}
              <span style={{ background:GOLD, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Started?</span>
            </h2>
            <p style={{ color:'rgba(245,240,232,0.5)', fontSize:'1.1rem', marginBottom:36, lineHeight:1.7 }}>Join thousands of patients who trust Smart Hospital for their healthcare needs.</p>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:14 }}>
              <Link to="/register" className="btn-teal" style={{ fontSize:'1rem', padding:'14px 32px', textDecoration:'none' }}>
                Create Free Account <FiArrowRight size={18}/>
              </Link>
              <Link to="/contact" style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:'1rem', padding:'14px 32px', fontWeight:600, color:'rgba(245,240,232,0.6)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:14, textDecoration:'none', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(245,166,35,0.06)'; e.currentTarget.style.color='#f5f0e8'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(245,240,232,0.6)'; }}>
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#080806', padding:'64px 24px 32px', borderTop:'1px solid rgba(245,166,35,0.08)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:40 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#b8860b,#f5a623)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#0c0a06' }}>H</div>
              <span style={{ fontWeight:800, fontSize:'1.1rem', color:'#f5f0e8' }}>Smart<span style={{ color:G }}>Hospital</span></span>
            </div>
            <p style={{ fontSize:'0.85rem', color:'rgba(245,240,232,0.3)', lineHeight:1.65 }}>Modern healthcare management platform for patients, doctors, and administrators.</p>
          </div>
          {[
            { title:'Quick Links', items:['Home','About','Services','Contact'].map(l => ({ label:l, href:`/${l.toLowerCase()}` })) },
            { title:'Services',    items:['Appointment Booking','Queue Tracking','Prescriptions','Emergency Care'].map(l => ({ label:l, href:'#' })) },
          ].map(({ title, items }) => (
            <div key={title}>
              <h4 style={{ color:'#f5f0e8', fontWeight:700, marginBottom:16, fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>{title}</h4>
              <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:10 }}>
                {items.map(({ label, href }) => (
                  <li key={label}><Link to={href} style={{ color:'rgba(245,240,232,0.35)', fontSize:'0.875rem', textDecoration:'none', transition:'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color=G}
                    onMouseLeave={e => e.currentTarget.style.color='rgba(245,240,232,0.35)'}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 style={{ color:'#f5f0e8', fontWeight:700, marginBottom:16, fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>Contact</h4>
            <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:12 }}>
              {[{ icon:FiPhone, text:'+91 98765 43210' },{ icon:FiMail, text:'info@smarthospital.com' },{ icon:FiMapPin, text:'Mumbai, Maharashtra' }].map(({ icon:Icon, text }) => (
                <li key={text} style={{ display:'flex', alignItems:'center', gap:10, color:'rgba(245,240,232,0.35)', fontSize:'0.875rem' }}>
                  <Icon size={13} style={{ color:G, flexShrink:0 }}/> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ maxWidth:1200, margin:'40px auto 0', paddingTop:24, borderTop:'1px solid rgba(245,166,35,0.06)', textAlign:'center', fontSize:'0.78rem', color:'rgba(245,240,232,0.2)' }}>
          © 2024 Smart Hospital Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
