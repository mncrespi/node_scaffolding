import { Request, Response, } from 'oauth2-server'
import oAuth from './oauth'
import logger from '../../../config/winston'


/**
 * Authentication Middleware
 * @param options
 * @returns {Function}
 */
export default function (options) {
  return function (req, res, next) {
    const request = new Request(req)
    const response = new Response(res)

    oAuth.authenticate(request, response, options = {})
      .then((token) => {
        // Request is authorized.
        logger.log('silly', 'Request is authorized::Token::%j', token)
        req.user = token
        return next()
      })
      .catch((err) => {
        // Request is not authorized.
        logger.log('silly', 'Request is not authorized::Error::%j', err)
        return next(err)
      })
  }
}