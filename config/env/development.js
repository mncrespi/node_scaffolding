export default {
	env: 'development',
	db: 'mongodb://localhost/node_scaffolding',
	port: 3000,
  jwt: {
    secret: 'shhhhhhhh',
    expire: 28800, //in Seconds ( 8Hs )
  },
}
