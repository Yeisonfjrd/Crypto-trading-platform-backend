import Redis from 'ioredis';

console.log('REDIS_URL:', process.env.REDIS_URL || 'No definido');

const redisClient = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redisClient.on('error', (err) => console.error('Error en Redis:', err));
redisClient.on('connect', () => console.log('Conectado a Redis'));

export default redisClient;