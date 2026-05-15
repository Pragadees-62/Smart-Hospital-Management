/**
 * Feedback Controller
 * Patients submit star rating + comment after a completed appointment
 */

const { supabaseAdmin } = require('../config/supabase');

/**
 * Submit feedback
 * POST /api/feedback
 */
const submitFeedback = async (req, res) => {
  try {
    const { appointment_id, rating, comment } = req.body;

    if (!appointment_id || !rating) {
      return res.status(400).json({ success: false, message: 'appointment_id and rating are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    // Verify appointment belongs to this patient and is completed
    const { data: patient } = await supabaseAdmin
      .from('patients').select('id').eq('user_id', req.user.id).single();

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found.' });
    }

    const { data: appointment } = await supabaseAdmin
      .from('appointments')
      .select('id, doctor_id, status, patient_id')
      .eq('id', appointment_id)
      .single();

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    if (appointment.patient_id !== patient.id) {
      return res.status(403).json({ success: false, message: 'Not your appointment.' });
    }
    if (appointment.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed appointments.' });
    }

    // Upsert — allow editing feedback
    const { data: feedback, error } = await supabaseAdmin
      .from('feedback')
      .upsert({
        appointment_id,
        patient_id: patient.id,
        doctor_id: appointment.doctor_id,
        rating: parseInt(rating),
        comment: comment?.trim() || null
      }, { onConflict: 'appointment_id' })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Feedback upsert error:', JSON.stringify(error));
      return res.status(500).json({ success: false, message: 'Failed to save feedback: ' + error.message });
    }

    res.status(201).json({ success: true, message: 'Thank you for your feedback!', data: feedback });
  } catch (err) {
    console.error('SubmitFeedback error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get feedback for an appointment (patient checks if already submitted)
 * GET /api/feedback/:appointmentId
 */
const getFeedbackByAppointment = async (req, res) => {
  try {
    // Use maybeSingle() — returns null when no row found instead of throwing
    const { data: feedback, error } = await supabaseAdmin
      .from('feedback')
      .select('*')
      .eq('appointment_id', req.params.appointmentId)
      .maybeSingle();

    if (error) {
      console.error('GetFeedback error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch feedback.' });
    }

    res.json({ success: true, data: feedback || null });
  } catch (err) {
    console.error('GetFeedback error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get all feedback for a doctor (doctor views their reviews)
 * GET /api/feedback/doctor/me
 */
const getDoctorFeedback = async (req, res) => {
  try {
    const { data: doctor } = await supabaseAdmin
      .from('doctors').select('id, rating').eq('user_id', req.user.id).single();

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const { data: feedbacks } = await supabaseAdmin
      .from('feedback')
      .select(`
        *,
        patients(users(full_name, avatar_url)),
        appointments(appointment_date, reason)
      `)
      .eq('doctor_id', doctor.id)
      .order('created_at', { ascending: false });

    const avg = feedbacks?.length
      ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
      : doctor.rating;

    res.json({
      success: true,
      data: feedbacks || [],
      average_rating: parseFloat(avg),
      total_reviews: feedbacks?.length || 0
    });
  } catch (err) {
    console.error('GetDoctorFeedback error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { submitFeedback, getFeedbackByAppointment, getDoctorFeedback };
