const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// In-memory OTP store
const otpStore = new Map();

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

let globalSettings = {
  weekend_discount: 5,
  sub_weekly_price: 99,
  sub_daily_price: 299
};

// @route   GET /api/settings
router.get('/settings', (req, res) => {
  res.json(globalSettings);
});

// @route   POST /api/settings
router.post('/settings', (req, res) => {
  const { weekend_discount, sub_weekly_price, sub_daily_price } = req.body;
  if (weekend_discount !== undefined) globalSettings.weekend_discount = Number(weekend_discount);
  if (sub_weekly_price !== undefined) globalSettings.sub_weekly_price = Number(sub_weekly_price);
  if (sub_daily_price !== undefined) globalSettings.sub_daily_price = Number(sub_daily_price);
  res.json({
    success: true,
    settings: globalSettings
  });
});

// @route   POST /api/log-activity
router.post('/log-activity', (req, res) => {
  console.log(`[ACTIVITY LOG] User: ${req.body.user}, Type: ${req.body.type}, Details: ${req.body.details}`);
  res.json({ success: true });
});

// @route   GET /api/user
router.get('/user', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.json({ found: false });
    const user = await User.findOne({ phone });
    if (user) {
      return res.json({
        found: true,
        user: {
          name: user.name,
          phone: user.phone,
          email: user.email,
          address: user.address,
          is_banned: user.isBanned,
          subscription: user.subscription
        }
      });
    }
    res.json({ found: false });
  } catch (err) {
    res.status(500).json({ found: false, error: err.message });
  }
});

// @route   POST /api/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }
    const otp = generateOTP();
    otpStore.set(phone, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    
    // Fast2SMS integration or DEV log
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey || apiKey === 'your_fast2sms_key_here') {
      console.log(`[DEV MODE] OTP for ${phone}: ${otp}`);
      return res.json({ success: true, debug_otp: otp });
    }

    try {
      await axios.post('https://www.fast2sms.com/dev/bulkV2', null, {
        params: {
          authorization: apiKey,
          route: 'q',
          message: `Your Ajay Fruit Mart OTP is: ${otp}. Valid for 10 minutes.`,
          language: 'english',
          flash: 0,
          numbers: phone
        }
      });
      res.json({ success: true });
    } catch (err) {
      console.error('SMS Error:', err.message);
      res.json({ success: true, debug_otp: otp });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/verify-otp
router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const stored = otpStore.get(phone);
  if (!stored) return res.status(400).json({ success: false, message: 'OTP not found' });
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }
  if (stored.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
  otpStore.delete(phone);
  res.json({ success: true });
});

// @route   POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }
    
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name: name || `User_${phone.slice(-4)}`, email, address });
    } else {
      user.lastLogin = new Date();
      if (name) user.name = name;
      if (email) user.email = email;
      if (address) user.address = address;
      await user.save();
    }
    
    if (user.isBanned) {
      return res.status(403).json({ success: false, error: 'Account suspended' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role,
        totalOrders: user.totalOrders,
        totalSpent: user.totalSpent,
        subscription: user.subscription
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/order
router.post('/order', async (req, res) => {
  try {
    const { user, cart, total, payment } = req.body;
    if (!user || !user.phone) {
      return res.status(400).json({ success: false, error: 'User details required' });
    }

    const orderItems = [];
    for (const item of cart) {
      let productObj = null;
      try {
        productObj = await Product.findById(item.id);
      } catch (e) {
        productObj = await Product.findOne({ name: item.name });
      }

      orderItems.push({
        product: productObj ? productObj._id : null,
        name: item.name,
        price: item.price,
        qty: item.qty,
        emoji: item.emoji || productObj?.emoji || '🍎',
        subtotal: item.price * item.qty
      });

      if (productObj) {
        await Product.findByIdAndUpdate(productObj._id, { $inc: { soldCount: item.qty } });
      }
    }

    const order = await Order.create({
      userPhone: user.phone,
      userName: user.name,
      userAddress: user.address,
      items: orderItems,
      pricing: {
        subtotal: total,
        deliveryFee: total >= 199 ? 0 : 30,
        total: total
      },
      payment: {
        method: payment || 'COD',
        status: payment === 'COD' ? 'Pending' : 'Paid'
      }
    });

    User.findOneAndUpdate({ phone: user.phone }, {
      $inc: { totalOrders: 1, totalSpent: total },
      lastOrderDate: new Date()
    }).catch(console.error);

    res.json({ success: true, order_id: order.orderId, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/orders
router.get('/orders', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.json([]);
    const orders = await Order.find({ userPhone: phone }).sort({ createdAt: -1 });
    const transformed = orders.map(o => {
      const obj = o.toJSON();
      return {
        ...obj,
        id: o.orderId,
        time: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Recent',
        items: o.items.map(item => `${item.name} (${item.qty || item.quantity || 1})`).join(', '),
        fullItems: o.items.map(item => ({
          id: item.product || item._id,
          name: item.name,
          price: item.price,
          qty: item.qty || item.quantity || 1,
          category: item.category || 'Fruits'
        })),
        total: o.pricing.total,
        breakdown: {
          itemTotal: o.pricing.subtotal,
          deliveryFee: o.pricing.deliveryFee,
          discount: o.pricing.discount || 0
        },
        payment_method: o.payment.method,
        payment_status: o.payment.status,
        status: o.delivery.status,
        delivery_status: o.delivery.status,
        delivery_person: o.delivery.deliveryPerson?.name || 'Rahul Kumar',
        delivery_phone: o.delivery.deliveryPerson?.phone || '9876543210',
        delivery_vehicle: o.delivery.deliveryPerson?.vehicle || 'Bike - DL 01 AB 1234'
      };
    });
    res.json(transformed);
  } catch (err) {
    res.status(500).json([]);
  }
});

// @route   GET /api/complaint
router.get('/complaint', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.json([]);
    const orders = await Order.find({ userPhone: phone, 'complaint.description': { $exists: true } });
    const complaints = orders.map(o => ({
      order_id: o.orderId,
      type: o.complaint.type,
      description: o.complaint.description,
      status: o.complaint.status,
      admin_reply: o.complaint.adminReply || ''
    }));
    res.json(complaints);
  } catch (err) {
    res.status(500).json([]);
  }
});

// @route   POST /api/complaint
router.post('/complaint', async (req, res) => {
  try {
    const { order_id, type, description } = req.body;
    const order = await Order.findOne({ orderId: order_id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.complaint = { type, description, status: 'Open' };
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/cancel-order
router.post('/cancel-order', async (req, res) => {
  try {
    const { order_id } = req.body;
    const order = await Order.findOne({ orderId: order_id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.delivery.status = 'Cancelled';
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/feedback
router.post('/feedback', (req, res) => {
  res.json({ success: true });
});

// @route   POST /api/rate
router.post('/rate', async (req, res) => {
  try {
    const { product_id, rating } = req.body;
    let product = null;
    try {
      product = await Product.findById(product_id);
    } catch (e) {
      product = await Product.findOne({ name: product_id });
    }
    if (product) {
      const newReviewCount = product.reviewCount + 1;
      const newRating = ((product.rating * product.reviewCount) + rating) / newReviewCount;
      product.rating = Math.round(newRating * 10) / 10;
      product.reviewCount = newReviewCount;
      await product.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/ratings
router.get('/ratings', async (req, res) => {
  res.json([]);
});

// @route   GET /api/all-orders
router.get('/all-orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json([]);
  }
});

// @route   GET /api/recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const recommendations = await Product.find({ inStock: true }).limit(4);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json([]);
  }
});

// @route   POST /api/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { user, plan } = req.body;
    const sub_id = `SUB-${Date.now()}`;
    const updatedUser = await User.findOneAndUpdate({ name: user }, {
      subscription: {
        plan,
        startDate: new Date(),
        status: 'active'
      }
    }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      sub_id, 
      subscription: updatedUser.subscription 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/subscribe/cancel
router.post('/subscribe/cancel', async (req, res) => {
  try {
    const { user } = req.body;
    const updatedUser = await User.findOneAndUpdate({ name: user }, {
      subscription: {
        plan: null,
        startDate: null,
        status: null
      }
    }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      subscription: updatedUser.subscription 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/ai-chat
router.post('/ai-chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt required' });

    const apiKey = process.env.GEMINI_API_KEY;
    const systemInstruction = `You are 'Ajay', the friendly AI assistant for 'Ajay Fruit Mart' in Delhi.
You help customers with fruit prices, health benefits, order tracking, refund policy, and recommendations.
Key Info: Free delivery on orders above ₹199. 12-minute express delivery. Use WELCOME50 for ₹50 off first order.
Delivery tracking: Go to Profile > My Orders > Track.
Cancellation: Allowed before "Out for Delivery" status.
Refund: 100% refund for damaged/wrong items within 24 hours.
Be friendly, brief (under 80 words), and use emojis. Reply in the same language as the user.`;

    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    let response = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const payload = {
          contents: [{ parts: [{ text: `${systemInstruction}\n\nCustomer: ${prompt}\nAjay:` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
        };
        const r = await axios.post(url, payload, { timeout: 10000 });
        if (r.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          response = r.data.candidates[0].content.parts[0].text.replace(/\*/g, '').trim();
          break;
        }
      } catch (e) { continue; }
    }

    if (!response) {
      const lower = prompt.toLowerCase();
      if (lower.includes('price') || lower.includes('kitna')) response = '🍎 Check our Products section for live prices! Use WELCOME50 for ₹50 off your first order! 🎉';
      else if (lower.includes('track') || lower.includes('order')) response = '📦 Go to Profile → My Orders → Track Order to see live delivery status! 🛵';
      else if (lower.includes('refund') || lower.includes('return')) response = '💰 100% refund on damaged/wrong items! Report via Profile → My Orders → Report Issue within 24hrs.';
      else if (lower.includes('delivery') || lower.includes('time')) response = '🚀 12-minute express delivery in Delhi! Free delivery on orders above ₹199!';
      else response = '👋 Namaste! I am Ajay, your fruit expert. Ask me about prices, delivery, refunds, or health tips! 🍎';
    }

    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Auth Middleware for compatibility routes
const adminProtect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

  try {
    const jwtSecret = process.env.JWT_SECRET || 'ajay_fruit_mart_secret_key_2024_super_secure';
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Dynamic Mongoose model for PaymentVerification
const PaymentVerificationSchema = new mongoose.Schema({
  verificationId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.Mixed },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['order', 'subscription'], default: 'order' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const PaymentVerification = mongoose.models.PaymentVerification || mongoose.model('PaymentVerification', PaymentVerificationSchema);

// @route   POST /api/verify-payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { user, amount, type, metadata } = req.body;
    const req_id = `PAY-${Date.now()}`;
    
    await PaymentVerification.create({
      verificationId: req_id,
      user: user || 'Unknown',
      amount: amount || 0,
      type: type || 'order',
      metadata: metadata || {},
      status: 'pending'
    });
    
    res.json({ success: true, req_id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/check-payment-status
router.get('/check-payment-status', async (req, res) => {
  try {
    const { req_id } = req.query;
    if (!req_id) return res.status(400).json({ status: 'error', message: 'req_id is required' });
    
    const verification = await PaymentVerification.findOne({ verificationId: req_id });
    if (!verification) {
      return res.status(404).json({ status: 'not_found' });
    }
    
    res.json({ status: verification.status });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/admin/pending-payments
router.get('/admin/pending-payments', adminProtect, async (req, res) => {
  try {
    const pendings = await PaymentVerification.find({ status: 'pending' }).sort({ createdAt: -1 });
    const transformed = pendings.map(p => ({
      id: p.verificationId,
      user: typeof p.user === 'object' ? `${p.user.name} (${p.user.phone})` : String(p.user),
      amount: p.amount,
      type: p.type || 'order',
      metadata: p.metadata || {},
      timestamp: p.createdAt.toISOString().replace('T', ' ').slice(0, 19),
      time: p.createdAt.toISOString().replace('T', ' ').slice(0, 19)
    }));
    res.json(transformed);
  } catch (err) {
    res.status(500).json([]);
  }
});

// @route   POST /api/admin/approve-payment
router.post('/admin/approve-payment', adminProtect, async (req, res) => {
  try {
    const { req_id } = req.body;
    if (!req_id) return res.status(400).json({ success: false, message: 'req_id is required' });
    
    const verification = await PaymentVerification.findOneAndUpdate(
      { verificationId: req_id },
      { status: 'approved' },
      { new: true }
    );
    
    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification not found' });
    }
    
    // If subscription payment, auto-activate subscription
    if (verification.type === 'subscription' && verification.metadata && verification.metadata.plan) {
      const userName = typeof verification.user === 'object' ? verification.user.name : String(verification.user);
      await User.findOneAndUpdate({ name: userName }, {
        subscription: {
          plan: verification.metadata.plan,
          startDate: new Date(),
          status: 'active'
        }
      });
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
