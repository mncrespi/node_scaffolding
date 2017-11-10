import APIError               from '../helpers/APIError'
import config                 from '../../config/env'
import jwt                    from 'jsonwebtoken'
import logger                 from '../../config/winston'
import User                   from '../models/user'


/**
 * Returns jwt token if valid username and password is provided
 * @param req - Request
 * @param res - Response
 * @param next - Next Middleware
 * @returns {*}
 */
function login(req, res, next) {
  User.findOne({
    username: req.body.username,
  }, (err, user) => {
    if (err) throw err

    if (!user) {
      logger.log('debug', 'API::Auth::JWT:User Not Found')
      const err = APIError(401)
      next(err)
    } else {
      // Check if password matches
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          const payload = {
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
          }

          // Create token if the password matched and no error was thrown
          const token = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expire, })

          return res.status(200).json({
            token: token,
            token_type: 'Bearer',
            expires_in: config.jwt.expire,
          })
        } else {
          logger.log('debug', 'API::Auth::JWT:Password did not match')
          const err = APIError(401)
          next(err)
        }
      })
    }
  })
}



export default {
  login,
}
