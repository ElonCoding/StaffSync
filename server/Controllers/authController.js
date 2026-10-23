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
        role: userRecord.role,
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
