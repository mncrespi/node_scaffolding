/**
 * oAuth2-Server:
 *
 * NPM: https://www.npmjs.com/package/oauth2-server
 * DOC: https://oauth2-server.readthedocs.io
 */

import OauthServer from 'oauth2-server'
import models from './mongo-models'

export default new OauthServer({
  model: models,
})
