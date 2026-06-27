const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

  try {
    const jwtSecret = process.env.JWT_SECRET || 'ajay_fruit_mart_secret_key_2024_super_secure';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = await User.findById(decoded.id).select('-__v');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    if (req.user.isBanned) return res.status(403).json({ success: false, message: 'Account suspended' });
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
