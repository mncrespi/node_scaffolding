import mongoose from 'mongoose'

const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const OAuthAuthorizationCodeSchema = new Schema({
  authorization_code: String,
  expires_at: Date,
  redirect_uri: String,
  scope: String,
  User: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  OAuthClient: {
    type: Schema.Types.ObjectId,
    ref: 'OAuthClient',
  },
})


/**
 * Statics
 */
OAuthAuthorizationCodeSchema.statics = {
  getAuthorizationCode(code) {
    return this.findOne()
      .where('authorization_code').equals(code)
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
      .where('authorization_code').equals(code)
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

