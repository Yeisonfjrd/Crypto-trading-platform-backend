import { WebSocketServer } from 'ws';
import axios from 'axios';
import Order from '../models/Order.js';
import User from '../models/User.js';

let wsServerInstance = null;
let broadcastInterval = null;

const setupWebSocket = (server) => {
    const wss = new WebSocketServer({ server });
    wsServerInstance = wss;

    // Función de broadcast global
    const broadcastToAll = (data) => {
        wss.clients.forEach(client => {
            if (client.isAlive && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    };

    // Configurar el intervalo global de actualización
    const setupBroadcastInterval = async () => {
        if (broadcastInterval) {
            clearInterval(broadcastInterval);
        }

        const fetchAndBroadcast = async () => {
            try {
                const cryptoData = await fetchCryptoData();
                if (!cryptoData) return;

                const pendingOrders = await Order.findAll({ where: { status: 'pending' } });
                const completedOrders = [];

                for (const order of pendingOrders) {
                    if ((order.type === 'buy' && cryptoData.bitcoin.usd <= order.price) ||
                        (order.type === 'sell' && cryptoData.bitcoin.usd >= order.price)) {
                        order.status = 'completed';
                        await order.save();

                        const user = await User.findOne({ where: { id: order.userId } });
                        if (user) {
                            const transactionAmount = order.amount * order.price;
                            user.demoBalance += order.type === 'sell' ? transactionAmount : -transactionAmount;
                            await user.save();
                        }

                        completedOrders.push(order.toJSON());
                    }
                }

                if (completedOrders.length > 0) {
                    broadcastToAll({
                        type: 'order_completed',
                        orders: completedOrders
                    });
                }

                broadcastToAll({
                    type: 'price_update',
                    pair: 'BTC/USD',
                    price: cryptoData.bitcoin.usd,
                    timestamp: Date.now()
                });

                console.log('Broadcast realizado:', new Date().toISOString());
            } catch (error) {
                console.error('Error en fetchAndBroadcast:', error);
            }
        };

        // Ejecutar inmediatamente la primera vez
        await fetchAndBroadcast();
        
        // Configurar el intervalo
        broadcastInterval = setInterval(fetchAndBroadcast, 60000);
    };

    // Iniciar el intervalo de broadcast
    setupBroadcastInterval();

    wss.on('connection', (ws) => {
        console.log('Cliente conectado al WebSocket');
        ws.isAlive = true;

        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                if (message.type === 'ping') {
                    ws.send(JSON.stringify({ type: 'pong' }));
                }
            } catch (error) {
                console.error('Error al procesar mensaje:', error);
            }
        });

        // Enviar datos iniciales al cliente que se conecta
        fetchCryptoData().then(cryptoData => {
            if (cryptoData && ws.isAlive) {
                ws.send(JSON.stringify({
                    type: 'price_update',
                    pair: 'BTC/USD',
                    price: cryptoData.bitcoin.usd,
                    timestamp: Date.now()
                }));
            }
        });

        ws.on('close', () => {
            ws.isAlive = false;
        });

        ws.on('error', (error) => {
            console.error('Error en WebSocket:', error);
            ws.isAlive = false;
        });
    });

    // Verificar conexiones muertas cada 30 segundos
    const heartbeat = setInterval(() => {
        wss.clients.forEach(ws => {
            if (!ws.isAlive) {
                ws.terminate();
                return;
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 60000);

    wss.on('close', () => {
        clearInterval(heartbeat);
        clearInterval(broadcastInterval);
    });

    return wsServerInstance;
};

const fetchCryptoData = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'bitcoin,ethereum',
                vs_currencies: 'usd'
            },
            headers: {
                'Accept-Encoding': 'gzip'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos de CoinGecko:', error);
        return null;
    }
};

export { setupWebSocket };
