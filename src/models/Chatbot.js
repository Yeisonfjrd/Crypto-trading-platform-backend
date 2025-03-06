// src/models/Chatbot.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Chatbot = sequelize.define('Chatbot', {
  userMessage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  botResponse: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Chatbot;