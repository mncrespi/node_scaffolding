import mongoose from 'mongoose'
import logger from '../../../config/winston'

const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const OAuthRefreshTokenSchema = new Schema({
  refresh_token: String,
  expires_at: Date,
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
 * Methods
 */
OAuthRefreshTokenSchema.method({})


/**
 * Statics
 */
OAuthRefreshTokenSchema.statics = {
  /**
   *
   * @param refreshToken - refreshToken
   * @returns {Promise<OAuthRefreshToken>}
   */
  getRefreshToken(refreshToken) {
    return this.findOne()
      .where('refresh_token').equals(refreshToken)
      .populate('User')
      .populate('OAuthClient')
      .exec()
      .then((refreshToken) => {
        if (refreshToken)
          return {
            user: refreshToken.User,
            client: refreshToken.OAuthClient,
            refreshTokenExpiresAt: refreshToken.expires_at,
            refreshToken: refreshToken.refresh_token,
            scope: refreshToken.scope,
          }
        else
          return Promise.reject('No such refreshToken exists!')
      })
      .catch((err) => Promise.reject(err))
  },

  saveRefreshToken(token) {
    logger.log('debug', 'model::setRefreshToken::token::%j', token)
    return this.create({
      refresh_token: token.refreshToken,
      expires_at: token.expires_at,
      OAuthClient: token.clientId,
      User: token.userId,
      scope: token.scope,
    })
      .then((refreshToken) => {
        if (refreshToken)
          return refreshToken
        else
          return Promise.reject('Error saving refreshToken!')
      })
      .catch((err) => Promise.reject(err))
  },

  /**
   * revokeToken - Remove used refreshToken
   * @param refreshToken
   * @returns {Boolean}
   */
  revokeToken(refreshToken) {
    return this.findOne()
      .where('refresh_token').equals(refreshToken)
      .remove()
      .then((token) => {
        logger.log('debug', 'revokeToken::Then::%j', token)
        return !!token
      })
      .catch((err) => Promise.reject(err))
  },
}


export default mongoose.model('OAuthRefreshToken', OAuthRefreshTokenSchema)
