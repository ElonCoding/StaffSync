
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Clock,
  GraduationCap,
  Megaphone,
  BarChart3,
  UserPlus,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock3,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { Employee, LeaveRequest, AttendanceRecord, Announcement, TrainingProgram } from '../../../lib/types';
import AddEmployeeModal from '../../../components/modals/AddEmployeeModal';
import CreateAnnouncementModal from '../../../components/modals/CreateAnnouncementModal';

export default function HrDashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);

  const loadData = () => {
    setEmployees(MockService.getEmployees());
    setLeaves(MockService.getLeaveRequests());
    const today = new Date().toISOString().split('T')[0];
    setAttendance(MockService.getAttendance(today));
    setAnnouncements(MockService.getAnnouncements());
    setTrainings(MockService.getTrainingPrograms());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staffsync_storage_update', loadData);
    return () => window.removeEventListener('staffsync_storage_update', loadData);
  }, []);

  const totalEmployees = employees.length;
  const presentCount = attendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const onLeaveCount = attendance.filter((a) => a.status === 'On Leave').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
  const activeTrainings = trainings.filter((t) => t.status === 'Active').length;

  // Department counts
  const departmentCounts: Record<string, number> = {};
  employees.forEach((emp) => {
    departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
  });

  return (
    <DashboardLayout activeRole="hr" pageTitle="HR Executive Dashboard">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#102820]">
            Workforce Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#7E8980] mt-0.5">
            Operational telemetry and team governance for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddEmployeeOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>Add Employee</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateAnnouncementOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E6EBE5] text-[#173D32] text-xs font-semibold hover:bg-[#F7F8F5] shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Megaphone className="w-3.5 h-3.5 text-[#7E8980]" />
            <span>Post Bulletin</span>
          </button>
          <Link
            to="/hr/reports"
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E6EBE5] text-[#34443A] text-xs font-semibold hover:bg-[#F7F8F5] shadow-xs flex items-center gap-1.5 transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#7E8980]" />
            <span>Reports</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1: Total Employees */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#7E8980] font-semibold mb-2">
            <span>TOTAL EMPLOYEES</span>
            <div className="w-8 h-8 rounded-lg bg-[#173D32]/5 text-[#173D32] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{totalEmployees}</span>
            <span className="text-xs text-[#34785B] font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2 this month
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980] flex justify-between">
            <span>Active across 5 units</span>
            <Link to="/hr/employees" className="text-[#173D32] font-semibold hover:underline">
              Directory →
            </Link>
          </div>
        </div>

        {/* Metric 2: Present Today */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#7E8980] font-semibold mb-2">
            <span>PRESENT TODAY</span>
            <div className="w-8 h-8 rounded-lg bg-[#34785B]/10 text-[#34785B] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{presentCount}</span>
            <span className="text-xs text-[#7E8980]">
              / {totalEmployees} ({totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980] flex justify-between">
            <span>{onLeaveCount} on approved leave</span>
            <Link to="/hr/attendance" className="text-[#173D32] font-semibold hover:underline">
              Roster →
            </Link>
          </div>
        </div>

        {/* Metric 3: Pending Leaves */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#7E8980] font-semibold mb-2">
            <span>PENDING LEAVES</span>
            <div className="w-8 h-8 rounded-lg bg-[#B7791F]/10 text-[#B7791F] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{pendingLeaves}</span>
            <span className="text-xs text-[#B7791F] font-semibold">
              {pendingLeaves > 0 ? 'Requires attention' : 'All cleared'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980] flex justify-between">
            <span>Avg turnaround: 4h</span>
            <Link to="/hr/leaves" className="text-[#173D32] font-semibold hover:underline">
              Review queue →
            </Link>
          </div>
        </div>

        {/* Metric 4: Active Curricula */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#7E8980] font-semibold mb-2">
            <span>ACTIVE TRAINING</span>
            <div className="w-8 h-8 rounded-lg bg-[#173D32]/5 text-[#173D32] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{activeTrainings}</span>
            <span className="text-xs text-[#7E8980]">Curricula open</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980] flex justify-between">
            <span>Avg progress: 68%</span>
            <Link to="/hr/training" className="text-[#173D32] font-semibold hover:underline">
              Curricula →
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Grid: Pending Approvals & Department Headcount */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column: Priority Leave Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-4">
            <div>
              <h3 className="font-serif-display text-lg text-[#102820]">Leave Approvals Queue</h3>
              <p className="text-xs text-[#7E8980]">Review submitted requests awaiting HR or manager sign-off</p>
            </div>
            <Link
              to="/hr/leaves"
              className="text-xs font-semibold text-[#173D32] hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {leaves.slice(0, 4).map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={req.employeeAvatar}
                    alt={req.employeeName}
                    className="w-10 h-10 rounded-xl object-cover border border-[#E6EBE5] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#102820] truncate">{req.employeeName}</p>
                    <p className="text-[11px] text-[#7E8980]">
                      {req.department} • <span className="font-medium text-[#173D32]">{req.leaveType}</span> ({req.days} days)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                      req.status === 'Approved'
                        ? 'bg-[#34785B]/15 text-[#34785B]'
                        : req.status === 'Rejected'
                        ? 'bg-[#C24141]/15 text-[#C24141]'
                        : 'bg-[#B7791F]/15 text-[#B7791F]'
                    }`}
                  >
                    {req.status}
                  </span>

                  <Link
                    to="/hr/leaves"
                    className="p-1.5 rounded-lg border border-[#E6EBE5] bg-white hover:bg-[#EAE9DF] text-[#173D32] transition-colors"
                    title="Open Review Desk"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Department Distribution Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-[#E6EBE5] mb-4">
              <h3 className="font-serif-display text-lg text-[#102820]">Department Headcount</h3>
              <p className="text-xs text-[#7E8980]">Current workforce distribution across business units</p>
            </div>

            <div className="space-y-3.5">
              {Object.entries(departmentCounts).map(([dept, count]) => {
                const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
                return (
                  <div key={dept}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-[#102820]">{dept}</span>
                      <span className="text-[#7E8980]">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#F7F8F5] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#173D32] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E6EBE5] flex items-center justify-between text-xs">
            <span className="text-[#7E8980]">Total Organization: {totalEmployees}</span>
            <Link to="/hr/employees" className="text-[#173D32] font-semibold hover:underline">
              View All Members →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Company Bulletins */}
      <div className="bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-4">
          <div>
            <h3 className="font-serif-display text-lg text-[#102820]">Active Announcements</h3>
            <p className="text-xs text-[#7E8980]">Company news, town hall recaps, and urgent policy directives</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateAnnouncementOpen(true)}
            className="text-xs font-semibold text-[#173D32] hover:underline"
          >
            + New Bulletin
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcements.slice(0, 3).map((anc) => (
            <div
              key={anc.id}
              className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      anc.priority === 'High'
                        ? 'bg-[#C24141]/15 text-[#C24141]'
                        : anc.priority === 'Medium'
                        ? 'bg-[#B7791F]/15 text-[#B7791F]'
                        : 'bg-[#173D32]/10 text-[#173D32]'
                    }`}
                  >
                    {anc.priority} Priority
                  </span>
                  <span className="text-[10px] text-[#7E8980]">{anc.publishedAt}</span>
                </div>
                <h4 className="text-xs font-bold text-[#102820] mb-1 line-clamp-1">{anc.title}</h4>
                <p className="text-[11px] text-[#34443A] leading-relaxed line-clamp-3 mb-3">
                  {anc.content}
                </p>
              </div>
              <div className="pt-2 border-t border-[#E6EBE5] text-[10px] text-[#7E8980]">
                By {anc.authorName} ({anc.authorRole})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onSuccess={() => loadData()}
      />
      <CreateAnnouncementModal
        isOpen={isCreateAnnouncementOpen}
        onClose={() => setIsCreateAnnouncementOpen(false)}
        onSuccess={() => loadData()}
      />
    </DashboardLayout>
  );
}
