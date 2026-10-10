# Little Harbor: notes for Claude Code

Read `DESIGN.md` first. It describes everything already built, the data tables, save format, and the roadmap.

## Project
- Mobile-first pixel-art browser game. Primary device: **iPhone 14 in Safari** (about 390 x 844). Must also work with keyboard on desktop.
- The game is plain JavaScript on a 2D canvas, no libraries. `index.html` holds the page markup and loads `css/style.css` and the files under `js/` (see "Code layout" in DESIGN.md). Hosted as static files (GitHub Pages), so no build step is required. Prefer plain ES modules loaded from `index.html` over a bundler.
- The `js/` files are classic scripts that share one global scope and run in the order listed in `index.html`. Keep that order when adding files, and add every new file there (the smoke test checks this).
- The owner works mainly from an iPhone and tests by opening the hosted link in Safari. Keep the page fast and the controls thumb-friendly.

## First job
Split `index.html` into modules **without changing behaviour**: data tables (items, recipes, skills, shops), world generation, rendering and sprites, game systems (stats, fishing, gathering, crafting, stations, home and garden, combat), and UI screens (bag, skills, map, shops, crafting). Keep the visible game identical. Then add automated tests (see below) and a GitHub Pages deploy.

## Rules that matter
1. **Never break saves.** Key `little-harbor-v1`. Add new fields with defaults in `fresh()`; migrate old data; bump `SAVE_V` only when a real migration is needed. Keep the `wv` world-version migration.
2. **Data-driven content.** New items, recipes and skills should be added as table rows, not new code paths.
3. **Do not remove the TESTING switches** (`TEST_GRANTS`, `TEST_KITS`, `TEST_SHOW_FULL_MAP`) until the owner says so.
4. Keep tile type numbers stable (see DESIGN.md) because saves refer to tile indices.
5. Work on a branch per feature, small commits, and describe changes plainly in the pull request. The owner reviews on a phone.

## Testing
- Use Playwright (headless Chromium, and WebKit if available since Safari is the target) to load the page with a seeded save in `localStorage`, then drive the real UI by tapping buttons.
- Minimum checks for each change: page loads with no `pageerror`, the player can move, the world is connected (sea reaches every island, key routes are walkable), the bag/shop/crafting screens open, and old saves still load.
- Draw a frame at many map positions to catch rendering errors (`draw()` is global).

## Names and dialogue lists
- `NAMES.md` and `DIALOGUE.md` list every named character and spoken line. Whenever you add or change a person or a line, run `python3 tools/make_lists.py` and commit the two files; the smoke test fails if they are out of date.
- Every line you write is a placeholder until the owner writes his own. Lines the owner has written go in `JACKS_LINES.txt` (exact text, one per row) so they show as "Jack's". Never change or remove an existing line without being asked.

## Talking to the owner
- The owner is not a programmer and has no coding experience. Explain everything in plain, everyday words.
- Avoid jargon. If a technical word is needed (branch, pull request, merge), explain it briefly the first time.
- Describe changes by what the player will see or do, not by code. Keep it short: the owner reads on a phone.
- When something needs the owner to act (a setting on GitHub, merging a pull request), give simple step-by-step instructions.
- If a request is unclear, ask a short question instead of guessing.

## Style
- Pixel-art look, FireRed-style menus, Stardew-style skills. Fonts: Pixelify Sans with a monospace fallback.
- Plain, friendly in-game text. Short messages on a phone-sized screen.
