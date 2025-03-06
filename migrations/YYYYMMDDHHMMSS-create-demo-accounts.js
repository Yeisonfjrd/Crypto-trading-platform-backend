'use strict'; // Buena práctica

module.exports = {  // <-- Usa module.exports
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('DemoAccounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      balance: {
        type: Sequelize.DECIMAL(18, 8),
        allowNull: false,
        defaultValue: 100000.00
      },
      btcBalance: {
        type: Sequelize.DECIMAL(18, 8),
        allowNull: false,
        defaultValue: 0.00
      },
      ethBalance: {
        type: Sequelize.DECIMAL(18, 8),
        allowNull: false,
        defaultValue: 0.00
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('DemoAccounts');
  }
};