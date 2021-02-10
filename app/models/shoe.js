const mongoose = require('mongoose')

// require commentSchema
const commentSchema = require('./comment')

const shoeSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  comments: [commentSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  timestamps: true
})

const Shoe = mongoose.model('Shoe', shoeSchema)

module.exports = Shoe
