import Promise from 'bluebird'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

/* eslint-disable */
const OAuthClientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
  redirectUris: {
    type: [String],
    required: true,
  },
  grants: {
    type: [String],
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
  User: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refreshTokenLifetime: { // Optional, todo: default from config
    type: String,
    required: true,
  },
  accessTokenLifetime: { // Optional, todo: default from config
    type: String,
    required: true,
  },
})
/* eslint-enable */


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
OAuthClientSchema.pre('save', function (next) {
  const client = this
  if (this.isModified('clientSecret') || this.isNew)
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err)
      bcrypt.hash(client.clientSecret, salt, (err, hash) => {
        if (err) return next(err)
        client.clientSecret = hash
        next()
      })
    })
  else
    return next()
})


/**
 * Methods
 */
OAuthClientSchema.method({})


/**
 * Statics
 */
OAuthClientSchema.statics = {
  /**
   * Get user by Id
   * @param id - The objectId of user.
   * @returns {Promise<OAuthClient, APIError>}
   */
  get(id) {
    return this.findById(id)
      .select('-clientSecret')
      .execAsync()
      .then((client) => {
        if (client)
          return client
        else
          return Promise.reject('No such client exists!')
      })
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<OAuthClient[]>}
   */
  list({ skip = 0, limit = 50, } = {}) {
    return this.find()
      .select('-clientSecret')
      .populate('User')
      .sort({ created_at: 1, })
      .skip(skip)
      .limit(limit)
      .execAsync()
  },

  /**
   * getOAuthClient by clientId and clientSecret
   * @param clientId client_secret - The objectId of user.
   * @param clientSecret - The objectId of user.
   * @returns {Promise<OAuthClient, APIError>}
   */
  getOAuthClient({ clientId, clientSecret, } = {}) {
    return this.findOne()
      .where('clientId').equals(clientId)
      .execAsync()
      .then((client) => {
        if (bcrypt.compareSync(clientSecret, client.clientSecret)) {
          const data = client
          delete data.clientSecret
          return data
        } else {
          return Promise.reject('No such client exists!')
        }
      })
      .catch((e) => Promise.reject(e))
  },

  /**
   * Get User by clientId
   * @param clientId - ObjectId
   * @returns {Promise<User, APIError>}
   */
  getUserFromClient(clientId) {
    return this.findOne()
      .select('-clientSecret')
      .where('clientId').equals(clientId)
      .populate('User')
      .execAsync()
      .then((client) => {
        if (client && client.User)
          return client.User
        else
          return Promise.reject('No such User exists!')
      })
      .catch((e) => Promise.reject(e))
  },

}
export default mongoose.model('OAuthClient', OAuthClientSchema)

