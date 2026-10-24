
import React, { useState, useEffect } from 'react';
import {
  CalendarPlus,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ApiClient } from '../../../services/apiClient.js';
import { LeaveRequest } from '../../../lib/types';
import ApplyLeaveModal from '../../../components/modals/ApplyLeaveModal';

export default function EmployeeLeavesPage() {
  const [employee, setEmployee] = useState<any>(null);
  const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const meRes = await ApiClient.getMe();
      const user = meRes?.user || meRes;
      setEmployee(user);

      const userId = user._id || user.id;
      const leavesRes = await ApiClient.getLeaves({ employeeId: userId });
      setMyLeaves(leavesRes?.leaves || leavesRes?.data || []);
    } catch (err) {
      console.error('Leaves page error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const balances = employee?.leaveBalances || { annual: 0, sick: 0, casual: 0, totalRemaining: 0 };

  return (
    <DashboardLayout activeRole="employee" pageTitle="Leave Applications & Balance">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Time-Off &amp; Leave Portal</h2>
          <p className="text-xs text-[#7E8980]">
            Apply for digital leave and track manager approval statuses in real-time
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsApplyOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <CalendarPlus className="w-4 h-4 text-[#C7F36B]" />
          <span>Apply for Time-Off</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase tracking-wider block">Annual Leave</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{balances.annual}</span>
            <span className="text-xs text-[#7E8980]">days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase tracking-wider block">Sick / Medical</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{balances.sick}</span>
            <span className="text-xs text-[#7E8980]">days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase tracking-wider block">Casual Days</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif-display text-3xl font-bold text-[#102820]">{balances.casual}</span>
            <span className="text-xs text-[#7E8980]">days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase tracking-wider block">Total Available Bank</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif-display text-3xl font-bold text-[#173D32]">{balances.totalRemaining}</span>
            <span className="text-xs text-[#34785B] font-semibold">days total</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-[#E6EBE5] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E6EBE5]">
          <h3 className="font-serif-display text-lg text-[#102820]">Leave Request History</h3>
          <p className="text-xs text-[#7E8980]">All personal applications with reviewer feedback</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F5] border-b border-[#E6EBE5] text-[#7E8980] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Leave Type</th>
                <th className="py-3.5 px-6">Date Period</th>
                <th className="py-3.5 px-6">Days Requested</th>
                <th className="py-3.5 px-6">Reason &amp; Notes</th>
                <th className="py-3.5 px-6">Submitted Date</th>
                <th className="py-3.5 px-6 text-right">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBE5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E8980]">Loading leave records…</td>
                </tr>
              ) : myLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E8980]">
                    No leave requests found. Click &quot;Apply for Time-Off&quot; to submit a new application.
                  </td>
                </tr>
              ) : (
                myLeaves.map((req: any) => (
                  <tr key={req._id || req.id} className="hover:bg-[#F7F8F5]/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#102820] text-sm">{req.leaveType} Leave</td>
                    <td className="py-4 px-6 text-[#102820]">{req.startDate} → {req.endDate}</td>
                    <td className="py-4 px-6 font-semibold text-[#173D32]">{req.days} Day(s)</td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-[11px] text-[#34443A] italic">&ldquo;{req.reason}&rdquo;</p>
                      {req.rejectionReason && (
                        <p className="text-[10px] text-[#C24141] font-semibold mt-1">Feedback: {req.rejectionReason}</p>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[#7E8980]">{req.submittedAt || req.createdAt}</td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                          req.status === 'Approved'
                            ? 'bg-[#34785B]/15 text-[#34785B]'
                            : req.status === 'Rejected'
                            ? 'bg-[#C24141]/15 text-[#C24141]'
                            : 'bg-[#B7791F]/15 text-[#B7791F]'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ApplyLeaveModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSuccess={() => { setIsApplyOpen(false); loadData(); }}
        employeeId={employee?._id || employee?.id || employee?.employeeId}
        employeeName={employee?.name}
        employeeDepartment={employee?.department}
      />
    </DashboardLayout>
  );
}
