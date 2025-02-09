import axios from 'axios';
import crypto from 'crypto';
import { config } from 'dotenv';
config();
const MARVEL_API_KEY = process.env.MARVEL_API_KEY;
const MARVEL_PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY;
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';
const getMarvelAuthParams = () => {
    const ts = new Date().getTime().toString();
    const hash = crypto.createHash('md5').update(ts + MARVEL_PRIVATE_KEY + MARVEL_API_KEY).digest('hex');
    return { ts, apikey: MARVEL_API_KEY, hash };
};
export const fetchMarvelData = async (query) => {
    try {
        const { ts, apikey, hash } = getMarvelAuthParams();
        const response = await axios.get(`${MARVEL_BASE_URL}/characters`, {
            params: { name: query, ts, apikey, hash }
        });
        return response.data.data.results[0];
    }
    catch (error) {
        console.error('Error fetching Marvel data:', error);
        return null;
    }
};
