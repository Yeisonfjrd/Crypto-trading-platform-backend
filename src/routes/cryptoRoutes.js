import express from 'express';
import { getCachedCryptoPrices } from '../controllers/cryptoController.js';

const router = express.Router();

router.get('/', getCachedCryptoPrices);

export default router; // <-- Exporta el router