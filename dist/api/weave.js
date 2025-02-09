import * as weave from 'weave';
import { config } from 'dotenv';
config();
// Initialize Weave properly
const PROJECT = 'marvel_comics';
await weave.init(PROJECT);
// Create or load dataset
let evaluationsDataset = await weave.useDataset('marvel_comics_evaluations');
if (!evaluationsDataset) {
    evaluationsDataset = new weave.Dataset({ name: 'marvel_comics_evaluations' });
    await evaluationsDataset.publish();
}
export const logEvaluationToWeave = async (query, openAIResponse, marvelData, geminiEvaluation) => {
    const evaluationTrace = {
        query,
        openai_response: openAIResponse,
        marvel_data: marvelData,
        evaluation: geminiEvaluation,
        quality_score: geminiEvaluation?.quality_score || 0,
        timestamp: new Date().toISOString()
    };
    console.log('Logging evaluation to Weave:', evaluationTrace);
    // Append data to dataset
    await evaluationsDataset.appendRow(evaluationTrace);
    await evaluationsDataset.publish();
    return evaluationTrace;
};
