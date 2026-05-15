/**
 * Doctor Prescriptions Page
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiSearch } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get('/prescriptions');
      setPrescriptions(res.data.data || []);
    } catch { toast.error('Failed to load prescriptions'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPrescriptions(); }, []);

  const filtered = prescriptions.filter(p =>
    p.patients?.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.diagnosis?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Prescriptions">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="relative">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient or diagnosis..." className="input-field pl-9 py-2.5 text-sm" />
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="table-header text-left">Patient</th>
                <th className="table-header text-left">Diagnosis</th>
                <th className="table-header text-left">Medicines</th>
                <th className="table-header text-left">Follow-up</th>
                <th className="table-header text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }} className="table-row">
                  <td className="table-cell">
                    <p className="font-semibold text-sm text-gray-900">{p.patients?.users?.full_name}</p>
                    <p className="text-xs text-gray-500">{p.patients?.users?.email}</p>
                  </td>
                  <td className="table-cell text-sm font-medium">{p.diagnosis}</td>
                  <td className="table-cell text-sm text-gray-600">{p.medicines?.length || 0} medicines</td>
                  <td className="table-cell text-sm">
                    {p.follow_up_date ? (
                      <span className="text-orange-600 font-medium">{formatDate(p.follow_up_date)}</span>
                    ) : 'N/A'}
                  </td>
                  <td className="table-cell text-sm text-gray-500">{formatDate(p.created_at)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <FiFileText size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No prescriptions found</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorPrescriptions;
