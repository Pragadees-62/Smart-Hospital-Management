/**
 * Doctor Dashboard
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar, FiUsers, FiClock, FiCheckCircle,
  FiArrowRight, FiAlertCircle, FiActivity
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

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [todayApts, setTodayApts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Build chart data from analytics
  const chartData = analytics?.appointments_by_date
    ? Object.entries(analytics.appointments_by_date).slice(-7).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        appointments: count
      }))
    : [];

  const stats = analytics ? [
    { title: "Today's Appointments", value: analytics.today_appointments, icon: FiCalendar, color: 'blue' },
    { title: 'Total Patients', value: analytics.total_patients, icon: FiUsers, color: 'green' },
    { title: 'Pending', value: analytics.pending_appointments, icon: FiClock, color: 'orange' },
    { title: 'Completed', value: analytics.total_patients, icon: FiCheckCircle, color: 'purple' },
  ] : [];

  return (
    <DashboardLayout title="Doctor Dashboard">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, Dr. {user?.full_name?.split(' ')[0]}! 👨‍⚕️
        </h2>
        <p className="text-gray-500 mt-1">Here's your practice overview for today.</p>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FiCalendar size={18} className="text-blue-600" /> Today's Appointments
              </h3>
              <Link to="/doctor/appointments" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-5"><SkeletonCard /></div>
              ) : todayApts.length > 0 ? (
                todayApts.map(apt => (
                  <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {apt.patients?.users?.full_name?.[0] || 'P'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {apt.patients?.users?.full_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(apt.appointment_time)} • Token: {apt.queue_token}
                          </p>
                          {apt.reason && <p className="text-xs text-gray-400 truncate max-w-[200px]">{apt.reason}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={getStatusClass(apt.status)}>{apt.status}</span>
                        {apt.status === 'pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Confirm"
                            >
                              <FiCheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                              className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                              title="Cancel"
                            >
                              <FiAlertCircle size={14} />
                            </button>
                          </div>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(apt.id, 'in_progress')}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                          >
                            Start
                          </button>
                        )}
                        {apt.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusUpdate(apt.id, 'completed')}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <FiCalendar size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No appointments today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { to: '/doctor/appointments', icon: FiCalendar, label: 'View Appointments', color: 'blue' },
                { to: '/doctor/patients', icon: FiUsers, label: 'My Patients', color: 'green' },
                { to: '/doctor/prescriptions', icon: FiActivity, label: 'Prescriptions', color: 'purple' },
                { to: '/doctor/availability', icon: FiClock, label: 'Set Availability', color: 'orange' },
              ].map(({ to, icon: Icon, label, color }) => (
                <Link key={to} to={to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-emerald-100' :
                    color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <Icon size={16} className={
                      color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-emerald-600' :
                      color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                    } />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{label}</span>
                  <FiArrowRight size={14} className="ml-auto text-gray-400 group-hover:text-blue-600" />
                </Link>
              ))}
            </div>
          </div>

          {/* Weekly Chart */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiActivity size={16} className="text-blue-600" /> Weekly Appointments
              </h3>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorApt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="appointments" stroke="#3b82f6" fill="url(#colorApt)" strokeWidth={2} />
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
