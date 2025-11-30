import React from 'react';
import { useAttendanceStore } from '../../store/attendanceStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: Array<'employee' | 'manager'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthReady, user, currentPage, setCurrentPage } = useAttendanceStore();

    if (!isAuthReady) {
        return (
            <div className="flex items-center justify-center p-10 min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        // Not authenticated, redirect to login page logic (handled by App.tsx router)
        // Here, we just render a message since App.tsx handles the actual full page redirect
        return <div className="p-8 text-center text-red-600">Please log in to view this page.</div>;
    }

    if (!allowedRoles.includes(user.role)) {
        // Unauthorized role
        return (
            <div className="p-8 text-center text-red-600">
                <h2 className="text-xl font-semibold">Access Denied</h2>
                <p>Your role ({user.role}) is not authorized to view this content.</p>
                <button onClick={() => setCurrentPage('dashboard')} className="mt-4 text-indigo-600 hover:underline">Go to Dashboard</button>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;