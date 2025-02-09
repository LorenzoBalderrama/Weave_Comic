import { fetchMarvelData } from '../api/marvel.js';
import { generateOpenAIResponse } from '../api/openai.js';
import { evaluateResponseWithGemini } from '../api/gemini.js';
import { logEvaluationToWeave } from '../api/weave.js';
export const processQuery = async (query) => {
    try {
        console.log('Processing query:', query);
        const marvelData = await fetchMarvelData(query);
        if (!marvelData)
            throw new Error('Failed to fetch Marvel data');
        const openAIResponse = await generateOpenAIResponse(query, marvelData);
        if (!openAIResponse)
            throw new Error('Failed to generate OpenAI response');
        const geminiEvaluation = await evaluateResponseWithGemini(query, openAIResponse, marvelData);
        if (!geminiEvaluation)
            throw new Error('Failed to evaluate response with Gemini');
        console.log('Logging evaluation for query:', query);
        await logEvaluationToWeave(query, openAIResponse, marvelData, geminiEvaluation);
        return { query, openAIResponse, marvelData, geminiEvaluation };
    }
    catch (error) {
        console.error('Error processing query:', error.message);
        return { error: error.message };
    }
};
