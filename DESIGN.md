# Little Harbor: design document

A top-down pixel-art fishing and exploration game for phones (primarily iPhone 14, Safari). Inspired by Stardew Valley (skills, crafting, villagers) and early Pokemon (menus, bag screen, forest route design). Everything below describes what is **already built** unless it is under *Not built yet*.

## How to play (controls)
- **D-pad** moves (hold to repeat); keyboard: arrows or WASD. Walking takes a step every 0.07 s while a direction is held; the boat sails twice as fast (a step every 0.035 s). Both are set by `STEP_MS` in `js/systems/stats.js`, and the phone D-pad and the keyboard share one held-direction timer in `js/input.js`, so they move at exactly the same speed (the PC no longer depends on the computer's own key-repeat rate). **Use** button (Space/Enter) interacts with the tile you face.
- **Turning and tapping** (`js/input.js`): pressing a direction you are not facing only **turns** you on the spot (you start walking only if you keep holding it past `TURN_MS`, 0.12 s). Pressing the direction you already face takes **one step at once**, and if you keep holding it you walk on after `REPEAT_MS` (0.17 s), so a quick tap is exactly one tile. Held directions are kept in a list: the newest one decides, and letting go of it while an older key is still held carries on in the older direction instead of stopping. The boat works the same way. Facing a tile without moving makes it easy to line up with doors, people and water.
- **Menu (☰ button top-right of the picture, or Escape):** Resume, New game, Save game, Load game. The same menu opens as the **title screen** when the game starts (Continue instead of Resume). **Save game:** *Save to a file* (downloads `little-harbor-dayN.json`), *Show a save code* (text beginning `LH1:` to copy and paste) and three **slots** kept in the browser (`little-harbor-v1-slot-1..3`). **Load game:** from a file, a pasted code or a slot. Loading checks the save is a Little Harbor save and not from a newer game (a friendly sentence if not), keeps the game it replaces as `little-harbor-v1-backup-before-load`, writes the new one and reloads the page; *New game* keeps the old one as `...-backup-new-game`. After a load or a new game the page reloads straight into the game (`sessionStorage` key `lh-started`; the tests set it to skip the title). No reminders to save. Code: `js/ui/titlemenu.js`.
- **Opening cinematic (N10):** plays when the game opens, before the title menu, once per visit (`sessionStorage` key `lh-intro`). Looking up at a blue sky with clouds and two gulls, the view tilts down to the horizon while the title "Little Harbor", built from pieces of driftwood with seaweed hanging off it, rises out of the sea, and a sailing ship seen from behind sails forward towards the horizon (about 15 seconds). One tap or key skips to the end, the next goes to the title menu. Drawn in code on its own canvas. Code: `js/ui/intro.js`.
- Buttons: **Sleep** (only on the boat or at home), **Bag** (B), **Me** (the character screen: your portrait, day, gold, health, stamina, boat, what you carry, best skills, a **Quests** button for the quest log, and a **Save game** button that opens the save choices), **Skills** (K), **Map** (M).
- Facing water from the boat and pressing Use casts a line; when the bite alert appears, press Use again within about a second.

## World
- Map is **320 x 240 tiles**, 16 px per tile, camera 11 x 13 tiles. Tile type numbers are listed at the end.
- Built from a hand-drawn sketch at roughly 1 tile per 7 sketch units. Sea is fully connected: every island and the mainland coast can be reached by boat.
- The original village island was generated in its own local coordinates and then shifted by (OX=124, OY=91). Old saves are migrated by `S.wv` (now 3: version 3 moved the hidden rooms below the sea, so a saved station inside the home room moves 24 rows down and saved tree/treasure records in the Darkwood move 258 rows down).

### Landmarks (tile coordinates)
| Name | x | y |
| --- | --- | --- |
| Village | 156 | 113 |
| Mainland | 50 | 185 |
| Mountain Town | 27 | 68 |
| Walled Settlement | 100 | 210 |
| Settlement Docks | 154 | 215 |
| Woodcutters' Shacks | 33 | 153 |
| Temple to the Mountains | 6 | 18 |
| Sailors' Grave Rocks | 90 | 86 |
| Island 1 | 206 | 81 |
| Island 2 | 190 | 136 |
| Island 3 | 244 | 142 |
| Island 4 | 128 | 78 |
| Island 5 | 283 | 38 |
| Island 6 | 144 | 170 |
| Pirate Island | 71 | 32 |
| Temple of Fire | 71 | 25 |
| Temple of the Sea | 283 | 31 |
| Temple to the Sky | 244 | 135 |
| Temple Tower | 212 | 196 |
| Spirit Isle | 146 | 135 |
| Darkwood south gate | 36 | 146 |
| Darkwood north gate | 31 | 110 |

### Separate maps (zones)
These are hidden rectangles of the main grid, in **rows 246-299, below the sea you can reach** (the map is 320 x 300 tiles: `WH` = 240 rows are the real world, rows 240-299 are only the hidden rooms; boats stop at row 239 and the camera never shows the hidden rows from outside). They look like water from outside and the area beyond their edge is drawn black from inside. Entities and buildings are only drawn when the player is in the same zone (`zoneOf`).
- **Home interior**: x 300-311, y 250-259. Entered through the player house's door tile; exit by facing the interior door.
- **The Darkwood**: x 100-147, y 262-297 (it is drawn in its own coordinates y 4-39 and placed `FY` = 258 rows lower, so the numbers below are the forest's own: add 258 to every y to find them on the grid). Dark forest with a light radius around the player. South gate arrives at (123,38), north gate at (136,5). Both ends are a red torii gate three tiles wide (a post on each side, `43`/`44` in the middle; pressing Use facing any of the three goes through). Overworld gates: south at (36,149) by the woodcutters, north at (31,110), at the end of the road from the Mountain Town (you step out at (31,109)). Dark thick trees (41) close in around each outside gate so it looks set into the forest. Contents: winding trail, 4 dead ends with treasure bundles, 2 more bundles on the trail, tall grass (7% chance of a herb, 3% chance of a 4 damage hornet sting per step), woodcutter's cottage with Hale, forager Wren, many mushrooms and herbs.

- **Temple Tower shrine room**: x 156-166, y 250-259 (zone 10), entered from the pagoda's south door at (212,204); exit by facing the door at the bottom.

### Mainland features
- Walled Settlement (x 84-115, y 200-234): 15 houses plus the tailor (Seamstress Wynn, door stand (98,217)) and barber (Barber Fenwick, (102,217)) facing the main street either side of the road, plus Garrick's forge (the blacksmith, door at (104,231)), 18 people (a gate guard, Garrick, his apprentice Tilda and one resident per house, who wander near their doors; built in `js/world/settlement.js`), barrels and lanterns, west gate (road to the woodcutters and the Darkwood), east gate (3-wide path to the docks), closed south wall. Docks: two-wide pier with an end platform around (154,217).
- **Farms** (`js/world/farms.js`): three fenced farms with a farmhouse, crop rows, feed barrels and a farmer each (Hobb, Maude, Perrin). Dairy farm east of the walls at (118-131, 205-213) with 3 cows; sheep and pig farm at (118-132, 222-232); egg farm north of the walls at (90-110, 187-196) with 6 chickens and 2 sheep. Crop rows are scenery for now.
- **Animals**: the `AN` list (cow, pig, sheep, dog, cat; add a kind in `ANIMALS` and `critter()` in `js/render/entities.js`). Livestock block the way (`solid`), pets do not. They wander near their home tile (`rx`, `ry`), and Use on one says its sound. Pets in the Walled Settlement: 2 dogs and 1 cat. Chickens still use the older `CH` list.
- Mountain Town (x 15-39, y 59-78; built in `js/world/mountaintown.js`): walls, 8 houses, a cross street, Lucie's Gold & Gems (door (29,71)), the Fighters Guild hall (door stand (30,74)) and the Gladiators' Arena hall (door stand (36,74)), lanterns, a gate at the south (the road down to the Darkwood) and a north gate at (25-27, 59) between two gate posts, from which a wide dirt path climbs through the terraces to the Temple to the Mountains (Warden Brann stands just inside). 12 people: a resident per house, goldsmith Lucie, Warden Orrin at the gate, miner Gudrun and old Stig.
- **Hall interiors**: zone 3 Fighters Guild (x 270-281, y 250-259) and zone 4 Gladiators' Arena (x 270-283, y 262-275), hidden rooms below the sea like the home. Walk to a hall's door stand tile, face the door and press Use; exit by facing the inside door (tile 23). Halls are listed in `ENTR` in `mountaintown.js`.
- Forest barrier: solid forest (choppable trees) fills the whole width of the mainland from the west edge to the east coast, around y 100-148. Its north and south edges undulate and are slightly thinned like a real forest edge. The forest also runs south down the west side of the map (about 15 tiles wide, tapering away by y 228, kept clear of the woodcutters and the road). There is no road through it on foot: the Darkwood's two gates (south at (36,149), north at (33,109)) stand for the way through. A dirt road runs from the Mountain Town gate south to the north gate.
- **Mountain country** (the mainland north of the forest, including the Mountain Town and the Temple to the Mountains): no grass, trees or herbs. It is bare rock in terraces that step up toward the north (`overworld.js`, block after the buildings are placed). Each terrace tile has a height in `TLV`; wherever one tile is higher than its neighbour it becomes a cliff face (49, blocks the way), and rock steps (50) are added so every terrace can be reached. Colours go from warm tan low down to cool grey-blue high up, following the reference picture. Islands (such as the Pirate Island) are not affected.
- **Stone barrier** (`js/world/barrier.js`): jagged rocks seal the mainland's whole north-west coast from y 0 to 150 so the mountain country (Mountain Town, Temple to the Mountains) can only be reached through the Darkwood. Tile 54 is jagged rock standing in the sea (a ragged band 1 to 4 tiles wide, so boats cannot get near the shore); tile 55 is jagged rock on the shore, covering the beach strip within 5 tiles of the sea where the forest begins (so nobody can land to the south and walk north along the sand). Both block boats and walking. The smoke test checks that no sea landing or beach walk reaches the mountain country.
- Mountain stone elsewhere was deliberately removed on request. Sea rocks (Sailors' Grave Rocks) remain.
- **Temple to the Mountains (Earth temple), built** (`js/world/earthtemple.js`, art in `js/render/temples.js`, design in `art/temples/mayan_temple`): a paved plaza (x 0-14, y 25-31) with a low stone altar and two side shrines, a winding two-wide dirt path in from the south, a stepped pyramid (three tiers, y 16-24) with a three-wide central stairway (x 5-7), and on the summit the temple (x 4-8, y 13-14) with three doorways, a lattice crest, a red-dotted frieze and two serpent heads at the top of the stairs. Face any of the three doorways from the landing (y 15) to enter the **sanctum** (zone 5, x 250-263, y 224-235): stepped ceiling, glyph blocks, a painted codex mural (skeleton, jaguar and bird figures), two jaguar statues with jade eyes, a stone altar and torches. No story items yet: the altar is empty.
- **Temple of the Sea's island** (`js/world/seaisland.js`): Island 5 is rebuilt around (283,36) as an oval 48 x 38 tiles of concentric rings: a sandy beach, two grass terraces, a bare rock crater rim and an enclosed crater lake (open water, about 160 tiles) in the middle. Each ring is separated by a cliff face (tile 49, colour by height `TLV`); three three-tile stairways (tile 50) wind up the island: west up to terrace 1, north up to terrace 2, east up to the rim. The rim's south side holds the crater gate. The old placeholder temple is gone. Trees and ore were removed from the island so the rings stay walkable. The smoke test checks that the stairs are the only way up.
- **Temple of the Sea, built** (`js/world/seatemple.js`, art in `js/render/temples.js`, design in `art/temples/knossos_temple`): the crater rim gate (two red columns, x 281 and 285, y 43) opens onto a three-wide stone boardwalk (x 282-284, y 38-43) with red lamp posts, over the lake to a limestone courtyard platform (x 279-287, y 32-37) with water channels, a pool with a dolphin fountain, red columns and braziers. The temple's front (cream wall, band of blue-centred discs, four red columns, dark doorway; x 281-285, y 30-31) stands against the crater wall. Face the centre doorway from (283,32) to enter the **hall** (zone 6, x 230-243, y 224-235): red plaster walls with white bands and a cream frieze of red hills and blue dolphins, the sea god in his niche, water channels, and a dark stairway flanked by red columns and braziers. Face the stairs (from (237,231)) to descend to the **vault** (zone 7, x 210-223, y 224-235): a dark cave of still water with a stone ledge, three stepping stones and a platform between two red columns with an empty pedestal (no story items). The vault is dimly lit. Both rooms are left by their door at the bottom.
- **Temple to the Sky, built** (`js/world/skytemple.js`, art in `js/render/temples.js`, design in `art/temples/sky_stonehenge_temple`): on the plateau, round the north-south axis x = 236: the route climbs the last stairway at (236,127) and passes a **dolmen gateway** (two standing stones at x 234 and 238, y 123-124, with a lintel slab across the top, `skygate`), then an **avenue** of three pairs of standing stones (x 233 and 239, y 117-121) on the dirt road, into the **outer circle** (radius 7 round (236,108), about 16 standing stones with low lintel slabs between them and a three-tile gap in the south), which holds **five trilithons** in a horseshoe open to the south (two stones and a lintel each) and, in the middle, the **carved temple stone** with triple spirals on a ring of bare sandy earth. Tiles: 78 standing stone, 79 lintel slab, 80/81 the temple stone halves (all blocked). Everything is open air; there is no interior and no story item (the damaged version is not used).
- **Temple to the Sky's island** (`js/world/skyisland.js`): Island 3 is rebuilt around (244,132), about 64 x 74 tiles, with an irregular (not round) coast. The west half is a hillside of four wide terraces (bands running east to west, rows 146-151, 140-145, 134-139, 128-133) topped by a large flat grass plateau (rows 112-126, about 30 wide) where the temple will sit. A three-wide dirt path zigzags up the hill: from the south-west beach (222,159) up the first stairway, east along terrace 1, up at its east end, west along terrace 2, up, east along terrace 3, up, west to the middle of terrace 4 and up onto the plateau at (232,127). The five stairways (`SKY_STAIRS`, tile 50) are five tiles wide, cut through each terrace's south cliff row (tile 49). Stone lanterns (tile 7) line both sides of the whole route every 5 then 6 tiles (`SKY_LAN` lists them, so the test can check). The east, south and north of the island are lowland forest (trees on the lowland only; the hill and plateau have none). The old placeholder temple is gone.
- **Temple of Fire's island, the volcano** (`js/world/fireisland.js`): the old Pirate Island is rebuilt around (71,28) as a black basalt island about 42 x 36 tiles with an active volcano. Jagged volcanic peaks (tile 86, black with glowing cracks) fill the north around a crater lava lake with rising smoke (87). Rivers of animated lava (84) run down from it: two flank a big flat basalt plateau (x 60-82, y 25-41, tile 82) at the volcano's southern base, and flow on into the sea, steaming where they meet it; three more run out to the north-west, north-east and north. A black-sand beach (83) in the south is the landing, and a three-wide path of basalt slabs (85) leads from it north onto the plateau. The sea round the island is tinted turquoise (`REEF`). There are no houses: four pirate tents (`tent`, tile 100 under them) stand on the east shore (x 86-90, y 20-33), beyond the east lava river, with the gravestones. Lava and peaks block walking and boats. The old placeholder temple, houses and little islets are gone.
- **Pirate camp and the pirates' arrival** (`js/world/pirates.js`, art in `js/render/camp.js`, people in `js/data/pirates.js`, switches in `js/systems/flags.js`): the pirates are not on the island at the start. The east shore (x 84-91, y 15-27) holds only the gravestones, a cold fire pit and a toppled crate, and the island is called "Volcano Island" on the map. A quest will call `setFlag('pirates_called')`; at the next **sleep** (on the boat or at home) the game sets `pirates_here`, calls `applyPirates(true)`, shows a message and a toast, and the island becomes "Pirate Island". Then there are six tents (`tent`), a lit campfire, flags and barrels, **three pirate ships** moored offshore (x 93-95, y 16-35; tile 101 under them blocks boats), and **ten pirates** (Captain Redd and nine crew, `PIRATES`; they stay near the camp; no shop and no services). `applyPirates(false)` puts the empty camp back, so the camp is rebuilt from the flag at every load and never saved itself. Flags live in `S.flags` (a new save field with default `{}`); `flag(name)` and `setFlag(name)` are the helpers, and `ARRIVALS` (in `flags.js`) is the table of overnight changes, so a future arrival is one new row. **Testing:** add `?flags=pirates_here` (several allowed, comma separated) to the game's link to see the pirates without saving anything, or `?flags=pirates_called` and then sleep to watch them arrive.
- **Temple of Fire, built** (`js/world/firetemple.js`, art in `js/render/temples.js`, design in `art/temples/fire_temple`; deliberately a little smaller than the other temples, about 13 x 16 tiles): from the south, bronze braziers beside the slab path, a two-tile lava moat across the plateau (fed by the two rivers) crossed by a white marble bridge (x 70-72, y 37-38), the great red gate (x 66-76, y 34-36: three arched gateways under a two-tier golden roof; the middle one is a **real door**: face it from the bridge's end (71,37) and press Use to enter the **gatehouse**, zone 9 (x 170-183, y 228-235), a short red lacquer hall whose far (north) door leads **straight into the fire hall** (zone 8), and whose south door leads back to the bridge), a white marble courtyard (x 65-77, y 29-33; scenery you see over the walls, with no door onto it) in two tiers with a balustrade and steps between them, a round fire basin and bronze braziers, and the fire hall's front (x 68-74, y 27-28: red columns, double golden roof). You reach the **fire hall** through the gatehouse; its door leads back to the gatehouse. The hall (zone 8, x 190-203, y 224-235): dark red lacquer floor, red columns banded in gold, white lattice windows, a gold plaque over a swirl frieze, a dais of golden steps with the sacred flame, teal incense burners. No story items: the altar flame burns and nothing else.
- **Temple Tower island** (`js/world/towerisland.js`, art in `towerTile` in `js/render/temples.js`): the old little islet is replaced by a small pine-forest island about 38 x 34 tiles (centre 212,196; the hidden rooms stay below y 224). A three-wide **stone dock** (tile 105, over the water) runs south from the open sea at the island's north (x 211-213, y 173-180) into the north beach; a raked-gravel path with stepping stones (tiles 103/104) continues straight south to a flat grass clearing (x 203-221, y 195-208) where the temple complex will be built (its gate will face north, towards the dock). Stone lanterns (tile 7, `TOWER_LAN`) stand on both sides of the path every four tiles; dark pines (tile 102, blocks) fill the rest of the island but never the beach, the path's edges or the clearing. No houses, no story items. 
- **Damaged Sky temple (a story switch, `js/world/skydamage.js`, art in `skyDamagedTile` and `skySmoke`):** `applySky(true)` turns the Sky temple's circle into its ruined self and `applySky(false)` puts it back exactly (the box x 218-254, y 96-128 is remembered in `SKY_ORIG`). It runs at load with the saved flag `sky_damaged`; a quest will call `setFlag('sky_damaged')` then `applySky(true)`. **Testing:** add `?flags=sky_damaged` to the game's link. Damaged: the temple stone is split in two (tiles 117/118, blocked) with dark stairs down between them (119, blocked; what lies below is not built, it comes with the story), scorched ground (120) and rubble (122) round it (walkable), two columns of smoke, many standing stones and lintels toppled (121, blocked) or gone, and the trilithons broken up. The avenue and a way round the stone stay walkable. No people, no story items.
- **Temple Tower, built** (`js/world/towertemple.js`, art in `js/render/temples.js`, design in `art/temples/temple_tower`): on the clearing, round the axis x = 212. A wooden gate (posts 107 at x 210 and 214, roof `towerGate`) in the north wall (y 195) opens on a raked-gravel courtyard (x 204-220, y 196-208) closed in by covered walkways (106, block), with stepping stones from the gate to the pagoda and stone lanterns. The five-storey pagoda (`towerPagoda`, footprint tile 116, x 209-215, y 200-204; dark blue-grey tiled roofs with gold trim, wooden balconies, white panels, gold-ringed spire) stands in the middle; walk round it to its door on the south face (212,204, an `ENTR` to the shrine room). Because the dock is in the north, the pagoda's drawn front faces south. **Shrine room** (zone 10, `TS`, x 156-166, y 226-235): dark coffered ceiling with a blank carved plaque, glowing paper screens, tatami (108), dark pillars (110), a small golden shrine (111) on a black-and-red lacquer platform (112) between two hanging gold lanterns (115), a red offering table with a bronze crane (113) and four bare stands in a row (114). The lower chamber is **not built** (it comes with the story). No story items. Approved art for them is in `art/temples/` and described in `TEMPLES.md`. Build order: first each temple's island, then the temple itself. No story or quests yet.

## Player and stats
- Health max 50 (+4 per Combat level). Stamina max 100. FireRed-style HP and STA bars; HP bar goes green, yellow, red.
- Stamina costs: walk 0.08, sail 0.08, cast 2, swing 5, storm 0.5, gather 3, forage 1.5 (storm is unused until storms exist).
- Zero health: you wake on your boat with half health and stamina and lose 10% of your gold. Zero stamina: you can still move but cannot cast, swing, chop, mine or pick.
- Sleeping (boat or home) restores everything, advances the day, regrows resources, resets the test ghost.
- Character look: skin, hair, shirt, jacket colours, hair style (short, long, spiky, bun, ponytail, bald; `look.hstyle`, overlays in `HS` in `js/render/sprites.js`), hat (cap, straw, none), backpack and jacket toggles. 16x20 sprite module (`CharacterSprite`) with walk frames and a fishing pose. Chosen on first launch only.

## Skills (Stardew-style, levels 0-10)
XP thresholds (total XP for levels 1-10): 100, 380, 770, 1300, 2150, 3300, 4800, 6900, 10000, 15000.

| Skill | XP sources | Perk per level |
| --- | --- | --- |
| Fishing | each catch (5 to 100) | 3% faster bites, better rare fish odds |
| Combat | hits (2), kills (20) | +8% damage, +4 max health |
| Sailing | 0.25 per tile sailed | 6% less travel stamina |
| Mining | ore nodes | 1 fewer swing per 3 levels, 4% extra ore |
| Woodcutting | trees | 1 fewer swing per 3 levels, 4% extra logs |
| Foraging | flax, herbs, mushrooms | 4% extra pickings |
| Crafting | bench and forge recipes | 3% chance of an extra item |
| Cooking | cooked meals | food restores 4% more |
| Farming | garden harvests | 4% extra produce |
| Alchemy | potions | potions 4% stronger and longer (poison vials +1 hit per 3 levels) |

## Items, bag, equipment
- All items live in one data table (`ITEMS`): add a row to add an item. Kinds: boat, claim, fish, food, forage, garden, ingredient, jewel, material, potion, prefab, rod, station, tool, weapon (93 items).
- Bag pockets (FireRed style, left/right to switch): Ingredients (fish, vegetables, meat, foraged herbs and mushrooms), Consumables (food and potions; Eat, Drink or Apply), Materials, Gear (rods, weapons, tools, stations, house kits, claims, garden kits; Equip or Place), Equipped (slots: rod, weapon, pickaxe, axe, knife, ring, amulet).
- Boats are not in the bag: they are switched at Murl's boatyard. Rods and boats are bought in order; boats can be bought or built in any order.
- Test sword is granted once (see testing flags).

### Shops
- **Bram's Tackle & Tools** (village): rods, sword 300, pickaxe 200, woodcutter's axe 200, knife 60, camp kit 150, workbench 100, forge 400, cooking station 250, alchemy station 300, garden kit 120, home claim 500.
- **Astrid's Apothecary** (Walled Settlement, thatch roof and a green bottle sign, north side of the main street at x 90-92, y 215-216; Astrid stands at its door tile (91,217)): sells healing potion 60g, greater healing 180g, stamina tonic 50g, greater stamina tonic 150g, swiftness potion 220g and poison vial 120g, and buys potions and poisons back at half price. Data: `APOTHECARY` and `SHOPS.apothecary` in `js/data/shops.js`. The Mountain Town villager who used to be called Astrid is now **Solveig**, and Captain Rue is now **Murl** (Jack's renames, 10 October).
- **Odo's General Store** (village): buys and sells ingredients (carrot 5, cabbage 6, broccoli 7, parsnip 6, potato 4, chicken 14, pork 16, beef 20); buys fish, ingredients (half price), cooked meals and foraged herbs.
- **Garrick's Forge** (blacksmith, Walled Settlement; stock is the `SMITH` table in `js/data/shops.js`): Buy or Sell. Sells materials (copper ore 30, tin ore 30, bronze ore 50, iron bar 160, rope 25, softwood/medium/hardwood planks 15/30/55), weapons (bronze sword 450 damage 7, iron sword 1,100 damage 10, warrior's greatsword 3,000 damage 15), tools (iron pickaxe and iron woodcutter's axe, 600 each, one swing fewer per node via `power` 2) and objects (workbench, forge, camp kit). Buys materials at half price. Items with `smith:1` are hidden from Bram's shop.
- **Tailor and barber** (Walled Settlement; prices in `LOOK_PRICES` in `js/data/shops.js`): both open the look screen (`openLook('tailor')` / `openLook('barber')`) on a copy of your look, and you pay only for the fields you changed. Tailor: shirt colour 50g, jacket colour 80g, hat colour 40g, hat style 50g, jacket on/off 30g, pack on/off 30g. Barber: hair colour 40g, hair style 60g. Cancel is free. The first-launch screen (`openLook()`) is free and also has hair styles.
- **Lucie's Gold & Gems** (goldsmith, Mountain Town; `JEWELLER` in `js/data/shops.js`): enchanted jewellery, one ring and one amulet can be worn. Buys back at half price. Effects are the `fx` field of each `jewel` item (read through `fx(key)` in `js/systems/stats.js`): Ring of Vigor 3,500g (+12 max health), Ring of Might 4,200g (+12% weapon damage), Ring of Endurance 5,200g (20% less stamina used), Ring of the Harvest 3,800g (15% chance of extra from gathering), Amulet of Vitality 3,200g (+30 max stamina), Angler's Amulet 4,500g (fish bite 15% sooner), Amulet of Warding 6,000g (20% less damage taken), Scholar's Amulet 7,500g (10% more skill XP).
- **Murl's Boatyard (was Captain Rue until Jack renamed him)**: switch boats; sells sloop 100,000, schooner 250,000 (the old trawler), brig 600,000 (**TESTING: `BOAT_TEST` in `js/data/items.js` is on, so each costs 100 gold for now**), and the shipwright station (1,500).

## Fishing
Cast costs 2 stamina. Wait 1.5-4.5 s multiplied by rod wait and (1 - 0.03 x Fishing level). Bite window about 1.1 s; press Use to catch. Boat tier gives a 30%% chance per tier of a second roll keeping the better fish; Fishing level shifts rarity weights toward rarer fish. (An earlier reel-in minigame with rod power and fish pull exists in git history/backups; the data fields `power` and `pull` are still in the item table for when fishing difficulty is reworked.)

Fish: Sardine (sells 6), Mackerel (sells 12), Bream (sells 30), Tuna (sells 120), Golden koi (sells 600).

Rods: Driftwood rod (0g, power 1, wait x1), Bamboo rod (80g, power 1.3, wait x0.85), Fiberglass rod (600g, power 1.7, wait x0.7), Carbon rod (4000g, power 2.3, wait x0.55).

## Gathering
- **Trees** (axe): soft wood 2 swings, medium 3, hard 5; stumps regrow in 3 nights. Wood type is derived from tile coordinates.
- **Ore** (pickaxe): copper, tin (3 swings), bronze (4). Rubble regrows in 3 nights. Iron bar is forged from one of each.
- **Flax** and **herbs/mushrooms** (knife): one snip. Flax regrows in 2 nights, herbs in 3. Treasure bundles never regrow.
- Resource state is stored in `S.cut` keyed by tile index.

## Crafting stations
Stations are bought, then placed from the Bag. They must be within **5 tiles of a camp or your house**, or inside the house. Placement uses a blue/red grid preview (blue = fits). Face a station for a menu: Craft/Cook/Brew/Build, Move, Pick up. Picking up the camp packs every station.
- Camp kit (tent plus campfire that cooks), workbench, forge, cooking station, alchemy station, shipwright station. Garden kit and house are separate (below).

### Recipes
| Station | Output | Needs | Extra |
| --- | --- | --- | --- |
| Workbench | Rope | Flax fiber x3 |  |
| Workbench | Softwood plank | Softwood log x1 | makes 2 |
| Workbench | Medium wood plank | Medium wood log x1 | makes 2 |
| Workbench | Hardwood plank | Hardwood log x1 | makes 2 |
| Forge | Iron bar | Bronze ore x1, Copper ore x1, Tin ore x1 |  |
| Campfire | Grilled sardine | Sardine x1 |  |
| Campfire | Grilled mackerel | Mackerel x1 |  |
| Campfire | Grilled bream | Bream x1 |  |
| Campfire | Grilled tuna steak | Tuna x1 |  |
| Cooking station | Fish stew | Sardine x2, Mackerel x1 |  |
| Cooking station | Seafood feast | Bream x1, Tuna x1 |  |
| Cooking station | Golden koi sashimi | Golden koi x1 |  |
| Campfire | Roast carrots | Carrot x2 |  |
| Campfire | Baked potato | Potato x1 |  |
| Campfire | Roast parsnip | Parsnip x1 |  |
| Campfire | Braised cabbage | Cabbage x1 |  |
| Campfire | Grilled broccoli | Broccoli x1 |  |
| Campfire | Grilled chicken | Chicken x1 |  |
| Campfire | Pork chops | Pork x1 |  |
| Campfire | Beef steak | Beef x1 |  |
| Cooking station | Vegetable stew | Carrot x1, Potato x1, Parsnip x1, Cabbage x1 |  |
| Cooking station | Chicken soup | Chicken x1, Carrot x1, Potato x1 |  |
| Cooking station | Pork roast dinner | Pork x1, Potato x1, Parsnip x1 |  |
| Cooking station | Beef stew | Beef x1, Potato x1, Carrot x1, Broccoli x1 |  |
| Cooking station | Beef stir-fry | Beef x1, Broccoli x1, Cabbage x1 |  |
| Workbench | Thatched cottage kit | Softwood plank x10, Rope x4 |  |
| Workbench | Tiled house kit | Medium wood plank x12, Hardwood plank x4, Rope x6, Iron bar x2 |  |
| Shipwright | Sloop | Medium wood plank x12, Hardwood plank x6, Rope x8, Iron bar x4 | 2000 gold, one only |
| Shipwright | Trawler | Medium wood plank x24, Hardwood plank x16, Rope x16, Iron bar x10 | 8000 gold, one only |
| Alchemy station | Healing potion | Basil x2, Holly x1 |  |
| Alchemy station | Greater healing potion | Basil x3, Holly x2, Blue cap mushroom x1 |  |
| Alchemy station | Stamina tonic | Forest sprig x2, Moss x1 |  |
| Alchemy station | Greater stamina tonic | Forest sprig x3, Moss x2, Red cap mushroom x1 |  |
| Alchemy station | Swiftness potion | Forest sprig x2, Blue cap mushroom x1, Basil x1 |  |
| Alchemy station | Poison vial | Death cap mushroom x2, Moss x1 |  |

(Cooking station also offers every campfire recipe.)

## Food, potions, poison
| Item | Health | Stamina | Other |
| --- | --- | --- | --- |
| Grilled sardine | 3 | 15 |  sells 7 |
| Grilled mackerel | 6 | 25 |  sells 14 |
| Grilled bream | 12 | 40 |  sells 34 |
| Grilled tuna steak | 25 | 60 |  sells 135 |
| Fish stew | 15 | 45 |  sells 30 |
| Seafood feast | 40 | 80 |  sells 170 |
| Golden koi sashimi | 60 | 100 |  sells 700 |
| Roast carrots | 4 | 18 |  sells 15 |
| Baked potato | 3 | 22 |  sells 6 |
| Roast parsnip | 3 | 20 |  sells 9 |
| Braised cabbage | 4 | 16 |  sells 9 |
| Grilled broccoli | 6 | 12 |  sells 10 |
| Grilled chicken | 14 | 38 |  sells 21 |
| Pork chops | 16 | 40 |  sells 24 |
| Beef steak | 22 | 48 |  sells 30 |
| Vegetable stew | 20 | 55 |  sells 32 |
| Chicken soup | 32 | 62 |  sells 35 |
| Pork roast dinner | 38 | 70 |  sells 39 |
| Beef stew | 45 | 85 |  sells 54 |
| Beef stir-fry | 40 | 75 |  sells 50 |
| Healing potion | 35 |  |  |
| Greater healing potion | 80 |  |  |
| Stamina tonic |  | 50 |  |
| Greater stamina tonic |  | 100 |  |
| Swiftness potion |  |  | speed 90s |
| Poison vial |  |  | coats weapon 10 hits |

Potions scale with Alchemy level; food with Cooking level. Swiftness doubles movement and sailing for its duration. A poison coat makes each hit poison the target for 6 s: 2 damage per second, it moves slower, and its attacks do half damage (currently only the test ghost).

## Home, camp and garden
- **Home claim** (500g): a 7 x 5 plot; trees, ore and flax are allowed inside it, buildings, water, paths and fences are not. Only one claim.
- **House kits** are crafted at a workbench (cottage: 10 softwood planks, 4 rope; tiled house: 12 medium planks, 4 hardwood planks, 6 rope, 2 iron bars). The house is 3x2 tiles and must sit inside the claim on ground cleared of trees and ore. Face its door to enter the interior room, where stations can be placed and moved freely and you can sleep.
- **Garden kit** (120g): a 3x2 patch of six plots anywhere on clear ground. Plant any herb, mushroom or vegetable you hold (the item itself is the seed); it grows over 3-5 nights and returns 1-4. No watering.

## Fighters Guild and Gladiators' Arena (Mountain Town)
- **Guild** (`js/systems/guild.js`): Guildmaster Brenna offers lessons (100g for 60 combat XP, up to combat level 6) and a bunk to heal fully (30g). Two straw practice dummies give 3 combat XP per swing until combat level 3. Three guild fighters chat.
- **Arena** (`js/systems/arena.js`, bouts in `BOUTS` in `js/data/arena.js`): Arena Master Dorn starts one-on-one bouts. Win them in order (`S.arena` holds how many are beaten): Rookie gladiator (20 hp, hits 4, prize 80g), Pit brawler (36, 6, 200g), Iron Marcus (64, 9, 500g), Champion Valeria (110, 13, 1,500g). Repeat wins pay 20%. Swing by facing the opponent (a weapon must be equipped; poison works). If your health hits zero you yield: half health, no gold lost, back at the door. Leaving by the door ends the bout.

## Combat (early)
Only one enemy exists: the **spirit** on the graveyard isle southwest of the village pier (about 12 HP, hits for 6 every ~2 s when adjacent, chases within 7 tiles). Swing by facing it and pressing Use with a sword equipped (5 stamina). Respawns after ~25 s or on sleeping. Enemies and the Darkwood are meant to gain creatures later.

## Code layout
`index.html` has the page markup and loads `css/style.css` plus these scripts, in this order. They are classic scripts sharing one global scope (so `P`, `S`, `draw()` and so on stay global for tests and the console). Load order matters: world generation runs while the files load, and keyboard handlers fire in the order they were added.

| File | What is in it |
| --- | --- |
| `js/core.js` | `$`, canvas, map size constants, directions, look palettes |
| `js/data/items.js`, `gathering.js`, `recipes.js`, `skills.js`, `crops.js`, `shops.js` | Data tables: items, wood/ore/flax/herbs, recipes, skills, garden crops, blacksmith stock |
| `js/save.js`, `js/systems/flags.js` | Save version, `fresh()`, `migrate()`, loading and `save()` |
| `js/systems/inventory.js` | Bag helpers and the `TEST_GRANTS` / `TEST_KITS` switches |
| `js/systems/stats.js` | Stamina costs, levels, XP, `spend()` |
| `js/ui/hud.js` | Message line, toast, HP/STA bars |
| `js/render/light.js` | Graphics step 1.7: a visual-only day and night cycle (`DAY_MS` = 10 minutes of real time per day, starting in the morning when the game opens and when you sleep; not saved), the outdoor tint (warm at dusk and dawn, soft blue at night), warm glow from windows, lanterns, camp fires and stations at night, and a soft light and vignette. Test with `?time=night` (or `day`, `dusk`, `dawn`) on the game's link. |
| `js/render/indoors.js` | Graphics step 1.6: the Darkwood (mossy floor with leaf litter and roots, dense dark trees, packed-earth trail, drifting fireflies) and the home room (boards, rug, panelled walls, curtained windows, door), cached pictures like the rest. |
| `js/render/objects.js` | Graphics step 1.5: lanterns, fences (they join up), barrels, gravestones, stumps, rubble, treasure bundles, the five ores (gold and silver twinkle), ponds, crop plots, stone walls, the crafting stations and camp kit (flames and bubbles move) and your garden plots, one cached picture each (`SPRC`). |
| `js/render/shiprooms.js` | The ships' decks, cabins and storage rooms (tiles 125-139), three looks by ship, cached pictures. |
| `js/render/ships.js` | Boats redrawn from real sailing ships (Jack's reference chart): rowboat (oars), sloop (mast, mainsail, jib), schooner (two masts, fore-and-aft gaff sails, jibs), brig (two masts of square sails, black hull with yellow stripe and gun ports). Side view when sailing left or right, end-on when sailing up or down; sails stand above the tile; cached pictures. Items are `rowboat, sloop, schooner, brig` in that tier order; each has a `crew:[min,max]` field (the player counts as one) that is **not enforced yet** (the crew step, 6.2). Old saves that owned or used the trawler get the schooner. |
| `js/render/people.js` | Graphics step 1.4: people (the existing `CharacterSprite` shaded once and cached in `PCACHE`, with a soft shadow under the feet), the three boats (bow toward the way you sail, a small wake when moving), farm animals and pets, chickens and the spirit. |
| `js/render/houses.js` | Graphics step 1.3: houses and shops (stone foundation, timber walls, plaster band, door and step, shoji windows with flower boxes, thatch, slate or red roofs, signs, chimney smoke), one cached picture per building (`SPRC`, keys starting `h`); the guild and arena halls, temples and placeholder buildings keep their own drawing in `buildings.js` and `temples.js`. |
| `js/render/plants.js` | Graphics step 1.2: trees (three woods, pink blossom, apple), bushes, herbs, mushrooms, flax, tall grass and picked patches, drawn once into small pictures (`SPRC`) and copied each frame (trees about twice as fast as before). |
| `js/render/ground.js` | Graphics step 1.1: grass, sand, dirt path, sea floor and pier drawn once into small offscreen pictures (`GCACHE`) and copied each frame; only sparkles and foam move. `groundDirty()` empties the cache (call it when land or water tiles change while playing). |
| `js/world/village.js`, `overworld.js`, `settlement.js`, `earthtemple.js`, `interiors.js` | World generation: village island, mainland and islands, the Walled Settlement's extra houses and people, home interior and the Darkwood (also the `wv` save migration and regrowing tiles from the save) |
| `js/systems/player.js` | Player and boat position, movement |
| `js/render/sprites.js`, `tiles.js`, `buildings.js`, `temples.js`, `entities.js`, `draw.js`, `icons.js` | Character sprites, tiles and trees, buildings, chickens/spirit/stations, the frame (`draw()`), bag icons |
| `js/systems/gathering.js`, `home.js`, `stations.js`, `consumables.js`, `fishing.js`, `combat.js`, `darkwood.js`, `actions.js` | Game systems; `actions.js` has the Use button (`act()`) and sleeping |
| `js/ui/dialogue.js` | Dialogue box (step 2.2): `DLG` table of conversations (lines with `who`, `t`, optional `ch` choices, `set` flag, `go`), `runDialogue(id,end)`, `dlgSay(who,text)` for one-off lines, `portraitFor`/`drawPortrait` (16 portraits cut from the shaded people sprites; `PORTRAITS` list). Space/Enter/Use advances, Up/Down picks a choice; the player cannot walk while it is open. NPC chat uses it. |
| `js/ui/menu.js`, `crafting.js`, `shops.js`, `map.js`, `look.js` (also the tailor and barber), `bag.js`, `skills.js`, `character.js`, `quests.js` (the quest log, read from the `QUESTS` table) | Screens (`map.js` also has `TEST_SHOW_FULL_MAP` and the exploration fog) |
| `js/input.js` | D-pad and keyboard |
| `js/main.js` | Starts the draw loop and timers, restores the explored map, shows the first screen |

Shop sub-menus (N5): `shopTabs(el,key)` in `js/ui/shops.js` shows one tab per item type (`SHOPCAT`); each stock row carries a `cat`/`tag`, and the chosen tab is remembered per shop.

## Versions and caching
Every push to `main` that passes the tests is published to GitHub Pages. The publish step stamps the commit's short id on every script and style link (`?v=abc1234`) and on `BUILD`, so phones and browsers load the new files and not old saved copies. The welcome message on loading a save ends with `Version abc1234.` (it says `Version dev.` when the game is run from a downloaded copy), so you can tell which version you are playing.

## Save data
- **Story state (`S.story`):** `{q: current quest id or null, step, seen: [ids of scenes, letters and talks already shown]}`, with helpers `questSet`, `questStep`, `wasSeen`, `markSeen` in `js/systems/flags.js`. The story's yes/no switches stay in `S.flags` (`flag()`, `setFlag()`). Old saves get the default; no version bump was needed.
- `localStorage` key `little-harbor-v1`, JSON of `S`. `SAVE_V=3` with additive fields merged from defaults (`fresh()`); older saves are migrated and backed up to `little-harbor-v1-backup-v<N>`. `S.wv=2` marks coordinates that were shifted into the big map.
- Important fields: look, day, gold, hp, sta, xp{}, bag{}, eq{}, cut{}, placed[], gardens[], claim, home, coat, buff, arena, flags{} (story switches, see js/systems/flags.js), granted[], fog (string of 4800 0/1 flags for 4x4-tile chunks).
- **Never break existing saves.** Add fields with defaults, migrate old coordinates.

- **Ore** (`js/world/ores.js`, `ORE` in `js/data/gathering.js`): outcrops are only in the mountain country north of the Darkwood (rock terraces, x < 100, y < 100), picked with the world's fixed hash and always on open flat rock: **14 copper (15), about 11 tin (16), 8 bronze (17), 4 silver (124, rare) and 3 gold (123, rare)**, about 40 in all (it used to be about 190 scattered everywhere, including the village island and the Walled Settlement's road). `ORE_PLAN` holds the counts. They regrow after 3 days (silver 7, gold 10). Garrick buys silver ore (110g) and gold ore (200g) but never sells them (`noBuy`). Old saved ore records anywhere else are dropped when the game loads. Smelting gold and silver into bars is not built.

- **Mushrooms and forest sprigs** grow only in the **Darkwood** and only a few: `FOREST_PLAN` in `js/world/interiors.js` (20 forest sprigs, 22 red caps, 14 death caps, 24 blue caps, about 80 in all, down from about 850 scattered everywhere). They stand on clearing and trail tiles away from the gates, the cottage and the two people, picked with the world's fixed hash. Holly, basil and moss still grow outside as before. Old saved pick records of these outside the Darkwood are dropped on load.

## Aboard the ships
- On the **sloop, schooner and brig** the sailor is not drawn (only the rowboat shows you). While sailing one of them a **Deck** button appears next to Sleep: it takes you down to the ship's **deck** (a hidden room, `js/world/shiprooms.js`, zones 11-19, rows 282 and down, made from the `ROOMTAB` table; the boat waits at sea). On the deck: the **wheel** (Use it to take the helm and go on sailing), two doors in the deckhouse (left to your **quarters**, right to the **storage room**), masts and barrels; the decks are long (sloop 9 x 10 tiles, schooner 11 x 13, brig 13 x 16, masts down the middle, barrels along the rails). **Quarters:** a **bed** (Use it to sleep: the same as sleeping on the boat, with its own message); a cot, table and lantern on the sloop, a bunk, table, stool, bookshelf and rug on the schooner, a big bed, desks, shelves, chests, rug and lanterns on the brig. **Storage:** **crates** (Use any crate): an In storage / Your bag screen with Store 1, Store all, Take 1 and Take all. Space is the boat's `store` number (sloop 40, schooner 100, brig 240 things; sloop 2 crates, schooner 4, brig 8), shared by all its crates, saved in `S.ships[ship].store`. Equipped things and boats cannot be stored. Bigger ship, bigger rooms, nicer furnishings (pine, stained oak and brass, dark mahogany and gold). Tiles: 125 deck planks (walk), 126 rail, 127 mast base, 128 ship's wheel, 129 bed, 130 crate, 131 cabin floor (walk), 132 cabin wall, 133 table or desk, 134 stool, 135 lantern, 136 rug (walk), 137 bookshelf, 138 barrel, 139 chest. Code: `js/systems/shipboard.js` (Deck button, helm, bed, storage), art in `js/render/shiprooms.js`.

## Lists for Jack (made by a script)
- `NAMES.md` lists every named character, where they live and their job; `DIALOGUE.md` lists every spoken line and marks it **original** (word for word in the first game file Jack uploaded) or **placeholder** (written while building, to be replaced by Jack's own words). Both are made by `python3 tools/make_lists.py` and **checked by the smoke test** (it fails if either file is out of date, so run the script after adding people or lines). Lines Jack writes himself are listed in `JACKS_LINES.txt` and show as "Jack's"; `tools/original_lines.txt` holds the first game file's strings so the check works without the git history. Nobody is renamed and no line is changed because of these lists.

## Testing switches (remove before release)
- `TEST_GRANTS` grants a sword once. `TEST_KITS` roundA..roundG grant gold, materials, kits and lowered health/stamina once per save. `TEST_SHOW_FULL_MAP` makes the Map screen show everything (explored data is unaffected).

## Not built yet (planned, roughly in this order)
1. Creatures: Darkwood tall grass encounters and island monsters, using weapons, stamina, potions and poison.
2. Storms (stamina drain, forced camping), then pirates (pirate island, ship combat).
3. People and shops in the Walled Settlement and Mountain Town are in; still to come: house interiors, woodcutter's cottage interior; temple interiors; the Temple Tower and its mysterious strangers.
4. Story: festival opening, the seagull's letter, quests (characters already have empty `bio` slots in `NPC`).
5. Beverages and illness remedies; fishing difficulty rework; more fish zones; ship building variants; audio; cleaner onboarding; remove testing switches.

## Tile type reference
0 water, 1 grass, 2 sand, 3 plank, 4 tree, 5 building, 6 dirt, 7 lantern, 8 fence, 9 pond, 10 crop plot, 11 barrel, 12 stone wall, 13 gravestone, 14 stump, 15 copper outcrop, 16 tin outcrop, 17 bronze outcrop, 18 rubble, 19 flax, 20 cut flax, 21-23 home interior floor/wall/door, 24 moss, 25 holly, 26 basil, 27 forest sprig, 28 red cap, 29 death cap, 30 blue cap, 31 picked patch, 32 sea rock, 35 mountain (none left), 36 boulder, 40 forest floor, 41 thick tree, 42 forest trail, 43 forest exit arch (middle of the inside torii), 44 forest gate (middle of the outside torii), 45 settlement gate post, 51 torii post (not walkable), 46 treasure bundle, 47 tall grass, 48 rock floor, 49 cliff face (blocked), 50 rock steps, 52 arena sand (walkable), 53 arena stands with crowd (blocked), 54 jagged rock in the sea (blocked), 55 jagged rock on the shore (blocked), 56 pyramid stone (blocked), 57 pyramid stairs (walkable), 58 plaza paving (walkable), 59 sanctum floor (walkable), 60 sanctum wall/ceiling (blocked), 61 sanctum mural (blocked), 62 stone altar (blocked), 63 jaguar statue (blocked), 78 standing stone, 79 lintel slab, 80/81 carved temple stone (all blocked), 64 limestone courtyard (walkable), 65 stone boardwalk (walkable), 66 red column (blocked), 67 pool (blocked), 68 lamp post on water (blocked), 69 hall floor (walkable), 70 hall wall (blocked), 71 sea-god statue (blocked), 72 stairs down (blocked, used by facing), 73 vault rock (blocked), 74 vault water (blocked), 75 vault stone ledge, stepping stone or platform (walkable), 76 pedestal (blocked), 77 brazier (blocked), 78 standing stone (blocked), 79 lintel slab (blocked), 80 and 81 the two halves of the carved temple stone (blocked), 82 basalt ground (walkable), 83 black sand (walkable), 84 flowing lava (blocked), 85 basalt slab path (walkable), 86 volcanic peak (blocked), 87 crater lava lake (blocked), 88 hall floor (walkable), 89 hall wall (blocked), 90 gold-banded column (blocked), 91 golden dais steps (blocked), 92 altar flame (blocked), 93 incense burner (blocked), 94 white marble floor (walkable), 95 balustrade (blocked), 96 marble steps (walkable), 97 marble bridge (walkable), 98 bronze brazier (blocked), 99 fire basin (blocked), 100 tent ground (blocked), 101 pirate ship water (blocked), 102 pine tree (blocked), 103 raked gravel (walkable), 104 gravel with a stepping stone (walkable), 105 stone dock slab over water (walkable), 106 covered walkway wall (blocked), 107 gate post (blocked), 108 tatami (walkable), 109 shrine room wall, 110 pillar, 111 golden shrine, 112 lacquer platform, 113 offering table, 114 plain stand, 115 hanging gold lantern, 116 pagoda footprint (all blocked), 117/118 split temple stone halves (blocked), 119 dark stairs (blocked), 120 scorched ground (walkable), 121 toppled stone (blocked), 122 rubble (walkable), 123 gold ore outcrop (blocked), 124 silver ore outcrop (blocked). Walkable set: `WK`.
