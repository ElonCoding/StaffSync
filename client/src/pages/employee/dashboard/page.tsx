
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock3,
  CalendarPlus,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ApiClient } from '../../../services/apiClient.js';
import { Employee, LeaveRequest, TrainingProgram, Announcement } from '../../../lib/types';
import ApplyLeaveModal from '../../../components/modals/ApplyLeaveModal';

export default function EmployeeDashboardPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
  const [myTrainings, setMyTrainings] = useState<TrainingProgram[]>([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [clockMsg, setClockMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Current user from token
      const meRes = await ApiClient.getMe();
      const user = meRes?.user || meRes;
      setEmployee(user);

      // My leaves
      const leavesRes = await ApiClient.getLeaves({ employeeId: user._id || user.id });
      setMyLeaves(leavesRes?.leaves || leavesRes?.data || []);

      // My trainings
      const trainRes = await ApiClient.getTrainingPrograms();
      const allPrograms: TrainingProgram[] = trainRes?.programs || trainRes?.data || [];
      const userId = user._id || user.id;
      const enrolled = allPrograms.filter((t: any) =>
        t.assignedEmployees?.some((a: any) => a.employeeId === userId || a.employeeId === user.employeeId)
      );
      setMyTrainings(enrolled);

      // Today's attendance
      const today = new Date().toISOString().split('T')[0];
      const attRes = await ApiClient.getAttendance({ date: today });
      const records: any[] = attRes?.attendance || attRes?.data || [];
      const myRecord = records.find((r: any) =>
        (r.employeeId === userId || r.employeeId === user.employeeId) && r.checkInTime && !r.checkOutTime
      );
      setIsClockedIn(!!myRecord);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleClock = async () => {
    if (!employee) return;
    const empId = (employee as any)._id || (employee as any).id;
    try {
      if (!isClockedIn) {
        await ApiClient.clockIn({ employeeId: empId, employeeName: employee.name, department: employee.department });
        setIsClockedIn(true);
        setClockMsg('Checked in for today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        await ApiClient.clockOut({ employeeId: empId });
        setIsClockedIn(false);
        setClockMsg('Checked out at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Clock error:', err);
    }
    setTimeout(() => setClockMsg(''), 3500);
  };

  const balances = (employee as any)?.leaveBalances || { annual: 0, sick: 0, casual: 0, totalRemaining: 0 };

  if (loading) {
    return (
      <DashboardLayout activeRole="employee" pageTitle="Employee Portal">
        <div className="flex items-center justify-center h-64 text-[#7E8980] text-sm">Loading your dashboard…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeRole="employee" pageTitle="Employee Portal">
      {/* Top Welcome Card */}
      <div className="bg-[#173D32] rounded-3xl p-6 sm:p-8 text-[#EAE9DF] mb-8 relative overflow-hidden shadow-xl border border-[#34785B]/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C7F36B] block mb-1">
              Welcome Back
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-white">
              {employee?.name || 'Employee'}
            </h2>
            <p className="text-xs sm:text-sm text-[#D7D8CE] mt-1 max-w-xl">
              {(employee as any)?.designation || (employee as any)?.role} • {employee?.department}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleToggleClock}
              className={`px-5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all ${
                isClockedIn
                  ? 'bg-[#34785B] text-white hover:bg-[#286047]'
                  : 'bg-[#C7F36B] text-[#102820] hover:bg-white'
              }`}
            >
              <Clock3 className="w-4 h-4" />
              <span>{isClockedIn ? 'Clocked In (Active)' : 'Clock In for Today'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsApplyLeaveOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-2 transition-all"
            >
              <CalendarPlus className="w-4 h-4 text-[#D8C29A]" />
              <span>Apply for Leave</span>
            </button>
          </div>
        </div>

        {clockMsg && (
          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#C7F36B] font-medium">
            {clockMsg}
          </div>
        )}
      </div>

      {/* Leave Balances Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase tracking-wider block">Annual Leave</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{balances.annual}</span>
            <span className="text-xs text-[#7E8980]">days available</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase tracking-wider block">Sick / Medical</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{balances.sick}</span>
            <span className="text-xs text-[#7E8980]">days available</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase tracking-wider block">Casual Days</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{balances.casual}</span>
            <span className="text-xs text-[#7E8980]">days available</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase tracking-wider block">Total Leave Bank</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif-display text-3xl font-bold text-[#173D32]">{balances.totalRemaining}</span>
            <span className="text-xs text-[#34785B] font-semibold">Ready to apply</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Leave Status & Active Training */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column: My Leave Applications */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-4">
              <div>
                <h3 className="font-serif-display text-lg text-[#102820]">My Time-Off Requests</h3>
                <p className="text-xs text-[#7E8980]">Status of your submitted leave applications</p>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyLeaveOpen(true)}
                className="text-xs font-semibold text-[#173D32] hover:underline"
              >
                + New Request
              </button>
            </div>

            <div className="space-y-3">
              {myLeaves.length === 0 ? (
                <p className="text-xs text-[#7E8980] py-6 text-center">No leave requests submitted yet.</p>
              ) : (
                myLeaves.map((req: any) => (
                  <div
                    key={req._id || req.id}
                    className="p-3.5 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#102820]">{req.leaveType} Leave</span>
                        <span className="text-[#7E8980]">({req.days} days)</span>
                      </div>
                      <p className="text-[11px] text-[#7E8980] mt-0.5">{req.startDate} to {req.endDate}</p>
                      <p className="text-[10px] text-[#34443A] italic mt-1 line-clamp-1">&ldquo;{req.reason}&rdquo;</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          req.status === 'Approved'
                            ? 'bg-[#34785B]/15 text-[#34785B]'
                            : req.status === 'Rejected'
                            ? 'bg-[#C24141]/15 text-[#C24141]'
                            : 'bg-[#B7791F]/15 text-[#B7791F]'
                        }`}
                      >
                        {req.status}
                      </span>
                      {req.reviewedBy && (
                        <p className="text-[10px] text-[#7E8980] mt-1">by {req.reviewedBy}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E6EBE5] text-xs">
            <Link to="/employee/leaves" className="text-[#173D32] font-semibold hover:underline">
              View Detailed Leave History →
            </Link>
          </div>
        </div>

        {/* Right Column: Training Tracks Enrolled */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-[#E6EBE5] mb-4">
              <h3 className="font-serif-display text-lg text-[#102820]">My Learning Curricula</h3>
              <p className="text-xs text-[#7E8980]">Assigned skill development courses</p>
            </div>

            <div className="space-y-4">
              {myTrainings.length === 0 ? (
                <p className="text-xs text-[#7E8980] py-6 text-center">No training programs assigned yet.</p>
              ) : (
                myTrainings.map((prog: any) => {
                  const userId = (employee as any)?._id || (employee as any)?.id;
                  const myAssign = prog.assignedEmployees?.find(
                    (a: any) => a.employeeId === userId || a.employeeId === (employee as any)?.employeeId
                  );
                  const progress = myAssign ? myAssign.progressPercent : 0;

                  return (
                    <div key={prog._id || prog.id} className="p-3.5 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5]">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-xs text-[#102820] line-clamp-1">{prog.title}</h4>
                        <span className="font-mono text-xs font-bold text-[#173D32] shrink-0">{progress}%</span>
                      </div>
                      <p className="text-[11px] text-[#7E8980] mb-3">{prog.instructor}</p>

                      <div className="w-full bg-white rounded-full h-1.5 overflow-hidden border border-[#E6EBE5]">
                        <div
                          className="bg-[#173D32] h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E6EBE5] text-xs">
            <Link to="/employee/training" className="text-[#173D32] font-semibold hover:underline">
              Open Learning Studio →
            </Link>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        onSuccess={() => {
          setIsApplyLeaveOpen(false);
          loadData();
        }}
        employeeId={(employee as any)?._id || (employee as any)?.id || (employee as any)?.employeeId}
        employeeName={employee?.name}
        employeeDepartment={employee?.department}
      />
    </DashboardLayout>
  );
}
