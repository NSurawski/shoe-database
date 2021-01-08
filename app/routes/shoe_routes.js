const express = require('express')
const passport = require('passport')
const Shoe = require('../models/shoe')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// CREATE
// POST /shoes
router.post('/shoes', requireToken, (req, res, next) => {
  // extract the shoe from the incoming requests data (req.body)
  const shoeData = req.body.shoe
  // add user as shoe owner
  shoeData.owner = req.user._id
  // set owner of new example to be current user
  req.body.shoe.owner = req.user.id
// create a shoe using the shoeData
  Shoe.create(shoeData)
    // respond to succesful `create` with status 201 and JSON of new "example"
    .then(shoe => {
      res.status(201).json({ shoe: shoe.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// INDEX
// GET /examples
router.get('/shoes', requireToken, (req, res, next) => {
  // find a shoe using user id
  Shoe.find({ owner: req.user._id })
    // .then(shoes => {
  // `examples` will be an array of Mongoose documents
  // we want to convert each one to a POJO, so we use `.map` to
  // apply `.toObject` to each one
  // return shoes.map(shoe => shoe.toObject())
    // })
    // respond with status 200 and JSON of the examples
    .then(shoes => res.status(200).json({ shoes: shoes }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/shoes/:id', requireToken, removeBlanks, (req, res, next) => {
  const id = req.params.id
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.shoe.owner
  Shoe.findOne({
    _id: id,
    owner: req.user._id
  })
    .then(handle404)
    .then(shoe => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, shoe)

      // pass the result of Mongoose's `.update` to the next `.then`
      return shoe.updateOne(req.body.shoes)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /shoes/:id
router.delete('/shoes/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Shoe.findOne({ _id: id, owner: req.user._id })
    .then(handle404)
    .then(shoe => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, shoe)
      // delete the example ONLY IF the above didn't throw
      shoe.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
