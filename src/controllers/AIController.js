// controllers/AIController.js
import { MarketAnalyzer } from '../services/MarketAnalyzer.js';
import { PricePredictor } from '../services/PricePredictor.js';
import redisClient from '../config/redis.js';

class AIController {
    constructor() {
        this.marketAnalyzer = new MarketAnalyzer();
        this.pricePredictor = new PricePredictor();
    }

    async getPrediction(symbol, timeframe) {
        try {
            // Intentar obtener de cache primero
            const cacheKey = `prediction:${symbol}:${timeframe}`;
            const cachedPrediction = await redisClient.get(cacheKey);
            
            if (cachedPrediction) {
                return JSON.parse(cachedPrediction);
            }

            // Si no está en cache, calcular nueva predicción
            const prediction = await this.pricePredictor.predict(symbol, timeframe);
            
            // Guardar en cache por 5 minutos
            await redisClient.setex(cacheKey, 300, JSON.stringify(prediction));
            
            return prediction;
        } catch (error) {
            console.error('Error al obtener predicción:', error);
            throw new Error('Error al calcular predicción de precio');
        }
    }

    async getMarketAnalysis(symbol) {
        try {
            const cacheKey = `analysis:${symbol}`;
            const cachedAnalysis = await redisClient.get(cacheKey);

            if (cachedAnalysis) {
                return JSON.parse(cachedAnalysis);
            }

            const analysis = await this.marketAnalyzer.analyze(symbol);
            
            // Guardar en cache por 15 minutos
            await redisClient.setex(cacheKey, 900, JSON.stringify(analysis));
            
            return analysis;
        } catch (error) {
            console.error('Error en análisis de mercado:', error);
            throw new Error('Error al analizar mercado');
        }
    }

    async getRiskAssessment(tradeParams) {
        try {
            const { symbol, amount, type, price } = tradeParams;
            
            // Obtener análisis de mercado actual
            const marketAnalysis = await this.getMarketAnalysis(symbol);
            
            // Calcular nivel de riesgo basado en varios factores
            const riskScore = this.calculateRiskScore({
                marketAnalysis,
                tradeAmount: amount,
                tradeType: type,
                currentPrice: price
            });

            return {
                riskScore,
                recommendations: this.generateRecommendations(riskScore),
                marketConditions: marketAnalysis.conditions
            };
        } catch (error) {
            console.error('Error en evaluación de riesgo:', error);
            throw new Error('Error al evaluar riesgo');
        }
    }

    calculateRiskScore(params) {
        const { marketAnalysis, tradeAmount, tradeType, currentPrice } = params;
        // Implementar lógica de cálculo de riesgo
        // Retorna un valor entre 0 y 100
        return 50; // Placeholder
    }

    generateRecommendations(riskScore) {
        if (riskScore > 75) {
            return ['Alto riesgo - Considerar reducir el tamaño de la posición'];
        } else if (riskScore > 50) {
            return ['Riesgo moderado - Monitorear de cerca'];
        }
        return ['Riesgo bajo - Proceder con precaución'];
    }
}

export default AIController;