import React, { useEffect, useState } from "react";
import { getEmployeeDashboard } from "../../utils/api";
import { useAttendanceStore, useAuthStore } from "../../store/attendanceStore";

interface User { id: string; name: string; }

const EmployeeDashboard: React.FC<{ user?: User | null }> = ({ user: propUser }) => {
  const [status, setStatus] = useState<string>("Loading...");
  const [monthSummary, setMonthSummary] = useState<{ present:number; absent:number; late:number }>({ present:0, absent:0, late:0 });
  const [hours, setHours] = useState<number>(0);
  const [recent, setRecent] = useState<any[]>([]);
  const { checkIn, checkOut } = useAttendanceStore();
  const { user } = useAuthStore();
  const { fetchSummary } = useAttendanceStore();
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {
    if (!user?.id && !propUser?.id) return;
    getEmployeeDashboard()
      .then((res: any) => {
        setStatus(res.data.todayStatus ?? "Not Checked In");
        setMonthSummary({ present: res.data.present ?? 0, absent: res.data.absent ?? 0, late: res.data.late ?? 0 });
        setHours(res.data.totalHours ?? 0);
        if (res.data.recent) setRecent(res.data.recent);
      })
      .catch(() => setStatus("Error"));
  }, [user, propUser]);

  useEffect(() => {
    // fetch month summary when month or user changes
    (async () => {
      try {
        const data = await fetchSummary(month, new Date().getFullYear());
        if (data) setMonthSummary({ present: data.present ?? 0, absent: data.absent ?? 0, late: data.late ?? 0 });
      } catch {
        // ignore
      }
    })();
  }, [month, user?.id]);

  const handleCheckIn = async () => {
    try {
      await checkIn();
      const res = await getEmployeeDashboard();
      setStatus(res.data.todayStatus ?? "Checked In");
    } catch {
      setStatus("Error");
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      const res = await getEmployeeDashboard();
      setStatus(res.data.todayStatus ?? "Checked Out");
    } catch {
      setStatus("Error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl">Employee Dashboard</h2>
      <p>Today: <strong>{status}</strong></p>
      <p>This month: Present {monthSummary.present} | Absent {monthSummary.absent} | Late {monthSummary.late}</p>
      <p>Total hours: {hours}</p>

      <div className="mt-2">
        <label className="mr-2">Select month:</label>
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i+1}>{new Date(0, i).toLocaleString(undefined, { month: 'long' })}</option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <button onClick={handleCheckIn} className="mr-2 bg-blue-600 text-white px-4 py-2 rounded">Check In</button>
        <button onClick={handleCheckOut} className="bg-red-600 text-white px-4 py-2 rounded">Check Out</button>
      </div>

      <div className="mt-4">
        <h3 className="font-medium">Recent (7)</h3>
        <ul>
          {recent.map((r, i) => <li key={i}>{r.date} — {r.status}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
