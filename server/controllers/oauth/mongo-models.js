/**
 * DOC: https://oauth2-server.readthedocs.io/en/latest/model/spec.html#model-specification
 * todo: verify methods
 * todo: Errors
 */

import _ from 'lodash'
import bcrypt from 'bcrypt'
import logger from '../../../config/winston'
import moment from 'moment'
import { OAuthAccessToken, OAuthAuthorizationCode, OAuthClient, OAuthRefreshToken, User, } from '../../models/oauth'


/**
 * Invoked to generate a new access token.
 * This model function is optional. If not implemented, a default handler is used that generates access tokens
 * consisting of 40 characters in the range of a..z0..9.
 * Return A String to be used as access token.
 *
 * Invoked during: authorization_code grant, client_credentials grant, refresh_token grant, password grant
 *
 * @param client
 * @param user
 * @param scope
 */
// function generateAccessToken(client, user, scope) {}


/**
 * Invoked to generate a new refresh token.
 * This model function is optional. If not implemented, a default handler is used that generates refresh tokens
 * consisting of 40 characters in the range of a..z0..9.
 * Returns A String to be used as refresh token.
 *
 * Invoked during: authorization_code grant, refresh_token grant, password grant,
 *
 * @param client
 * @param user
 * @param scope
 */
// function generateRefreshToken(client, user, scope) {}


/**
 * Invoked to generate a new authorization code.
 * This model function is optional. If not implemented, a default handler is used that generates authorization codes
 * consisting of 40 characters in the range of a..z0..9.
 * Returns A String to be used as authorization code.
 *
 * Invoked during: authorization_code grant}
 *
 * @param client
 * @param user
 * @param scope
 */

// function generateAuthorizationCode(client, user, scope) {}


/**
 * Invoked to retrieve an existing access token previously saved through Model#saveToken().
 * This model function is required if OAuth2Server#authenticate() is used.
 * Returns A String to be used as access token.
 *
 * Invoked during: request authentication
 *
 * @param bearerToken
 * @returns {Object<token>}
 */
function getAccessToken(bearerToken) {
  logger.log('debug', 'getAccessToken  %j', bearerToken)
  return OAuthAccessToken
    .findOne({ access_token: bearerToken, })
    .where('expires').gt(moment())
    .populate('User')
    .populate('OAuthClient')
    .then((accessToken) => {
      if (!accessToken) return false
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
      return err
    })
}


/**
 * Invoked to retrieve an existing refresh token previously saved through Model#saveToken().
 * This model function is required if the refresh_token grant is used.
 * Returns An Object representing the refresh token and associated data.
 *
 * Invoked during: refresh_token grant
 *
 * @param refreshToken - The access token to retrieve.
 * @returns {Object<refreshToken>}
 */
function getRefreshToken(refreshToken) {
  logger.log('debug', 'getRefreshToken %j', refreshToken)
  if (!refreshToken) return false
  return OAuthRefreshToken
    .findOne({
      refresh_token: refreshToken,
    })
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
      return err
    })
}


/**
 * Invoked to retrieve an existing authorization code previously saved through Model#saveAuthorizationCode().
 * This model function is required if the authorization_code grant is used.
 * Returns An Object representing the authorization code and associated data.
 *
 * Invoked during: authorization_code grant
 *
 * @param code
 * @returns {Object<code>}
 */
function getAuthorizationCode(code) {
  logger.log('debug', 'getAuthorizationCode %j', code)
  return OAuthAuthorizationCode
    .findOne({ authorization_code: code, })
    // todo: review condition
    .where('expires').gt(moment())
    .populate('User')
    .populate('OAuthClient')
    .then((authCodeModel) => {
      if (!authCodeModel) return false
      const client = authCodeModel.OAuthClient
      const user = authCodeModel.User
      return {
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


/**
 * Invoked to retrieve a client using a client id or a client id/client secret combination, depending on the grant type.
 * This model function is required for all grant types.
 * Returns An Object representing the client and associated data
 *
 * Invoked during: authorization_code grant, client_credentials grant, implicit grant, refresh_token grant, password grant
 *
 * @param clientId - The client id of the client to retrieve.
 * @param clientSecret - The client secret of the client to retrieve. Can be null.
 * @returns {Object<Client>}
 */
function getClient(clientId, clientSecret) {
  logger.log('debug', 'getClient  clientId %j, clientSecret %j', clientId, clientSecret)
  const options = { client_id: clientId, }
  if (clientSecret) options.client_secret = clientSecret

  return OAuthClient
    .findOne(options)
    .then((client) => {
      if (!client) return new Error('client not found')
      const clientWithGrants = client
      // todo: set grants from config file
      clientWithGrants.grants = [
        'authorization_code',
        'password',
        'refresh_token',
        'client_credentials',
      ]
      // todo: if you need create another table for redirect URIs, create here.
      clientWithGrants.redirectUris = [clientWithGrants.redirect_uri]  //eslint-disable-line comma-dangle
      delete clientWithGrants.redirect_uri
      // todo: set vars from config
      //clientWithGrants.refreshTokenLifetime = integer optional
      //clientWithGrants.accessTokenLifetime  = integer optional
      return clientWithGrants
    })
    .catch((err) => {
      logger.error('getClient - Err: ', err)
      return err
    })
}


/**
 * Invoked to retrieve a user using a username/password combination.
 * This model function is required if the password grant is used.
 * Returns Node-style callback to be used instead of the returned Promise.
 *
 * Invoked during: password grant
 *
 * @param username - The username of the user to retrieve.
 * @param password - The user’s password.
 * @returns {Promise<User>}
 */
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
      return err
    })
}


/**
 * Invoked to retrieve the user associated with the specified client.
 * This model function is required if the client_credentials grant is used.
 * Returns An Object representing the user, or a falsy value if the client does not have an associated user,
 * the user object is completely transparent to oauth2-server and is simply used as input to other model functions.
 *
 * Invoked during: client_credentials grant
 *
 * @param client
 * @returns {Object<User>}
 */
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
      return client.User
    })
    .catch((err) => {
      logger.error('getUserFromClient - Err: ', err)
      return err
    })
}


/**
 * Invoked to save an access token and optionally a refresh token, depending on the grant type.
 * This model function is required for all grant types.
 * Returns An Object representing the token(s) and associated data.
 *
 * Invoked during: authorization_code grant, client_credentials grant, implicit grant, refresh_token grant, password grant
 *
 * @param token - The token to be saved.
 * @param client - The client associated with the token.
 * @param user - The user associated with the token.
 * @returns {Object<token>}
 */
function saveToken(token, client, user) {
  logger.log('debug', 'saveToken:: \n\nToken: %j \n\nClient: %j \n\nUser: %j\n\n', token, client, user)
  return Promise
    .all([
      OAuthAccessToken
        .create({
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
      // todo: review validation
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
      return err
    })
}


/**
 * Invoked to save an authorization code.
 * This model function is required if the authorization_code grant is used.
 * Returns An Object representing the authorization code and associated data.
 *
 * Invoked during: authorization_code grant
 *
 * @param code
 * @param client
 * @param user
 * @returns {Object<code>}
 */
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
      return err
    })
}


/**
 * Invoked to revoke a refresh token.
 * This model function is required if the refresh_token grant is used.
 * Returns true if the revocation was successful or false if the refresh token could not be found.
 *
 * Invoked during: refresh_token grant
 *
 * @param token
 * @returns {Boolean}
 */
function revokeToken(token) {
  logger.log('debug', 'revokeToken %j', token)
  return OAuthRefreshToken
    .findOneAndRemove({
      where: {
        refresh_token: token.refreshToken,
      },
    })
    .then((token) => {
      return !!token
    })
    .catch((err) => {
      logger.error('revokeToken - Err: ', err)
      return false
    })

  // return OAuthRefreshToken.findOne({
  //   where: {
  //     refresh_token: token.refreshToken,
  //   },
  // })
  //   .then((rT) => {
  //     if (rT) rT.destroy()
  //     /***
  //      * As per the discussion we need set older date
  //      * revokeToken will expected return a boolean in future version
  //      * https://github.com/oauthjs/node-oauth2-server/pull/274
  //      * https://github.com/oauthjs/node-oauth2-server/issues/290
  //      */
  //     const expiredToken = token
  //     expiredToken.refreshTokenExpiresAt = moment('2015-05-28T06:59:53.000Z')
  //     return expiredToken
  //   })
  //   .catch((err) => {
  //     logger.error('revokeToken - Err: ', err)
  //   })
}


/**
 * Invoked to revoke an authorization code.
 * This model function is required if the authorization_code grant is used.
 * Returns true if the revocation was successful or false if the authorization code could not be found.
 *
 * Invoked during: authorization_code grant
 *
 * @param code
 * @returns {Boolean}
 */
function revokeAuthorizationCode(code) {
  logger.log('debug', 'revokeAuthorizationCode %j', code)
  return OAuthAuthorizationCode
    .findOneAndRemove({
      where: {
        authorization_code: code.code,
      },
    })
    .then((code) => {
      return !!code
    })
    .catch((err) => {
      logger.error('getUser - Err: ', err)
      return false
    })

  // return OAuthAuthorizationCode.findOne({
  //   where: {
  //     authorization_code: code.code,
  //   },
  // }).then((rCode) => {
  //   //if(rCode) rCode.destroy()
  //   /***
  //    * As per the discussion we need set older date
  //    * revokeToken will expected return a boolean in future version
  //    * https://github.com/oauthjs/node-oauth2-server/pull/274
  //    * https://github.com/oauthjs/node-oauth2-server/issues/290
  //    */
  //   const expiredCode = code
  //   expiredCode.expiresAt = new Date('2015-05-28T06:59:53.000Z')
  //   return expiredCode
  // }).catch((err) => {
  //   logger.error('getUser - Err: ', err)
  // })
}


/**
 * Doc: https://oauth2-server.readthedocs.io/en/latest/model/spec.html#verifyscope-accesstoken-scope-callback
 * Invoked to check if the requested scope is valid for a particular client/user combination.
 * This model function is optional. If not implemented, any scope is accepted.
 * Returns Validated scopes to be used or a falsy value to reject the requested scopes.
 *
 * Invoked during: authorization_code grant, client_credentials grant, implicit grant, password grant
 *
 * @param user
 * @param client
 * @param scope
 * @returns {boolean}
 */
function validateScope(user, client, scope) {
  return user.scope === scope
}


/**
 * Invoked during request authentication to check if the provided access token was authorized the requested scopes.
 * This model function is required if scopes are used with OAuth2Server#authenticate().
 * Returns true if the access token passes, false otherwise.
 *
 * Invoked during: request authentication
 *
 * @param token - is the access token object previously obtained through Model#getAccessToken().
 * @param scope - is the required scope as given to OAuth2Server#authenticate() as options.scope.
 * @returns {boolean}
 */
// function verifyScope(accessToken, scope) {}


export default {
  // generateAccessToken, // optional - used for jwt
  // generateRefreshToken, // optional
  // generateAuthorizationCode, // optional
  getAccessToken,
  getRefreshToken,
  getAuthorizationCode, //getOAuthAuthorizationCode renamed to,
  getClient,
  getUser,
  getUserFromClient,
  saveToken,
  saveAuthorizationCode,
  revokeToken,
  revokeAuthorizationCode,
  validateScope,
  // verifyScope
}
