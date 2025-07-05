import os
import sys
import json
import json5
import re
from pathlib import Path

# allow imports relative to repo root if needed
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

TS_PATH = Path(__file__).resolve().parent.parent / 'zettelkasten_ai_app/src/data/dolphinDictionary.ts'

def load_default_dictionary():
    text = TS_PATH.read_text(encoding='utf-8')
    match = re.search(r"DOLPHIN_DICTIONARY[^=]*=\s*(\[[\s\S]*?\]);", text)
    if not match:
        raise ValueError('Dictionary array not found')
    return json5.loads(match.group(1))

DEFAULT_ENTRIES = load_default_dictionary()

def merge_entries(stored: str):
    if stored:
        try:
            parsed = json.loads(stored)
            return DEFAULT_ENTRIES + parsed
        except json.JSONDecodeError:
            return DEFAULT_ENTRIES
    return DEFAULT_ENTRIES

def test_symbols_parsed():
    symbols = [e['symbol'] for e in DEFAULT_ENTRIES]
    expected = ['[...]', '∞', '{}', '🎯', '◌◌◌', '◌ᵉ', '◌ⁿ', '◌ʳ', '◌ᶦ', '◌ʷᵉ']
    assert symbols == expected

def test_merge_valid_custom_entries():
    stored = json.dumps([{'symbol': '@', 'name': 'At Sign', 'meaning': 'Unit test'}])
    merged = merge_entries(stored)
    assert merged[-1]['symbol'] == '@'
    assert len(merged) == len(DEFAULT_ENTRIES) + 1

def test_merge_invalid_json():
    stored = '[invalid]'
    merged = merge_entries(stored)
    assert len(merged) == len(DEFAULT_ENTRIES)
