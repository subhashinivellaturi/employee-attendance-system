import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAttendanceStore } from '../../store/attendanceStore';
import { DEPARTMENTS, ROLES } from '../../utils/constants';
import { Loader2 } from 'lucide-react';

const initialFormData = {
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: DEPARTMENTS[0],
    role: ROLES.EMPLOYEE,
};

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState(initialFormData);
    const { register } = useAuth();
    const { loading, error } = useAttendanceStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">Create Account</h2>
            {error && <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" disabled={loading} />
                </div>
                {/* Employee ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <input type="text" name="employeeId" required value={formData.employeeId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" disabled={loading} />
                </div>
                {/* Email */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" disabled={loading} />
                </div>
                {/* Password */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password (min 6 chars)</label>
                    <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" disabled={loading} />
                </div>
                {/* Department */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" disabled={loading}>
                        {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>
                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" disabled={loading}>
                        <option value={ROLES.EMPLOYEE}>Employee</option>
                        <option value={ROLES.MANAGER}>Manager</option>
                    </select>
                </div>
            </div>
            
            <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 transition duration-300 disabled:opacity-60"
                disabled={loading}
            >
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Register & Log In'}
            </button>
        </form>
    );
};

export default RegisterForm;