'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Transactions', 'userId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Transactions', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};