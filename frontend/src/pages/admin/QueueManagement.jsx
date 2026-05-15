/**
 * Admin Queue Management
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiArrowRight, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatTime, getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const QueueManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueStats, setQueueStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors', { params: { limit: 50 } });
      setDoctors(res.data.data || []);
    } catch { /* ignore */ } finally { setDoctorsLoading(false); }
  };

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/queue/${selectedDoctor.id}`, { params: { date } });
      setQueue(res.data.data || []);
      setQueueStats(res.data.stats || {});
    } catch { toast.error('Failed to load queue'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDoctors(); }, []);
  useEffect(() => { if (selectedDoctor) fetchQueue(); }, [selectedDoctor, date]);

  const callNext = async () => {
    try {
      const res = await api.post(`/queue/${selectedDoctor.id}/next`);
      toast.success(res.data.message);
      fetchQueue();
    } catch { toast.error('Failed to call next patient'); }
  };

  const statusColors = {
    waiting: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <DashboardLayout title="Queue Management">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Doctor List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Select Doctor</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto custom-scroll">
            {doctorsLoading ? <LoadingSpinner size="sm" /> : doctors.map(d => (
              <button key={d.id} onClick={() => setSelectedDoctor(d)}
                className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                  selectedDoctor?.id === d.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                }`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(d.users?.full_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">Dr. {d.users?.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{d.specialization}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Queue View */}
        <div className="lg:col-span-3">
          {!selectedDoctor ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <FiUsers size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Select a doctor to view their queue</p>
            </div>
          ) : (
            <>
              {/* Queue Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">Dr. {selectedDoctor.users?.full_name}</h3>
                    <p className="text-sm text-gray-500">{selectedDoctor.specialization}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      className="input-field py-2 text-sm w-40" />
                    <button onClick={callNext} className="btn-primary flex items-center gap-2 text-sm">
                      <FiArrowRight size={15} /> Call Next
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {[
                    { label: 'Total', value: queueStats.total || 0, color: 'blue' },
                    { label: 'Waiting', value: queueStats.waiting || 0, color: 'yellow' },
                    { label: 'In Progress', value: queueStats.in_progress || 0, color: 'purple' },
                    { label: 'Completed', value: queueStats.completed || 0, color: 'green' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`rounded-xl p-3 text-center ${
                      color === 'blue' ? 'bg-blue-50' : color === 'yellow' ? 'bg-yellow-50' :
                      color === 'purple' ? 'bg-purple-50' : 'bg-green-50'
                    }`}>
                      <p className={`text-2xl font-bold ${
                        color === 'blue' ? 'text-blue-700' : color === 'yellow' ? 'text-yellow-700' :
                        color === 'purple' ? 'text-purple-700' : 'text-green-700'
                      }`}>{value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {queueStats.current_token && (
                  <div className="mt-3 bg-blue-600 text-white rounded-xl p-3 flex items-center gap-3">
                    <FiClock size={18} />
                    <span className="font-semibold">Now Serving: Token {queueStats.current_token}</span>
                  </div>
                )}
              </div>

              {/* Queue List */}
              {loading ? <LoadingSpinner /> : (
                <div className="space-y-2">
                  {queue.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                      <FiClock size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No patients in queue for this date</p>
                    </div>
                  ) : (
                    queue.map((token, i) => (
                      <motion.div key={token.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`bg-white rounded-2xl border p-4 flex items-center gap-4 ${
                          token.status === 'in_progress' ? 'border-blue-300 bg-blue-50/30' : 'border-gray-100'
                        }`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                          token.status === 'in_progress' ? 'bg-blue-600 text-white' :
                          token.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {token.token_code}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{token.patients?.users?.full_name}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(token.appointments?.appointment_time)} • {token.appointments?.reason}
                          </p>
                        </div>
                        <span className={`badge ${statusColors[token.status] || 'bg-gray-100 text-gray-700'}`}>
                          {token.status}
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QueueManagement;
