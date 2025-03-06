import { WebSocketServer, WebSocket } from 'ws';

let currentPrice = 20000;
let priceInterval = null;

const simulatePriceChange = (currentPrice) => {
    const change = (Math.random() - 0.5) * 0.02;
    return currentPrice * (1 + change);
};

const broadcastPrice = (wsServer, price) => {
    console.log(`Broadcasting price: ${price} at ${new Date().toISOString()}`);
    wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            try {
                client.send(
                    JSON.stringify({
                        type: 'price_update',
                        pair: 'BTC/USD',
                        price: price,
                        timestamp: Date.now(),
                    })
                );
            } catch (error) {
                console.error('Error sending message to client:', error);
            }
        }
    });
};

const setupWebSocket = (server) => {
    const wss = new WebSocketServer({ server });
    console.log('WebSocket server initialized');

    wss.on('connection', (ws) => {
        console.log('Cliente conectado al WebSocket');

        // Envía el precio inicial al cliente conectado
        broadcastPrice(wss, currentPrice);

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        ws.on('close', () => {
            console.log('Cliente desconectado');
        });
    });

    return wss;
};

const setupPriceUpdates = (wsServer) => {
    if (!wsServer) {
        console.error("wsServer is undefined. Make sure setupWebSocket is called first.");
        return;
    }

    console.log('Setting up price updates...');

    // Limpia el intervalo anterior si existe
    if (priceInterval) {
        console.log('Clearing existing interval');
        clearInterval(priceInterval);
    }

    // Enviar primera actualización inmediatamente
    currentPrice = simulatePriceChange(currentPrice);
    broadcastPrice(wsServer, currentPrice);

    priceInterval = setInterval(() => {
        currentPrice = simulatePriceChange(currentPrice);
        broadcastPrice(wsServer, currentPrice);
    }, 60000);

    console.log('Price updates interval set');
    return priceInterval;
};

// Función para limpiar recursos
const cleanup = () => {
    if (priceInterval) {
        console.log('Cleaning up price interval');
        clearInterval(priceInterval);
        priceInterval = null;
    }
};

// Función para verificar el estado
const getStatus = () => {
    return {
        currentPrice,
        hasActiveInterval: priceInterval !== null,
        lastUpdate: Date.now()
    };
};

export const getCurrentPrice = () => currentPrice;

export { setupWebSocket, setupPriceUpdates, cleanup, getStatus };
