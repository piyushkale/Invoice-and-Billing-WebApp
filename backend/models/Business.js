const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true
  },
  address: String,
  phone: String,
  gstNumber: String
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);