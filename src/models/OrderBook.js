import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderBook = sequelize.define('OrderBook', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pair: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'executed', 'cancelled'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

export default OrderBook;