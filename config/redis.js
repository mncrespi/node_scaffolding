import redis        from 'redis'
import config       from './env'

/** Set Param if not Undefined */
const params = {}
params.host         = (config.redis.host)
params.port         = (config.redis.port)
params.ttl          = (config.redis.ttl)
params.password     = (config.redis.password)


/** Instance Redis-Client */
const client = redis.createClient(params)

export default client