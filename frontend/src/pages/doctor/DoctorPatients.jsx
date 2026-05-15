/**
 * Doctor's Patients List
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { calculateAge, getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await api.get('/doctors/my/patients');
      setPatients(res.data.data || []);
    } catch { toast.error('Failed to load patients'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPatients(); }, []);

  const filtered = patients.filter(p =>
    p.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.users?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="My Patients">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="relative">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patients..." className="input-field pl-9 py-2.5 text-sm" />
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-3 bg-white rounded-2xl p-12 text-center border border-gray-100">
              <FiUsers size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No patients found</p>
            </div>
          ) : (
            filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white font-bold">
                    {getInitials(p.users?.full_name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{p.users?.full_name}</h3>
                    <p className="text-xs text-gray-500">{p.users?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ['Age', calculateAge(p.date_of_birth)],
                    ['Gender', p.gender || 'N/A'],
                    ['Blood Group', p.blood_group || 'N/A'],
                    ['Phone', p.users?.phone || 'N/A'],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-2">
                      <p className="text-gray-400">{label}</p>
                      <p className="font-semibold text-gray-700 capitalize">{value}</p>
                    </div>
                  ))}
                </div>
                {p.allergies && (
                  <div className="mt-3 bg-red-50 rounded-lg p-2">
                    <p className="text-xs text-red-600"><span className="font-semibold">Allergies:</span> {p.allergies}</p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorPatients;
