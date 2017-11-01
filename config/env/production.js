export default {
	env: 'production',
	db: 'mongodb://localhost/node_scaffolding',
	port: 3000,
  jwt: {
    secret: 'shhhhhhhh',
    expire: 3600, //in Seconds ( 1Hs )
  },
}
