import express from 'express'
import validate from 'express-validation'
import paramValidation from '../../../config/param-validation/index.js'
import authCtrl from '../../controllers/auth.js'

const router = express.Router()	// eslint-disable-line new-cap


/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.apiAuth.login), authCtrl.login)


export default router
