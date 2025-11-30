import React from 'react';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { useAttendanceStore } from '../store/attendanceStore';
import { User, Mail, Briefcase, TrendingUp } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { user } = useAttendanceStore();

    if (!user) return null;

    const ProfileDetail: React.FC<{ icon: React.FC<any>, label: string, value: string }> = ({ icon: Icon, label, value }) => (
        <div className="flex items-center space-x-4 p-4 border-b last:border-b-0">
            <Icon className="w-6 h-6 text-indigo-500 flex-shrink-0" />
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-lg font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );

    return (
        <ProtectedRoute allowedRoles={['employee', 'manager']}>
            <div className="space-y-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-3">User Profile</h1>

                <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold">
                            {user.name[0]}
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900">{user.name}</h2>
                            <p className={`text-sm font-semibold mt-1 px-3 py-1 rounded-full inline-block ${user.role === 'manager' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                {user.role.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileDetail icon={Mail} label="Email Address" value={user.email} />
                        <ProfileDetail icon={User} label="Employee ID" value={user.employeeId} />
                        <ProfileDetail icon={Briefcase} label="Department" value={user.department} />
                        <ProfileDetail icon={TrendingUp} label="User ID (DB Reference)" value={user._id} />
                    </div>
                </div>
                
                <div className="text-sm text-gray-500 p-4 bg-gray-100 rounded-lg">
                    <p>Note: Profile data is fetched directly from the authenticated user context.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default ProfilePage;