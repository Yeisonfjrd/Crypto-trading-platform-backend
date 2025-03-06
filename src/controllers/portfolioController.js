import { Portfolio } from '../models/index.js';

export const getPortfolioValue = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Obtener activos del portafolio
    const portfolio = await Portfolio.findAll({ where: { userId } });
    
    // Obtener precios actuales de las criptomonedas
    const cryptoPrices = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    const pricesData = await cryptoPrices.json();

    // Validación de la respuesta de la API
    if (!pricesData || !pricesData.bitcoin || !pricesData.ethereum) {
      throw new Error('Error al obtener precios de criptomonedas');
    }

    let totalValue = 0;

    // Calcular el valor total del portafolio
    portfolio.forEach(asset => {
      const price = pricesData[asset.pair]?.usd || 0;
      totalValue += asset.amount * price;
    });

    res.json({ totalValue });
  } catch (error) {
    console.error('Error calculando valor del portafolio:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
};
