import db from '../../models/oauth/index'
import oauth from './oauth'
import APIError from '../../helpers/APIError'
import logger from '../../../config/winston'
import { Request, Response, } from 'oauth2-server'
// import moment from 'moment'

// todo: URLs
// todo: Error 503, Invalid Credentials

export default function (app) {
  app.all('/oauth2/token', (req, res, next) => {
    const request = new Request(req)
    const response = new Response(res)

    oauth
      .token(request, response)
      .then((token) => {
        // Get remaining time in seconds
        // const expire_in = moment.duration(moment(token.accessTokenExpiresAt).diff(moment())).asSeconds()

        // todo: config token expires_in
        logger.log('debug', 'UserAuthenticated::%j', token)

        return res.json({
          access_token: token.access_token,
          token_type: 'Bearer',
          expires_in: 3600, // this value is default for oAuth2
          refresh_token: (token.refresh_token),
        })
      })
      .catch((err) => {
      logger.error('Error on /oauth2/token', err.code, err.message, err.name)
      return next(err)
    })
  })

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
    return db.OAuthClient
      .findOne({
        where: {
          client_id: req.query.client_id,
          redirect_uri: req.query.redirect_uri,
        },
        attributes: [
          'id',
          'name',
        ],
      })
      .then((model) => {
        if (!model)
          return next(new APIError(404, 'Invalid Client'))
        else
          return res.json(model)
      })
      .catch((err) => next(err))
  })
}