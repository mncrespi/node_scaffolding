import OauthServer from 'oauth2-server'
import MongoModels from './mongo-models'

export default new OauthServer({
  model: MongoModels,
})
