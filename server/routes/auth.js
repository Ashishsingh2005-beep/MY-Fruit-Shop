const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');

// In-memory OTP store (use Redis in production)
const otpStore = new Map();

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: Send OTP via Fast2SMS
const sendSMS = async (phone, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey || apiKey === 'your_fast2sms_key_here') {
    console.log(`[DEV MODE] OTP for ${phone}: ${otp}`);
    return { success: true, mode: 'dev', debug_otp: otp };
  }

  try {
    const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', null, {
      params: {
        authorization: apiKey,
        route: 'q',
        message: `Your Ajay Fruit Mart OTP is: ${otp}. Valid for 10 minutes.`,
        language: 'english',
        flash: 0,
        numbers: phone
      }
    });
    return { success: true, mode: 'sms' };
  } catch (err) {
    console.error('SMS Error:', err.message);
    return { success: true, mode: 'dev', debug_otp: otp };
  }
};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(phone, { otp, expiresAt });

    const result = await sendSMS(phone, otp);
    res.json({ success: true, message: 'OTP sent successfully', ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/register user
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name, email, address } = req.body;

    const stored = otpStore.get(phone);
    if (!stored) return res.status(400).json({ success: false, message: 'OTP not found. Please resend.' });
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({ success: false, message: 'OTP expired. Please resend.' });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // OTP valid — delete it
    otpStore.delete(phone);

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name: name || `User_${phone.slice(-4)}`, email, address });
    } else {
      // Update last login
      user.lastLogin = new Date();
      if (name) user.name = name;
      if (address) user.address = address;
      await user.save();
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role,
        totalOrders: user.totalOrders,
        totalSpent: user.totalSpent
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, address } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name, email, address },
      { new: true, runValidators: true }
    ).select('-__v');

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-__v');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
