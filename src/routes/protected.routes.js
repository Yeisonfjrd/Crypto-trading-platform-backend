import { Router } from 'express';
import { requireAuth } from '../middlewares/clerkAuth.js';
import { getUserStats } from '../controllers/statsController.js';

const router = Router();

router.get('/stats', requireAuth, getUserStats);

export default router;