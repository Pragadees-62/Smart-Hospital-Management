/**
 * Doctor Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  updateAvailability,
  getDoctorAnalytics,
  getDoctorPatients
} = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected doctor routes (MUST come before /:id to avoid route conflicts)
router.get('/profile/me', authenticate, authorize('doctor'), getDoctorProfile);
router.put('/profile', authenticate, authorize('doctor'), updateDoctorProfile);
router.put('/availability', authenticate, authorize('doctor'), updateAvailability);
router.get('/analytics/stats', authenticate, authorize('doctor'), getDoctorAnalytics);
router.get('/my/patients', authenticate, authorize('doctor'), getDoctorPatients);

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

module.exports = router;
