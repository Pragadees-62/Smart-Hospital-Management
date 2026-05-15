/**
 * Admin Dashboard
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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data.data);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const stats = data ? [
    { title: 'Total Patients', value: data.stats.total_patients, icon: FiUsers, color: 'blue' },
    { title: 'Total Doctors', value: data.stats.total_doctors, icon: FiActivity, color: 'green' },
    { title: "Today's Appointments", value: data.stats.today_appointments, icon: FiCalendar, color: 'purple' },
    { title: 'Monthly Revenue', value: formatCurrency(data.stats.monthly_revenue), icon: FiDollarSign, color: 'orange' },
    { title: 'Pending Appointments', value: data.stats.pending_appointments, icon: FiCalendar, color: 'cyan' },
    { title: 'Emergency Cases', value: data.stats.emergency_cases, icon: FiAlertCircle, color: 'red' },
  ] : [];

  // Chart data
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
    { name: 'Available', value: data.bed_stats.available },
    { name: 'Occupied', value: data.bed_stats.occupied },
    { name: 'Maintenance', value: data.bed_stats.maintenance },
  ] : [];

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.full_name?.split(' ')[0]}! 🏥
        </h2>
        <p className="text-gray-500 mt-1">Hospital management overview</p>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Daily Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Weekly Appointments</h3>
          {dailyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyChartData}>
                <defs>
                  <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="appointments" stroke="#3b82f6" fill="url(#colorAdmin)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-400">No data yet</div>
          )}
        </div>

        {/* Bed Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Bed Availability</h3>
          {bedData.some(b => b.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={bedData} cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                    paddingAngle={5} dataKey="value">
                    {bedData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {bedData.map((b, i) => (
                  <div key={b.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-gray-600">{b.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{b.value}</span>
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
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department Chart */}
        {deptChartData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Appointments by Department</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deptChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">Recent Appointments</h3>
            <Link to="/admin/appointments" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto custom-scroll">
            {loading ? (
              <div className="p-4"><SkeletonCard /></div>
            ) : data?.recent_appointments?.slice(0, 8).map(apt => (
              <div key={apt.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{apt.patients?.users?.full_name}</p>
                    <p className="text-xs text-gray-500">Dr. {apt.doctors?.users?.full_name} • {apt.doctors?.departments?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(apt.appointment_date)}</p>
                    <span className={getStatusClass(apt.status)}>{apt.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { to: '/admin/doctors', label: 'Manage Doctors', icon: FiActivity, color: 'blue' },
          { to: '/admin/patients', label: 'Manage Patients', icon: FiUsers, color: 'green' },
          { to: '/admin/revenue', label: 'Revenue Analytics', icon: FiDollarSign, color: 'orange' },
          { to: '/admin/emergency', label: 'Emergency Cases', icon: FiAlertCircle, color: 'red' },
        ].map(({ to, label, icon: Icon, color }) => (
          <Link key={to} to={to}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all group flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-emerald-100' :
              color === 'orange' ? 'bg-orange-100' : 'bg-red-100'
            }`}>
              <Icon size={18} className={
                color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-emerald-600' :
                color === 'orange' ? 'text-orange-600' : 'text-red-600'
              } />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">{label}</span>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
