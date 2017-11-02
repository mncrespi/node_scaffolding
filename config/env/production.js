export default {
	env: 'production',
	db: 'mongodb://localhost/node_scaffolding',
	port: 3000,
  logger: {
    level: 'debug',
    prettyPrint: true,
    logFile: '/var/log/node_scaffolding.log',
  },
  jwt: {
    secret: 'shhhhhhhh',
    expire: 3600, //in Seconds ( 1Hs )
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
