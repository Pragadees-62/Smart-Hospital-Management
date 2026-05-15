/**
 * Landing Page - Public Homepage
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar, FiActivity, FiShield, FiClock, FiUsers,
  FiStar, FiArrowRight, FiPhone, FiMail, FiMapPin,
  FiHeart, FiCheckCircle
} from 'react-icons/fi';
import Navbar from '../../components/common/Navbar';

const features = [
  { icon: FiCalendar, title: 'Easy Appointment Booking', desc: 'Book appointments with top specialists in just a few clicks, anytime anywhere.', color: 'blue' },
  { icon: FiActivity, title: 'Live Queue Tracking', desc: 'Track your queue position in real-time and get notified when it\'s your turn.', color: 'green' },
  { icon: FiShield, title: 'Secure Medical Records', desc: 'Your health data is encrypted and securely stored with role-based access control.', color: 'purple' },
  { icon: FiClock, title: '24/7 Emergency Support', desc: 'Round-the-clock emergency monitoring and priority case management.', color: 'red' },
  { icon: FiUsers, title: 'Expert Specialists', desc: 'Access a network of 100+ verified doctors across 20+ specializations.', color: 'orange' },
  { icon: FiHeart, title: 'AI Symptom Checker', desc: 'Get preliminary health insights with our AI-powered symptom analysis tool.', color: 'pink' },
];

const stats = [
  { value: '10,000+', label: 'Patients Served' },
  { value: '150+', label: 'Expert Doctors' },
  { value: '25+', label: 'Departments' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const departments = [
  { name: 'Cardiology', icon: '❤️', count: '12 Doctors' },
  { name: 'Neurology', icon: '🧠', count: '8 Doctors' },
  { name: 'Orthopedics', icon: '🦴', count: '10 Doctors' },
  { name: 'Pediatrics', icon: '👶', count: '15 Doctors' },
  { name: 'Oncology', icon: '🔬', count: '7 Doctors' },
  { name: 'Dermatology', icon: '🌿', count: '9 Doctors' },
  { name: 'Ophthalmology', icon: '👁️', count: '6 Doctors' },
  { name: 'Gynecology', icon: '🌸', count: '11 Doctors' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Patient', text: 'The online appointment system is incredibly smooth. I booked a consultation in under 2 minutes!', rating: 5 },
  { name: 'Rahul Mehta', role: 'Patient', text: 'Real-time queue tracking saved me so much waiting time. Highly recommend Smart Hospital.', rating: 5 },
  { name: 'Dr. Anita Patel', role: 'Cardiologist', text: 'The doctor dashboard makes managing appointments and prescriptions effortless.', rating: 5 },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
  orange: 'bg-orange-50 text-orange-600',
  pink: 'bg-pink-50 text-pink-600',
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <FiActivity size={14} /> Smart Healthcare Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Your Health,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Our Priority
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience world-class healthcare with seamless appointment booking, real-time queue tracking, digital prescriptions, and AI-powered health insights.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                  Get Started Free <FiArrowRight size={18} />
                </Link>
                <Link to="/services" className="btn-secondary flex items-center gap-2 text-base px-8 py-3">
                  Explore Services
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                {[
                  { icon: FiCheckCircle, text: 'No waiting in queues' },
                  { icon: FiCheckCircle, text: 'Digital prescriptions' },
                  { icon: FiCheckCircle, text: 'Secure & private' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Icon size={15} className="text-emerald-500" /> {text}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map(({ value, label }) => (
                    <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                      <p className="text-3xl font-extrabold">{value}</p>
                      <p className="text-blue-200 text-sm mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FiCalendar size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">Next Available Slot</p>
                      <p className="text-blue-200 text-sm">Today, 2:30 PM</p>
                    </div>
                  </div>
                  <Link to="/register" className="block w-full bg-white text-blue-700 font-semibold py-2.5 rounded-xl text-center text-sm hover:bg-blue-50 transition-colors">
                    Book Now →
                  </Link>
                </div>
              </div>
              {/* Floating cards */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Appointment Confirmed</p>
                  <p className="text-xs text-gray-500">Token: A042</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              A complete healthcare management platform built for patients, doctors, and administrators.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 ${colorMap[color]} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Departments</h2>
            <p className="text-gray-500 text-lg">Specialized care across all major medical disciplines</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map(({ name, icon, count }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border border-gray-100"
              >
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{name}</h3>
                <p className="text-sm text-gray-500">{count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What People Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, rating }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <FiStar key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 gradient-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 text-xl mb-8">
              Join thousands of patients who trust Smart Hospital for their healthcare needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                Create Free Account
              </Link>
              <Link to="/contact" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-white font-bold text-lg">SmartHospital</span>
            </div>
            <p className="text-sm leading-relaxed">Modern healthcare management platform for patients, doctors, and administrators.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'About', 'Services', 'Contact'].map(l => (
                <li key={l}><Link to={`/${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {['Appointment Booking', 'Queue Tracking', 'Prescriptions', 'Emergency Care'].map(s => (
                <li key={s}><span className="hover:text-white transition-colors cursor-pointer">{s}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><FiPhone size={14} /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><FiMail size={14} /> info@smarthospital.com</li>
              <li className="flex items-center gap-2"><FiMapPin size={14} /> Mumbai, Maharashtra</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          © 2024 Smart Hospital Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
