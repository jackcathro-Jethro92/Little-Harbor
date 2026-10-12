// ---------- turn-based fighters and battles (roadmap 3.6, a basic first version) ----------
// FOES.some_id = {n:'Name', hp, hit:[min,max], gold:[min,max], xp, drops:[[item, chance 0-1, count],...], look:{...person look...}, atk:'what it does when it hits', flee:{at:0.3, msg:'text'}}
//   hit    damage of each of its hits (your Ward from jewellery lowers it)      look   the same look fields as townspeople (js/data/pirates.js); the battle draws them as a person
//   flee   (optional) when its health falls to `at` of its maximum it runs away instead of fighting on (the pirate boss in the story)
// BATTLES.some_id = {foes:['foe id', ...], noRun:1, win:[actions], lose:[actions], ran:[actions], escaped:[actions]}
//   Up to three foes. The actions are the same as a trigger's (set a flag, give an item or gold, move a person, change the quest step...) and run when the fight ends that way: win = every foe beaten,
//   lose = you were knocked out (you then wake on your boat as usual), ran = you got away, escaped = the foes that were left ran away. Start one with a trigger action {battle:'id'} (js/systems/triggers.js)
//   or startBattle('id', onEnd). Rows named test_* are for the testing menu (TEST_STORY). Turn-based fighters are pirates, the pirate boss and fighters-guild characters; creatures stay real-time (js/data/enemies.js).
const FOES={
 pirate_grunt:{n:'Pirate grunt',hp:15,hit:[2,4],gold:[10,25],xp:25,drops:[['rope',.3,1]],atk:'swings a cutlass',look:{skin:1,hair:3,shirt:1,jk:2,hat:'cap',hc:1,pack:false}},
 pirate_gunner:{n:'Pirate gunner',hp:12,hit:[3,5],gold:[12,30],xp:30,drops:[['iron_bar',.15,1]],atk:'fires a pistol',look:{skin:2,hair:0,shirt:4,jk:5,hat:'cap',hc:0,pack:false}},
 pirate_captain:{n:'Pirate captain',hp:60,hit:[6,10],gold:[60,100],xp:120,drops:[],atk:'slashes with a heavy sabre',flee:{at:.35,msg:'The captain shouts a curse and escapes!'},look:{skin:1,hair:4,shirt:0,jk:0,hat:'cap',hc:1,hstyle:'long',pack:false}}
};
const BATTLES={
 test_pirate:{foes:['pirate_grunt']},
 test_pirates:{foes:['pirate_grunt','pirate_gunner','pirate_grunt']},
 test_captain:{foes:['pirate_captain'],noRun:1}
};
