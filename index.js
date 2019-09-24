import Promise from 'bluebird'
import mongoose from 'mongoose'
import dotenv from './config/dotenv.js'
import config from './config/env/index.js'
import app from './config/express.js'
import logger from './config/winston.js'

// Enviroments
if (dotenv.error) {
	logger.log('error', 'Enviroments::Fail to load enviroments')
	throw result.error
}

// promisify mongoose
Promise.promisifyAll(mongoose)

// TODO: Move to mongo config
// connect to mongo db
mongoose.connect(config.mongo.host, {
	keepAlive: config.mongo.keepAlive,
	useNewUrlParser: config.mongo.useNewUrlParser,
	// socketTimeoutMS: config.mongo.socketTimeoutMS,
	useCreateIndex: config.mongo.useCreateIndex,
	useUnifiedTopology: config.mongo.useUnifiedTopology,
	// useFindAndModify: config.mongo.useFindAndModify,
	// autoIndex: config.mongo.autoIndex,
	reconnectTries: config.mongo.reconnectTries,
	reconnectInterval: config.mongo.reconnectInterval,
	// poolSize: config.mongo.poolSize
	// bufferMaxEntries: config.mongo.bufferMaxEntries,
	// connectTimeoutMS: config.mongo.connectTimeoutMS,
	// family: config.mongo.family,
}).then(() => {
	logger.info('Mongoose Connect OK')
}).catch(() => {
	logger.error('Mongoose Connect ERROR')
})

mongoose.connection.on('error', () => {
	throw new Error(`unable to connect to database: ${config.db}`)
})

// listen on port config.port
app.listen(config.port, () => {
	logger.info(`server started on port ${config.port} (${config.env})`)
})

export default app