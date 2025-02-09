import { config } from 'dotenv';
import * as weave from 'weave';

config();

weave.init('marvel_comics');
export const MARVEL_API_KEY = process.env.MARVEL_PUBLIC_KEY || '';
export const MARVEL_PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY || '';
export const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const WEAVE_PROJECT = process.env.WEAVE_PROJECT || '';