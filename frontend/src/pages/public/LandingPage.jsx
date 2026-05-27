/**
 * Landing Page — Premium Redesign v2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar, FiActivity, FiShield, FiClock, FiUsers,
  FiStar, FiArrowRight, FiPhone, FiMail, FiMapPin,
  FiHeart, FiCheckCircle, FiZap, FiAward, FiTrendingUp
} from 'react-icons/fi';
import Navbar from '../../components/common/Navbar';

const features = [
  { icon: FiCalendar,  title: 'Smart Scheduling',       desc: 'Book appointments with top specialists in seconds. AI-powered slot recommendations.',  grad: 'from-cyan-400 to-teal-500',    bg: 'rgba(0,212,184,0.08)' },
  { icon: FiActivity,  title: 'Live Queue Tracking',    desc: 'Real-time queue position updates. Get notified the moment your turn approaches.',       grad: 'from-emerald-400 to-green-500', bg: 'rgba(52,211,153,0.08)' },
  { icon: FiShield,    title: 'Encrypted Records',      desc: 'Military-grade encryption for all health data with role-based access control.',          grad: 'from-violet-400 to-purple-600', bg: 'rgba(139,92,246,0.08)' },
  { icon: FiClock,     title: '24/7 Emergency Care',    desc: 'Round-the-clock emergency monitoring with priority case escalation system.',             grad: 'from-red-400 to-rose-500',      bg: 'rgba(255,107,107,0.08)' },
  { icon: FiUsers,     title: '150+ Specialists',       desc: 'Access verified doctors across 25+ specializations with verified credentials.',          grad: 'from-orange-400 to-amber-500',  bg: 'rgba(251,191,36,0.08)' },
  { icon: FiHeart,     title: 'AI Health Insights',     desc: 'Preliminary health analysis powered by advanced AI symptom recognition engine.',         grad: 'from-pink-400 to-rose-500',     bg: 'rgba(244,114,182,0.08)' },
];

const stats = [
  { value: '10K+', label: 'Patients Served',   icon: FiUsers,      color: '#00d4b8' },
  { value: '150+', label: 'Expert Doctors',    icon: FiAward,      color: '#8b5cf6' },
  { value: '25+',  label: 'Departments',       icon: FiActivity,   color: '#f59e0b' },
  { value: '98%',  label: 'Satisfaction Rate', icon: FiTrendingUp, color: '#34d399' },
];

const departments = [
  { name: 'Cardiology',    icon: '❤️',  count: '12 Doctors' },
  { name: 'Neurology',     icon: '🧠',  count: '8 Doctors'  },
  { name: 'Orthopedics',   icon: '🦴',  count: '10 Doctors' },
  { name: 'Pediatrics',    icon: '👶',  count: '15 Doctors' },
  { name: 'Oncology',      icon: '🔬',  count: '7 Doctors'  },
  { name: 'Dermatology',   icon: '🌿',  count: '9 Doctors'  },
  { name: 'Ophthalmology', icon: '👁️', count: '6 Doctors'  },
  { name: 'Gynecology',    icon: '🌸',  count: '11 Doctors' },
];

const testimonials = [
  { name: 'Priya Sharma',  role: 'Patient',       text: 'The online appointment system is incredibly smooth. Booked a consultation in under 2 minutes!', rating: 5, avatar: 'PS' },
  { name: 'Rahul Mehta',   role: 'Patient',       text: 'Real-time queue tracking saved me so much waiting time. Highly recommend Smart Hospital.',       rating: 5, avatar: 'RM' },
  { name: 'Dr. Anita Patel', role: 'Cardiologist', text: 'The doctor dashboard makes managing appointments and prescriptions completely effortless.',      rating: 5, avatar: 'AP' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  viewport: { once: true },
});

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative hero-bg dot-pattern min-h-screen flex items-center pt-20 pb-16 px-4 overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00d4b8, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}>
              <div className="pill pill-teal mb-6 w-fit">
                <FiZap size={12} /> Smart Healthcare Platform
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
                Your Health,{' '}
                <span className="text-grad-teal">Our Priority</span>
              </h1>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-lg">
                Experience world-class healthcare with seamless appointment booking, real-time queue tracking, digital prescriptions, and AI-powered health insights.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/register" className="btn-teal text-base px-8 py-3.5 font-bold">
                  Get Started Free <FiArrowRight size={18} />
                </Link>
                <Link to="/services" className="flex items-center gap-2 text-base px-8 py-3.5 font-semibold text-white border border-white/20 rounded-2xl hover:bg-white/10 transition-all">
                  Explore Services
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                {[
                  { icon: FiCheckCircle, text: 'No waiting in queues' },
                  { icon: FiCheckCircle, text: 'Digital prescriptions' },
                  { icon: FiCheckCircle, text: 'Secure & private' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-slate-300">
                    <Icon size={15} className="text-teal-400" /> {text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Stats card */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22,1,0.36,1] }} className="relative">
              <div className="glass-navy rounded-3xl p-8 neon-border-teal">
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-6">Hospital at a Glance</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {stats.map(({ value, label, icon: Icon, color }) => (
                    <div key={label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <Icon size={20} className="mx-auto mb-2" style={{ color }} />
                      <p className="text-3xl font-black text-white">{value}</p>
                      <p className="text-slate-400 text-xs mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl p-4" style={{ background: 'rgba(0,212,184,0.08)', border: '1px solid rgba(0,212,184,0.2)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,184,0.2)' }}>
                      <FiCalendar size={18} className="text-teal-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">Next Available Slot</p>
                      <p className="text-teal-400 text-xs">Today, 2:30 PM</p>
                    </div>
                  </div>
                  <Link to="/register" className="block w-full btn-teal text-center text-sm py-2.5 rounded-xl font-bold">
                    Book Now →
                  </Link>
                </div>
              </div>
              {/* Floating badge */}
              <motion.div animate={{ y: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -top-5 -right-5 glass rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-white/40">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.2)' }}>
                  <FiCheckCircle size={16} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Appointment Confirmed</p>
                  <p className="text-xs text-gray-500">Token: A042</p>
                </div>
              </motion.div>
              <motion.div animate={{ y: [6, -6, 6] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -bottom-5 -left-5 glass rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-white/40">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
                  <FiActivity size={16} className="text-violet-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Queue Position</p>
                  <p className="text-xs text-gray-500">#3 — ~12 min wait</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <div className="pill pill-navy mb-4 mx-auto w-fit">Platform Features</div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              A complete healthcare management platform built for patients, doctors, and administrators.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, grad, bg }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.08)}
                className="group relative p-7 rounded-3xl border border-gray-100 hover:border-transparent transition-all duration-300 cursor-default overflow-hidden"
                style={{ background: '#fff' }}
                whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: bg }} />
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="relative font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="relative text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPARTMENTS ──────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <div className="pill pill-teal mb-4 mx-auto w-fit">Medical Specialties</div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">Our Departments</h2>
            <p className="text-gray-500 text-lg">Specialized care across all major medical disciplines</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {departments.map(({ name, icon, count }, i) => (
              <motion.div key={name} {...fadeUp(i * 0.06)}
                className="card card-hover p-6 text-center cursor-pointer group"
                whileHover={{ y: -4 }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 text-base">{name}</h3>
                <p className="text-sm text-gray-400 font-medium">{count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <div className="pill pill-violet mb-4 mx-auto w-fit">Patient Stories</div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">What People Say</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, rating, avatar }, i) => (
              <motion.div key={name} {...fadeUp(i * 0.1)}
                className="relative p-7 rounded-3xl border border-gray-100 hover:border-violet-200 transition-all duration-300 group"
                whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(139,92,246,0.1)' }}
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: rating }).map((_, j) => (
                    <FiStar key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #0f2040, #162d58)' }}>
                    {avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 hero-bg dot-pattern relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00d4b8, transparent)' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp()}>
            <div className="pill pill-teal mb-6 mx-auto w-fit">Join Us Today</div>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Ready to Get <span className="text-grad-teal">Started?</span>
            </h2>
            <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of patients who trust Smart Hospital for their healthcare needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-teal text-base px-10 py-4 font-bold">
                Create Free Account <FiArrowRight size={18} />
              </Link>
              <Link to="/contact" className="flex items-center gap-2 text-base px-10 py-4 font-semibold text-white border border-white/20 rounded-2xl hover:bg-white/10 transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: '#050d1a' }} className="text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4b8, #0ea5e9)' }}>
                <span className="text-white font-black text-lg">H</span>
              </div>
              <span className="text-white font-black text-xl tracking-tight">SmartHospital</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">Modern healthcare management platform for patients, doctors, and administrators.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {['Home', 'About', 'Services', 'Contact'].map(l => (
                <li key={l}><Link to={`/${l.toLowerCase()}`} className="hover:text-teal-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Services</h4>
            <ul className="space-y-3 text-sm">
              {['Appointment Booking', 'Queue Tracking', 'Prescriptions', 'Emergency Care'].map(s => (
                <li key={s}><span className="hover:text-teal-400 transition-colors cursor-pointer">{s}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3"><FiPhone size={14} className="text-teal-400" /> +91 98765 43210</li>
              <li className="flex items-center gap-3"><FiMail size={14} className="text-teal-400" /> info@smarthospital.com</li>
              <li className="flex items-center gap-3"><FiMapPin size={14} className="text-teal-400" /> Mumbai, Maharashtra</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-sm text-slate-600">
          © 2024 Smart Hospital Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
