import React, { useCallback, useEffect, useState } from 'react';
import { useAttendanceStore } from '../../store/attendanceStore';
import { api } from '../../utils/api';
import { Clock, Loader2, CheckCircle, XCircle } from 'lucide-react';

const MarkAttendance: React.FC = () => {
    const { todayStatus, setDashboardData, loading, setLoading, setError } = useAttendanceStore();
    const [lastActionTime, setLastActionTime] = useState<string | null>(null);

    const fetchTodayStatus = useCallback(async () => {
        setLoading(true);
        try {
            const { status, record } = await api.attendance.todayStatus();
            setDashboardData('todayStatus', status);
            if (record?.checkInTime) setLastActionTime(record.checkInTime);
            if (record?.checkOutTime) setLastActionTime(record.checkOutTime);
        } catch (err) {
            setDashboardData('todayStatus', 'Error fetching status');
        } finally {
            setLoading(false);
        }
    }, [setLoading, setDashboardData]);

    useEffect(() => {
        fetchTodayStatus();
    }, [fetchTodayStatus]);

    const handleAction = async (action: 'checkIn' | 'checkOut') => {
        setLoading(true);
        setError(null);
        try {
            const data = action === 'checkIn' 
                ? await api.attendance.checkIn()
                : await api.attendance.checkOut();
            
            // Re-fetch status to update UI
            await fetchTodayStatus();

        } catch (err) {
            // Error handling is done in api.ts
        } finally {
            setLoading(false);
        }
    };

    const isCheckedIn = todayStatus === 'Checked In';
    const isCheckedOut = todayStatus === 'Checked Out';

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Clock className="w-6 h-6 mr-2 text-indigo-500" />
                    Daily Attendance
                </h3>
            </div>
            
            <div className="text-center space-y-4">
                <p className="text-sm font-medium text-gray-500">Current Status:</p>
                <div className={`inline-block px-4 py-2 text-xl font-extrabold rounded-full shadow-md ${
                    isCheckedIn ? 'bg-yellow-100 text-yellow-700' : 
                    isCheckedOut ? 'bg-green-100 text-green-700' : 
                    'bg-red-100 text-red-700'
                }`}>
                    {todayStatus}
                </div>

                {lastActionTime && (
                    <p className="text-sm text-gray-600">
                        {isCheckedOut ? 'Last Checked Out' : 'Checked In'} at: <span className="font-semibold">{lastActionTime}</span>
                    </p>
                )}

                <div className="pt-4 flex justify-center space-x-4">
                    <button
                        onClick={() => handleAction('checkIn')}
                        disabled={loading || isCheckedIn || isCheckedOut}
                        className="flex items-center px-6 py-3 text-lg font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition duration-200 disabled:opacity-50"
                    >
                        {loading && !isCheckedIn ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                        Check In
                    </button>
                    
                    <button
                        onClick={() => handleAction('checkOut')}
                        disabled={loading || !isCheckedIn || isCheckedOut}
                        className="flex items-center px-6 py-3 text-lg font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600 shadow-md transition duration-200 disabled:opacity-50"
                    >
                        {loading && isCheckedIn ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <XCircle className="w-5 h-5 mr-2" />}
                        Check Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MarkAttendance;