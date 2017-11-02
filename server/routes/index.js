import express from 'express'
import apiRoutes from './api/index'
import cache from '../../config/cache'

const router = express.Router()   	// eslint-disable-line new-cap


/** API routes at /api */
router.use('/api', apiRoutes)

/** GET - Example Cache */
router.get('/cache', cache.route(), (req, res) => {
  res.send('Example Cache Route')
})


/** GET - Root Dir */
router.get('/', (req, res) => {
  res.send('Welcome to Node Scaffolding')
})


export default router
