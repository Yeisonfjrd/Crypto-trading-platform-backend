// controllers/SimulatorController.js
import Simulation from '../models/Simulation.js';
import Order from '../models/Order.js';

class SimulatorController {
    async createSimulation(userId, params) {
        try {
            const { initialBalance, symbol } = params;
            
            const simulation = await Simulation.create({
                userId,
                initialBalance,
                currentBalance: initialBalance,
                symbol,
                status: 'active',
                trades: [],
                performance: {
                    totalPnL: 0,
                    winRate: 0,
                    avgReturn: 0
                }
            });

            return simulation;
        } catch (error) {
            console.error('Error al crear simulación:', error);
            throw new Error('Error al crear simulación');
        }
    }

    async executeTrade(simId, tradeParams) {
        try {
            const simulation = await Simulation.findById(simId);
            if (!simulation) {
                throw new Error('Simulación no encontrada');
            }

            const { type, amount, price } = tradeParams;
            
            // Validar fondos suficientes
            if (type === 'buy' && simulation.currentBalance < amount * price) {
                throw new Error('Fondos insuficientes');
            }

            // Ejecutar trade
            const trade = {
                type,
                amount,
                price,
                timestamp: new Date(),
                value: amount * price
            };

            // Actualizar balance
            if (type === 'buy') {
                simulation.currentBalance -= trade.value;
            } else {
                simulation.currentBalance += trade.value;
            }

            // Agregar trade al historial
            simulation.trades.push(trade);

            // Actualizar métricas
            this.updatePerformanceMetrics(simulation);

            await simulation.save();
            return trade;
        } catch (error) {
            console.error('Error al ejecutar trade:', error);
            throw new Error('Error al ejecutar trade');
        }
    }

    async getSimulationStats(simId) {
        try {
            const simulation = await Simulation.findById(simId);
            if (!simulation) {
                throw new Error('Simulación no encontrada');
            }

            const stats = {
                initialBalance: simulation.initialBalance,
                currentBalance: simulation.currentBalance,
                totalTrades: simulation.trades.length,
                performance: simulation.performance,
                pnL: simulation.currentBalance - simulation.initialBalance,
                pnLPercentage: ((simulation.currentBalance - simulation.initialBalance) / simulation.initialBalance) * 100
            };

            return stats;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw new Error('Error al obtener estadísticas');
        }
    }

    updatePerformanceMetrics(simulation) {
        const trades = simulation.trades;
        if (!trades.length) return;

        let wins = 0;
        let totalReturn = 0;

        for (const trade of trades) {
            const isWin = trade.type === 'sell' && trade.value > trade.amount * trades[trades.length - 2]?.price;
            if (isWin) wins++;
            totalReturn += trade.value - (trade.amount * trades[trades.length - 2]?.price);
        }

        simulation.performance = {
            totalPnL: simulation.currentBalance - simulation.initialBalance,
            winRate: (wins / trades.length) * 100,
            avgReturn: totalReturn / trades.length
        };
    }
}

export default SimulatorController;