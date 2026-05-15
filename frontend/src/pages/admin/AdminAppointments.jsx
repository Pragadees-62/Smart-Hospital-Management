/**
 * Admin - All Appointments
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatDate, formatTime, getStatusClass } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter !== 'all') params.status = filter;
      const res = await api.get('/appointments', { params });
      setAppointments(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, [filter, page]);

  const filtered = appointments.filter(a =>
    a.patients?.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.doctors?.users?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const statusFilters = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

  return (
    <DashboardLayout title="All Appointments">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by patient or doctor..." className="input-field pl-9 py-2.5 text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-header text-left">Patient</th>
                  <th className="table-header text-left">Doctor</th>
                  <th className="table-header text-left">Department</th>
                  <th className="table-header text-left">Date & Time</th>
                  <th className="table-header text-left">Token</th>
                  <th className="table-header text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((apt, i) => (
                  <motion.tr key={apt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }} className="table-row">
                    <td className="table-cell">
                      <p className="font-semibold text-sm text-gray-900">{apt.patients?.users?.full_name}</p>
                      <p className="text-xs text-gray-500">{apt.patients?.users?.email}</p>
                    </td>
                    <td className="table-cell text-sm">Dr. {apt.doctors?.users?.full_name}</td>
                    <td className="table-cell text-sm text-gray-500">{apt.doctors?.departments?.name}</td>
                    <td className="table-cell text-sm">
                      <p>{formatDate(apt.appointment_date)}</p>
                      <p className="text-gray-500">{formatTime(apt.appointment_time)}</p>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {apt.queue_token || 'N/A'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={getStatusClass(apt.status)}>{apt.status}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <FiCalendar size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No appointments found</p>
              </div>
            )}
          </div>

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

export default AdminAppointments;
