// src/models/DemoAccount.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Transaction from './Transaction.js';

const DemoAccount = sequelize.define('DemoAccount', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 1000.00, // Balance inicial de $100,000 USD
  },
  btcBalance: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.00,
  },
  ethBalance: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.00,
  },
  // Puedes agregar más balances de criptomonedas según necesites
}, {
  tableName: 'DemoAccounts',
  timestamps: true,
});

// Establecer relación con Transaction
DemoAccount.hasMany(Transaction, {
  foreignKey: 'userId',
  sourceKey: 'userId',
  as: 'transactions'
});

Transaction.belongsTo(DemoAccount, {
  foreignKey: 'userId',
  targetKey: 'userId',
  as: 'account'
});

// Hooks para validación
DemoAccount.beforeCreate(async (account) => {
  // Validar que el balance inicial sea positivo
  if (account.balance < 0) {
    throw new Error('El balance inicial no puede ser negativo');
  }
});

// Métodos de instancia
DemoAccount.prototype.hasSufficientBalance = function(amount, price) {
  return this.balance >= (amount * price);
};

DemoAccount.prototype.hasSufficientCrypto = function(amount, symbol) {
  switch(symbol.toUpperCase()) {
    case 'BTC':
      return this.btcBalance >= amount;
    case 'ETH':
      return this.ethBalance >= amount;
    default:
      return false;
  }
};

// Métodos estáticos
DemoAccount.createWithInitialBalance = async function(userId, initialBalance = 1000.00) {
  return await this.create({
    userId,
    balance: initialBalance,
  });
};

export default DemoAccount;
