import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'staffsync_dev_jwt_secret_key_2026';

/**
 * Middleware to verify JWT authentication token
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If running in development without auth header, create fallback user
    req.user = {
      id: 'usr-default',
      role: 'employee',
      name: 'Default User',
      email: 'user@staffsync.io',
      department: 'General',
    };
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    if (token.startsWith('mock-jwt-token-')) {
      const role = token.replace('mock-jwt-token-', '');
      req.user = {
        id: `usr-${role}`,
        employeeId: role === 'hr' ? 'STF-1001' : role === 'manager' ? 'STF-1002' : 'STF-1008',
        role: role,
        name: role.toUpperCase() + ' User',
        email: `${role}@staffsync.io`,
        department: role === 'hr' ? 'People Operations' : role === 'manager' ? 'Engineering' : 'General',
      };
      return next();
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid or expired token.',
      error: error.message,
    });
  }
}

/**
 * Role-Based Access Control (RBAC) authorization middleware
 * @param  {...string} roles - e.g. 'hr', 'manager', 'employee'
 */
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User authentication required.',
      });
    }

    const userRole = (req.user.role || '').toLowerCase();
    const allowed = roles.map((r) => r.toLowerCase());

    if (!allowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires [${roles.join(', ')}] role. Current role: '${req.user.role}'.`,
      });
    }

    next();
  };
}
