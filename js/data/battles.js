// ---------- turn-based fighters and battles (roadmap 3.6, a basic first version) ----------
// FOES.some_id = {n:'Name', hp, hit:[min,max], gold:[min,max], xp, drops:[[item, chance 0-1, count],...], look:{...person look...}, atk:'what it does when it hits', flee:{at:0.3, msg:'text'}}
//   hit    damage of each of its hits (your Ward from jewellery lowers it)      look   the same look fields as townspeople (js/data/pirates.js); the battle draws them as a person
//   flee   (optional) when its health falls to `at` of its maximum it runs away instead of fighting on (the pirate boss in the story)
// BATTLES.some_id = {foes:['foe id', ...], noRun:1, win:[actions], lose:[actions], ran:[actions], escaped:[actions]}
//   Up to three foes. The actions are the same as a trigger's (set a flag, give an item or gold, move a person, change the quest step...) and run when the fight ends that way: win = every foe beaten,
//   lose = you were knocked out (you then wake on your boat as usual), ran = you got away, escaped = the foes that were left ran away. Start one with a trigger action {battle:'id'} (js/systems/triggers.js)
//   or startBattle('id', onEnd). Rows named test_* are for the testing menu (TEST_STORY). Turn-based fighters are pirates, the pirate boss and fighters-guild characters; creatures stay real-time (js/data/enemies.js).
const FOES={
 // the creatures of the open sea (playtest #4, js/systems/wildlife.js): they attack a sailing boat out of nowhere. They are wild, so Run works against them (`escape`), and they fight on the sea field.
 sea_shark:{n:'Shark',hp:36,hit:[4,7],gold:[20,40],xp:60,drops:[['tuna',.5,1]],atk:'bites',art:'shark',field:'sea',escape:.5,block:0},
 sea_squid:{n:'Ancient squid',hp:120,hit:[8,12],gold:[100,200],xp:220,drops:[['tuna',.6,2],['koi',.25,1]],atk:'lashes you with a tentacle',art:'squid',field:'sea',escape:.35,block:0,
  pattern:[{atk:'lashes you with a tentacle',hit:[8,12]},{atk:'slams you with two arms',hit:[9,13]},{wind:'coils its great arms around the boat...'},{atk:'crushes the boat in its grip',hit:[18,24]}]},
 pirate_grunt:{n:'Pirate grunt',hp:10,hit:[1,3],gold:[10,25],xp:25,drops:[['rope',.3,1]],atk:'swings a cutlass',look:{skin:1,hair:3,shirt:1,jk:2,hat:'cap',hc:1,pack:false}},
 pirate_gunner:{n:'Pirate gunner',hp:8,hit:[2,4],gold:[12,30],xp:30,drops:[['iron_bar',.15,1]],atk:'fires a pistol',look:{skin:2,hair:0,shirt:4,jk:5,hat:'cap',hc:0,pack:false}},
 // the temple pirates (playtest #3): tougher than the Sea temple's first five. The Earth temple's (a little tougher per head than a Darkwood centipede, 30 health and 3-6 a hit, and five of them in a row) need the Old Sword or better and a potion or
 // two; the Sea vault's six hit harder, have more health and include a first mate. Each temple has more pirates and harder ones (Jack's note). Simulated with the real damage rules, healing at 18 health: with the Old Sword (damage 5, Sword skill 2) the Earth five cost about two healing potions and the Sea six about five; the bronze sword needs about one and two to three; the wooden sword needs about six for the Earth five, so it is not realistic. First guesses for the next playtest.
 earth_grunt:{n:'Pirate grunt',hp:20,hit:[4,6],gold:[15,30],xp:35,drops:[['rope',.3,1]],atk:'swings a cutlass',look:{skin:1,hair:3,shirt:1,jk:2,hat:'cap',hc:1,pack:false}},
 earth_gunner:{n:'Pirate gunner',hp:15,hit:[5,7],gold:[18,35],xp:40,drops:[['iron_bar',.2,1]],atk:'fires a pistol',look:{skin:2,hair:0,shirt:4,jk:5,hat:'cap',hc:0,pack:false}},
 sea_cutthroat:{n:'Pirate cutthroat',hp:24,hit:[5,7],gold:[25,45],xp:50,drops:[['rope',.4,1]],atk:'slashes with a cutlass',look:{skin:1,hair:3,shirt:2,jk:2,hat:'cap',hc:1,pack:false}},
 sea_gunner:{n:'Pirate gunner',hp:18,hit:[5,8],gold:[28,50],xp:55,drops:[['iron_bar',.25,1]],atk:'fires a pistol',look:{skin:2,hair:0,shirt:4,jk:5,hat:'cap',hc:0,pack:false}},
 sea_mate:{n:'First mate',hp:32,hit:[6,9],gold:[50,80],xp:80,drops:[['iron_bar',.4,1]],atk:'swings a heavy cutlass',look:{skin:3,hair:2,shirt:1,jk:0,hat:'cap',hc:2,hstyle:'short',pack:false}},
 // the pirates on the Sky temple's path (Quest 6): seven, harder again. Playtest #4 (P70) made the late pirates hit harder and take hits better (simulated with the real damage rules: the Sky path costs about 1 to 2 potions with an iron sword at Sword skill 4 and about 2 with a bronze sword at skill 3; the 13 raiders about 2; the Final Fight's 12 about 2 to 3 with the Divine Blade; Barron about 1 and 11 turns)
 sky_grunt:{n:'Pirate grunt',hp:36,hit:[7,10],gold:[30,55],xp:60,drops:[['rope',.4,1]],atk:'swings a cutlass',look:{skin:1,hair:3,shirt:1,jk:2,hat:'cap',hc:1,pack:false}},
 sky_gunner:{n:'Pirate gunner',hp:30,hit:[7,11],gold:[35,60],xp:65,drops:[['iron_bar',.3,1]],atk:'fires a pistol',look:{skin:2,hair:0,shirt:4,jk:5,hat:'cap',hc:0,pack:false}},
 sky_bruiser:{n:'Pirate bruiser',hp:48,hit:[8,12],gold:[55,90],xp:90,drops:[['iron_bar',.5,1]],atk:'swings a boarding axe',look:{skin:3,hair:2,shirt:0,jk:0,hat:'none',hstyle:'bald',pack:false,armour:{body:'leather',boots:'leather'}}},
 // the raiders on the village (Quest 7): twelve in three waves, about as hard as the Sky temple's seven, with healing potions handed out between the waves
 raid_raider:{n:'Pirate raider',hp:32,hit:[7,10],gold:[25,45],xp:50,drops:[['rope',.4,1]],atk:'swings a cutlass',look:{skin:1,hair:3,shirt:1,jk:2,hat:'cap',hc:1,pack:false}},
 raid_gunner:{n:'Pirate gunner',hp:26,hit:[7,11],gold:[28,50],xp:55,drops:[['iron_bar',.25,1]],atk:'fires a pistol',look:{skin:2,hair:0,shirt:4,jk:5,hat:'cap',hc:0,pack:false}},
 raid_brute:{n:'Pirate brute',hp:42,hit:[8,12],gold:[50,80],xp:80,drops:[['iron_bar',.5,1]],atk:'swings a boarding axe',look:{skin:3,hair:2,shirt:0,jk:0,hat:'none',hstyle:'bald',pack:false,armour:{body:'leather',boots:'leather'}}},
 // the final fight at the Temple of the Sea (Quest 9): eight pirates, tougher again, then Captain Barron himself, who does not retreat this time and uses his full pattern: two sabre cuts, a wind-up (a Block on the turn after it takes the heavy blow that follows) and a crashing downward blow
 final_raider:{n:'Pirate raider',hp:52,hit:[9,12],gold:[40,70],xp:70,drops:[['rope',.4,1]],atk:'swings a cutlass',look:{skin:1,hair:3,shirt:1,jk:2,hat:'cap',hc:1,pack:false}},
 final_gunner:{n:'Pirate gunner',hp:44,hit:[9,13],gold:[45,75],xp:75,drops:[['iron_bar',.3,1]],atk:'fires a pistol',look:{skin:2,hair:0,shirt:4,jk:5,hat:'cap',hc:0,pack:false}},
 final_brute:{n:'Pirate brute',hp:70,hit:[10,14],gold:[70,110],xp:100,drops:[['iron_bar',.5,1]],atk:'swings a boarding axe',look:{skin:3,hair:2,shirt:0,jk:0,hat:'none',hstyle:'bald',pack:false,armour:{body:'leather',boots:'leather'}}},
 barron:{n:'Captain Barron',hp:320,hit:[11,14],gold:[300,400],xp:400,drops:[],look:{skin:1,hair:4,shirt:0,jk:5,hat:'none',hstyle:'long',pack:false,armour:{helm:'gold',body:'gold',boots:'gold'}},
  pattern:[{atk:'slashes with his sabre',hit:[11,14]},{atk:'slashes with his sabre',hit:[11,14]},{wind:'raises his sabre high above his head...'},{atk:'brings the sabre crashing down',hit:[26,32]}]},
 bandit:{n:'Bandit',hp:30,hit:[5,9],gold:[20,40],xp:60,drops:[['rope',.3,1]],atk:'swings a rusty sword',look:{skin:2,hair:0,shirt:2,jk:6,hat:'scarf',hc:3,pack:false}},   // the bandit camp in the south-west (tavern job)
 bandit_archer:{n:'Bandit archer',hp:24,hit:[6,10],gold:[25,45],xp:70,drops:[],atk:'looses an arrow',look:{skin:0,hair:1,shirt:3,jk:2,hat:'scarf',hc:1,pack:false}},
 bandit_chief:{n:'Bandit chief',hp:70,hit:[8,12],gold:[80,140],xp:160,drops:[['iron_bar',.5,1]],atk:'slashes with a broad blade',look:{skin:3,hair:4,shirt:0,jk:5,hat:'cap',hc:1,pack:false}},
 pirate_captain:{n:'Pirate captain',hp:60,hit:[6,10],gold:[60,100],xp:120,drops:[],atk:'slashes with a heavy sabre',flee:{at:.35,msg:'The captain shouts a curse and escapes!'},look:{skin:1,hair:4,shirt:0,jk:0,hat:'cap',hc:1,hstyle:'long',pack:false}}
};
const BATTLES={
 test_pirate:{foes:['pirate_grunt']},
 test_pirates:{foes:['pirate_grunt','pirate_gunner','pirate_grunt']},
 test_captain:{foes:['pirate_captain'],noRun:1},
 q9_boss:{foes:['barron'],noRun:1,win:[],winScene:'q9_victory'}
};
