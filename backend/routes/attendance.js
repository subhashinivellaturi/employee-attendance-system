const express = require('express');
const { checkIn, checkOut, getMyHistory, getAllAttendance, exportAttendance, getTodayStatus } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Employee Routes (protected)
router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/today', protect, getTodayStatus);
router.get('/my-history', protect, getMyHistory);

// Manager Routes (protected and authorized)
router.get('/all', protect, authorize('manager'), getAllAttendance);
router.get('/export', protect, authorize('manager'), exportAttendance);

module.exports = router;