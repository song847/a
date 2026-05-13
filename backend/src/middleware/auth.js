const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-this-in-prod';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: '未登录或会话已过期' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: '认证无效' });
    }
    req.user = user;
    next();
  });
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (!req.user || req.user.is_admin !== 1) {
      return res.status(403).json({ success: false, error: '需要管理员权限' });
    }
    next();
  });
}

module.exports = { authMiddleware, adminMiddleware, JWT_SECRET };
