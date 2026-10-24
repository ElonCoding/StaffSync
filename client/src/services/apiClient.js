// API client for StaffSync — real backend only, no mocks.

const isProduction =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (isProduction
    ? 'https://staffsync-czzq.onrender.com/api'
    : 'http://localhost:5000/api');

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

async function apiFetch(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (!res.ok) {
    const err = new Error('API request failed');
    err.status = res.status;
    try { err.data = await res.json(); } catch (_) {}
    throw err;
  }
  return await res.json();
}

export const ApiClient = {
  // Auth
  async login(credentials) {
    const res = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (res?.token) setAuthToken(res.token);
    return res;
  },

  async register(data) {
    const res = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) });
    if (res?.token) setAuthToken(res.token);
    return res;
  },

  async getMe() {
    return await apiFetch('/auth/me');
  },

  logout() {
    setAuthToken(null);
  },

  // Employees
  async getEmployees(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiFetch(`/employees${query ? '?' + query : ''}`);
  },

  async getEmployee(id) {
    return await apiFetch(`/employees/${id}`);
  },

  async createEmployee(data) {
    return await apiFetch('/employees', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateEmployee(id, data) {
    return await apiFetch(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteEmployee(id) {
    return await apiFetch(`/employees/${id}`, { method: 'DELETE' });
  },

  // Leaves
  async getLeaves(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiFetch(`/leaves${query ? '?' + query : ''}`);
  },

  async applyLeave(data) {
    return await apiFetch('/leaves', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateLeaveStatus(id, status, notes = '') {
    return await apiFetch(`/leaves/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, reviewerNotes: notes }) });
  },

  async deleteLeave(id) {
    return await apiFetch(`/leaves/${id}`, { method: 'DELETE' });
  },

  // Attendance
  async getAttendance(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiFetch(`/attendance${query ? '?' + query : ''}`);
  },

  async clockIn(data) {
    return await apiFetch('/attendance/clock-in', { method: 'POST', body: JSON.stringify(data) });
  },

  async clockOut(data) {
    return await apiFetch('/attendance/clock-out', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateAttendanceStatus(id, status, notes = '') {
    return await apiFetch(`/attendance/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, notes }) });
  },

  // Announcements
  async getAnnouncements() {
    return await apiFetch('/announcements');
  },

  async createAnnouncement(data) {
    return await apiFetch('/announcements', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateAnnouncement(id, data) {
    return await apiFetch(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteAnnouncement(id) {
    return await apiFetch(`/announcements/${id}`, { method: 'DELETE' });
  },

  // Training
  async getTrainingPrograms() {
    return await apiFetch('/training');
  },

  async createTrainingProgram(data) {
    return await apiFetch('/training', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateTrainingProgram(id, data) {
    return await apiFetch(`/training/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteTrainingProgram(id) {
    return await apiFetch(`/training/${id}`, { method: 'DELETE' });
  },

  async updateTrainingProgress(programId, employeeId, progressPercent) {
    return await apiFetch(`/training/${programId}/progress`, { method: 'PUT', body: JSON.stringify({ employeeId, progressPercent }) });
  },

  // Notifications
  async getNotifications() {
    return await apiFetch('/notifications');
  },

  async markNotificationRead(id) {
    return await apiFetch(`/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead() {
    return await apiFetch('/notifications/read-all', { method: 'PUT' });
  },
};
