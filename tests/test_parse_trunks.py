import tempfile
from parse_trunks import parse_trunks

def test_parse_single_trunk(tmp_path):
    sample = (
        "\n"
        "🌐 1000 — Example trunk\n"
        "1000)\n"
        "- [1000/1] ← 1100 :: Hermetics\n"
    )
    file_path = tmp_path / "sample.txt"
    file_path.write_text(sample, encoding="utf-8")
    trunks = parse_trunks(str(file_path))
    assert 1000 in trunks
    trunk = trunks[1000]
    assert trunk["title"] == "Example trunk"
    assert trunk["entries"][0]["title"] == "Hermetics"
