/**
 * Patient Controller
 * Handles patient profile and data management
 */

const { supabaseAdmin } = require('../config/supabase');
const { getPagination } = require('../utils/helpers');

/**
 * Get patient profile
 * GET /api/patients/profile
 */
const getPatientProfile = async (req, res) => {
  try {
    const { data: patient, error } = await supabaseAdmin
      .from('patients')
      .select(`
        *,
        users(id, full_name, email, phone, avatar_url, created_at)
      `)
      .eq('user_id', req.user.id)
      .single();

    if (error || !patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found.' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    console.error('GetPatientProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Update patient profile
 * PUT /api/patients/profile
 */
const updatePatientProfile = async (req, res) => {
  try {
    const { date_of_birth, gender, blood_group, address, emergency_contact, allergies, medical_history } = req.body;

    const { data: patient, error } = await supabaseAdmin
      .from('patients')
      .update({
        date_of_birth,
        gender,
        blood_group,
        address,
        emergency_contact,
        allergies,
        medical_history,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Profile update failed.' });
    }

    res.json({ success: true, message: 'Profile updated.', data: patient });
  } catch (error) {
    console.error('UpdatePatientProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get patient dashboard stats
 * GET /api/patients/dashboard
 */
const getPatientDashboard = async (req, res) => {
  try {
    const { data: patient } = await supabaseAdmin
      .from('patients')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Upcoming appointments
    const { data: upcomingAppointments } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        doctors(specialization, users(full_name, avatar_url), departments(name))
      `)
      .eq('patient_id', patient.id)
      .gte('appointment_date', today)
      .in('status', ['pending', 'confirmed'])
      .order('appointment_date')
      .limit(5);

    // Total appointments
    const { count: totalAppointments } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patient.id);

    // Completed appointments
    const { count: completedAppointments } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patient.id)
      .eq('status', 'completed');

    // Recent prescriptions
    const { data: recentPrescriptions } = await supabaseAdmin
      .from('prescriptions')
      .select(`
        *,
        doctors(users(full_name))
      `)
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false })
      .limit(3);

    // Pending bills
    const { data: pendingBills } = await supabaseAdmin
      .from('billing')
      .select('*')
      .eq('patient_id', patient.id)
      .eq('payment_status', 'pending')
      .limit(5);

    // Unread notifications
    const { count: unreadNotifications } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
      .eq('is_read', false);

    res.json({
      success: true,
      data: {
        upcoming_appointments: upcomingAppointments || [],
        total_appointments: totalAppointments || 0,
        completed_appointments: completedAppointments || 0,
        recent_prescriptions: recentPrescriptions || [],
        pending_bills: pendingBills || [],
        unread_notifications: unreadNotifications || 0
      }
    });
  } catch (error) {
    console.error('GetPatientDashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get all patients (admin only)
 * GET /api/patients
 */
const getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const { offset } = getPagination(page, limit);

    const { data: patients, error, count } = await supabaseAdmin
      .from('patients')
      .select(`
        *,
        users(id, full_name, email, phone, avatar_url, is_active, created_at)
      `, { count: 'exact' })
      .range(offset, offset + parseInt(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch patients.' });
    }

    let filteredPatients = patients;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = patients.filter(p =>
        p.users?.full_name?.toLowerCase().includes(searchLower) ||
        p.users?.email?.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: filteredPatients,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('GetAllPatients error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get patient by ID (doctor/admin)
 * GET /api/patients/:id
 */
const getPatientById = async (req, res) => {
  try {
    const { data: patient, error } = await supabaseAdmin
      .from('patients')
      .select(`
        *,
        users(id, full_name, email, phone, avatar_url)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    // Get appointment history
    const { data: appointments } = await supabaseAdmin
      .from('appointments')
      .select('*, doctors(users(full_name), departments(name))')
      .eq('patient_id', patient.id)
      .order('appointment_date', { ascending: false })
      .limit(10);

    // Get prescriptions
    const { data: prescriptions } = await supabaseAdmin
      .from('prescriptions')
      .select('*, doctors(users(full_name))')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      success: true,
      data: { ...patient, appointments, prescriptions }
    });
  } catch (error) {
    console.error('GetPatientById error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  getPatientProfile,
  updatePatientProfile,
  getPatientDashboard,
  getAllPatients,
  getPatientById
};
