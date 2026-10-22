// ---------- Quest 6: At the Top of the World (roadmap 5.6) ----------
// The story: the Mysterious Girl's armour (Quest 5) is followed by the Sky temple (Island 3, the hill path from the south-west beach). Seven pirates stand scattered all the way up the zigzag path, from the first terrace
// to the last stairway (encounter q6_pirates; they appear when you first set foot on the beach, far up the hill, and each one hops, shouts and comes for you as soon as it sees you, so none can be walked past). Halfway
// up, on the second terrace, an explosion shakes the mountain (flag `sky_damaged` turns the plateau into its ruined self, which the player cannot see from the path yet). When the last pirate is beaten and the player reaches
// the top of the path, the big boss, Captain Barron (gold armour, taller than anyone), comes walking down the path from the plateau to meet them (playtest #4); he is rattled, kicks dirt in the player's eyes (a quick fade
// to dark) and is gone. A young boy, the Spirit of the Sky, is crying at the ruined temple; he gives the Sky Helm and asks for his key back. The spoken lines marked JACK are Jack's own words from STORY_TEXT.md, word for word
// (also in JACKS_LINES.txt). The rest is placeholder.
// Switches: q6_boom, sky_damaged (the ruined temple, stays until Quest 10), q6_barron_here / q6_barron_gone, enc_q6_pirates_on / enc_q6_pirates_done, q6_boy_here, q6_done. Item: sky_helm (helmet; stops 5% of damage; `haste`: 20% of attacks give another turn).
QUESTS.push({id:'q6',name:'At the Top of the World',
 steps:['[Placeholder] Climb the path up to the Temple to the Sky on Island 3.','[Placeholder] An explosion! Keep climbing.','[Placeholder] Pirates are all along the path. Fight your way up. The pirate boss will come for you at the top.','[Placeholder] Someone is crying at the temple at the top. Go and see.'],
 goals:[[222,157],[236,127],[236,124],[236,113]]});
NPC.push({n:'Captain Barron',x:236,y:116,hx:236,hy:116,f:'d',skin:1,hair:4,shirt:0,jk:5,hat:'none',hstyle:'long',pack:false,fixed:1,scale:1.3,armour:{helm:'gold',body:'gold',boots:'gold'},say:['[Placeholder] Out of my way, little dog.'],bio:{age:null,job:'Pirate boss',backstory:null,likes:[],q:null}});
NPC.push({n:'Mysterious Boy',x:236,y:113,hx:236,hy:113,f:'d',skin:0,hair:2,shirt:5,jk:4,hat:'none',hstyle:'short',pack:false,fixed:1,scale:.85,say:['[Placeholder] Please get my key back.'],bio:{age:null,job:'Spirit of the Sky temple',backstory:null,likes:[],q:null}});
STORY_PEOPLE.push(
 {npc:'Captain Barron',if:{flag:'q6_barron_gone'},hide:1},
 {npc:'Captain Barron',if:{flag:'q6_barron_here'},at:[236,116],f:'d'},
 {npc:'Captain Barron',hide:1},
 {npc:'Mysterious Boy',if:{flag:'q6_boy_here'},at:[236,113],f:'d'},
 {npc:'Mysterious Boy',hide:1});
// seven pirates scattered up the dirt path (the route runs along y 148, 142, 136 and 130 and up x 236; the strip is three tiles wide), two on each of the three lower terraces and the last on the final climb
ENCOUNTERS.push({id:'q6_pirates',mode:'battle',foes:[{foe:'sky_grunt',at:[228,148]},{foe:'sky_gunner',at:[236,148]},{foe:'sky_grunt',at:[236,142]},{foe:'sky_gunner',at:[228,142]},{foe:'sky_grunt',at:[228,136]},{foe:'sky_bruiser',at:[236,136]},{foe:'sky_bruiser',at:[237,130]}]});
DLG.q6_barron1={start:'a',nodes:{a:{who:'Captain Barron',text:"Who is this little dog that blocks my way! Prepare yourself for your end!"}}};   // JACK
DLG.q6_barron2={start:'a',nodes:{a:{who:'Captain Barron',text:'[Placeholder] What? All my lads beaten by a fisher? Hmph. We will meet again, little dog!'}}};   // (he arrives after the last pirate has fallen)
DLG.q6_boy1={start:'a',nodes:{a:{who:'Mysterious Boy',text:"Did the old man send you? I tried to stop them. But they blew it up. They have taken my key. Please tell him I'm sorry I couldn't stop them. Here take this. If it's true that the old man said and you are helping us then I want you to have this. Please stop those awful pirates and get my key back."}}};   // JACK
SCENES.q6_boom=[
 {set:'q6_boom'},{shake:1100},{set:'sky_damaged'},{msg:'BOOM! An explosion rumbles down from the top of the mountain!'},{step:1}];
// the boss walks down the path from the plateau to stand in front of the player (SCSTEP.q6walk finds the way), speaks, is rattled and goes
SCSTEP.q6walk=(_,c)=>{const n=NPC.find(q=>q.n==='Captain Barron');if(!n)return c.go();const path=encPath(n,40);
  if(path)return SCSTEP.trek([n,path,170],c);const s=nearestTile(P.x,P.y-1,(a,b)=>WK.includes(at(a,b))&&!npcAt(a,b)&&!(P.x===a&&P.y===b));if(s){n.x=s[0];n.y=s[1]}n.f=faceToward(n,[P.x,P.y]);c.go()};
SCENES.q6_barron=[
 {step:2},{wait:300},{set:'q6_barron_here'},{pan:[236,116,700]},{wait:500},{pan:['back',700]},{q6walk:1},{wait:200},{say:'q6_barron1'},{say:'q6_barron2'},{msg:'He kicks dirt in your eyes!'},{fade:'out',ms:150},{wait:700},
 {set:'q6_barron_gone'},{set:'q6_boy_here'},{pan:['back',100]},{fade:'in',ms:900},
 {msg:'When you can see again, he is gone. Someone is sobbing up at the temple.'},{step:3}];
TRIGGERS.push(
 {id:'q6_boom',when:{walk:[205,140,250,145],n:1},if:{quest:'q6',step:0,noflag:'q6_boom'},do:[{scene:'q6_boom'}]},
 {id:'q6_pirates_start',when:{walk:[216,150,232,163],n:1},if:{quest:'q6',noflag:'enc_q6_pirates_on'},do:[{encounter:'q6_pirates'}]},
 {id:'q6_barron',when:{walk:[228,124,246,133],n:1},if:{quest:'q6',step:1,flag:'enc_q6_pirates_done',noflag:'q6_barron_here'},do:[{scene:'q6_barron'}]},
 {id:'q6_boy',when:{talk:'Mysterious Boy'},if:{quest:'q6',step:3,noflag:'q6_done'},do:[{say:'q6_boy1'},{ensure:{sky_helm:1}},{toast:'You got the Sky Helm!'},{set:'q6_done'},{done:'q6'},{msg:'[Placeholder] The pirates still have the Sky Key. Tell the old man what happened.'}]}
);
