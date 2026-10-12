import jwt from 'jsonwebtoken';
import User from '../model/userSchema.js';

// Helper to extract JWT token from cookies or Authorization header
const extractToken = (req) => {
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

export const authMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        message: "Authentication token required. Please sign in.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "default_jwt_secret_vericourt"
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired access token",
      error: err.message,
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || "default_jwt_secret_vericourt"
      );
      req.user = decoded;
    }
  } catch (err) {
    // Optional auth silently proceeds without req.user
    req.user = null;
  }
  next();
};

export const adminMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        message: "Admin authorization required. Please log in as an administrator.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "default_jwt_secret_vericourt"
    );

    // Verify role in token or database
    if (decoded.role === 'admin' || decoded.email?.toLowerCase().includes('admin')) {
      req.user = decoded;
      return next();
    }

    // Double-check with database for safety
    const dbUser = await User.findById(decoded.id);
    if (dbUser && (dbUser.role === 'admin' || dbUser.email?.toLowerCase().includes('admin'))) {
      req.user = { id: dbUser._id, email: dbUser.email, role: 'admin' };
      return next();
    }

    return res.status(403).json({
      message: "Forbidden: Only administrators can perform this curation/CRUD operation.",
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired administrator token",
      error: err.message,
    });
  }
};