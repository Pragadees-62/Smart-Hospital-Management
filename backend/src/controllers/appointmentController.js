/**
 * Appointment Controller
 * Handles all appointment-related operations
 */

const { supabaseAdmin } = require('../config/supabase');
const { generateQueueToken, getPagination, successResponse, errorResponse } = require('../utils/helpers');
const { sendAppointmentConfirmation } = require('../utils/emailService');

/**
 * Book a new appointment
 * POST /api/appointments
 */
const bookAppointment = async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time, reason, type = 'regular' } = req.body;

    // Get patient profile
    const { data: patient } = await supabaseAdmin
      .from('patients')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found.' });
    }

    // Check if doctor exists and is available
    const { data: doctor } = await supabaseAdmin
      .from('doctors')
      .select('*, users(full_name, email), departments(name)')
      .eq('id', doctor_id)
      .single();

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Check for double booking - same doctor, date, time
    const { data: existingAppointment } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctor_id)
      .eq('appointment_date', appointment_date)
      .eq('appointment_time', appointment_time)
      .neq('status', 'cancelled')
      .single();

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose another time.'
      });
    }

    // Check if patient already has appointment at same time
    const { data: patientConflict } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('patient_id', patient.id)
      .eq('appointment_date', appointment_date)
      .eq('appointment_time', appointment_time)
      .neq('status', 'cancelled')
      .single();

    if (patientConflict) {
      return res.status(409).json({
        success: false,
        message: 'You already have an appointment at this time.'
      });
    }

    // Generate queue token
    const { count } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctor_id)
      .eq('appointment_date', appointment_date)
      .neq('status', 'cancelled');

    const tokenNumber = (count || 0) + 1;
    const queueToken = generateQueueToken('T', tokenNumber);

    // Create appointment
    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        patient_id: patient.id,
        doctor_id,
        appointment_date,
        appointment_time,
        reason,
        type,
        status: 'pending',
        queue_token: queueToken,
        token_number: tokenNumber
      })
      .select(`
        *,
        doctors(*, users(full_name), departments(name)),
        patients(*, users(full_name, email))
      `)
      .single();

    if (error) {
      console.error('Appointment creation error:', error);
      return res.status(500).json({ success: false, message: 'Failed to book appointment.' });
    }

    // Create queue token record
    await supabaseAdmin.from('queue_tokens').insert({
      appointment_id: appointment.id,
      doctor_id,
      patient_id: patient.id,
      token_number: tokenNumber,
      token_code: queueToken,
      appointment_date,
      status: 'waiting'
    });

    // Create notification for patient
    await supabaseAdmin.from('notifications').insert({
      user_id: req.user.id,
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctor.users.full_name} on ${appointment_date} at ${appointment_time} has been booked. Token: ${queueToken}`,
      type: 'appointment'
    });

    // Create notification for doctor
    await supabaseAdmin.from('notifications').insert({
      user_id: doctor.users.id || doctor.user_id,
      title: 'New Appointment',
      message: `New appointment booked by ${req.user.full_name} on ${appointment_date} at ${appointment_time}`,
      type: 'appointment'
    });

    // Send confirmation email (non-blocking)
    sendAppointmentConfirmation(req.user.email, {
      patientName: req.user.full_name,
      doctorName: doctor.users.full_name,
      department: doctor.departments?.name || 'General',
      date: appointment_date,
      time: appointment_time,
      token: queueToken
    }).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: appointment
    });
  } catch (error) {
    console.error('BookAppointment error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get appointments (filtered by role)
 * GET /api/appointments
 */
const getAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;
    const { offset } = getPagination(page, limit);

    let query = supabaseAdmin
      .from('appointments')
      .select(`
        *,
        doctors(id, specialization, consultation_fee, users(full_name, avatar_url), departments(name)),
        patients(id, blood_group, users(full_name, email, phone, avatar_url))
      `, { count: 'exact' });

    // Filter by role
    if (req.user.role === 'patient') {
      const { data: patient } = await supabaseAdmin
        .from('patients').select('id').eq('user_id', req.user.id).single();
      if (patient) query = query.eq('patient_id', patient.id);
    } else if (req.user.role === 'doctor') {
      const { data: doctor } = await supabaseAdmin
        .from('doctors').select('id').eq('user_id', req.user.id).single();
      if (doctor) query = query.eq('doctor_id', doctor.id);
    }

    // Apply filters
    if (status) query = query.eq('status', status);
    if (date) query = query.eq('appointment_date', date);

    // Pagination and ordering
    const { data: appointments, error, count } = await query
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: true })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch appointments.' });
    }

    res.json({
      success: true,
      data: appointments,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('GetAppointments error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get single appointment
 * GET /api/appointments/:id
 */
const getAppointment = async (req, res) => {
  try {
    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        doctors(*, users(full_name, email, phone, avatar_url), departments(name)),
        patients(*, users(full_name, email, phone, avatar_url)),
        prescriptions(*),
        billing(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error('GetAppointment error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Update appointment status (doctor/admin)
 * PUT /api/appointments/:id/status
 */
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .update({
        status,
        doctor_notes: notes,
        updated_at: new Date().toISOString(),
        ...(status === 'completed' && { completed_at: new Date().toISOString() })
      })
      .eq('id', req.params.id)
      .select(`*, patients(users(full_name)), doctors(users(full_name))`)
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to update appointment.' });
    }

    // Update queue token status
    if (status === 'in_progress') {
      await supabaseAdmin
        .from('queue_tokens')
        .update({ status: 'in_progress' })
        .eq('appointment_id', req.params.id);
    } else if (status === 'completed') {
      await supabaseAdmin
        .from('queue_tokens')
        .update({ status: 'completed' })
        .eq('appointment_id', req.params.id);
    }

    // Notify patient
    const patientUserId = appointment.patients?.user_id;
    if (patientUserId) {
      await supabaseAdmin.from('notifications').insert({
        user_id: patientUserId,
        title: 'Appointment Update',
        message: `Your appointment status has been updated to: ${status}`,
        type: 'appointment'
      });
    }

    res.json({
      success: true,
      message: `Appointment ${status} successfully.`,
      data: appointment
    });
  } catch (error) {
    console.error('UpdateAppointmentStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Cancel appointment
 * DELETE /api/appointments/:id
 */
const cancelAppointment = async (req, res) => {
  try {
    const { data: appointment } = await supabaseAdmin
      .from('appointments')
      .select('*, patients(user_id)')
      .eq('id', req.params.id)
      .single();

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Only patient who booked or admin can cancel
    if (req.user.role === 'patient' && appointment.patients?.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await supabaseAdmin
      .from('appointments')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', req.params.id);

    await supabaseAdmin
      .from('queue_tokens')
      .update({ status: 'cancelled' })
      .eq('appointment_id', req.params.id);

    res.json({ success: true, message: 'Appointment cancelled successfully.' });
  } catch (error) {
    console.error('CancelAppointment error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get available time slots for a doctor on a date
 * GET /api/appointments/slots/:doctorId
 */
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required.' });
    }

    // Get doctor availability
    // Use 'long' then toLowerCase() — 'lowercase' is not a valid weekday option
    const dayOfWeek = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const { data: availability } = await supabaseAdmin
      .from('doctor_availability')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_available', true)
      .single();

    if (!availability) {
      return res.json({ success: true, data: [], message: 'Doctor not available on this day.' });
    }

    // Generate all slots
    const { generateTimeSlots } = require('../utils/helpers');
    const allSlots = generateTimeSlots(
      availability.start_time,
      availability.end_time,
      availability.slot_duration || 30
    );

    // Get booked slots
    const { data: bookedAppointments } = await supabaseAdmin
      .from('appointments')
      .select('appointment_time')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', date)
      .neq('status', 'cancelled');

    const bookedTimes = bookedAppointments?.map(a => a.appointment_time) || [];

    // Filter available slots
    const availableSlots = allSlots.map(slot => ({
      time: slot,
      available: !bookedTimes.includes(slot)
    }));

    res.json({ success: true, data: availableSlots });
  } catch (error) {
    console.error('GetAvailableSlots error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get today's appointments summary (for dashboard)
 * GET /api/appointments/today
 */
const getTodayAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    let query = supabaseAdmin
      .from('appointments')
      .select('*, doctors(users(full_name)), patients(users(full_name))')
      .eq('appointment_date', today);

    if (req.user.role === 'doctor') {
      const { data: doctor } = await supabaseAdmin
        .from('doctors').select('id').eq('user_id', req.user.id).single();
      if (doctor) query = query.eq('doctor_id', doctor.id);
    }

    const { data: appointments, error } = await query.order('appointment_time');

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch today appointments.' });
    }

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error('GetTodayAppointments error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
  getTodayAppointments
};
