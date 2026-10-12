// ---------- Quest 4: A Stranger's Letter, Part 2 (roadmap 5.4) ----------
// The story: after Quest 3, the first time the player is on foot on the mainland a seagull brings a second letter from the old stranger: the pirates are going for the Earth temple (the Temple to the Mountains,
// plaza (0-14, 25-31), stairs (5-7, 16-24), sanctum = zone 5). Pirates hold the plaza (encounter q4_gate, fought one by one); inside the sanctum two grunts are searching for a key (encounter q4_grunts); when they
// are beaten a mysterious young girl (the Earth spirit) appears and gives the Earth Key. The key must go to the Temple Tower: in the shrine room (zone 10) the old stranger waits, keeps the key and gives the enchanted boots.
// The spoken lines marked JACK are Jack's own words from STORY_TEXT.md, word for word (also in JACKS_LINES.txt). Everything else is a PLACEHOLDER until he writes his own.
// Switches: q4_started, q4_gate_started (+ enc_q4_gate_done), q4_sanctum_seen (+ enc_q4_grunts_done), q4_girl_here, q4_key_got, q4_old_man (the old man stands in the tower), earth_key_at_tower, q4_done. Item: earth_key (a key item).
QUESTS.push({id:'q4',name:'A Stranger\u2019s Letter, Part 2',
 steps:['[Placeholder] The stranger says the pirates are moving on the Earth temple. Hurry to the Temple to the Mountains in the north.','[Placeholder] Pirates hold the temple plaza. Defeat them.','[Placeholder] Go inside the temple.','[Placeholder] Take the Earth Key to the Temple Tower.'],
 goals:[[7,40],[7,29],[6,14],[212,196]]});
LETTERS.q4_letter={from:'A stranger',title:'The pirates are moving',text:"Iv just received word that the pirates are moving to the earth temple. Iv sent for help but you are closest at hand. If you hurry you can hopefully head them off. I think I have discovered there plans and they are dire indeed. You must stop them."};   // JACK
NPC.push({n:'Mysterious Girl',x:257,y:SZ.y0+6,hx:257,hy:SZ.y0+6,f:'d',skin:0,hair:0,shirt:3,jk:3,hat:'none',hstyle:'long',pack:false,fixed:1,say:['[Placeholder] The keys are safe with the old man now.'],bio:{age:null,job:'Spirit of the Earth temple',backstory:null,likes:[],q:null}});
STORY_PEOPLE.push(
 {npc:'Mysterious Girl',if:{flag:'q4_girl_here'},at:[257,SZ.y0+6],f:'d'},
 {npc:'Mysterious Girl',hide:1});
// the old man's tower row goes first: Quest 1's rows (further up the table) hide him once he has left the Sea temple
STORY_PEOPLE.unshift({npc:'Old Stranger',if:{flag:'q4_old_man'},at:[163,TS.y0+6],f:'l',say:['[Placeholder] The keys are safe with me. Go carefully.']});
ENCOUNTERS.push(
 {id:'q4_gate',mode:'battle',foes:[{foe:'pirate_grunt',at:[10,31]},{foe:'pirate_grunt',at:[8,29]},{foe:'pirate_gunner',at:[6,26]}]},   // three pirates on the path up to the stairs
 {id:'q4_grunts',mode:'battle',foes:[{foe:'pirate_grunt',at:[255,SZ.y0+8]},{foe:'pirate_grunt',at:[259,SZ.y0+8]}]});   // two grunts hunting for the key in the sanctum
DLG.q4_grunt1={start:'a',nodes:{a:{who:'Pirate grunt',text:"You sure the boss is right? I can’t see no key?"}}};   // JACK
DLG.q4_grunt2={start:'a',nodes:{a:{who:'Pirate grunt 2',text:"Just quit your jabbering and keep looking!"}}};   // JACK
DLG.q4_dynamite={start:'a',nodes:{a:{who:'Pirate grunt 2',text:"Fine, I guess it’s dynamite then, isn’t it!"}}};   // JACK
DLG.q4_girl1={start:'a',nodes:{a:{who:'Mysterious Girl',text:"Congatrualations and thanks you."}}};   // JACK
DLG.q4_girl2={start:'a',nodes:{a:{who:'Mysterious Girl',text:"it unlocks the chamber, along with the other keys from the Air, Water, Earth and Fire temples. It sounds like the pirates already have the Fire key, which means they will probably try to get the others. They have to be stopped. Collect all four keys and take them to our friend at the temple tower, where they will be safe."}}};   // JACK
DLG.q4_old1={start:'a',nodes:{a:{who:'Old Stranger',text:"Oh Good work! I will keep this safe with the water temple key. I presume you might want to know what's going on here. Well I figured out that the pirate plans to use the keys to raise the seas. They want to drown the world. This is an ancient power. Each temple represents both life and destruction. Each Key opens its opposite. See that if why they attacked the water temple first. But we stopped them just in time. I think they have figured this out though and will no doubt be heading back to the water temple and finish what they started"}}};   // JACK (the first paragraph)
DLG.q4_old2={start:'a',nodes:{a:{who:'Old Stranger',text:"By collecting all four keys and inserting all four keys into the water temple they would flood this world and rule the ocean as kings. We cant let this happen and i dont think it is by accident that we have met. You, I believe, can stop these pirates and save your home. Take these boots. They will make you swift on your feet. Go back to the sea temple and see if you can get the key from the chamber inside. Then bring it back to me and here I will keep them safe."}}};   // JACK (the second paragraph)
SCENES.q4_overhear=[
 {set:'q4_sanctum_seen'},{encounter:'q4_grunts'},{wait:300},{say:'q4_grunt1'},{say:'q4_grunt2'}];
SCENES.q4_aftermath=[
 {wait:300},{say:'q4_dynamite'},{toast:'The pirates ran off!'},
 {fade:'out',ms:300},{set:'q4_girl_here'},{fade:'in',ms:700},
 {say:'q4_girl1'},{give:{earth_key:1}},{set:'q4_key_got'},{toast:'You got the Earth Key!'},{wait:400},
 {say:'q4_girl2'},
 {fade:'out',ms:400},{clear:'q4_girl_here'},{fade:'in',ms:600},
 {msg:'Take the Earth Key to the Temple Tower. The compass will show the way.'}];
SCENES.q4_tower=[
 {set:'q4_old_man'},{wait:400},{say:'q4_old1'},{take:{earth_key:1}},{set:'earth_key_at_tower'},{toast:'The old man keeps the Earth Key safe.'},{say:'q4_old2'},
 {ensure:{enchanted_boots:1}},{toast:'You got the enchanted boots!'},{set:'q4_done'},{done:'q4'},{quest:['q5',0]},
 {msg:'The old man asks you to go back to the Sea temple for the key in its chamber.'}];
TRIGGERS.push(
 // the next time the player is on foot on the mainland (the south, the pier, or the mountain country in the north)
 {id:'q4_letter_s',when:{walk:[20,150,125,238],n:1},if:{flag:'q3_done',noflag:'q4_started'},do:[{set:'q4_started'},{quest:['q4',0]},{letter:'q4_letter'}]},
 {id:'q4_letter_p',when:{walk:[128,210,162,225],n:1},if:{flag:'q3_done',noflag:'q4_started'},do:[{set:'q4_started'},{quest:['q4',0]},{letter:'q4_letter'}]},
 {id:'q4_letter_n',when:{walk:[0,0,52,100],n:1},if:{flag:'q3_done',noflag:'q4_started'},do:[{set:'q4_started'},{quest:['q4',0]},{letter:'q4_letter'}]},
 // the pirates are standing at their posts on the temple path from the moment the player first comes near
 {id:'q4_gate',when:{walk:[0,30,30,46],n:1},if:{quest:'q4',step:0,noflag:'q4_gate_started'},do:[{set:'q4_gate_started'},{encounter:'q4_gate'},{step:1}]},
 {id:'q4_gate_beaten',when:{beaten:'q4_gate'},do:[{step:2}]},
 {id:'q4_sanctum',when:{zone:5},if:{quest:'q4',step:2,noflag:'q4_sanctum_seen'},do:[{scene:'q4_overhear'}]},
 {id:'q4_grunts_beaten',when:{beaten:'q4_grunts'},do:[{step:3},{scene:'q4_aftermath'}]},
 {id:'q4_tower',when:{zone:10},if:{quest:'q4',step:3,has:{earth_key:1},noflag:'q4_done'},do:[{scene:'q4_tower'}]}
);
