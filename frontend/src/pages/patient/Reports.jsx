/**
 * Patient Reports Page
 * Upload and view medical reports
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiUpload, FiFileText, FiTrash2, FiDownload,
  FiSearch, FiX, FiFile, FiAlertCircle
} from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const reportTypes = [
  { value: 'general', label: 'General' },
  { value: 'blood_test', label: 'Blood Test' },
  { value: 'xray', label: 'X-Ray' },
  { value: 'mri', label: 'MRI' },
  { value: 'ct_scan', label: 'CT Scan' },
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'ecg', label: 'ECG' },
  { value: 'prescription', label: 'Prescription' },
];

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    report_type: 'general',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data.data || []);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and PDF files are allowed');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }
    if (!form.title) {
      toast.error('Please enter a title');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('report_type', form.report_type);

      await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Report uploaded successfully!');
      setShowUpload(false);
      setForm({ title: '', description: '', report_type: 'general' });
      setSelectedFile(null);
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this report?')) return;
    try {
      await api.delete(`/reports/${id}`);
      toast.success('Report deleted');
      setReports(prev => prev.filter(r => r.id !== id));
    } catch {
      toast.error('Failed to delete report');
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('image')) return '🖼️';
    return '📁';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filtered = reports.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.report_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Medical Reports">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="relative flex-1 max-w-sm">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="btn-primary flex items-center gap-2 ml-3"
        >
          <FiUpload size={16} /> Upload Report
        </button>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-3 bg-white rounded-2xl p-12 text-center border border-gray-100">
              <FiFileText size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No reports found</p>
              <p className="text-sm text-gray-400 mt-1">Upload your medical reports to keep them organized</p>
              <button
                onClick={() => setShowUpload(true)}
                className="btn-primary text-sm mt-4"
              >
                Upload First Report
              </button>
            </div>
          ) : (
            filtered.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                {/* File Icon & Type */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                      {getFileIcon(report.mime_type)}
                    </div>
                    <div>
                      <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                        {report.report_type?.replace('_', ' ') || 'General'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(report.created_at)}</span>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-gray-900 mb-1 truncate">{report.title}</h3>
                {report.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{report.description}</p>
                )}

                {/* File Info */}
                <div className="bg-gray-50 rounded-xl p-2.5 mb-3 flex items-center gap-2">
                  <FiFile size={14} className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600 truncate">{report.file_name || 'report-file'}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(report.file_size)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {report.file_url && (
                    <a
                      href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${report.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-xs font-semibold bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <FiDownload size={13} /> Download
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    title="Delete report"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Upload Medical Report</h3>
              <button
                onClick={() => { setShowUpload(false); setSelectedFile(null); }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-3xl">{getFileIcon(selectedFile.type)}</div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 text-sm truncate max-w-[200px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                      className="p-1 rounded-full hover:bg-blue-100 text-blue-600"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload size={32} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Click to upload file</p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG, PDF up to 10MB</p>
                  </>
                )}
              </div>

              <div>
                <label className="input-label">Report Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Blood Test Report - Jan 2024"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">Report Type</label>
                <select
                  value={form.report_type}
                  onChange={e => setForm(p => ({ ...p, report_type: e.target.value }))}
                  className="input-field"
                >
                  {reportTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Description (Optional)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of the report..."
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
                <FiAlertCircle size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Your reports are stored securely and only accessible by you and your treating doctors.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowUpload(false); setSelectedFile(null); }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload size={15} /> Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
