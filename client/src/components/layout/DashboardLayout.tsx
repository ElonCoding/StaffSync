
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Clock,
  GraduationCap,
  Megaphone,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Menu,
  X,
  UserCheck,
  ShieldCheck,
  User,
  Clock3,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { UserRole, NotificationItem } from '../../lib/types';
import { MockService } from '../../lib/mockService';
import { INITIAL_DEMO_USERS } from '../../lib/mockData';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: UserRole;
  pageTitle?: string;
}

export default function DashboardLayout({
  children,
  activeRole,
  pageTitle = 'Dashboard',
}: DashboardLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(INITIAL_DEMO_USERS[activeRole] || INITIAL_DEMO_USERS.hr);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clockedIn, setClockedIn] = useState(false);
  const [clockMessage, setClockMessage] = useState('');

  // Sync state from MockService and subscribe to storage changes
  useEffect(() => {
    const syncState = () => {
      const user = MockService.getCurrentUser();
      setCurrentUser(user);
      setNotifications(MockService.getNotifications());

      // Check today's attendance for current user
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = MockService.getAttendance(today);
      const userRecord = todayRecords.find((r) => r.employeeId === user.id || r.employeeName === user.name);
      if (userRecord && userRecord.checkInTime && !userRecord.checkOutTime) {
        setClockedIn(true);
      } else {
        setClockedIn(false);
      }
    };

    syncState();

    const handleStorageUpdate = () => {
      syncState();
    };

    window.addEventListener('staffsync_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('staffsync_storage_update', handleStorageUpdate);
  }, [activeRole]);

  // Handle Quick Clock In / Out
  const handleToggleClock = () => {
    if (!clockedIn) {
      MockService.clockIn(currentUser.id, currentUser.name, currentUser.department);
      setClockedIn(true);
      setClockMessage('Checked in at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      MockService.clockOut(currentUser.id);
      setClockedIn(false);
      setClockMessage('Checked out at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    setTimeout(() => setClockMessage(''), 3500);
  };

  // Switch demo user
  const handleSwitchRole = (newRole: UserRole) => {
    MockService.setCurrentUser(newRole);
    setShowRoleDropdown(false);
    if (newRole === 'hr') navigate('/hr/dashboard');
    else if (newRole === 'manager') navigate('/manager/dashboard');
    else navigate('/employee/dashboard');
  };

  // Mark single or all notifications read
  const handleMarkAllRead = () => {
    MockService.markAllNotificationsRead();
    setNotifications(MockService.getNotifications());
  };

  const handleResetData = () => {
    if (confirm('Reset prototype data back to fresh demo defaults?')) {
      MockService.resetToDefaults();
      router.refresh();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  // Navigation Links by Role
  const navConfigs: Record<UserRole, NavItem[]> = {
    hr: [
      { name: 'Dashboard', href: '/hr/dashboard', icon: LayoutDashboard },
      { name: 'Employees', href: '/hr/employees', icon: Users, badge: '10' },
      { name: 'Leave Requests', href: '/hr/leaves', icon: CalendarCheck, badge: '2' },
      { name: 'Daily Attendance', href: '/hr/attendance', icon: Clock },
      { name: 'Announcements', href: '/hr/announcements', icon: Megaphone },
      { name: 'Training & Skills', href: '/hr/training', icon: GraduationCap },
      { name: 'Workforce Reports', href: '/hr/reports', icon: BarChart3 },
      { name: 'Settings', href: '/hr/settings', icon: Settings },
    ],
    manager: [
      { name: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
      { name: 'Team Members', href: '/manager/team', icon: Users, badge: '6' },
      { name: 'Leave Approvals', href: '/manager/leaves', icon: CalendarCheck, badge: '2' },
      { name: 'Team Attendance', href: '/manager/attendance', icon: Clock },
      { name: 'Training Tracks', href: '/manager/training', icon: GraduationCap },
      { name: 'Announcements', href: '/manager/announcements', icon: Megaphone },
      { name: 'Notifications', href: '/manager/notifications', icon: Bell },
      { name: 'Settings', href: '/manager/settings', icon: Settings },
    ],
    employee: [
      { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
      { name: 'My Profile', href: '/employee/profile', icon: User },
      { name: 'Apply & Track Leaves', href: '/employee/leaves', icon: CalendarCheck },
      { name: 'My Attendance', href: '/employee/attendance', icon: Clock },
      { name: 'My Learning', href: '/employee/training', icon: GraduationCap },
      { name: 'Announcements', href: '/employee/announcements', icon: Megaphone },
      { name: 'Notifications', href: '/employee/notifications', icon: Bell },
      { name: 'Settings', href: '/employee/settings', icon: Settings },
    ],
  };

  const currentNav = navConfigs[activeRole] || navConfigs.hr;

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex flex-col antialiased">
      {/* Top Ambient Prototype Bar */}
      <div className="bg-[#102820] text-[#EAE9DF] text-[11px] py-1.5 px-4 flex items-center justify-between border-b border-[#34443A]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C7F36B]" />
          <span className="font-medium">StaffSync Frontend Prototype • Interactive Mock State</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleResetData}
            className="text-[10px] text-[#D8C29A] hover:text-white flex items-center gap-1 transition-colors"
            title="Reset modified mock data to initial demo seed"
          >
            <RefreshCw className="w-3 h-3" /> Reset Demo State
          </button>
          <Link
            to="/"
            className="text-[10px] text-[#7E8980] hover:text-[#EAE9DF] flex items-center gap-1 transition-colors"
          >
            Public Site <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-[#E6EBE5] select-none">
          {/* Brand Header */}
          <div className="p-5 border-b border-[#E6EBE5] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#173D32] flex items-center justify-center text-[#EAE9DF] shadow-sm">
                <svg
                  className="w-4 h-4 text-[#C7F36B]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12a4 4 0 0 1 8 0" />
                  <path d="M12 8v8" />
                </svg>
              </div>
              <div>
                <span className="font-serif-display text-lg font-bold text-[#102820] leading-none block">
                  StaffSync
                </span>
                <span className="text-[10px] text-[#7E8980] font-medium uppercase tracking-wider block mt-0.5">
                  {activeRole === 'hr'
                    ? 'HR Administration'
                    : activeRole === 'manager'
                    ? 'Manager Desk'
                    : 'Employee Portal'}
                </span>
              </div>
            </Link>
          </div>

          {/* Current User Pill */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-[#EAE9DF]/60 border border-[#173D32]/10 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#102820] truncate">{currentUser.name}</p>
              <p className="text-[10px] text-[#7E8980] truncate">{currentUser.designation}</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#173D32] text-[#EAE9DF] shadow-sm'
                      : 'text-[#34443A] hover:bg-[#F7F8F5] hover:text-[#173D32]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#C7F36B]' : 'text-[#7E8980]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isActive
                          ? 'bg-[#C7F36B] text-[#102820]'
                          : 'bg-[#173D32]/10 text-[#173D32]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-[#E6EBE5] space-y-2">
            <button
              type="button"
              onClick={handleToggleClock}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                clockedIn
                  ? 'bg-[#34785B]/15 text-[#34785B] border border-[#34785B]/30 hover:bg-[#34785B]/25'
                  : 'bg-[#173D32] text-[#EAE9DF] hover:bg-[#102820]'
              }`}
            >
              <Clock3 className="w-3.5 h-3.5" />
              <span>{clockedIn ? 'Clocked In (Active)' : 'Quick Clock In'}</span>
            </button>
            {clockMessage && (
              <p className="text-[10px] text-center text-[#34785B] font-medium">{clockMessage}</p>
            )}

            <Link
              to="/login"
              className="w-full py-2 px-3 rounded-xl text-xs font-medium text-[#7E8980] hover:text-[#C24141] hover:bg-[#C24141]/5 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10">
              <div className="p-4 border-b border-[#E6EBE5] flex items-center justify-between">
                <span className="font-serif-display text-xl font-bold text-[#102820]">StaffSync</span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-[#7E8980] hover:text-[#102820]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
                {currentNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-[#173D32] text-[#EAE9DF]'
                          : 'text-[#34443A] hover:bg-[#F7F8F5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-[#173D32]/10 text-[#173D32]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#E6EBE5]">
                <Link
                  to="/login"
                  className="w-full py-2 text-xs font-medium text-[#C24141] flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E6EBE5] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#34443A] hover:bg-[#F7F8F5]"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:block">
                <h1 className="font-serif-display text-xl sm:text-2xl text-[#102820] leading-none">
                  {pageTitle}
                </h1>
                <p className="text-[11px] text-[#7E8980] mt-0.5">
                  SyncWorks Global • {currentUser.department}
                </p>
              </div>
            </div>

            {/* Right Top Header Controls */}
            <div className="flex items-center gap-3">
              {/* Quick Role Switcher Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#173D32]/20 bg-[#F7F8F5] hover:bg-[#EAE9DF] text-xs font-semibold text-[#102820] transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#173D32]" />
                  <span className="hidden sm:inline">Role:</span>
                  <span className="uppercase text-[11px] tracking-wide text-[#173D32]">
                    {activeRole}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7E8980]" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E6EBE5] shadow-xl p-2 z-50 text-xs">
                    <p className="px-2 py-1 text-[10px] font-bold text-[#7E8980] uppercase tracking-wider">
                      Switch Role Context
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('hr')}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                        activeRole === 'hr' ? 'bg-[#173D32] text-white' : 'hover:bg-[#F7F8F5]'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-[#C7F36B]" />
                      <div>
                        <div className="font-semibold">HR Administrator</div>
                        <div className="text-[10px] opacity-75">Sarah Jenkins</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('manager')}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                        activeRole === 'manager' ? 'bg-[#173D32] text-white' : 'hover:bg-[#F7F8F5]'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-[#D8C29A]" />
                      <div>
                        <div className="font-semibold">Team Manager</div>
                        <div className="text-[10px] opacity-75">Marcus Vance</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('employee')}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                        activeRole === 'employee' ? 'bg-[#173D32] text-white' : 'hover:bg-[#F7F8F5]'
                      }`}
                    >
                      <User className="w-4 h-4 text-[#7E8980]" />
                      <div>
                        <div className="font-semibold">Employee Self-Service</div>
                        <div className="text-[10px] opacity-75">Elena Rostova</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl border border-[#E6EBE5] hover:bg-[#F7F8F5] text-[#34443A] relative transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C24141] text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#E6EBE5] shadow-2xl p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E6EBE5] mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#102820]">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 bg-[#173D32] text-[#EAE9DF] rounded text-[10px] font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#173D32] hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-[#7E8980] py-4 text-center">No notifications</p>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            className={`p-2.5 rounded-xl border text-xs transition-colors ${
                              item.read
                                ? 'bg-white border-[#E6EBE5] text-[#7E8980]'
                                : 'bg-[#EAE9DF]/40 border-[#173D32]/15 text-[#102820]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold">{item.title}</p>
                              <span className="text-[10px] text-[#7E8980] whitespace-nowrap">
                                {item.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] mt-0.5 text-[#34443A]">{item.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar */}
              <Link
                to={activeRole === 'employee' ? '/employee/profile' : `/${activeRole}/settings`}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F7F8F5] transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#E6EBE5]"
                />
              </Link>
            </div>
          </header>

          {/* Page Body Viewport */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
