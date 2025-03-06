import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Simulation = sequelize.define('Simulation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    initialBalance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    currentBalance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    trades: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    performance: {
        type: DataTypes.JSON,
        defaultValue: {}
    }
});

export default Simulation;