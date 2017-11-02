import RedisClient    from './redis'
import RedisCache     from 'express-redis-cache'
import config         from './env'
import logger         from './winston'

/** Set Param if not Undefined */
const params = {}
params.prefix       = (config.cache.prefix) ? config.cache.prefix : 'cache'
params.expire       = (config.cache.expire) ? config.cache.expire : 3600
params.client       = RedisClient

const cache = RedisCache(params)


/** Log Events */
cache.on('message', (message) => {
  logger.info('Config::Cache::Message:%s', message)
})

cache.on('connected', () => {
  logger.info('Config::Cache::Connected')
})

cache.on('disconnected', () => {
  logger.info('Config::Cache::Disconnected')
})

cache.on('error', (error) => {
  logger.error('Config::Cache::Error')
  logger.error(error)
})


export default cache
