/**
 * Patient Dashboard — Premium Redesign v2.0
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar, FiFileText, FiDollarSign, FiBell,
  FiClock, FiCheckCircle, FiAlertCircle, FiArrowRight, FiActivity
} from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard } from '../../components/common/LoadingSpinner';
import SymptomChecker from '../../components/patient/SymptomChecker';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDate, formatTime, getStatusClass, getGreeting } from '../../utils/helpers';
import toast from 'react-hot-toast';

const quickActions = [
  { to: '/patient/book-appointment', icon: FiCalendar,  label: 'Book Appointment', sub: 'Find a doctor',      grad: 'linear-gradient(135deg,#0f2040,#1e3a8a)', glow: 'rgba(30,58,138,0.2)'  },
  { to: '/patient/prescriptions',    icon: FiFileText,  label: 'Prescriptions',    sub: 'View your meds',     grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)', glow: 'rgba(124,58,237,0.2)' },
  { to: '/patient/payments',         icon: FiDollarSign,label: 'Pay Bills',        sub: 'Pending payments',   grad: 'linear-gradient(135deg,#059669,#34d399)', glow: 'rgba(5,150,105,0.2)'  },
  { to: '/patient/notifications',    icon: FiBell,      label: 'Notifications',    sub: 'Stay updated',       grad: 'linear-gradient(135deg,#d97706,#fbbf24)', glow: 'rgba(217,119,6,0.2)'  },
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patients/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { title: 'Total Appointments', value: data.total_appointments,              icon: FiCalendar,     color: 'blue'   },
    { title: 'Completed',          value: data.completed_appointments,          icon: FiCheckCircle,  color: 'green'  },
    { title: 'Prescriptions',      value: data.recent_prescriptions?.length||0, icon: FiFileText,     color: 'purple' },
    { title: 'Pending Bills',      value: data.pending_bills?.length||0,        icon: FiDollarSign,   color: 'orange' },
  ] : [];

  return (
    <DashboardLayout title="Patient Dashboard">
      {/* Greeting banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 mb-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2040 0%, #162d58 60%, #1e3a8a 100%)' }}>
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #00d4b8, transparent)', transform: 'translate(30%,-30%)' }} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-teal-400 text-sm font-semibold mb-1">{getGreeting()} 👋</p>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {user?.full_name?.split(' ')[0]}
            </h2>
            <p className="text-slate-400 text-sm mt-1">Here's your health summary for today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/patient/book-appointment" className="btn-teal text-sm px-5 py-2.5">
              Book Appointment <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900 flex items-center gap-2 text-base">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,184,0.1)' }}>
                  <FiCalendar size={15} style={{ color: '#00d4b8' }} />
                </div>
                Upcoming Appointments
              </h3>
              <Link to="/patient/appointments" className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors" style={{ color: '#00d4b8' }}>
                View All <FiArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-6"><SkeletonCard /></div>
              ) : data?.upcoming_appointments?.length > 0 ? (
                data.upcoming_appointments.map((apt) => (
                  <div key={apt.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #0f2040, #1e3a8a)' }}>
                          {apt.doctors?.users?.full_name?.[0] || 'D'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Dr. {apt.doctors?.users?.full_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{apt.doctors?.departments?.name} · {apt.doctors?.specialization}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatDate(apt.appointment_date)}</p>
                        <p className="text-xs text-gray-400">{formatTime(apt.appointment_time)}</p>
                        <span className={`badge mt-1 ${getStatusClass(apt.status)}`}>{apt.status}</span>
                      </div>
                    </div>
                    {apt.queue_token && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(0,212,184,0.06)', border: '1px solid rgba(0,212,184,0.15)' }}>
                        <FiClock size={12} style={{ color: '#00d4b8' }} />
                        <span className="text-xs font-bold" style={{ color: '#0891b2' }}>Queue Token: {apt.queue_token}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,212,184,0.08)' }}>
                    <FiCalendar size={28} style={{ color: '#00d4b8' }} />
                  </div>
                  <p className="text-gray-500 font-semibold mb-1">No upcoming appointments</p>
                  <p className="text-gray-400 text-sm mb-4">Book your first appointment today</p>
                  <Link to="/patient/book-appointment" className="btn-teal text-sm px-6 py-2.5 inline-flex">Book Now</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="font-black text-gray-900 mb-4 text-base">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ to, icon: Icon, label, sub, grad, glow }) => (
                <Link key={to} to={to}
                  className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-transparent transition-all duration-200 text-center"
                  style={{ '--hover-shadow': `0 8px 24px ${glow}` }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 24px ${glow}`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                    style={{ background: grad }}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="card p-5">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-base">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
                <FiFileText size={13} style={{ color: '#7c3aed' }} />
              </div>
              Recent Prescriptions
            </h3>
            {loading ? <SkeletonCard /> : data?.recent_prescriptions?.length > 0 ? (
              <div className="space-y-2.5">
                {data.recent_prescriptions.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.1)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.12)' }}>
                      <FiFileText size={15} style={{ color: '#7c3aed' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{p.diagnosis}</p>
                      <p className="text-xs text-gray-400">Dr. {p.doctors?.users?.full_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No prescriptions yet</p>
            )}
          </div>

          {/* Pending Bills */}
          {data?.pending_bills?.length > 0 && (
            <div className="card p-5" style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.05), rgba(251,191,36,0.05))', border: '1px solid rgba(217,119,6,0.15)' }}>
              <h3 className="font-black text-amber-800 mb-3 flex items-center gap-2 text-base">
                <FiAlertCircle size={16} className="text-amber-600" /> Pending Bills
              </h3>
              {data.pending_bills.map(bill => (
                <div key={bill.id} className="flex items-center justify-between py-2">
                  <span className="text-sm text-amber-700 font-medium">Bill #{bill.id?.slice(0,8)}</span>
                  <span className="font-black text-amber-800">₹{bill.amount}</span>
                </div>
              ))}
              <Link to="/patient/payments" className="block mt-3 text-center text-sm font-bold text-amber-700 hover:underline">
                Pay Now →
              </Link>
            </div>
          )}

          {/* AI Symptom Checker */}
          <SymptomChecker />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
