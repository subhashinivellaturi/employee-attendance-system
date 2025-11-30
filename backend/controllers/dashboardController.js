const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require('moment');

// @desc    Get Employee Dashboard Summary
// @route   GET /api/dashboard/employee
exports.getEmployeeDashboard = async (req, res) => {
    const userId = req.user.id;
    const now = moment();
    const startOfMonth = now.clone().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = now.clone().endOf('month').format('YYYY-MM-DD');

    try {
        const records = await Attendance.find({ 
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // Calculate summary statistics
        const summary = records.reduce((acc, record) => {
            acc.totalDays++;
            acc.totalHours += record.totalHours;
            
            if (record.status === 'present') acc.present++;
            if (record.status === 'absent') acc.absent++;
            if (record.status === 'late') acc.late++;
            if (record.status === 'half-day') acc.halfDay++;
            
            return acc;
        }, { present: 0, absent: 0, late: 0, halfDay: 0, totalHours: 0, totalDays: 0 });

        res.status(200).json({ success: true, data: summary });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching employee dashboard data.' });
    }
};

// @desc    Get Manager Dashboard Summary
// @route   GET /api/dashboard/manager
exports.getManagerDashboard = async (req, res) => {
    const now = moment();
    const today = now.format('YYYY-MM-DD');

    try {
        // 1. Get all departments
        const departments = await User.distinct('department');
        
        // 2. Get today's attendance for all users
        const todayRecords = await Attendance.find({ date: today })
            .populate({ path: 'userId', select: 'department' });
        
        // 3. Get total employee count
        const totalEmployees = await User.countDocuments();
        
        // 4. Calculate summary
        const summary = {
            totalEmployees,
            todayStats: {
                present: 0, 
                late: 0, 
                checkedIn: 0,
                absent: totalEmployees // Start with all absent
            },
            departmentStats: {}
        };
        
        todayRecords.forEach(record => {
            const department = record.userId.department;

            summary.todayStats.absent--; // User is recorded, so not fully absent
            summary.todayStats.checkedIn++; // User checked in

            if (record.checkOutTime) { // Fully recorded day
                if (record.status === 'present' || record.status === 'half-day') {
                    summary.todayStats.present++;
                }
                if (record.status === 'late') {
                    summary.todayStats.late++;
                }
            } else if (record.status === 'late') {
                 summary.todayStats.late++;
            }

            // Initialize department stats if needed
            if (!summary.departmentStats[department]) {
                summary.departmentStats[department] = { present: 0, absent: 0, late: 0 };
            }

            if (record.status === 'present' || record.status === 'half-day') summary.departmentStats[department].present++;
            if (record.status === 'late') summary.departmentStats[department].late++;
        });
        
        // Note: Accurately calculating today's absence requires complex logic 
        // (comparing total employees vs. records). We use a simpler method for the dashboard.
        
        res.status(200).json({ success: true, data: summary });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching manager dashboard data.' });
    }
};