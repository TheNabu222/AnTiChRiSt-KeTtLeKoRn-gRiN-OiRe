# AnTiChRiSt KeTtLeKoRn gRiN OiRe

This repository contains the exported notes and prototype applications from the
AnTiChRiSt KeTtLeKoRn project. The main archive is the file
`8ccda291e (5).zip` which bundles research documents, Next.js and Vite apps,
and utility scripts.

## Archive contents

- `antichrist-kettlekorn/` – Next.js based interface with various UI
  components and Prisma integration.
- `zettelkasten_ai_app/` – Vite + React application for exploring the
  Zettelkasten knowledge base with optional Google Gemini AI integration.
- `parse_trunks.py` – Python script used to extract trunk content from uploaded
  text files.
- `Uploads/` – supporting HTML pages, text documents and screenshots.
- Several analysis reports in PDF and Markdown formats.

## Running the applications

1. **Antichrist Kettlekorn (Next.js)**
   ```bash
   cd "antichrist-kettlekorn/app"
   npm install
   npm run dev
   ```
   The app starts on http://localhost:3000 by default.

2. **Zettelkasten AI App (Vite)**
   ```bash
   cd "zettelkasten_ai_app"
   npm install
   npm run dev
   ```
   Configure a `.env` file with your Gemini API key to enable AI features.

3. **Parsing trunks**
   The `parse_trunks.py` script expects an input text file path to be set in the
   script. Edit `input_file` and `output_file` variables and run:
   ```bash
   python parse_trunks.py
   ```
   The resulting Markdown file will contain the extracted trunk content.

## Zettels export

`AnTiChRiSt_KeTtLeKoRn_Zettels_2025-06-02.md` is an example export of the
knowledge base and can be used with the apps above.

