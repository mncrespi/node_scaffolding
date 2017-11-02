export default {
	env: 'development',
	db: 'mongodb://localhost/node_scaffolding',
	port: 3000,
  logger: {
    level: 'debug',
    prettyPrint: true,
    logFile: '/var/log/node_scaffolding.log',
  },
  jwt: {
    secret: 'shhhhhhhh',
    expire: 28800, //in Seconds ( 8Hs )
  },
  cookieParser: {
    secret: 'shhhhhhhh',
  },
  redis: {
    host: 'localhost',
    port: 6379,
    password: undefined,
    ttl: 260,
    secret: 'shhhhhhhh',
    cookie: {
      secure: false,
      maxAge: 86400000,
    },
    saveUninitialized: false,
    resave: false,
  },
  cache: {
    prefix: 'cache',
    expire: {
      200: 3600,
      '4xx': 5,
      '5xx': 5,
      xxx: 5,
    },
  },
}
