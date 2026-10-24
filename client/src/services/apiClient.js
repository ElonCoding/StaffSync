import { MockService } from './mockService.js';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:5000/api';

const TOKEN_KEY = 'staffsync_auth_token_v1';

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function fetchWithFallback(url, options = {}, mockFallbackFn) {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
    // If backend returns 401/404/500, fallback to mock if provided
    return mockFallbackFn ? await mockFallbackFn() : await res.json();
  } catch (err) {
    // Backend offline or network timeout, gracefully return mock
    if (mockFallbackFn) {
      return await mockFallbackFn();
    }
    throw err;
  }
}

export const ApiClient = {
  // Auth
  async login(credentials) {
    return fetchWithFallback(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(credentials) },
      async () => {
        const role = credentials.role || (credentials.email?.includes('mgr') ? 'manager' : credentials.email?.includes('emp') ? 'employee' : 'hr');
        const user = MockService.setCurrentUser(role);
        setAuthToken('mock-jwt-token-' + role);
        return { success: true, token: 'mock-jwt-token-' + role, user };
      }
    );
  },

  async register(data) {
    return fetchWithFallback(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(data) },
      async () => {
        const role = (data.role || 'employee').toLowerCase();
        const user = MockService.setCurrentUser(role);
        setAuthToken('mock-jwt-token-' + role);
        return { success: true, token: 'mock-jwt-token-' + role, user };
      }
    );
  },

  async getMe() {
    return fetchWithFallback('/auth/me', {}, async () => {
      const user = MockService.getCurrentUser();
      return { success: true, user };
    });
  },

  logout() {
    setAuthToken(null);
  },

  // Employees
  async getEmployees(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithFallback(`/employees${query ? '?' + query : ''}`, {}, async () => {
      let employees = MockService.getEmployees();
      if (params.department) {
        employees = employees.filter((e) => e.department.toLowerCase() === params.department.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        employees = employees.filter((e) => e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q));
      }
      return { success: true, employees };
    });
  },

  async getEmployee(id) {
    return fetchWithFallback(`/employees/${id}`, {}, async () => {
      const employee = MockService.getEmployeeById(id);
      return { success: !!employee, employee };
    });
  },

  async createEmployee(data) {
    return fetchWithFallback(
      '/employees',
      { method: 'POST', body: JSON.stringify(data) },
      async () => {
        const employee = MockService.addEmployee(data);
        return { success: true, employee };
      }
    );
  },

  async updateEmployee(id, data) {
    return fetchWithFallback(
      `/employees/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
      async () => {
        const employee = MockService.updateEmployee(id, data);
        return { success: true, employee };
      }
    );
  },

  async deleteEmployee(id) {
    return fetchWithFallback(`/employees/${id}`, { method: 'DELETE' }, async () => {
      const ok = MockService.deleteEmployee(id);
      return { success: ok };
    });
  },

  // Leaves
  async getLeaves(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithFallback(`/leaves${query ? '?' + query : ''}`, {}, async () => {
      let leaves = MockService.getLeaveRequests();
      if (params.status) {
        leaves = leaves.filter((l) => l.status.toLowerCase() === params.status.toLowerCase());
      }
      if (params.employeeId) {
        leaves = leaves.filter((l) => l.employeeId === params.employeeId);
      }
      return { success: true, leaves };
    });
  },

  async applyLeave(data) {
    return fetchWithFallback(
      '/leaves',
      { method: 'POST', body: JSON.stringify(data) },
      async () => {
        const leave = MockService.applyLeave(data);
        return { success: true, leave };
      }
    );
  },

  async updateLeaveStatus(id, status, notes = '') {
    return fetchWithFallback(
      `/leaves/${id}/status`,
      { method: 'PUT', body: JSON.stringify({ status, reviewerNotes: notes }) },
      async () => {
        const currentUser = MockService.getCurrentUser();
        const leave = MockService.reviewLeave(id, status, currentUser.name, notes);
        return { success: true, leave };
      }
    );
  },

  // Attendance
  async getAttendance(date) {
    const query = date ? `?date=${date}` : '';
    return fetchWithFallback(`/attendance${query}`, {}, async () => {
      const attendance = MockService.getAttendance(date);
      return { success: true, attendance };
    });
  },

  async clockIn(data) {
    return fetchWithFallback(
      '/attendance/clock-in',
      { method: 'POST', body: JSON.stringify(data) },
      async () => {
        const record = MockService.clockIn(data.employeeId, data.employeeName, data.department);
        return { success: true, record };
      }
    );
  },

  async clockOut(data) {
    return fetchWithFallback(
      '/attendance/clock-out',
      { method: 'POST', body: JSON.stringify(data) },
      async () => {
        const record = MockService.clockOut(data.employeeId);
        return { success: true, record };
      }
    );
  },

  // Announcements
  async getAnnouncements() {
    return fetchWithFallback('/announcements', {}, async () => {
      const announcements = MockService.getAnnouncements();
      return { success: true, announcements };
    });
  },

  async createAnnouncement(data) {
    return fetchWithFallback(
      '/announcements',
      { method: 'POST', body: JSON.stringify(data) },
      async () => {
        const announcement = MockService.createAnnouncement(data);
        return { success: true, announcement };
      }
    );
  },

  async deleteAnnouncement(id) {
    return fetchWithFallback(`/announcements/${id}`, { method: 'DELETE' }, async () => {
      const ok = MockService.deleteAnnouncement(id);
      return { success: ok };
    });
  },

  // Training
  async getTrainingPrograms() {
    return fetchWithFallback('/training', {}, async () => {
      const programs = MockService.getTrainingPrograms();
      return { success: true, programs };
    });
  },

  async createTrainingProgram(data) {
    return fetchWithFallback(
      '/training',
      { method: 'POST', body: JSON.stringify(data) },
      async () => {
        const program = MockService.createTrainingProgram(data);
        return { success: true, program };
      }
    );
  },

  async updateTrainingProgress(programId, employeeId, progressPercent) {
    return fetchWithFallback(
      `/training/${programId}/progress`,
      { method: 'PUT', body: JSON.stringify({ employeeId, progressPercent }) },
      async () => {
        const ok = MockService.updateTrainingProgress(programId, employeeId, progressPercent);
        return { success: ok };
      }
    );
  },

  // Notifications
  async getNotifications() {
    return fetchWithFallback('/notifications', {}, async () => {
      const notifications = MockService.getNotifications();
      return { success: true, notifications };
    });
  },

  async markNotificationRead(id) {
    return fetchWithFallback(`/notifications/${id}/read`, { method: 'PUT' }, async () => {
      MockService.markNotificationRead(id);
      return { success: true };
    });
  },

  async markAllNotificationsRead() {
    return fetchWithFallback('/notifications/read-all', { method: 'PUT' }, async () => {
      MockService.markAllNotificationsRead();
      return { success: true };
    });
  },
};
