/**
 * Patient Profile Page
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDate, calculateAge, getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const PatientProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/patients/profile');
      setProfile(res.data.data);
      setForm({
        full_name: res.data.data.users?.full_name || '',
        phone: res.data.data.users?.phone || '',
        date_of_birth: res.data.data.date_of_birth || '',
        gender: res.data.data.gender || '',
        blood_group: res.data.data.blood_group || '',
        address: res.data.data.address || '',
        emergency_contact: res.data.data.emergency_contact || '',
        allergies: res.data.data.allergies || '',
        medical_history: res.data.data.medical_history || '',
      });
    } catch { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', { full_name: form.full_name, phone: form.phone });
      await api.put('/patients/profile', form);
      updateUser({ full_name: form.full_name, phone: form.phone });
      toast.success('Profile updated!');
      setEditing(false);
      fetchProfile();
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <DashboardLayout title="Profile"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 mb-6 text-white"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
              {getInitials(user?.full_name)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.full_name}</h2>
              <p className="text-blue-200">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Patient</span>
                {profile?.blood_group && (
                  <span className="bg-red-500/30 px-3 py-1 rounded-full text-sm font-medium">
                    {profile.blood_group}
                  </span>
                )}
                {profile?.date_of_birth && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    Age: {calculateAge(profile.date_of_birth)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="ml-auto bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
            >
              {editing ? <FiX size={20} /> : <FiEdit2 size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { label: 'Full Name', key: 'full_name', type: 'text' },
              { label: 'Phone', key: 'phone', type: 'tel' },
              { label: 'Date of Birth', key: 'date_of_birth', type: 'date' },
              { label: 'Gender', key: 'gender', type: 'select', options: ['male', 'female', 'other'] },
              { label: 'Blood Group', key: 'blood_group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
              { label: 'Emergency Contact', key: 'emergency_contact', type: 'tel' },
            ].map(({ label, key, type, options }) => (
              <div key={key}>
                <label className="input-label">{label}</label>
                {editing ? (
                  type === 'select' ? (
                    <select
                      value={form[key] || ''}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select {label}</option>
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={type}
                      value={form[key] || ''}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="input-field"
                    />
                  )
                ) : (
                  <p className="py-3 px-4 bg-gray-50 rounded-xl text-gray-900 text-sm">
                    {key === 'date_of_birth' ? formatDate(form[key]) : form[key] || 'Not set'}
                  </p>
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="input-label">Address</label>
              {editing ? (
                <textarea
                  value={form.address || ''}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  className="input-field resize-none"
                  rows={2}
                />
              ) : (
                <p className="py-3 px-4 bg-gray-50 rounded-xl text-gray-900 text-sm">{form.address || 'Not set'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="input-label">Known Allergies</label>
              {editing ? (
                <textarea
                  value={form.allergies || ''}
                  onChange={e => setForm(p => ({ ...p, allergies: e.target.value }))}
                  className="input-field resize-none"
                  rows={2}
                  placeholder="List any known allergies..."
                />
              ) : (
                <p className="py-3 px-4 bg-gray-50 rounded-xl text-gray-900 text-sm">{form.allergies || 'None'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="input-label">Medical History</label>
              {editing ? (
                <textarea
                  value={form.medical_history || ''}
                  onChange={e => setForm(p => ({ ...p, medical_history: e.target.value }))}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Previous conditions, surgeries, etc..."
                />
              ) : (
                <p className="py-3 px-4 bg-gray-50 rounded-xl text-gray-900 text-sm">{form.medical_history || 'None'}</p>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
              <button onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                <FiSave size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
