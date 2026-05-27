/**
 * Doctor Dashboard — Premium Redesign v2.0
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar, FiUsers, FiClock, FiCheckCircle,
  FiArrowRight, FiAlertCircle, FiActivity, FiFileText
} from 'react-icons/fi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatTime, getStatusClass, getGreeting } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card px-4 py-3 text-sm">
        <p className="font-bold text-gray-900">{label}</p>
        <p style={{ color: '#00d4b8' }} className="font-semibold">{payload[0].value} appointments</p>
      </div>
    );
  }
  return null;
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [todayApts, setTodayApts] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/doctors/analytics/stats');
      setAnalytics(res.data.data);
    } catch { toast.error('Failed to load analytics'); }
  };

  const fetchTodayApts = async () => {
    try {
      const res = await api.get('/appointments/today');
      setTodayApts(res.data.data || []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchTodayApts()]).finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      fetchTodayApts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const chartData = analytics?.appointments_by_date
    ? Object.entries(analytics.appointments_by_date).slice(-7).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        appointments: count
      }))
    : [];

  const stats = analytics ? [
    { title: "Today's Appointments", value: analytics.today_appointments,  icon: FiCalendar,    color: 'cyan'   },
    { title: 'Total Patients',       value: analytics.total_patients,       icon: FiUsers,       color: 'green'  },
    { title: 'Pending',              value: analytics.pending_appointments, icon: FiClock,       color: 'orange' },
    { title: 'Completed',            value: analytics.total_patients,       icon: FiCheckCircle, color: 'purple' },
  ] : [];

  const quickLinks = [
    { to: '/doctor/appointments',  icon: FiCalendar, label: 'View Appointments', grad: 'linear-gradient(135deg,#0f2040,#1e3a8a)' },
    { to: '/doctor/patients',      icon: FiUsers,    label: 'My Patients',       grad: 'linear-gradient(135deg,#059669,#34d399)' },
    { to: '/doctor/prescriptions', icon: FiFileText, label: 'Prescriptions',     grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
    { to: '/doctor/availability',  icon: FiClock,    label: 'Set Availability',  grad: 'linear-gradient(135deg,#d97706,#fbbf24)' },
  ];

  return (
    <DashboardLayout title="Doctor Dashboard">
      {/* Greeting banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 mb-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 60%, #34d399 100%)' }}>
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #ffffff, transparent)', transform: 'translate(30%,-30%)' }} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-emerald-200 text-sm font-semibold mb-1">{getGreeting()} 👨‍⚕️</p>
            <h2 className="text-2xl font-black text-white tracking-tight">Dr. {user?.full_name?.split(' ')[0]}</h2>
            <p className="text-emerald-200/70 text-sm mt-1">Here's your practice overview for today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/doctor/appointments"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-emerald-800 text-sm transition-all hover:shadow-lg"
              style={{ background: 'rgba(255,255,255,0.9)' }}>
              Today's Schedule <FiArrowRight size={14} />
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
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900 flex items-center gap-2 text-base">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.12)' }}>
                  <FiCalendar size={15} className="text-emerald-600" />
                </div>
                Today's Appointments
              </h3>
              <Link to="/doctor/appointments" className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors text-emerald-600">
                View All <FiArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-6"><SkeletonCard /></div>
              ) : todayApts.length > 0 ? (
                todayApts.map(apt => (
                  <div key={apt.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #065f46, #059669)' }}>
                          {apt.patients?.users?.full_name?.[0] || 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{apt.patients?.users?.full_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatTime(apt.appointment_time)} · Token: {apt.queue_token}</p>
                          {apt.reason && <p className="text-xs text-gray-400 truncate max-w-[180px] mt-0.5">{apt.reason}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${getStatusClass(apt.status)}`}>{apt.status}</span>
                        {apt.status === 'pending' && (
                          <div className="flex gap-1">
                            <button onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                              className="p-1.5 rounded-xl hover:scale-105 transition-transform" style={{ background: 'rgba(52,211,153,0.12)' }} title="Confirm">
                              <FiCheckCircle size={14} className="text-emerald-600" />
                            </button>
                            <button onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                              className="p-1.5 rounded-xl hover:scale-105 transition-transform" style={{ background: 'rgba(255,107,107,0.12)' }} title="Cancel">
                              <FiAlertCircle size={14} className="text-red-500" />
                            </button>
                          </div>
                        )}
                        {apt.status === 'confirmed' && (
                          <button onClick={() => handleStatusUpdate(apt.id, 'in_progress')}
                            className="text-xs px-3 py-1.5 rounded-xl font-bold text-white transition-all hover:shadow-md"
                            style={{ background: 'linear-gradient(135deg,#0f2040,#1e3a8a)' }}>
                            Start
                          </button>
                        )}
                        {apt.status === 'in_progress' && (
                          <button onClick={() => handleStatusUpdate(apt.id, 'completed')}
                            className="text-xs px-3 py-1.5 rounded-xl font-bold text-white transition-all hover:shadow-md"
                            style={{ background: 'linear-gradient(135deg,#059669,#34d399)' }}>
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(52,211,153,0.08)' }}>
                    <FiCalendar size={28} className="text-emerald-500" />
                  </div>
                  <p className="text-gray-500 font-semibold">No appointments today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Quick Links */}
          <div className="card p-5">
            <h3 className="font-black text-gray-900 mb-4 text-base">Quick Actions</h3>
            <div className="space-y-2">
              {quickLinks.map(({ to, icon: Icon, label, grad }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                    style={{ background: grad }}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{label}</span>
                  <FiArrowRight size={13} className="ml-auto text-gray-300 group-hover:text-gray-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Weekly Chart */}
          {chartData.length > 0 && (
            <div className="card p-5">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-base">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,184,0.1)' }}>
                  <FiActivity size={13} style={{ color: '#00d4b8' }} />
                </div>
                Weekly Appointments
              </h3>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="docGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#00d4b8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00d4b8" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="appointments" stroke="#00d4b8" fill="url(#docGrad)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
