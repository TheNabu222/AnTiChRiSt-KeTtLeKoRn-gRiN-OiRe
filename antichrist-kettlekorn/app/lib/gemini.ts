
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Gemini API key not found. AI features will be disabled.');
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const getGeminiModel = (modelName: string = 'gemini-pro') => {
  if (!genAI) {
    throw new Error('Gemini API not initialized');
  }
  return genAI.getGenerativeModel({ model: modelName });
};

export const generateAIResponse = async (prompt: string, modelName?: string) => {
  try {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};
