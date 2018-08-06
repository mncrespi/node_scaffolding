import _ from 'lodash'
import mongodb from '../../models/oauth'
import bcrypt from 'bcrypt'
import logger from '../../../config/winston'
import moment from 'moment'

const User = mongodb.User
const OAuthClient = mongodb.OAuthClient
const OAuthAccessToken = mongodb.OAuthAccessToken
const OAuthAuthorizationCode = mongodb.OAuthAuthorizationCode
const OAuthRefreshToken = mongodb.OAuthRefreshToken

function getAccessToken(bearerToken) {
  logger.log('debug', 'getAccessToken  %j', bearerToken)
  return OAuthAccessToken
  //User,OAuthClient
    .findOne({ access_token: bearerToken, })
    .where('expires').gt(moment())
    .populate('User')
    .populate('OAuthClient')
    .then((accessToken) => {
      if (!accessToken) return false
      logger.log('debug', 'accessToken.User %j', accessToken.User)
      logger.log('debug', 'accessToken.OAuthClient %j', accessToken.OAuthClient)

      /* // Original Code
      const token = accessToken
      token.user = token.User
      token.client = token.OAuthClient
      token.scope = token.scope
      token.accessTokenExpiresAt = token.expires // 'accessTokenExpiresAt' is being stored as 'expires'
      */

      const token = {}

      token.access_token = accessToken.access_token
      token.user = accessToken.User
      token.client = accessToken.OAuthClient
      token.scope = accessToken.scope
      token.expires = accessToken.expires
      token.accessTokenExpiresAt = accessToken.expires

      logger.log('debug', 'getAccessToken::token')
      logger.log('debug', 'getAccessToken::token::%j', token)
      logger.log('debug', 'getAccessToken::accessToken::%j', accessToken)
      return token
    })
    .catch((err) => {
      logger.error('getAccessToken - Err: ', err)
    })
}

function getClient(clientId, clientSecret) {
  logger.log('debug', 'getClient  clientId %j, clientSecret %j', clientId, clientSecret)
  const options = { client_id: clientId, }
  if (clientSecret) options.client_secret = clientSecret

  return OAuthClient
    .findOne(options)
    .then((client) => {
      if (!client) return new Error('client not found')
      const clientWithGrants = client
      // todo: move grantTypes to config file or db
      clientWithGrants.grants = [
        'authorization_code',
        'password',
        'refresh_token',
        'client_credentials',
      ]
      // todo: if you need create another table for redirect URIs, create here.
      clientWithGrants.redirectUris = [clientWithGrants.redirect_uri]  //eslint-disable-line comma-dangle
      delete clientWithGrants.redirect_uri
      //clientWithGrants.refreshTokenLifetime = integer optional
      //clientWithGrants.accessTokenLifetime  = integer optional
      return clientWithGrants
    })
    .catch((err) => {
      logger.error('getClient - Err: ', err)
    })
}

function getUser(username, password) {
  return User
    .findOne({ username: username, })
    .then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        return user
      } else {
        return false
      }
    })
    .catch((err) => {
      logger.error('getUser - Err: ', err)
    })
}

function revokeAuthorizationCode(code) {
  logger.log('debug', 'revokeAuthorizationCode %j', code)
  return OAuthAuthorizationCode.findOne({
    where: {
      authorization_code: code.code,
    },
  }).then((rCode) => {
    //if(rCode) rCode.destroy()
    /***
     * As per the discussion we need set older date
     * revokeToken will expected return a boolean in future version
     * https://github.com/oauthjs/node-oauth2-server/pull/274
     * https://github.com/oauthjs/node-oauth2-server/issues/290
     */
    const expiredCode = code
    expiredCode.expiresAt = new Date('2015-05-28T06:59:53.000Z')
    return expiredCode
  }).catch((err) => {
    logger.error('getUser - Err: ', err)
  })
}

function revokeToken(token) {
  logger.log('debug', 'revokeToken %j', token)
  return OAuthRefreshToken.findOne({
    where: {
      refresh_token: token.refreshToken,
    },
  }).then((rT) => {
    if (rT) rT.destroy()
    /***
     * As per the discussion we need set older date
     * revokeToken will expected return a boolean in future version
     * https://github.com/oauthjs/node-oauth2-server/pull/274
     * https://github.com/oauthjs/node-oauth2-server/issues/290
     */
    const expiredToken = token
    expiredToken.refreshTokenExpiresAt = moment('2015-05-28T06:59:53.000Z')
    return expiredToken
  }).catch((err) => {
    logger.error('revokeToken - Err: ', err)
  })
}


function saveToken(token, client, user) {
  logger.log('debug', 'saveToken:: \n\nToken: %j \n\nClient: %j \n\nUser: %j\n\n', token, client, user)
  return Promise.all([
    OAuthAccessToken.create({
      access_token: token.accessToken,
      expires: token.accessTokenExpiresAt,
      OAuthClient: client._id,
      User: user._id,
      scope: token.scope,
    }),
    token.refreshToken ? OAuthRefreshToken.create({ // no refresh token for client_credentials
      refresh_token: token.refreshToken,
      expires: token.refreshTokenExpiresAt,
      OAuthClient: client._id,
      User: user._id,
      scope: token.scope,
    }) : [],
    // token.refreshTokenExpiresAt ? token.refresh_token_expires_at = token.refreshTokenExpiresAt : '',
  ])
    .then((resultsArray) => {
      if (client.User.toString() !== user._id.toString()) {
        logger.error('saveToken :: Invalid User-Client :: clientId %j', client.User)
        logger.error('saveToken :: Invalid User-Client :: userId %j', user._id)
        throw 'saveToken :: Invalid User-Client'
      }

      return _.assign(  // expected to return client and user, but not returning
        {
          client: client,
          user: user,
          access_token: token.accessToken, // proxy
          refresh_token: token.refreshToken, // proxy
        },
        token
      )
    })
    .catch((err) => {
      logger.error('revokeToken - Err: ', err)
    })
}

function getAuthorizationCode(code) {
  logger.log('debug', 'getAuthorizationCode %j', code)
  return OAuthAuthorizationCode
    .findOne({ authorization_code: code, })
    .where('expires').gt(moment())
    .populate('User')
    .populate('OAuthClient')
    .then((authCodeModel) => {
      if (!authCodeModel) return false
      const client = authCodeModel.OAuthClient
      const user = authCodeModel.User
      return reCode = {
        code: code,
        client: client,
        expiresAt: authCodeModel.expires,
        redirectUri: client.redirect_uri,
        user: user,
        scope: authCodeModel.scope,
      }
    })
    .catch(function (err) {
      console.warn('getAuthorizationCode - Err: ', err)
    })
}

function saveAuthorizationCode(code, client, user) {
  logger.log('debug', 'saveAuthorizationCode\n\ncode %j\n\nclient %j\n\nuser %j', code, client, user)
  return OAuthAuthorizationCode
    .create({
      expires: code.expiresAt,
      OAuthClient: client._id,
      authorization_code: code.authorizationCode,
      User: user._id,
      scope: code.scope,
    })
    .then(() => {
      code.code = code.authorizationCode
      return code
    })
    .catch((err) => {
      logger.error('saveAuthorizationCode - Err: ', err)
    })
}

function getUserFromClient(client) {
  logger.log('debug', 'getUserFromClient %j', client)
  const options = { client_id: client.client_id, }
  if (client.client_secret) options.client_secret = client.client_secret

  return OAuthClient
    .findOne(options)
    .populate('User')
    .then((client) => {
      logger.log('debug', 'Client::%j', client)
      if (!client) return false
      if (!client.User) return false
      logger.log('debug', 'Client::OK')
      return client.User
    })
    .catch((err) => {
      logger.error('getUserFromClient - Err: ', err)
    })
}

function getRefreshToken(refreshToken) {
  logger.log('debug', 'getRefreshToken %j', refreshToken)
  if (!refreshToken || refreshToken === 'undefined') return false
//[OAuthClient, User]
  return OAuthRefreshToken
    .findOne({ refresh_token: refreshToken, })
    .where('expires').gt(moment())
    .populate('User')
    .populate('OAuthClient')
    .then((savedRT) => {
      logger.log('silly', 'srt', savedRT)
      return {
        user: savedRT ? savedRT.User : {},
        client: savedRT ? savedRT.OAuthClient : {},
        refreshTokenExpiresAt: savedRT ? moment(savedRT.expires) : null,
        refresh_token_expires_at: savedRT ? moment(savedRT.expires) : null,
        refreshToken: refreshToken,
        refresh_token: refreshToken,
        scope: savedRT.scope,
      }
    })
    .catch((err) => {
      logger.error('getRefreshToken - Err: ', err)
    })
}

// Not Work
// function validateScope(token, scope) {
//   logger.log('debug', 'validateScope', token, scope)
//   return token.scope === scope
// }

function validateScope(user, client, scope) {
  return user.scope === scope
}


export default {
  //generateOAuthAccessToken, optional - used for jwt
  //generateAuthorizationCode, optional
  //generateOAuthRefreshToken, - optional
  getAccessToken,
  getAuthorizationCode, //getOAuthAuthorizationCode renamed to,
  getClient,
  getRefreshToken,
  getUser,
  getUserFromClient,
  //grantTypeAllowed, Removed in oauth2-server 3.0
  revokeAuthorizationCode,
  revokeToken,
  saveToken, //saveOAuthAccessToken, renamed to
  saveAuthorizationCode, //renamed saveOAuthAuthorizationCode,
  validateScope,
}
