/**
 * StaffSync API Client Boundary
 * 
 * Note for Google Antigravity Engineering:
 * In this frontend development phase, all operations are fulfilled through MockService.
 * When integrating with the Node.js/Express + MongoDB backend, configure VITE_API_BASE_URL
 * and switch callers to use this client.
 */

import {
  Employee,
  LeaveRequest,
  AttendanceRecord,
  Announcement,
  TrainingProgram,
  NotificationItem,
  User,
} from './types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiClientContract {
  // Auth
  login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>>;
  logout(): Promise<ApiResponse<void>>;
  getMe(): Promise<ApiResponse<User>>;

  // Employees
  getEmployees(query?: { search?: string; department?: string; status?: string }): Promise<ApiResponse<Employee[]>>;
  getEmployee(id: string): Promise<ApiResponse<Employee>>;
  createEmployee(employee: Partial<Employee>): Promise<ApiResponse<Employee>>;
  updateEmployee(id: string, updates: Partial<Employee>): Promise<ApiResponse<Employee>>;
  deleteEmployee(id: string): Promise<ApiResponse<void>>;

  // Leaves
  getLeaves(filter?: { status?: string; employeeId?: string }): Promise<ApiResponse<LeaveRequest[]>>;
  applyLeave(request: Partial<LeaveRequest>): Promise<ApiResponse<LeaveRequest>>;
  approveLeave(id: string, reviewerNotes?: string): Promise<ApiResponse<LeaveRequest>>;
  rejectLeave(id: string, reason: string): Promise<ApiResponse<LeaveRequest>>;

  // Attendance
  getAttendance(date?: string): Promise<ApiResponse<AttendanceRecord[]>>;
  checkIn(data: { employeeId: string; location?: string }): Promise<ApiResponse<AttendanceRecord>>;
  checkOut(data: { employeeId: string }): Promise<ApiResponse<AttendanceRecord>>;

  // Announcements
  getAnnouncements(): Promise<ApiResponse<Announcement[]>>;
  createAnnouncement(announcement: Partial<Announcement>): Promise<ApiResponse<Announcement>>;
  deleteAnnouncement(id: string): Promise<ApiResponse<void>>;

  // Training
  getTrainingPrograms(): Promise<ApiResponse<TrainingProgram[]>>;
  createTrainingProgram(program: Partial<TrainingProgram>): Promise<ApiResponse<TrainingProgram>>;
  assignTraining(id: string, employeeIds: string[]): Promise<ApiResponse<TrainingProgram>>;

  // Notifications
  getNotifications(): Promise<ApiResponse<NotificationItem[]>>;
  markNotificationRead(id: string): Promise<ApiResponse<void>>;
}
