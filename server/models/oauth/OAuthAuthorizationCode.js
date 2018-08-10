import mongoose from 'mongoose'

const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const OAuthAuthorizationCodeSchema = new Schema({
  authorizationCode: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  redirectUri: {
    type: String,
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
OAuthAuthorizationCodeSchema.statics = {
  getAuthorizationCode(code) {
    return this.findOne()
      .where('authorizationCode').equals(code)
      .populate('User')
      .populate('OAuthClient')
      .then((authCode) => {
        if (authCode)
          return authCode
        else
          return Promise.reject('No such Authorization Code exists!')
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },

  saveAuthorizationCode(code) {
    return this.create(code)
      .then((authCode) => {
        if (authCode)
          return authCode
        else
          return Promise.reject('Error saving accessToken!')
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },

  removeAuthorizationCode(code) {
    return this.findOne()
      .where('authorizationCode').equals(code)
      .remove()
      .then((authCode) => {
        if (authCode)
          return !!authCode
        else
          return Promise.reject('Error saving accessToken!')
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },
}

export default mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCodeSchema)

