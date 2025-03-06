import express from 'express';
import cryptoNewsController from '../controllers/cryptoNewsController.js';

const router = express.Router();

router.get('/', cryptoNewsController.getCryptoNews);

export default router;