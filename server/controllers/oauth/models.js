/**
 * DOC: https://oauth2-server.readthedocs.io/en/latest/model/spec.html#model-specification
 */

import logger from '../../../config/winston'
import { OAuthAccessToken, OAuthAuthorizationCode, OAuthClient, OAuthRefreshToken, User, } from '../../models/oauth'
import OAuthConfig from '../../../config/oauth'
import { assign, } from 'lodash'

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
    .getAccessToken(bearerToken)
    .then((accessToken) => {
      const token = {}

      token.accessToken = accessToken.accessToken
      token.user = accessToken.User
      token.client = accessToken.OAuthClient
      token.scope = accessToken.scope
      token.accessTokenExpiresAt = accessToken.accessTokenExpiresAt

      logger.log('debug', 'getAccessToken::token')
      logger.log('debug', 'getAccessToken::token::%j', token)
      logger.log('debug', 'getAccessToken::accessToken::%j', accessToken)

      return token
    })
    .catch((err) => {
      logger.log('debug', 'getAccessToken - Err: ', err)
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
  return OAuthRefreshToken
    .getRefreshToken(refreshToken)
    .then((token) => {
      logger.log('debug', '\n\ngetRefreshToken::%j\n\n', token)
      return token
    })
    .catch((err) => {
      logger.log('debug', 'getRefreshToken - Err: ', err)
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
    .getAuthorizationCode(code)
    .then((authCode) => {
      const client = authCode.OAuthClient
      const user = authCode.User
      return {
        code: code,
        client: client,
        expiresAt: authCode.expiresAt,
        redirectUri: authCode.redirectUri,
        user: user,
        scope: authCode.scope,
      }
    })
    .catch((err) => {
      logger.log('debug', 'getAuthorizationCode - Err: ', err)
      return err
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
  // const options = {
  //   client_id: (clientId),
  //   client_secret: (clientSecret),
  // }

  return OAuthClient
    .getOAuthClient({ clientId, clientSecret, })
    .then((v) => {
      const client = v

      // Set Grants
      // clientWithGrants.grants = OAuthConfig.grants

      // Redirect Uris
      // If you create another table for redirect URIs, you need modify this line:
      /*
      clientWithGrants.redirectUris = [
        clientWithGrants.redirect_uri,
        clientWithGrants.redirectUri,
      ]

      // delete clientWithGrants.redirect_uri
      // delete clientWithGrants.redirectUri
      */

      // Set default Grants
      client.grants = (client.grants) ? client.grants : OAuthConfig.grants

      // Set default accessTokenLifetime
      client.accessTokenLifetime = (client.accessTokenLifetime) ?
        client.accessTokenLifetime : OAuthConfig.options.token.accessTokenLifetime

      // Set default refreshTokenLifetime
      client.refreshTokenLifetime = (client.refreshTokenLifetime) ?
        client.refreshTokenLifetime : OAuthConfig.options.token.refreshTokenLifetime

      return client
    })
    .catch((err) => {
      logger.log('debug', 'getClient - Err: ', err)
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
    .getUser(username, password)
    .then((user) => user)
    .catch((err) => {
      logger.log('debug', 'getUser - Err: ', err)
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
  const { clientId, } = client

  return OAuthClient
    .getUserFromClient(clientId)
    .then((user) => {
      logger.log('debug', 'getUserFromClient::User::%j', user)
      return user
    })
    .catch((err) => {
      logger.log('debug', 'getUserFromClient - Err: ', err)
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
  const l = [
    // Create AccessToken
    OAuthAccessToken
      .saveAccessToken({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        clientId: client._id,
        userId: user._id,
        scope: token.scope,
      }),
  ]

  // Create AccessToken for password grant
  if (token.refreshToken)
    l.push(OAuthRefreshToken.saveRefreshToken({
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      clientId: client._id,
      userId: user._id,
      scope: token.scope,
    }))

  return Promise
    .all(l)
    .then((resultsArray) => {
      return assign(  // expected to return client and user, but not returning
        {
          client: client,
          user: user,
          accessToken: token.accessToken, // proxy
          refreshToken: token.refreshToken, // proxy
        },
        token
      )
    })
    .catch((err) => {
      logger.log('debug', 'revokeToken - Err: ', err)
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
  logger.log('debug', 'saveAuthorizationCode\ncode %j\nclient %j\nuser %j', code, client, user)
  return OAuthAuthorizationCode
    .saveAuthorizationCode({
      expiresAt: code.expiresAt,
      OAuthClient: client._id,
      redirectUri: client.redirectUris[0], // todo: get Authorization RedirectUri
      authorizationCode: code.authorizationCode,
      User: user._id,
      scope: code.scope,
    })
    .then(() => {
      code.code = code.authorizationCode
      return code
    })
    .catch((err) => {
      logger.log('debug', 'saveAuthorizationCode - Err: ', err)
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
    .revokeToken(token.refreshToken)
    .then((token) => {
      logger.log('debug', 'revokeToken::Then::%j', token)
      return token
    })
    .catch((err) => {
      logger.log('debug', 'revokeToken - Err: ', err)
      return false
    })
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
    .removeAuthorizationCode()
    .then((code) => code)
    .catch((err) => {
      logger.log('debug', 'revokeAuthorizationCode - Err: ', err)
      return false
    })
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
  return (user.scope === scope && client.scope === scope && scope !== null) ? scope : false
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
  getAuthorizationCode,
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
