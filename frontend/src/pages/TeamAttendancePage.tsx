import React from 'react';
import ProtectedRoute from '../components/common/ProtectedRoute';
import TeamAttendance from '../components/manager/TeamAttendance';

const TeamAttendancePage: React.FC = () => {
    return (
        <ProtectedRoute allowedRoles={['manager']}>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">All Employee Records</h1>
                <TeamAttendance />
            </div>
        </ProtectedRoute>
    );
};

export default TeamAttendancePage;