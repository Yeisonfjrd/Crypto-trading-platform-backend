import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Balance = sequelize.define('Balance', {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  usd: {
    type: DataTypes.FLOAT,
    defaultValue: 10000,
  },
  btc: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

export default Balance; 