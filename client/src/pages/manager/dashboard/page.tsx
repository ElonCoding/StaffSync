import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Clock,
  GraduationCap,
  Megaphone,
  ArrowUpRight,
  Check,
  X,
  ChevronRight,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ApiClient } from '../../../services/apiClient.js';
import { Employee, LeaveRequest, AttendanceRecord, TrainingProgram, Announcement } from '../../../lib/types';
import LeaveDecisionModal from '../../../components/modals/LeaveDecisionModal';

export default function ManagerDashboardPage() {
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [teamLeaves, setTeamLeaves] = useState<LeaveRequest[]>([]);
  const [teamAttendance, setTeamAttendance] = useState<AttendanceRecord[]>([]);
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [reviewerName, setReviewerName] = useState('Manager');
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [meRes, empRes, leavesRes, attRes, trainRes, ancRes] = await Promise.all([
        ApiClient.getMe().catch(() => null),
        ApiClient.getEmployees().catch(() => ({ employees: [] })),
        ApiClient.getLeaves().catch(() => ({ leaves: [] })),
        ApiClient.getAttendance({ date: today }).catch(() => ({ attendance: [] })),
        ApiClient.getTrainingPrograms().catch(() => ({ programs: [] })),
        ApiClient.getAnnouncements().catch(() => ({ announcements: [] })),
      ]);

      if (meRes?.user?.name) setReviewerName(meRes.user.name);

      const allEmps: Employee[] = empRes?.employees || empRes?.data || [];
      setTeamMembers(allEmps);

      const allLeaves: LeaveRequest[] = leavesRes?.leaves || leavesRes?.data || [];
      setTeamLeaves(allLeaves);

      const allAtt: AttendanceRecord[] = attRes?.attendance || attRes?.data || [];
      setTeamAttendance(allAtt);

      setTrainings(trainRes?.programs || trainRes?.data || []);
      setAnnouncements(ancRes?.announcements || ancRes?.data || []);
    } catch (err) {
      console.error('Manager dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReviewClick = (req: LeaveRequest) => {
    setSelectedRequest(req);
    setIsDecisionModalOpen(true);
  };

  const handleQuickApprove = async (req: LeaveRequest) => {
    try {
      await ApiClient.updateLeaveStatus((req as any)._id || req.id, 'Approved');
      await loadData();
    } catch (err) {
      console.error('Failed to approve leave:', err);
    }
  };

  const pendingCount = teamLeaves.filter((l) => l.status === 'Pending').length;
  const presentCount = teamAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;

  return (
    <DashboardLayout activeRole="manager" pageTitle="Manager Leadership Hub">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#102820]">
            Team Management Desk
          </h2>
          <p className="text-xs sm:text-sm text-[#7E8980] mt-0.5">
            Real-time roster, attendance presence, and time-off approvals
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/manager/leaves"
            className="px-4 py-2.5 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>Review Approvals ({pendingCount})</span>
          </Link>
          <Link
            to="/manager/team"
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E6EBE5] text-[#102820] text-xs font-semibold hover:bg-[#F7F8F5] shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-[#7E8980]" />
            <span>View Team</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7E8980] font-semibold mb-2">
            <span>TEAM MEMBERS</span>
            <Users className="w-4 h-4 text-[#173D32]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">
              {teamMembers.length}
            </span>
            <span className="text-xs text-[#7E8980]">registered</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980]">
            Dynamic database records
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7E8980] font-semibold mb-2">
            <span>TEAM PRESENT TODAY</span>
            <Clock className="w-4 h-4 text-[#34785B]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">
              {presentCount}
            </span>
            <span className="text-xs text-[#7E8980]">
              / {teamMembers.length} ({teamMembers.length > 0 ? Math.round((presentCount / teamMembers.length) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980]">
            Checked-in staff
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7E8980] font-semibold mb-2">
            <span>PENDING LEAVES</span>
            <CalendarCheck className="w-4 h-4 text-[#B7791F]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">
              {pendingCount}
            </span>
            <span className="text-xs text-[#B7791F] font-semibold">
              {pendingCount > 0 ? 'Awaiting sign-off' : 'Queue cleared'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980]">
            Direct review available
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7E8980] font-semibold mb-2">
            <span>TRAINING TRACKS</span>
            <GraduationCap className="w-4 h-4 text-[#173D32]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{trainings.length}</span>
            <span className="text-xs text-[#34785B] font-semibold">Active courses</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980]">
            Database tracked
          </div>
        </div>
      </div>

      {/* Middle Split: Team Approvals & Daily Presence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Pending Approvals Inbox (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-4">
            <div>
              <h3 className="font-serif-display text-lg text-[#102820]">Team Leave Approvals</h3>
              <p className="text-xs text-[#7E8980]">Incoming time-off applications from team members</p>
            </div>
            <Link
              to="/manager/leaves"
              className="text-xs font-semibold text-[#173D32] hover:underline flex items-center gap-1"
            >
              <span>Full Inbox</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {teamLeaves.length === 0 ? (
              <p className="text-xs text-[#7E8980] py-6 text-center">No leave requests currently found.</p>
            ) : (
              teamLeaves.slice(0, 4).map((req) => (
                <div
                  key={(req as any)._id || req.id}
                  className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {req.employeeAvatar ? (
                      <img
                        src={req.employeeAvatar}
                        alt={req.employeeName}
                        className="w-10 h-10 rounded-xl object-cover border border-[#E6EBE5]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[#173D32] text-[#C7F36B] flex items-center justify-center font-bold text-xs shrink-0">
                        {req.employeeName?.slice(0, 2).toUpperCase() || 'EM'}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-xs text-[#102820]">{req.employeeName}</p>
                      <p className="text-[11px] text-[#7E8980]">
                        {req.leaveType} Leave • {req.startDate} to {req.endDate} ({req.days} days)
                      </p>
                      <p className="text-[10px] text-[#34443A] italic mt-0.5 line-clamp-1">
                        &ldquo;{req.reason}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {req.status === 'Pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleQuickApprove(req)}
                          className="px-2.5 py-1 rounded-lg bg-[#34785B] text-white text-xs font-semibold hover:bg-[#286047] flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewClick(req)}
                          className="px-2.5 py-1 rounded-lg border border-[#C24141]/30 text-[#C24141] hover:bg-[#C24141]/10 text-xs font-semibold"
                        >
                          Review
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase ${
                          req.status === 'Approved'
                            ? 'bg-[#34785B]/15 text-[#34785B]'
                            : req.status === 'Rejected'
                            ? 'bg-[#C24141]/15 text-[#C24141]'
                            : 'bg-[#B7791F]/15 text-[#B7791F]'
                        }`}
                      >
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Team Attendance Snapshot (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-4">
              <div>
                <h3 className="font-serif-display text-lg text-[#102820]">Today&apos;s Team Presence</h3>
                <p className="text-xs text-[#7E8980]">Real-time shift presence</p>
              </div>
              <Link to="/manager/attendance" className="text-xs text-[#173D32] font-semibold hover:underline">
                All Logs →
              </Link>
            </div>

            <div className="space-y-2.5">
              {teamAttendance.length === 0 ? (
                <p className="text-xs text-[#7E8980] py-4 text-center">No attendance logged today.</p>
              ) : (
                teamAttendance.slice(0, 5).map((att) => (
                  <div
                    key={(att as any)._id || att.id}
                    className="p-2.5 rounded-xl bg-[#F7F8F5] border border-[#E6EBE5] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#102820]">{att.employeeName}</p>
                      <p className="text-[10px] text-[#7E8980]">Check in: {att.checkInTime || '—'}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        att.status === 'Present'
                          ? 'bg-[#34785B]/15 text-[#34785B]'
                          : att.status === 'Late'
                          ? 'bg-[#B7791F]/15 text-[#B7791F]'
                          : 'bg-[#173D32]/10 text-[#173D32]'
                      }`}
                    >
                      {att.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980] flex justify-between">
            <span>Standup schedule: Daily 10:00 AM</span>
            <span className="text-[#34785B] font-semibold">Live</span>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      <LeaveDecisionModal
        isOpen={isDecisionModalOpen}
        request={selectedRequest}
        onClose={() => {
          setIsDecisionModalOpen(false);
          setSelectedRequest(null);
        }}
        onDecision={() => loadData()}
        reviewerName={reviewerName}
      />
    </DashboardLayout>
  );
}
