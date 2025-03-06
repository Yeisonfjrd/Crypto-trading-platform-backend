import express from 'express';
import { sendMessage } from '../controllers/chatbotController.js';

const router = express.Router();

// Ruta POST: http://localhost:3001/api/chatbot/
router.post('/', sendMessage);

export default router;