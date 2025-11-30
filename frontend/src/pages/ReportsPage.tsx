import React from 'react';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Reports from '../components/manager/Reports';

const ReportsPage: React.FC = () => {
    return (
        <ProtectedRoute allowedRoles={['manager']}>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Exportable Reports</h1>
                <Reports />
            </div>
        </ProtectedRoute>
    );
};

export default ReportsPage;