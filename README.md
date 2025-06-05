# Trunk Parser

`parse_trunks.py` extracts trunk entries from a text file and generates a structured markdown summary.

## Usage

```bash
python3 parse_trunks.py INPUT_FILE [OUTPUT_FILE]
```

- `INPUT_FILE`: path to the text file containing the raw trunk content.
- `OUTPUT_FILE`: optional path for the generated markdown (default `extracted_trunks_1000-24000.md`).

Example:

```bash
python3 parse_trunks.py AnTiChRiSt_KeTtLeKoRn_Zettels_2025-06-02.md results.md
```

