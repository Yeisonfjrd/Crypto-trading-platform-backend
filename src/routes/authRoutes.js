import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import {
  enable2FA,
  verify2FA,
  disable2FA,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/enable-2fa', ClerkExpressRequireAuth(), enable2FA);

router.post('/verify-2fa', ClerkExpressRequireAuth(), verify2FA);

router.post('/disable-2fa', ClerkExpressRequireAuth(), disable2FA);

export default router;