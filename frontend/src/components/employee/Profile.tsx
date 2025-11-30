import * as React from "react";
import axios from "axios";

const api = axios.create({ baseURL: "" });

interface EmployeeProfile {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: string;
}

export default function Profile() {
  const [me, setMe] = React.useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please login again.");
      setLoading(false);
      return;
    }

    api
      .get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMe(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return me ? (
    <div className="p-4 border w-80 mx-auto mt-10 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4 text-center">Employee Profile</h2>
      <p><b>Name:</b> {me.name}</p>
      <p><b>Email:</b> {me.email}</p>
      <p><b>Employee ID:</b> {me.employeeId}</p>
      <p><b>Department:</b> {me.department}</p>
      <p><b>Role:</b> {me.role}</p>
    </div>
  ) : (
    <p className="text-center text-gray-600 mt-10">No profile data</p>
  );
}
