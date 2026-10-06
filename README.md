# Little Harbor

A pixel-art fishing and exploration game for phones.

**Play:** https://jackcathro-jethro92.github.io/Little-Harbor/

- `DESIGN.md` describes the game, the save format and the code layout.
- Tests: `pip install playwright && python -m playwright install chromium webkit`, then `python tests/smoke_test.py`.
- Every pull request runs the smoke test in Chromium and WebKit. Every push to `main` that passes is published to GitHub Pages.
