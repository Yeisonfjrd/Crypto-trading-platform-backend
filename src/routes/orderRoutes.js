import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import Order from '../models/Order.js';

const router = express.Router();

router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const userId = req.auth.userId;

        const { pair, amount, type, price } = req.body;

        const order = await Order.create({
            userId,
            pair,
            amount: parseFloat(amount), // Importante: Convierte a número
            type,
            price: parseFloat(price),   // Importante: Convierte a número
            status: 'pending',
        });

        res.status(201).json({ message: 'Orden creada exitosamente', order }); // 201 Created
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const userId = req.auth.userId;

        const orders = await Order.findAll({ where: { userId } });

        res.json({ orders }); // No necesitas el if (orders.length === 0)

    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

export default router;