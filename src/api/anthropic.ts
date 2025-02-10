import * as weave from 'weave';
import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

weave.init('marvel_comics');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const evaluateResponseWithAnthropic = weave.op(async (query: string, openAIResponse: string, marvelData: any) => {
    try {
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 100,
            messages: [
                {
                    role: "user",
                    content: `Evaluate the accuracy of the response for the following Marvel question.
                    - Question: ${query}
                    - OpenAI Response: ${openAIResponse}
                    - Marvel API Data: ${JSON.stringify(marvelData, null, 2)}
                    
                    Respond **only** in JSON format like this:
                    \`\`\`json
                    {
                        "quality_score": 0.0 // a number between 0 and 1
                    }
                    \`\`\`

                    Ensure the response **only** contains valid JSON and no extra text.`
                }
            ]
        });

        // Extract text response safely
        const textResponse = response.content
            .map(block => ("text" in block ? block.text : ""))
            .join(" ")
            .trim();

        // Extract JSON from response (ignoring surrounding text if any)
        const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/);
        const jsonResponse = jsonMatch ? jsonMatch[1] : textResponse;

        // Safely parse JSON
        const parsedResponse = JSON.parse(jsonResponse);

        return parsedResponse.quality_score || 0;
    } catch (error) {
        console.error("Anthropic evaluation error:", error);
        return 0;
    }
});