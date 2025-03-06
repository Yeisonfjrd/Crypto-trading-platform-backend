// services/MarketAnalyzer.js
import axios from 'axios';
import technicalIndicators from 'technicalindicators';

class MarketAnalyzer {
    async getHistoricalData(symbol) {
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart`,
                {
                    params: {
                        vs_currency: 'usd',
                        days: '30',
                        interval: 'daily'
                    }
                }
            );
            return response.data.prices.map(([timestamp, price]) => ({
                timestamp,
                price
            }));
        } catch (error) {
            console.error('Error obteniendo datos históricos:', error);
            throw new Error('Error al obtener datos históricos');
        }
    }

    calculateIndicators(historicalData) {
        const prices = historicalData.map(data => data.price);
        
        return {
            rsi: technicalIndicators.RSI.calculate({
                values: prices,
                period: 14
            }),
            macd: technicalIndicators.MACD.calculate({
                values: prices,
                fastPeriod: 12,
                slowPeriod: 26,
                signalPeriod: 9
            }),
            sma: technicalIndicators.SMA.calculate({
                values: prices,
                period: 20
            })
        };
    }

    analyzeTrend(indicators) {
        const { rsi, macd, sma } = indicators;
        const lastRSI = rsi[rsi.length - 1];
        const lastMACD = macd[macd.length - 1];

        let trend = 'neutral';
        let strength = 0;

        // Análisis RSI
        if (lastRSI > 70) {
            trend = 'bearish';
            strength += 1;
        } else if (lastRSI < 30) {
            trend = 'bullish';
            strength += 1;
        }

        // Análisis MACD
        if (lastMACD.histogram > 0) {
            if (trend === 'bullish') strength += 1;
            trend = 'bullish';
        } else {
            if (trend === 'bearish') strength += 1;
            trend = 'bearish';
        }

        return {
            direction: trend,
            strength: strength / 2 // Normalizado entre 0 y 1
        };
    }

    findSupportLevels(historicalData) {
        const prices = historicalData.map(data => data.price);
        const sortedPrices = [...new Set(prices)].sort((a, b) => a - b);
        
        // Encontrar niveles de soporte usando agrupación de precios
        const supports = [];
        let currentSupport = sortedPrices[0];
        
        for (let i = 1; i < sortedPrices.length; i++) {
            if ((sortedPrices[i] - currentSupport) / currentSupport > 0.02) {
                supports.push(currentSupport);
                currentSupport = sortedPrices[i];
            }
        }
        
        return supports.slice(-3); // Retornar los 3 niveles más recientes
    }

    findResistanceLevels(historicalData) {
        const prices = historicalData.map(data => data.price);
        const sortedPrices = [...new Set(prices)].sort((a, b) => b - a);
        
        // Encontrar niveles de resistencia usando agrupación de precios
        const resistances = [];
        let currentResistance = sortedPrices[0];
        
        for (let i = 1; i < sortedPrices.length; i++) {
            if ((currentResistance - sortedPrices[i]) / sortedPrices[i] > 0.02) {
                resistances.push(currentResistance);
                currentResistance = sortedPrices[i];
            }
        }
        
        return resistances.slice(-3); // Retornar los 3 niveles más recientes
    }

    calculateVolatility(historicalData) {
        const prices = historicalData.map(data => data.price);
        const returns = [];
        
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i-1]) / prices[i-1]);
        }
        
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
        
        return Math.sqrt(variance);
    }

    async analyze(symbol) {
        const historicalData = await this.getHistoricalData(symbol);
        const indicators = this.calculateIndicators(historicalData);
        
        return {
            trend: this.analyzeTrend(indicators),
            support: this.findSupportLevels(historicalData),
            resistance: this.findResistanceLevels(historicalData),
            volatility: this.calculateVolatility(historicalData),
            lastUpdate: new Date(),
            symbol
        };
    }
}

export default MarketAnalyzer;