/**
 * Doctor Availability Management
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiSave, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const defaultSchedule = DAYS.map(day => ({
  day_of_week: day,
  start_time: '09:00',
  end_time: '17:00',
  slot_duration: 30,
  is_available: day !== 'sunday'
}));

const DoctorAvailability = () => {
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/doctors/profile/me');
      const doctor = res.data.data;
      setIsAvailable(doctor.is_available !== false);
      if (doctor.doctor_availability?.length > 0) {
        const merged = DAYS.map(day => {
          const existing = doctor.doctor_availability.find(a => a.day_of_week === day);
          return existing || defaultSchedule.find(d => d.day_of_week === day);
        });
        setSchedule(merged);
      }
    } catch { toast.error('Failed to load availability'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const updateDay = (day, field, value) => {
    setSchedule(prev => prev.map(s =>
      s.day_of_week === day ? { ...s, [field]: value } : s
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/doctors/availability', {
        is_available: isAvailable,
        availability: schedule
      });
      toast.success('Availability updated!');
    } catch { toast.error('Failed to update availability'); }
    finally { setSaving(false); }
  };

  if (loading) return <DashboardLayout title="Availability"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Manage Availability">
      <div className="max-w-3xl mx-auto">
        {/* Overall Availability Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 mb-6 flex items-center justify-between ${
            isAvailable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div>
            <h3 className={`font-bold text-lg ${isAvailable ? 'text-green-800' : 'text-red-800'}`}>
              {isAvailable ? '✅ Currently Available' : '❌ Currently Unavailable'}
            </h3>
            <p className={`text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {isAvailable ? 'Patients can book appointments with you' : 'No new appointments can be booked'}
            </p>
          </div>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`p-2 rounded-xl transition-colors ${isAvailable ? 'text-green-600 hover:bg-green-100' : 'text-red-500 hover:bg-red-100'}`}
          >
            {isAvailable ? <FiToggleRight size={36} /> : <FiToggleLeft size={36} />}
          </button>
        </motion.div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <FiClock size={18} className="text-blue-600" /> Weekly Schedule
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {schedule.map((day, i) => (
              <motion.div
                key={day.day_of_week}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 ${!day.is_available ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Day Toggle */}
                  <div className="w-28 flex items-center gap-2">
                    <button
                      onClick={() => updateDay(day.day_of_week, 'is_available', !day.is_available)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        day.is_available ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        day.is_available ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </button>
                    <span className="text-sm font-semibold text-gray-700 capitalize">{day.day_of_week}</span>
                  </div>

                  {/* Time Inputs */}
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">From</span>
                      <input
                        type="time"
                        value={day.start_time}
                        onChange={e => updateDay(day.day_of_week, 'start_time', e.target.value)}
                        disabled={!day.is_available}
                        className="input-field py-1.5 text-sm w-28"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">To</span>
                      <input
                        type="time"
                        value={day.end_time}
                        onChange={e => updateDay(day.day_of_week, 'end_time', e.target.value)}
                        disabled={!day.is_available}
                        className="input-field py-1.5 text-sm w-28"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">Slot</span>
                      <select
                        value={day.slot_duration}
                        onChange={e => updateDay(day.day_of_week, 'slot_duration', parseInt(e.target.value))}
                        disabled={!day.is_available}
                        className="input-field py-1.5 text-sm w-24"
                      >
                        <option value={15}>15 min</option>
                        <option value={20}>20 min</option>
                        <option value={30}>30 min</option>
                        <option value={45}>45 min</option>
                        <option value={60}>60 min</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full mt-5 py-3 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <FiSave size={18} />
          {saving ? 'Saving...' : 'Save Availability'}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAvailability;
