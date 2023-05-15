const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },

    });

module.exports = mongoose.model('Users', bidSchema);
