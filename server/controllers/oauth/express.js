import { Request, Response, } from 'oauth2-server'
import db from '../../models/oauth'
import oauth from './oauth'
import OAuthConfig from '../../../config/oauth'
import APIError from '../../helpers/APIError'
import logger from '../../../config/winston'


// todo: URLs
// todo: Error 503, Invalid Credentials

export default function (app) {
  /**
   * -----------------------------
   * Token Authentication:
   * ------------------------------
   */
  app.all('/oauth2/token', (req, res, next) => {
    const request = new Request(req)
    const response = new Response(res)

    oauth
      .token(request, response)
      .then((token) => {
        return res.json({
          access_token: token.access_token,
          token_type: 'Bearer',
          expires_in: OAuthConfig.options.token.accessTokenLifetime,
          refresh_token: (token.refresh_token),
        })
      })
      .catch((err) => {
        logger.error('Error on /oauth2/token', err.code, err.message, err.name)
        return next(err)
      })
  })

  /**
   * -----------------------------
   * Authorise Code:
   * DOC: http://oauth2-server.readthedocs.io/en/latest/api/oauth2-server.html#authorize-request-response-options-callback
   * DOC: https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2
   * ------------------------------
   */
  app.post('/oauth2/authorise', (req, res, next) => {
    const request = new Request(req)
    const response = new Response(res)

    return oauth.authorize(request, response)
      .then((success) => {
        //  if (req.body.allow !== 'true') return callback(null, false)
        //  return callback(null, true, req.user)
        res.json(success)
      })
      .catch((err) => {
        // res.status(err.code || 500).json(APIResponse.error(err.code, err.message, err.name, err.code))
        return next(err)
      })
  })

  app.get('/oauth2/authorise', (req, res, next) => {
    const {
      client_id = null,
      redirect_uri = null,
    } = req.query

    logger.log('debug', 'oauth2::authorise::client_id:%j::redirect_uri:%j', client_id, redirect_uri)

    db.OAuthClient
      .findOne({
        client_id: client_id,
        redirect_uri: redirect_uri,
      })
      .then((model) => {
        if (!model)
          return next(new APIError(404, 'Invalid Client'))
        else
          return res.json(model)
      })
      .catch((err) => next(err))
  })

  /* Setup the oAuth error handling */
  // expressApp.use(expressApp.oauth.errorHandler())
}