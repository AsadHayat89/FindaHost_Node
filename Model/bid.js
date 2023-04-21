const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  landlordEmail: {
    type: String,
    required: true,
  },
  propertyId: {
    type: String,
    required: true,
  },
  Email:{
    type: String,
    required: true,
  },
  bid: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    required: true,
     }
    });

module.exports = mongoose.model('Bid', bidSchema);
