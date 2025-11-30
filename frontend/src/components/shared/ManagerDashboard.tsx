import React, { useEffect, useState } from "react";
import { getManagerDashboard, exportAttendanceCSV } from "../../utils/api";

const ManagerDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    getManagerDashboard().then((res: any) => setStats(res.data)).catch(() => setStats(null));
  }, []);

  const downloadCSV = async () => {
    const res = await exportAttendanceCSV();
    const blob = new Blob([res.data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!stats) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl">Manager Dashboard</h2>
      <p>Total: {stats.totalEmployees}</p>
      <p>Present today: {stats.todayPresent}</p>
      <p>Late today: {stats.lateEmployees ? stats.lateEmployees.length : 0}</p>
      <button onClick={downloadCSV} className="mt-3 bg-gray-800 text-white px-4 py-2 rounded">Export CSV</button>
    </div>
  );
};

export default ManagerDashboard;
