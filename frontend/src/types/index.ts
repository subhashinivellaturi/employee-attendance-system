export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager';
  employeeId?: string;
  department?: string;
}

export interface Attendance {
  _id: string;
  userId: User | string;
  date: Date | string;
  checkInTime?: Date | string;
  checkOutTime?: Date | string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  totalHours?: number;
}

export interface Summary {
  present: number;
  absent: number;
  late: number;
  'half-day': number;
  totalHours?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}