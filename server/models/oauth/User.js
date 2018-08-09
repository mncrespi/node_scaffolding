import Promise from 'bluebird'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import logger from './../../../config/winston'
import moment from 'moment'


const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    match: [
      /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/,
      'The value of path {PATH} ({VALUE}) is not a valid email.',
    ],
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    match: [
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 'The value of path {PATH} ({VALUE}) is not a valid password.',
    ],
  },
  scope: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    default: moment(),
  },
  updated_at: {
    type: Date,
    default: null,
  },
})


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

UserSchema.pre('save', function (next) {
  logger.log('debug', 'el presave trae problemas')
  const user = this
  if (this.isModified('password') || this.isNew) {
    logger.log('debug', 'modificado password')
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    logger.log('debug', 'no modificado password')
    return next()
  }
})


/**
 * Methods
 */
UserSchema.method({})

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user by Id
   * @param id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .select('-password')
      .execAsync()
      .then((user) => {
        if (user)
          return user
        else
          return Promise.reject('No such user exists!')
      })
      .catch((err) => Promise.reject(err))
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50, } = {}) {
    return this.find()
      .select('-password')
      .where('deleted_at').equals(null)
      .sort({ created_at: 1, })
      .skip(skip)
      .limit(limit)
      .execAsync()
  },

  /**
   * Get User by username, password
   * @param username
   * @param password
   * @returns {Promise<User>}
   */
  getUser(username, password) {
    return this.findOne()
      .where('username').equals(username)
      .then((user) => {
        if (bcrypt.compareSync(password, user.password)) {
          const data = user
          delete data.password
          return data
        } else {
          return Promise.reject('No such user exists!')
        }
      })
      .catch((err) => Promise.reject(err))
  },
}

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema)
