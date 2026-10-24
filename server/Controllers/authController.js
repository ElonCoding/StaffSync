import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';

const JWT_SECRET = process.env.JWT_SECRET || 'staffsync_dev_jwt_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Real DB Authentication Login
 * Rejects any credentials not stored in MongoDB Atlas
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Query real MongoDB Atlas user record
    const userRecord = await User.findOne({ email: cleanEmail });

    if (!userRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. User not found in database.',
      });
    }

    const isMatch = await userRecord.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // Lookup matching employee profile if created
    const employee = await Employee.findOne({
      $or: [{ user: userRecord._id }, { email: cleanEmail }],
    }).lean();

    const payload = {
      id: userRecord._id.toString(),
      employeeId: employee?.employeeId || userRecord.employeeId || 'STF-0000',
      name: userRecord.name,
      email: userRecord.email,
      role: (userRecord.role || 'employee').toLowerCase(),
      department: employee?.department || userRecord.department || 'General',
      designation: employee?.designation || employee?.position || userRecord.designation || 'Staff Member',
      avatar: employee?.avatar || userRecord.avatar || '',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      success: true,
      token,
      user: payload,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
      error: err.message,
    });
  }
}

/**
 * Register new user into real MongoDB Atlas collections (User + Employee)
 */
export async function register(req, res) {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify uniqueness in MongoDB
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const rawRole = (role || 'employee').toLowerCase();
    const assignedRole = rawRole.includes('hr') || rawRole.includes('admin')
      ? 'hr'
      : rawRole.includes('man') || rawRole.includes('lead')
      ? 'manager'
      : 'employee';

    const employeeId = `STF-${Math.floor(1000 + Math.random() * 9000)}`;
    const designation = `${
      assignedRole === 'hr'
        ? 'People Operations Specialist'
        : assignedRole === 'manager'
        ? 'Team Lead'
        : 'Software Engineer'
    }`;

    // Create User record in MongoDB Atlas
    const newUser = new User({
      name,
      email: cleanEmail,
      password,
      role: assignedRole,
      department: department || 'General',
      employeeId,
      designation,
    });

    await newUser.save();

    // Create matching Employee document in MongoDB Atlas
    let newEmployee = null;
    try {
      newEmployee = await Employee.create({
        user: newUser._id,
        name: newUser.name,
        email: newUser.email,
        employeeId,
        department: newUser.department,
        designation,
        position: designation,
        role: assignedRole,
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0],
      });
    } catch (empErr) {
      console.warn('[Register] Employee profile save notice:', empErr.message);
    }

    const payload = {
      id: newUser._id.toString(),
      employeeId: newEmployee?.employeeId || newUser.employeeId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role.toLowerCase(),
      department: newUser.department,
      designation: newUser.designation,
      avatar: newUser.avatar || '',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: payload,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: err.message,
    });
  }
}

/**
 * Fetch authenticated user from MongoDB Atlas
 */
export async function getMe(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid token session.',
      });
    }

    const isValidId = mongoose.Types.ObjectId.isValid(req.user.id);
    const query = isValidId
      ? { _id: req.user.id }
      : { email: (req.user.email || '').toLowerCase() };

    const userRecord = await User.findOne(query).select('-password').lean();

    if (!userRecord) {
      return res.status(401).json({
        success: false,
        message: 'User account not found in database. Please log in again.',
      });
    }

    const employee = await Employee.findOne({
      $or: [{ user: userRecord._id }, { email: userRecord.email.toLowerCase() }],
    }).lean();

    return res.json({
      success: true,
      user: {
        id: userRecord._id.toString(),
        _id: userRecord._id.toString(),
        name: userRecord.name,
        email: userRecord.email,
        role: (userRecord.role || 'employee').toLowerCase(),
        employeeId: employee?.employeeId || userRecord.employeeId || 'STF-0000',
        department: employee?.department || userRecord.department || 'General',
        designation: employee?.designation || employee?.position || userRecord.designation || 'Staff Member',
        avatar: employee?.avatar || userRecord.avatar || '',
        phone: employee?.phone || userRecord.phone || '',
        location: employee?.location || userRecord.location || '',
        status: employee?.status || 'Active',
        joiningDate: employee?.joiningDate || '',
        managerName: employee?.managerName || '',
        emergencyContact: employee?.emergencyContact || '',
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching authenticated user from database.',
      error: err.message,
    });
  }
}

export function logout(req, res) {
  return res.json({
    success: true,
    message: 'User logged out successfully.',
  });
}
