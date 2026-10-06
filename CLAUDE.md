# Little Harbor: notes for Claude Code

Read `DESIGN.md` first. It describes everything already built, the data tables, save format, and the roadmap.

## Project
- Mobile-first pixel-art browser game. Primary device: **iPhone 14 in Safari** (about 390 x 844). Must also work with keyboard on desktop.
- Right now the whole game is one file, `index.html` (about 112 KB, plain JavaScript on a 2D canvas, no libraries). Hosted as static files (GitHub Pages), so no build step is required. Prefer plain ES modules loaded from `index.html` over a bundler.
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

## Style
- Pixel-art look, FireRed-style menus, Stardew-style skills. Fonts: Pixelify Sans with a monospace fallback.
- Plain, friendly in-game text. Short messages on a phone-sized screen.
