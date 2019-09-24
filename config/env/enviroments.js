const { env, } = process

export default {
  mongo: {
    host: env.DB_MONGO_HOST,
    keepAlive: env.DB_MONGO_KEEPALIVE,
    useUnifiedTopology: env.DB_MONGO_USEUNIFIEDTOPOLOGY,
    useNewUrlParser: env.DB_MONGO_USENEWURLPARSER,
    socketTimeoutMS: env.DB_MONGO_SOCKETTIMEOUTMS,
    useCreateIndex: env.DB_MONGO_USECREATEINDEX,
    useFindAndModify: env.DB_MONGO_USEFINDANDMODIFY,
    autoIndex: env.DB_MONGO_AUTOINDEX,
    reconnectTries: env.DB_MONGO_RECONNECTTRIES,
    reconnectInterval: env.DB_MONGO_RECONNECTINTERVAL,
    poolSize: env.DB_MONGO_POOLSIZE,
    bufferMaxEntries: env.DB_MONGO_BUFFERMAXENTRIES,
    connectTimeoutMS: env.DB_MONGO_CONNECTTIMEOUTMS,
    family: env.DB_MONGO_FAMILY,
  },

  // psql: {
  //   host: env.DB_PSQL_HOST,
  //   port: env.DB_PSQL_PORT,
  //   database: env.DB_PSQL_DATABASE,
  //   user: env.DB_PSQL_USERNAME,
  //   password: env.DB_PSQL_PASSWORD,
  // },

  // redis: {
  //   host: env.DB_REDIS_HOST,
  //   port: env.DB_REDIS_PORT,
  //   password: env.DB_REDIS_PASSWORD,
  //   ttl: env.DB_REDIS_TTL,
  //   secret: env.DB_REDIS_SECRET,
  //   cookie: {
  //     secure: env.DB_REDIS_COOKIE_SECURE,
  //     maxAge: env.DB_REDIS_COOKIE_MAXAGE,
  //   },
  //   saveUninitialized: env.DB_REDIS_SAVEUNITIALIZED,
  //   resave: env.DB_REDIS_RESAVE,
  // },

  jwt: {
    secret: env.JWT_SECRET,
    token_type: env.JWT_TOKEN_TYPE,
    expire: env.JWT_EXPIRESIN,
    algorithm: env.JWT_ALGORITHM,
    privateKey: env.JWT_PRIVATEKEY_FILE,
    publicKey: env.JWT_PUBLICKEY_FILE,
    notBefore: env.JWT_NOTBEFORE,
    audience: env.JWT_AUDIENCE,
    issuer: env.JWT_ISSUER,
    subject: env.JWT_SUBJECT,
  },

  cookieParser: {
    secret: env.COOKIE_PARSER_SECRET,
  },

  logger: {
    level: env.LOGGER_LEVEL,
    prettyPrint: env.LOGGER_PRETTYPRINT,
    file: env.LOGGER_FILE,
  },

  // crons: {
  //   lots: env.CRONS_LOTS,
  // },

  locals: {
    baseURL: env.LOCALS_BASEURL,
  },

  ca: {
    dir: env.CA_DIR,
  },

}