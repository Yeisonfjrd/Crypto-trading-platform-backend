// src/models/Transaction.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
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
}, {
  tableName: 'Transactions',
  timestamps: true,
});

export default Transaction;