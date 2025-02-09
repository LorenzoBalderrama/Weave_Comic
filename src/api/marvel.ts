import axios from 'axios';
import crypto from 'crypto';
import { config } from '../utils/config.js';
import * as weave from 'weave';

export const fetchMarvelData = weave.op(async (characterName: string) => {
    try {
        // Generate timestamp and hash for Marvel API authentication
        const ts = new Date().getTime().toString();
        const hash = crypto
            .createHash('md5')
            .update(ts + config.marvel.privateKey + config.marvel.apiKey)
            .digest('hex');

        // Build the Marvel API URL with authentication parameters
        const url = `${config.marvel.baseUrl}/characters`;
        const params = {
            ts,
            apikey: config.marvel.apiKey,
            hash,
            name: characterName,  // Now using extracted clean name
            limit: 1
        };

        const response = await axios.get(url, { params });
        
        // Log API response for debugging
        console.log('Marvel API Response:', JSON.stringify(response.data, null, 2));

        return response.data.data.results.length > 0 ? response.data.data.results[0] : null;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Marvel API Error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        } else {
            console.error('Error fetching Marvel data:', error.message);
        }
        return null;
    }
});

// Function to test Marvel API connection
export const testMarvelConnection = weave.op(async () => {
    try {
        const ts = new Date().getTime().toString();
        const hash = crypto
            .createHash('md5')
            .update(ts + config.marvel.privateKey + config.marvel.apiKey)
            .digest('hex');

        const url = `${config.marvel.baseUrl}/characters`;
        const params = {
            ts,
            apikey: config.marvel.apiKey,
            hash,
            limit: 1
        };

        const response = await axios.get(url, { params });
        console.log('Marvel API Test Connection Successful');
        return true;
    } catch (error: any) {
        console.error('Marvel API Test Connection Failed:', {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        return false;
    }
});