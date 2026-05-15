/**
 * Prescription Controller
 * Handles prescription creation and management
 */

const { supabaseAdmin } = require('../config/supabase');

/**
 * Create prescription (doctor only)
 * POST /api/prescriptions
 */
const createPrescription = async (req, res) => {
  try {
    const {
      appointment_id,
      patient_id,
      diagnosis,
      medicines,
      instructions,
      follow_up_date,
      notes
    } = req.body;

    // Get doctor profile
    const { data: doctor } = await supabaseAdmin
      .from('doctors')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    }

    const { data: prescription, error } = await supabaseAdmin
      .from('prescriptions')
      .insert({
        appointment_id,
        patient_id,
        doctor_id: doctor.id,
        diagnosis,
        medicines: JSON.stringify(medicines),
        instructions,
        follow_up_date,
        notes
      })
      .select(`
        *,
        doctors(users(full_name), specialization, departments(name)),
        patients(users(full_name, email))
      `)
      .single();

    if (error) {
      console.error('Prescription creation error:', error);
      return res.status(500).json({ success: false, message: 'Failed to create prescription.' });
    }

    // Notify patient
    const patientUserId = prescription.patients?.user_id;
    if (patientUserId) {
      await supabaseAdmin.from('notifications').insert({
        user_id: patientUserId,
        title: 'New Prescription',
        message: `Dr. ${prescription.doctors?.users?.full_name} has added a new prescription for you.`,
        type: 'prescription'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully.',
      data: prescription
    });
  } catch (error) {
    console.error('CreatePrescription error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get prescriptions
 * GET /api/prescriptions
 */
const getPrescriptions = async (req, res) => {
  try {
    let query = supabaseAdmin
      .from('prescriptions')
      .select(`
        *,
        doctors(id, specialization, users(full_name, avatar_url), departments(name)),
        patients(id, users(full_name, email))
      `);

    if (req.user.role === 'patient') {
      const { data: patient } = await supabaseAdmin
        .from('patients').select('id').eq('user_id', req.user.id).single();
      if (patient) query = query.eq('patient_id', patient.id);
    } else if (req.user.role === 'doctor') {
      const { data: doctor } = await supabaseAdmin
        .from('doctors').select('id').eq('user_id', req.user.id).single();
      if (doctor) query = query.eq('doctor_id', doctor.id);
    }

    const { data: prescriptions, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch prescriptions.' });
    }

    // Parse medicines JSON
    const parsedPrescriptions = prescriptions.map(p => ({
      ...p,
      medicines: typeof p.medicines === 'string' ? JSON.parse(p.medicines) : p.medicines
    }));

    res.json({ success: true, data: parsedPrescriptions });
  } catch (error) {
    console.error('GetPrescriptions error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get single prescription
 * GET /api/prescriptions/:id
 */
const getPrescription = async (req, res) => {
  try {
    const { data: prescription, error } = await supabaseAdmin
      .from('prescriptions')
      .select(`
        *,
        doctors(*, users(full_name, email, phone, avatar_url), departments(name)),
        patients(*, users(full_name, email, phone)),
        appointments(appointment_date, appointment_time)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }

    const parsedPrescription = {
      ...prescription,
      medicines: typeof prescription.medicines === 'string'
        ? JSON.parse(prescription.medicines)
        : prescription.medicines
    };

    res.json({ success: true, data: parsedPrescription });
  } catch (error) {
    console.error('GetPrescription error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Update prescription (doctor only)
 * PUT /api/prescriptions/:id
 */
const updatePrescription = async (req, res) => {
  try {
    const { diagnosis, medicines, instructions, follow_up_date, notes } = req.body;

    const { data: prescription, error } = await supabaseAdmin
      .from('prescriptions')
      .update({
        diagnosis,
        medicines: JSON.stringify(medicines),
        instructions,
        follow_up_date,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to update prescription.' });
    }

    res.json({ success: true, message: 'Prescription updated.', data: prescription });
  } catch (error) {
    console.error('UpdatePrescription error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { createPrescription, getPrescriptions, getPrescription, updatePrescription };
