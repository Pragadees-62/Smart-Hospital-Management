/**
 * Doctor Appointments Page
 * Includes 30-minute consultation timer when a session is started.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar, FiClock, FiSearch, FiCheckCircle, FiX, FiFileText, FiPlay
} from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConsultationTimer from '../../components/doctor/ConsultationTimer';
import api from '../../utils/api';
import { formatDate, formatTime, getStatusClass } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DoctorAppointments = () => {
  const [appointments, setAppointments]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState('all');
  const [search, setSearch]               = useState('');
  const [prescModal, setPrescModal]       = useState(null);
  const [activeTimer, setActiveTimer]     = useState(null); // { id, patientName }
  const [prescForm, setPrescForm]         = useState({
    diagnosis: '', instructions: '', follow_up_date: '', notes: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }]
  });

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      const res = await api.get('/appointments', { params });
      setAppointments(res.data.data || []);
    } catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // ── Status update ──────────────────────────────────────────────────────────
  const handleStatus = async (id, status, patientName) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);

      // Start timer when doctor clicks "Start"
      if (status === 'in_progress') {
        setActiveTimer({ id, patientName });
      }

      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  // Timer "Complete" button → mark appointment completed
  const handleTimerComplete = async () => {
    if (!activeTimer) return;
    try {
      await api.put(`/appointments/${activeTimer.id}/status`, { status: 'completed' });
      toast.success('Consultation completed!');
      setActiveTimer(null);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete');
    }
  };

  // ── Prescription helpers ───────────────────────────────────────────────────
  const addMedicine = () => {
    setPrescForm(p => ({
      ...p,
      medicines: [...p.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
    }));
  };

  const removeMedicine = (i) => {
    setPrescForm(p => ({ ...p, medicines: p.medicines.filter((_, idx) => idx !== i) }));
  };

  const updateMedicine = (i, field, value) => {
    setPrescForm(p => {
      const meds = [...p.medicines];
      meds[i] = { ...meds[i], [field]: value };
      return { ...p, medicines: meds };
    });
  };

  const handleCreatePrescription = async () => {
    if (!prescForm.diagnosis) { toast.error('Diagnosis is required'); return; }
    try {
      await api.post('/prescriptions', {
        appointment_id: prescModal.id,
        patient_id: prescModal.patients?.id,
        ...prescForm
      });
      toast.success('Prescription created!');
      setPrescModal(null);
      setPrescForm({
        diagnosis: '', instructions: '', follow_up_date: '', notes: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '' }]
      });
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create prescription');
    }
  };

  const filtered = appointments.filter(a =>
    a.patients?.users?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const statusFilters = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

  return (
    <DashboardLayout title="Appointments">

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by patient name..."
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

      {/* ── Active timer banner ──────────────────────────────────────────────── */}
      {activeTimer && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-blue-600 text-white rounded-2xl px-5 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <FiClock size={18} className="animate-pulse" />
            <span className="font-semibold text-sm">
              Consultation timer running for {activeTimer.patientName}
            </span>
          </div>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
            See bottom-right corner
          </span>
        </motion.div>
      )}

      {/* ── Appointment list ─────────────────────────────────────────────────── */}
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <FiCalendar size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No appointments found</p>
            </div>
          ) : (
            filtered.map((apt, i) => {
              const isRunning = activeTimer?.id === apt.id;
              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition-shadow ${
                    isRunning ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Patient info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                        {apt.patients?.users?.full_name?.[0] || 'P'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{apt.patients?.users?.full_name}</h3>
                        <p className="text-xs text-gray-500">{apt.patients?.users?.email}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <FiCalendar size={11} /> {formatDate(apt.appointment_date)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <FiClock size={11} /> {formatTime(apt.appointment_time)}
                          </span>
                          {apt.queue_token && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              {apt.queue_token}
                            </span>
                          )}
                        </div>
                        {apt.reason && (
                          <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">{apt.reason}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <span className={getStatusClass(apt.status)}>{apt.status}</span>
                      <div className="flex gap-1.5 flex-wrap justify-end">

                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatus(apt.id, 'confirmed', apt.patients?.users?.full_name)}
                              className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatus(apt.id, 'cancelled', apt.patients?.users?.full_name)}
                              className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatus(apt.id, 'in_progress', apt.patients?.users?.full_name)}
                            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-1"
                          >
                            <FiPlay size={11} /> Start + Timer
                          </button>
                        )}

                        {apt.status === 'in_progress' && (
                          <>
                            <button
                              onClick={() => setPrescModal(apt)}
                              className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 font-medium flex items-center gap-1"
                            >
                              <FiFileText size={12} /> Prescribe
                            </button>
                            <button
                              onClick={() => handleStatus(apt.id, 'completed', apt.patients?.users?.full_name)}
                              className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium flex items-center gap-1"
                            >
                              <FiCheckCircle size={12} /> Complete
                            </button>
                          </>
                        )}

                      </div>
                    </div>
                  </div>

                  {/* Running timer inline indicator */}
                  {isRunning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 pt-3 border-t border-blue-100 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-xs text-blue-600 font-semibold">
                        30-min consultation timer is running — see bottom-right
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* ── Floating 30-min timer ────────────────────────────────────────────── */}
      {activeTimer && (
        <ConsultationTimer
          appointmentId={activeTimer.id}
          patientName={activeTimer.patientName}
          onComplete={handleTimerComplete}
          onClose={() => setActiveTimer(null)}
        />
      )}

      {/* ── Prescription Modal ───────────────────────────────────────────────── */}
      {prescModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Create Prescription</h3>
              <button onClick={() => setPrescModal(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Patient info */}
              <div className="bg-blue-50 rounded-xl p-3 text-sm">
                <p className="font-semibold text-blue-900">
                  Patient: {prescModal.patients?.users?.full_name}
                </p>
                <p className="text-blue-700">Date: {formatDate(prescModal.appointment_date)}</p>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="input-label">Diagnosis *</label>
                <input
                  type="text"
                  value={prescForm.diagnosis}
                  onChange={e => setPrescForm(p => ({ ...p, diagnosis: e.target.value }))}
                  placeholder="Enter diagnosis..."
                  className="input-field"
                />
              </div>

              {/* Medicines */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="input-label mb-0">Medicines</label>
                  <button
                    onClick={addMedicine}
                    className="text-xs text-blue-600 font-medium hover:underline"
                  >
                    + Add Medicine
                  </button>
                </div>
                {prescForm.medicines.map((m, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 mb-2 items-center">
                    <input
                      type="text" value={m.name}
                      onChange={e => updateMedicine(i, 'name', e.target.value)}
                      placeholder="Medicine" className="input-field text-sm py-2"
                    />
                    <input
                      type="text" value={m.dosage}
                      onChange={e => updateMedicine(i, 'dosage', e.target.value)}
                      placeholder="Dosage" className="input-field text-sm py-2"
                    />
                    <input
                      type="text" value={m.frequency}
                      onChange={e => updateMedicine(i, 'frequency', e.target.value)}
                      placeholder="Frequency" className="input-field text-sm py-2"
                    />
                    <div className="flex gap-1">
                      <input
                        type="text" value={m.duration}
                        onChange={e => updateMedicine(i, 'duration', e.target.value)}
                        placeholder="Duration" className="input-field text-sm py-2 flex-1"
                      />
                      {prescForm.medicines.length > 1 && (
                        <button
                          onClick={() => removeMedicine(i)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div>
                <label className="input-label">Instructions</label>
                <textarea
                  value={prescForm.instructions}
                  onChange={e => setPrescForm(p => ({ ...p, instructions: e.target.value }))}
                  placeholder="Special instructions..."
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              {/* Follow-up & Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Follow-up Date</label>
                  <input
                    type="date"
                    value={prescForm.follow_up_date}
                    onChange={e => setPrescForm(p => ({ ...p, follow_up_date: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Notes</label>
                  <input
                    type="text"
                    value={prescForm.notes}
                    onChange={e => setPrescForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Additional notes..."
                    className="input-field"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setPrescModal(null)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={handleCreatePrescription}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <FiCheckCircle size={16} /> Create Prescription
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorAppointments;
