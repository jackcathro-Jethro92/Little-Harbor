// ---------- weapon attacks for the turn-based battle (Jack's playtest note P7) ----------
// ATTACKS.some_id = {n:'Name', power, cost, xp, stun}
//   power  the hit is the weapon's damage x this (light 0.6, normal 1, heavy 1.6), then the weapon skill's bonus (+8% per level of that weapon's skill) and a little luck
//   cost   stamina spent (light 2, normal 4, heavy 8 out of 100): every attack costs stamina, and an attack you cannot afford is greyed out
//   xp     weapon skill xp gained by using it (heavier attacks teach more)       stun   (optional) the chance, from 0 to 1, that the foe loses its next turn
// WEAPON_MOVES.weapon_type = [[attack id, weapon skill level needed], ...]. The weapon types are the `wtype` of an item (sword by default; the wooden sword and bare hands are 'starter', which has no skill).
//   sword: Slash, Lunge (level 2), Quick Strike (level 3), Power Slash (level 6)     axe: Chop, Bash (level 3), Cleave (level 6)     starter (bare hands, wooden sword): Strike and Bash from the start
// The weapon skills are the skills `sword` and `axe` (js/data/skills.js); they rise as the weapon's attacks are used. Power depends on the weapon skill only, not on the Combat skill.
// Block (in js/systems/battle.js) is not an attack: it takes much less damage that turn and gives stamina back.
const ATTACKS={
 strike:{n:'Strike',power:1,cost:4,xp:0},
 bash:{n:'Bash',power:1,cost:4,xp:10,stun:.15},
 slash:{n:'Slash',power:1,cost:4,xp:10},
 lunge:{n:'Lunge',power:1.1,cost:5,xp:12},   // learned at Sword skill 2: 10% more damage than Slash for a little more stamina (Jack's playtest #3 note)
 quick:{n:'Quick Strike',power:.6,cost:2,xp:6},
 power_slash:{n:'Power Slash',power:1.6,cost:8,xp:16},
 chop:{n:'Chop',power:1,cost:4,xp:10},
 cleave:{n:'Cleave',power:1.6,cost:8,xp:16},
 divine_strike:{n:'Divine Strike',power:2.2,cost:10,xp:20,stun:.25,pierce:1}   // the Divine Blade's own attack (Quest 8): a heavy blow that cannot be blocked and sometimes stuns. An item lists its own extra attacks in `moves`
};
const WEAPON_MOVES={
 starter:[['strike',0],['bash',0]],
 sword:[['slash',0],['lunge',2],['quick',3],['power_slash',6]],
 axe:[['chop',0],['bash',3],['cleave',6]]
};
const BLOCK_STAMINA=10,BLOCK_TAKES=.35;   // Block gives this much stamina back and takes this share of the damage
const weaponType=()=>{const w=eq('weapon');return w?(w.wtype||'sword'):'starter'};
const weaponSkillLevel=()=>{const t=weaponType();return t==='starter'?0:lvl(t)};
const knownAttacks=()=>[...WEAPON_MOVES[weaponType()].filter(([,req])=>weaponSkillLevel()>=req).map(([id])=>id),...((eq('weapon')||{}).moves||[])];
const weaponPerk=(t,l)=>'+'+8*l+'% damage with the '+t+'. Attacks: '+WEAPON_MOVES[t].map(([id,req])=>ATTACKS[id].n+(req?' (level '+req+')':'')).join(', ')+'.';
