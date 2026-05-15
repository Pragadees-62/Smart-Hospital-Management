/**
 * Queue Controller
 * Handles live queue management
 */

const { supabaseAdmin } = require('../config/supabase');

/**
 * Get queue for a doctor on a date
 * GET /api/queue/:doctorId
 */
const getDoctorQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    const queueDate = date || new Date().toISOString().split('T')[0];

    const { data: queue, error } = await supabaseAdmin
      .from('queue_tokens')
      .select(`
        *,
        patients(users(full_name, avatar_url)),
        appointments(appointment_time, reason, type)
      `)
      .eq('doctor_id', doctorId)
      .eq('appointment_date', queueDate)
      .order('token_number');

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch queue.' });
    }

    const stats = {
      total: queue.length,
      waiting: queue.filter(q => q.status === 'waiting').length,
      in_progress: queue.filter(q => q.status === 'in_progress').length,
      completed: queue.filter(q => q.status === 'completed').length,
      current_token: queue.find(q => q.status === 'in_progress')?.token_code || null
    };

    res.json({ success: true, data: queue, stats });
  } catch (error) {
    console.error('GetDoctorQueue error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get patient's queue position
 * GET /api/queue/position/:appointmentId
 */
const getQueuePosition = async (req, res) => {
  try {
    const { data: token } = await supabaseAdmin
      .from('queue_tokens')
      .select('*, appointments(appointment_date, doctor_id)')
      .eq('appointment_id', req.params.appointmentId)
      .single();

    if (!token) {
      return res.status(404).json({ success: false, message: 'Queue token not found.' });
    }

    // Count people ahead in queue
    const { count: aheadCount } = await supabaseAdmin
      .from('queue_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', token.appointments?.doctor_id)
      .eq('appointment_date', token.appointments?.appointment_date)
      .lt('token_number', token.token_number)
      .in('status', ['waiting', 'in_progress']);

    // Estimated wait time (assuming 15 min per patient)
    const estimatedWait = (aheadCount || 0) * 15;

    res.json({
      success: true,
      data: {
        token_code: token.token_code,
        token_number: token.token_number,
        status: token.status,
        position: (aheadCount || 0) + 1,
        people_ahead: aheadCount || 0,
        estimated_wait_minutes: estimatedWait
      }
    });
  } catch (error) {
    console.error('GetQueuePosition error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Update queue token status
 * PUT /api/queue/:tokenId/status
 */
const updateQueueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const { data: token, error } = await supabaseAdmin
      .from('queue_tokens')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.tokenId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to update queue.' });
    }

    res.json({ success: true, message: 'Queue updated.', data: token });
  } catch (error) {
    console.error('UpdateQueueStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Call next patient
 * POST /api/queue/:doctorId/next
 */
const callNextPatient = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    // Complete current in-progress
    await supabaseAdmin
      .from('queue_tokens')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('doctor_id', doctorId)
      .eq('appointment_date', today)
      .eq('status', 'in_progress');

    // Get next waiting patient
    const { data: nextToken } = await supabaseAdmin
      .from('queue_tokens')
      .select('*, patients(users(full_name))')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', today)
      .eq('status', 'waiting')
      .order('token_number')
      .limit(1)
      .single();

    if (!nextToken) {
      return res.json({ success: true, message: 'No more patients in queue.', data: null });
    }

    // Set next patient as in_progress
    await supabaseAdmin
      .from('queue_tokens')
      .update({ status: 'in_progress', updated_at: new Date().toISOString() })
      .eq('id', nextToken.id);

    // Notify patient
    if (nextToken.patients?.user_id) {
      await supabaseAdmin.from('notifications').insert({
        user_id: nextToken.patients.user_id,
        title: 'Your Turn!',
        message: `Token ${nextToken.token_code} - Please proceed to the doctor's room.`,
        type: 'queue'
      });
    }

    res.json({
      success: true,
      message: `Now calling token ${nextToken.token_code}`,
      data: nextToken
    });
  } catch (error) {
    console.error('CallNextPatient error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getDoctorQueue, getQueuePosition, updateQueueStatus, callNextPatient };
