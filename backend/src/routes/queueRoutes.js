const express = require('express');
const router = express.Router();
const { getDoctorQueue, getQueuePosition, updateQueueStatus, callNextPatient } = require('../controllers/queueController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/:doctorId', getDoctorQueue);
router.get('/position/:appointmentId', getQueuePosition);
router.put('/:tokenId/status', authorize('doctor', 'admin'), updateQueueStatus);
router.post('/:doctorId/next', authorize('doctor', 'admin'), callNextPatient);

module.exports = router;
