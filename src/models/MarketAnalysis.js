import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MarketAnalysis = sequelize.define('MarketAnalysis', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trend: {
        type: DataTypes.JSON,
        allowNull: false
    },
    support: {
        type: DataTypes.JSON,
        allowNull: false
    },
    resistance: {
        type: DataTypes.JSON,
        allowNull: false
    },
    volatility: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

export default MarketAnalysis;