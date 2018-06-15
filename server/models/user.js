import bcrypt from 'bcrypt'
import moment from 'moment'
import mongoose from 'mongoose'
import Promise from 'bluebird'
import APIError from '../helpers/APIError'


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
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'The value of path {PATH} ({VALUE}) is not a valid password.',
    ],
  },
  mobile_number: {
    type: String,
    required: true,
    match: [
      /^[1-9][0-9]{9}$/,
      'The value of path {PATH} ({VALUE}) is not a valid mobile number.',
    ],
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
  const user = this
  if (this.isModified('password') || this.isNew) {
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
    return next()
  }
})


/**
 * Methods
 */
UserSchema.method({
  comparePassword: function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
      if (err) {
        return cb(err)
      }
      cb(null, isMatch)
    })
  },
})

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
        if (user) {
          return user
        } else {
          const err = APIError(404, 'No such user exists!')
          return Promise.reject(err)
        }
      })
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
      .sort({
        surname: 1,
        name: 1,
        created_at: 1,
      })
      .skip(skip)
      .limit(limit)
      .execAsync()
  },
}

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema)
