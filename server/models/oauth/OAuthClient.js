import Promise from 'bluebird'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const OAuthClientSchema = new Schema({
  name: String,
  client_id: String,
  client_secret: String,
  redirect_uri: String,
  grant_types: String,
  scope: String,
  User: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  deleted_at: {
    type: Date,
    default: null,
  },
})

/**
 * Methods
 */
OAuthClientSchema.method({
})

/**
 * Statics
 */
OAuthClientSchema.statics = {
  /**
   * Get user by Id
   * @param id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    //console.log(id) // eslint-disable-line no-console
    return this.findById(id)
      .select('-__v -deleted_at')
      .execAsync().then((client) => {
        if (client) {
          return client
        }
        // const err = new APIError('No such user exists!', httpStatus.NOT_FOUND)
        return Promise.reject('No such client exists!')
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
      .populate('User')
      .select('-password -__v -deleted_at')
      .where('deleted_at').equals(null)
      .sort({ created_at: 1, })
      .skip(skip)
      .limit(limit)
      .execAsync()
  },

}
export default mongoose.model('OAuthClient', OAuthClientSchema)

