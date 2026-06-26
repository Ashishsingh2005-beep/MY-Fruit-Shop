const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const http = require('http');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ─── Security & Middleware ──────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' });
app.use('/api/', limiter);

// OTP Rate Limit (stricter)
const otpLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 5, message: 'Too many OTP requests' });
app.use('/api/auth/send-otp', otpLimiter);

// ─── Static Files (Serving original HTML/CSS) ───────────────
const path = require('path');
app.use(express.static(path.join(__dirname, '../')));

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api', require('./routes/compat'));

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'online', timestamp: new Date().toISOString() });
});

// ─── Seed Products (if DB empty) ─────────────────────────────
const Product = require('./models/Product');
const seedProducts = require('./data/products');

const initDB = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(seedProducts);
    console.log(`✅ Seeded ${seedProducts.length} products`);
  }
};
initDB().catch(console.error);

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Ajay Fruit Mart Server running on http://localhost:${PORT}`);
  console.log(`🍎 Open this link in browser to see your website!`);
});

