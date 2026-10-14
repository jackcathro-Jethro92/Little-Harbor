// ---------- Quest 7: Under Attack (roadmap 5.7) ----------
// The story: as the player leaves the Sky island (the first time they get into the boat there after Quest 6) a seagull brings Bjorn's letter: the village is under attack. From then on the village is in its raid variant
// (flag village_attack, row `village_raid` of VARIANTS): four pirate ships offshore (tile 101 under them blocks boats), burning roofs with smoke and cannon fire (js/render/raid.js), and villagers with new things to say.
// On landing, three waves of pirates come ashore one after the other (encounters q7_w1 to q7_w3, fought one by one: 3, 4 and 5 pirates). A villager hands the player a healing potion between waves. When the last falls the
// pirates flee, shouting that the boss will be finished at the tower (Jack's words). The next morning the village is repaired (village_repaired; the raid variant switches off).
// The spoken lines marked JACK are Jack's own words from STORY_TEXT.md, word for word (also in JACKS_LINES.txt). Everything else is a PLACEHOLDER until he writes his own.
// Switches: q7_started, village_attack, enc_q7_w1_done to enc_q7_w3_done, q7_done, village_repaired.
QUESTS.push({id:'q7',name:'Under Attack',
 steps:['[Placeholder] The village is under attack! Sail home at once.','[Placeholder] Pirates are landing at the pier. Drive them off.','[Placeholder] More pirates are in the middle of the village. Drive them off.','[Placeholder] The last of the raiders are at the top of the village. Drive them off.'],
 goals:[[156,127],[156,122],[156,115],[156,108]]});
LETTERS.q7_letter={from:'Bjorn the Elder',title:'Under attack!',text:"Pirates everywhere! Village under attack! We need all hands on deck for this fight. COME QUICK!"};   // JACK
// ---- the raid variant: four pirate ships on the water round the island ----
const RAID_SHIPS=[[135,106],[179,108],[146,128],[161,127]];
function applyRaid(on){RAID_ON=on;
  BL.filter(b=>b.raid).forEach(b=>{for(let j=0;j<4;j++)for(let i=0;i<3;i++)setT(b.x+i,b.y+j,0)});BL.splice(0,BL.length,...BL.filter(b=>!b.raid));
  if(on)RAID_SHIPS.forEach(([x,y])=>{if([0,1,2,3].every(j=>[0,1,2].every(i=>at(x+i,y+j)===0))){BL.push({x,y,w:3,ship:1,raid:1});rect(x,y,x+2,y+3,(xx,yy)=>setT(xx,yy,101))}});
  if(typeof groundDirty==='function')groundDirty()}
VARIANTS.push({id:'village_raid',flag:'village_attack',apply:on=>applyRaid(on)});applyVariants(true);
// ---- the villagers while it lasts (everyone but the shopkeepers, whose shops stay open) ----
const RAID_SAY=['[Placeholder] Get off our island, you pirates!','[Placeholder] Stay behind me! I will not let them near the children.','[Placeholder] My roof is on fire! Somebody help!','[Placeholder] They came out of nowhere! Look at all those ships!','[Placeholder] Hold the line! The fisher is here!','[Placeholder] I have never seen so many pirates.'];
NPC.filter(n=>n.x>=140&&n.x<=176&&n.y>=99&&n.y<=127&&!n.store&&!n.pirate&&n.n!=='Bjorn the Elder').forEach((n,i)=>STORY_PEOPLE.unshift({npc:n.n,if:{flag:'village_attack'},say:[RAID_SAY[i%RAID_SAY.length]]}));
STORY_PEOPLE.unshift({npc:'Bjorn the Elder',if:{flag:'village_attack'},say:['[Placeholder] Drive them off, fisher! The whole village is counting on you!']});
// ---- three waves of pirates ----
// each wanted spot is moved to the nearest bare ground (grass or path) with bare ground below it, so the player can always stand in front of a pirate and no two stand on the same tile
const RAID_USED=new Set();
const raidSpot=([x,y])=>{const n=nearestTile(x,y,(a,b)=>[1,6].includes(at(a,b))&&[1,6].includes(at(a,b+1))&&!RAID_USED.has(a+','+b)&&!npcAt(a,b))||[x,y];RAID_USED.add(n[0]+','+n[1]);return n};
const raidWave=(id,list)=>({id,mode:'battle',foes:list.map(([foe,x,y])=>({foe,at:raidSpot([x,y])}))});
ENCOUNTERS.push(
 raidWave('q7_w1',[['raid_raider',154,122],['raid_raider',157,122],['raid_raider',155,119]]),
 raidWave('q7_w2',[['raid_raider',152,115],['raid_gunner',159,115],['raid_raider',155,113],['raid_raider',158,117]]),
 raidWave('q7_w3',[['raid_raider',152,109],['raid_gunner',159,109],['raid_brute',155,108],['raid_gunner',150,107],['raid_raider',160,107]]));
DLG.q7_flee={start:'a',nodes:{a:{who:'Pirate grunt',text:"Let’s get out of here! The boss will be finished at the tower! Meet up back at the base and we will finish this!"}}};   // JACK
SCENES.q7_wave1=[{encounter:'q7_w1'},{wait:300},{msg:'Pirates are landing at the pier!'},{step:1}];
SCENES.q7_between1=[{wait:300},{give:{healing_potion:1}},{toast:'A villager gives you a healing potion.'},{msg:'[Placeholder] "Take this! More of them are coming up the road!"'},{encounter:'q7_w2'},{step:2}];
SCENES.q7_between2=[{wait:300},{give:{healing_potion:1}},{toast:'A villager gives you a healing potion.'},{msg:'[Placeholder] "Take this! The last of them are at the top of the village!"'},{encounter:'q7_w3'},{step:3}];
SCENES.q7_flee=[{wait:300},{say:'q7_flee'},{toast:'The pirates fled!'},{set:'q7_done'},{done:'q7'},{msg:'[Placeholder] The boss will be at the Temple Tower! The village can be mended in the morning.'}];
TRIGGERS.push(
 // the first time the player gets into the boat on the Sky island after Quest 6
 {id:'q7_letter',when:{board:[205,95,280,172]},if:{flag:'q6_done',noflag:'q7_started'},do:[{set:'q7_started'},{set:'village_attack'},{quest:['q7',0]},{letter:'q7_letter'}]},
 {id:'q7_landing',when:{walk:[141,99,176,127],n:1},if:{quest:'q7',step:0},do:[{scene:'q7_wave1'}]},
 {id:'q7_w1_beaten',when:{beaten:'q7_w1'},do:[{scene:'q7_between1'}]},
 {id:'q7_w2_beaten',when:{beaten:'q7_w2'},do:[{scene:'q7_between2'}]},
 {id:'q7_w3_beaten',when:{beaten:'q7_w3'},do:[{scene:'q7_flee'}]},
 // the next morning the village is mended
 {id:'q7_repair',when:{day:1},if:{flag:'q7_done',noflag:'village_repaired'},do:[{clear:'village_attack'},{set:'village_repaired'},{toast:'The villagers have mended the village overnight.'}]}
);
