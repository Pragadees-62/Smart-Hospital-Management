/**
 * Patient Routes
 */

const express = require('express');
const router = express.Router();
const {
  getPatientProfile,
  updatePatientProfile,
  getPatientDashboard,
  getAllPatients,
  getPatientById
} = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// Patient routes
router.get('/profile', authorize('patient'), getPatientProfile);
router.put('/profile', authorize('patient'), updatePatientProfile);
router.get('/dashboard', authorize('patient'), getPatientDashboard);

// Admin/Doctor routes
router.get('/', authorize('admin', 'doctor'), getAllPatients);
router.get('/:id', authorize('admin', 'doctor'), getPatientById);

module.exports = router;
