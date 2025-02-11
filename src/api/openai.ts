import { OpenAI } from 'openai';
import { config } from '../utils/config.js';
import * as weave from 'weave'

const openai = weave.wrapOpenAI(new OpenAI({ apiKey: config.openai.apiKey }));

weave.init('marvel_comics');

export const extractCharacterName = weave.op(async (query: string): Promise<string | null> => {
    try {
        const prompt = `Extract the Marvel character name from this question. Only return the character name, nothing else:\n\n"${query}"`;
        
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: prompt }],
            temperature: 0.3
        });
        
        const extractedName = response.choices[0]?.message?.content?.trim();
        return extractedName || null;
    } catch (error) {
        console.error("Error extracting character name:", error);
        return null;
    }
});

export const generateOpenAIResponse = weave.op(async (query: string, marvelData: any): Promise<string> => {
    try {
        let prompt = `You are a Marvel expert. Answer the following question with accurate information.`;
        
        if (marvelData) {
            prompt += `\n\nHere is relevant data from the Marvel API:\n${JSON.stringify(marvelData, null, 2)}`;
        }
        
        prompt += `\n\nQuestion: ${query}\nAnswer:`;
        
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: prompt }],
            temperature: 0.7
        });
        
        return response.choices[0]?.message?.content?.trim() || "I couldn't find an answer to your question.";
    } catch (error) {
        console.error("Error generating OpenAI response:", error);
        return "I encountered an error while generating a response.";
    }
});