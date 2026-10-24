import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { memoryStore, INITIAL_DEMO_USERS } from '../services/dataStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'staffsync_dev_jwt_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

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

    // Check MongoDB if connected
    let userRecord = null;
    try {
      userRecord = await User.findOne({ email: cleanEmail });
    } catch {
      // DB offline, fallback to memory
    }

    if (userRecord) {
      const isMatch = await userRecord.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      const payload = {
        id: userRecord._id.toString(),
        employeeId: userRecord.employeeId,
        name: userRecord.name,
        email: userRecord.email,
        role: (userRecord.role || 'employee').toLowerCase(),
        department: userRecord.department,
        designation: userRecord.designation,
        avatar: userRecord.avatar,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return res.json({
        success: true,
        token,
        user: payload,
      });
    }

    // Memory Store / Demo Accounts check
    const demoUser = Object.values(memoryStore.users).find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    // If demo credentials matched
    if (demoUser) {
      const payload = {
        id: demoUser.id,
        employeeId: demoUser.employeeId,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        department: demoUser.department,
        designation: demoUser.designation,
        avatar: demoUser.avatar,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return res.json({
        success: true,
        token,
        user: payload,
      });
    }

    // Role-based matching for quick demo testing
    let assignedRole = 'employee';
    if (cleanEmail.includes('hr') || cleanEmail.includes('admin')) assignedRole = 'hr';
    else if (cleanEmail.includes('manager') || cleanEmail.includes('lead')) assignedRole = 'manager';

    const fallbackUser = INITIAL_DEMO_USERS[assignedRole];
    const payload = {
      id: fallbackUser.id,
      employeeId: fallbackUser.employeeId,
      name: fallbackUser.name,
      email: cleanEmail,
      role: fallbackUser.role,
      department: fallbackUser.department,
      designation: fallbackUser.designation,
      avatar: fallbackUser.avatar,
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

    // Check existing via MongoDB if connected
    let existing = null;
    const isDbConnected = User.db && User.db.readyState === 1;

    if (isDbConnected) {
      try {
        existing = await User.findOne({ email: cleanEmail });
      } catch (err) {
        console.warn('[Register] DB lookup failed, falling back:', err.message);
      }
    } else {
      existing = Object.values(memoryStore.users).find((u) => u.email.toLowerCase() === cleanEmail);
    }

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
    const designation = `${assignedRole === 'hr' ? 'People Operations Specialist' : assignedRole === 'manager' ? 'Team Lead' : 'Software Engineer'}`;

    if (isDbConnected) {
      try {
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

        // Also create matching Employee doc in MongoDB Atlas
        try {
          const { Employee } = await import('../models/Employee.js');
          await Employee.create({
            user: newUser._id,
            name: newUser.name,
            email: newUser.email,
            employeeId,
            department: newUser.department,
            designation,
            position: designation,
            role: assignedRole.toLowerCase(),
            status: 'Active',
            joiningDate: new Date().toISOString().split('T')[0],
          });
        } catch (empErr) {
          console.warn('[Register] Employee profile save note:', empErr.message);
        }

        const payload = {
          id: newUser._id.toString(),
          employeeId: newUser.employeeId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role.toLowerCase(),
          department: newUser.department,
          designation: newUser.designation,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return res.status(201).json({
          success: true,
          message: 'User registered successfully.',
          token,
          user: payload,
        });
      } catch (err) {
        console.warn('[Register] DB save failed, saving to memoryStore:', err.message);
      }
    }

    // Memory Store Fallback
    const id = 'usr-' + Date.now();
    const newUser = {
      id,
      employeeId: 'STF-' + Math.floor(1000 + Math.random() * 9000),
      name,
      email: cleanEmail,
      role: assignedRole.toLowerCase(),
      department: department || 'General',
      designation: assignedRole + ' Member',
    };

    memoryStore.users[id] = newUser;

    const payload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
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

export async function getMe(req, res) {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching authenticated user.',
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

