/**
 * Appointment Routes
 */

const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
  getTodayAppointments
} = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/today', getTodayAppointments);
router.get('/slots/:doctorId', getAvailableSlots);
router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.post('/', authorize('patient'), bookAppointment);
router.put('/:id/status', authorize('doctor', 'admin'), updateAppointmentStatus);
router.delete('/:id', cancelAppointment);

module.exports = router;
