import readline from 'readline';
import { evaluateResponse } from '../api/weave.js';
import * as weave from 'weave';
import { fetchMarvelData } from '../api/marvel.js'
import { generateOpenAIResponse } from '../api/openai.js'
import { evaluateResponseWithGemini } from '../api/gemini.js'

// Initialize weave properly with async initialization
async function initializeWeave() {
    try {
        await weave.init('marvel_comics');
        console.log('Weave initialized successfully');
    } catch (error) {
        console.error('Error initializing weave:', error);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Update processQuery to use all three APIs in sequence
const processQuery = weave.op(async (query: string) => {
    try {
        // 1. First try Marvel API
        console.log("Fetching Marvel data...");
        const marvelData = await fetchMarvelData(query);
        
        // 2. Get OpenAI response with Marvel context
        console.log("Generating OpenAI response...");
        const openAIResponse = await generateOpenAIResponse(query, marvelData);
        
        // 3. Use Gemini for evaluation/grounding
        console.log("Getting Gemini grounding...");
        const geminiGrounding = await evaluateResponseWithGemini(query, openAIResponse, marvelData);
        
        // 4. Evaluate the response
        return evaluateResponse(query, openAIResponse, marvelData);
    } catch (error) {
        console.error('Error in processQuery:', error);
        throw error;
    }
});

const startCLI = async () => {
    // Initialize weave before starting the CLI
    await initializeWeave();
    
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

        // Keep prompting the user
        startCLI();
    });
};

// Start interactive testing with async initialization
startCLI();
