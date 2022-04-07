import express from 'express';

import user from './user.routes';
import expense from './expense.routes';

const router = express.Router();

router.use('/auth', user);
router.use('/expense', expense);

export default router;
