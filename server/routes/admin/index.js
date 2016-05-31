import express from 'express';

const router = express.Router();	// eslint-disable-line new-cap

/** GET /admin - Home */
router.get('/', (req, res) =>
	res.send('Welcome to Api-Admin')
);

export default router;
