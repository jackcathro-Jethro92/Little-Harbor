# Playtest notes and how we work through them

Jack's notes from the first playthrough (12 October 2026). He played until a bug made it impossible to leave the island, so these are the early notes only. Each note has an id (**P1** to **P15**). The plan below groups them into **batches**: one branch and one pull request per batch, in this order, so the game never stays broken and every merge can be played on a phone.

## How each batch runs
1. Claude Code builds the batch on its own branch, with tests, and updates `DESIGN.md` and this file.
2. The branch is checked by the automatic tests (Chromium and WebKit) when the pull request opens.
3. Jack merges the pull request, plays the changed bits on his phone, and sends the next notes. Anything that looks wrong goes into the next batch as a new note.
4. A batch starts only when its **questions** (if any) are answered. Notes that need a design decision are listed with the question.

## The notes
| Id | Note | Batch | Status |
| --- | --- | --- | --- |
| P1 | Create a full cinematic for the sea festival | 5 | **Built in Batch 5** (the seven-beat sequence Jack approved: silent, about 51 seconds, film bars, tap to skip, placeholder speech). Decided (Jack, 12 Oct): see "The festival cinematic" below |
| P2 | Slow the seagull down as it flies in and out | 1 | **Built** (flight takes twice as long, flaps slower) |
| P3 | Slow the movement speed of walking and sailing | 1 | **Built** (walking 70 to 110 ms a step, sailing 35 to 60 ms, and the slide to the next tile is slower too) |
| P4 | Pirates trigger when you land on the island, so they do not appear out of nowhere | 3 | **Built** (the first step on foot on the island puts the pirates at their posts, so they are standing there as the player walks up) |
| P5 | Remove the player character's spoken lines | 1 | **Built** (the player's festival and "Pirates!" lines are gone) |
| P6 | Combat turn-based | 4 | **Built in Batch 4a.** Decided (Jack, 12 Oct): every fight is turn-based. The spirit and the giant centipede open the battle screen when touched; the creature stays on the map if the player runs away |
| P7 | Different attacks for different weapons (sword slash, axe bash), learned as the combat skill with that weapon rises, plus blocks that buff stamina | 4 | **Built in Batch 4b.** Decided (Jack, 12 Oct): see "Weapon attacks" below |
| P8 | Add two more pirates on the pathway leading to the temple | 3 | **Built** (five pirates: two on the boardwalk path, three in the courtyard; they are weaker so the wooden sword can beat them) |
| P9 | Enemies stand on the green field in the battle, not in a box above it | 4 | **Built in Batch 4a** (a painted green field; the foes stand on it with shadows, no boxes) |
| P10 | Remove the "pirates have arrived" note when leaving the Northern Water Temple | 1 | **Built and confirmed (Jack, 12 Oct):** both the pop-up and the overnight sentence are gone; the camp fills silently at the next sleep |
| P11 | **Major bug:** the villager's news dragged the boat onto land and trapped it. The villager should come after two steps on village land, wherever the player lands | 1 | **Built** (the scene now starts only after two steps on foot, a boat trip never counts, and a scene that walks the player onto land gets them out of the boat first) |
| P12 | A new game starts with 0 gold and only a driftwood rod and a wooden sword | 1 | **Built.** Decided (Jack, 12 Oct): the rowboat stays in the bag from the start and the festival just shows Murl presenting it |
| P13 | Replace the "Me" menu with "Menu": character summary and save game, plus load game; remove Quests from it | 2 | **Built** |
| P14 | Add Quests as its own button beside Bag, Skills, Map and Menu | 2 | **Built** (the row is Bag, Quests, Skills, Map, Menu; Deck and Sleep moved to a small row above it so five buttons fit on a phone; the Q key opens the quests too) |
| P15 | A large house at the far north of the village where Bjorn lives; he is found there in every quest | 3 | **Built** (a big house with a path to its door; Bjorn stands outside it; no interior yet) |

## The batches
- **Batch 1: unblock the game (built).** P2, P3, P5, P10, P11, P12. Small, clear, and P11 was stopping play.
- **Batch 2: menus (built).** P13 and P14: the button row becomes Bag, Quests, Skills, Map, Menu. Menu shows the character summary and has Save game and Load game. Quests is its own screen.
- **Batch 3: Quest 1 and the village (built).** P4, P8, P15: the pirates stand on the island, visible from the landing (five of them: three in the courtyard and two on the pathway to the temple), and the big house for Bjorn at the village's north with Bjorn outside its door (Bjorn then stays there in every quest).
- **Batch 4a: the field and every fight turn-based (built).** P9 and P6. **Batch 4b: the weapon attacks (P7), built.**
- **Batch 4: battles (in two parts).** P9 (a green field with the foes standing on it), P6, P7. This is the biggest design change, so it waits for the answers below.
- **Batch 5: the festival cinematic (built).** P1. Built with the cinematic parts already used for the title screen, once the script is agreed.

## Questions for Jack
1. ~~**P6 "Combat turn-based":**~~ **Answered:** everything is turn-based; the spirit and the centipede open the battle screen when touched.
2. ~~**P7 attacks:**~~ **Answered, see "Weapon attacks" below.** (original question:) a first design to say yes or change. Each weapon type (sword, axe, and so on) has its own weapon skill level that rises as you use it. At set levels you learn a new attack for that weapon: for a sword, Slash at the start, then Quick Strike (a fast, light hit), then Power Slash (a heavy hit that costs stamina). For an axe: Chop, then Bash (stuns for a turn). **Block** is a menu choice that takes less damage that turn and gives back some stamina, so it also buffs stamina. Is that the idea?
3. ~~**P1 cinematic:**~~ **Answered, see "The festival cinematic" below.** (original question:) what should it show, beat by beat? A starting suggestion: the sun rising over the harbor, boats and lanterns, the villagers gathering, Murl on the pier giving the speech, the crowd cheering as the newest fisher steps forward and is given the rowboat, then fireworks or lanterns over the water. Anything to add or cut?
4. ~~**P12 the rowboat:**~~ **Answered:** keep the rowboat in the bag from the start. (original question:) Murl gives the rowboat at the festival, but it is already in your bag at the start. Should a new game start without a boat in the bag and have Murl hand it over in the festival?
5. ~~**P10:**~~ **Answered:** both stay removed. (original question: I removed both the pop-up and the overnight sentence about the pirate ships. Is that what you meant, or only the pop-up?)

## Weapon attacks (decided by Jack, 12 October)
- **Weapons to start with:** the sword and the axe (the wooden sword and bare hands count as the starter set). Each weapon type has its own weapon skill level that rises as it is used. **Attack power depends on the weapon skill only**, not on the overall Combat level.
- **Attacks:** the battle menu's Attack opens the list of attacks the player knows with the weapon in hand.
  - **Sword:** Slash (normal), Quick Strike (light), Power Slash (heavy).
  - **Axe:** Chop (normal), Bash (a normal hit that may stun), Cleave (heavy).
  - **Bare hands and wooden sword:** Strike (normal) and **Bash**.
  - Attacks are learned at set weapon skill levels (first design: the normal attack and, for the starter set, Bash at the start; the others at levels 3 and 6; to be tuned at the playtest).
- **Stamina:** **every attack costs stamina.** Light hits cost the least, normal hits a medium-low amount, heavy hits a high amount (first numbers to try, out of 100 stamina: light 2, normal 4, heavy 8; tunable). With too little stamina the player can only use what they can afford.
- **Stun:** every **Bash** has only a **15% chance** to stun the foe for a turn.
- **Block:** a menu choice that takes much less damage that turn and gives some stamina back, so it is how stamina is recovered in a fight.
- **Menu:** Attack (opens the attack list), Block, Item, Run (this replaces the Skill entry the roadmap planned).

## The festival cinematic (decided by Jack, 12 October)
- **Sequence (Jack said yes to all of it):** 1 sunrise over a dark, quiet harbor with gull cries as the only life; 2 the village wakes (lanterns and bunting go up, villagers gather along the road to the pier); 3 boats bob in the harbor and the camera pans slowly down the pier; 4 Murl steps onto the pier and gives his welcome speech, the crowd cheers; 5 the crowd parts for the newest fisher, who walks down the road to Murl; 6 Murl presents the little rowboat and ties it up at the end of the pier; 7 lanterns float out over the water, the sun climbs and the screen fades to the game with the player at the pier.
- **Silent** (no sound or music for now), about **50 seconds**, **placeholder speech** (Jack writes his own later), black film bars top and bottom, a tap anywhere skips it (the skip puts the game in the same place as the finished cinematic).

---

# Playtest #2 (Jack's second set of notes)

Jack's handwritten notes from the second playthrough. Spelling corrected; the crossed-out note ("When you die?") is dropped. Ids continue from the first set (**P16** onwards).

| Id | Note | Batch | Status |
| --- | --- | --- | --- |
| P16 | While in combat, show stamina as a blue bar | 6 | Planned |
| P17 | Quest 2 is in the quest log before talking with Bjorn: change that trigger | 6 | Planned |
| P18 | Movement could be slowed further | 6 | **Decided (Jack, 13 Oct):** see "Movement speed" below |
| P19 | Rename Quest 2 from "Find the Lost Man" to "Find Rue" | 6 | **Decided:** change the quest log name and Jack's story text |
| P20 | Adjust fish values to bring the value down | 7 | Decided: halve every fish's sell value |
| P21 | Add a tent to the camp kit that lets you sleep | 7 | Decided: tent is part of the camp kit, sleeping works like the boat. Still open: where it can be placed |
| P22 | Rename the first sword from "Sword" to "Old Sword" | 6 | Planned |
| P23 | The game does not pause in menus: show a notification that you have been attacked while distracted | 6 | **Decided (Jack, 13 Oct):** a notification for now, not a pause |
| P24 | Centipede respawn might need to be a little slower | 6 | Planned |
| P25 | The Map screen is too large for a computer screen: the bottom of the map cannot be seen | 6 | **Decided:** make it fit |
| P26 | Animations for attacks on the combat screen, and for blocks | 8 | Decided: swing, enemy hit, damage numbers, hit flash, shield flash on block, and foes that sometimes block |

## Decisions
- **Movement speed (P18):** walking and sailing both become slower. **The speed the game has now becomes the speed of the swiftness potion.** The speed for the boots will be designed when the boots are added to the game.
- **Quest 2's name (P19):** it becomes "Find Rue" in the quest log and in `STORY_TEXT.md`. (The story text is Jack's own words, so this change is made at his request.)
- **Attacked while distracted (P23):** while a menu, the bag or a screen is open the game keeps running. For this version, if a creature ambushes the player while a screen is open, the screen closes into the battle and a notification says the player was attacked while distracted. A pause may be considered later.
- **The Map screen (P25):** the whole map must be visible on a computer screen, including its bottom edge, so it scales to fit the window.

## The batches
- **Batch 6: quick fixes.** P16 (stamina bar), P17 (Quest 2 trigger), P18 (slower movement; the old speed becomes the swiftness potion's), P19 (Find Rue), P22 (Old Sword), P23 (the distracted notification), P24 (slower centipede respawn), P25 (the map fits).  **(built)**
- **Batch 7: items.** P20 (fish values) and P21 (the tent). **(built)**
- **Batch 8: battle animations and stamina.** P26 (sway, swing, hit flash, damage numbers, shield flash, foes that block) and P27 (walking and sailing cost 0.04 stamina a step instead of 0.08). **(built)**

## Questions for Jack
1. **P20 fish values:** by how much? A first suggestion: lower every fish's sell value by about a third (for example a 30-gold fish becomes 20), keeping the rarer fish more valuable than the common ones. Say a number or a feel ("half") and I will set it.
2. **P21 the tent:** (a) is it part of the existing camp kit, so that placing the camp kit gives you a tent you can sleep in, or a new item? (b) Should sleeping in the tent work like sleeping on the boat (restore health and stamina and start the next day)? (c) Should it be placeable anywhere on land, or only near the camp?
3. **P26 animations:** which are most important? A suggestion: the foe flashes and recoils when hit, the player lunges forward with the weapon, a slash arc over the foe for sword attacks and a chop arc for axes, a shield glow when blocking, and a stun spin of stars over a stunned foe.

### Jack's answers (Batches 7 and 8)
- **P20:** Fish values go down by half.
- **P21:** The tent is part of the camp kit and works like sleeping on the boat. Not answered yet: where it can be placed. My default: anywhere on land, away from buildings.
- **P26:** All of the animations: the player's swing, enemy hits, damage numbers, a flash when a hit lands, and a shield that flashes in front of the character when blocking. New: opponents can block too, and sometimes do.
- **P26 (added):** Characters in a battle always sway slightly from side to side, even when idle.
- **P27 (added):** Walking and sailing use less stamina: 0.04 a step (was 0.08). Jack agreed to the number.

# Playtest #3 (Jack's second playthrough, up to Quest 5, 13 to 14 October)
Jack's handwritten notes, transcribed with spelling corrected. Ids continue from the second set (**P28** onwards). One line was disregarded at Jack's request ("But not in a way that is enjoyable or challenging", a carry-over from the previous page). All of it is built on the branches `feature/playtest-3-batch-1`, `-batch-2`, `-batch-3` and `-armour` (stacked, one pull request).

| Id | Note | Status |
| --- | --- | --- |
| P28 | The tent in the camp kit is far too small, same as the campfire; the camp kit needs to be placed more easily | **Built.** Decided (Jack, 14 Oct): bigger-looking art but placeable almost anywhere; the tent is about 4 tiles (2 x 2) and the fire 1 tile; as long as the tent and fire do not clip onto an object the kit can go over any open ground |
| P29 | Add some challenge to Quest 3: Oak Island needs ghosts, or something at least | **Built** (four restless spirits on the grass near the logs; they fight like the Darkwood centipedes) |
| P30 | Getting the old axe from the woodcutter: the centipede could be avoided and got stuck on Hale | **Built.** Decided (Jack): you can still run past them as now, but they home in on your position and go round obstacles to reach you |
| P31 | No rocks block the entrance to the mountain settlement, so the pickaxe is never needed | **Built.** Decided (Jack): breakable rocks block the way, broken with the pickaxe, and a worker is animated hitting them without clearing them. When they are destroyed he says Jack's line "Thanks! this rock slide was going take all day to clear". Placed at the Darkwood's north exit (Jack chose this over rocks on the road, which could be walked round) |
| P32 | Animation for mining and woodchopping | **Built** (the axe or pickaxe swings towards what you face, with a spark or chips on the strike) |
| P33 | A new sword attack learned at level 2: "Swipe" or "Lunge" | **Built.** Decided (Jack): it is **Lunge**, learned at **Sword skill 2**; it does 10% more damage than Slash and costs more stamina; the earlier attacks stay |
| P34 | Pirates at the Earth temple are too easy to beat | **Built.** Decided (Jack): notably tougher, so you need the Old Sword or better and might need a potion or two for the whole group; a little tougher than the centipedes at the least |
| P35 | Movement is a good speed now | No change |
| P36 | The compass point disappears in the Darkwood | **Built** (the Darkwood's darkness was covering it; it now points to the gate towards the goal) |
| P37 | Water temple pirates are much too easy to beat | **Built.** Decided (Jack): each temple has more pirates and harder ones than the last, so the Sea vault has six (with a first mate) |
| P38 | Primary mechanics are working functionally | No change |
| P39 | Armour and weapons equip menu needs revamping: a visible section with a helmet, armour, weapon and boots square around a character picture; wearing them changes your appearance in the game | **Built.** Decided (Jack): armour is not drawn over the picture but off to the side; cloth, leather and chainmail to start (plate later); all armour is sold at Garrick's Forge (the tailor only changes clothes); it can also be crafted at Crafting level 10; the Quest 4 boots and Quest 5 armour are special, cannot be bought, and take the Boots and Armour slots like normal pieces |

## What was built and how it was tuned
- Details of each change are in `DESIGN.md`, under "Playtest #3 fixes (batch 1)" and "Armour and the equipment screen".
- **Pirates:** worked out with a small simulation of the real damage rules (a player who heals at 18 health). With the Old Sword at Sword skill 2 the Earth temple's five cost about two healing potions and the Sea vault's six about five; with the bronze sword about one and two to three. The wooden sword cannot win. These numbers are first guesses for the next playtest.
- **Armour prices and percentages** (cloth 12%, leather 20%, chainmail 32% for a full set; about 2,150g, 6,300g and 18,500g) are also first guesses.

## Next
- Plate armour, and Quest 6 (the Sky temple, roadmap 5.6), once these branches are merged and Jack has played them.
- Not done yet from earlier rounds: picking flax and herbs with the knife has no swing animation.

# Playtest #4 (Jack's full playthrough, handwritten notes, 22 October 2026)
Transcribed from six notebook pages, spelling corrected, in the order Jack wrote them. Ids continue from the third set (**P40** onwards). Three notes say "screenshot" (P55, P65, P77): the pictures have not arrived yet, so those wait for them. Batch A is built (below); the other batches are a proposal for Jack to reorder.

| Id | Note | Batch | Status |
| --- | --- | --- | --- |
| P40 | Menus are very messy; some things could be condensed. A complete overhaul of the Pack and item equipping, more like Stardew | F |  |
| P41 | Carry capacity might be worth adding, together with "Drive the character to make a base" (unclear: see questions), which means we also need a storage system (more like Stardew) | F |  |
| P42 | Running out of stamina has a negative effect: a much slower walking speed. The swiftness potion could then help the player move faster again, but nothing regains stamina except sleep | A | **Built** (batch A) |
| P43 | Taverns offer a place to sleep | G |  |
| P44 | Run should have a chance to fail against wild creatures, and is not an option against pirates (combat) | C |  |
| P45 | The font for numbers is hard to read | A | **Built** (batch A): digits use a clearer device font |
| P46 | Bram sells weapons; remove this, only the blacksmith sells weapons | A | **Built** (batch A): the Old Sword moved to Garrick |
| P47 | Island names brought into continuity across the map and the story text | A | Waiting for Jack to pick the names (see questions) |
| P48 | Story text: revise spelling mistakes | A | **Built** (batch A): spelling and grammar only, meaning unchanged |
| P49 | Equipment menu: a section for the equipped tool, depending on what you need to do | F |  |
| P50 | Clearing the rockpile outside the mountain settlement: the pickaxe only breaks one stone. Change the dialogue; if you break all the stones the NPC gives you a gold reward | A | **Built** (batch A): each rock breaks on its own, 150 gold from Dell when all six are gone |
| P51 | Remove the stamina penalty for movement | A | **Built** (batch A) |
| P52 | When the character is hit by an attack make it more obvious: a flash or an animation showing the hit | C |  |
| P53 | Announce when you have learned a new attack | C |  |
| P54 | The carpenter: who sells furniture? | G (question) |  |
| P55 | The character walks over the top of the Temple Tower (screenshot to come) | D |  |
| P56 | Workbench art: twice the size | A | **Built** (batch A): two tiles wide, vice and tools |
| P57 | Should be able to sell unwanted weapons | E |  |
| P58 | Moving sellable goods around: blacksmith buys and sells ore, weapons, armour; carpenter planks, rope; tailor cloth; apothecary potions, ingredients; goldsmith gold, silver, jewellery; general store food and ingredients | E |  |
| P59 | Quest "At the Top of the World": the pirates should be scattered up the pathway so they are unavoidable | B |  |
| P60 | All pirates should trigger when they see you and the fight starts (Pokemon as the reference) | B |  |
| P61 | Quest "At the Top of the World": after the explosion the pirate leader comes walking down the path, and this starts your interaction with him | B |  |
| P62 | Weapon strength needs to be developed and nerfed | C |  |
| P63 | When using a potion (healing or stamina) a bar shows the increase in those stats | C |  |
| P64 | Quest "Under Attack": more black smoke from the burning houses; move the burning houses; when the pirates are defeated the screen fades to black and all pirates are gone, the fires are out and the burning houses are now burnt ruins | B |  |
| P65 | Gate at the entrance to the Temple Tower: the character clips (screenshot to come) | D |  |
| P66 | Quest "Into the Depths": the chamber at the Temple Tower entrance is not a solid object when the character moves | D |  |
| P67 | More enemies in the Temple Tower chamber, and dynamic traps that hurt you if triggered (poison dart, fire trap) | D |  |
| P68 | Quick Strike: a chance to hit twice before the opponent can hit you back | C |  |
| P69 | Final fight quest: the pirates should be all around the spiral walking path of the Water island | B |  |
| P70 | Divine Strike is far too powerful compared with the pirates; pirates need to hit harder and take hits better | C |  |
| P71 | A limited number of uses for each attack | C |  |
| P72 | Sea creatures can attack while you sail, out of nowhere: an alert, then you jump into battle. Ancient squid, sharks | C |  |
| P73 | The mountain area needs an enemy: a Rock Dragon (a Komodo dragon made of stone) that breathes fire | C |  |
| P74 | Haven Isle should be further north than where it is now | D |  |
| P75 | Sailors' Grave Rocks should be like the jagged rocks that block the northern mainland's coastline | D |  |
| P76 | The house on Haven Isle needs work on its interior | D |  |
| P77 | The character hovers over the gate on Haven Isle (screenshot to come) | D |  |

(P55, P65 and P77 are the screenshot notes; they are the same kind of fault, the drawing order of the character over a gate or roof.)

## Proposed batches (small ones first, so each merge can be played on a phone)
- **A, quick fixes:** P42, P45, P46, P47, P48, P50, P51, P56. Slow walking at zero stamina, no stamina cost for walking or sailing, easier-to-read numbers, Bram's weapons removed, island names matched, spelling, the rockpile (all stones break, gold reward), a bigger workbench picture.
- **B, the pirate quests:** P59, P60, P61, P64, P69. Pirates stand along the path and start the fight when they spot you; the leader walks down after the explosion; smoke and burnt ruins in "Under Attack"; pirates around the Water island's spiral path.
- **C, fighting:** P44, P52, P53, P62, P63, P68, P70, P71, P72, P73. The biggest batch (rebalancing, uses per attack, new enemies), so it should be split in two when we get there.
- **D, world and Temple Tower fixes:** P55, P65, P66, P67, P74, P75, P76, P77.
- **E, shops:** P57, P58. Who buys and sells what.
- **F, bag, equipment and storage:** P40, P41, P49. A redesign, so it needs Jack's answers first.
- **G, taverns and furniture:** P43, P54.

## Jack's answers (22 Oct)
1. **P42/P51:** walking and sailing cost no stamina; actions cost stamina as now; potions and food can restore stamina.
2. **P41 "Drive the character":** disregard that note.
3. **P41 carry capacity and storage:** disregard until the full user-interface redevelopment (batch F).
4. **Carpenter (P54):** in one of the houses just outside the Darkwood's southern entrance. Sells home furnishings: beds, bookcases, tables and chairs, carpets, weapon racks, tool racks, chests of drawers, storage crates. More to come.
5. **Workbench (P56):** the craftable bench placed in a house is a two-tile object, more detailed, with a vice and tools on top.
6. **Taverns (P43):** one in the Walled Settlement and one in the Mountain Town; a night's sleep costs 100 gold.

## Still open
- **P47, island names.** The map still shows "Island 1", "Island 2", "Island 3", "Island 4", "Island 5", and the quest hints say "Island 3" and "Island 6", while Jack's own words say "fire island" and the map calls the volcano "Volcano Island" until the pirates come, then "Pirate Island". Names need Jack's choice for each island before they are changed everywhere.
