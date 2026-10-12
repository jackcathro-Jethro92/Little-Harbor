// ---------- Quest 5: Saviour of the Seas (roadmap 5.5) ----------
// The story: the old man at the Temple Tower sent the player back to the Temple of the Sea (Island 5). The pirates have already gone through the hall and down the stairs into the vault (zone 7) and
// taken the Sea Key; they have used dynamite on the chamber. The player beats them (encounter q5_pirates, one by one: one stands on the stepping stones, two on the platform), takes the key back and the rest
// run off. Returning the key to the Temple Tower, the Mysterious Girl (the Earth spirit) walks in and gives enchanted armour. Both keys then rest on the Tower's stands (js/render/temples.js).
// The one spoken line marked JACK is Jack's own words from STORY_TEXT.md, word for word (also in JACKS_LINES.txt). Everything else is a PLACEHOLDER until he writes his own.
// Switches: q5_hall (the player went into the hall), q5_vault_blasted (the vault shows the dynamite damage), enc_q5_pirates_done, q5_key_got, q5_girl_here, sea_key_at_tower, q5_done. Item: sea_key (a key item).
QUESTS.push({id:'q5',name:'Saviour of the Seas',
 steps:['[Placeholder] The old man wants you to fetch the Sea Key from its chamber. Go to the Temple of the Sea.','[Placeholder] The pirates went down to the vault under the temple. Follow them.','[Placeholder] Defeat the pirates in the vault and take the Sea Key back.','[Placeholder] Take the Sea Key to the Temple Tower.'],
 goals:[[283,40],[283,32],[283,32],[212,196]]});
VARIANTS.push({id:'sea_vault',flag:'q5_vault_blasted',tiles:[[217,VZ.y0+4,73],[218,VZ.y0+4,73]]});applyVariants(true);   // the pedestal is blown apart and buried under fallen rock
STORY_PEOPLE.unshift({npc:'Mysterious Girl',if:{flag:'q5_girl_here'},at:[158,TS.y0+8],f:'r',say:['[Placeholder] Both keys are safe here. The Tower will keep them.']});
ENCOUNTERS.push({id:'q5_pirates',mode:'battle',foes:[{foe:'pirate_grunt',at:[217,VZ.y0+8]},{foe:'pirate_grunt',at:[216,VZ.y0+5]},{foe:'pirate_gunner',at:[219,VZ.y0+5]}]});
DLG.q5_pirate={start:'a',nodes:{a:{who:'Pirate grunt',text:'[Placeholder] Run! The captain will hear of this! Leave the rest, we have what we came for!'}}};
DLG.q5_girl={start:'a',nodes:{a:{who:'Mysterious Girl',text:"I'm glad I caught you. I've brought you something to help in your quest! Take this with you."}}};   // JACK
SCENES.q5_vault=[
 {set:'q5_vault_blasted'},{encounter:'q5_pirates'},{wait:300},{msg:'The vault is a ruin! The pedestal is buried under fallen rock. The pirates must have used dynamite.'}];
SCENES.q5_aftermath=[
 {wait:300},{say:'q5_pirate'},{toast:'The pirates fled!'},{wait:300},
 {give:{sea_key:1}},{set:'q5_key_got'},{toast:'You got the Sea Key back!'},
 {msg:'Take the Sea Key to the Temple Tower. The compass will show the way.'}];
SCENES.q5_tower=[
 {wait:300},{fade:'out',ms:300},{set:'q5_girl_here'},{fade:'in',ms:700},{say:'q5_girl'},
 {take:{sea_key:1}},{set:'sea_key_at_tower'},{toast:'The Sea Key rests on its stand.'},
 {ensure:{enchanted_armour:1}},{toast:'You got enchanted armour!'},{set:'q5_done'},{done:'q5'},
 {msg:'[Placeholder] The pirates will go for the Sky temple next.'}];
TRIGGERS.push(
 {id:'q5_hall',when:{zone:6},if:{quest:'q5',step:0},do:[{set:'q5_hall'},{step:1},{msg:'Dark wet footprints lead to the stairs. The pirates went down to the vault!'}]},
 {id:'q5_vault',when:{zone:7},if:{quest:'q5',step:1},do:[{step:2},{scene:'q5_vault'}]},
 {id:'q5_pirates_beaten',when:{beaten:'q5_pirates'},do:[{step:3},{scene:'q5_aftermath'}]},
 {id:'q5_tower',when:{zone:10},if:{quest:'q5',step:3,has:{sea_key:1},noflag:'q5_done'},do:[{scene:'q5_tower'}]}
);
