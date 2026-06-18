const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Place a new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, pricing, payment, userAddress } = req.body;
    const user = req.user;

    // Validate items and calculate server-side total
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.inStock) {
        return res.status(400).json({ success: false, message: `${item.name} is out of stock` });
      }
      const subtotal = product.price * item.qty;
      calculatedTotal += subtotal;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
        emoji: product.emoji,
        subtotal
      });

      // Update soldCount
      await Product.findByIdAndUpdate(product._id, { $inc: { soldCount: item.qty } });
    }

    // Delivery fee logic
    const deliveryFee = calculatedTotal >= 499 ? 0 : 30;
    const discount = pricing?.discount || 0;
    const finalTotal = calculatedTotal + deliveryFee - discount;

    const order = await Order.create({
      user: user._id,
      userPhone: user.phone,
      userName: user.name,
      userAddress: userAddress || user.address,
      items: orderItems,
      pricing: {
        subtotal: calculatedTotal,
        deliveryFee,
        discount,
        couponCode: pricing?.couponCode,
        total: finalTotal
      },
      payment: {
        method: payment?.method || 'COD',
        status: payment?.method === 'COD' ? 'Pending' : 'Pending'
      },
      delivery: {
        status: 'Processing',
        estimatedTime: 30
      }
    });

    // Update user stats
    await User.findByIdAndUpdate(user._id, {
      $inc: { totalOrders: 1, totalSpent: finalTotal },
      lastOrderDate: new Date()
    });

    // Populate product details before sending response
    await order.populate('items.product', 'name emoji');

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/orders/my
// @desc    Get logged-in user's orders
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order (with live tracking)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (['Out for Delivery', 'Delivered'].includes(order.delivery.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel after dispatch' });
    }

    order.delivery.status = 'Cancelled';
    order.payment.status = order.payment.method === 'COD' ? 'Pending' : 'Refunded';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/orders/:id/complaint
// @desc    File a complaint for an order
// @access  Private
router.post('/:id/complaint', protect, async (req, res) => {
  try {
    const { type, description } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.complaint = { type, description, status: 'Open' };
    await order.save();

    res.json({ success: true, message: 'Complaint filed. We will contact you within 24 hours.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/orders/:id/rate
// @desc    Rate a delivered order
// @access  Private
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.rating = rating;
    order.feedback = feedback;
    await order.save();

    res.json({ success: true, message: 'Thank you for your feedback!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
