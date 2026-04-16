import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import tempfile
import textwrap
from parse_trunks import parse_trunks

def test_simple_trunks():
    sample = textwrap.dedent('''\
    🌐 1 — Consciousness (Trunk 1000)
    Aries | Mars | Something
    - [1000/1] ← 1100 :: Hermetics
    > Desc
    🤝 2 — Relations (Trunk 2000)
    Libra | Something
    - [2000/1] ← 2100 :: Example
    > Example desc
    ''')
    with tempfile.NamedTemporaryFile('w+', encoding='utf-8', delete=False) as f:
        f.write(sample)
        name = f.name
    result = parse_trunks(name)
    assert 1000 in result
    assert 2000 in result
    assert result[1000]['title'] == 'Consciousness'
    assert result[2000]['entries'][0]['title'] == 'Example'
