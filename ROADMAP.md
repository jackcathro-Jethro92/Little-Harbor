# Little Harbor: build roadmap

This is the order the game gets built in. It is written for Claude Code and for Jack, the owner, who is not a programmer and reviews everything on an iPhone.

**How to use it.** Work one step at a time, top to bottom. Each step is its own branch and pull request. A step is finished only when everything under its **Done when** list is true and the tests pass. If a step turns out bigger than expected, split it and explain the split in plain words in the pull request. Do not jump ahead to a later phase without the owner's say-so.

**The big idea.** The world and mechanics come first, and the story's *words* come last. The story's *machinery*, the parts of the game a story needs in order to work, comes early, in Phase 2, so the world is built to fit the story and is never rebuilt around it later. The story is told through a data table: you add a quest by adding rows, not new code.

Read `CLAUDE.md` (rules), `DESIGN.md` (what exists today) and `TEMPLES.md` (approved temple art and how each temple was built) alongside this file.

---

## Where we are now (updated 10 October 2026)

The world is much further along than when this roadmap was first written. Everything below is merged and playable (pull requests up to #18).

**Built and working:**
- **World:** a 320 x 240 tile world with fog of war and the sea connected all the way round, including:
  - the village island and the mainland;
  - the **Walled Settlement**: 15 houses, 18 people, the blacksmith (Garrick), the tailor (Wynn) and the barber (Fenwick), three farms with livestock, and two dogs and a cat;
  - the **Mountain Town**: 8 houses, the goldsmith (Lucie), the **Fighters Guild** and the **Gladiators' Arena** (both enterable), and a north gate with a path up to the Earth temple;
  - the **Darkwood** forest zone and the home interior;
  - a **stone barrier** of jagged rocks along the north-west coast, so the mountain country can only be reached through the Darkwood.
- **Four of the five temples** (world only, no story): the **Earth temple** (plaza, pyramid, sanctum), the **Sea temple** (terraced crater island, boardwalk, courtyard, hall, vault), the **Sky temple** (zigzag hillside island, lantern-lined path, stone circle; the *intact* version only) and the **Fire temple** (volcano island, lava moat, gate, courtyard, fire hall; a little smaller than the others).
- **Pirate Island groundwork:** the island starts empty, and a story switch brings ten pirates, six tents and three ships overnight (see "Story switches" below).
- **Systems:** sailing, simple fishing, 10 skills, 93 items (including enchanted jewellery with buffs), 35 recipes, crafting stations, home and garden, one real-time enemy (the spirit), arena bouts, guild training, hair styles, the FireRed-style bag, and five traders (Bram, Odo, Rue, Garrick, Lucie) plus the tailor and barber screens.
- **Tests and hosting:** GitHub Pages is live and every pull request runs the smoke tests in Chromium and WebKit. The game is already split into modules under `js/` (see `DESIGN.md`).

**Designed but not in the game yet:**
- **The Temple Tower** (art in `art/temples/temple_tower`): the last temple, and its island.
- **The interior designer:** a separate tool at https://claude.ai/artifact/3ABF4QvjFtSdhJYrJc1UEc that exports rooms as JSON. It has 198 props and 19 starter rooms: shops, tavern, inn and so on.
- **A graphics-upgrade mockup:** `art/graphics/graphics_upgrade_mockup.js`, with before and after pictures. The files are in `little-harbor-handoff.zip` and still need unpacking into the repo before Phase 1.
- **The ten-quest story outline:** in this file, Phase 4 onwards. **No quest, dialogue system, battle screen or story state exists yet.**

### Progress at a glance

| Step | Status |
| --- | --- |
| 0.1 Repository and hosting | **Done** |
| 0.2 Module split | **Done** (it was done early, not after the playtest) |
| 2.9b Room list | Not started: a tidy-up to do just before house interiors or taverns (2.10, 6.3) |
| 0.3 Test harness | **Partly:** smoke tests and the automatic test run are done; the 10-spot screenshot script is not |
| Phase 1 graphics upgrade | **Started:** 1.1 ground and water built (10 Oct, pictures in `art/graphics/step_1_1_before_after_*.png`); 1.2 trees and plants built (pictures in `art/graphics/step_1_2_before_after_*.png`); 1.3 buildings built (`art/graphics/step_1_3_before_after_*.png`); 1.4 characters, boats and animals built (`art/graphics/step_1_4_before_after_*.png`); 1.5 objects and stations built (`art/graphics/step_1_5_before_after_*.png`); 1.6 Darkwood and home room built (`art/graphics/step_1_6_before_after_*.png`); 1.7 light built (`art/graphics/step_1_7_before_after.png`; test with `?time=night`); Phase 1 is complete and waiting for Jack's approval |
| 2.1b Title menu and save files | Not started: planned for Sat 17 Oct, no save reminders |
| 2.1 Story state | **Partly:** a simple `S.flags` switch field exists (see below); the full `S.story` is not built |
| 2.6 World variants | **Partly:** the pirate camp has an empty and a populated version; the Sky temple's damaged version is built (switch `sky_damaged`, `applySky`); the other variants are not built |
| 2.2 to 2.5, 2.7 to 2.12 | Not started |
| Phase 3 combat and enemies | Not started (the arena's four bouts and the guild are real-time and will need converting to turn-based under 3.6) |
| Phase 4 first playable slice | Not started |
| Phase 5 temples (the *places*) | **Earth, Sea, Sky (intact) and Fire built; Temple Tower not built.** None of the quests are built. |
| 6.3 Taverns | Not started (the Walled Settlement and Mountain Town have people and shops but no interiors) |

### Your notes (N1 to N13) at a glance

| Note | Status |
| --- | --- |
| N1 Movement | **Done for the first playthrough** (Jack approved, 10 Oct): tap to turn, one tap is one tile, switching direction no longer stops you (see DESIGN.md controls). Walking animation and camera can be adjusted after the playthrough. |
| N2 Sea square | **Done.** Every hidden room (home, Darkwood, guild, arena, all temple halls, the Tower shrine room) now sits in rows 246-299, below the sea you can reach (the map grew from 240 to 300 rows; boats stop at row 239). No outlined square at sea. Old saves are migrated (`S.wv` 3). |
| N3 Cottage | **Done** (10 Oct): moved to (34,158); the road runs unbroken. |
| N4 Stairs | On hold until the shading revamp |
| N5 Shop sub-menus | Not started (also covers Garrick and Lucie) |
| N6 Names list | **Done** (10 Oct): see `NAMES.md` for Jack to review. Nobody has been renamed. |
| N7 Dialogue human-written | **Marked** (10 Oct): `DIALOGUE.md` lists every line as original or placeholder. Nothing was changed. |
| N8, N9, N10, N12, N13 | Not started |
| N11 Ships | **Looks done** (10 Oct): rowboat, sloop, schooner and brig drawn from the reference chart (`art/graphics/ships_new.png`), the trawler became the schooner (saves migrated) and the brig is new (Murl's boatyard, 600,000; shipwright recipe). The crew rule (who can sail which ship) is not built yet: step 6.1 and 6.2. |

### Story switches (what exists today)

A save field `S.flags` holds simple yes/no story switches (`flag()`, `setFlag()` in `js/systems/flags.js`), plus a table of overnight changes (`ARRIVALS`). The first use is the pirates: a quest sets `pirates_called`, and at the next sleep the game sets `pirates_here` and the camp fills (ten pirates, six tents, three ships). Testing link: add `?flags=pirates_here` (or `pirates_called`, then sleep) to the game's address. When step 2.1 is built, these flags move into `S.story.flags`, with a migration so nothing is lost.

### Decisions on the open items (Jack, 10 October 2026)

1. **Hidden rooms and N2:** **move every hidden room off the map** into its own separate space that boats and the map never see (the Darkwood, the home, the guild, the arena, the Earth sanctum, the Sea hall and vault, the Fire gatehouse and fire hall, and every room added later). Doors, gates and old saves must keep working. This is the fix for N2.
2. **Filler dialogue (N7):** **mark every line I added as a placeholder** (townsfolk, farmers, guild, arena, pirates, the blacksmith, tailor and barber) and list them for Jack. He writes the real lines after the playtests. His original village lines stay word for word.
3. **Sky temple damaged version:** build it **before the roadmap officially starts**, as a version that can be switched on when Quest 6 needs it (see "Before the roadmap starts" below).
4. **Pirates:** they move onto the island after Quest 1, but **pirate ships block the island until the story opens it** (step 3.5). The camp is only visited after Quest 9, when the pirates leave.
5. **Temple Tower:** **finish it and its island before the roadmap starts.**

### Before the roadmap officially starts: finish the temples (decided 10 October)

Do these first, one pull request each, then begin the roadmap at N1:
1. **Fire temple fixes.** Done so far: the great gate's black doorway is now a **real door** (face it and press Use; a short gatehouse room opens, and its far door leads straight into the fire hall; the hall's door leads back to the gatehouse). More Fire issues to fix as Jack finds them.
2. **The Temple Tower's island** (a small island in the south, around (201,196)), then **the Temple Tower** (art in `art/temples/temple_tower`: gravel approach, wooden gate, courtyard, five-storey pagoda, shrine room, hidden chamber below). No story items.
3. **The damaged Sky temple** (art already in `art/temples/sky_stonehenge_temple`: toppled stones, fallen lintels, scorch marks, a split temple stone and stairs underneath), built as a version that a story switch can turn on, as step 2.6 will need.

---

## Jack's pre-playtest notes (10 October 2026)

Jack reviewed the current build and sent these notes. Each has an id (**N1** to **N13**) and is placed in the plan below. **N1 matters most:** movement directly decides whether the game is playable.

**Before the playtest (24 October):**
- **N1. Movement feels clunky. Fix this first.**
  - Today the player hops one tile per step (`move()`), with a short animation into place.
  - Make it smooth and responsive: continuous movement while the D-pad or a key is held, no delay before the first step, and no stalls between steps.
  - Turning on the spot should be possible with a quick tap. Diagonals feel natural if the tile grid allows them.
  - Collision and every "face the tile and press Use" action (fishing, chopping, talking, doors) must still work exactly as before.
  - Sailing should get the same smoothness.
  - *Done when:* Jack walks and sails around the village on his iPhone and approves the feel. Tests check that collision, doors, talking and fishing still work.
- **N2. Remove the large white-outlined square off the coast of Pirate Island.**
  - *What it is:* the hidden **Darkwood** forest map, which is stored in a corner of the same world grid (x 100 to 147, y 4 to 39). From outside it is drawn as plain water, but the sea tiles around it draw white shoreline foam, because the forest tiles behind them are not water. Boats also cannot sail into it, so it shows as a blocked, outlined square at sea.
  - *Fix:* move the hidden maps (the Darkwood and the home interior) off the sailable world, either into their own map arrays or a separate area that can never be seen or reached by sea. Keep the gates and doors working and migrate saves so nothing in old saves breaks.
  - *Done when:* no outline or blocked square anywhere at sea, and the Darkwood gates, the home door and old saves still work.
- **N3. Move the thatch cottage 5 tiles to the left (confirmed by Jack).**
  - It is the woodcutters' shack at **(39,158)**, which sits on top of the brown dirt road between the Darkwood gate and the Walled Settlement. Move it to **(34,158)**.
  - Fill the tiles it leaves behind with dirt road so the road runs unbroken. Clear the small decoration at (35,159) if it is in the way.
  - Check the road is walkable end to end.
- **N4. Stairs: on hold.** All stairs need a slight colour adjustment to stand out, but Jack wants to wait until the full shading revamp (Phase 1) is done, since that may fix it. Look at the stairs again after Phase 1, and only then adjust their colour if they are still hard to see.
- **N5. Shop menus split into sub-menus by item type.** This applies to shop buy and sell screens only; the personal menu and bag stay as they are.
  - Example: Buy → Rods / Tools / Weapons / Stations / Seeds; Sell → Fish / Materials / Forage / Food.
  - It applies to every shop (Bram, Odo, Rue, and the new blacksmith and apothecary).
- **N6. Review NPC and character names.** Make a list of every named character (villagers, Hale, Wren, shopkeepers and story characters) with where they live and their job, for Jack to review. Do not rename anyone without his approval.
- **N7. Dialogue is human-written.**
  - Keep every existing line of dialogue exactly as it is until Jack says otherwise.
  - New story lines use clearly marked placeholders.
  - Jack writes all dialogue himself after the first playthroughs.
- **N8. Turn-based combat** for pirates, the pirate boss and fighters-guild characters. This is new step **3.6**. Other creatures, like the spirit and forest beasts, keep the current real-time combat. A first, basic version is needed for the draft because Quest 1 is a pirate fight; it will be tested and tuned at the playtest.
- **N9. Character portraits in dialogue.**
  - Story and working characters (shopkeepers, quest givers, the stranger, the pirate boss, the spirits, and the player) show a portrait beside their text.
  - Add a portrait slot to the dialogue box (step 2.2), with a portrait table keyed by character.
  - For the draft, draw portraits for the characters in the opening and Quests 1 and 2 in the game's own upgraded pixel style.

**After the playtest:**
- **N10. Cinematics** for the opening of the game and key moments: the village attack (Quest 7) and the island rising from the sea (Quest 10).
  - Built on the scene system (2.4) as new step **2.12**.
  - A short, basic version of the opening goes into the draft as part of 4.0. The full opening cinematic and the other two come later.
- **N11. Ships remodelled to look like their real-life inspirations,** each needing a set number of crew. Built as new step **6.1**:

  | Ship | Crew needed |
  | --- | --- |
  | Rowboat | 1 |
  | Sloop | 1 |
  | Schooner | 2 to 3 |
  | Brig | 3 to 5 |

  The numbers are the **number of crew members required to use that ship, including the player**. The schooner and brig replace today's trawler.
- **N12. More crew characters** that can be hired (bought) or unlocked through play, so bigger ships can be crewed. This is new step **6.2**.
- **N13. A tavern in both the Walled Settlement and Mountain Town.** This is new step **6.3**. Use the interior designer's tavern starter rooms and the interior loader (2.10).

---

## Playtest draft: due Friday 23 October, playtesting from Saturday 24 October 2026

Jack wants a first playable draft to start playtesting on **24 October 2026**. The date was moved from 17 October to give more time for his pre-playtest notes and a steadier pace.

The draft is a path through Phases 0 to 4 with one goal: play the festival opening, Quest 1 and Quest 2 from start to finish, on an iPhone, in the upgraded art style. The pace is about one to three steps a day. Each week starts with the work everything else depends on, and the last day is kept as a buffer for fixes.

**In the draft:**
- **Jack's notes:** N1 movement, N2 sea square, N3 cottage, N4 stairs check (after the shading revamp), N5 shop sub-menus, N6 names list, N7 keep dialogue, N8 basic turn-based combat, N9 portraits.
- **Steps:** 0.1, 0.3 · 1.1 to 1.4 · 2.1 to 2.9 and 2.11 (2.4 and 2.8 can be basic; 2.6 is used for the festival decorations) · 3.1, 3.2 (pirate grunt, pirate boss, one forest beast), 3.3, 3.6 (basic) · 4.0 (with a short opening scene), 4.1, 4.2.

**After the playtest:**
- **Phase 0:** 0.2, the module split. It is risky and slow, and the single file works fine for now.
- **Phase 1:** 1.5 to 1.7 (objects and stations, forest and interior, lighting).
- **Phase 2:** 2.10 interior loader (Quest 2 meets Hale outside his Darkwood cottage instead), 2.12 full cinematics.
- **Phase 3:** 3.4 armour, 3.5 pirate ships.
- **Phase 6:** 6.1 ships, 6.2 crew, 6.3 taverns.

**Simplifications allowed for the draft:**
- **Text:** placeholder text for new story lines. Existing dialogue stays word for word (N7).
- **Shops:** the blacksmith and the apothecary can be a simple shop menu on an NPC, with no building interior.
- **Quest 2 boulder:** the forked-road boulder can reuse the existing boulder tile (36).
- **Scenes:** may be short (fade, move, dialogue).
- **Battles:** turn-based battles can start simple (Attack, Item, Run, with the boss able to escape) and be tuned after the playtest.

**Week 1: foundations, movement and art**

| Day | Steps | What Jack does |
| --- | --- | --- |
| Sat 10 Oct | 0.1 repo and GitHub Pages, 0.3 tests and the automatic test run | Create the GitHub repository and upload the package; open the play link on the phone |
| Sun 11 Oct | **N1 movement**, a whole day on its own | Walk and sail on the phone; approve the feel, or say what still feels off |
| Mon 12 Oct | N2 sea square, N3 cottage (39,158 → 34,158), N6 names list | Check the sea and the road; review the names list |
| Tue 13 Oct | 1.1 ground and water (with the tile cache) | Approve the before/after screenshots |
| Wed 14 Oct | 1.2 trees and plants | Approve screenshots |
| Thu 15 Oct | 1.3 buildings | Approve screenshots |
| Fri 16 Oct | 1.4 characters and animals; N4 look at the stairs again now the shading is done, and adjust their colour only if still needed | Approve screenshots; quick walk around on the phone |

**Week 2: story machinery, battles and the quests**

| Day | Steps | What Jack does |
| --- | --- | --- |
| Sat 17 Oct | 2.1 story state, **2.1b title menu and save files**, 2.2 dialogue box with portrait slot, N5 shop sub-menus | Try the title menu (save to a file, clear the browser, load it back), the dialogue box and the new shop menus |
| Sun 18 Oct | 2.3 triggers, 2.7 seagull letters, 2.8 quest log, 2.11 story test switches | Try a test letter; use the test switches |
| Mon 19 Oct | 2.4 scenes, 2.5 gates, 2.6 world variants (festival decorations), 2.9 NPCs by story | Watch a test scene |
| Tue 20 Oct | 3.1 enemy table, **3.6 turn-based battles (basic)** | Fight a test pirate battle |
| Wed 21 Oct | 3.2 story enemies, 3.3 encounters; blacksmith and apothecary shops; Bram hides the sword, pickaxe and axe until earned; N9 portraits for the opening and Quests 1 and 2 | Check portraits, shops and fights |
| Thu 22 Oct | 4.0 festival opening (short scene and decorations), 4.1 Quest 1 | Play the opening and Quest 1 |
| Fri 23 Oct | 4.2 Quest 2; Claude Code plays the whole slice through with a script; **buffer day** for fixes | Read the pull requests; note anything confusing |
| **Sat 24 Oct** | **Playtest begins (step 4.3)** | Play from a fresh save; write down what feels wrong |

**If a day slips:**
- **Never cut N1.** Movement is the most important item on the list.
- **Use the buffer day first.** Friday 23 October absorbs small slips.
- **Then drop things in this order:** N4, then 1.4, then 1.3 (the draft is still playable in the current art), then the portraits beyond the player, the stranger and the elder.
- **Always:** never skip the *Done when* tests to save time. If something will miss 23 October, say so in the pull request the same day, so the plan can change early.

---

## Phase 0: Set up the workshop (no visible changes)

**0.1 Repository and hosting.** Put the game on GitHub and turn on GitHub Pages so the owner can play the latest version from a link on his phone.
- *Done when:* the Pages link loads the game on an iPhone and plays the same as the current artifact.

**0.2 Split the single file into modules without changing behaviour.** Suggested split:
- `world` (map, tiles, zones)
- `render` (all drawing)
- `entities` (player, NPCs, enemies)
- `items` (item, recipe and crop tables)
- `ui` (bag, menus, shops)
- `save` (save, load and migration)
- `main`

Keep plain browser JavaScript with no build step, so the game still runs from GitHub Pages as-is.
- *Done when:* the smoke test passes, an old save loads, and a side-by-side screenshot check at 10 map spots shows no differences.

**0.3 Test harness.**
- Extend `tests/smoke_test.py` so each later step can add its own checks.
- Add a **screenshot script** that saves the same 10 map spots every run, so art changes can be compared before and after.
- Add a GitHub Action that runs the tests on every pull request.
- *Done when:* the Action runs green on a pull request.

---

## Phase 1: Graphics upgrade (art only, rules untouched)

The goal is more detail at the **same 16-pixel tiles and the same 176 x 208 screen**. Start from `art/graphics/graphics_upgrade_mockup.js` and `art/graphics/graphics_upgrade_round2.js` (before/after pictures beside them), which the owner has seen and liked, and the reference images in `art/`.

Rules for every Phase 1 step:
- Change **only drawing code**. Tile numbers, collisions, the map, items and saves must not change.
- **Cache** each finished tile, such as a grass variant or a building, in an offscreen canvas and reuse it, so phones stay smooth. Target: 60 fps on an iPhone 14, never below 45.
- Every pull request includes before and after screenshots from the 10 fixed spots.

Steps:
- **1.1 Ground and water:** grass, sand, dirt paths, soft edges between ground types, shallow-to-deep water, shoreline foam, piers. Add the tile cache in this step.
- **1.2 Trees and plants:** trees by wood type, the pink blossom tree, bushes, flowers, tall grass, forage herbs and mushrooms, flax.
- **1.3 Buildings:** walls, roofs, windows, doors, signs, chimneys and smoke. Use the designer's exterior builder (roof, wall, door, sign styles) as the menu of options.
- **1.4 Characters, boats and animals:** the player and NPC sprites (keep the `CharacterSprite` options and colour slots), the three boats, chickens and the spirit. Add small shadows under people.
- **1.5 Objects and stations:** ore, rocks, stumps, crafting stations, the camp, garden plots, treasure bundles.
- **1.6 Forest zone and home interior:** the Darkwood palette and the home room.
- **1.7 Light:** a day/night tint driven by the time of day, warm window glow at night, and lamp glow. Keep it subtle.
- *Done when (for the phase):* all steps are merged, tests are green, frame rate is on target, and the owner has approved the screenshots.

---

## Phase 2: Story machinery (no story words yet)

This is the most important phase. Every later quest is built from these parts. Use **placeholder text** such as "[Elder line 1]" everywhere. The owner writes the real words in Phase 7.

**2.1 Story state in the save.**
- Add `S.story` with `{ q: current quest id, step: step within it, flags: {}, seen: [] }`, defaulting to the start for old saves. Bump `SAVE_V` with a proper migration.
- Flags are plain names, for example `met_stranger`, `has_compass`, `forest_boulder_open`.
- *Done when:* flags survive save, reload and sleep, and old saves still load.

**2.1b Title menu and save files (decided 10 October).** The game saves by itself, but only inside the browser it is played in, so clearing data or changing browser starts a new game. Add an **opening title menu screen** that is the home for saving and loading:
- **New game** and **Continue** (continue the automatic save).
- **Save to file** (downloads a small file) and **Load from file** (picks one back up).
- **Save code:** the same save as plain text to copy and paste, for any phone where file downloads are awkward.
- **Three save slots** kept inside the browser, named for example "Slot 1 - Day 12".
- A small **Menu** button in the game returns to this screen at any time, so a player can save to a file whenever they like.
- Loading is checked and safe: it confirms the file is a real Little Harbor save, keeps a backup of the current save first, and upgrades older saves automatically (the existing `migrate()`).
- **No reminders or warnings to save**, and no accounts or cloud saving (the game is plain files on GitHub Pages).
- Needs 2.1, because the file simply holds everything the game stores, so the story state is included automatically.
- *Done when:* a game can be saved to a file, the browser data cleared, and the file loaded to carry on exactly where it left off, on the phone and on the PC; a broken or wrong file is refused with a friendly message and changes nothing. Tests cover the round trip, the slots and a refused file.

**2.2 Dialogue box (with portraits, N9).**
- A FireRed-style text box at the bottom of the screen, with tap or Use to advance and an optional speaker name.
- Support **choices** (2 to 3 options) and an optional small portrait.
- Text lives in a table keyed by id, such as `DLG.q1_stranger_thanks`, never inside game logic.
- *Done when:* any NPC can run a dialogue by id, and choices set flags.
- **Portraits:** a portrait sits beside the text for story and working characters, from a `PORTRAITS` table keyed by character. Portraits are drawn in the game's own upgraded pixel style. Characters without one show the text box alone.
- **Existing dialogue stays word for word (N7).** New story lines are placeholders until Jack writes them.

**2.3 Triggers.** One table, `TRIGGERS`, where each row has a condition and an action. Conditions:
- enter a tile area or zone
- talk to an NPC
- have an item or flag
- a day passes
- an enemy group defeated

Actions:
- run dialogue
- set a flag
- give or take items and gold
- start a scene
- open a gate
- change a world variant
- send a letter
- move an NPC

Each trigger fires once unless marked repeatable.
- *Done when:* a test trigger fires once, saves, and does not fire again after reload.

**2.4 Scenes (small cutscenes).** A step list such as "fade out", "move NPC to x,y", "player faces left", "wait 1 second", "show dialogue", "camera pan", "shake", "fade in". Player input is paused during a scene.
- *Done when:* a 6-step test scene plays and can be skipped safely.

**2.5 Gates and locks.** Tiles or areas that block movement until a flag is set. Examples: a boulder that needs a pickaxe, a locked vault door, a sea zone patrolled by pirate ships, a temple entrance. Gates are rows in a table.
- *Done when:* a test boulder blocks the road, then opens for good once its flag is set.

**2.6 World variants.** Swap an area's look and layout by flag. Examples:
- the Sky Temple intact versus destroyed (art already in `art/temples/sky_stonehenge_temple`)
- the village normal versus under attack (fires, smoke, damaged roofs)
- the Temple Tower sealed versus hidden stair open
- the final island hidden versus risen from the sea

Variants must never move collisions where the player could get stuck.
- *Done when:* toggling a test flag changes the area, and saves keep it.

**2.7 Seagull letters.** A seagull flies in, lands next to the player and a letter opens; it then shows in a **Letters** pocket of the bag. Letters are triggered by the trigger table.
- *Done when:* a test letter arrives at a trigger area and can be re-read from the bag.

**2.8 Quest log.** A simple journal screen showing the current quest name and one line on what to do next, plus finished quests. It is read from the quest table.
- *Done when:* the log updates as test flags change.

**2.9 NPC placement by story.** An NPC's location, lines and visibility can depend on flags. For example, the lost man appears in the village only after Quest 2, and pirates appear only during quests.
- *Done when:* a test NPC moves home after a flag is set.

**2.9b Room list (a tidy-up that comes first, before 2.10).** Since N2 (10 October) every hidden room sits in the bottom rows of the map (rows 246 and down, below the sea you can reach). Each one is added by hand today: its own rectangle, its own number and its own check in `zoneOf`. That is fine for ten rooms but will not stay manageable for house interiors, taverns (N13), ships you can walk round (N11) and cutscene rooms. Replace the hand-made list with one **table of rooms** and one helper that picks a free spot, builds the room, registers its doors and gives it its number. A new room should then be one new row. If the space runs out the map can grow downwards without breaking saves (new rows go on the bottom).
- *Done when:* all ten existing rooms come from the table and behave exactly as before (old saves and every door still work), a new test room can be added with one row, and the tests prove it.

**2.10 Interior loader.** Load rooms made in the interior designer (its exported JSON) as enterable interiors with doors. Reuse the home-interior approach and make it general. Needs 2.9b (the room list) first.
- *Done when:* one exported designer room, such as the tavern, can be entered from a building door in the village.

**2.11 Story test switches.** A testing-only menu to jump straight to the start of any quest with the right items and flags. Keep it behind a `TEST_STORY` switch, like the existing test switches, and remove it at release.
- *Done when:* every quest start can be reached in one tap for testing.


**2.12 Cinematics (N10).** Longer scripted scenes built on 2.4: letterbox bars, camera moves, music cues, skippable with a tap. Three are planned: the **opening** (the sea festival, a short version of it in the draft, and the full one after the playtest), the **village under attack** (Quest 7) and **the island rising from the sea** (Quest 10).
- *Done when:* each cinematic plays from its trigger, can be skipped, and leaves the world in the right state.

---

## Phase 3: Combat and enemies the story needs

**3.1 Enemy table.** Make enemies data-driven, like items: hp, damage, speed, chase range, drops and art. Move the existing spirit into this table.

**3.2 Enemy types for the story:**
- pirate grunt (melee)
- pirate gunner (ranged, slow shots)
- forest beasts for the Darkwood
- temple guardians and ghosts for the Tower chamber
- the pirate boss, with simple attack patterns and a retreat at low hp (story fights where he escapes)

**3.3 Encounters.** Groups of enemies that spawn when a trigger fires and set a flag when all are defeated ("defeat the pirates one by one").

**3.4 Armour slots.** Add body, boots and helmet slots to the Equipped pocket, with defence and bonuses (needed for Quest 4 to 6 rewards).

**3.5 Pirate ships at sea.** Ships that patrol areas and block or chase the boat, used to stop sailing routes until the story allows them.
**3.6 Turn-based battles (N8).** Pirates, the pirate boss and fighters-guild characters use a **turn-based** battle instead of real-time fighting. Other creatures keep real-time combat.
- **Battle screen:** a separate screen in the FireRed spirit: the player and enemies on either side, health bars, and a menu of **Attack / Skill / Item / Run**.
- **Rules:** damage uses the existing Combat skill, weapon and armour stats. Potions and food work from the Item menu. Poison works as a status. A boss can end a fight early by escaping, as the story needs (Quests 1 and 6).
- **Data:** enemy parties, moves and rewards live in tables.
- **Draft version:** a basic version is enough for Quest 1. The system will be tested and tuned after the playtest, so keep it simple and easy to change.
- *Done when:* a pirate encounter starts a battle, the battle can be won, lost or run from, the boss can escape, and winning sets the encounter's flag.

- *Done when (for the phase):* each enemy can be fought in a test arena, encounters set their flags, armour changes damage taken, and turn-based battles work for pirates.

---

## Phase 4: First playable slice (opening and Quests 1 to 2)

Build these **completely**, with world, mechanics and placeholder text, then play them start to finish before going further. This proves every Phase 2 and 3 part works together.

### 4.0 Opening: the sea festival
- **Where:** the village.
- **What happens:** a short scene at the village's annual sea festival. The player is initiated as the newest fisher, and the shipbuilder (Captain Merl Rue) gives them their first boat (the rowboat).
- **The first letter:** the **first time the player boards their boat in the village** after the festival, a seagull lands on the boat with a letter from a stranger asking for help on a far-off island.
- **Needs:** a scene (2.4), festival decorations as a village variant (2.6), and the first letter (2.7) on a "board the boat" trigger (2.3).
- **Sets:** `festival_done`, then `letter1_read` on first boarding. The quest log shows Quest 1.

### 4.1 Quest 1: A Stranger's Letter, Part 1
- **Start:** the seagull letter that arrives the first time you board your boat in the village (see 4.0).
- **Where:** the stranger's island, **Island 1** (206, 81), a fair sail from the village.
- **Gate:** none.
- **What happens:** pirates attack the stranger. The player defeats the grunts one by one, then the boss, who escapes, warning that "the rest of the fleet" is coming. The stranger comes out of hiding and gives his grandfather's compass.
- **Needs:** encounter (3.3), boss retreat (3.2), scene, dialogue.
- **Reward:** **Grandfather's compass**, a new item. Effect: a small arrow at the edge of the screen pointing to the current quest goal (read from the quest table). It only shows while you own the compass.
- **After:** back in the village, NPCs mention pirate ships and a pirate base (Pirate Island). Pirate Island stays gated by pirate ships (3.5) until much later.
- **Sets:** `q1_done`, `has_compass`, `pirate_base_known`.

### 4.2 Quest 2: Find the Lost Man
- **Start:** the village elder (a new NPC) says a villager went to the mainland settlement for weapons and never came back, and to ask the blacksmith.
- **Where:** the Walled Settlement (blacksmith, a new NPC and shop), then the Darkwood forest, then the woodcutter's cottage.
- **What happens:**
  - The blacksmith heard a ship was blown off course up the coast. He warns against going by sea and lends an **old sword**.
  - The player crosses the Darkwood, which has beasts.
  - At a **forked road**, one way is blocked by a boulder that needs a pickaxe (a gate for later). The other leads to the woodcutter's cottage, where the lost man (a **new villager**) is found with **Hale**, the woodcutter who already lives there.
  - Back at the blacksmith, he gives the sword and a **pickaxe**, and says he will buy metal ore.
  - Back in the village, the man thanks you, offers to crew your ship later, and goes home.
  - The elder gives a healing potion and a stamina potion, mentions the **apothecary**, and points you to the shipbuilder.
- **Needs:** forest beasts (3.2), the boulder gate (2.5), NPC placement (2.9), the blacksmith shop, a new village apothecary (it can sell potions), and the woodcutter's cottage interior via the interior loader (2.10).
- **Rewards:** sword, pickaxe, crew member, healing potion, stamina potion.
- **Shop change:** Bram's shop **hides the sword and pickaxe until this quest gives them** (and the axe until Quest 3), then sells better versions afterwards.
- **Crew:** the rescued man becomes your first crew member. Ships need crew to sail (see 6.1 for the numbers per ship). Rue's boatyard should explain this if you try to use a ship without enough crew.
- **Sets:** `q2_done`, `lost_man_home`, `crew_1`, `blacksmith_buys_ore`.

**4.3 Playtest checkpoint.** The owner plays the opening through Quest 2 on his phone. Fix what feels wrong (pacing, difficulty, confusing directions) **before** Phase 5. Write down any rule changes in `DESIGN.md`.

---

## Phase 5: The rest of the story, one region at a time

Build each quest together with the places it uses. Use the approved temple art in `art/temples/` for every temple. All text stays placeholder.

### 5.3 Quest 3: Merl's Quest
- **Start:** Captain **Merl** Rue at the boatyard (Rue's first name is Merl) needs extra-hard timber for a ship's mast, which grows on one of the islands.
- **Where:** **Island 6** (144, 170), with a new special hardwood tree (for example "ironwood") that only grows there.
- **Reward:** gold. Merl also says the woodcutter has a spare **axe** to collect from the cottage.
- **Sets:** `q3_done`, `axe_waiting`, then `has_axe` once collected.

### 5.4 Quest 4: A Stranger's Letter, Part 2 (Earth Temple, the "Mayan Temple Design")
- **Start:** the next time the player is on the mainland (trigger: enter the mainland zone with `q3_done`), a seagull brings a letter from the stranger. Pirates are going to loot a temple. Hurry!
- **Where:** the Earth Temple (Temple to the Mountains) in its dusty mountains. Use `art/temples/mayan_temple`: plaza, pyramid, summit temple, sanctum.
- **What happens:**
  - The player fights in, then overhears two grunts searching for a key.
  - After defeating them, a spirit **young girl** (the Earth spirit) appears and gives the **Earth Key**. She explains there are four keys (Earth, Sea, Sky, Fire) and that the pirates already have the Fire Key.
  - The keys must be kept safe at the **Temple Tower**.
  - At the Tower, the player learns each key unlocks its opposite, and that the pirates will go for the Sea Temple next.
- **Reward:** **enchanted boots** (armour slot from 3.4).
- **Sets:** `q4_done`, `earth_key_at_tower`. Opens the Temple Tower (`art/temples/temple_tower`) with its four key stands.

### 5.5 Quest 5: Saviour of the Seas (Sea Temple, the "Knossos Temple")
- **Where:** the Sea Temple, in the middle of a crater lake on Island 5. Use `art/temples/knossos_temple`: rim gate, boardwalk, gatehouse, courtyard, hall, stairs, vault.
- **What happens:** the pirates are already in the vault with the Sea Key. The player defeats them and takes the key back. As they flee, a pirate shouts the dynamite line ("guess it's dynamite then!"), setting up Quest 6.
- **Reward:** at the Tower, the Earth spirit (the young girl) gives **enchanted armour**. She sends you to the Sky Temple.
- **Sets:** `q5_done`, `sea_key_at_tower`.

### 5.6 Quest 6: At the Top of the World (Sky Temple, the "Sky Stonehenge Temple")
- **Where:** the Sky Temple on its plateau above the clouds (Island 3). Use `art/temples/sky_stonehenge_temple`.
- **What happens:**
  - Halfway up the cliff path, the player hears an explosion (screen shake and a sound).
  - Near the top, pirates come down the path with the boss. The boss sends grunts, then throws dirt in the player's eyes (screen flash) and escapes.
  - At the top, the circle is **destroyed**: switch to the damaged variant, with the temple stone split open and the stairs exposed. A young boy (the Sky spirit) is crying. The key has been stolen. He asks if the "old man" sent you.
- **Reward:** **Sky Helm** (helmet slot, speed bonus).
- **Sets:** `q6_done`, `sky_temple_destroyed` (stays destroyed until the Sky Key is returned in Quest 10).

### 5.7 Quest 7: Under Attack
- **Start:** a seagull letter arrives as the player is about to leave the Sky island. The village is under attack!
- **Where:** the village, in its attack variant (2.6): pirate ships offshore firing cannons, houses on fire, villagers fighting.
- **What happens:** a large encounter in waves. The pirates flee, and the player overhears that the boss "will be finished at the tower".
- **Sets:** `q7_done`, `village_repaired` the next day (switch back from the attack variant).

### 5.8 Quest 8: Into the Depths (Temple Tower)
- **Where:** the Temple Tower, now attacked: the key stands are empty and toppled (a ransacked variant). A secret hatch has opened in the shrine-room floor.
- **What happens:**
  - A seagull letter from the old man says to come down.
  - Monsters and ghosts guard the stairs and the hidden chamber.
  - In the chamber are the old man (Sea spirit), the boy (Sky) and the young girl (Earth). They reveal they are the temple spirits, and the pirates plan to unite the keys at the Sea Temple and drown the world.
- **Reward:** the **Divine Blade** (best sword).
- **Sets:** `q8_done`, `final_battle_open` (removes the pirate-ship gates around the Sea Temple).

### 5.9 Quest 9: The Final Fight
- **Where:** the Sea Temple in a **storm** (a world variant plus weather: rain, lightning, rough sea).
- **What happens:** the player fights through the pirates to the boss, who uses his full pattern and does not retreat this time. The sky clears and the pirates flee for good: remove the pirate ship patrols and clear Pirate Island. The old man takes the Sea Key, seals it back in the temple, asks you to return the other keys, and fades away.
- **Sets:** `q9_done`, `pirates_defeated`, `keys_to_return = [earth, sky, fire]`.

### 5.10 Quest 10: The Returning of the Keys
- **What happens:** the player visits the Earth, Sky and Fire temples to return each key. When the Sky Key is returned, **the Sky Temple is restored** (switch back to the intact variant). The **Fire Temple** (`art/temples/fire_temple`) is last. There an old woman (the Fire spirit) gives the old man's final letter: he has raised an island from the sea for you, with a key to a house on it.
- **World change:** the new island appears on the map and is reachable (variant 2.6). It has a ready house, using the home system.
- **Sets:** `q10_done`, `story_complete`. The game continues as free play afterwards.

---

## Phase 6: Side content and the living world

**6.1 Ships remodelled (N11).** Redraw each ship to look like its real-life inspiration, and set the crew it needs. The numbers are the crew members required to use the ship:

| Ship | Crew needed |
| --- | --- |
| Rowboat | 1 |
| Sloop | 1 |
| Schooner | 2 to 3 |
| Brig | 3 to 5 |

The schooner and the brig replace today's trawler; migrate saves that own a trawler. **The player counts as one of the crew** (confirmed by Jack). So the rowboat and sloop can be sailed alone, the schooner needs 1 to 2 hired or unlocked crew besides the player, and the brig needs 2 to 4.

**6.2 Crew characters (N12).** New crew characters that can be hired at the docks or taverns, or unlocked through play. The lost man from Quest 2 is the first. Each has a name, a look and a portrait. A crew screen shows who is aboard.

**6.3 Taverns (N13).** A tavern in the Walled Settlement and one in Mountain Town, built from the interior designer's tavern rooms (needs 2.10). Taverns are a natural place to hire crew.

The rest can be built in any order after Phase 4, and the owner chooses priorities:
- **Walled Settlement and Mountain Town:** people and shops (taverns are 6.3). Interiors come from the designer: blacksmith, goldsmith, fighters guild, general store, grocery, tailor, barber, lumberyard, furniture carpenter, tavern, inn.
- **NPC bios and small side quests** for the 20 villagers. The data structure already exists.
- **Storms** that drain stamina and force camping, plus beverages and illness remedies.
- **Fishing rework:** a reel minigame and more fish zones and species.
- **Creatures** on unexplored islands and in Darkwood tall grass.
- **Pirate Island** after the story (a reward area).

---

## Phase 7: Writing, sound and release

- **7.1 The real story text.** Jack writes all dialogue himself (N7), letters and quest log lines, replacing the placeholders in the dialogue table. No code changes should be needed, which proves Phase 2 worked.
- **7.2 Sound and music.** A small set of sounds (cast, bite, splash, hit, menu, seagull) and a few music loops (village, sea, forest, temple, battle). All are optional, with a mute button.
- **7.3 Onboarding.** The first-time tutorial is part of the festival opening.
- **7.4 Balance.** Prices, damage, stamina, XP curve.
- **7.5 Release clean-up.** Remove `TEST_GRANTS`, `TEST_KITS`, `TEST_SHOW_FULL_MAP` and `TEST_STORY`, and do a final full playthrough.

---

## Decisions made (Jack, 9 October 2026)

1. **Story rewards versus shop items:** Bram's shop hides the sword, pickaxe and axe until the story gives them, then sells better versions.
2. **Merl:** Captain Rue is Merl ("Captain Merl Rue"), one boatyard character. **Update, 10 October:** Jack renamed him **Murl** in NAMES.md and the game now says Murl (shop: Murl's Boatyard). The story text above still says Merl Rue until Jack confirms how it should read.
3. **Quest 2 people:** the woodcutter is Hale (already in the Darkwood cottage); the lost man is a new villager.
4. **Quest 1:** the stranger's letter arrives the first time you board your boat in the village; the stranger is on Island 1.
5. **Quest 3:** the special mast timber grows on Island 6.
6. **Earth spirit:** a young girl.
7. **Crew:** ships need crew, counting the player: rowboat 1, sloop 1, schooner 2 to 3, brig 3 to 5 (updated 10 October; see 6.1).
8. **Compass:** shows a quest arrow at the edge of the screen.
9. **Sky Temple:** restored when the Sky Key is returned in Quest 10.
10. **Art style:** keep the game's own code-drawn pixel art and upgrade it to the level of the approved mockup (`art/graphics/`). No sprite-sheet switch or outside asset packs, and characters stay 16 x 20.
11. **Dialogue (10 October):** all dialogue is written by Jack. Keep existing lines word for word until he says otherwise.
12. **Combat (10 October):** pirates, the pirate boss and fighters-guild characters use turn-based battles (3.6); other creatures stay real-time.
13. **Confirmed 10 October:** the cottage to move is the one on the road at (39,158); stairs wait until after the shading revamp; the player counts as crew.

Spirits, for reference: Sea = the old man, Earth = a young girl, Sky = a young boy, Fire = an old woman.

If a step turns up a new question, ask Jack before building that part, add it here with his answer, and suggest a default so work is not blocked.

---

## How the owner hands a step to Claude Code

Copy this and fill in the step number:

> Read `CLAUDE.md`, `ROADMAP.md` and `DESIGN.md`. Do **step X.Y** only. Work on a new branch, keep saves working, add tests for the step's *Done when* list, and include before and after screenshots if anything visible changed. Use placeholder text for any story lines. When finished, open a pull request that explains in plain words what changed and how I can try it on my phone.
