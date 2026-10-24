
import React, { useState } from 'react';
import { X, CalendarPlus, CheckCircle2 } from 'lucide-react';
import { LeaveType, LeaveRequest } from '../../lib/types';
import { MockService } from '../../lib/mockService';
import { ApiClient } from '../../services/apiClient.js';
import { getInitialsAvatar } from '../../lib/avatar.jsx';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newLeave: LeaveRequest) => void;
  employeeId?: string;
  employeeName?: string;
}

export default function ApplyLeaveModal({
  isOpen,
  onClose,
  onSuccess,
  employeeId,
  employeeName,
}: ApplyLeaveModalProps) {
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentUser = MockService.getCurrentUser() || {};
  const effectiveEmpId = employeeId || currentUser.employeeId || currentUser.id || 'STF-1008';
  const effectiveEmpName = employeeName || currentUser.name || 'Staff Member';
  const effectiveDept = currentUser.department || 'General';

  // Calculate day difference
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    const payload = {
      employeeId: effectiveEmpId,
      employeeName: effectiveEmpName,
      employeeAvatar: currentUser.avatar || getInitialsAvatar(effectiveEmpName, '#173D32', '#C7F36B'),
      department: effectiveDept,
      leaveType,
      startDate,
      endDate,
      days: calculatedDays,
      reason: reason.trim(),
    };

    try {
      await ApiClient.applyLeave(payload);
    } catch (err) {
      console.warn('API leave application fallback:', err);
    }

    const newReq = MockService.applyLeave(payload as any);
    setIsSubmitting(false);
    onSuccess(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6EBE5] shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#173D32] text-[#EAE9DF] flex items-center justify-center">
              <CalendarPlus className="w-4 h-4 text-[#C7F36B]" />
            </div>
            <div>
              <h3 className="font-serif-display text-xl text-[#102820]">Submit Leave Application</h3>
              <p className="text-xs text-[#7E8980]">Formal time-off request for lead approval</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7E8980] hover:text-[#102820] hover:bg-[#F7F8F5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-1">Leave Category</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32] bg-white"
            >
              <option value="Annual">Annual Paid Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick / Medical Leave</option>
              <option value="Parental">Parental / Family Leave</option>
              <option value="Unpaid">Unpaid Sabbatical</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E6EBE5] flex items-center justify-between text-xs">
            <span className="text-[#7E8980]">Calculated Duration:</span>
            <span className="font-bold text-[#102820]">{calculatedDays} working day(s)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-1">
              Purpose & Context
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the reason for your time-off request..."
              className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
              required
            />
          </div>

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
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
