import React, { useEffect, useState, useCallback } from 'react';
import { useAttendanceStore, AttendanceRecord } from '../../store/attendanceStore';
import { api } from '../../utils/api';
import { Users, Filter, Loader2, Calendar } from 'lucide-react';
import moment from 'moment';
import { DEPARTMENTS } from '../../utils/constants';

interface FullAttendanceRecord extends AttendanceRecord {
    userId: {
        _id: string;
        name: string;
        employeeId: string;
        department: string;
    }
}

const StatusBadge: React.FC<{ status: AttendanceRecord['status'] }> = ({ status }) => {
    let classes = 'px-3 py-1 text-xs font-semibold rounded-full';
    let text = status.toUpperCase();

    switch (status) {
        case 'present': classes += ' bg-green-100 text-green-800'; break;
        case 'late': classes += ' bg-yellow-100 text-yellow-800'; break;
        case 'absent': classes += ' bg-red-100 text-red-800'; break;
        case 'half-day': classes += ' bg-blue-100 text-blue-800'; break;
        default: classes += ' bg-gray-100 text-gray-800'; break;
    }

    return <span className={classes}>{text}</span>;
};

const TeamAttendance: React.FC = () => {
    const { allAttendance, setDashboardData, loading, setLoading } = useAttendanceStore();
    const [filters, setFilters] = useState({ department: '', date: moment().format('YYYY-MM-DD'), status: '' });
    const [isFetching, setIsFetching] = useState(false);

    const fetchAllAttendance = useCallback(async () => {
        setIsFetching(true);
        setLoading(true);
        try {
            const data = await api.attendance.all(filters);
            setDashboardData('allAttendance', data.data as FullAttendanceRecord[]);
        } catch (err) {
            // Error handled by api.ts
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    }, [setDashboardData, setLoading, filters]);

    useEffect(() => {
        fetchAllAttendance();
    }, [fetchAllAttendance]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    if (loading && allAttendance.length === 0) {
        return <div className="p-8 text-center"><Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-500" /> <p className="mt-2">Loading team attendance...</p></div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-indigo-600" />
                    Team Attendance Records
                </h2>
                <button onClick={fetchAllAttendance} disabled={isFetching} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                    <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
                    <select name="department" value={filters.department} onChange={handleFilterChange} className="w-full border rounded-lg p-2">
                        <option value="">All Departments</option>
                        {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full border rounded-lg p-2">
                        <option value="">All Statuses</option>
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="absent">Absent</option>
                        <option value="half-day">Half-Day</option>
                        <option value="pending">Pending (Checked In)</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept.</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In/Out</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {allAttendance.map((record) => (
                            <tr key={record._id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {record.userId.name} ({record.userId.employeeId})
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.userId.department}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {moment(record.date).format('MMM D, YYYY')}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.checkInTime || 'N/A'} / {record.checkOutTime || 'Pending'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.totalHours > 0 ? `${record.totalHours.toFixed(2)} h` : 'N/A'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <StatusBadge status={record.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {allAttendance.length === 0 && !isFetching && (
                <div className="text-center py-10 text-gray-500">No records found for the selected filters.</div>
            )}
        </div>
    );
};

export default TeamAttendance;