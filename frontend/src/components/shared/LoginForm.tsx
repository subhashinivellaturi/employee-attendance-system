import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAttendanceStore } from '../../store/attendanceStore';
import { Loader2 } from 'lucide-react';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('john@example.com');
    const [password, setPassword] = useState('password123');
    const { login } = useAuth();
    const { loading, error } = useAttendanceStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">Sign in</h2>
            {error && <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">{error}</div>}
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    placeholder="you@example.com"
                    disabled={loading}
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    placeholder="••••••••"
                    disabled={loading}
                />
            </div>
            
            <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 disabled:opacity-60"
                disabled={loading}
            >
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Log In'}
            </button>
            
        </form>
    );
};

export default LoginForm;