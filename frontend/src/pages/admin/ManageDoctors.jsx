/**
 * Admin - Manage Doctors
 * Supports: activate/deactivate toggle + permanent delete with confirmation
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiToggleLeft, FiToggleRight,
  FiStar, FiUser, FiTrash2, FiAlertTriangle
} from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { getInitials, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

// ── Confirmation modal ────────────────────────────────────────────────────────
const DeleteConfirmModal = ({ doctor, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FiAlertTriangle size={32} className="text-red-600" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
        Delete Doctor Account
      </h3>
      <p className="text-gray-500 text-center text-sm mb-5">
        This will permanently delete{' '}
        <span className="font-bold text-gray-900">Dr. {doctor?.users?.full_name}</span>
        {' '}and all their data including appointments, prescriptions, and availability.
        <br /><br />
        <span className="text-red-600 font-semibold">This action cannot be undone.</span>
      </p>

      {/* Doctor info */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center text-red-700 font-bold text-sm">
            {getInitials(doctor?.users?.full_name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">Dr. {doctor?.users?.full_name}</p>
            <p className="text-xs text-gray-500">{doctor?.specialization} · {doctor?.users?.email}</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiTrash2 size={15} />
          )}
          {loading ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </motion.div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const ManageDoctors = () => {
  const [doctors, setDoctors]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);   // doctor to delete
  const [deleting, setDeleting]       = useState(false);

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await api.get('/admin/doctors');
      setDoctors(res.data.data || []);
    } catch { toast.error('Failed to load doctors'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  // ── Toggle active/inactive ──────────────────────────────────────────────
  const toggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      toast.success(`Doctor ${currentStatus ? 'deactivated' : 'activated'}`);
      fetchDoctors();
    } catch { toast.error('Failed to update status'); }
  };

  // ── Delete doctor ───────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/doctors/${deleteTarget.id}`);
      toast.success(res.data.message || 'Doctor deleted successfully');
      setDeleteTarget(null);
      // Remove from local state immediately — no refetch needed
      setDoctors(prev => prev.filter(d => d.id !== deleteTarget.id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete doctor');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = doctors.filter(d =>
    d.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.departments?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Manage Doctors">

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="relative">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, specialization or department..."
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Doctors', value: doctors.length,                                    color: 'blue'  },
          { label: 'Active',        value: doctors.filter(d =>  d.users?.is_active).length,   color: 'green' },
          { label: 'Inactive',      value: doctors.filter(d => !d.users?.is_active).length,   color: 'red'   },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className={`text-3xl font-bold ${
              color === 'blue' ? 'text-blue-600' :
              color === 'green' ? 'text-emerald-600' : 'text-red-500'
            }`}>{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="table-header text-left">Doctor</th>
                <th className="table-header text-left">Specialization</th>
                <th className="table-header text-left">Department</th>
                <th className="table-header text-left">Fee</th>
                <th className="table-header text-left">Rating</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doctor, i) => (
                <motion.tr
                  key={doctor.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="table-row"
                >
                  {/* Doctor info */}
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {getInitials(doctor.users?.full_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Dr. {doctor.users?.full_name}</p>
                        <p className="text-xs text-gray-500">{doctor.users?.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="table-cell text-sm">{doctor.specialization}</td>
                  <td className="table-cell text-sm">{doctor.departments?.name || 'N/A'}</td>
                  <td className="table-cell text-sm font-semibold text-blue-700">
                    {formatCurrency(doctor.consultation_fee)}
                  </td>

                  {/* Rating */}
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{doctor.rating || '4.8'}</span>
                    </div>
                  </td>

                  {/* Status badge */}
                  <td className="table-cell">
                    <span className={`badge ${doctor.users?.is_active ? 'badge-completed' : 'badge-cancelled'}`}>
                      {doctor.users?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Actions: toggle + delete */}
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      {/* Toggle active/inactive */}
                      <button
                        onClick={() => toggleStatus(doctor.users?.id, doctor.users?.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          doctor.users?.is_active
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={doctor.users?.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {doctor.users?.is_active
                          ? <FiToggleRight size={22} />
                          : <FiToggleLeft size={22} />
                        }
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(doctor)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete doctor permanently"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <FiUser size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No doctors found</p>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            doctor={deleteTarget}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
};

export default ManageDoctors;
