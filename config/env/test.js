export default {
	env: 'test',
	db: 'mongodb://localhost/node_scaffolding_test',
	port: 3000,
  logger: {
    level: 'debug',
    prettyPrint: true,
    logFile: '/var/log/node_scaffolding-test.log',
  },
  jwt: {
    secret: 'shhhhhhhh',
    expire: 3600, //in Seconds ( 1Hs )
  },
  cookieParser: {
    secret: 'shhhhhhhh',
  },
}
