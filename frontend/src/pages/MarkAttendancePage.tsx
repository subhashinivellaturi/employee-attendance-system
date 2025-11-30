import React from "react";
import EmployeeDashboard from "../components/shared/EmployeeDashboard";

const MarkAttendancePage: React.FC<{ user?: { id: string; name: string } | null }> = ({ user }) => {
  return (
    <div>
      <EmployeeDashboard user={user} />
    </div>
  );
};

export default MarkAttendancePage;
