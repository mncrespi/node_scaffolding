/** API Validations */
import apiUsers from './api/users.js'
import apiAuth from './api/auth.js'


export default {
  /** ----------------------------------------------
   *  API Validations:
   ** ------------------------------------------- */

  /** /api/auth */
  apiAuth: apiAuth,

  /** users */
  createUser: apiUsers.createUser,
  updateUser: apiUsers.updateUser,
}