# Trunk Parser

`parse_trunks.py` extracts "trunk" entries from the exported chat log and writes a structured markdown file.

## Usage

```bash
python parse_trunks.py --input path/to/file --output output.md
```

Both arguments are optional. If omitted, the script defaults to `Uploads/Untitled 4.txt` as the input file and writes the results to `extracted_trunks_1000-24000.md`.
