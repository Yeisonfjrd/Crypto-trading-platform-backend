// routes/statsRoutes.js
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const stats = {
      totalVolume: 1000,
      totalProfitLoss: 5000,
      successRate: '75%',
      performanceByPair: {
        'BTC/USD': 10000,
        'ETH/USD': 5000,
      },
    };
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;