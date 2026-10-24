
import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Check,
  X,
  Filter,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock3,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { LeaveRequest, LeaveStatus } from '../../../lib/types';
import LeaveDecisionModal from '../../../components/modals/LeaveDecisionModal';

export default function HrLeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  const loadData = () => {
    setLeaves(MockService.getLeaveRequests());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staffsync_storage_update', loadData);
    return () => window.removeEventListener('staffsync_storage_update', loadData);
  }, []);

  const handleReviewClick = (req: LeaveRequest) => {
    setSelectedRequest(req);
    setIsDecisionModalOpen(true);
  };

  const handleQuickApprove = (req: LeaveRequest) => {
    MockService.reviewLeave(req.id, 'Approved', 'Sarah Jenkins (HR)');
    loadData();
  };

  const filteredLeaves = leaves.filter((req) => {
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      req.employeeName.toLowerCase().includes(query) ||
      req.department.toLowerCase().includes(query) ||
      req.leaveType.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

  return (
    <DashboardLayout activeRole="hr" pageTitle="Leave Administration">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Time-Off & Leave Governance</h2>
          <p className="text-xs text-[#7E8980]">
            Audit digital leave requests, inspect reasons, and govern organizational quotas
          </p>
        </div>

        {/* Status Counter Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-white border border-[#E6EBE5] text-xs">
            <span className="text-[#7E8980]">Pending: </span>
            <span className="font-bold text-[#B7791F]">{pendingCount}</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-white border border-[#E6EBE5] text-xs">
            <span className="text-[#7E8980]">Approved: </span>
            <span className="font-bold text-[#34785B]">{approvedCount}</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-white border border-[#E6EBE5] text-xs">
            <span className="text-[#7E8980]">Rejected: </span>
            <span className="font-bold text-[#C24141]">{rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6EBE5] shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F8F5] rounded-xl border border-[#E6EBE5] text-xs w-full md:w-auto">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === tab
                  ? 'bg-[#173D32] text-[#EAE9DF] shadow-xs'
                  : 'text-[#34443A] hover:text-[#173D32]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#7E8980] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee or leave type..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
          />
        </div>
      </div>

      {/* Leaves Data Table */}
      <div className="bg-white rounded-3xl border border-[#E6EBE5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F5] border-b border-[#E6EBE5] text-[#7E8980] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Leave Category</th>
                <th className="py-3.5 px-6">Period & Duration</th>
                <th className="py-3.5 px-6">Reason Given</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBE5]">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E8980]">
                    No leave requests found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-[#F7F8F5]/60 transition-colors">
                    {/* Employee */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.employeeAvatar}
                          alt={req.employeeName}
                          className="w-9 h-9 rounded-xl object-cover border border-[#E6EBE5]"
                        />
                        <div>
                          <p className="font-bold text-[#102820] text-sm">{req.employeeName}</p>
                          <p className="text-[11px] text-[#7E8980]">{req.department}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-[#102820] block">{req.leaveType} Leave</span>
                      <span className="text-[10px] text-[#7E8980]">Submitted {req.submittedAt}</span>
                    </td>

                    {/* Period & Duration */}
                    <td className="py-4 px-6">
                      <span className="font-medium text-[#102820] block">
                        {req.startDate} → {req.endDate}
                      </span>
                      <span className="text-[11px] font-bold text-[#173D32] bg-[#173D32]/10 px-2 py-0.5 rounded inline-block mt-0.5">
                        {req.days} Day(s)
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-[11px] text-[#34443A] line-clamp-2 italic">
                        &ldquo;{req.reason}&rdquo;
                      </p>
                      {req.rejectionReason && (
                        <p className="text-[10px] text-[#C24141] font-medium mt-1">
                          Rejection note: {req.rejectionReason}
                        </p>
                      )}
                    </td>

                    {/* Status */}
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
                      {req.reviewedBy && (
                        <span className="text-[10px] text-[#7E8980] block mt-1">
                          by {req.reviewedBy}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickApprove(req)}
                            className="px-2.5 py-1 rounded-lg bg-[#34785B] text-white text-xs font-semibold hover:bg-[#286047] transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewClick(req)}
                            className="px-2.5 py-1 rounded-lg border border-[#C24141]/30 text-[#C24141] hover:bg-[#C24141]/10 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleReviewClick(req)}
                          className="px-3 py-1 rounded-lg border border-[#E6EBE5] text-[#7E8980] hover:text-[#102820] text-xs font-medium"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
        reviewerName="Sarah Jenkins (HR Head)"
      />
    </DashboardLayout>
  );
}
