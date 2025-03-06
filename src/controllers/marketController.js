// src/controllers/marketController.js
import fetch from 'node-fetch';

export const getMarketPrices = async (req, res) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching market prices:', error);
    res.status(500).json({ error: 'Error fetching market data' });
  }
};