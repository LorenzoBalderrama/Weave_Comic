import readline from 'readline';
import * as weave from 'weave';
import { config } from '../utils/config.js';
import { fetchMarvelData, testMarvelConnection } from '../api/marvel.js';
import { generateOpenAIResponse, extractCharacterName } from '../api/openai.js';
import { evaluateResponseWithGemini } from '../api/gemini.js';

// Initialize Weave
await weave.init(config.weave.project);

// Step 1: Extract Character Name from OpenAI
const extractCharacterNameOp = weave.op(async (query: string) => {
    console.log("Extracting Marvel character name from query...");
    return await extractCharacterName(query);
});

// Step 2: Fetch Marvel Data
const fetchMarvelDataOp = weave.op(async (characterName: string) => {
    console.log(`Fetching Marvel data for: ${characterName}`);
    return await fetchMarvelData(characterName);
});

// Step 3: Generate OpenAI Response
const generateOpenAIResponseOp = weave.op(async (query: string, marvelData: any) => {
    console.log("Generating OpenAI response...");
    return await generateOpenAIResponse(query, marvelData);
});

// Step 4: Evaluate with Gemini
const evaluateResponseWithGeminiOp = weave.op(async (query: string, openAIResponse: string, marvelData: any) => {
    console.log("Evaluating response with Gemini...");
    return await evaluateResponseWithGemini(query, openAIResponse, marvelData);
});

// Step 5: Full Process with Tracing
const processQuery = weave.op(async (query: string) => {
    try {
        const characterName = await extractCharacterNameOp(query);
        const marvelData = characterName ? await fetchMarvelDataOp(characterName) : null;
        const openAIResponse = await generateOpenAIResponseOp(query, marvelData);
        const geminiEvaluation = await evaluateResponseWithGeminiOp(query, openAIResponse, marvelData);

        const evaluationTrace = {
            query,
            extracted_character: characterName || "None",
            openai_response: openAIResponse,
            marvel_data: marvelData,
            evaluation: geminiEvaluation,
            quality_score: geminiEvaluation?.quality_score || 0,
            timestamp: new Date().toISOString()
        };

        return evaluationTrace;
    } catch (error) {
        console.error("Error in processQuery:", error);
        throw error;
    }
});

// CLI for Testing
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const startCLI = async () => {
    rl.question('Enter a Marvel-related query (or type "exit" to quit): ', async (query: string) => {
        if (query.toLowerCase() === 'exit') {
            console.log("Exiting...");
            rl.close();
            return;
        }
        try {
            const result = await processQuery(query);
            console.log('Processed Query Result:', result);
        } catch (error) {
            console.error('Error processing query:', error);
        }
        startCLI();
    });
};

// Ensure Marvel API is working before starting
console.log('Testing Marvel API connection...');
const marvelConnected = await testMarvelConnection();
if (!marvelConnected) {
    console.error('Failed to connect to Marvel API. Please check your configuration.');
    process.exit(1);
}

startCLI();