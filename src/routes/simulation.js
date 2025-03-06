// routes/simulation.js
import express from 'express';
import SimulatorController from '../controllers/SimulatorController.js';
import AIController from '../controllers/AIController.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = express.Router();
const simulatorController = new SimulatorController();
const aiController = new AIController();

// Rutas de simulación
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const simulation = await simulatorController.createSimulation(req.auth.userId, req.body);
        res.json(simulation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Más rutas aquí...

export default router;