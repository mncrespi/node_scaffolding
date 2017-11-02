import express from 'express'
import userRoutes from './user'
import authRoutes from './auth'
import expressJwt from 'express-jwt'
import config from '../../../config/env'


const router = express.Router()  	// eslint-disable-line new-cap


/** API Auth Routes */
router.use('/auth', authRoutes)

/** mount user routes at /users */
router.use('/users',  expressJwt({ secret: config.jwt.secret, }), userRoutes)

/** API Index */
router.get('/', (req, res) => {
  res.json({ msg: 'node_scaffolding: Welcome to API', })
})


export default router
