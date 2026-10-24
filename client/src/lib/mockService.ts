import {
  Employee,
  LeaveRequest,
  AttendanceRecord,
  Announcement,
  TrainingProgram,
  NotificationItem,
  User,
  UserRole,
  LeaveStatus,
  AttendanceStatus,
} from './types';
import {
  INITIAL_DEMO_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ATTENDANCE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRAINING_PROGRAMS,
  INITIAL_NOTIFICATIONS,
} from './mockData';

// Local storage keys
const KEY_EMPLOYEES = 'staffsync_employees_v1';
const KEY_LEAVES = 'staffsync_leaves_v1';
const KEY_ATTENDANCE = 'staffsync_attendance_v1';
const KEY_ANNOUNCEMENTS = 'staffsync_announcements_v1';
const KEY_TRAINING = 'staffsync_training_v1';
const KEY_NOTIFICATIONS = 'staffsync_notifications_v1';
const KEY_CURRENT_USER = 'staffsync_current_user_v1';

// In-memory fallback for SSR
let memEmployees = [...INITIAL_EMPLOYEES];
let memLeaves = [...INITIAL_LEAVE_REQUESTS];
let memAttendance = [...INITIAL_ATTENDANCE];
let memAnnouncements = [...INITIAL_ANNOUNCEMENTS];
let memTraining = [...INITIAL_TRAINING_PROGRAMS];
let memNotifications = [...INITIAL_NOTIFICATIONS];
let memCurrentUser: User = INITIAL_DEMO_USERS.hr;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getStored<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading localStorage for ${key}`, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event to notify components listening in real-time
    window.dispatchEvent(new CustomEvent('staffsync_storage_update', { detail: { key } }));
  } catch (err) {
    console.warn(`Error writing localStorage for ${key}`, err);
  }
}

export const MockService = {
  // Current User / Session
  getCurrentUser(): User {
    return getStored<User>(KEY_CURRENT_USER, memCurrentUser);
  },

  setCurrentUser(userOrRole: User | UserRole): User {
    let resolvedUser: User;
    if (typeof userOrRole === 'string') {
      resolvedUser = INITIAL_DEMO_USERS[userOrRole] || INITIAL_DEMO_USERS.hr;
    } else {
      resolvedUser = userOrRole;
    }
    memCurrentUser = resolvedUser;
    setStored(KEY_CURRENT_USER, resolvedUser);
    return resolvedUser;
  },

  // Employees
  getEmployees(): Employee[] {
    return getStored<Employee[]>(KEY_EMPLOYEES, memEmployees);
  },

  getEmployeeById(id: string): Employee | undefined {
    const list = this.getEmployees();
    return list.find((e) => e.id === id || e.employeeId === id);
  },

  addEmployee(data: Omit<Employee, 'id' | 'employeeId'> & { employeeId?: string }): Employee {
    const list = this.getEmployees();
    const newId = `emp-${Date.now().toString().slice(-4)}`;
    const empId = data.employeeId || `STF-${1000 + list.length + 1}`;
    const newEmp: Employee = {
      ...data,
      id: newId,
      employeeId: empId,
      leaveBalances: data.leaveBalances || { annual: 15, sick: 10, casual: 5, totalRemaining: 30 },
    };
    const updated = [newEmp, ...list];
    memEmployees = updated;
    setStored(KEY_EMPLOYEES, updated);

    // Auto-create today's attendance record
    const attList = this.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const newAtt: AttendanceRecord = {
      id: `att-${Date.now().toString().slice(-4)}`,
      employeeId: newEmp.id,
      employeeName: newEmp.name,
      department: newEmp.department,
      date: today,
      status: 'Present',
      checkInTime: '09:00 AM',
      notes: 'New hire check-in',
    };
    this.addAttendanceRecord(newAtt);

    return newEmp;
  },

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const list = this.getEmployees();
    const idx = list.findIndex((e) => e.id === id || e.employeeId === id);
    if (idx === -1) return null;
    const updatedEmp = { ...list[idx], ...updates };
    list[idx] = updatedEmp;
    memEmployees = [...list];
    setStored(KEY_EMPLOYEES, memEmployees);
    return updatedEmp;
  },

  deleteEmployee(id: string): boolean {
    const list = this.getEmployees();
    const filtered = list.filter((e) => e.id !== id && e.employeeId !== id);
    if (filtered.length === list.length) return false;
    memEmployees = filtered;
    setStored(KEY_EMPLOYEES, filtered);
    return true;
  },

  // Leaves
  getLeaveRequests(): LeaveRequest[] {
    return getStored<LeaveRequest[]>(KEY_LEAVES, memLeaves);
  },

  applyLeave(request: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>): LeaveRequest {
    const list = this.getLeaveRequests();
    const newRequest: LeaveRequest = {
      ...request,
      id: `lv-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      submittedAt: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    const updated = [newRequest, ...list];
    memLeaves = updated;
    setStored(KEY_LEAVES, updated);

    // Add notification
    this.addNotification({
      title: 'New Leave Request Received',
      message: `${request.employeeName} submitted a request for ${request.days} day(s) of ${request.leaveType} Leave.`,
      type: 'leave',
      link: '/hr/leaves',
    });

    return newRequest;
  },

  reviewLeave(
    id: string,
    status: LeaveStatus,
    reviewerName: string,
    rejectionReason?: string
  ): LeaveRequest | null {
    const list = this.getLeaveRequests();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const current = list[idx];
    const updatedReq: LeaveRequest = {
      ...current,
      status,
      reviewedBy: reviewerName,
      reviewedAt: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      rejectionReason: status === 'Rejected' ? rejectionReason : undefined,
    };

    list[idx] = updatedReq;
    memLeaves = [...list];
    setStored(KEY_LEAVES, memLeaves);

    // Deduct leave balance if approved
    if (status === 'Approved') {
      const empList = this.getEmployees();
      const empIdx = empList.findIndex((e) => e.id === current.employeeId);
      if (empIdx !== -1) {
        const emp = empList[empIdx];
        const balances = { ...emp.leaveBalances };
        if (current.leaveType === 'Annual') balances.annual = Math.max(0, balances.annual - current.days);
        if (current.leaveType === 'Sick') balances.sick = Math.max(0, balances.sick - current.days);
        if (current.leaveType === 'Casual') balances.casual = Math.max(0, balances.casual - current.days);
        balances.totalRemaining = balances.annual + balances.sick + balances.casual;
        empList[empIdx] = { ...emp, leaveBalances: balances };
        memEmployees = [...empList];
        setStored(KEY_EMPLOYEES, memEmployees);
      }
    }

    // Add notification
    this.addNotification({
      title: `Leave Request ${status}`,
      message: `Request for ${current.employeeName} (${current.days} days) has been ${status.toLowerCase()} by ${reviewerName}.`,
      type: 'leave',
      link: '/employee/leaves',
    });

    return updatedReq;
  },

  // Attendance
  getAttendance(dateFilter?: string): AttendanceRecord[] {
    const list = getStored<AttendanceRecord[]>(KEY_ATTENDANCE, memAttendance);
    if (dateFilter) {
      return list.filter((a) => a.date === dateFilter);
    }
    return list;
  },

  addAttendanceRecord(record: AttendanceRecord): void {
    const list = this.getAttendance();
    const updated = [record, ...list];
    memAttendance = updated;
    setStored(KEY_ATTENDANCE, updated);
  },

  clockIn(employeeId: string, employeeName: string, department: string): AttendanceRecord {
    const today = new Date().toISOString().split('T')[0];
    const list = this.getAttendance();
    const existingIdx = list.findIndex((a) => a.employeeId === employeeId && a.date === today);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);

    if (existingIdx !== -1) {
      const updated = {
        ...list[existingIdx],
        checkInTime: timeStr,
        status: (isLate ? 'Late' : 'Present') as AttendanceStatus,
      };
      list[existingIdx] = updated;
      memAttendance = [...list];
      setStored(KEY_ATTENDANCE, memAttendance);
      return updated;
    }

    const newRec: AttendanceRecord = {
      id: `att-${Date.now().toString().slice(-4)}`,
      employeeId,
      employeeName,
      department,
      date: today,
      checkInTime: timeStr,
      status: isLate ? 'Late' : 'Present',
      notes: isLate ? 'Late arrival recorded' : 'Standard on-time check-in',
    };
    const updated = [newRec, ...list];
    memAttendance = updated;
    setStored(KEY_ATTENDANCE, updated);
    return newRec;
  },

  clockOut(employeeId: string): AttendanceRecord | null {
    const today = new Date().toISOString().split('T')[0];
    const list = this.getAttendance();
    const existingIdx = list.findIndex((a) => a.employeeId === employeeId && a.date === today);
    if (existingIdx === -1) return null;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const current = list[existingIdx];
    const updated: AttendanceRecord = {
      ...current,
      checkOutTime: timeStr,
      totalHours: 8.0,
    };
    list[existingIdx] = updated;
    memAttendance = [...list];
    setStored(KEY_ATTENDANCE, memAttendance);
    return updated;
  },

  updateAttendanceStatus(id: string, status: AttendanceStatus, notes?: string): AttendanceRecord | null {
    const list = this.getAttendance();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], status, notes: notes !== undefined ? notes : list[idx].notes };
    list[idx] = updated;
    memAttendance = [...list];
    setStored(KEY_ATTENDANCE, memAttendance);
    return updated;
  },

  // Announcements
  getAnnouncements(): Announcement[] {
    return getStored<Announcement[]>(KEY_ANNOUNCEMENTS, memAnnouncements);
  },

  createAnnouncement(data: Omit<Announcement, 'id' | 'publishedAt'>): Announcement {
    const list = this.getAnnouncements();
    const newAnc: Announcement = {
      ...data,
      id: `anc-${Date.now().toString().slice(-4)}`,
      publishedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newAnc, ...list];
    memAnnouncements = updated;
    setStored(KEY_ANNOUNCEMENTS, updated);

    this.addNotification({
      title: 'Company Announcement',
      message: newAnc.title,
      type: 'announcement',
      link: '/employee/announcements',
    });

    return newAnc;
  },

  deleteAnnouncement(id: string): boolean {
    const list = this.getAnnouncements();
    const filtered = list.filter((a) => a.id !== id);
    if (filtered.length === list.length) return false;
    memAnnouncements = filtered;
    setStored(KEY_ANNOUNCEMENTS, filtered);
    return true;
  },

  // Training
  getTrainingPrograms(): TrainingProgram[] {
    return getStored<TrainingProgram[]>(KEY_TRAINING, memTraining);
  },

  createTrainingProgram(data: Omit<TrainingProgram, 'id'>): TrainingProgram {
    const list = this.getTrainingPrograms();
    const newProg: TrainingProgram = {
      ...data,
      id: `tr-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newProg, ...list];
    memTraining = updated;
    setStored(KEY_TRAINING, updated);

    this.addNotification({
      title: 'New Training Curriculum Available',
      message: `${newProg.title} is now open for enrollment.`,
      type: 'training',
      link: '/employee/training',
    });

    return newProg;
  },

  updateTrainingProgress(
    programId: string,
    employeeId: string,
    progressPercent: number
  ): boolean {
    const list = this.getTrainingPrograms();
    const progIdx = list.findIndex((p) => p.id === programId);
    if (progIdx === -1) return false;

    const prog = list[progIdx];
    const assigned = [...prog.assignedEmployees];
    const assignIdx = assigned.findIndex((a) => a.employeeId === employeeId);

    if (assignIdx !== -1) {
      const isCompleted = progressPercent >= 100;
      assigned[assignIdx] = {
        ...assigned[assignIdx],
        progressPercent: Math.min(100, Math.max(0, progressPercent)),
        completed: isCompleted,
        completedAt: isCompleted ? new Date().toISOString().split('T')[0] : undefined,
      };
      prog.assignedEmployees = assigned;
      list[progIdx] = prog;
      memTraining = [...list];
      setStored(KEY_TRAINING, memTraining);
      return true;
    }
    return false;
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return getStored<NotificationItem[]>(KEY_NOTIFICATIONS, memNotifications);
  },

  addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const list = this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      read: false,
    };
    const updated = [newNotif, ...list];
    memNotifications = updated;
    setStored(KEY_NOTIFICATIONS, updated);
    return newNotif;
  },

  markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    memNotifications = updated;
    setStored(KEY_NOTIFICATIONS, updated);
  },

  markAllNotificationsRead(): void {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    memNotifications = updated;
    setStored(KEY_NOTIFICATIONS, updated);
  },

  // Reset demo data to factory defaults
  resetToDefaults(): void {
    if (isBrowser()) {
      localStorage.removeItem(KEY_EMPLOYEES);
      localStorage.removeItem(KEY_LEAVES);
      localStorage.removeItem(KEY_ATTENDANCE);
      localStorage.removeItem(KEY_ANNOUNCEMENTS);
      localStorage.removeItem(KEY_TRAINING);
      localStorage.removeItem(KEY_NOTIFICATIONS);
      localStorage.removeItem(KEY_CURRENT_USER);
    }
    memEmployees = [...INITIAL_EMPLOYEES];
    memLeaves = [...INITIAL_LEAVE_REQUESTS];
    memAttendance = [...INITIAL_ATTENDANCE];
    memAnnouncements = [...INITIAL_ANNOUNCEMENTS];
    memTraining = [...INITIAL_TRAINING_PROGRAMS];
    memNotifications = [...INITIAL_NOTIFICATIONS];
    memCurrentUser = INITIAL_DEMO_USERS.hr;
    if (isBrowser()) {
      window.dispatchEvent(new CustomEvent('staffsync_storage_update', { detail: { key: 'all' } }));
    }
  },
};
