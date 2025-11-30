import React from 'react';
import LoginForm from '../components/shared/LoginForm';
import { useAttendanceStore } from '../store/attendanceStore';

const Login: React.FC = () => {
    const { setCurrentPage } = useAttendanceStore();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md text-center mb-8">
                <h1 className="text-4xl font-extrabold text-indigo-700">Attendance System</h1>
                <p className="mt-2 text-gray-600">Please sign in to continue.</p>
            </div>
            
            <LoginForm />
            
            <div className="mt-6 text-sm text-gray-600">
                Don't have an account? 
                <button onClick={() => setCurrentPage('register')} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
                    Sign up
                </button>
            </div>
        </div>
    );
};

export default Login;