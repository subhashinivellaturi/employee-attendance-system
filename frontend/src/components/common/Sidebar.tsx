import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/attendanceStore'
import { ROLES } from '../../utils/constants'

const Sidebar: React.FC = () => {
  const { user } = useAuthStore()

  const employeeLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/mark-attendance', label: 'Mark Attendance' },
    { path: '/history', label: 'History' },
    { path: '/profile', label: 'Profile' }
  ]

  const managerLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/team-attendance', label: 'Team Attendance' },
    { path: '/team-calendar', label: 'Team Calendar' },
    { path: '/reports', label: 'Reports' }
  ]

  // When not authenticated, don't show manager or employee links
  const links = user ? (user.role === ROLES.EMPLOYEE ? employeeLinks : managerLinks) : []
  return (
    <aside className="w-64 bg-gray-100 p-4 h-screen">
      <ul>
        {links?.map(link => (
          <li key={link.path}>
            <Link to={link.path} className="block py-2">{link.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar