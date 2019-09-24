import express from 'express'
import apiRoutes from './api/index.js'


const router = express.Router()   	// eslint-disable-line new-cap


/** API routes at /api */
router.use('/api', apiRoutes)

/** GET - Root Dir */
router.get('/', (req, res) => {
  res.send('Welcome to Node Scaffolding')
})


export default router
