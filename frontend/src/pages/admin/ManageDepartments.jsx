/**
 * Admin - Manage Departments
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiX, FiGrid } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const deptIcons = {
  'Cardiology': '❤️', 'Neurology': '🧠', 'Orthopedics': '🦴',
  'Pediatrics': '👶', 'Oncology': '🔬', 'Dermatology': '🌿',
  'Ophthalmology': '👁️', 'Gynecology': '🌸', 'General Medicine': '🏥',
  'Surgery': '🔪', 'Emergency': '🚨', 'Radiology': '📡',
};

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', floor: '', room_numbers: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/admin/departments');
      setDepartments(res.data.data || []);
    } catch { toast.error('Failed to load departments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleCreate = async () => {
    if (!form.name) { toast.error('Department name is required'); return; }
    setSubmitting(true);
    try {
      await api.post('/admin/departments', form);
      toast.success('Department created!');
      setShowModal(false);
      setForm({ name: '', description: '', floor: '', room_numbers: '' });
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    } finally { setSubmitting(false); }
  };

  return (
    <DashboardLayout title="Manage Departments">
      <div className="flex items-center justify-between mb-5">
        <p className="text-gray-500">{departments.length} departments</p>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Add Department
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <motion.div key={dept.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{deptIcons[dept.name] || '🏥'}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{dept.name}</h3>
                  {dept.floor && <p className="text-xs text-gray-500">Floor {dept.floor}</p>}
                </div>
              </div>
              {dept.description && (
                <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
              )}
              {dept.room_numbers && (
                <div className="bg-blue-50 rounded-lg px-3 py-1.5">
                  <p className="text-xs text-blue-700"><span className="font-semibold">Rooms:</span> {dept.room_numbers}</p>
                </div>
              )}
            </motion.div>
          ))}
          {departments.length === 0 && (
            <div className="col-span-3 bg-white rounded-2xl p-12 text-center border border-gray-100">
              <FiGrid size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No departments yet</p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Add Department</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <FiX size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="input-label">Department Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Cardiology" className="input-field" />
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="input-field resize-none" rows={2} placeholder="Brief description..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Floor</label>
                  <input type="text" value={form.floor} onChange={e => setForm(p => ({ ...p, floor: e.target.value }))}
                    placeholder="e.g. 2nd Floor" className="input-field" />
                </div>
                <div>
                  <label className="input-label">Room Numbers</label>
                  <input type="text" value={form.room_numbers} onChange={e => setForm(p => ({ ...p, room_numbers: e.target.value }))}
                    placeholder="e.g. 201-210" className="input-field" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleCreate} disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
                  {submitting ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageDepartments;
