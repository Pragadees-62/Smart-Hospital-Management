const express = require('express');
const router = express.Router();
const { createPrescription, getPrescriptions, getPrescription, updatePrescription } = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getPrescriptions);
router.get('/:id', getPrescription);
router.post('/', authorize('doctor'), createPrescription);
router.put('/:id', authorize('doctor'), updatePrescription);

module.exports = router;
