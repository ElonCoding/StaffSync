
import React, { useState } from 'react';
import { X, Check, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { LeaveRequest, LeaveStatus } from '../../lib/types';
import { MockService } from '../../lib/mockService';
import { ApiClient } from '../../services/apiClient.js';

interface LeaveDecisionModalProps {
  isOpen: boolean;
  request: LeaveRequest | null;
  onClose: () => void;
  onDecision: (updated: LeaveRequest) => void;
  reviewerName: string;
}

export default function LeaveDecisionModal({
  isOpen,
  request,
  onClose,
  onDecision,
  reviewerName,
}: LeaveDecisionModalProps) {
  const [decision, setDecision] = useState<LeaveStatus>('Approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === 'Rejected' && !rejectionReason.trim()) return;

    setIsSubmitting(true);
    try {
      await ApiClient.updateLeaveStatus(
        (request as any)._id || request.id,
        decision,
        decision === 'Rejected' ? rejectionReason : undefined
      );
    } catch (err) {
      console.warn('API leave review fallback:', err);
    }

    const res = MockService.reviewLeave(
      request.id,
      decision,
      reviewerName,
      decision === 'Rejected' ? rejectionReason : undefined
    );

    setIsSubmitting(false);
    if (res) {
      onDecision(res);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6EBE5] shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-5">
          <div>
            <h3 className="font-serif-display text-xl text-[#102820]">Review Leave Application</h3>
            <p className="text-xs text-[#7E8980]">Decision for {request.employeeName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7E8980] hover:text-[#102820] hover:bg-[#F7F8F5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Request Summary Card */}
        <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5] mb-6 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#7E8980]">Employee:</span>
            <span className="font-bold text-[#102820]">{request.employeeName} ({request.department})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7E8980]">Leave Type:</span>
            <span className="font-medium text-[#102820]">{request.leaveType} Leave</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7E8980]">Dates:</span>
            <span className="font-medium text-[#102820]">{request.startDate} to {request.endDate} ({request.days} days)</span>
          </div>
          <div className="pt-2 border-t border-[#E6EBE5]">
            <span className="text-[#7E8980] block mb-1">Reason:</span>
            <p className="text-[#34443A] italic bg-white p-2 rounded-lg border border-[#E6EBE5]">
              &ldquo;{request.reason}&rdquo;
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-2">Decision</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('Approved')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  decision === 'Approved'
                    ? 'bg-[#34785B] text-white border-[#34785B] shadow-sm'
                    : 'bg-[#F7F8F5] text-[#34443A] border-[#E6EBE5] hover:bg-white'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Approve Request</span>
              </button>
              <button
                type="button"
                onClick={() => setDecision('Rejected')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  decision === 'Rejected'
                    ? 'bg-[#C24141] text-white border-[#C24141] shadow-sm'
                    : 'bg-[#F7F8F5] text-[#34443A] border-[#E6EBE5] hover:bg-white'
                }`}
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Reject Request</span>
              </button>
            </div>
          </div>

          {decision === 'Rejected' && (
            <div>
              <label className="block text-xs font-semibold text-[#C24141] mb-1">
                Rejection Reason (Required)
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain the reason for rejecting this leave request..."
                className="w-full px-3 py-2 rounded-xl border border-[#C24141]/40 text-xs outline-none focus:border-[#C24141]"
                required
              />
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6EBE5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E6EBE5] text-xs font-semibold text-[#7E8980] hover:bg-[#F7F8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>Confirm Decision</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
