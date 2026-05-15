/**
 * Patient Prescriptions Page
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiSearch, FiX } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const printRef = useRef();

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get('/prescriptions');
      setPrescriptions(res.data.data || []);
    } catch { toast.error('Failed to load prescriptions'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPrescriptions(); }, []);

  const handlePrint = () => {
    const content = printRef.current;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Prescription</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a; }
        .header { text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { color: #1d4ed8; margin: 0; }
        .section { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #eff6ff; padding: 8px; text-align: left; font-size: 12px; }
        td { padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
        .footer { margin-top: 30px; text-align: right; }
      </style></head><body>
      ${content.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const filtered = prescriptions.filter(p =>
    p.diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
    p.doctors?.users?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="My Prescriptions">
      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="relative">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by diagnosis or doctor..."
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-3 bg-white rounded-2xl p-12 text-center border border-gray-100">
              <FiFileText size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No prescriptions found</p>
            </div>
          ) : (
            filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiFileText size={18} className="text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(p.created_at)}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{p.diagnosis}</h3>
                <p className="text-sm text-blue-600 mb-1">Dr. {p.doctors?.users?.full_name}</p>
                <p className="text-xs text-gray-500 mb-3">{p.doctors?.specialization}</p>

                {/* Medicines preview */}
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Medicines ({p.medicines?.length || 0})</p>
                  {p.medicines?.slice(0, 2).map((m, j) => (
                    <p key={j} className="text-xs text-gray-700">• {m.name} - {m.dosage}</p>
                  ))}
                  {p.medicines?.length > 2 && (
                    <p className="text-xs text-gray-400">+{p.medicines.length - 2} more</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(p)}
                    className="flex-1 py-2 text-xs font-semibold bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => { setSelected(p); setTimeout(handlePrint, 100); }}
                    className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <FiDownload size={14} className="text-gray-600" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Prescription Details</h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="btn-primary text-sm flex items-center gap-2">
                  <FiDownload size={14} /> Print / Download
                </button>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100">
                  <FiX size={18} />
                </button>
              </div>
            </div>

            <div ref={printRef} className="p-6">
              {/* Header */}
              <div className="header text-center border-b-2 border-blue-600 pb-4 mb-5">
                <h1 className="text-2xl font-bold text-blue-700">🏥 Smart Hospital</h1>
                <p className="text-gray-500 text-sm">Medical Prescription</p>
              </div>

              {/* Doctor & Patient Info */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-700 mb-2">DOCTOR</p>
                  <p className="font-bold text-gray-900">Dr. {selected.doctors?.users?.full_name}</p>
                  <p className="text-sm text-gray-600">{selected.doctors?.specialization}</p>
                  <p className="text-xs text-gray-500">{selected.doctors?.departments?.name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-600 mb-2">PATIENT</p>
                  <p className="font-bold text-gray-900">{selected.patients?.users?.full_name}</p>
                  <p className="text-xs text-gray-500">Date: {formatDate(selected.created_at)}</p>
                  {selected.follow_up_date && (
                    <p className="text-xs text-orange-600 font-medium">Follow-up: {formatDate(selected.follow_up_date)}</p>
                  )}
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-600 mb-1">DIAGNOSIS</p>
                <p className="text-gray-900 font-medium bg-yellow-50 rounded-xl p-3">{selected.diagnosis}</p>
              </div>

              {/* Medicines */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-600 mb-2">PRESCRIBED MEDICINES</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="text-left p-2 rounded-tl-lg text-xs text-gray-600">Medicine</th>
                      <th className="text-left p-2 text-xs text-gray-600">Dosage</th>
                      <th className="text-left p-2 text-xs text-gray-600">Frequency</th>
                      <th className="text-left p-2 rounded-tr-lg text-xs text-gray-600">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.medicines?.map((m, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="p-2 font-medium text-gray-900">{m.name}</td>
                        <td className="p-2 text-gray-600">{m.dosage}</td>
                        <td className="p-2 text-gray-600">{m.frequency}</td>
                        <td className="p-2 text-gray-600">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selected.instructions && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-1">INSTRUCTIONS</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{selected.instructions}</p>
                </div>
              )}

              <div className="footer text-right mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-900">Dr. {selected.doctors?.users?.full_name}</p>
                <p className="text-xs text-gray-500">{selected.doctors?.specialization}</p>
                <p className="text-xs text-gray-400 mt-1">Digital Signature</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Prescriptions;
