import { Employee } from '../models/Employee.js';
import { memoryStore } from '../services/dataStore.js';

export async function getEmployees(req, res) {
  try {
    const { search, department, status } = req.query;

    let list = [];
    try {
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
      list = await Employee.find(filter).sort({ createdAt: -1 });
    } catch {
      // Memory fallback
      list = memoryStore.employees.filter((emp) => {
        const matchesDept = !department || department === 'All' || emp.department === department;
        const matchesStatus = !status || status === 'All' || emp.status === status;
        const query = (search || '').toLowerCase();
        const matchesSearch =
          !query ||
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.employeeId.toLowerCase().includes(query) ||
          emp.designation.toLowerCase().includes(query);
        return matchesDept && matchesStatus && matchesSearch;
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
      message: 'Failed to retrieve employee directory.',
      error: err.message,
    });
  }
}

export async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;
    let found = null;
    try {
      found = await Employee.findOne({ $or: [{ _id: id }, { employeeId: id }] });
    } catch {
      found = memoryStore.employees.find((e) => e.id === id || e.employeeId === id);
    }

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

    const empId = data.employeeId || `STF-${1000 + memoryStore.employees.length + 1}`;
    const newEmp = {
      ...data,
      id: `emp-${Date.now().toString().slice(-4)}`,
      employeeId: empId,
      status: data.status || 'Active',
      leaveBalances: data.leaveBalances || {
        annual: 15,
        sick: 10,
        casual: 5,
        totalRemaining: 30,
      },
    };

    try {
      const created = await Employee.create(newEmp);
      memoryStore.employees.unshift(created);
      return res.status(201).json({
        success: true,
        data: created,
        message: 'Employee record created successfully.',
      });
    } catch {
      memoryStore.employees.unshift(newEmp);
      return res.status(201).json({
        success: true,
        data: newEmp,
        message: 'Employee record created in memory storage.',
      });
    }
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
    const updates = req.body;

    // Disallow employee role escalation if employee is updating self
    if (req.user && req.user.role === 'employee') {
      delete updates.role;
      delete updates.employeeId;
      delete updates.status;
      delete updates.department;
    }

    let updated = null;
    try {
      updated = await Employee.findOneAndUpdate(
        { $or: [{ _id: id }, { employeeId: id }] },
        updates,
        { new: true }
      );
    } catch {
      // Memory fallback
    }

    const idx = memoryStore.employees.findIndex((e) => e.id === id || e.employeeId === id);
    if (idx !== -1) {
      memoryStore.employees[idx] = { ...memoryStore.employees[idx], ...updates };
      updated = memoryStore.employees[idx];
    }

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
    try {
      await Employee.findOneAndDelete({ $or: [{ _id: id }, { employeeId: id }] });
    } catch {
      // Memory fallback
    }

    const initialLen = memoryStore.employees.length;
    memoryStore.employees = memoryStore.employees.filter((e) => e.id !== id && e.employeeId !== id);

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
