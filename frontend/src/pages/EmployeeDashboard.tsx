import React, { useEffect, useCallback } from 'react';
import { useAttendanceStore, Summary } from '../store/attendanceStore';
import { api } from '../utils/api';
import MarkAttendance from '../components/employee/MarkAttendance';
import { CheckCircle, XCircle, Clock, TrendingUp, Calendar, Loader2 } from 'lucide-react';

const StatCard: React.FC<{ title: string, value: string | number, icon: React.FC<any>, color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 border border-gray-100">
        <div className={`p-3 rounded-full ${color} text-white`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const EmployeeDashboard: React.FC = () => {
    const { user, employeeDashboard, setDashboardData, setLoading, loading } = useAttendanceStore();

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.dashboard.employee();
            setDashboardData('employeeDashboard', data.data as Summary);
        } catch (err) {
            // Error handled by api.ts
        } finally {
            setLoading(false);
        }
    }, [setDashboardData, setLoading]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const summary = employeeDashboard;
    const totalHours = summary ? summary.totalHours.toFixed(2) : 0;
    const avgHours = summary && summary.totalDays > 0 ? (summary.totalHours / summary.totalDays).toFixed(2) : 0;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
                Welcome Back, {user?.name.split(' ')[0]}!
            </h1>

            <MarkAttendance />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Present Days" value={summary?.present || 0} icon={CheckCircle} color="bg-green-500" />
                <StatCard title="Late Arrivals" value={summary?.late || 0} icon={Clock} color="bg-yellow-500" />
                <StatCard title="Total Hours (Month)" value={`${totalHours} h`} icon={TrendingUp} color="bg-indigo-500" />
                <StatCard title="Avg. Daily Hours" value={`${avgHours} h`} icon={Calendar} color="bg-blue-500" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-4 border-b pb-3">Monthly Summary</h2>
                {loading && !summary ? (
                    <div className="text-center py-4"><Loader2 className="w-6 h-6 mx-auto animate-spin text-indigo-500" /></div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-gray-500 text-sm">Absences</p>
                            <p className="text-xl font-bold text-red-600">{summary?.absent || 0}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Half Days</p>
                            <p className="text-xl font-bold text-blue-600">{summary?.halfDay || 0}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Working Days</p>
                            <p className="text-xl font-bold text-gray-800">{summary?.totalDays || 0}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Department</p>
                            <p className="text-xl font-bold text-gray-800">{user?.department}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;