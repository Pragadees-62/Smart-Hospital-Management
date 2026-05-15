/**
 * My Appointments Page — Patient
 * Includes feedback/rating modal for completed appointments.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar, FiClock, FiSearch, FiX, FiEye, FiStar
} from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FeedbackModal from '../../components/patient/FeedbackModal';
import api from '../../utils/api';
import { formatDate, formatTime, getStatusClass } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MyAppointments = () => {
  const [appointments, setAppointments]     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [filter, setFilter]                 = useState('all');
  const [search, setSearch]                 = useState('');
  const [selected, setSelected]             = useState(null);
  const [feedbackModal, setFeedbackModal]   = useState(null);   // appointment object
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [feedbackMap, setFeedbackMap]       = useState({});     // appointmentId → feedback

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      const res = await api.get('/appointments', { params });
      const apts = res.data.data || [];
      setAppointments(apts);

      // Pre-fetch feedback status for all completed appointments
      const completed = apts.filter(a => a.status === 'completed');
      const map = {};
      await Promise.all(
        completed.map(async a => {
          try {
            const r = await api.get(`/feedback/${a.id}`);
            if (r.data.data) map[a.id] = r.data.data;
          } catch { /* ignore */ }
        })
      );
      setFeedbackMap(map);
    } catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const openFeedback = async (apt) => {
    setFeedbackModal(apt);
    setExistingFeedback(feedbackMap[apt.id] || null);
  };

  const filtered = appointments.filter(a =>
    a.doctors?.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.doctors?.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const statusFilters = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

  return (
    <DashboardLayout title="My Appointments">

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by doctor name..."
              className="input-field pl-9 py-2.5 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Appointment list ─────────────────────────────────────────────────── */}
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <FiCalendar size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No appointments found</p>
            </div>
          ) : (
            filtered.map((apt, i) => {
              const hasFeedback = !!feedbackMap[apt.id];
              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Doctor info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                        {apt.doctors?.users?.full_name?.[0] || 'D'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Dr. {apt.doctors?.users?.full_name}</h3>
                        <p className="text-sm text-blue-600">{apt.doctors?.specialization}</p>
                        <p className="text-xs text-gray-500">{apt.doctors?.departments?.name}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <FiCalendar size={12} /> {formatDate(apt.appointment_date)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <FiClock size={12} /> {formatTime(apt.appointment_time)}
                          </span>
                        </div>
                        {apt.queue_token && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            Token: {apt.queue_token}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <span className={getStatusClass(apt.status)}>{apt.status}</span>
                      <div className="flex gap-2">
                        {/* View details */}
                        <button
                          onClick={() => setSelected(apt)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors"
                          title="View details"
                        >
                          <FiEye size={15} />
                        </button>

                        {/* Feedback button — only for completed */}
                        {apt.status === 'completed' && (
                          <button
                            onClick={() => openFeedback(apt)}
                            title={hasFeedback ? 'View your feedback' : 'Rate this consultation'}
                            className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
                              hasFeedback
                                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                : 'bg-yellow-400 text-white hover:bg-yellow-500'
                            }`}
                          >
                            <FiStar size={14} className={hasFeedback ? 'fill-yellow-500' : ''} />
                            {hasFeedback ? feedbackMap[apt.id].rating : 'Rate'}
                          </button>
                        )}

                        {/* Cancel */}
                        {['pending', 'confirmed'].includes(apt.status) && (
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                            title="Cancel appointment"
                          >
                            <FiX size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  {apt.reason && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Reason:</span> {apt.reason}
                      </p>
                    </div>
                  )}

                  {/* Feedback preview if submitted */}
                  {hasFeedback && (
                    <div className="mt-2 flex items-center gap-2 bg-yellow-50 rounded-xl px-3 py-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <FiStar
                            key={s}
                            size={12}
                            className={s <= feedbackMap[apt.id].rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      {feedbackMap[apt.id].comment && (
                        <p className="text-xs text-yellow-700 truncate max-w-xs">
                          "{feedbackMap[apt.id].comment}"
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Appointment Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <FiX size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                ['Doctor',         `Dr. ${selected.doctors?.users?.full_name}`],
                ['Specialization', selected.doctors?.specialization],
                ['Department',     selected.doctors?.departments?.name],
                ['Date',           formatDate(selected.appointment_date)],
                ['Time',           formatTime(selected.appointment_time)],
                ['Token',          selected.queue_token || 'N/A'],
                ['Type',           selected.type],
                ['Reason',         selected.reason],
                ['Status',         selected.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">
                    {value || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
            {selected.doctor_notes && (
              <div className="mt-4 bg-blue-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">Doctor's Notes</p>
                <p className="text-sm text-blue-800">{selected.doctor_notes}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* ── Feedback Modal ───────────────────────────────────────────────────── */}
      {feedbackModal && (
        <FeedbackModal
          appointment={feedbackModal}
          existingFeedback={existingFeedback}
          onClose={() => { setFeedbackModal(null); setExistingFeedback(null); }}
          onSubmitted={fetchAppointments}
        />
      )}
    </DashboardLayout>
  );
};

export default MyAppointments;
