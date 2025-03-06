import { GoogleGenerativeAI } from "@google/generative-ai";
import { Chatbot } from '../models/index.js';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const sendMessage = async (req, res) => {
  const { message } = req.body;
  console.log("Mensaje recibido en controlador:", message);

  try {
    const summarizedMessage = await summarizeMessage(message);

    const botResponse = await getBotResponse(summarizedMessage);

    await Chatbot.create({
      userMessage: message,
      botResponse: botResponse.substring(0, 255) 
    });

    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Error al procesar el mensaje del chatbot');
  }
};

const getBotResponse = async (message) => {
  try {
    console.log("Enviando mensaje a Google Gemini:", message);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Actúa como un experto en trading y finanzas. Responde de forma clara y precisa. Y ademas a ti no te gusta cuando te preguntan algo no relacion al trading, en ese caso siempre dices "No tiene nada relacionado a lo que enseño" Pregunta: "${message}"`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log("Respuesta de Gemini AI:", response);
    return response;
  } catch (error) {
    console.error("Error al conectar con Google AI:", error);
    return "Hubo un problema al conectar con el chatbot";
  }
};

const summarizeMessage = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Resume lo más importante de esta pregunta en un máximo de 250 caracteres: "${message}"`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().substring(0, 250);

    console.log("Pregunta resumida:", summary);
    return summary;
  } catch (error) {
    console.error("Error al resumir mensaje:", error);
    return message.substring(0, 250);
  }
};

const isTradingRelated = (message) => {
  const keywords = ["trading", "inversión", "mercado", "acciones", "criptomonedas", "forex", "bolsa", "estrategia"];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
};

export { sendMessage };
