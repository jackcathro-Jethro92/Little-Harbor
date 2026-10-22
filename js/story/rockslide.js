// ---------- The rockslide (playtest #3): the way out of the Darkwood's north gate is buried; a miner is slowly digging at it ----------
// Six boulders (a `GATES` row) close the little space outside the north gate (x 29-34, y 108), and the thick trees round it do the rest, so nobody can walk round. Facing a rock with a pickaxe equipped and pressing Use
// breaks that one rock for good (flags `rock_1` to `rock_6`, saved); when all six are gone `rockslide_cleared` is set. Miner Dell stands on the far side swinging a pickaxe at the rocks without ever clearing them (`work:'pick'`, drawn by `pickSwing`), and thanks the player
// when they are gone (Jack's words) and pays 150 gold. A save made north of the rocks (someone who already walked up to the Mountain Town) gets the flag at once, so nobody is shut out of the mountains.
// Switches: rockslide_cleared. Test jump rows from Quest 4 on set it too.
M[108*MW+28]=41;   // the one chopping tree beside the gap becomes a thick tree, so it cannot be cut down to walk round the rocks
GATES.push({id:'mtn_rockslide',flag:'rockslide_cleared',cells:[[29,108],[30,108],[31,108],[32,108],[33,108],[34,108]],cf:['rock_1','rock_2','rock_3','rock_4','rock_5','rock_6'],closed:141,fire:1,
 msg:'A rockslide has buried the road north. You would need a pickaxe to break through.',needs:{eq:'pickaxe'},part:'You smash a rock apart. {n} left.',opens:'You smash the last rock! The road is clear.'});   // each swing breaks one rock (playtest #4)
NPC.push({n:'Miner Dell',x:32,y:107,hx:32,hy:107,f:'d',skin:1,hair:2,shirt:3,jk:5,hat:'cap',hc:2,hstyle:'short',pack:false,fixed:1,work:'pick',workOff:'rockslide_cleared',
 say:['[Placeholder] This slide came down in the night. I will be at it all week.','[Placeholder] Got a pickaxe? Give those rocks a good whack!'],bio:{age:null,job:'Miner',backstory:null,likes:[],q:null}});
STORY_PEOPLE.push({npc:'Miner Dell',if:{flag:'rockslide_cleared'},say:['[Placeholder] The road is open again. Mind the loose stones.']});
DLG.rockslide_thanks={start:'a',nodes:{a:{who:'Miner Dell',text:'Thanks! This rock slide was going to take all day to clear',next:'b'},b:{who:'Miner Dell',text:'[Placeholder] Here, take this for your trouble.'}}};   // JACK (a); b is the reward line
TRIGGERS.push({id:'rockslide_thanks',if:{flag:'rockslide_cleared'},do:[{say:'rockslide_thanks'},{gold:150},{toast:'Dell paid you 150 gold'}]});
if(zoneOf(P.x,P.y)===0&&P.x<100&&P.y>=20&&P.y<=107&&!flag('rockslide_cleared'))setFlag('rockslide_cleared');   // an old save already north of the rocks
applyGates();
