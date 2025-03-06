import { createDemoTransaction } from '../src/controllers/demoController.js';
import DemoAccount from '../src/models/DemoAccount.js'; // Asumiendo que tienes un modelo
import Transaction from '../src/models/Transaction.js'; // Asumiendo que tienes un modelo

// Mock de los modelos
jest.mock('../src/models/DemoAccount.js');
jest.mock('../src/models/Transaction.js');

describe('DemoController - createDemoTransaction', () => {
  // Configuración inicial antes de cada test
  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Configurar mocks básicos
    DemoAccount.findOne = jest.fn();
    DemoAccount.prototype.save = jest.fn();
    Transaction.create = jest.fn();
  });

  it('should successfully create a buy transaction and update balance', async () => {
    // Arrange
    const mockAccount = {
      userId: '123',
      balance: 100000, // $100,000 USD
      btcBalance: 0,
      save: jest.fn().mockResolvedValue(true)
    };

    DemoAccount.findOne.mockResolvedValue(mockAccount);
    Transaction.create.mockResolvedValue({ id: 'transaction-123' });

    const req = {
      body: {
        userId: '123',
        pair: 'BTC/USD',
        amount: 1,
        price: 20000,
        type: 'buy'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Act
    await createDemoTransaction(req, res);

    // Assert
    expect(DemoAccount.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(mockAccount.balance).toBe(80000); // 100000 - (1 * 20000)
    expect(mockAccount.btcBalance).toBe(1);
    expect(mockAccount.save).toHaveBeenCalled();
    expect(Transaction.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Transacción simulada exitosa',
        transaction: expect.any(Object)
      })
    );
  });

  it('should successfully create a sell transaction and update balance', async () => {
    // Arrange
    const mockAccount = {
      userId: '123',
      balance: 80000,
      btcBalance: 1,
      save: jest.fn().mockResolvedValue(true)
    };

    DemoAccount.findOne.mockResolvedValue(mockAccount);
    Transaction.create.mockResolvedValue({ id: 'transaction-124' });

    const req = {
      body: {
        userId: '123',
        pair: 'BTC/USD',
        amount: 1,
        price: 21000,
        type: 'sell'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Act
    await createDemoTransaction(req, res);

    // Assert
    expect(mockAccount.balance).toBe(101000); // 80000 + (1 * 21000)
    expect(mockAccount.btcBalance).toBe(0);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Transacción simulada exitosa'
      })
    );
  });

  it('should fail if user has insufficient balance for buy', async () => {
    // Arrange
    const mockAccount = {
      userId: '123',
      balance: 10000, // Solo $10,000 USD
      btcBalance: 0
    };

    DemoAccount.findOne.mockResolvedValue(mockAccount);

    const req = {
      body: {
        userId: '123',
        pair: 'BTC/USD',
        amount: 1,
        price: 20000,
        type: 'buy'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Act
    await createDemoTransaction(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('insuficiente')
      })
    );
  });

  it('should fail if user has insufficient crypto for sell', async () => {
    // Similar al test anterior pero para venta
  });

  it('should handle database errors gracefully', async () => {
    // Arrange
    DemoAccount.findOne.mockRejectedValue(new Error('Database error'));

    const req = {
      body: {
        userId: '123',
        pair: 'BTC/USD',
        amount: 1,
        price: 20000,
        type: 'buy'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Act
    await createDemoTransaction(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String)
      })
    );
  });
});
