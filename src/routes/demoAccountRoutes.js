// routes/demoAccountRoutes.js
import express from 'express';
const router = express.Router();

// Ruta para obtener datos de la cuenta demo
router.get('/', async (req, res) => {
  try {
    // Simular datos de la cuenta demo (reemplaza con tu lógica real)
    const demoData = {
      balance: 15000, // Saldo demo simulado
      transactions: [ // Transacciones simuladas
        { type: 'buy', pair: 'BTC/USD', amount: 0.5, price: 30000 },
        { type: 'sell', pair: 'ETH/USD', amount: 2, price: 1500 },
        { type: 'buy', pair: 'BTC/USD', amount: 0.2, price: 32000 },
      ],
    };

    res.status(200).json(demoData);
  } catch (error) {
    console.error('Error fetching demo account data:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;