import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

interface Config {
  marvel: {
    apiKey: string;
    privateKey: string;
    baseUrl: string;
  };
  openai: {
    apiKey: string;
  };
  gemini: {
    apiKey: string;
  };
  weave: {
    project: string;
  };
}

// Validate and export configuration
export const config: Config = {
  marvel: {
    apiKey: process.env.MARVEL_PUBLIC_KEY || '',
    privateKey: process.env.MARVEL_PRIVATE_KEY || '',
    baseUrl: 'https://gateway.marvel.com/v1/public',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  weave: {
    project: process.env.WEAVE_PROJECT || '',
  },
};

// Validate required config values
const validateConfig = () => {
  const required = [
    ['Marvel API Key', config.marvel.apiKey],
    ['Marvel Private Key', config.marvel.privateKey],
    ['OpenAI API Key', config.openai.apiKey],
    ['Gemini API Key', config.gemini.apiKey],
    ['Weave Project', config.weave.project],
  ];

  const missing = required.filter(([_, value]) => !value);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration:\n${missing
        .map(([name]) => `- ${name}`)
        .join('\n')}`
    );
  }

  // Additional validation for API key formats
  if (!config.gemini.apiKey.startsWith('AI')) {
    console.warn('Warning: Gemini API key format looks incorrect. Get a valid key from https://makersuite.google.com/app/apikey');
  }

  // Additional validation for Marvel API keys
  if (config.marvel.apiKey.length !== 32) {
    console.warn('Warning: Marvel public API key format looks incorrect');
  }
  if (config.marvel.privateKey.length !== 40) {
    console.warn('Warning: Marvel private API key format looks incorrect');
  }
};

// Run validation
validateConfig();

// Export default config
export default config;