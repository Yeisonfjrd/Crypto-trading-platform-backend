import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redisClient.on('error', (err) => {
  console.error('Error en conexión IoRedis:', err);
  console.error('Intentando conectar a:', redisClient.options.host, redisClient.options.port);
});

redisClient.on('connect', () => {
  console.log('Conectado a Redis usando IoRedis');
});

export default redisClient;