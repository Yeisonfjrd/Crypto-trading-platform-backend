// routes/portfolioRoutes.js
import express from 'express';
const router = express.Router();

// Ruta para obtener datos del portafolio
router.get('/', async (req, res) => {
  try {
    // Simular datos del portafolio (reemplaza con tu lógica real)
    const portfolioData = {
      totalValue: 55000, // Valor total del portafolio simulado
      profitLoss: -2500, // Ganancia/Pérdida simulada
      recommendations: [ // Recomendaciones simuladas
        'Considerar diversificar hacia energías renovables.',
        'Mantener posiciones en tecnología a largo plazo.',
      ],
    };

    res.status(200).json(portfolioData);
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;