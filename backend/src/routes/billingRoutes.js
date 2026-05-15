const express = require('express');
const router = express.Router();
const { createBill, getBills, processPayment, getBill } = require('../controllers/billingController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getBills);
router.get('/:id', getBill);
router.post('/', authorize('admin', 'doctor'), createBill);
router.put('/:id/pay', processPayment);

module.exports = router;
