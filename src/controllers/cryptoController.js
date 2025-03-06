import redisClient from '../config/redisClient.js';

export const getCachedCryptoPrices = async (req, res) => {
  try {
    const cacheKey = 'cryptoPrices';
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    const prices = await response.json();

    // Use set with expiry option in ioredis
    await redisClient.set(cacheKey, JSON.stringify(prices), 'EX', 3600); // Cache por 1 hora
    res.json(prices);
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};