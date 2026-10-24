import { LeaveRequest } from '../models/LeaveRequest.js';
import { Employee } from '../models/Employee.js';
import { memoryStore } from '../services/dataStore.js';

export async function getLeaves(req, res) {
  try {
    const { status, employeeId, department } = req.query;

    let list = [];
    try {
      const filter = {};
      if (status && status !== 'All') filter.status = status;
      if (employeeId) {
        filter.$or = [{ employeeId: employeeId }, { user: employeeId }];
      }
      if (department) filter.department = department;
      list = await LeaveRequest.find(filter).sort({ createdAt: -1 });
    } catch {
      // Memory fallback
      list = memoryStore.leaves.filter((l) => {
        const matchesStatus = !status || status === 'All' || l.status === status;
        const matchesEmp = !employeeId || l.employeeId === employeeId;
        const matchesDept = !department || l.department === department;
        return matchesStatus && matchesEmp && matchesDept;
      });
    }

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve leave requests.',
      error: err.message,
    });
  }
}

export async function applyLeave(req, res) {
  try {
    const { employeeId, employeeName, employeeAvatar, department, leaveType, startDate, endDate, days, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Leave type, start date, end date, and reason are required.',
      });
    }

    const newReq = {
      id: `lv-${Date.now().toString().slice(-4)}`,
      employeeId: employeeId || req.user?.employeeId || req.user?.id || 'STF-1008',
      employeeName: employeeName || req.user?.name || 'Staff Member',
      employeeAvatar: employeeAvatar || req.user?.avatar || '',
      department: department || req.user?.department || 'General',
      leaveType: leaveType || 'Annual',
      startDate: String(startDate),
      endDate: String(endDate),
      days: Number(days) || 1,
      reason: String(reason).trim(),
      status: 'Pending',
      submittedAt: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    try {
      const created = await LeaveRequest.create(newReq);
      memoryStore.leaves.unshift(created);
      return res.status(201).json({
        success: true,
        data: created,
        message: 'Leave request submitted successfully.',
      });
    } catch (dbErr) {
      console.error('MongoDB LeaveRequest.create error:', dbErr);
      memoryStore.leaves.unshift(newReq);
      return res.status(201).json({
        success: true,
        data: newReq,
        message: 'Leave application recorded.',
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit leave request.',
      error: err.message,
    });
  }
}

export async function approveLeave(req, res) {
  try {
    const { id } = req.params;
    const reviewerName = req.user?.name || 'Administrator';

    const updates = {
      status: 'Approved',
      reviewedBy: reviewerName,
      reviewedAt: new Date().toLocaleString(),
    };

    let updated = null;
    try {
      updated = await LeaveRequest.findOneAndUpdate(
        { $or: [{ _id: id }, { id: id }] },
        updates,
        { new: true }
      );
    } catch {
      // Memory fallback
    }

    const idx = memoryStore.leaves.findIndex((l) => l.id === id || l._id?.toString() === id);
    if (idx !== -1) {
      memoryStore.leaves[idx] = { ...memoryStore.leaves[idx], ...updates };
      updated = memoryStore.leaves[idx];

      // Deduct balance from employee
      const empIdx = memoryStore.employees.findIndex((e) => e.id === updated.employeeId || e.employeeId === updated.employeeId);
      if (empIdx !== -1) {
        const emp = memoryStore.employees[empIdx];
        if (updated.leaveType === 'Annual') emp.leaveBalances.annual = Math.max(0, emp.leaveBalances.annual - updated.days);
        if (updated.leaveType === 'Sick') emp.leaveBalances.sick = Math.max(0, emp.leaveBalances.sick - updated.days);
        if (updated.leaveType === 'Casual') emp.leaveBalances.casual = Math.max(0, emp.leaveBalances.casual - updated.days);
        emp.leaveBalances.totalRemaining = emp.leaveBalances.annual + emp.leaveBalances.sick + emp.leaveBalances.casual;
      }
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found.',
      });
    }

    return res.json({
      success: true,
      data: updated,
      message: 'Leave request approved.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to approve leave request.',
      error: err.message,
    });
  }
}

export async function rejectLeave(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const reviewerName = req.user?.name || 'Administrator';

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required.',
      });
    }

    const updates = {
      status: 'Rejected',
      reviewedBy: reviewerName,
      reviewedAt: new Date().toLocaleString(),
      rejectionReason: reason.trim(),
    };

    let updated = null;
    try {
      updated = await LeaveRequest.findOneAndUpdate(
        { $or: [{ _id: id }, { id: id }] },
        updates,
        { new: true }
      );
    } catch {
      // Memory fallback
    }

    const idx = memoryStore.leaves.findIndex((l) => l.id === id || l._id?.toString() === id);
    if (idx !== -1) {
      memoryStore.leaves[idx] = { ...memoryStore.leaves[idx], ...updates };
      updated = memoryStore.leaves[idx];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found.',
      });
    }

    return res.json({
      success: true,
      data: updated,
      message: 'Leave request rejected with explanation.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to reject leave request.',
      error: err.message,
    });
  }
}

export async function updateLeaveStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, reviewerNotes, rejectionReason } = req.body;
    const reviewerName = req.user?.name || 'Authorized Reviewer';

    const updates = {
      status: status || 'Approved',
      reviewedBy: reviewerName,
      reviewedAt: new Date().toLocaleString(),
      rejectionReason: reviewerNotes || rejectionReason || '',
    };

    let updated = null;
    try {
      updated = await LeaveRequest.findOneAndUpdate(
        { $or: [{ _id: id }, { id }] },
        updates,
        { new: true }
      );
    } catch {
      // Memory fallback
    }

    const idx = memoryStore.leaves.findIndex((l) => l.id === id || l._id?.toString() === id);
    if (idx !== -1) {
      memoryStore.leaves[idx] = { ...memoryStore.leaves[idx], ...updates };
      updated = memoryStore.leaves[idx];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found.',
      });
    }

    return res.json({
      success: true,
      data: updated,
      message: `Leave request status updated to ${status}.`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update leave status.',
      error: err.message,
    });
  }
}
