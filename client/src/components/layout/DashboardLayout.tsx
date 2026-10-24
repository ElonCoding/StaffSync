
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
  LogOut,
  Menu,
  X,
  User,
  Clock3,
} from 'lucide-react';
import { UserRole, NotificationItem } from '../../lib/types';
import { ApiClient } from '../../services/apiClient.js';

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockMessage, setClockMessage] = useState('');

  useEffect(() => {
    // Load current user from real auth
    ApiClient.getMe()
      .then((res: any) => {
        const user = res?.user || res;
        setCurrentUser(user);
      })
      .catch(() => {
        // Token invalid — redirect to login
        navigate('/login');
      });

    // Load notifications
    ApiClient.getNotifications()
      .then((res: any) => {
        setNotifications(res?.notifications || res?.data || []);
      })
      .catch(() => setNotifications([]));

    // Check today's attendance
    const today = new Date().toISOString().split('T')[0];
    ApiClient.getAttendance({ date: today })
      .then((res: any) => {
        const records: any[] = res?.attendance || res?.data || [];
        const myRecord = records.find((r: any) => r.checkInTime && !r.checkOutTime);
        setClockedIn(!!myRecord);
      })
      .catch(() => setClockedIn(false));
  }, [activeRole]);

  const handleToggleClock = async () => {
    if (!currentUser) return;
    try {
      if (!clockedIn) {
        await ApiClient.clockIn({
          employeeId: currentUser._id || currentUser.id,
          employeeName: currentUser.name,
          department: currentUser.department,
        });
        setClockedIn(true);
        setClockMessage('Checked in at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        await ApiClient.clockOut({
          employeeId: currentUser._id || currentUser.id,
        });
        setClockedIn(false);
        setClockMessage('Checked out at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Clock toggle failed:', err);
    }
    setTimeout(() => setClockMessage(''), 3500);
  };

  const handleMarkAllRead = async () => {
    try {
      await ApiClient.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const handleSignOut = () => {
    ApiClient.logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const navConfigs: Record<UserRole, NavItem[]> = {
    hr: [
      { name: 'Dashboard', href: '/hr/dashboard', icon: LayoutDashboard },
      { name: 'Employees', href: '/hr/employees', icon: Users },
      { name: 'Leave Requests', href: '/hr/leaves', icon: CalendarCheck },
      { name: 'Daily Attendance', href: '/hr/attendance', icon: Clock },
      { name: 'Announcements', href: '/hr/announcements', icon: Megaphone },
      { name: 'Training & Skills', href: '/hr/training', icon: GraduationCap },
      { name: 'Workforce Reports', href: '/hr/reports', icon: BarChart3 },
      { name: 'Settings', href: '/hr/settings', icon: Settings },
    ],
    manager: [
      { name: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
      { name: 'Team Members', href: '/manager/team', icon: Users },
      { name: 'Leave Approvals', href: '/manager/leaves', icon: CalendarCheck },
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
  const avatarUrl = currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=173D32&color=C7F36B&size=64`;

  const SidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E6EBE5] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/image copy.svg"
            alt="StaffSync Logo"
            className="w-8 h-8 rounded-lg object-contain shadow-xs shrink-0"
          />
          <div>
            <span className="font-serif-display text-lg font-bold text-[#102820] leading-none block">StaffSync</span>
            <span className="text-[10px] text-[#7E8980] font-medium uppercase tracking-wider block mt-0.5">
              {activeRole === 'hr' ? 'HR Administration' : activeRole === 'manager' ? 'Manager Desk' : 'Employee Portal'}
            </span>
          </div>
        </Link>
      </div>

      {/* Current User Pill */}
      {currentUser && (
        <div className="p-4 mx-3 my-3 rounded-2xl bg-[#EAE9DF]/60 border border-[#173D32]/10 flex items-center gap-3">
          <img src={avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#102820] truncate">{currentUser.name}</p>
            <p className="text-[10px] text-[#7E8980] truncate">{currentUser.designation || currentUser.role}</p>
          </div>
        </div>
      )}

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
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C7F36B]' : 'text-[#7E8980]'}`} />
                <span>{item.name}</span>
              </div>
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

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-2 px-3 rounded-xl text-xs font-medium text-[#7E8980] hover:text-[#C24141] hover:bg-[#C24141]/5 flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
        <p className="text-[10px] text-center text-[#7E8980]/70 pt-1 font-medium select-none">
          StaffSync • Parikshit Sharma
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex flex-col antialiased">
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-[#E6EBE5] select-none">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10">
              <div className="p-4 border-b border-[#E6EBE5] flex items-center justify-between">
                <span className="font-serif-display text-xl font-bold text-[#102820]">StaffSync</span>
                <button type="button" onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-[#7E8980] hover:text-[#102820]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
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
                <h1 className="font-serif-display text-xl sm:text-2xl text-[#102820] leading-none">{pageTitle}</h1>
                <p className="text-[11px] text-[#7E8980] mt-0.5">
                  StaffSync • {currentUser?.department || activeRole}
                </p>
              </div>
            </div>

            {/* Right Top Header Controls */}
            <div className="flex items-center gap-3">
              {/* Active Role Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#173D32]/20 bg-[#F7F8F5] text-xs font-semibold text-[#102820]">
                <span className="w-2 h-2 rounded-full bg-[#173D32]" />
                <span className="hidden sm:inline text-[#7E8980]">Role:</span>
                <span className="uppercase text-[11px] tracking-wide text-[#173D32] font-bold">
                  {currentUser?.role || activeRole}
                </span>
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
                          <span className="px-1.5 py-0.5 bg-[#173D32] text-[#EAE9DF] rounded text-[10px] font-bold">
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
                              <span className="text-[10px] text-[#7E8980] whitespace-nowrap">{item.timestamp}</span>
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
                <img src={avatarUrl} alt={currentUser?.name || 'User'} className="w-8 h-8 rounded-lg object-cover border border-[#E6EBE5]" />
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
