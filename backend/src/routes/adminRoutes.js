/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRevenueAnalytics,
  manageDoctors,
  toggleUserStatus,
  deleteDoctor,
  getDepartments,
  createDepartment,
  manageBeds,
  updateBedStatus,
  getEmergencyCases,
  createEmergencyCase
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// Public route — any authenticated user can fetch departments (needed for booking)
router.get('/departments', authenticate, getDepartments);

// All routes below require admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueAnalytics);
router.get('/doctors', manageDoctors);
router.delete('/doctors/:id', deleteDoctor);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.post('/departments', createDepartment);
router.get('/beds', manageBeds);
router.put('/beds/:id', updateBedStatus);
router.get('/emergency', getEmergencyCases);
router.post('/emergency', createEmergencyCase);

module.exports = router;
