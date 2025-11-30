import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import MarkAttendancePage from './pages/MarkAttendancePage'
import AttendanceHistoryPage from './pages/AttendanceHistoryPage'
import ProfilePage from './pages/ProfilePage'
import TeamAttendancePage from './pages/TeamAttendancePage'
import TeamCalendarPage from './pages/TeamCalendarPage'
import ReportsPage from './pages/ReportsPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import { useAuthStore } from './store/attendanceStore'
import { ROLES } from './utils/constants'
import { useEffect } from 'react'

function App() {
  const { user, loadUser } = useAuthStore()

  useEffect(() => {
    // `loadUser` returns the stored user; we call it to match prior behavior.
    loadUser()
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        {user?.role === ROLES.EMPLOYEE ? (
          <>
            <Route path="/" element={<EmployeeDashboard />} />
            <Route path="/mark-attendance" element={<MarkAttendancePage />} />
            <Route path="/history" element={<AttendanceHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<ManagerDashboard />} />
            <Route path="/team-attendance" element={<TeamAttendancePage />} />
            <Route path="/team-calendar" element={<TeamCalendarPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </>
        )}
      </Route>
    </Routes>
  )
}

export default App