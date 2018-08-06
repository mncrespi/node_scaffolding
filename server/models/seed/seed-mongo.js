// const config = require('./../../config')
import mongodb from '../oauth'
import logger from '../../../config/winston'

const Thing = mongodb.Thing
const OAuthAccessToken = mongodb.OAuthAccessToken
const OAuthAuthorizationCode = mongodb.OAuthAuthorizationCode
const OAuthClient = mongodb.OAuthClient
const OAuthRefreshToken = mongodb.OAuthRefreshToken
const OAuthScope = mongodb.OAuthScope
const User = mongodb.User


//OAuthAccessToken.sync({force:config.seedDBForce})
//OAuthRefreshToken.sync({force:config.seedDBForce})
//OAuthAuthorizationCode.sync({force:config.seedDBForce})


OAuthScope
  .find({})
  .remove()
  .then(() => {
    OAuthScope
      .create({
          scope: 'profile',
          is_default: false,
        },
        {
          scope: 'defaultscope',
          is_default: true,
        })
      .then(() => {
        logger.log('debug', 'finished populating OAuthScope')
      })
  })

User
  .find({})
  .remove()
  .then(() => {
    User.create({
      username: 'admin',
      password: 'admin',
    })
      .then((user) => {
        logger.log('debug', 'finished populating users', user)
        return OAuthClient
          .find({})
          .remove()
          .then(() => {
            OAuthClient.create({
              client_id: 'democlient',
              client_secret: 'democlientsecret',
              redirect_uri: 'http://localhost/cb',
              User: user._id,
            })
              .then((client) => {
                logger.log('debug', 'finished populating OAuthClient', client)
              })
              .catch((e) => {
                logger.log('debug', 'ERROR on finished populating OAuthClient', e)
              })
          })
      })
  })


Thing
  .find({})
  .remove()
  .then(() => {
    Thing
      .create({
          name: 'Development Tools',
          info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
          'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
          'Stylus, Sass, and Less.',
        },
        {
          name: 'Server and Client integration',
          info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
          'AngularJS, and Node.',
        },
        {
          name: 'Smart Build System',
          info: 'Build system ignores `spec` files, allowing you to keep ' +
          'tests alongside code. Automatic injection of scripts and ' +
          'styles into your index.html',
        },
        {
          name: 'Modular Structure',
          info: 'Best practice client and server structures allow for more ' +
          'code reusability and maximum scalability',
        },
        {
          name: 'Optimized Build',
          info: 'Build process packs up your templates as a single JavaScript ' +
          'payload, minifies your scripts/css/images, and rewrites asset ' +
          'names for caching.',
        },
        {
          name: 'Deployment Ready',
          info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
          'and openshift subgenerators',
        })
  })
