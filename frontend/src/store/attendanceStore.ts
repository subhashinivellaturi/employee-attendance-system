import { getRecent7Days, getEmployeeDashboard, getMonthStats, getTodayStatus } from "../utils/api";
import { checkIn as apiCheckIn, checkOut as apiCheckOut } from "../utils/api";
import { useState, useEffect } from "react";

function readStoredUser() {
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

let currentUser = readStoredUser();

function emitAuthEvent(user: any) {
  try {
    window.dispatchEvent(new CustomEvent('authChange', { detail: user }));
  } catch {
    // ignore in non-browser envs
  }
}

export function setAuthUser(user: any) {
  currentUser = user;
  if (user) {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch {
      // ignore
    }
  } else {
    localStorage.removeItem('user');
  }
  emitAuthEvent(user);
}

export const useAuthStore = () => {
  const [user, setUser] = useState<any | null>(currentUser);

  useEffect(() => {
    const handler = (e: any) => setUser(e.detail ?? null);
    window.addEventListener('authChange', handler as EventListener);
    return () => window.removeEventListener('authChange', handler as EventListener);
  }, []);

  const loadUser = () => currentUser;

  const logout = () => {
    setAuthUser(null);
  };

  return { user, loadUser, logout };
};
export const useAttendanceStore = () => {
  const { user } = useAuthStore()

  const [today, setToday] = useState<any | null>(null)
  const [summary, setSummary] = useState<{ present: number; absent: number; late: number } | null>(null)

  const fetchToday = async () => {
    try {
      const res = await getTodayStatus()
      const data = res?.data?.record ?? null
      setToday(data)
      return data
    } catch (err) {
      setToday(null)
      return null
    }
  }

  const fetchSummary = async (month?: number, year?: number) => {
    try {
      const res = await getMonthStats(month, year)
      const data = res?.data ?? null
      setSummary(data ?? { present: 0, absent: 0, late: 0 })
      return data
    } catch (err) {
      setSummary({ present: 0, absent: 0, late: 0 })
      return null
    }
  }

  const loadDashboard = async (id: string) => {
    const res = await getRecent7Days()
    return res.data
  }

  const checkInAction = async () => {
    try {
      const res = await apiCheckIn();
      await fetchToday();
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  const checkOutAction = async () => {
    try {
      const res = await apiCheckOut();
      await fetchToday();
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  return { fetchToday, today, summary, fetchSummary, loadDashboard, checkIn: checkInAction, checkOut: checkOutAction }
}

export default useAttendanceStore;
