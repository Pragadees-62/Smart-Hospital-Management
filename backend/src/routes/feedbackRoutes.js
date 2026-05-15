/**
 * Feedback Routes
 * NOTE: /doctor/me MUST be declared before /:appointmentId
 * to prevent Express matching "doctor" as an appointmentId param.
 */

const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbackByAppointment, getDoctorFeedback } = require('../controllers/feedbackController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// Patient submits feedback
router.post('/', authorize('patient'), submitFeedback);

// Doctor views their own reviews — MUST be before /:appointmentId
router.get('/doctor/me', authorize('doctor'), getDoctorFeedback);

// Check if feedback already submitted for an appointment
router.get('/:appointmentId', getFeedbackByAppointment);

module.exports = router;
