import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Portfolio = sequelize.define('Portfolio', {
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
}, {
  timestamps: true,
});

export default Portfolio;