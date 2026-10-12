// ---------- Quest 3: Murl's Quest (roadmap 5.3) ----------
// The story: Bjorn sent the player to Murl at the boatyard. Murl is carving the mast of his next ship and needs a straight, extra-hard log. The best grows on Island 6 ("Oak Island", centre (144,170)).
// The player sails there and picks up an ironwood log (the fallen-log tile 140, three of them on the island; see js/world/island6.js and PICKUPS in js/data/gathering.js; no axe is needed, because the player has no axe yet),
// brings it back to Murl and is paid 100 gold. Murl has also written to Hale, the woodcutter in the Darkwood, who has a spare woodcutter's axe: from now on the axe is no longer sold in Bram's shop (SHOP_LOCKS) and Hale hands it over.
// The two long speeches are Jack's own words from STORY_TEXT.md, word for word (also in JACKS_LINES.txt). Everything else is a PLACEHOLDER until he writes his own.
// Switches: q3_started, q3_got_log, q3_done, axe_waiting, has_axe. Items: ironwood_log (a key item, handed in at the end).
QUESTS.push({id:'q3',name:"Murl's Quest",
 steps:['[Placeholder] Murl needs a straight, hard log for a ship mast. Sail to Oak Island (Island 6) and find one.','[Placeholder] You have the ironwood log. Take it back to Murl at the boatyard.'],
 goals:[[144,170],'Murl']});
DLG.q3_murl1={start:'a',nodes:{a:{who:'Murl',text:"Old Bjon sent ya did he? Well i need some help finding some timber. Im building a Mast for my next ship. I need some special wood for this though. Only the straightest strongest wood will do. Go to (Island 6 “Oak island”) Look for a hard wood mast tree. Bring me back one of those and ill make it worth your while"}}};   // JACK
DLG.q3_murl_wait={start:'a',nodes:{a:{who:'Murl',text:'[Placeholder] Still no mast timber? Look on Oak Island, the one south of here. A straight log of hardwood. You will know it when you see it.'}}};
DLG.q3_murl_got={start:'a',nodes:{a:{who:'Murl',text:"Well done! Here take this gold. But I wrote to my old friend Hale. He's that fella who cutts the timber in the darkwood. He says he had a spare axe you can have. You just gotta go get it and its all yours"}}};   // JACK
DLG.q3_hale={start:'a',nodes:{a:{who:'Hale',text:'[Placeholder] Murl wrote to me. Said you would be along. Here, the old axe. Chop kindly.'}}};
TRIGGERS.push(
 {id:'q3_murl1',when:{talk:'Murl'},if:{flag:'q2_done',noflag:'q3_started'},do:[{say:'q3_murl1'},{set:'q3_started'},{quest:['q3',0]}]},
 {id:'q3_murl_done',when:{talk:'Murl'},if:{flag:'q3_started',noflag:'q3_done',has:{ironwood_log:1}},do:[{say:'q3_murl_got'},{take:{ironwood_log:1}},{gold:100},{set:'q3_done'},{set:'axe_waiting'},{done:'q3'},{toast:'Murl paid you 100 gold!'},{msg:'Hale the woodcutter has a spare axe for you. Look for him in the Darkwood.'}]},
 {id:'q3_murl_wait',when:{talk:'Murl'},if:{flag:'q3_started',noflag:'q3_done'},do:[{say:'q3_murl_wait'}]},
 {id:'q3_hale',when:{talk:'Hale'},if:{flag:'axe_waiting',noflag:'has_axe'},do:[{say:'q3_hale'},{ensure:{woodcutters_axe:1}},{set:'has_axe'},{toast:'Hale gave you a woodcutter\'s axe!'}]}
);
