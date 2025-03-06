import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import sequelize from './config/database.js';
import { setupWebSocket, setupPriceUpdates } from './utils/marketSimulator.js';

// Importación de rutas existentes
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import demoAccountRoutes from './routes/demoAccountRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import orderBookRouter from './routes/orderBookRouter.js';
import cryptoNewsRoutes from './routes/cryptoNewsRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

// Importación de nuevos modelos (relacionales con Sequelize)
import Prediction from './models/Prediction.js';
import Simulation from './models/Simulation.js';
import MarketAnalysis from './models/MarketAnalysis.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wsServer = setupWebSocket(server);

setupPriceUpdates(wsServer);

// Configuración de CORS y middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Definición de relaciones entre modelos (Sequelize)
const setupAssociations = () => {
  // Relaciones con Prediction
  Prediction.belongsTo(Simulation);
  Simulation.hasMany(Prediction);

  // Relaciones con MarketAnalysis
  MarketAnalysis.hasMany(Prediction);
  Prediction.belongsTo(MarketAnalysis);

  // Relaciones con Simulation
  Simulation.hasMany(MarketAnalysis);
  MarketAnalysis.belongsTo(Simulation);
};

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/order-book', orderBookRouter);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/crypto-prices', cryptoRoutes);
app.use('/api/demo-account', demoAccountRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/crypto-news', cryptoNewsRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Iniciando apagado del servidor...');
  if (typeof cleanup === 'function') {
    cleanup();
  }
  await new Promise(resolve => server.close(resolve));
  await sequelize.close();
  console.log('Servidor apagado correctamente');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Database and server initialization
const PORT = process.env.PORT || 3001;

const initServer = async () => {
  try {
    // Configurar asociaciones antes de sincronizar
    setupAssociations();

    await sequelize.authenticate();
    console.log('Database connection established');
    await sequelize.sync({ force: false });
    console.log('Database synced');

    server.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    process.exit(1);
  }
};

initServer();

export default app;