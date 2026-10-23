import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'staffsync_dev_jwt_secret_key_2026';

/**
 * Middleware to verify JWT authentication token
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No authentication token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
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

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires [${roles.join(', ')}] role. Current role: '${req.user.role}'.`,
      });
    }

    next();
  };
}
