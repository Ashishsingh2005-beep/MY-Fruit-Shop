const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with filters, sorting, search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, inStock } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (inStock === 'true') query.inStock = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortOption = {};
    switch (sort) {
      case 'price_asc': sortOption = { price: 1 }; break;
      case 'price_desc': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { rating: -1 }; break;
      case 'popular': sortOption = { soldCount: -1 }; break;
      default: sortOption = { isFeatured: -1, rating: -1 };
    }

    // Apply dynamic pricing (time-based)
    const hour = new Date().getHours();
    const products = await Product.find(query).sort(sortOption);

    const enriched = products.map(p => {
      const obj = p.toJSON();
      let dynamicPrice = obj.price;

      // Evening discount (after 8 PM)
      if (hour >= 20) dynamicPrice = Math.round(dynamicPrice * 0.95);
      // Morning surge (8-10 AM)
      else if (hour >= 8 && hour <= 10) dynamicPrice = Math.round(dynamicPrice * 1.02);

      // Mango summer surge (April-July)
      const month = new Date().getMonth() + 1;
      if (obj.name.toLowerCase().includes('mango') && month >= 4 && month <= 7) {
        dynamicPrice = Math.round(dynamicPrice * 1.08);
      }

      return { ...obj, dynamicPrice, isDynamic: dynamicPrice !== obj.price };
    });

    res.json({ success: true, count: enriched.length, products: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/products/:id/recommendations
// @desc    Content-based recommendations for a product
// @access  Public
router.get('/:id/recommendations', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });

    // Find similar products (same category, similar price range, not same product)
    const similar = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      price: { $gte: product.price * 0.5, $lte: product.price * 2 },
      inStock: true
    }).sort({ rating: -1 }).limit(4);

    res.json({ success: true, recommendations: similar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/products/:id/rate
// @desc    Rate a product
// @access  Private
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Update running average
    const newReviewCount = product.reviewCount + 1;
    const newRating = ((product.rating * product.reviewCount) + rating) / newReviewCount;
    product.rating = Math.round(newRating * 10) / 10;
    product.reviewCount = newReviewCount;
    await product.save();

    res.json({ success: true, rating: product.rating, reviewCount: product.reviewCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
