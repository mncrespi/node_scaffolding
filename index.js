import Promise                  from 'bluebird';
import mongoose                 from 'mongoose';
import config                   from './config/env';
import app                      from './config/express';

// promisify mongoose
Promise.promisifyAll(mongoose);

// connect to mongo db
mongoose.connect(config.db, { useMongoClient: true, keepAlive: true, })
mongoose.connection.on('error', () => {
	throw new Error(`unable to connect to database: ${config.db}`);
});

const debug = require('debug')('node_scaffolding:index');

// listen on port config.port
app.listen(config.port, () => {
	debug(`server started on port ${config.port} (${config.env})`);
});

export default app;
