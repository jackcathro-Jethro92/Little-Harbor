// ---------- Quest 6: At the Top of the World (roadmap 5.6) ----------
// The story: the Mysterious Girl's armour (Quest 5) is followed by the Sky temple (Island 3, the hill path from the south-west beach). Halfway up, on the second terrace, an explosion shakes the mountain (the temple has been
// blown up: flag `sky_damaged` turns the plateau into its ruined self, which the player cannot see from the path yet). Just short of the top, seven pirates stand on the path down from the plateau and the big boss, Captain Barron
// (gold armour, taller than anyone), stops the player (encounter q6_pirates, fought one by one). When the last is beaten he is rattled, kicks dirt in the player's eyes (a quick fade to dark) and is gone. A young boy, the Spirit
// of the Sky, is crying at the ruined temple; he gives the Sky Helm and asks for his key back. The spoken lines marked JACK are Jack's own words from STORY_TEXT.md, word for word (also in JACKS_LINES.txt). The rest is placeholder.
// Switches: q6_boom, sky_damaged (the ruined temple, stays until Quest 10), q6_barron_here / q6_barron_gone, enc_q6_pirates_done, q6_boy_here, q6_done. Item: sky_helm (helmet; stops 5% of damage; `haste`: 20% of attacks give another turn).
QUESTS.push({id:'q6',name:'At the Top of the World',
 steps:['[Placeholder] Climb the path up to the Temple to the Sky on Island 3.','[Placeholder] An explosion! Keep climbing.','[Placeholder] Pirates block the path. Fight your way up.','[Placeholder] Someone is crying at the temple at the top. Go and see.'],
 goals:[[222,157],[236,127],[236,124],[236,113]]});
NPC.push({n:'Captain Barron',x:236,y:116,hx:236,hy:116,f:'d',skin:1,hair:4,shirt:0,jk:5,hat:'none',hstyle:'long',pack:false,fixed:1,scale:1.3,armour:{helm:'gold',body:'gold',boots:'gold'},say:['[Placeholder] Out of my way, little dog.'],bio:{age:null,job:'Pirate boss',backstory:null,likes:[],q:null}});
NPC.push({n:'Mysterious Boy',x:236,y:113,hx:236,hy:113,f:'d',skin:0,hair:2,shirt:5,jk:4,hat:'none',hstyle:'short',pack:false,fixed:1,scale:.85,say:['[Placeholder] Please get my key back.'],bio:{age:null,job:'Spirit of the Sky temple',backstory:null,likes:[],q:null}});
STORY_PEOPLE.push(
 {npc:'Captain Barron',if:{flag:'q6_barron_gone'},hide:1},
 {npc:'Captain Barron',if:{flag:'q6_barron_here'},at:[236,116],f:'d'},
 {npc:'Captain Barron',hide:1},
 {npc:'Mysterious Boy',if:{flag:'q6_boy_here'},at:[236,113],f:'d'},
 {npc:'Mysterious Boy',hide:1});
// seven pirates on the dirt path (x 235-237) leading up from the last stairway, the boss behind them
ENCOUNTERS.push({id:'q6_pirates',mode:'battle',foes:[{foe:'sky_grunt',at:[235,124]},{foe:'sky_gunner',at:[236,122]},{foe:'sky_grunt',at:[237,124]},{foe:'sky_gunner',at:[237,120]},{foe:'sky_grunt',at:[235,120]},{foe:'sky_bruiser',at:[235,118]},{foe:'sky_bruiser',at:[237,118]}]});
DLG.q6_barron1={start:'a',nodes:{a:{who:'Captain Barron',text:"Who is this little dog that blocks my way! Prepare yourself for your end!"}}};   // JACK
DLG.q6_barron2={start:'a',nodes:{a:{who:'Captain Barron',text:'[Placeholder] What? All my lads beaten by a fisher? Hmph. We will meet again, little dog!'}}};
DLG.q6_boy1={start:'a',nodes:{a:{who:'Mysterious Boy',text:"Did the old man send you? I tried to stop them. But they blew it up. They have taken my key. Please tell him I'm sorry I couldn't stop them. Here take this. If it's true that the old man said and you are helping us then I want you to have this. Please stop those awful pirates and get my key back."}}};   // JACK
SCENES.q6_boom=[
 {set:'q6_boom'},{shake:1100},{set:'sky_damaged'},{msg:'BOOM! An explosion rumbles down from the top of the mountain!'},{step:1}];
SCENES.q6_ambush=[
 {set:'q6_barron_here'},{encounter:'q6_pirates'},{wait:300},{pan:[236,118,700]},{say:'q6_barron1'},{pan:['back',600]},{step:2}];
SCENES.q6_escape=[
 {wait:300},{pan:[236,118,500]},{say:'q6_barron2'},{msg:'He kicks dirt in your eyes!'},{fade:'out',ms:150},{wait:700},
 {set:'q6_barron_gone'},{set:'q6_boy_here'},{pan:['back',100]},{fade:'in',ms:900},
 {msg:'When you can see again, they are gone. Someone is sobbing up at the temple.'},{step:3}];
TRIGGERS.push(
 {id:'q6_boom',when:{walk:[205,140,250,145],n:1},if:{quest:'q6',step:0,noflag:'q6_boom'},do:[{scene:'q6_boom'}]},
 {id:'q6_ambush',when:{walk:[228,128,246,133],n:1},if:{quest:'q6',step:1,noflag:'q6_barron_here'},do:[{scene:'q6_ambush'}]},
 {id:'q6_beaten',when:{beaten:'q6_pirates'},do:[{scene:'q6_escape'}]},
 {id:'q6_boy',when:{talk:'Mysterious Boy'},if:{quest:'q6',step:3,noflag:'q6_done'},do:[{say:'q6_boy1'},{ensure:{sky_helm:1}},{toast:'You got the Sky Helm!'},{set:'q6_done'},{done:'q6'},{msg:'[Placeholder] The pirates still have the Sky Key. Tell the old man what happened.'}]}
);
