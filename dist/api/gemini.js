import axios from 'axios';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const evaluateResponseWithGemini = async (query, openAIResponse, marvelData) => {
    try {
        const response = await axios.post('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
            prompt: `Evaluate this response based on accuracy, completeness, and clarity: ${openAIResponse}. Marvel data: ${JSON.stringify(marvelData)}`,
        }, {
            headers: { Authorization: `Bearer ${GEMINI_API_KEY}` }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error evaluating with Gemini:', error);
        return null;
    }
};
