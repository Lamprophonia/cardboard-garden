const authService = require('../services/authService');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.',
        requiresAuth: true 
      });
    }

    const decoded = authService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        error: 'Invalid or expired token.',
        requiresAuth: true 
      });
    }

    // Get user details and attach to request
    const user = await authService.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found.',
        requiresAuth: true 
      });
    }

    if (!user.is_active || !user.email_verified) {
      return res.status(401).json({ 
        error: 'Account not active or email not verified.',
        requiresAuth: true,
        needsVerification: !user.email_verified
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = authService.verifyToken(token);
      if (decoded) {
        const user = await authService.getUserById(decoded.userId);
        if (user && user.is_active && user.email_verified) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

// Middleware to check if user is admin (for future use)
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // For now, check if username is admin (you can add proper role system later)
  if (req.user.username !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin
};
