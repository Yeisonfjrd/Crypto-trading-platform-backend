import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Prediction = sequelize.define('Prediction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    predictedPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    confidence: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    timeframe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    features: {
        type: DataTypes.JSON,
        allowNull: false
    },
    actualPrice: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    accuracy: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
});

export default Prediction;