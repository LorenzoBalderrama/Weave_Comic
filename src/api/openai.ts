import { OpenAI } from 'openai';
import { config } from '../utils/config.js';
import * as weave from 'weave';
import axios from 'axios';

const openai = weave.wrapOpenAI(new OpenAI({ apiKey: config.openai.apiKey }));

weave.init('marvel_comics');

// Function to fetch the latest prompt from Python service
async function fetchPrompt(): Promise<string | null> {
    try {
        const response = await axios.get('http://127.0.0.1:8000');
        return response.data.content || null;
    } catch (error) {
        return null;
    }
}

// Function to send a new prompt to Python
async function addNewPrompt(name: string, content: string) {
    try {
        await axios.post("http://127.0.0.1:8000/prompts/add", { name, content });
    } catch (error) {}
}

export const extractCharacterName = weave.op(async (query: string): Promise<string | null> => {
    try {
        const promptTemplate = await fetchPrompt();
        const prompt = promptTemplate 
            ? `${promptTemplate}\n\n"${query}"` 
            : `Extract the Marvel character name from this question. Only return the character name, nothing else:\n\n"${query}"`;
        
        console.log("📝 Using prompt:", prompt);

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: prompt }],
            temperature: 0.3
        });
        
        const extractedName = response.choices[0]?.message?.content?.trim();
        console.log("🔍 Extracted character name:", extractedName);
        return extractedName || null;
    } catch (error) {
        return null;
    }
});

export const generateOpenAIResponse = weave.op(async (query: string, marvelData: any): Promise<string> => {
    try {
        const promptTemplate = await fetchPrompt();
        const prompt = promptTemplate 
            ? `${promptTemplate}\n\n"${query}"` 
            : `You are a Marvel expert. Answer the following question with accurate information:\n\n"${query}"`;

        console.log("📝 Using prompt for OpenAI:", prompt);

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: prompt }],
            temperature: 0.5
        });

        return response.choices[0]?.message?.content?.trim() || "I'm not sure about that.";
    } catch (error) {
        return "Error processing your request.";
    }
});
