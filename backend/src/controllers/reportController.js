/**
 * Report Controller
 * Handles medical report uploads and management
 */

const { supabaseAdmin } = require('../config/supabase');
const path = require('path');
const fs = require('fs');

/**
 * Upload report
 * POST /api/reports
 */
const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { title, description, report_type, appointment_id } = req.body;

    const { data: patient } = await supabaseAdmin
      .from('patients')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const { data: report, error } = await supabaseAdmin
      .from('reports')
      .insert({
        patient_id: patient.id,
        appointment_id: appointment_id || null,
        title,
        description,
        report_type: report_type || 'general',
        file_url: fileUrl,
        file_name: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype
      })
      .select()
      .single();

    if (error) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ success: false, message: 'Failed to save report.' });
    }

    res.status(201).json({ success: true, message: 'Report uploaded.', data: report });
  } catch (error) {
    console.error('UploadReport error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Get reports
 * GET /api/reports
 */
const getReports = async (req, res) => {
  try {
    let query = supabaseAdmin
      .from('reports')
      .select('*');

    if (req.user.role === 'patient') {
      const { data: patient } = await supabaseAdmin
        .from('patients').select('id').eq('user_id', req.user.id).single();
      if (patient) query = query.eq('patient_id', patient.id);
    } else if (req.params.patientId) {
      query = query.eq('patient_id', req.params.patientId);
    }

    const { data: reports, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
    }

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error('GetReports error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * Delete report
 * DELETE /api/reports/:id
 */
const deleteReport = async (req, res) => {
  try {
    const { data: report } = await supabaseAdmin
      .from('reports')
      .select('file_url, patients(user_id)')
      .eq('id', req.params.id)
      .single();

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    // Check ownership
    if (req.user.role === 'patient' && report.patients?.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../', report.file_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await supabaseAdmin.from('reports').delete().eq('id', req.params.id);

    res.json({ success: true, message: 'Report deleted.' });
  } catch (error) {
    console.error('DeleteReport error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { uploadReport, getReports, deleteReport };
