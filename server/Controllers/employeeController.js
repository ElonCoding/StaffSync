import mongoose from 'mongoose';
import { Employee } from '../models/Employee.js';

export async function getEmployees(req, res) {
  try {
    const { search, department, status } = req.query;

    let filter = {};
    if (department && department !== 'All') filter.department = department;
    if (status && status !== 'All') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }
    const list = await Employee.find(filter).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee directory.',
      error: err.message,
    });
  }
}

export async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    const query = isValidId
      ? { $or: [{ _id: id }, { user: id }, { employeeId: id }] }
      : { employeeId: id };

    const found = await Employee.findOne(query);

    if (!found) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found.',
      });
    }

    return res.json({
      success: true,
      data: found,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching employee details.',
      error: err.message,
    });
  }
}

export async function createEmployee(req, res) {
  try {
    const data = req.body;
    if (!data.name || !data.email || !data.department || !data.designation) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, department, and designation are mandatory.',
      });
    }

    const count = await Employee.countDocuments();
    const empId = data.employeeId || `STF-${1000 + count + 1}`;

    const newEmp = await Employee.create({
      ...data,
      employeeId: empId,
      status: data.status || 'Active',
      leaveBalances: data.leaveBalances || {
        annual: 15,
        sick: 10,
        casual: 5,
        totalRemaining: 30,
      },
    });

    return res.status(201).json({
      success: true,
      data: newEmp,
      message: 'Employee record created successfully.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create employee record.',
      error: err.message,
    });
  }
}

export async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Disallow employee role escalation if employee is updating self
    if (req.user && req.user.role === 'employee') {
      delete updates.role;
      delete updates.employeeId;
      delete updates.status;
      delete updates.department;
    }

    const isValidId = mongoose.Types.ObjectId.isValid(id);
    const query = isValidId
      ? { $or: [{ _id: id }, { user: id }, { employeeId: id }] }
      : { employeeId: id };

    const updated = await Employee.findOneAndUpdate(query, updates, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for update.',
      });
    }

    return res.json({
      success: true,
      data: updated,
      message: 'Employee updated successfully.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update employee.',
      error: err.message,
    });
  }
}

export async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    const query = isValidId
      ? { $or: [{ _id: id }, { employeeId: id }] }
      : { employeeId: id };

    const deleted = await Employee.findOneAndDelete(query);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for deletion.',
      });
    }

    return res.json({
      success: true,
      message: 'Employee removed from organizational directory.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete employee.',
      error: err.message,
    });
  }
}
