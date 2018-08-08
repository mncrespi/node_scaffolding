/**
 * oAuth2-Server:
 *
 * NPM: https://www.npmjs.com/package/oauth2-server
 * DOC: https://oauth2-server.readthedocs.io
 */

import OAuth2Server from 'oauth2-server'
import models from './mongo-models'
import OAuthConfig from '../../../config/oauth'
import { assign, } from 'lodash'

const OAuth2ServerConfig = {
  model: models,
}

// Assign Global Options
assign(OAuth2ServerConfig, OAuthConfig.options.server)


export default new OAuth2Server(OAuth2ServerConfig)

