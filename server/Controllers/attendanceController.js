import { Attendance } from '../models/Attendance.js';
import { memoryStore } from '../services/dataStore.js';

export async function getAttendance(req, res) {
  try {
    const { date, employeeId, department } = req.query;

    let list = [];
    try {
      const filter = {};
      if (date) filter.date = date;
      if (employeeId) filter.employeeId = employeeId;
      if (department) filter.department = department;
      list = await Attendance.find(filter).sort({ date: -1 });
    } catch {
      // Memory fallback
      list = memoryStore.attendance.filter((a) => {
        const matchesDate = !date || a.date === date;
        const matchesEmp = !employeeId || a.employeeId === employeeId;
        const matchesDept = !department || a.department === department;
        return matchesDate && matchesEmp && matchesDept;
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
      message: 'Failed to retrieve attendance roster.',
      error: err.message,
    });
  }
}

export async function clockIn(req, res) {
  try {
    const employeeId = req.body.employeeId || req.user?.id || 'emp-03';
    const employeeName = req.body.employeeName || req.user?.name || 'Elena Rostova';
    const department = req.body.department || req.user?.department || 'Product & Design';
    const today = new Date().toISOString().split('T')[0];

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);

    const record = {
      id: `att-${Date.now().toString().slice(-4)}`,
      employeeId,
      employeeName,
      department,
      date: today,
      checkInTime: timeStr,
      status: isLate ? 'Late' : 'Present',
      notes: isLate ? 'Late arrival recorded' : 'Standard shift check-in',
    };

    try {
      const existing = await Attendance.findOne({ employeeId, date: today });
      if (existing) {
        existing.checkInTime = timeStr;
        existing.status = record.status;
        await existing.save();
        return res.json({ success: true, data: existing, message: 'Check-in updated.' });
      }
      const created = await Attendance.create(record);
      return res.status(201).json({ success: true, data: created, message: 'Clocked in successfully.' });
    } catch {
      // Memory fallback
      const existingIdx = memoryStore.attendance.findIndex((a) => a.employeeId === employeeId && a.date === today);
      if (existingIdx !== -1) {
        memoryStore.attendance[existingIdx].checkInTime = timeStr;
        memoryStore.attendance[existingIdx].status = record.status;
        return res.json({ success: true, data: memoryStore.attendance[existingIdx], message: 'Check-in updated.' });
      }
      memoryStore.attendance.unshift(record);
      return res.status(201).json({ success: true, data: record, message: 'Clocked in successfully.' });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process clock-in.',
      error: err.message,
    });
  }
}

export async function clockOut(req, res) {
  try {
    const employeeId = req.body.employeeId || req.user?.id || 'emp-03';
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updated = null;
    try {
      updated = await Attendance.findOneAndUpdate(
        { employeeId, date: today },
        { checkOutTime: timeStr, totalHours: 8.0 },
        { new: true }
      );
    } catch {
      // Memory fallback
    }

    const idx = memoryStore.attendance.findIndex((a) => a.employeeId === employeeId && a.date === today);
    if (idx !== -1) {
      memoryStore.attendance[idx].checkOutTime = timeStr;
      memoryStore.attendance[idx].totalHours = 8.0;
      updated = memoryStore.attendance[idx];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'No active check-in record found for today.',
      });
    }

    return res.json({
      success: true,
      data: updated,
      message: 'Clocked out successfully.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process clock-out.',
      error: err.message,
    });
  }
}

export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    let updated = null;
    try {
      updated = await Attendance.findOneAndUpdate(
        { $or: [{ _id: id }, { id }] },
        { status, ...(notes !== undefined ? { notes } : {}) },
        { new: true }
      );
    } catch {
      // Memory fallback
    }

    const idx = memoryStore.attendance.findIndex((a) => a.id === id || a._id?.toString() === id);
    if (idx !== -1) {
      memoryStore.attendance[idx].status = status;
      if (notes !== undefined) memoryStore.attendance[idx].notes = notes;
      updated = memoryStore.attendance[idx];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found.',
      });
    }

    return res.json({
      success: true,
      data: updated,
      message: 'Attendance status adjusted.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to adjust attendance status.',
      error: err.message,
    });
  }
}
