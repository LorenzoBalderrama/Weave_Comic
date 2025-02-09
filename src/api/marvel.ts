import axios from 'axios';
import crypto from 'crypto';
import { config } from 'dotenv';
config();

const MARVEL_API_KEY = process.env.MARVEL_PUBLIC_KEY;
const MARVEL_PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY;
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';

const getMarvelAuthParams = () => {
    const ts = new Date().getTime().toString();
    const hash = crypto.createHash('md5').update(ts + MARVEL_PRIVATE_KEY + MARVEL_API_KEY).digest('hex');
    return { ts, apikey: MARVEL_API_KEY, hash };
};

export const fetchMarvelData = async (query: string) => {
    try {
        const { ts, apikey, hash } = getMarvelAuthParams();
        const response = await axios.get(`${MARVEL_BASE_URL}/characters`, {
            params: { 
                nameStartsWith: query.split(' ')[0],
                ts, 
                apikey, 
                hash,
                limit: 1
            }
        });

        if (response.data.data.results && response.data.data.results.length > 0) {
            const character = response.data.data.results[0];
            return {
                name: character.name,
                description: character.description || "No description available",
                thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
                urls: character.urls,
                attribution: response.data.attributionText
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching Marvel data:', error);
        return null;
    }
};
