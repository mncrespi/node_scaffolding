import express from 'express'
import apiRoutes from './api/index'
import adminRoutes from './admin/index'

const router = express.Router()   	// eslint-disable-line new-cap


// mount API routes at /api
router.use('/api', apiRoutes)

// mount Admin routes at /admin
router.use('/admin', adminRoutes)

/** GET - Root Dir */
router.get('/', (req, res) =>
  res.send('Welcome to Node Scaffolding')
)


export default router