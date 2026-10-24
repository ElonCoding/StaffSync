import {
  INITIAL_DEMO_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ATTENDANCE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRAINING_PROGRAMS,
  INITIAL_NOTIFICATIONS,
} from '../mocks/mockData.js';

// Local storage keys
const KEY_EMPLOYEES = 'staffsync_employees_v1';
const KEY_LEAVES = 'staffsync_leaves_v1';
const KEY_ATTENDANCE = 'staffsync_attendance_v1';
const KEY_ANNOUNCEMENTS = 'staffsync_announcements_v1';
const KEY_TRAINING = 'staffsync_training_v1';
const KEY_NOTIFICATIONS = 'staffsync_notifications_v1';
const KEY_CURRENT_USER = 'staffsync_current_user_v1';

// In-memory fallback
let memEmployees = [...INITIAL_EMPLOYEES];
let memLeaves = [...INITIAL_LEAVE_REQUESTS];
let memAttendance = [...INITIAL_ATTENDANCE];
let memAnnouncements = [...INITIAL_ANNOUNCEMENTS];
let memTraining = [...INITIAL_TRAINING_PROGRAMS];
let memNotifications = [...INITIAL_NOTIFICATIONS];
let memCurrentUser = INITIAL_DEMO_USERS.hr;

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getStored(key, fallback) {
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

function setStored(key, value) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('staffsync_storage_update', { detail: { key } }));
  } catch (err) {
    console.warn(`Error writing localStorage for ${key}`, err);
  }
}

export const MockService = {
  // Current User / Session
  getCurrentUser() {
    return getStored(KEY_CURRENT_USER, memCurrentUser);
  },

  setCurrentUser(userOrRole) {
    let resolvedUser;
    if (typeof userOrRole === 'string') {
      resolvedUser = INITIAL_DEMO_USERS[userOrRole] || INITIAL_DEMO_USERS.hr;
    } else {
      const u = userOrRole;
      const initials = (u.name || 'User')
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="32" fill="#173D32"/><text x="50%" y="54%" font-family="system-ui, sans-serif" font-weight="700" font-size="46" fill="#C7F36B" dominant-baseline="middle" text-anchor="middle">${initials}</text></svg>`;
      const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

      resolvedUser = {
        id: u.id || u._id || `usr-${Date.now()}`,
        employeeId: u.employeeId || 'STF-' + Math.floor(1000 + Math.random() * 9000),
        name: u.name || 'Staff Member',
        email: u.email || 'user@staffsync.io',
        role: (u.role || 'employee').toLowerCase(),
        avatar: u.avatar || defaultAvatar,
        designation: u.designation || (u.role === 'HR' ? 'Head of People Operations' : u.role === 'Manager' ? 'Team Lead' : 'Staff Engineer'),
        department: u.department || 'Operations',
        phone: u.phone || '+1 (555) 010-2030',
        location: u.location || 'Remote, Global',
      };
    }
    memCurrentUser = resolvedUser;
    setStored(KEY_CURRENT_USER, resolvedUser);
    return resolvedUser;
  },

  // Employees
  getEmployees() {
    return getStored(KEY_EMPLOYEES, memEmployees);
  },

  getEmployeeById(id) {
    const list = this.getEmployees();
    return list.find((e) => e.id === id || e.employeeId === id);
  },

  addEmployee(data) {
    const list = this.getEmployees();
    const newId = `emp-${Date.now().toString().slice(-4)}`;
    const empId = data.employeeId || `STF-${1000 + list.length + 1}`;
    const newEmp = {
      ...data,
      id: newId,
      employeeId: empId,
      leaveBalances: data.leaveBalances || { annual: 15, sick: 10, casual: 5, totalRemaining: 30 },
    };
    const updated = [newEmp, ...list];
    memEmployees = updated;
    setStored(KEY_EMPLOYEES, updated);

    // Auto-create today's attendance record
    const today = new Date().toISOString().split('T')[0];
    const newAtt = {
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

  updateEmployee(id, updates) {
    const list = this.getEmployees();
    const idx = list.findIndex((e) => e.id === id || e.employeeId === id);
    if (idx === -1) return null;
    const updatedEmp = { ...list[idx], ...updates };
    list[idx] = updatedEmp;
    memEmployees = [...list];
    setStored(KEY_EMPLOYEES, memEmployees);
    return updatedEmp;
  },

  deleteEmployee(id) {
    const list = this.getEmployees();
    const filtered = list.filter((e) => e.id !== id && e.employeeId !== id);
    if (filtered.length === list.length) return false;
    memEmployees = filtered;
    setStored(KEY_EMPLOYEES, filtered);
    return true;
  },

  // Leaves
  getLeaveRequests() {
    return getStored(KEY_LEAVES, memLeaves);
  },

  applyLeave(request) {
    const list = this.getLeaveRequests();
    const newRequest = {
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

    this.addNotification({
      title: 'New Leave Request Received',
      message: `${request.employeeName} submitted a request for ${request.days} day(s) of ${request.leaveType} Leave.`,
      type: 'leave',
      link: '/hr/leaves',
    });

    return newRequest;
  },

  reviewLeave(id, status, reviewerName, rejectionReason) {
    const list = this.getLeaveRequests();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const current = list[idx];
    const updatedReq = {
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

    this.addNotification({
      title: `Leave Request ${status}`,
      message: `Request for ${current.employeeName} (${current.days} days) has been ${status.toLowerCase()} by ${reviewerName}.`,
      type: 'leave',
      link: '/employee/leaves',
    });

    return updatedReq;
  },

  // Attendance
  getAttendance(dateFilter) {
    const list = getStored(KEY_ATTENDANCE, memAttendance);
    if (dateFilter) {
      return list.filter((a) => a.date === dateFilter);
    }
    return list;
  },

  addAttendanceRecord(record) {
    const list = this.getAttendance();
    const updated = [record, ...list];
    memAttendance = updated;
    setStored(KEY_ATTENDANCE, updated);
  },

  clockIn(employeeId, employeeName, department) {
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
        status: isLate ? 'Late' : 'Present',
      };
      list[existingIdx] = updated;
      memAttendance = [...list];
      setStored(KEY_ATTENDANCE, memAttendance);
      return updated;
    }

    const newRec = {
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

  clockOut(employeeId) {
    const today = new Date().toISOString().split('T')[0];
    const list = this.getAttendance();
    const existingIdx = list.findIndex((a) => a.employeeId === employeeId && a.date === today);
    if (existingIdx === -1) return null;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const current = list[existingIdx];
    const updated = {
      ...current,
      checkOutTime: timeStr,
      totalHours: 8.0,
    };
    list[existingIdx] = updated;
    memAttendance = [...list];
    setStored(KEY_ATTENDANCE, memAttendance);
    return updated;
  },

  updateAttendanceStatus(id, status, notes) {
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
  getAnnouncements() {
    return getStored(KEY_ANNOUNCEMENTS, memAnnouncements);
  },

  createAnnouncement(data) {
    const list = this.getAnnouncements();
    const newAnc = {
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

  deleteAnnouncement(id) {
    const list = this.getAnnouncements();
    const filtered = list.filter((a) => a.id !== id);
    if (filtered.length === list.length) return false;
    memAnnouncements = filtered;
    setStored(KEY_ANNOUNCEMENTS, filtered);
    return true;
  },

  // Training
  getTrainingPrograms() {
    return getStored(KEY_TRAINING, memTraining);
  },

  createTrainingProgram(data) {
    const list = this.getTrainingPrograms();
    const newProg = {
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

  updateTrainingProgress(programId, employeeId, progressPercent) {
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
  getNotifications() {
    return getStored(KEY_NOTIFICATIONS, memNotifications);
  },

  addNotification(item) {
    const list = this.getNotifications();
    const newNotif = {
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

  markNotificationRead(id) {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    memNotifications = updated;
    setStored(KEY_NOTIFICATIONS, updated);
  },

  markAllNotificationsRead() {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    memNotifications = updated;
    setStored(KEY_NOTIFICATIONS, updated);
  },

  // Reset demo data to factory defaults
  resetToDefaults() {
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
