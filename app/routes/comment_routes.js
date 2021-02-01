const express = require('express')
const passport = require('passport')

// require errors & handle404
const errors = require('../../lib/custom_errors')
const handle404 = errors.handle404

// require shoe model
const Shoe = require('../models/shoe')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE comment
// POST /comments
router.post('/comments', requireToken, (req, res, next) => {
  const commentData = req.body.comment
  commentData.author = req.user._id
  const shoeId = commentData.shoeId
  Shoe.findById(shoeId)
    .populate('owner', '_id email')
    .populate('comments', 'owner content')
    .then(handle404)
    .then(shoe => {
      shoe.comments.push(commentData)
      return shoe.save()
    })
    .then(shoe => {
      const lastCommentPosition = (shoe.comments.length - 1)
      const newComment = shoe.comments[lastCommentPosition]
      return newComment
    })
    .then((newComment) => res.status(201).json({ newComment }))
    .catch(next)
})

// DELETE comment
// DELETE /comments/:commentId
router.delete('/comments/:commentId', requireToken, (req, res, next) => {
  const commentId = req.params.commentId

  // extract post id
  const shoeId = req.body.comment.shoeId

  Shoe.findById(shoeId)
    .then(handle404)
    .then(shoe => {
      // requireOwnership(req, shoe)
      const comment = shoe.comments.id(commentId)

      comment.remove()

      return shoe.save()
    })
    .then(shoe => res.status(201).json({ shoe: shoe }))
    .catch(next)
})

module.exports = router
