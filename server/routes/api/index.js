import express from 'express'
import userRoutes from './user'
import authRoutes from './auth'

const router = express.Router()  	// eslint-disable-line new-cap


/** API Auth Routes */
router.use('/auth', authRoutes)

/** mount user routes at /users */
router.use('/users', userRoutes)

/** API Index */
router.get('/', (req, res) => {
  res.json({ msg: 'node_scaffolding: Welcome to API', })
})


export default router
