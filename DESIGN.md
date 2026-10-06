# Little Harbor: design document

A top-down pixel-art fishing and exploration game for phones (primarily iPhone 14, Safari). Inspired by Stardew Valley (skills, crafting, villagers) and early Pokemon (menus, bag screen, forest route design). Everything below describes what is **already built** unless it is under *Not built yet*.

## How to play (controls)
- **D-pad** moves (hold to repeat); keyboard: arrows or WASD. **Use** button (Space/Enter) interacts with the tile you face.
- Buttons: **Sleep** (only on the boat or at home), **Bag** (B), **Skills** (K), **Map** (M).
- Facing water from the boat and pressing Use casts a line; when the bite alert appears, press Use again within about a second.

## World
- Map is **320 x 240 tiles**, 16 px per tile, camera 11 x 13 tiles. Tile type numbers are listed at the end.
- Built from a hand-drawn sketch at roughly 1 tile per 7 sketch units. Sea is fully connected: every island and the mainland coast can be reached by boat.
- The original village island was generated in its own local coordinates and then shifted by (OX=124, OY=91). Old saves are migrated by `S.wv`.

### Landmarks (tile coordinates)
| Name | x | y |
| --- | --- | --- |
| Village | 156 | 113 |
| Mainland | 50 | 185 |
| Mountain Town | 31 | 96 |
| Walled Settlement | 100 | 210 |
| Settlement Docks | 154 | 215 |
| Woodcutters' Shacks | 33 | 153 |
| Temple to the Mountains | 9 | 27 |
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
| Temple Tower | 201 | 196 |
| Spirit Isle | 146 | 135 |
| Darkwood south gate | 36 | 146 |
| Darkwood north gate | 12 | 37 |

### Separate maps (zones)
These are hidden rectangles of the main grid. They look like water from outside and the area beyond their edge is drawn black from inside. Entities and buildings are only drawn when the player is in the same zone (`zoneOf`).
- **Home interior**: x 300-311, y 226-235. Entered through the player house's door tile; exit by facing the interior door.
- **The Darkwood**: x 100-147, y 4-39. Dark forest with a light radius around the player. South gate arrives at (123,38), north gate at (136,5). Overworld gates: south at (36,149) by the woodcutters, north at (12,35) toward the Temple to the Mountains. Contents: winding trail, 4 dead ends with treasure bundles, 2 more bundles on the trail, tall grass (7% chance of a herb, 3% chance of a 4 damage hornet sting per step), woodcutter's cottage with Hale, forager Wren, many mushrooms and herbs.

### Mainland features
- Walled Settlement (x 84-115, y 200-234): 8 houses, west gate (road to the woodcutters and the Darkwood), east gate (3-wide path to the docks), closed south wall. Docks: two-wide pier with an end platform around (154,217).
- Mountain Town (x 19-43, y 87-106): walls, 5 houses, gate at the south. No people yet.
- Mountain stone was deliberately removed everywhere on request. Sea rocks (Sailors' Grave Rocks) remain.
- Temples (to the Mountains, of Fire, of the Sea, to the Sky) and the Temple Tower are scenery placeholders.

## Player and stats
- Health max 50 (+4 per Combat level). Stamina max 100. FireRed-style HP and STA bars; HP bar goes green, yellow, red.
- Stamina costs: walk 0.08, sail 0.08, cast 2, swing 5, storm 0.5, gather 3, forage 1.5 (storm is unused until storms exist).
- Zero health: you wake on your boat with half health and stamina and lose 10% of your gold. Zero stamina: you can still move but cannot cast, swing, chop, mine or pick.
- Sleeping (boat or home) restores everything, advances the day, regrows resources, resets the test ghost.
- Character look: skin, hair, shirt, jacket colours, hat (cap, straw, none), backpack and jacket toggles. 16x20 sprite module (`CharacterSprite`) with walk frames and a fishing pose. Chosen on first launch only.

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
- All items live in one data table (`ITEMS`): add a row to add an item. Kinds: boat, claim, fish, food, forage, garden, ingredient, material, potion, prefab, rod, station, tool, weapon (79 items).
- Bag pockets (FireRed style, left/right to switch): Ingredients (fish, vegetables, meat, foraged herbs and mushrooms), Consumables (food and potions; Eat, Drink or Apply), Materials, Gear (rods, weapons, tools, stations, house kits, claims, garden kits; Equip or Place), Equipped (slots: rod, weapon, pickaxe, axe, knife).
- Boats are not in the bag: they are switched at Captain Rue's boatyard. Rods and boats are bought in order; boats can be bought or built in any order.
- Test sword is granted once (see testing flags).

### Shops
- **Bram's Tackle & Tools** (village): rods, sword 300, pickaxe 200, woodcutter's axe 200, knife 60, camp kit 150, workbench 100, forge 400, cooking station 250, alchemy station 300, garden kit 120, home claim 500.
- **Odo's General Store** (village): buys and sells ingredients (carrot 5, cabbage 6, broccoli 7, parsnip 6, potato 4, chicken 14, pork 16, beef 20); buys fish, ingredients (half price), cooked meals and foraged herbs.
- **Captain Rue's Boatyard**: switch boats; sells sloop 100,000, trawler 250,000, and the shipwright station (1,500).

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

## Combat (early)
Only one enemy exists: the **spirit** on the graveyard isle southwest of the village pier (about 12 HP, hits for 6 every ~2 s when adjacent, chases within 7 tiles). Swing by facing it and pressing Use with a sword equipped (5 stamina). Respawns after ~25 s or on sleeping. Enemies and the Darkwood are meant to gain creatures later.

## Code layout
`index.html` has the page markup and loads `css/style.css` plus these scripts, in this order. They are classic scripts sharing one global scope (so `P`, `S`, `draw()` and so on stay global for tests and the console). Load order matters: world generation runs while the files load, and keyboard handlers fire in the order they were added.

| File | What is in it |
| --- | --- |
| `js/core.js` | `$`, canvas, map size constants, directions, look palettes |
| `js/data/items.js`, `gathering.js`, `recipes.js`, `skills.js`, `crops.js` | Data tables: items, wood/ore/flax/herbs, recipes, skills, garden crops |
| `js/save.js` | Save version, `fresh()`, `migrate()`, loading and `save()` |
| `js/systems/inventory.js` | Bag helpers and the `TEST_GRANTS` / `TEST_KITS` switches |
| `js/systems/stats.js` | Stamina costs, levels, XP, `spend()` |
| `js/ui/hud.js` | Message line, toast, HP/STA bars |
| `js/world/village.js`, `overworld.js`, `interiors.js` | World generation: village island, mainland and islands, home interior and the Darkwood (also the `wv` save migration and regrowing tiles from the save) |
| `js/systems/player.js` | Player and boat position, movement |
| `js/render/sprites.js`, `tiles.js`, `buildings.js`, `entities.js`, `draw.js`, `icons.js` | Character sprites, tiles and trees, buildings, chickens/spirit/stations, the frame (`draw()`), bag icons |
| `js/systems/gathering.js`, `home.js`, `stations.js`, `consumables.js`, `fishing.js`, `combat.js`, `darkwood.js`, `actions.js` | Game systems; `actions.js` has the Use button (`act()`) and sleeping |
| `js/ui/menu.js`, `crafting.js`, `shops.js`, `map.js`, `look.js`, `bag.js`, `skills.js` | Screens (`map.js` also has `TEST_SHOW_FULL_MAP` and the exploration fog) |
| `js/input.js` | D-pad and keyboard |
| `js/main.js` | Starts the draw loop and timers, restores the explored map, shows the first screen |

## Save data
- `localStorage` key `little-harbor-v1`, JSON of `S`. `SAVE_V=3` with additive fields merged from defaults (`fresh()`); older saves are migrated and backed up to `little-harbor-v1-backup-v<N>`. `S.wv=2` marks coordinates that were shifted into the big map.
- Important fields: look, day, gold, hp, sta, xp{}, bag{}, eq{}, cut{}, placed[], gardens[], claim, home, coat, buff, granted[], fog (string of 4800 0/1 flags for 4x4-tile chunks).
- **Never break existing saves.** Add fields with defaults, migrate old coordinates.

## Testing switches (remove before release)
- `TEST_GRANTS` grants a sword once. `TEST_KITS` roundA..roundG grant gold, materials, kits and lowered health/stamina once per save. `TEST_SHOW_FULL_MAP` makes the Map screen show everything (explored data is unaffected).

## Not built yet (planned, roughly in this order)
1. Creatures: Darkwood tall grass encounters and island monsters, using weapons, stamina, potions and poison.
2. Storms (stamina drain, forced camping), then pirates (pirate island, ship combat).
3. People and shops in the Walled Settlement and Mountain Town; woodcutter's cottage interior; temple interiors; the Temple Tower and its mysterious strangers.
4. Story: festival opening, the seagull's letter, quests (characters already have empty `bio` slots in `NPC`).
5. Beverages and illness remedies; fishing difficulty rework; more fish zones; ship building variants; audio; cleaner onboarding; remove testing switches.

## Tile type reference
0 water, 1 grass, 2 sand, 3 plank, 4 tree, 5 building, 6 dirt, 7 lantern, 8 fence, 9 pond, 10 crop plot, 11 barrel, 12 stone wall, 13 gravestone, 14 stump, 15 copper outcrop, 16 tin outcrop, 17 bronze outcrop, 18 rubble, 19 flax, 20 cut flax, 21-23 home interior floor/wall/door, 24 moss, 25 holly, 26 basil, 27 forest sprig, 28 red cap, 29 death cap, 30 blue cap, 31 picked patch, 32 sea rock, 35 mountain (none left), 36 boulder, 40 forest floor, 41 thick tree, 42 forest trail, 43 forest exit arch, 44 forest gate, 45 gate post, 46 treasure bundle, 47 tall grass. Walkable set: `WK`.
