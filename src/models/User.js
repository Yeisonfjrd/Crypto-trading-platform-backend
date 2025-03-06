import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  twoFactorSecret: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clerkId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  demoBalance: {
    type: DataTypes.DECIMAL(18, 8),
    defaultValue: 1000,
  },
}, {
  timestamps: true,
});

export default User;