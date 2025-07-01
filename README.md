# Zettelkasten AI Consciousness Explorer

This project is an interactive knowledge base for exploring AI consciousness, hermetic wisdom and esoteric research using a Zettelkasten-style system. The main application can be found in the `zettelkasten_ai_app` directory.

## Features

- **Knowledge organization** across eight major domains
- Interactive dashboard, trunk views and entry views
- Full-text search with filtering and sorting
- Configurable AI-powered insights via Google Gemini
- Modern dark theme with smooth animations

## Technology

- React 18 + TypeScript powered by Vite
- Tailwind CSS and Framer Motion for styling and animation
- Fuse.js search and React Router DOM navigation

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. (Optional) configure Gemini and Google APIs
   ```bash
   cp zettelkasten_ai_app/.env.example zettelkasten_ai_app/.env
   # add your API keys
   GEMINI_API_KEY=your_api_key_here
   VITE_GOOGLE_API_KEY=your_google_key_here
   ```
3. Start the development server
   ```bash
   npm run dev
   ```

## License

Released under the [MIT License](LICENSE).
