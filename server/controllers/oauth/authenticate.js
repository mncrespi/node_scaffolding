// import oauthServer from 'oauth2-server'
// const Request = oauthServer.Request
// const Response = oauthServer.Response
import { Request, Response, } from 'oauth2-server'
import oAuth from './oauth'
import APIResponse from '../../helpers/APIStandarResponses'
import logger from '../../../config/winston'


export default function (options) {
  return function (req, res, next) {
    const request = new Request({
      // headers: {
      //   authorization: req.headers.authorization,
      // },
      method: req.method,
      headers: req.headers,
      query: req.query,
      body: req.body,
    })
    const response = new Response(res)

    oAuth.authenticate(request, response, options = {})
      .then((token) => {
        // Request is authorized.
        logger.log('debug', 'Request is authorized::Token::%j', token)
        req.user = token
        next()
      })
      .catch((err) => {
        // Request is not authorized.
        logger.log('debug', 'Request is not authorized::Error::%j', err)
        res.status(err.code || 500).json(APIResponse.error(err.code, err.message, err.name, err.code))
      })
  }
}