import express from 'express';
import userRoutes from './user';

const router = express.Router();	// eslint-disable-line new-cap

// API Index
router.use('/', (req, res) => {
  res.json({ msg: 'node_scaffolding: Welcome to API' });
});

// mount user routes at /users
router.use('/users', userRoutes);

export default router;
