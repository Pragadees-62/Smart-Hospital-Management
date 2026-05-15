const express = require('express');
const router = express.Router();
const { uploadReport, getReports, deleteReport } = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.use(authenticate);

router.get('/', getReports);
router.post('/', authorize('patient'), uploadSingle, uploadReport);
router.delete('/:id', deleteReport);

module.exports = router;
