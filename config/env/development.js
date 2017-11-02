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
}
