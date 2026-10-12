// ---------- Quest 1: A Stranger's Letter, Part 1 (roadmap 4.1) ----------
// The story: the seagull letter (js/story/opening.js) asks for help at the northern water temple, the Temple of the Sea (courtyard x 279-287, y 32-37, hall door (283,31)). Pirates are attacking: the player beats
// them one by one; the last one warns that the rest of The Fleet is coming; the old stranger comes out of hiding and gives his grandfather's compass; back in the village a villager runs up with the news of the
// pirates on Fire Island. The three spoken lines marked JACK are Jack's own words from STORY_TEXT.md, word for word (also in JACKS_LINES.txt); every other line is a PLACEHOLDER until he writes his own.
// Switches: q1_stranger_out / q1_stranger_gone (the stranger's scene), q1_done, has_compass, pirate_base_known, pirates_called (the pirates take the island at the next sleep), q1_villager_here / q1_villager_gone.
// Places are world tile coordinates. The pirates stand in the courtyard (encounter q1_pirates), fought one by one on the battle screen.
QUESTS.push({id:'q1',name:'A Stranger\u2019s Letter, Part 1',
 steps:['[Placeholder] A stranger has sent a letter asking for help. Sail to the northern water temple.','[Placeholder] Pirates are attacking the temple. Defeat them.','[Placeholder] Find the stranger.'],
 goals:[[283,40],[283,34],[283,33]]});
NPC.push({n:'Old Stranger',x:283,y:32,hx:283,hy:32,f:'d',skin:0,hair:3,shirt:5,jk:3,hat:'none',hstyle:'bald',pack:false,fixed:1,say:['[Placeholder] Thank you again, friend.'],bio:{age:null,job:'Keeper of the Sea temple',backstory:null,likes:[],q:null}});
NPC.push({n:'Villager',x:156,y:121,hx:156,hy:121,f:'d',skin:2,hair:4,shirt:3,pack:false,fixed:1,say:['[Placeholder] Mind how you go out there.'],bio:{age:null,job:'Villager',backstory:null,likes:[],q:null}});
STORY_PEOPLE.push(
 {npc:'Old Stranger',if:{flag:'q1_stranger_gone'},hide:1},
 {npc:'Old Stranger',if:{flag:'q1_stranger_out'},at:[283,32],f:'d'},
 {npc:'Old Stranger',hide:1},
 {npc:'Villager',if:{flag:'q1_villager_gone'},hide:1},
 {npc:'Villager',if:{flag:'q1_villager_here'},at:[156,121],f:'d'},
 {npc:'Villager',hide:1});
ENCOUNTERS.push({id:'q1_pirates',mode:'battle',foes:[{foe:'pirate_grunt',at:[280,36]},{foe:'pirate_gunner',at:[286,36]},{foe:'pirate_grunt',at:[283,34]}]});
DLG.q1_see_pirates={start:'a',nodes:{a:{who:'You',text:'[Placeholder] Pirates! They are attacking the temple. I have to stop them.'}}};
DLG.q1_pirate={start:'a',nodes:{a:{who:'Pirate grunt',text:"This isn't over! You'll see! Just wait till the rest of us get here! Then youl wish you had never messed with The Fleet!"}}};   // JACK
DLG.q1_stranger={start:'a',nodes:{
 a:{who:'Old Stranger',text:'[Placeholder] ...Is it safe? Have they gone?',next:'b'},
 b:{who:'Old Stranger',text:"Thank you so much. They were just about to break into the sacred Vault. Thankfully you got my letter and made it here in time. Take this compass as a thanks. It will help show you the way when the seas get rough"}}};   // JACK (the second line)
DLG.q1_villager={start:'a',nodes:{a:{who:'Villager',text:"Have you heard! Pirates have been sited taking of fire island and setting up some kind of camp! Id steer clear of those waters if i was you. They look mean alright. You should go talk to Bjorn. I think i is looking for you."}}};   // JACK
SCENES.q1_aftermath=[
 {wait:400},{say:'q1_pirate'},{toast:'The pirates have fled!'},
 {fade:'out',ms:500},{tp:['You',283,33]},{set:'q1_stranger_out'},{face:['You','u']},{face:['Old Stranger','d']},{fade:'in',ms:700},
 {say:'q1_stranger'},
 {give:{grandfather_compass:1}},{toast:"You got Grandfather's compass!"},{wait:500},
 {walk:['Old Stranger',283,31,260]},{set:'q1_stranger_gone'},
 {set:'q1_done'},{set:'has_compass'},{set:'pirate_base_known'},{set:'pirates_called'},{done:'q1'},
 {msg:'The compass will show you the way. A small arrow points to your quest.'}];
SCENES.q1_village=[
 {set:'q1_villager_here'},{tp:['Villager',156,120]},{walk:['You',156,126,150]},{face:['You','u']},{walk:['Villager',156,125,130]},{face:['Villager','d']},
 {say:'q1_villager'},
 {walk:['Villager',156,119,110]},{set:'q1_villager_gone'}];
TRIGGERS.push(
 {id:'q1_arrive',when:{area:[279,32,287,37]},if:{quest:'q1',noflag:'q1_done'},do:[{encounter:'q1_pirates'},{step:1},{say:'q1_see_pirates'}]},
 {id:'q1_aftermath',when:{beaten:'q1_pirates'},do:[{step:2},{scene:'q1_aftermath'}]},
 {id:'q1_villager',when:{area:[154,122,160,129]},if:{flag:'q1_done',noflag:'q1_villager_gone'},do:[{scene:'q1_village'}]}
);
