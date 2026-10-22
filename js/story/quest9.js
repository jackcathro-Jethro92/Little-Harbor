// ---------- Quest 9: The Final Fight (roadmap 5.9) ----------
// The story: the pirates have gone to the Temple of the Sea to use the keys. A storm breaks over it (flag storm_on, row `storm` of VARIANTS: rain and lightning from js/render/storm.js, and pirate ships moored round the island, tile 101
// under them, blocking boats). Twelve pirates are spread all the way round the island's spiral path, from the beach to the courtyard (encounter q9_guards, fought one by one as each one spots you, tougher than any before). When the last falls, Captain Barron steps out in front of the temple door
// (Jack's words) and a battle starts that cannot be run from. He does not retreat this time: his pattern is two sabre cuts, a wind-up (no damage that turn, so a Block on the next turn softens the blow) and a crashing downward blow.
// If you lose you wake on your boat and the pirates you beat stay beaten; talk to him again to try once more. When he falls (`winScene` of the battle) the sky clears and the pirates flee for good (the ships go, so does the camp on the volcano
// island), his pouch holds all four keys, and the old man (Jack's words) takes the Sea Key to seal it in the vault and sends you to return the others.
// Switches: storm_on, q9_barron_here / q9_barron_gone, enc_q9_guards_done, q9_old_here, sea_key_sealed, pirates_defeated, keys_to_return (the Earth, Sky and Fire keys are in the bag for Quest 10), q9_done.
QUESTS.push({id:'q9',name:'The Final Fight',
 steps:['[Placeholder] A storm is breaking over the Temple of the Sea. The pirates are there. Sail to the island and go ashore.','[Placeholder] Fight your way round the island, along the boardwalk and through the courtyard.','[Placeholder] Captain Barron stands before the temple door. End this.'],
 goals:[[283,44],[283,38],[283,34]]});
// ---- the storm: rain, lightning and the pirate ships round the island ----
const STORM_SHIPS=[[251,26],[251,44],[311,24],[311,44],[268,8],[292,8],[262,57],[298,57]];
function applyStorm(on){STORM_ON=on;
  BL.filter(b=>b.storm).forEach(b=>{for(let j=0;j<4;j++)for(let i=0;i<3;i++)setT(b.x+i,b.y+j,0)});BL.splice(0,BL.length,...BL.filter(b=>!b.storm));
  if(on)STORM_SHIPS.forEach(([x,y])=>{if([0,1,2,3].every(j=>[0,1,2].every(i=>at(x+i,y+j)===0))){BL.push({x,y,w:3,ship:1,storm:1});rect(x,y,x+2,y+3,(xx,yy)=>setT(xx,yy,101))}});
  if(typeof groundDirty==='function')groundDirty()}
VARIANTS.push({id:'storm',flag:'storm_on',apply:on=>applyStorm(on)});applyVariants(true);
// ---- where Captain Barron and the old man stand ----
STORY_PEOPLE.unshift(
 {npc:'Old Stranger',if:{flag:'q9_old_here'},at:[283,33],f:'d',say:['[Placeholder] The Sea Key is safe in the vault now.']},
 {npc:'Captain Barron',if:{flag:'q9_barron_gone'},hide:1},
 {npc:'Captain Barron',if:{flag:'q9_barron_here'},at:[283,33],f:'d',say:['[Placeholder] Come on, little dog!']});
// ---- twelve pirates all the way round the island's spiral walking path (playtest #4) ----
// The way up winds round the island: the beach, a stairway in the west to terrace 1, one in the north to terrace 2, one in the east to the rim, then round the rim to the crater gate in the south, the boardwalk
// (x 282-284, y 38-43) and the courtyard (x 279-287, y 32-37). Each pirate stands on the ring it guards at a compass angle round the island's centre (283,36; 0 = east, 90 = south, as the island was built in js/world/seaisland.js),
// moved to the nearest open ground; they see you as you come (js/systems/encounters.js), so the whole climb is a string of fights.
const SEA_USED=new Set();
const seaSpot=(deg,r)=>{const a=deg*Math.PI/180,x=Math.round(283+r*24*Math.cos(a)),y=Math.round(36+r*19*Math.sin(a));
  const n=nearestTile(x,y,(i,j)=>[1,2,48].includes(at(i,j))&&!SEA_USED.has(i+','+j));if(n)SEA_USED.add(n[0]+','+n[1]);return n};
const SEA_GUARDS=[['final_raider',130,.92],['final_raider',165,.92],['final_raider',205,.75],['final_gunner',240,.75],['final_raider',295,.58],['final_gunner',330,.58],['final_gunner',25,.42],['final_brute',65,.42]]
  .map(([foe,deg,r])=>({foe,at:seaSpot(deg,r)})).filter(f=>f.at);
ENCOUNTERS.push({id:'q9_guards',mode:'battle',foes:[...SEA_GUARDS,{foe:'final_gunner',at:[283,40]},{foe:'final_raider',at:[280,36]},{foe:'final_brute',at:[286,36]},{foe:'final_brute',at:[283,35]}]});
DLG.q9_barron1={start:'a',nodes:{a:{who:'Captain Barron',text:"You! The dog! Every step my warriors have been talking about some little beast that won't stop hounding us. Well this is it for you. We won't be having a third battle. Prepare yourself this time you will die. Let's go!"}}};   // JACK
DLG.q9_barron2={start:'a',nodes:{a:{who:'Captain Barron',text:"I was wrong! You're greater than I… I don't know how this is possible.. Unless… Of course. I was a fool, you are the fifth aren't you. I should have read the legends more closely. It seems so obvious now. Let my lads go will you. I give you my word that we won't come back."}}};   // JACK
DLG.q9_old={start:'a',nodes:{a:{who:'Old Stranger',text:"I knew our faith was well placed. Give me the water Key and I will seal this in the vault. Take the others to our brother and sisters at the other temples. I can't express my gratitude. You have done well and have earned your place among us. I'm sure I'll be seeing you again some time soon. Thank you."}}};   // JACK
SCENES.q9_land=[{encounter:'q9_guards'},{wait:300},{msg:'Pirates hold the boardwalk and the courtyard! Fight your way to the temple.'},{step:1}];
SCENES.q9_taunt=[{set:'q9_barron_here'},{wait:300},{pan:[283,33,700]},{say:'q9_barron1'},{pan:['back',600]},{step:2}];
SCENES.q9_victory=[
 {wait:300},{pan:[283,33,500]},{say:'q9_barron2'},{msg:'Captain Barron slumps to the ground. The pouch at his belt holds four golden keys!'},{give:{earth_key:1,sky_key:1,fire_key:1,sea_key:1}},{toast:'You got the four keys!'},
 {set:'q9_barron_gone'},{clear:'storm_on'},{set:'pirates_defeated'},{clear:'pirates_here'},{toast:'The sky clears and the pirates flee!'},{pan:['back',500]},{wait:700},
 {fade:'out',ms:300},{set:'q9_old_here'},{fade:'in',ms:700},{say:'q9_old'},{take:{sea_key:1}},{set:'sea_key_sealed'},{toast:'The old man seals the Sea Key in the vault.'},
 {fade:'out',ms:400},{clear:'q9_old_here'},{fade:'in',ms:700},
 {set:'keys_to_return'},{set:'q9_done'},{done:'q9'},{quest:['q10',0]},{msg:'[Placeholder] Take the Earth, Sky and Fire keys back to the spirits of their temples. The Fire temple is last.'}];
TRIGGERS.push(
 {id:'q9_land',when:{walk:[254,12,312,60],n:1},if:{quest:'q9',step:0},do:[{scene:'q9_land'}]},
 {id:'q9_guards_beaten',when:{beaten:'q9_guards'},do:[{scene:'q9_taunt'},{battle:'q9_boss'}]},
 {id:'q9_boss_again',when:{talk:'Captain Barron'},if:{quest:'q9',step:2},do:[{battle:'q9_boss'}],repeat:1}
);
