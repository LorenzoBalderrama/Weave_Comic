# Marvel Comics RAG Evaluation System

A Retrieval-Augmented Generation (RAG) system that evaluates Marvel Comics knowledge using multiple Language Models (LLMs) and the official Marvel API. The system combines OpenAI's GPT-4 for initial responses, Marvel API for factual data, and Anthropic's Claude for evaluation.

## Features

- 🦸‍♂️ Intelligent character name extraction from user queries
- 📚 Real-time Marvel Comics data retrieval
- 🤖 RAG-enhanced responses using GPT-4
- ✅ Quality evaluation using Claude
- 📊 Weave integration for ML operation tracking
- 💻 Interactive CLI interface

## System Architecture

```
User Query
    ↓
1. Character Extraction (GPT-4)
    ↓
2. Marvel API Data Retrieval
    ↓
3. RAG Response Generation (GPT-4)
    ↓
4. Response Evaluation (Claude)
    ↓
Final Output with Quality Score
```

## Prerequisites

- Node.js (ES2022 or later)
- TypeScript
- API Keys:
  - OpenAI API Key
  - Marvel API (Public & Private Keys)
  - Anthropic API Key
  - Weave Project Key

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```plaintext
OPENAI_API_KEY=your_openai_key
MARVEL_PUBLIC_KEY=your_marvel_public_key
MARVEL_PRIVATE_KEY=your_marvel_private_key
ANTHROPIC_API_KEY=your_anthropic_key
WEAVE_PROJECT=marvel_comics
```

## Usage

Start the application:
```bash
npm run dev
```

The CLI will prompt you to enter Marvel-related questions. Example:
```bash
Enter a Marvel-related query (or type "exit" to quit): Who is Spider-Man's main nemesis?
```

## Project Structure

```
src/
├── api/
│   ├── anthropic.ts    # Claude evaluation integration
│   ├── gemini.ts       # Gemini evaluation service
│   ├── marvel.ts       # Marvel API integration
│   ├── openai.ts       # OpenAI integration
│   └── weave.ts        # Weave initialization
├── services/
│   └── main.ts         # Main application logic
└── utils/
    └── config.ts       # Configuration management
```

## Development

Run in development mode with hot reloading:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

## Error Handling

The system includes comprehensive error handling for:
- Invalid API keys
- Marvel API connection issues
- LLM response failures
- Character extraction errors

## Configuration

The system uses TypeScript for type safety and includes:
- ES Modules support
- Strict type checking
- Module resolution for Node.js
- JSON module support

## Dependencies

- `@anthropic-ai/sdk`: Claude API integration
- `openai`: OpenAI API integration
- `axios`: HTTP client for Marvel API
- `weave`: ML operation tracking
- `dotenv`: Environment variable management
- `typescript`: Type safety and compilation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- Never commit your `.env` file
- Regularly rotate API keys
- Validate all user inputs
- Handle errors securely

## License

This project is licensed under the ISC License.

## Acknowledgments

- Marvel Comics API for character data
- OpenAI for GPT-4 integration
- Anthropic for Claude integration
- Weave for ML operation tracking
