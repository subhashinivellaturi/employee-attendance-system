import axios from "axios";

// Vite exposes env vars through `import.meta.env`. Use `VITE_` prefix for custom vars.
const BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000/api";

const client = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

// attach Authorization header from localStorage token for each request (if present)
client.interceptors.request.use((cfg: any) => {
  try {
    const token = localStorage.getItem('token') || null;
    if (token) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
  } catch (err) {
    // ignore
  }
  return cfg;
});

// Auth
export const registerUser = (data: { name: string; email: string; password: string; role?: string }) =>
  client.post("/auth/register", data);

export const loginUser = (data: { email: string; password: string }) =>
  client.post("/auth/login", data);

// Employee endpoints (names components use)
export const getEmployeeDashboard = () => client.get(`/dashboard/employee`);
export const getTodayStatus = () => client.get(`/attendance/today`);
export const checkIn = () => client.post("/attendance/checkin");
export const checkOut = () => client.post("/attendance/checkout");
export const getMyHistory = () => client.get(`/attendance/my-history`);
export const getRecent7Days = () => client.get(`/attendance/recent7`);
export const getMonthStats = (month?: number, year?: number) => client.get(`/attendance/my-summary`, { params: { month, year } });
export const getHoursWorked = () => client.get(`/attendance/hours`);

// Manager endpoints
export const getManagerDashboard = () => client.get("/dashboard/manager");
export const exportAttendanceCSV = () => client.get("/attendance/export", { responseType: "text" });

// default export (optional)
// NOTE: only named exports are provided to avoid default export issues.
