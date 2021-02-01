const mongoose = require('mongoose')

// require commentSchema
const commentSchema = require('./comment.js')


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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Shoe', shoeSchema)
