/**
 * Doctor Controller
 * Handles doctor profile, availability, and management
 */

const { supabaseAdmin } = require('../config/supabase');
const { getPagination } = require('../utils/helpers');

/**
 * Get all doctors (public)
 * GET /api/doctors
 */
const getAllDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 12, department, search, is_available } = req.query;
    const { offset } = getPagination(page, limit);

    let query = supabaseAdmin
      .from('doctors')
      .select(`
        id, specialization, experience_years, consultation_fee, rating, is_available,
        users(id, full_name, email, avatar_url, phone),
        departments(id, name)
      `, { count: 'exact' })
      .eq('users.is_active', true);

    if (department) query = query.eq('department_id', department);
    if (is_available !== undefined) query = query.eq('is_available', is_available === 'true');

    const { data: doctors, error, count } = await query
      .order('rating', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch doctors.' });
    }

    // Filter by search (name or specialization)
    let filteredDoctors = doctors;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDoctors = doctors.filter(d =>
        d.users?.full_name?.toLowerCase().includes(searchLower) ||
        d.specialization?.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: filteredDoctors,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('GetAllDoctors error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get doctor by ID
 * GET /api/doctors/:id
 */
const getDoctorById = async (req, res) => {
  try {
    const { data: doctor, error } = await supabaseAdmin
      .from('doctors')
      .select(`
        *,
        users(id, full_name, email, avatar_url, phone),
        departments(id, name, description),
        doctor_availability(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Get appointment stats
    const { count: totalAppointments } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctor.id)
      .eq('status', 'completed');

    res.json({
      success: true,
      data: { ...doctor, total_completed_appointments: totalAppointments }
    });
  } catch (error) {
    console.error('GetDoctorById error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get doctor's own profile
 * GET /api/doctors/profile/me
 */
const getDoctorProfile = async (req, res) => {
  try {
    const { data: doctor, error } = await supabaseAdmin
      .from('doctors')
      .select(`
        *,
        users(id, full_name, email, avatar_url, phone),
        departments(id, name),
        doctor_availability(*)
      `)
      .eq('user_id', req.user.id)
      .single();

    if (error || !doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    console.error('GetDoctorProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Update doctor profile
 * PUT /api/doctors/profile
 */
const updateDoctorProfile = async (req, res) => {
  try {
    const { specialization, experience_years, consultation_fee, bio, education } = req.body;

    const { data: doctor, error } = await supabaseAdmin
      .from('doctors')
      .update({
        specialization,
        experience_years,
        consultation_fee,
        bio,
        education,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Profile update failed.' });
    }

    res.json({ success: true, message: 'Profile updated.', data: doctor });
  } catch (error) {
    console.error('UpdateDoctorProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Update doctor availability
 * PUT /api/doctors/availability
 */
const updateAvailability = async (req, res) => {
  try {
    const { availability, is_available } = req.body;

    const { data: doctor } = await supabaseAdmin
      .from('doctors')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Update overall availability
    if (is_available !== undefined) {
      await supabaseAdmin
        .from('doctors')
        .update({ is_available, updated_at: new Date().toISOString() })
        .eq('id', doctor.id);
    }

    // Update weekly schedule
    if (availability && Array.isArray(availability)) {
      // Delete existing availability
      await supabaseAdmin
        .from('doctor_availability')
        .delete()
        .eq('doctor_id', doctor.id);

      // Insert new availability
      const availabilityData = availability.map(slot => ({
        doctor_id: doctor.id,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        slot_duration: slot.slot_duration || 30,
        is_available: slot.is_available !== false
      }));

      await supabaseAdmin.from('doctor_availability').insert(availabilityData);
    }

    res.json({ success: true, message: 'Availability updated successfully.' });
  } catch (error) {
    console.error('UpdateAvailability error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get doctor analytics
 * GET /api/doctors/analytics
 */
const getDoctorAnalytics = async (req, res) => {
  try {
    const { data: doctor } = await supabaseAdmin
      .from('doctors')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Today's appointments
    const { count: todayCount } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctor.id)
      .eq('appointment_date', today);

    // Total patients
    const { count: totalPatients } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctor.id)
      .eq('status', 'completed');

    // Pending appointments
    const { count: pendingCount } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctor.id)
      .eq('status', 'pending');

    // Last 30 days appointments
    const { data: recentAppointments } = await supabaseAdmin
      .from('appointments')
      .select('appointment_date, status')
      .eq('doctor_id', doctor.id)
      .gte('appointment_date', thirtyDaysAgo)
      .order('appointment_date');

    // Group by date for chart
    const appointmentsByDate = {};
    recentAppointments?.forEach(apt => {
      const date = apt.appointment_date;
      if (!appointmentsByDate[date]) appointmentsByDate[date] = 0;
      appointmentsByDate[date]++;
    });

    res.json({
      success: true,
      data: {
        today_appointments: todayCount || 0,
        total_patients: totalPatients || 0,
        pending_appointments: pendingCount || 0,
        appointments_by_date: appointmentsByDate
      }
    });
  } catch (error) {
    console.error('GetDoctorAnalytics error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get doctor's patients list
 * GET /api/doctors/patients
 */
const getDoctorPatients = async (req, res) => {
  try {
    const { data: doctor } = await supabaseAdmin
      .from('doctors')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    const { data: appointments } = await supabaseAdmin
      .from('appointments')
      .select('patients(*, users(full_name, email, phone, avatar_url))')
      .eq('doctor_id', doctor.id)
      .eq('status', 'completed');

    // Get unique patients
    const patientMap = new Map();
    appointments?.forEach(apt => {
      if (apt.patients && !patientMap.has(apt.patients.id)) {
        patientMap.set(apt.patients.id, apt.patients);
      }
    });

    res.json({ success: true, data: Array.from(patientMap.values()) });
  } catch (error) {
    console.error('GetDoctorPatients error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  updateAvailability,
  getDoctorAnalytics,
  getDoctorPatients
};
