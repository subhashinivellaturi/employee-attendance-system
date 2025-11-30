const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Max check-in time (e.g., 9:15 AM)
const LATE_CHECK_IN_TIME = '09:15'; 
// Required full working hours (e.g., 8 hours)
const FULL_DAY_HOURS = 8; 

// @desc    Mark Check In
// @route   POST /api/attendance/checkin
exports.checkIn = async (req, res) => {
    const userId = req.user.id;
    const date = moment().format('YYYY-MM-DD');
    const checkInTime = moment().format('HH:mm');

    // Determine status based on check-in time
    const status = checkInTime > LATE_CHECK_IN_TIME ? 'late' : 'pending';

    try {
        const attendance = await Attendance.create({
            userId,
            date,
            checkInTime,
            status
        });
        res.status(201).json({ success: true, data: attendance, message: `Checked in at ${checkInTime}. Status: ${status}` });

    } catch (err) {
        if (err.code === 11000) { // Duplicate key error (already checked in today)
            return res.status(400).json({ success: false, message: 'You have already checked in today.' });
        }
        console.error(err);
        res.status(500).json({ success: false, message: 'Could not process check-in.' });
    }
};

// @desc    Mark Check Out
// @route   POST /api/attendance/checkout
exports.checkOut = async (req, res) => {
    const userId = req.user.id;
    const date = moment().format('YYYY-MM-DD');
    const checkOutTime = moment().format('HH:mm');

    try {
        const attendance = await Attendance.findOne({ userId, date });

        if (!attendance) {
            return res.status(404).json({ success: false, message: 'You must check in before checking out.' });
        }
        if (attendance.checkOutTime) {
            return res.status(400).json({ success: false, message: 'You have already checked out today.' });
        }

        // Calculate total hours
        const inMoment = moment(`${date} ${attendance.checkInTime}`, 'YYYY-MM-DD HH:mm');
        const outMoment = moment(`${date} ${checkOutTime}`, 'YYYY-MM-DD HH:mm');
        const duration = moment.duration(outMoment.diff(inMoment));
        const totalHours = parseFloat(duration.asHours().toFixed(2));

        // Recalculate status based on total hours
        let newStatus = attendance.status;
        if (totalHours < FULL_DAY_HOURS / 2) {
            newStatus = 'absent'; // Too short to even be a half day
        } else if (totalHours < FULL_DAY_HOURS) {
            newStatus = 'half-day';
        } else if (attendance.status === 'pending') {
            newStatus = 'present'; // Was on time and completed hours
        } else if (attendance.status === 'late' && totalHours >= FULL_DAY_HOURS) {
            newStatus = 'present'; // Late but worked full time
        }
        
        // Update record
        attendance.checkOutTime = checkOutTime;
        attendance.totalHours = totalHours;
        attendance.status = newStatus;
        await attendance.save();

        res.status(200).json({ success: true, data: attendance, message: `Checked out at ${checkOutTime}. Total hours: ${totalHours}h. Status: ${newStatus}` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Could not process check-out.' });
    }
};

// @desc    Get today's attendance status for the current user
// @route   GET /api/attendance/today
exports.getTodayStatus = async (req, res) => {
    const userId = req.user.id;
    const date = moment().format('YYYY-MM-DD');
    
    try {
        const record = await Attendance.findOne({ userId, date });
        
        let status = 'Not Checked In';
        if (record?.checkInTime && !record?.checkOutTime) {
            status = 'Checked In';
        } else if (record?.checkOutTime) {
            status = 'Checked Out';
        }

        res.status(200).json({ success: true, status, record });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching status' });
    }
};

// @desc    Get user's attendance history (Employee View)
// @route   GET /api/attendance/my-history
exports.getMyHistory = async (req, res) => {
    try {
        const history = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, data: history });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all attendance records (Manager View)
// @route   GET /api/attendance/all
exports.getAllAttendance = async (req, res) => {
    // Only managers are authorized (handled by middleware)
    const { date, department, status } = req.query;
    
    const filter = {};

    if (date) filter.date = date;
    if (status) filter.status = status;
    
    try {
        // Fetch users based on department filter
        let userFilter = {};
        if (department) userFilter.department = department;

        const users = await User.find(userFilter).select('_id name employeeId department');
        const userIds = users.map(user => user._id);
        
        // Filter attendance records by the selected user IDs
        filter.userId = { $in: userIds };

        const attendanceRecords = await Attendance.find(filter)
            .populate({ path: 'userId', select: 'name employeeId department' })
            .sort({ date: -1, 'userId.name': 1 });

        res.status(200).json({ success: true, count: attendanceRecords.length, data: attendanceRecords });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error fetching all attendance records.' });
    }
};

// @desc    Export attendance data to CSV (Manager View)
// @route   GET /api/attendance/export
exports.exportAttendance = async (req, res) => {
    // This is a placeholder for actual CSV generation, which can be complex
    // and would usually stream the file. For simplicity, we'll return mock data structure.

    const { startDate, endDate } = req.query;

    try {
        const filter = {};
        if (startDate && endDate) {
            // Find records within the date range
            filter.date = { $gte: startDate, $lte: endDate };
        }
        
        const attendanceRecords = await Attendance.find(filter)
            .populate({ path: 'userId', select: 'name employeeId department' })
            .sort({ date: 1 });

        const dataForCsv = attendanceRecords.map(record => ({
            EmployeeName: record.userId.name,
            EmployeeID: record.userId.employeeId,
            Department: record.userId.department,
            Date: record.date,
            CheckIn: record.checkInTime || 'N/A',
            CheckOut: record.checkOutTime || 'N/A',
            TotalHours: record.totalHours.toFixed(2),
            Status: record.status.toUpperCase(),
        }));

        // In a real application, you would use createCsvWriter here
        // and stream the result back to the client with appropriate headers:
        
        res.status(200).json({
            success: true,
            data: dataForCsv,
            message: `Successfully generated report data for ${dataForCsv.length} records.`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error generating report.' });
    }
};