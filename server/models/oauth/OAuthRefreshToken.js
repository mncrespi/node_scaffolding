import mongoose from 'mongoose'
import logger from '../../../config/winston'

const Schema = mongoose.Schema

// Set mongoose.Promise, http://mongoosejs.com/docs/promises.html
mongoose.Promise = Promise

const OAuthRefreshTokenSchema = new Schema({
  refreshToken: String,
  refreshTokenExpiresAt: Date,
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
      .where('refreshToken').equals(refreshToken)
      .populate('User')
      .populate('OAuthClient')
      .exec()
      .then((refreshToken) => {
        if (refreshToken)
          return {
            user: refreshToken.User,
            client: refreshToken.OAuthClient,
            refreshTokenExpiresAt: refreshToken.refreshTokenExpiresAt,
            refreshToken: refreshToken.refreshToken,
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
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
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
      .where('refreshToken').equals(refreshToken)
      .remove()
      .then((token) => {
        logger.log('debug', 'revokeToken::Then::%j', token)
        return !!token
      })
      .catch((err) => Promise.reject(err))
  },
}


export default mongoose.model('OAuthRefreshToken', OAuthRefreshTokenSchema)
