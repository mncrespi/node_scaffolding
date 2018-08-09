import Promise from 'bluebird'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const OAuthClientSchema = new Schema({
  name: String,
  client_id: String,
  client_secret: String, // todo: encode
  redirect_uri: String,
  grant_types: String,
  scope: String,
  User: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
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
   * getOAuthClient by client_id and client_secret
   * @param client_id client_secret - The objectId of user.
   * @param client_secret - The objectId of user.
   * @returns {Promise<OAuthClient, APIError>}
   */
  getOAuthClient({ client_id, client_secret, } = {}) {
    return this.findOne()
      .select('-client_secret')
      .where('client_id').equals(client_id)
      .where('client_secret').equals(client_secret)
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
   * Get User by client_id
   * @param clientId - ObjectId
   * @returns {Promise<User, APIError>}
   */
  getUserFromClient(clientId) {
    return this.findOne()
      .where('client_id').equals(clientId)
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

