import React, { useEffect, useCallback } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import { api } from '../utils/api';
import { Users, Clock, CheckCircle, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import moment from 'moment';

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

const ManagerDashboard: React.FC = () => {
    const { user, managerDashboard, setDashboardData, setLoading, loading } = useAttendanceStore();

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.dashboard.manager();
            setDashboardData('managerDashboard', data.data);
        } catch (err) {
            // Error handled by api.ts
        } finally {
            setLoading(false);
        }
    }, [setDashboardData, setLoading]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const summary = managerDashboard;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
                Manager Dashboard ({moment().format('MMM Do, YYYY')})
            </h1>

            {loading && !summary ? (
                 <div className="p-10 text-center"><Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-500" /> <p className="mt-2">Loading managerial overview...</p></div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Employees" value={summary?.totalEmployees || 0} icon={Users} color="bg-indigo-600" />
                        <StatCard title="Checked In Today" value={summary?.todayStats.checkedIn || 0} icon={CheckCircle} color="bg-green-600" />
                        <StatCard title="Late Arrivals Today" value={summary?.todayStats.late || 0} icon={Clock} color="bg-yellow-600" />
                        <StatCard title="Assumed Absent" value={summary?.totalEmployees - summary?.todayStats.checkedIn} icon={AlertTriangle} color="bg-red-600" />
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 border-b pb-3">Attendance by Department</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present/Checked In</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Arrivals</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {summary && Object.entries(summary.departmentStats).map(([dept, stats]) => (
                                        <tr key={dept} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{stats.present}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">{stats.late}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                         {summary && Object.keys(summary.departmentStats).length === 0 && (
                            <div className="text-center py-4 text-gray-500">No attendance recorded yet today.</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ManagerDashboard;