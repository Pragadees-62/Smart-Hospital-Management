/**
 * Admin - Manage Patients
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiToggleLeft, FiToggleRight, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatDate, calculateAge, getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get('/patients', { params: { page, limit: 15, search } });
      setPatients(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch { toast.error('Failed to load patients'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPatients(); }, [page]);

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      toast.success(`Patient ${currentStatus ? 'deactivated' : 'activated'}`);
      fetchPatients();
    } catch { toast.error('Failed to update status'); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPatients();
  };

  return (
    <DashboardLayout title="Manage Patients">
      {/* Search */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex gap-3">
        <div className="relative flex-1">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patients by name or email..." className="input-field pl-9 py-2.5 text-sm" />
        </div>
        <button type="submit" className="btn-primary px-6 text-sm">Search</button>
      </form>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Patients', value: pagination.total || patients.length, color: 'blue' },
          { label: 'Active', value: patients.filter(p => p.users?.is_active).length, color: 'green' },
          { label: 'Inactive', value: patients.filter(p => !p.users?.is_active).length, color: 'red' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className={`text-3xl font-bold ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-emerald-600' : 'text-red-500'}`}>{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-header text-left">Patient</th>
                  <th className="table-header text-left">Age / Gender</th>
                  <th className="table-header text-left">Blood Group</th>
                  <th className="table-header text-left">Phone</th>
                  <th className="table-header text-left">Joined</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, i) => (
                  <motion.tr key={patient.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 text-sm font-bold flex-shrink-0">
                          {getInitials(patient.users?.full_name)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{patient.users?.full_name}</p>
                          <p className="text-xs text-gray-500">{patient.users?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-sm capitalize">
                      {calculateAge(patient.date_of_birth)} yrs / {patient.gender || 'N/A'}
                    </td>
                    <td className="table-cell">
                      {patient.blood_group ? (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {patient.blood_group}
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td className="table-cell text-sm">{patient.users?.phone || 'N/A'}</td>
                    <td className="table-cell text-sm text-gray-500">{formatDate(patient.users?.created_at)}</td>
                    <td className="table-cell">
                      <span className={`badge ${patient.users?.is_active ? 'badge-completed' : 'badge-cancelled'}`}>
                        {patient.users?.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => toggleStatus(patient.users?.id, patient.users?.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          patient.users?.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {patient.users?.is_active ? <FiToggleRight size={22} /> : <FiToggleLeft size={22} />}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {patients.length === 0 && (
              <div className="p-12 text-center">
                <FiUsers size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No patients found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-50">← Prev</button>
              <span className="text-sm text-gray-600">Page {page} of {pagination.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-50">Next →</button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default ManagePatients;
