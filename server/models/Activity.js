const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: { type: String, default: 'Guest' },
  type: { type: String, required: true },
  details: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
