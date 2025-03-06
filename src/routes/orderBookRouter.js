import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import Order from '../models/Order.js';

const router = express.Router();

router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { status: 'pending' },
            order: [['createdAt', 'DESC']],
        });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo obtener el order book', details: error.message });
    }
});

export default router;