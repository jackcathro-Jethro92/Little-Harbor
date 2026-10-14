// ---------- Quest 8: Into the Depths (roadmap 5.8) ----------
// The story: the pirate boss said he would finish things at the Temple Tower, and he has been there: the courtyard smokes, the shrine room is ransacked (the keys are gone from the stands, which lie toppled) and a hatch has opened in
// the shrine room floor (the `tower_raided` and `q8_hatch` variants). A seagull brings the old man's note ("Meet us in the chamber"). The hatch leads down a stair into the Depths (zone 20, js/world/depths.js): a long, dark, slightly
// maze-like hall guarded by five wailing ghosts and four zombies (real-time creatures that start battles like the Darkwood's centipedes; they are back every morning). A door at the far end opens into the chamber (zone 21), where the old man
// (the spirit of the sea), the young boy (air) and the young girl (earth) wait. His speech is Jack's, word for word, in three parts; he gives the **Divine Blade** (damage 18, and its own attack Divine Strike) and sends the player to the Fire temple.
// Switches: tower_raided (set when Quest 7 ends), q8_hatch, q8_done, final_battle_open (for Quest 9). Item: divine_blade. The spoken lines marked JACK are Jack's own words from STORY_TEXT.md (also in JACKS_LINES.txt).
QUESTS.push({id:'q8',name:'Into the Depths',
 steps:['[Placeholder] The boss said he would finish things at the Temple Tower. Hurry there and go inside.','[Placeholder] A hatch has opened in the shrine room floor. The old man wants you to come down.','[Placeholder] Find your way through the dark halls to the chamber at the far end.','[Placeholder] The spirits are waiting in the chamber.'],
 goals:[[212,206]]});
LETTERS.q8_letter={from:'The old man',title:'Meet us in the chamber',text:"Meet us in the chamber"};   // JACK
// the ransacked shrine room and the open hatch (tile swaps, js/world/variants.js)
VARIANTS.push({id:'tower_raided',flag:'tower_raided',tiles:[TS.dx-4,TS.dx-2,TS.dx+2,TS.dx+4].map(x=>[x,TS.y1-2,152])},{id:'tower_hatch',flag:'q8_hatch',tiles:[[TS.dx,TS.y0+5,144]]});applyVariants(true);
// where everyone stands: the old man, the boy and the girl wait in the chamber once the hatch is open; while the tower is ransacked nobody is in the shrine room
STORY_PEOPLE.unshift(
 {npc:'Old Stranger',if:{flag:'q8_hatch'},at:[CZ.dx,CZ.y0+4],f:'d',say:['[Placeholder] Go to the Fire temple. We believe in you.']},
 {npc:'Mysterious Boy',if:{flag:'q8_hatch'},at:[CZ.dx-3,CZ.y0+4],f:'d',say:['[Placeholder] You can do it. I know you can.']},
 {npc:'Mysterious Girl',if:{flag:'q8_hatch'},at:[CZ.dx+3,CZ.y0+4],f:'d',say:['[Placeholder] We will be here when you come back.']},
 {npc:'Old Stranger',if:{flag:'tower_raided'},hide:1},
 {npc:'Mysterious Girl',if:{flag:'tower_raided'},hide:1});
// the creatures of the Depths (DEPTH_SPOTS in js/world/depths.js)
DEPTH_SPOTS.forEach(s=>spawnEnemy(s.t,s.x,s.y));
DLG.q8_old1={start:'a',nodes:{a:{who:'Old Stranger',text:"I knew you would make it here. Those pirates might be strong but there is much they dont understand. But we need to tell you who we so you understand. We have not told you who we are. Because we are not people as you know. I am the spirit of the sea. And my brother and sister here are the spirits of the Earth and the Air. our sister of fire is still trying her best to protect the fire temple. But I fear she won't hold much longer against the forces trying to destroy this world. Unfortunately we underestimated those forces and they have taken out keys. We have only one path left. To ask you to help us to save this world."}}};   // JACK
DLG.q8_old2={start:'a',nodes:{a:{who:'Old Stranger',text:"We didn't choose you by accident. We have been watching you since the night of your birth. But I always hoped I was wrong about you and you would simply live a life in peace. I was not wrong though. I have known for a long time that you are here to save this land. Not just a human but the spirit of Void. The fifth element is little understood but I knew you were representative the day you were born. Your mother Knew this so we have watched over you for all these years. Now the time has come that your destiny will unfold. Go to the fire temple. Save our sister… your sister. And us. Your brothers and sisters…"}}};   // JACK
DLG.q8_old3={start:'a',nodes:{a:{who:'Old Stranger',text:"Take this. This sword will aid you and help you to take your place as our defender and the defender of the world. Go now. You know what to do. We know you will not fail."}}};   // JACK
SCENES.q8_found=[{wait:200},{msg:'The shrine room is a wreck! The stands are toppled and every key is gone.'},{wait:600}];
SCENES.q8_meeting=[
 {wait:300},{msg:'[Placeholder] The old man, the boy and the girl are waiting for you.'},{wait:500},
 {say:'q8_old1'},{say:'q8_old2'},{give:{divine_blade:1}},{equip:'divine_blade'},{toast:'You got the Divine Blade!'},{wait:300},{say:'q8_old3'},
 {set:'q8_done'},{set:'final_battle_open'},{done:'q8'},
 {msg:'[Placeholder] The Divine Blade is in your hand. Go to the Fire temple and save the fire spirit. Its attack, Divine Strike, is in the Attack list.'}];
TRIGGERS.push(
 {id:'q8_found',when:{zone:10},if:{quest:'q8',step:0},do:[{scene:'q8_found'},{letter:'q8_letter'},{set:'q8_hatch'},{step:1},{msg:'A hatch has opened in the shrine room floor. Face it and tap Use to go down.'}]},
 {id:'q8_depths',when:{zone:20},if:{quest:'q8',step:1},do:[{step:2},{msg:'Dark halls. Something moans in the dark... Find the door at the far end.'}]},
 {id:'q8_chamber',when:{zone:21},if:{quest:'q8',step:2},do:[{step:3},{scene:'q8_meeting'}]}
);
