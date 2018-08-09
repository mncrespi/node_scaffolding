import Promise from 'bluebird'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const OAuthClientSchema = new Schema({
  name: String,
  clientId: String,
  clientSecret: String, // todo: encode
  redirectUris: [
    String,
  ],
  // grant_types: String,
  grants: [
    String,
  ],
  scope: String,
  User: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshTokenLifetime: String, // Optional, todo: default from config
  accessTokenLifetime: String, // Optional, todo: default from config
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
    //console.log(id) // eslint-disable-line no-console
    return this.findById(id)
      .select('-client_secret')
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
      .populate('User')
      .select('-client_secret')
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
      .select('-client_secret')
      .where('clientId').equals(clientId)
      .where('clientSecret').equals(clientSecret)
      .execAsync()
      .then((client) => {
        if (client)
          return client
        else
          return Promise.reject('No such client exists!')
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

