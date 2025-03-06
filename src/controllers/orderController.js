import { Order, OrderBook } from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const { pair, amount, type, price } = req.body;

    const order = await Order.create({
      userId,
      pair,
      amount: parseFloat(amount),
      type,
      price: parseFloat(price),
      status: 'pending',
    });

    res.json({ message: 'Orden creada exitosamente', order });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const orders = await Order.findAll({ where: { userId } });
    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }

    res.json({ orders });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
};

export const placeOrder = async (req, res) => {
  const { userId, pair, amount, price, type } = req.body;

  const user = await User.findOne({ where: { clerkId: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const currentPrice = await getCurrentPrice(pair); // Obtener precio actual del mercado

  if (type === 'buy') {
    const totalCost = amount * price;
    if (user.demoBalance < totalCost) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    user.demoBalance -= totalCost;
  } else if (type === 'sell') {
    const holding = await Portfolio.findOne({ where: { userId, pair } });
    if (!holding || holding.amount < amount) {
      return res.status(400).json({ error: 'Insufficient holdings' });
    }
    holding.amount -= amount;
    await holding.save();
    user.demoBalance += amount * price;
  }

  await user.save();
  await Order.create({ userId, pair, amount, price, type });
  res.json({ message: 'Order executed successfully', balance: user.demoBalance });
};