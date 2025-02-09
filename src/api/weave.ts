import * as weave from 'weave';
import { config } from 'dotenv';
config();

// Initialize Weave
const PROJECT = 'marvel_comics';
await weave.init(PROJECT);

// Define a custom evaluation function
export const evaluateResponse = async (query: string, openAIResponse: string, marvelData: any) => {
    // Example evaluation: Check if the OpenAI response contains the correct Marvel character name
    const characterName = marvelData?.name || '';
    const accuracyScore = openAIResponse.includes(characterName) ? 1 : 0;
    
    const evaluation = {
        query,
        openai_response: openAIResponse,
        marvel_data: marvelData,
        accuracy_score: accuracyScore,
        timestamp: new Date().toISOString()
    };

    console.log('Evaluation Result:', evaluation);
    return evaluation;
};