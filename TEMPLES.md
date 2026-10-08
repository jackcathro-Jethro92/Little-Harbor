# Temple art designs (approved)

These are **design references**, not game-ready assets yet. The pictures are in `art/temples/`: each folder holds a plan of the whole complex plus phone-sized screens (176x208 game pixels, saved at 4x) in the game's pixel style. When you build a temple, match these layouts, palettes and moods, and turn them into tiles, props and zones in the game.

**Build order:** (1) develop the island each temple stands on, (2) develop the temple itself. Island first, temple second.

The temples match the map landmarks in DESIGN.md: Temple of the Sea, Temple to the Mountains (Earth), Temple to the Sky (Air), Temple of Fire, and the Temple Tower.

**No story or quests yet.** Keys, locked or damaged states, hidden chambers that matter to the plot and anything similar have been taken out of these notes. Some pictures still show keys, altars with items, damaged stones or an empty cradle: treat those as scenery only and do not build them as game features. The story comes last and the owner is still writing it.

## Knossos Temple (Sea / Water temple) - `knossos_temple/`
- The temple stands at the centre of a crater lake, reached by a stone boardwalk.
- Route: crater rim gate, then the boardwalk (red lamp posts), the gatehouse, a courtyard with a dolphin fountain pool and water channels, the temple hall (statue of the sea god, stairs going down), then the vault below the lake.
- The vault is a cave under the lake: dark water, stepping stones to a platform between two red columns, and a pedestal.
- Look: Minoan Knossos palace. Red columns with black capitals that are wider at the top, red plaster walls with white bands, a cream frieze of wavy red hills and blue dolphins, a band of blue-centred discs, pale limestone, and gypsum floors.

## Mayan Temple Design (Earth temple) - `mayan_temple/` (BUILT: see DESIGN.md and `js/world/earthtemple.js`)
- Ancient Mayan ruins (Palenque, Tulum) in dusty mountains with no grass or trees. The palette comes from a dusty-mountain pixel-art reference: taupe ground, brown rock, grey boulders, blue sky, and a few small green tufts.
- Route: mountain path in, a plaza with a low altar platform, two side shrines, a stepped pyramid with one central stairway, and a temple on top. The temple front has three doorways and a lattice roof crest, with serpent heads at the top of the stairs.
- The sanctum has a stepped stone ceiling. The back wall has carved glyph blocks above a painted codex-style mural: a red border, black glyphs, dot-and-bar numbers, and skeletal, jaguar and bird-headed figures. Jaguar statues with jade eyes flank an altar.

## Sky Stonehenge Temple (Sky / Air temple) - `sky_stonehenge_temple/`
- Celtic and Druid stone circles (Stonehenge, Druid's Temple) on a high flat plateau above the clouds.
- Route: cliff path up, a stone gateway (two uprights and a capstone), an avenue of standing stones, an outer circle of 16 stones with lintels, five inner stone arches in a horseshoe, and a carved temple stone in the centre with triple spirals and knotwork.
- Use the undamaged pictures only. The `damaged` pictures belong to the story and are not used yet.

## Fire Temple - `fire_temple/`
- A palace on a volcano island, based on the Forbidden City in Beijing, with a Fire Nation feel. Do not copy any show-specific emblems or characters.
- Route: black sand landing with turquoise reef, a basalt stepping-stone path between lava rivers, then a great red gate with three arched gateways under a two-tier golden roof, crossed by a white marble bridge over a lava moat.
- Inside the gate: a white marble courtyard with three tiers of terraces and balustrades, bronze braziers, a round fire basin and lava channels. The main hall has red columns, gold panels and a golden double roof.
- The fire hall: red columns banded in gold, a gold plaque over a gold swirl frieze, white lattice windows and teal bronze incense burners. Golden steps lead up a dais to an altar where the sacred flame burns.
- Look: Forbidden City red `#b8322a`, roof gold `#e8b030` with blue-green eave bands, white marble, black volcanic rock, lava oranges, and a smoky orange-and-purple sky.

## Temple Tower - `temple_tower/`
- A Japanese pagoda complex (Horyu-ji style), with heavy use of wood tones and soft, warm light.
- Route: a gravel path with stepping stones through pines, lined with glowing stone lanterns, then a wooden gate with a dark tiled roof, then a raked gravel courtyard framed by covered walkways.
- The pagoda has five storeys: dark blue-grey tiled roofs with upturned corners and gold trim, wooden balconies with white plaster panels, and a tall spire with gold rings, on a stone base with steps.
- Shrine room (ground floor): a dark coffered ceiling, a carved plaque with a blank panel, glowing paper screens, and dark wooden pillars. A small golden shrine with a curved gold roof sits on a black-and-red lacquered platform, with hanging gold lanterns. A red offering table on a tatami floor holds a bronze crane and offerings. Four plain stands stand in a row.
- Lower chamber (build later, with the story): dark stone with wooden beams, four small roofed alcoves glowing blue, green, white and orange, a round stone platform carved with rings, and two paper lanterns.

## Tools
`tools/` holds the Python (Pillow) scripts that drew these images, plus `pixel_helpers.py`. Run `python3 tools/draw_<temple>.py` to redraw a temple; it writes `render_*.png` files into that temple's folder. They are a reference for palettes and shapes when making the real tiles.
