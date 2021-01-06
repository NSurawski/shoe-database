const mongoose = require('mongoose')

const shoeSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Shoe', shoeSchema)
