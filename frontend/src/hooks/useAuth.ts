import { useAttendanceStore } from '../store/attendanceStore';
import { api } from '../utils/api';

/**
 * Custom hook for authentication logic (login, register, logout).
 */
export const useAuth = () => {
    const { setLoading, setAuth, setError, logout, token } = useAttendanceStore();
    
    // Function to handle login
    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.auth.login({ email, password });
            setAuth(data.token, data.user);
            return data.user;
        } catch (err) {
            console.error('Login error:', err);
            // Error is already set in the store by apiFetch utility
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    // Function to handle registration
    const register = async (formData: any) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.auth.register(formData);
            setAuth(data.token, data.user);
            return data.user;
        } catch (err) {
            console.error('Registration error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to check user status (useful for initial load or token refresh)
    const checkAuthStatus = async () => {
        if (!token) {
            useAttendanceStore.setState({ isAuthReady: true, currentPage: 'login' });
            return;
        }

        setLoading(true);
        try {
            const data = await api.auth.me();
            useAttendanceStore.setState({ user: data.data, isAuthReady: true });
        } catch (err) {
            // Token invalid or expired
            console.error('Auth status check failed:', err);
            logout();
        } finally {
            setLoading(false);
        }
    };


    return {
        login,
        register,
        logout,
        checkAuthStatus
    };
};