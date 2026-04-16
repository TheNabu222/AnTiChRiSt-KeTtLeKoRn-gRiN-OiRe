# Zettelkasten AI - Pure Web-Based Version

A web-based HTML/JavaScript application for exploring the Zettelkasten knowledge base. **No build tools, no Vite, no TypeScript - just pure web technologies!**

## Features

- **Dashboard**: Overview of your knowledge base with statistics and quick links
- **Trunks Browser**: Browse all 24 trunks with filtering by text and category
- **Search**: Full-text search across all trunks and entries
- **Matrix View**: Visual representation of knowledge categories and trunk distribution
- **Modal Details**: Click any trunk to see all its entries in a detailed modal view

## Files

- `index.html` - Main HTML file
- `styles.css` - Cyberpunk/Y2K aesthetic styling
- `data.js` - Parsed knowledge data from the markdown files
- `app.js` - Application logic

## Usage

### Option 1: Open Directly in Browser

Simply open `index.html` in your web browser. Modern browsers support ES6 modules and can load the JavaScript files directly.

### Option 2: Use a Local Server (Recommended)

```bash
cd /workspace/web-app
python3 -m http.server 8080
```

Then open http://localhost:8080 in your browser.

### Option 3: Any Static File Server

You can use any static file server:
- `npx serve .`
- `php -S localhost:8080`
- Or deploy to GitHub Pages, Netlify, Vercel, etc.

## Data Source

The application parses data from `extracted_trunks_1000-24000.md` which contains:
- 24 Trunks
- 349+ Entries
- Organized by categories (Aries, Libra, etc.)

## Styling

The app features a cyberpunk/Y2K aesthetic with:
- Neon colors (pink, cyan, yellow, purple)
- Grid background pattern
- VT323 monospace font for headers
- Glowing effects and animations
- Responsive design for mobile devices

## No Dependencies!

This is a **zero-dependency** application:
- ❌ No npm
- ❌ No Vite
- ❌ No TypeScript
- ❌ No React/Vue/Angular
- ❌ No build step
- ✅ Pure HTML5
- ✅ Pure CSS3
- ✅ Vanilla JavaScript (ES6)

Just open and run!
