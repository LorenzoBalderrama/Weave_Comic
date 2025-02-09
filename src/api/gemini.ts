import axios from 'axios';
import { config } from '../utils/config.js';

export const evaluateResponseWithGemini = async (query: string, openAIResponse: string, marvelData: any) => {
    try {
        // Validate API key before making request
        if (!config.gemini.apiKey) {
            throw new Error('Gemini API key is not configured');
        }

        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
            {
                contents: [{
                    parts: [{
                        text: `Evaluate this response based on accuracy, completeness, and clarity: ${openAIResponse}. Marvel data: ${JSON.stringify(marvelData)}`
                    }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.gemini.apiKey}`
                }
            }
        );
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.error('Invalid or expired Gemini API key. Please check your configuration.');
            } else {
                console.error(`Gemini API error (${error.response?.status}):`, error.response?.data);
            }
        } else {
            console.error('Error evaluating with Gemini:', error.message);
        }
        return null;
    }
};
