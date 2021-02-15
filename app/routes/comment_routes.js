const express = require('express')
const passport = require('passport')

// require errors & handle404
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const Shoe = require('../models/shoe')
// const Comment = require('../models/comment')

const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE comment
// POST /comments
router.post('/comments', requireToken, (req, res, next) => {
  const commentData = req.body.comment
  commentData.owner = req.user
  const shoeId = req.body.shoe.id
  Shoe.findById(shoeId)
    .then(handle404)
    .then(shoe => {
      shoe.comments.push(commentData)
      return shoe.save()
    })
    .then((shoe) => res.status(201).json({ shoe: shoe }))
    .catch(next)
})

// DELETE comment
// DELETE /comments/:commentId
router.delete('/comments/:commentId', requireToken, (req, res, next) => {
  // const commentData = req.body.comment
  // Shoe.findById({
  //   commentId: req.params.commentId, owner: req.user.commentId
  // })
  //   .then(handle404)
  //   .then((shoe) => requireOwnership(req, shoe))
  //   .then(shoe => {
  //     shoe.comments.deleteOne(commentData)
  //   })
  //   .then(() => res.sentStatus(201))
  //   .catch(next)
  const commentId = req.params.commentId
  const shoeId = req.body.shoe.id
  Shoe.findById(shoeId)
    .then(handle404)
    .then(shoe => {
      const comment = shoe.comments.id(commentId)
      requireOwnership(req, comment)
      comment.remove()
      return shoe.save()
    })
    .then((shoe) => res.status(201).json({ shoe: shoe }))
    .catch(next)
})

module.exports = router
