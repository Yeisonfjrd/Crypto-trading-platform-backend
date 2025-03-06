import { Transaction } from '../models/index.js';

// Obtener estadísticas del usuario
export const getUserStats = async (req, res) => {
  try {
    const userId = req.auth?.userId; // Asegúrate de que req.auth esté definido

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
    }

    // Obtener todas las transacciones del usuario
    const transactions = await Transaction.findAll({ where: { userId } });

    if (transactions.length === 0) {
      return res.status(404).json({ error: 'No transactions found for this user' });
    }

    // Calcular métricas
    const totalVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0);

    const totalProfitLoss = transactions.reduce((acc, tx) => {
      return tx.type === 'buy'
        ? acc - (tx.amount * tx.price)
        : acc + (tx.amount * tx.price);
    }, 0);

    const successRate = transactions.filter(tx => tx.type === 'sell').length / transactions.length || 0;

    // Agrupar por par
    const performanceByPair = {};
    transactions.forEach(tx => {
      if (!performanceByPair[tx.pair]) {
        performanceByPair[tx.pair] = 0;
      }
      performanceByPair[tx.pair] += tx.type === 'buy'
        ? -(tx.amount * tx.price)
        : tx.amount * tx.price;
    });

    res.json({
      totalVolume,
      totalProfitLoss,
      successRate: (successRate * 100).toFixed(2) + '%',
      performanceByPair,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};