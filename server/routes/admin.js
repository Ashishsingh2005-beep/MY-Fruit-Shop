const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Admin Auth Middleware
const adminProtect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      // Also check password-based admin access
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Invalid admin password' });
    }
    const token = jwt.sign({ role: 'admin', id: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get('/stats', adminProtect, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments()
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { 'payment.status': 'Paid' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const pendingOrders = await Order.countDocuments({ 'delivery.status': 'Processing' });
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    res.json({
      success: true,
      stats: { totalOrders, totalUsers, totalProducts, totalRevenue, pendingOrders, todayOrders }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics for charts
// @access  Admin
router.get('/analytics', adminProtect, async (req, res) => {
  try {
    // Revenue per day (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const dayData = await Order.aggregate([
        { $match: { createdAt: { $gte: date, $lte: endDate } } },
        { $group: { _id: null, revenue: { $sum: '$pricing.total' }, orders: { $sum: 1 } } }
      ]);

      last7Days.push({
        date: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        revenue: dayData[0]?.revenue || 0,
        orders: dayData[0]?.orders || 0
      });
    }

    // Order Status Distribution
    const statusDist = await Order.aggregate([
      { $group: { _id: '$delivery.status', count: { $sum: 1 } } }
    ]);

    // Category Sales
    const categorySales = await Order.aggregate([
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'prod' } },
      { $unwind: '$prod' },
      { $group: { _id: '$prod.category', total: { $sum: '$items.subtotal' } } }
    ]);

    // Top 5 Products by revenue
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', revenue: { $sum: '$items.subtotal' }, qty: { $sum: '$items.qty' } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // Payment Method Distribution
    const paymentDist = await Order.aggregate([
      { $group: { _id: '$payment.method', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      analytics: {
        dailyRevenue: last7Days,
        statusDistribution: statusDist,
        categorySales,
        topProducts,
        paymentDistribution: paymentDist
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Admin
router.get('/orders', adminProtect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status && status !== 'All' ? { 'delivery.status': status } : {};

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('user', 'name phone');

    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/orders/:id
// @desc    Update order status
// @access  Admin
router.put('/orders/:id', adminProtect, async (req, res) => {
  try {
    const { deliveryStatus, paymentStatus } = req.body;
    const update = {};
    if (deliveryStatus) update['delivery.status'] = deliveryStatus;
    if (paymentStatus) update['payment.status'] = paymentStatus;
    if (deliveryStatus === 'Delivered') update['delivery.deliveredAt'] = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with RFM segmentation
// @access  Admin
router.get('/users', adminProtect, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    const segmented = users.map(u => {
      const obj = u.toJSON();
      const rfm = obj.rfmScore;
      const total = rfm.r + rfm.f + rfm.m;
      
      let segment = 'Occasional';
      if (total >= 13) segment = 'Champion 🏆';
      else if (total >= 10) segment = 'Loyal 💙';
      else if (total >= 7) segment = 'Potential ⭐';
      else if (rfm.r <= 2 && rfm.f >= 3) segment = 'At Risk ⚠️';
      else if (rfm.f === 1) segment = 'New 🌱';
      
      return { ...obj, segment };
    });

    res.json({ success: true, users: segmented });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/users/:id/ban
// @desc    Ban/Unban user
// @access  Admin
router.put('/users/:id/ban', adminProtect, async (req, res) => {
  try {
    const { isBanned } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/admin/products
// @desc    Add a new product
// @access  Admin
router.post('/products', adminProtect, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Admin
router.put('/products/:id', adminProtect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Admin
router.delete('/products/:id', adminProtect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/complaints
// @desc    Get all complaints
// @access  Admin
router.get('/complaints', adminProtect, async (req, res) => {
  try {
    const complaints = await Order.find({ 'complaint.description': { $exists: true } })
      .select('orderId userName userPhone complaint createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/complaints/:orderId/resolve
// @desc    Resolve a complaint
// @access  Admin
router.put('/complaints/:orderId/resolve', adminProtect, async (req, res) => {
  try {
    const { adminReply } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { 'complaint.status': 'Resolved', 'complaint.adminReply': adminReply },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/demand-forecast
// @desc    AI Demand Forecast (next 7 days)
// @access  Admin
router.get('/demand-forecast', adminProtect, async (req, res) => {
  try {
    // Get actual historical data
    const forecast = [];
    const dowWeights = [1.1, 0.95, 0.9, 1.0, 1.2, 1.4, 1.3];

    // Count avg orders per day from past
    const avgAgg = await Order.aggregate([
      { $group: {
        _id: { $dayOfWeek: '$createdAt' },
        avgOrders: { $avg: 1 },
        count: { $sum: 1 }
      }}
    ]);

    const historical = await Order.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const baseDaily = Math.max(1, historical / 30);

    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dow = date.getDay();

      const predicted = Math.round(baseDaily * dowWeights[dow] * (0.9 + Math.random() * 0.2));
      forecast.push({
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        orders: predicted,
        revenue: predicted * Math.round(300 + Math.random() * 400),
        trend: dow >= 5 ? '↑' : dow >= 4 ? '→' : '↓'
      });
    }

    res.json({ success: true, forecast, baseDaily: Math.round(baseDaily) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
