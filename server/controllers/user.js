import APIError from '../helpers/APIError.js'
import User from '../models/user.js'
import moment from 'moment'


/**
 * Get user
 * @param {object} req - Request.
 * @param {object} res - Response.
 * @param {function} next - Next Middleware.
 * @return {object} - User Objects
 */
function get(req, res, next) {
  User.get(req.params.userId)
    .then((user) => {
      return res.json(user)
    })
    .catch((e) => {
      const err = APIError(404)
      next(err)
    })
}

/**
 * Create new user
 * @param {object} req - Request.
 * @param {object} res - Response.
 * @param {function} next - Next Middleware.
 * @return {User} - User's Object
 */
function create(req, res, next) {
  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    mobile_number: req.body.mobile_number,
  })

  user.saveAsync()
    .then((savedUser) => res.json(savedUser))
    .catch((e) => next(e))
}

/**
 * Update existing user
 * @param {object} req - Request.
 * @param {object} res - Response.
 * @param {function} next - Next Middleware.
 * @return {User} - User's Object
 */
function update(req, res, next) {
  User.get(req.params.userId)
    .then((user) => {
      user.name = req.body.name
      user.surname = req.body.surname
      user.email = req.body.email
      user.username = req.body.username
      user.password = req.body.password
      user.mobile_number = req.body.mobile_number
      user.updated_at = moment()

      user.saveAsync()
        .then((savedUser) => res.json(savedUser))
        .catch((e) => next(e))
    })
    .catch((e) => {
      const err = APIError(404)
      next(err)
    })
}

/**
 * Get user list.
 * @param {object} req - Request.
 * @param {object} res - Response.
 * @param {function} next - Next Middleware.
 * @return {User[]} - List of User's Objects
 */
function list(req, res, next) {
  const { limit = 50, skip = 0, } = req.query
  User.list({ limit, skip, })
    .then((users) => res.json(users))
    .catch((e) => next(e))
}

/**
 * Delete user.
 * @param {object} req - Request.
 * @param {object} res - Response.
 * @param {function} next - Next Middleware.
 * @return {User} - User Object
 */
function remove(req, res, next) {
  User.get(req.params.userId)
    .then((user) => {
      user.removeAsync()
        .then((deletedUser) => res.json(deletedUser))
        .catch((e) => next(e))
    })
    .catch((e) => {
      const err = APIError(404)
      next(err)
    })
}

export default {
  get,
  create,
  update,
  list,
  remove,
}
