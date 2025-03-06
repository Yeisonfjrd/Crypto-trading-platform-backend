// src/controllers/demoController.js
import { DemoAccount, Transaction } from '../models/index.js';
import { Op } from 'sequelize';

export const createDemoTransaction = async (req, res) => {
  const { userId, pair, amount, price, type } = req.body;

  try {
    // Buscar o crear cuenta demo
    let account = await DemoAccount.findOne({ where: { userId } });
    if (!account) {
      account = await DemoAccount.createWithInitialBalance(userId);
    }

    // Validar la transacción
    if (type === 'buy') {
      if (!account.hasSufficientBalance(amount, price)) {
        return res.status(400).json({
          error: 'Balance insuficiente para realizar la compra'
        });
      }
    } else if (type === 'sell') {
      const cryptoSymbol = pair.split('/')[0];
      if (!account.hasSufficientCrypto(amount, cryptoSymbol)) {
        return res.status(400).json({
          error: `Balance insuficiente de ${cryptoSymbol} para realizar la venta`
        });
      }
    }

    // Iniciar transacción
    const result = await sequelize.transaction(async (t) => {
      // Crear la transacción
      const transaction = await Transaction.create({
        userId,
        pair,
        amount,
        price,
        type
      }, { transaction: t });

      // Actualizar balances
      if (type === 'buy') {
        account.balance -= (amount * price);
        account.btcBalance += amount;
      } else {
        account.balance += (amount * price);
        account.btcBalance -= amount;
      }

      await account.save({ transaction: t });

      return { transaction, account };
    });

    res.json({
      message: 'Transacción simulada exitosa',
      transaction: result.transaction,
      newBalance: result.account.balance,
      newBtcBalance: result.account.btcBalance
    });

  } catch (error) {
    console.error('Error en createDemoTransaction:', error);
    res.status(500).json({
      error: 'Error al procesar la transacción',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getDemoAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const account = await DemoAccount.findOne({
      where: { userId },
      include: [{
        model: Transaction,
        as: 'transactions',
        limit: 10,
        order: [['createdAt', 'DESC']]
      }]
    });

    if (!account) {
      return res.status(404).json({ error: 'Cuenta demo no encontrada' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la cuenta demo' });
  }
};
