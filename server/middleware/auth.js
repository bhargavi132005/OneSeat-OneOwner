import { verifyAccess } from '../utils/jwt.js';

export const protect = (req, res, next) => {
  try {
    // Look for token in cookies first, fallback to Bearer header for flexibility
    let token = req.cookies?.accessToken;
    
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = verifyAccess(token);
    
    req.userId = decoded.userId;
    req.user = { id: decoded.userId }; // Attaching both for compatibility with earlier TODOs
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};