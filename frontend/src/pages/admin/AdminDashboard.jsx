/**
 * Admin Dashboard — Premium Redesign v2.0
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUsers, FiCalendar, FiDollarSign, FiActivity,
  FiAlertCircle, FiArrowRight
} from 'react-icons/fi';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard } from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatDate, formatCurrency, getStatusClass, getGreeting } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#00d4b8', '#ff6b6b', '#fbbf24'];

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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { title: 'Total Patients',        value: data.stats.total_patients,                    icon: FiUsers,       color: 'blue'   },
    { title: 'Total Doctors',         value: data.stats.total_doctors,                     icon: FiActivity,    color: 'green'  },
    { title: "Today's Appointments",  value: data.stats.today_appointments,                icon: FiCalendar,    color: 'purple' },
    { title: 'Monthly Revenue',       value: formatCurrency(data.stats.monthly_revenue),   icon: FiDollarSign,  color: 'orange' },
    { title: 'Pending Appointments',  value: data.stats.pending_appointments,              icon: FiCalendar,    color: 'cyan'   },
    { title: 'Emergency Cases',       value: data.stats.emergency_cases,                   icon: FiAlertCircle, color: 'red'    },
  ] : [];

  const dailyChartData = data?.daily_stats
    ? Object.entries(data.daily_stats).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        appointments: count
      }))
    : [];

  const deptChartData = data?.department_stats
    ? Object.entries(data.department_stats).map(([name, count]) => ({ name, count }))
    : [];

  const bedData = data?.bed_stats ? [
    { name: 'Available',   value: data.bed_stats.available   },
    { name: 'Occupied',    value: data.bed_stats.occupied    },
    { name: 'Maintenance', value: data.bed_stats.maintenance },
  ] : [];

  const quickLinks = [
    { to: '/admin/doctors',    label: 'Manage Doctors',    icon: FiActivity,    grad: 'linear-gradient(135deg,#0f2040,#1e3a8a)' },
    { to: '/admin/patients',   label: 'Manage Patients',   icon: FiUsers,       grad: 'linear-gradient(135deg,#059669,#34d399)' },
    { to: '/admin/revenue',    label: 'Revenue Analytics', icon: FiDollarSign,  grad: 'linear-gradient(135deg,#d97706,#fbbf24)' },
    { to: '/admin/emergency',  label: 'Emergency Cases',   icon: FiAlertCircle, grad: 'linear-gradient(135deg,#dc2626,#ff6b6b)' },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Greeting banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 mb-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 60%, #a78bfa 100%)' }}>
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #ffffff, transparent)', transform: 'translate(30%,-30%)' }} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-sm font-semibold mb-1">{getGreeting()} 🏥</p>
            <h2 className="text-2xl font-black text-white tracking-tight">{user?.full_name?.split(' ')[0]}</h2>
            <p className="text-violet-200/70 text-sm mt-1">Hospital management overview</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/admin/appointments"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-violet-800 text-sm transition-all hover:shadow-lg"
              style={{ background: 'rgba(255,255,255,0.9)' }}>
              View Appointments <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Appointments */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-black text-gray-900 mb-5 text-base">Weekly Appointments</h3>
          {dailyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyChartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="appointments" stroke="#7c3aed" fill="url(#adminGrad)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          )}
        </div>

        {/* Bed Stats */}
        <div className="card p-6">
          <h3 className="font-black text-gray-900 mb-5 text-base">Bed Availability</h3>
          {bedData.some(b => b.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={bedData} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                    paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {bedData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5 mt-3">
                {bedData.map((b, i) => (
                  <div key={b.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-gray-600 font-medium">{b.name}</span>
                    </div>
                    <span className="font-black text-gray-900">{b.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No bed data</div>
          )}
        </div>
      </div>

      {/* Department Stats & Recent Appointments */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {deptChartData.length > 0 && (
          <div className="card p-6">
            <h3 className="font-black text-gray-900 mb-5 text-base">Appointments by Department</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deptChartData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={90} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="url(#barGrad)">
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#00d4b8" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Appointments */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900 text-base">Recent Appointments</h3>
            <Link to="/admin/appointments" className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors text-violet-600">
              View All <FiArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto custom-scroll">
            {loading ? (
              <div className="p-4"><SkeletonCard /></div>
            ) : data?.recent_appointments?.slice(0, 8).map(apt => (
              <div key={apt.id} className="px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{apt.patients?.users?.full_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Dr. {apt.doctors?.users?.full_name} · {apt.doctors?.departments?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{formatDate(apt.appointment_date)}</p>
                    <span className={`badge mt-1 ${getStatusClass(apt.status)}`}>{apt.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map(({ to, label, icon: Icon, grad }) => (
          <Link key={to} to={to}
            className="card card-hover p-5 flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
              style={{ background: grad }}>
              <Icon size={18} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{label}</span>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
