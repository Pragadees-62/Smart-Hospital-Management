/**
 * Patient Dashboard
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar, FiFileText, FiDollarSign, FiBell,
  FiClock, FiCheckCircle, FiAlertCircle, FiArrowRight
} from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard } from '../../components/common/LoadingSpinner';
import SymptomChecker from '../../components/patient/SymptomChecker';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDate, formatTime, getStatusClass, getGreeting } from '../../utils/helpers';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/patients/dashboard');
        setData(res.data.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = data ? [
    { title: 'Total Appointments', value: data.total_appointments, icon: FiCalendar, color: 'blue' },
    { title: 'Completed', value: data.completed_appointments, icon: FiCheckCircle, color: 'green' },
    { title: 'Prescriptions', value: data.recent_prescriptions?.length || 0, icon: FiFileText, color: 'purple' },
    { title: 'Pending Bills', value: data.pending_bills?.length || 0, icon: FiDollarSign, color: 'orange' },
  ] : [];

  return (
    <DashboardLayout title="Patient Dashboard">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.full_name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-gray-500 mt-1">Here's your health summary for today.</p>
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
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FiCalendar size={18} className="text-blue-600" /> Upcoming Appointments
              </h3>
              <Link to="/patient/appointments" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-5"><SkeletonCard /></div>
              ) : data?.upcoming_appointments?.length > 0 ? (
                data.upcoming_appointments.map((apt) => (
                  <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <FiCalendar size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            Dr. {apt.doctors?.users?.full_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {apt.doctors?.departments?.name} • {apt.doctors?.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatDate(apt.appointment_date)}</p>
                        <p className="text-xs text-gray-500">{formatTime(apt.appointment_time)}</p>
                        <span className={getStatusClass(apt.status)}>{apt.status}</span>
                      </div>
                    </div>
                    {apt.queue_token && (
                      <div className="mt-2 flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1.5">
                        <FiClock size={13} className="text-blue-600" />
                        <span className="text-xs text-blue-700 font-medium">Token: {apt.queue_token}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <FiCalendar size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No upcoming appointments</p>
                  <Link to="/patient/book-appointment" className="btn-primary text-sm mt-3 inline-block">
                    Book Now
                  </Link>
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
                { to: '/patient/book-appointment', icon: FiCalendar, label: 'Book Appointment', color: 'blue' },
                { to: '/patient/prescriptions', icon: FiFileText, label: 'View Prescriptions', color: 'purple' },
                { to: '/patient/payments', icon: FiDollarSign, label: 'Pay Bills', color: 'green' },
                { to: '/patient/notifications', icon: FiBell, label: 'Notifications', color: 'orange' },
              ].map(({ to, icon: Icon, label, color }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    color === 'blue' ? 'bg-blue-100' : color === 'purple' ? 'bg-purple-100' :
                    color === 'green' ? 'bg-emerald-100' : 'bg-orange-100'
                  }`}>
                    <Icon size={16} className={
                      color === 'blue' ? 'text-blue-600' : color === 'purple' ? 'text-purple-600' :
                      color === 'green' ? 'text-emerald-600' : 'text-orange-600'
                    } />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
                  <FiArrowRight size={14} className="ml-auto text-gray-400 group-hover:text-blue-600" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiFileText size={16} className="text-purple-600" /> Recent Prescriptions
            </h3>
            {loading ? <SkeletonCard /> : data?.recent_prescriptions?.length > 0 ? (
              <div className="space-y-3">
                {data.recent_prescriptions.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiFileText size={14} className="text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.diagnosis}</p>
                      <p className="text-xs text-gray-500">Dr. {p.doctors?.users?.full_name}</p>
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
            <div className="bg-orange-50 rounded-2xl border border-orange-100 p-5">
              <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                <FiAlertCircle size={16} /> Pending Bills
              </h3>
              {data.pending_bills.map(bill => (
                <div key={bill.id} className="flex items-center justify-between py-2">
                  <span className="text-sm text-orange-700">Bill #{bill.id?.slice(0, 8)}</span>
                  <span className="font-bold text-orange-800">₹{bill.amount}</span>
                </div>
              ))}
              <Link to="/patient/payments" className="block mt-3 text-center text-sm font-semibold text-orange-700 hover:underline">
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
