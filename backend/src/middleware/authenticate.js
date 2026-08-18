import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('[Auth]: JWT_SECRET is not configured.');

      return res.status(500).json({
        success: false,
        error: 'Authentication configuration error.'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('[Auth Error]:', error.message);

    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token.'
    });
  }
}