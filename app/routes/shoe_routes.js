const express = require('express')
const passport = require('passport')
const Shoe = require('../models/shoe')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', {
  session: false
})
const router = express.Router()

// CREATE
// POST /shoes
router.post('/shoes', requireToken, (req, res, next) => {
  const shoeData = req.body.shoe
  shoeData.owner = req.user._id
  req.body.shoe.owner = req.user.id
  Shoe.create(shoeData)
    .then(shoe => {
      res.status(201).json({
        shoe: shoe.toObject()
      })
    })
    .catch(next)
})

// INDEX
// GET /shoes
router.get('/shoes', requireToken, (req, res, next) => {
  const ownerId = req.user._id
  Shoe.find({
    owner: ownerId
  })
    .then(shoes => {
      return shoes.map(shoe => shoe.toObject())
    })
    .then(shoes => res.status(200).json({
      shoes: shoes
    }))
    .catch(next)
})

// UPDATE
// PATCH /shoes/:id
router.patch('/shoes/:id', requireToken, removeBlanks, (req, res, next) => {
  const id = req.params.id
  delete req.body.shoe.owner
  Shoe.findOne({
    _id: id,
    owner: req.user._id
  })
    .then(handle404)
    .then(shoe => {
      requireOwnership(req, shoe)
      return shoe.updateOne(req.body.shoe)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /shoes/:id
router.delete('/shoes/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Shoe.findById({
    _id: id,
    owner: req.user._id
  })
    .then(handle404)
    .then(shoe => {
      requireOwnership(req, shoe)
      shoe.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
