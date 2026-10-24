export type UserRole = 'hr' | 'manager' | 'employee';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  designation: string;
  department: string;
  phone: string;
  location: string;
}

export type EmploymentStatus = 'Active' | 'On Leave' | 'Probation' | 'Terminated';

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  designation: string;
  joiningDate: string;
  status: EmploymentStatus;
  managerId: string;
  managerName: string;
  location: string;
  avatar: string;
  leaveBalances: {
    annual: number;
    sick: number;
    casual: number;
    totalRemaining: number;
  };
}

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Parental' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export type AttendanceStatus = 'Present' | 'Late' | 'On Leave' | 'Absent';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: number;
  status: AttendanceStatus;
  notes?: string;
}

export type AnnouncementPriority = 'High' | 'Medium' | 'Normal';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  priority: AnnouncementPriority;
  audience: string;
  pinned?: boolean;
}

export interface TrainingAssignment {
  employeeId: string;
  employeeName: string;
  department: string;
  progressPercent: number;
  completed: boolean;
  completedAt?: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  instructor: string;
  department: string;
  durationHours: number;
  modulesCount: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  assignedEmployees: TrainingAssignment[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'leave' | 'attendance' | 'announcement' | 'training' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}
