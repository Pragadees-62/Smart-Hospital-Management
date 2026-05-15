/**
 * Book Appointment Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiClock, FiUser, FiStar, FiCheck } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatTime, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [form, setForm] = useState({ reason: '', type: 'regular' });
  const [booking, setBooking] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/doctors', { params: { search, department: selectedDept } });
      setDoctors(res.data.data || []);
    } catch { toast.error('Failed to load doctors'); }
    finally { setLoading(false); }
  };

  const fetchDepartments = async () => {
    try {
      // Now accessible to all authenticated users (not just admin)
      const res = await api.get('/admin/departments');
      setDepartments(res.data.data || []);
    } catch { /* ignore */ }
  };

  const fetchSlots = async () => {
    setSlotsLoading(true);
    try {
      const res = await api.get(`/appointments/slots/${selectedDoctor.id}`, { params: { date: selectedDate } });
      setSlots(res.data.data || []);
    } catch { toast.error('Failed to load slots'); }
    finally { setSlotsLoading(false); }
  };

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) fetchSlots();
  }, [selectedDoctor, selectedDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleBooking = async () => {
    if (!selectedSlot) { toast.error('Please select a time slot'); return; }
    if (!form.reason) { toast.error('Please enter reason for visit'); return; }
    setBooking(true);
    try {
      await api.post('/appointments', {
        doctor_id: selectedDoctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedSlot,
        reason: form.reason,
        type: form.type
      });
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setBooking(false); }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout title="Book Appointment">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {['Select Doctor', 'Choose Date & Time', 'Confirm'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              step > i + 1 ? 'bg-green-100 text-green-700' :
              step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {step > i + 1 ? <FiCheck size={14} /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-green-300' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Search & Filter */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search doctors by name or specialization..."
                  className="input-field pl-11"
                />
              </div>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="input-field w-48"
              >
                <option value="">All Departments</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <button type="submit" className="btn-primary px-6">Search</button>
            </form>
          </div>

          {/* Doctors Grid */}
          {loading ? <LoadingSpinner /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doctor => (
                <motion.div
                  key={doctor.id}
                  whileHover={{ y: -2 }}
                  onClick={() => { setSelectedDoctor(doctor); setStep(2); }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {doctor.users?.full_name?.[0] || 'D'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900">Dr. {doctor.users?.full_name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
                      <p className="text-xs text-gray-500">{doctor.departments?.name}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <FiStar size={12} className="fill-yellow-400" />
                          <span className="text-xs font-semibold text-gray-700">{doctor.rating || '4.8'}</span>
                        </div>
                        <span className="text-xs text-gray-500">{doctor.experience_years}y exp</span>
                        <span className="text-xs font-semibold text-emerald-600">{formatCurrency(doctor.consultation_fee)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${doctor.is_available ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${doctor.is_available ? 'bg-green-500' : 'bg-red-400'}`} />
                    {doctor.is_available ? 'Available' : 'Unavailable'}
                  </div>
                </motion.div>
              ))}
              {doctors.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-400">
                  <FiUser size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No doctors found</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && selectedDoctor && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Doctor Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Selected Doctor</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {selectedDoctor.users?.full_name?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">Dr. {selectedDoctor.users?.full_name}</p>
                  <p className="text-sm text-blue-600">{selectedDoctor.specialization}</p>
                  <p className="text-xs text-gray-500">{selectedDoctor.departments?.name}</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-sm">
                <p className="text-gray-600">Consultation Fee</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(selectedDoctor.consultation_fee)}</p>
              </div>
              <button onClick={() => setStep(1)} className="btn-secondary w-full mt-4 text-sm">
                Change Doctor
              </button>
            </div>

            {/* Date & Slots */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCalendar size={18} className="text-blue-600" /> Select Date
                </h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  min={minDate}
                  className="input-field"
                />
              </div>

              {selectedDate && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiClock size={18} className="text-blue-600" /> Available Slots
                  </h3>
                  {slotsLoading ? <LoadingSpinner size="sm" text="Loading slots..." /> : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {slots.map(slot => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                            !slot.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' :
                            selectedSlot === slot.time ? 'bg-blue-600 text-white shadow-md' :
                            'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {formatTime(slot.time)}
                        </button>
                      ))}
                      {slots.length === 0 && (
                        <p className="col-span-6 text-center text-gray-400 py-4 text-sm">
                          No slots available for this date
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {selectedSlot && (
                <button onClick={() => setStep(3)} className="btn-primary w-full py-3">
                  Continue to Confirm →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 text-xl mb-6">Confirm Appointment</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-500">Doctor</span>
                  <span className="font-semibold text-gray-900">Dr. {selectedDoctor?.users?.full_name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-500">Specialization</span>
                  <span className="font-semibold text-gray-900">{selectedDoctor?.specialization}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-500">Date</span>
                  <span className="font-semibold text-gray-900">{selectedDate}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-500">Time</span>
                  <span className="font-semibold text-gray-900">{formatTime(selectedSlot)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-bold text-blue-700 text-lg">{formatCurrency(selectedDoctor?.consultation_fee)}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="input-label">Appointment Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-field">
                  <option value="regular">Regular Consultation</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="input-label">Reason for Visit *</label>
                <textarea
                  value={form.reason}
                  onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                  placeholder="Describe your symptoms or reason for visit..."
                  className="input-field resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">← Back</button>
                <button onClick={handleBooking} disabled={booking} className="btn-primary flex-1 disabled:opacity-60">
                  {booking ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Booking...
                    </span>
                  ) : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default BookAppointment;
