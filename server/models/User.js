const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  address: { type: String },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBanned: { type: Boolean, default: false },
  
  // Subscription
  subscription: {
    plan: { type: String, default: null },
    startDate: { type: Date },
    status: { type: String, enum: ['active', 'paused', 'cancelled', null], default: null }
  },
  
  // Stats for ML
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastOrderDate: { type: Date },
  preferredCategories: [String],
  
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

// RFM Scoring Virtual
UserSchema.virtual('rfmScore').get(function () {
  const daysSinceLastOrder = this.lastOrderDate
    ? Math.floor((Date.now() - this.lastOrderDate) / (1000 * 60 * 60 * 24))
    : 999;
  const r = daysSinceLastOrder <= 7 ? 5 : daysSinceLastOrder <= 14 ? 4 : daysSinceLastOrder <= 30 ? 3 : 2;
  const f = this.totalOrders >= 10 ? 5 : this.totalOrders >= 5 ? 4 : this.totalOrders >= 2 ? 3 : 1;
  const m = this.totalSpent >= 5000 ? 5 : this.totalSpent >= 2000 ? 4 : this.totalSpent >= 500 ? 3 : 1;
  return { r, f, m, total: r + f + m };
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
