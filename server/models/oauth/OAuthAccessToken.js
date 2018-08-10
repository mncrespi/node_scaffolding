import mongoose from 'mongoose'

const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const OAuthAccessTokenSchema = new Schema({
  accessToken: {
    type: String,
    required: true,
  },
  accessTokenExpiresAt: {
    type: Date,
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
  OAuthClient: {
    type: Schema.Types.ObjectId,
    ref: 'OAuthClient',
    required: true,
  },
})


/**
 * Statics
 */
OAuthAccessTokenSchema.statics = {
  getAccessToken(token) {
    return this.findOne()
      .where('accessToken').equals(token)
      .populate('User')
      .populate('OAuthClient')
      .exec()
      .then((accessToken) => {
        if (accessToken)
          return accessToken
        else
          return Promise.reject('No such accessToken exists!')
      })
      .catch((err) => Promise.reject(err))
  },

  saveAccessToken(token) {
    return this.create({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      OAuthClient: token.clientId,
      User: token.userId,
      scope: token.scope,
    })
      .then((accessToken) => {
        if (accessToken)
          return accessToken
        else
          return Promise.reject('Error saving accessToken!')
      })
      .catch((err) => Promise.reject(err))
  },
}

export default mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema)
