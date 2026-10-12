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
| P1 | Create a full cinematic for the sea festival | 5 | **Decided (Jack, 12 Oct):** see "The festival cinematic" below |
| P2 | Slow the seagull down as it flies in and out | 1 | **Built** (flight takes twice as long, flaps slower) |
| P3 | Slow the movement speed of walking and sailing | 1 | **Built** (walking 70 to 110 ms a step, sailing 35 to 60 ms, and the slide to the next tile is slower too) |
| P4 | Pirates trigger when you land on the island, so they do not appear out of nowhere | 3 | **Built** (the first step on foot on the island puts the pirates at their posts, so they are standing there as the player walks up) |
| P5 | Remove the player character's spoken lines | 1 | **Built** (the player's festival and "Pirates!" lines are gone) |
| P6 | Combat turn-based | 4 | **Decided (Jack, 12 Oct): every fight is turn-based.** The spirit and the giant centipede open the battle screen when touched; the creature stays on the map if the player runs away |
| P7 | Different attacks for different weapons (sword slash, axe bash), learned as the combat skill with that weapon rises, plus blocks that buff stamina | 4 | **Decided (Jack, 12 Oct):** see "Weapon attacks" below |
| P8 | Add two more pirates on the pathway leading to the temple | 3 | **Built** (five pirates: two on the boardwalk path, three in the courtyard; they are weaker so the wooden sword can beat them) |
| P9 | Enemies stand on the green field in the battle, not in a box above it | 4 | Planned |
| P10 | Remove the "pirates have arrived" note when leaving the Northern Water Temple | 1 | **Built and confirmed (Jack, 12 Oct):** both the pop-up and the overnight sentence are gone; the camp fills silently at the next sleep |
| P11 | **Major bug:** the villager's news dragged the boat onto land and trapped it. The villager should come after two steps on village land, wherever the player lands | 1 | **Built** (the scene now starts only after two steps on foot, a boat trip never counts, and a scene that walks the player onto land gets them out of the boat first) |
| P12 | A new game starts with 0 gold and only a driftwood rod and a wooden sword | 1 | **Built.** Decided (Jack, 12 Oct): the rowboat stays in the bag from the start and the festival just shows Murl presenting it |
| P13 | Replace the "Me" menu with "Menu": character summary and save game, plus load game; remove Quests from it | 2 | Planned |
| P14 | Add Quests as its own button beside Bag, Skills, Map and Menu | 2 | Planned |
| P15 | A large house at the far north of the village where Bjorn lives; he is found there in every quest | 3 | **Built** (a big house with a path to its door; Bjorn stands outside it; no interior yet) |

## The batches
- **Batch 1: unblock the game (built).** P2, P3, P5, P10, P11, P12. Small, clear, and P11 was stopping play.
- **Batch 2: menus.** P13 and P14: the button row becomes Bag, Quests, Skills, Map, Menu. Menu shows the character summary and has Save game and Load game. Quests is its own screen.
- **Batch 3: Quest 1 and the village (built).** P4, P8, P15: the pirates stand on the island, visible from the landing (five of them: three in the courtyard and two on the pathway to the temple), and the big house for Bjorn at the village's north with Bjorn outside its door (Bjorn then stays there in every quest).
- **Batch 4: battles.** P9 (a green field with the foes standing on it), P6, P7. This is the biggest design change, so it waits for the answers below.
- **Batch 5: the festival cinematic.** P1. Built with the cinematic parts already used for the title screen, once the script is agreed.

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
