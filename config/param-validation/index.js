/** API Validations */
import apiUsers                   from './api/users'
import apiAuth                    from './api/auth'


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