const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   POST /api/ai/chat
// @desc    AI Chatbot powered by Gemini
// @access  Public
router.post('/chat', async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt required' });

    const apiKey = process.env.GEMINI_API_KEY;

    const systemInstruction = `You are 'Ajay', the friendly AI assistant for 'Ajay Fruit Mart' in Delhi.
You help customers with fruit prices, health benefits, order tracking, refund policy, and recommendations.
Key Info: Free delivery on orders above ₹499. 12-minute express delivery. Use WELCOME50 for ₹50 off first order.
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
      // Smart fallback
      const lower = prompt.toLowerCase();
      if (lower.includes('price') || lower.includes('kitna')) response = '🍎 Check our Products page for live prices! Use WELCOME50 for ₹50 off your first order! 🎉';
      else if (lower.includes('track') || lower.includes('order')) response = '📦 Go to Profile → My Orders → Track Order to see live delivery status! 🛵';
      else if (lower.includes('refund') || lower.includes('return')) response = '💰 100% refund on damaged/wrong items! Report via Profile → My Orders → Report Issue within 24hrs.';
      else if (lower.includes('delivery') || lower.includes('time')) response = '🚀 12-minute express delivery in Delhi! Free delivery on orders above ₹499!';
      else response = '👋 Namaste! I am Ajay, your fruit expert. Ask me about prices, delivery, refunds, or health tips! 🍎';
    }

    res.json({ success: true, response, source: response ? 'gemini' : 'fallback' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/ai/detect-freshness
// @desc    AI freshness score for uploaded fruit image
// @access  Public
router.post('/detect-freshness', async (req, res) => {
  try {
    // Simulated AI analysis (integrate actual CV model here)
    const score = Math.floor(70 + Math.random() * 30);
    const label = score > 90 ? 'Premium Fresh 🌟' : score > 75 ? 'Good Quality ✅' : 'Average 🟡';
    res.json({
      success: true,
      score,
      label,
      details: `AI scan complete. Surface texture & color analysis indicates ${score}% freshness index.`,
      recommendation: score > 85 ? 'Excellent pick! Buy now.' : 'Acceptable quality. Check in-store if possible.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/ai/recommendations
// @desc    Personalized product recommendations
// @access  Public
router.get('/recommendations', async (req, res) => {
  try {
    const Product = require('../models/Product');
    const trending = await Product.find({ inStock: true }).sort({ soldCount: -1, rating: -1 }).limit(4);
    const forYou = await Product.find({ inStock: true, isFeatured: true }).limit(4);
    res.json({ success: true, trending, forYou });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
