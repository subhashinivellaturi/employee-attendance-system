const express = require('express');
const { getEmployeeDashboard, getManagerDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// General Dashboard Route (Employee/Manager depending on role)
router.get('/employee', protect, getEmployeeDashboard);
router.get('/manager', protect, authorize('manager'), getManagerDashboard);

module.exports = router;