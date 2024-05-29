const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (allowedRoles) => (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(403).send('Token is required');

  const token = authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).send('Access denied');
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
};

module.exports = authMiddleware;
