import axios from 'axios';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const generateOpenAIResponse = async (query, marvelData) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [{ role: 'system', content: 'You are a Marvel expert.' }, { role: 'user', content: query }],
        }, {
            headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
        });
        return response.data.choices[0].message.content;
    }
    catch (error) {
        console.error('Error generating OpenAI response:', error);
        return null;
    }
};
