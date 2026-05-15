/**
 * Admin Emergency Monitoring
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiPlus, FiX } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const severityColors = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
};

const EmergencyMonitor = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patient_id: '', doctor_id: '', description: '', severity: 'high', location: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCases = async () => {
    try {
      const res = await api.get('/admin/emergency');
      setCases(res.data.data || []);
    } catch { toast.error('Failed to load emergency cases'); }
    finally { setLoading(false); }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients', { params: { limit: 100 } });
      setPatients(res.data.data || []);
    } catch { /* ignore */ }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors', { params: { limit: 100 } });
      setDoctors(res.data.data || []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchCases();
    fetchPatients();
    fetchDoctors();
  }, []);

  const handleCreate = async () => {
    if (!form.description) { toast.error('Description is required'); return; }
    setSubmitting(true);
    try {
      await api.post('/admin/emergency', form);
      toast.success('Emergency case created!');
      setShowModal(false);
      setForm({ patient_id: '', doctor_id: '', description: '', severity: 'high', location: '' });
      fetchCases();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create case');
    } finally { setSubmitting(false); }
  };

  const activeCases = cases.filter(c => c.status === 'active');

  return (
    <DashboardLayout title="Emergency Monitoring">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <FiAlertCircle size={20} className="text-red-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Emergency Cases</h2>
            <p className="text-sm text-gray-500">{activeCases.length} active cases</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-danger flex items-center gap-2">
          <FiPlus size={16} /> New Emergency
        </button>
      </div>

      {/* Active Cases */}
      {activeCases.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Active Emergencies ({activeCases.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {activeCases.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border-2 p-5 ${severityColors[c.severity] || 'bg-red-50 border-red-200'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle size={18} className="text-red-600" />
                    <span className="font-bold text-sm uppercase tracking-wide">{c.severity} SEVERITY</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(c.created_at)}</span>
                </div>
                <p className="font-semibold text-gray-900 mb-2">{c.description}</p>
                <div className="space-y-1 text-sm">
                  {c.patients?.users?.full_name && (
                    <p className="text-gray-700">👤 Patient: {c.patients.users.full_name}</p>
                  )}
                  {c.doctors?.users?.full_name && (
                    <p className="text-gray-700">👨‍⚕️ Doctor: Dr. {c.doctors.users.full_name}</p>
                  )}
                  {c.location && (
                    <p className="text-gray-700">📍 Location: {c.location}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Cases Table */}
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">All Emergency Cases</h3>
          </div>
          {cases.length === 0 ? (
            <div className="p-12 text-center">
              <FiAlertCircle size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No emergency cases</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-header text-left">Description</th>
                  <th className="table-header text-left">Patient</th>
                  <th className="table-header text-left">Doctor</th>
                  <th className="table-header text-left">Severity</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className="table-row">
                    <td className="table-cell font-medium text-sm max-w-[200px] truncate">{c.description}</td>
                    <td className="table-cell text-sm">{c.patients?.users?.full_name || 'N/A'}</td>
                    <td className="table-cell text-sm">{c.doctors?.users?.full_name ? `Dr. ${c.doctors.users.full_name}` : 'N/A'}</td>
                    <td className="table-cell">
                      <span className={`badge capitalize ${
                        c.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        c.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        c.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>{c.severity}</span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${c.status === 'active' ? 'badge-emergency' : 'badge-completed'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="table-cell text-sm text-gray-500">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <FiAlertCircle size={20} className="text-red-600" /> New Emergency Case
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <FiX size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="input-label">Description *</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="input-field resize-none" rows={3} placeholder="Describe the emergency..." />
              </div>
              <div>
                <label className="input-label">Severity</label>
                <select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))} className="input-field">
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="input-label">Patient (Optional)</label>
                <select value={form.patient_id} onChange={e => setForm(p => ({ ...p, patient_id: e.target.value }))} className="input-field">
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.users?.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Assign Doctor (Optional)</label>
                <select value={form.doctor_id} onChange={e => setForm(p => ({ ...p, doctor_id: e.target.value }))} className="input-field">
                  <option value="">Select Doctor</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.users?.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Location</label>
                <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="Ward/Room number..." className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleCreate} disabled={submitting} className="btn-danger flex-1 disabled:opacity-60">
                  {submitting ? 'Creating...' : 'Create Emergency'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmergencyMonitor;
