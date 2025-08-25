<<<<<<< HEAD
const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  }
});

const adminModel = mongoose.model('Admin', adminSchema);

=======
const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  }
});

const adminModel = mongoose.model('Admin', adminSchema);

>>>>>>> 18b3bb154fe4bc562397050ecc39746c89c3272e
module.exports = adminModel;