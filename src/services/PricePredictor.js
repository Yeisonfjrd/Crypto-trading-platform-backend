// services/PricePredictor.js
import tf from '@tensorflow/tfjs-node';
import { MarketAnalyzer } from './MarketAnalyzer.js';

class PricePredictor {
    constructor() {
        this.marketAnalyzer = new MarketAnalyzer();
        this.model = null;
        this.initialized = false;
        this.initialize();
    }

    async initialize() {
        try {
            // Cargar o crear modelo
            this.model = await this.loadModel();
            this.initialized = true;
        } catch (error) {
            console.error('Error inicializando modelo:', error);
            throw new Error('Error al inicializar predictor');
        }
    }

    async loadModel() {
        try {
            // Crear un modelo simple de ejemplo
            const model = tf.sequential({
                layers: [
                    tf.layers.dense({ inputShape: [10], units: 50, activation: 'relu' }),
                    tf.layers.dense({ units: 25, activation: 'relu' }),
                    tf.layers.dense({ units: 1, activation: 'linear' })
                ]
            });

            model.compile({
                optimizer: tf.train.adam(0.001),
                loss: 'meanSquaredError'
            });

            return model;
        } catch (error) {
            console.error('Error cargando modelo:', error);
            throw new Error('Error al cargar modelo');
        }
    }

    async prepareFeatures(symbol) {
        const historicalData = await this.marketAnalyzer.getHistoricalData(symbol);
        const prices = historicalData.map(data => data.price);
        
        // Crear features básicos
        const features = [];
        for (let i = 10; i < prices.length; i++) {
            const window = prices.slice(i - 10, i);
            features.push(window);
        }
        
        return tf.tensor2d(features);
    }

    async predict(symbol, timeframe) {
        try {
            if (!this.initialized) {
                throw new Error('Predictor no inicializado');
            }

            const features = await this.prepareFeatures(symbol);
            const prediction = await this.model.predict(features);
            const predictionData = await prediction.data();

            // Calcular confianza basada en la volatilidad
            const analysis = await this.marketAnalyzer.analyze(symbol);
            const confidence = Math.max(0, 1 - analysis.volatility);

            return {
                price: predictionData[0],
                confidence,
                timeframe,
                timestamp: new Date(),
                symbol
            };
        } catch (error) {
            console.error('Error en predicción:', error);
            throw new Error('Error al realizar predicción');
        }
    }
}

export default PricePredictor;