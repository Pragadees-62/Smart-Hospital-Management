/**
 * Doctor Profile Page
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiStar } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { getInitials, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DoctorProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/doctors/profile/me');
      setProfile(res.data.data);
      setForm({
        full_name: res.data.data.users?.full_name || '',
        phone: res.data.data.users?.phone || '',
        specialization: res.data.data.specialization || '',
        experience_years: res.data.data.experience_years || '',
        consultation_fee: res.data.data.consultation_fee || '',
        bio: res.data.data.bio || '',
        education: res.data.data.education || '',
      });
    } catch { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', { full_name: form.full_name, phone: form.phone });
      await api.put('/doctors/profile', form);
      updateUser({ full_name: form.full_name });
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
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
              {getInitials(user?.full_name)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Dr. {user?.full_name}</h2>
              <p className="text-blue-200">{profile?.specialization}</p>
              <p className="text-blue-300 text-sm">{profile?.departments?.name}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <FiStar size={12} className="text-yellow-300" />
                  <span className="text-sm font-medium">{profile?.rating || '4.8'}</span>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {profile?.experience_years}y experience
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {formatCurrency(profile?.consultation_fee)}
                </span>
              </div>
            </div>
            <button onClick={() => setEditing(!editing)}
              className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors">
              {editing ? <FiX size={20} /> : <FiEdit2 size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { label: 'Full Name', key: 'full_name', type: 'text' },
              { label: 'Phone', key: 'phone', type: 'tel' },
              { label: 'Specialization', key: 'specialization', type: 'select',
                options: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
                  'Oncology', 'Gynecology', 'Ophthalmology', 'General Medicine', 'Surgery'] },
              { label: 'Experience (Years)', key: 'experience_years', type: 'number' },
              { label: 'Consultation Fee (₹)', key: 'consultation_fee', type: 'number' },
            ].map(({ label, key, type, options }) => (
              <div key={key}>
                <label className="input-label">{label}</label>
                {editing ? (
                  type === 'select' ? (
                    <select value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="input-field">
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={type} value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="input-field" />
                  )
                ) : (
                  <p className="py-3 px-4 bg-gray-50 rounded-xl text-gray-900 text-sm">{form[key] || 'Not set'}</p>
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="input-label">Bio</label>
              {editing ? (
                <textarea value={form.bio || ''} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  className="input-field resize-none" rows={3} placeholder="Write a brief bio..." />
              ) : (
                <p className="py-3 px-4 bg-gray-50 rounded-xl text-gray-900 text-sm">{form.bio || 'Not set'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="input-label">Education & Qualifications</label>
              {editing ? (
                <textarea value={form.education || ''} onChange={e => setForm(p => ({ ...p, education: e.target.value }))}
                  className="input-field resize-none" rows={2} placeholder="MBBS, MD, etc..." />
              ) : (
                <p className="py-3 px-4 bg-gray-50 rounded-xl text-gray-900 text-sm">{form.education || 'Not set'}</p>
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

export default DoctorProfile;
