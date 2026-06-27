const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userPhone: { type: String, required: true },
  userName: { type: String },
  userAddress: { type: String },
  deliveryType: { type: String, enum: ['DELIVERY', 'TAKEAWAY'], default: 'DELIVERY' },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    qty: Number,
    emoji: String,
    subtotal: Number
  }],

  pricing: {
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },

  payment: {
    method: { type: String, enum: ['UPI', 'COD', 'Card', 'Razorpay'], default: 'COD' },
    status: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    transactionId: String,
    paidAt: Date
  },

  delivery: {
    status: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    estimatedTime: { type: Number, default: 30 }, // minutes
    deliveryPerson: {
      name: { type: String, default: 'Rahul Kumar' },
      phone: { type: String, default: '9876543210' },
      vehicle: { type: String, default: 'Bike - DL 01 AB 1234' }
    },
    deliveredAt: Date,
    trackingCoords: [{
      lat: Number,
      lng: Number,
      timestamp: Date
    }]
  },

  rating: { type: Number, min: 1, max: 5 },
  feedback: String,
  complaint: {
    type: String,
    description: String,
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
    adminReply: String
  },

  createdAt: { type: Date, default: Date.now }
});

// Auto-generate orderId before save
OrderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  if (typeof next === 'function') {
    next();
  }
});

module.exports = mongoose.model('Order', OrderSchema);
