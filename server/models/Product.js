const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  category: { type: String, required: true, enum: ['Fruits', 'Vegetables', 'Exotic', 'Seasonal'], default: 'Fruits' },
  subCategory: { type: String, default: 'Normal' },
  description: { type: String, default: '' },
  color: { type: String, default: '#FF8C00' },
  emoji: { type: String, default: '🍎' },
  unit: { type: String, default: 'kg' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  stockQty: { type: Number, default: 100 },
  tags: [String],
  nutrition: {
    calories: Number,
    vitamin_c: Number,
    fiber: Number,
    protein: Number
  },
  isHot: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  soldCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Calculate discount virtual
ProductSchema.virtual('discount').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
