import React, { useEffect, useState, useCallback } from 'react';
import { useAttendanceStore, AttendanceRecord } from '../../store/attendanceStore';
import { api } from '../../utils/api';
import { Calendar, Clock, Loader2, RefreshCw } from 'lucide-react';
import moment from 'moment';

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

const AttendanceHistory: React.FC = () => {
    const { myHistory, setDashboardData, loading, setLoading, error } = useAttendanceStore();
    const [isFetching, setIsFetching] = useState(false);

    const fetchHistory = useCallback(async () => {
        setIsFetching(true);
        setLoading(true);
        try {
            const data = await api.attendance.myHistory();
            setDashboardData('myHistory', data.data);
        } catch (err) {
            // Error handled by api.ts
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    }, [setDashboardData, setLoading]);

    useEffect(() => {
        if (myHistory.length === 0) {
            fetchHistory();
        }
    }, [myHistory.length, fetchHistory]);

    if (isFetching && myHistory.length === 0) {
        return <div className="p-8 text-center"><Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-500" /> <p className="mt-2">Loading history...</p></div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                    My Recent Attendance
                </h2>
                <button 
                    onClick={fetchHistory} 
                    disabled={isFetching}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {myHistory.length === 0 && !error && (
                <div className="text-center py-10 text-gray-500">No attendance records found.</div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {myHistory.map((record) => (
                            <tr key={record._id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {moment(record.date).format('MMM Do, YYYY')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.checkInTime || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.checkOutTime || 'Pending'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.totalHours > 0 ? `${record.totalHours.toFixed(2)} h` : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={record.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceHistory;