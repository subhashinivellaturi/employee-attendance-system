import React from 'react';
import RegisterForm from '../components/shared/RegisterForm';
import { useAttendanceStore } from '../store/attendanceStore';

const Register: React.FC = () => {
    const { setCurrentPage } = useAttendanceStore();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-lg text-center mb-8">
                <h1 className="text-4xl font-extrabold text-green-700">Join the Team</h1>
                <p className="mt-2 text-gray-600">Create your employee account.</p>
            </div>
            
            <RegisterForm />
            
            <div className="mt-6 text-sm text-gray-600">
                Already have an account? 
                <button onClick={() => setCurrentPage('login')} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
                    Log in
                </button>
            </div>
        </div>
    );
};

export default Register;