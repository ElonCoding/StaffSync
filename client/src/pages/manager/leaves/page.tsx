import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Check,
  X,
  Search,
  Filter,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ApiClient } from '../../../services/apiClient.js';
import { LeaveRequest } from '../../../lib/types';
import LeaveDecisionModal from '../../../components/modals/LeaveDecisionModal';

export default function ManagerLeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewerName, setReviewerName] = useState('Manager');

  const loadData = async () => {
    try {
      const meRes = await ApiClient.getMe().catch(() => null);
      if (meRes?.user?.name) setReviewerName(meRes.user.name);

      const res = await ApiClient.getLeaves();
      const all: LeaveRequest[] = res?.leaves || res?.data || [];
      setLeaves(all);
    } catch (err) {
      console.error('Failed to load leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickApprove = async (req: LeaveRequest) => {
    try {
      await ApiClient.updateLeaveStatus((req as any)._id || req.id, 'Approved');
      await loadData();
    } catch (err) {
      console.error('Failed to approve leave:', err);
    }
  };

  const filteredLeaves = leaves.filter((l) => statusFilter === 'All' || l.status === statusFilter);

  return (
    <DashboardLayout activeRole="manager" pageTitle="Team Leave Approvals">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Time-Off Approval Desk</h2>
          <p className="text-xs text-[#7E8980]">
            Review, approve, or reject time-off requests submitted by your team members
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E6EBE5] text-xs">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === tab
                  ? 'bg-[#173D32] text-[#EAE9DF] shadow-xs'
                  : 'text-[#34443A] hover:text-[#173D32]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E6EBE5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F5] border-b border-[#E6EBE5] text-[#7E8980] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Direct Report</th>
                <th className="py-3.5 px-6">Leave Type</th>
                <th className="py-3.5 px-6">Date Span</th>
                <th className="py-3.5 px-6">Reason Given</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBE5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E8980]">
                    Loading leave requests...
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E8980]">
                    No leave requests found in the {statusFilter.toLowerCase()} queue.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((req) => (
                  <tr key={(req as any)._id || req.id} className="hover:bg-[#F7F8F5]/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {req.employeeAvatar ? (
                          <img
                            src={req.employeeAvatar}
                            alt={req.employeeName}
                            className="w-9 h-9 rounded-xl object-cover border border-[#E6EBE5]"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-[#173D32] text-[#C7F36B] flex items-center justify-center font-bold text-xs">
                            {req.employeeName?.slice(0, 2).toUpperCase() || 'EM'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#102820] text-sm">{req.employeeName}</p>
                          <p className="text-[11px] text-[#7E8980]">{req.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-[#102820] block">{req.leaveType}</span>
                      <span className="text-[10px] text-[#7E8980]">Logged {req.submittedAt}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-medium text-[#102820] block">
                        {req.startDate} to {req.endDate}
                      </span>
                      <span className="text-[11px] font-bold text-[#173D32] bg-[#173D32]/10 px-2 py-0.5 rounded inline-block mt-0.5">
                        {req.days} Day(s)
                      </span>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-[11px] text-[#34443A] italic">&ldquo;{req.reason}&rdquo;</p>
                      {req.rejectionReason && (
                        <p className="text-[10px] text-[#C24141] font-medium mt-1">
                          Rejection note: {req.rejectionReason}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-6">
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

                    <td className="py-4 px-6 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickApprove(req)}
                            className="px-2.5 py-1 rounded-lg bg-[#34785B] text-white text-xs font-semibold hover:bg-[#286047] flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsDecisionModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg border border-[#C24141]/30 text-[#C24141] hover:bg-[#C24141]/10 text-xs font-semibold"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#7E8980]">Decision finalized</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
