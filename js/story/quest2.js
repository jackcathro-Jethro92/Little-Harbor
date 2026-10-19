// ---------- Quest 2: Find Rue (roadmap 4.2) ----------
// The story: Bjorn the Elder sent Rue to the mainland settlement for weapons and she has not come back. Garrick, the blacksmith, has heard a ship went down north of the forest and gives the player a sword;
// the way is through the Darkwood (beasts, and a forked trail where one branch is shut by a boulder that needs a pickaxe); Rue is found by the woodcutter's cottage; Garrick is impressed and gives a pickaxe and
// says he will buy metal; Rue is taken home and says he could crew a ship one day (crew_1 only makes him hireable: find him in the village and pay 2,500, see js/data/crew.js); Bjorn rewards the player with a healing potion and a stamina tonic and points them to Murl at the boatyard.
// The six spoken lines marked JACK are Jack's own words from STORY_TEXT.md, word for word (also in JACKS_LINES.txt). Everything else is a PLACEHOLDER until he writes his own.
// Switches: q2_started, q2_garrick1 (+ q2_got_sword), q2_rue_found, q2_garrick2 (+ q2_got_pickaxe, blacksmith_buys_ore), q2_rue_home (+ lost_man_home, crew_1), q2_done, forest_boulder_open.
// Places are world tile coordinates; the Darkwood's rows are its own y (4-39) plus FY, like the rest of the forest. Bjorn and Rue are story-only people (hidden until their moment).
// The woodcutter's cottage stands at (120-122, 7-8) in the forest with Hale in front; Rue waits at its side. The forked trail is on the middle trail where it runs east at y 26; the boulder shuts the east branch.
QUESTS.push({id:'q2',name:'Find Rue',
 steps:['[Placeholder] The village elder is looking for you. Talk to Bjorn the Elder.','[Placeholder] Rue went to the mainland for weapons and has not come back. Ask Garrick the blacksmith in the Walled Settlement.','[Placeholder] Garrick says a ship went down north of the forest. Go through the Darkwood and find Rue by the woodcutter\u2019s cottage.','[Placeholder] You found Rue. Tell Garrick.','[Placeholder] Take Rue home to the village.','[Placeholder] Tell Bjorn the Elder that Rue is safe.'],
 goals:['Bjorn the Elder','Garrick',[36,146],'Garrick','Rue','Bjorn the Elder']});
NPC.push({n:'Bjorn the Elder',x:155,y:104,hx:155,hy:104,f:'d',skin:0,hair:3,shirt:4,jk:3,hat:'none',hstyle:'bald',pack:false,fixed:1,say:['[Placeholder] The harbor looks after those who look after it.'],bio:{age:null,job:'Village elder',backstory:null,likes:[],q:null}});
NPC.push({n:'Rue',x:124,y:9+FY,hx:124,hy:9+FY,f:'l',skin:2,hair:5,shirt:3,jk:5,hat:'cap',hc:2,hstyle:'ponytail',pack:false,fixed:1,crew:'rue',say:['[Placeholder] Good on the ropes and fast in a fight, that is me.'],bio:{age:null,job:'Sailor',backstory:null,likes:[],q:null}});
STORY_PEOPLE.push(
 {npc:'Bjorn the Elder',if:{flag:'q1_done'},at:[155,104],f:'d'},{npc:'Bjorn the Elder',hide:1},
 {npc:'Rue',if:{flag:'q2_garrick2'},at:[153,122],f:'r'},
 {npc:'Rue',if:{flag:'q2_rue_found'},hide:1},
 {npc:'Rue',if:{flag:'q2_started'},at:[124,9+FY],f:'l'},
 {npc:'Rue',hide:1});
GATES.push({id:'forest_boulder',flag:'forest_boulder_open',cells:[[134,26+FY]],closed:36,msg:'A great boulder shuts the east trail. You would need a pickaxe to break it.',needs:{eq:'pickaxe'},opens:'You break the boulder apart with your pickaxe!'});applyGates();
DLG.q2_bjorn1={start:'a',nodes:{a:{who:'Bjorn the Elder',text:"Ahh! Thanks for coming to see me. Im guessing you heard. Well look, I need your help. I have sent Rue to the mainland to get weapons and supplies for the village. If those Pirates show up here we don't want to be defenseless. But she should have been back by now. I need to go speak with Garrick about this and see if you can find Rue. Hurry on now."}}};   // JACK
DLG.q2_garrick1={start:'a',nodes:{a:{who:'Garrick',text:"I haven't seen Rue today. But i heard someone speaking about a ship that went down a little north of the forest. Why don't you go have a look up north. Don’t go by ship, though a storm is blowing through that ways. If you go through the forest, you’ll have better luck. But be careful, foul beasties lurk in that wood. Take this and stay safe"}}};   // JACK
DLG.q2_rue1={start:'a',nodes:{a:{who:'Rue',text:"Boy am i glad to see you, Bjorn sent the right person for the job lets get out of here eh"}}};   // JACK
DLG.q2_garrick2={start:'a',nodes:{a:{who:'Garrick',text:"Impressive work lad. Listen, you seem to be able to handle yourself pretty well. I need materials for my work. iron , copper, tim and such. How about we make a deal. You take this pick axe here and if you collect materials bring them back to me. I'll buy them from you for a good price."}}};   // JACK
DLG.q2_rue2={start:'a',nodes:{a:{who:'Rue',text:"I sure am grateful for you showing up. Now if you be looking for Crew for a ship one day you come fine me see. Im good on the ropes and fast in a fight. I'm gonna go deliver these weapons around now but you go speak to Bjorn. Be sure to tell him im grateful for him sending you"}}};   // JACK
DLG.q2_bjorn2={start:'a',nodes:{a:{who:'Bjorn the Elder',text:"Well well well. I knew I put my hopes in good hands. It's nice to know we have someone here we can rely on. Listen, take these. Helpful in a tight spot they are. If you're looking to make some extra coins I overheard Murl at the ship yard needing some help with something. Why don't you go and have a chat with him."}}};   // JACK
TRIGGERS.push(
 {id:'q2_bjorn1',when:{talk:'Bjorn the Elder'},if:{flag:'q1_done',noflag:'q2_started'},do:[{say:'q2_bjorn1'},{set:'q2_started'},{quest:['q2',1]}]},
 {id:'q2_garrick1',when:{talk:'Garrick'},if:{flag:'q2_started',noflag:'q2_garrick1'},do:[{say:'q2_garrick1'},{ensure:{sword:1}},{set:'q2_got_sword'},{set:'q2_garrick1'},{step:2},{toast:'Garrick gave you a sword!'}]},
 {id:'q2_rue1',when:{talk:'Rue'},if:{flag:'q2_garrick1',noflag:'q2_rue_found'},do:[{say:'q2_rue1'},{set:'q2_rue_found'},{step:3},{msg:'You found Rue! Head back to Garrick.'}]},
 {id:'q2_garrick2',when:{talk:'Garrick'},if:{flag:'q2_rue_found',noflag:'q2_garrick2'},do:[{say:'q2_garrick2'},{ensure:{pickaxe:1}},{set:'q2_got_pickaxe'},{set:'blacksmith_buys_ore'},{set:'q2_garrick2'},{step:4},{toast:'Garrick gave you a pickaxe!'}]},
 {id:'q2_rue2',when:{talk:'Rue'},if:{flag:'q2_garrick2',noflag:'q2_rue_home'},do:[{say:'q2_rue2'},{set:'q2_rue_home'},{set:'lost_man_home'},{set:'crew_1'},{step:5}]},
 {id:'q2_bjorn2',when:{talk:'Bjorn the Elder'},if:{flag:'q2_rue_home',noflag:'q2_done'},do:[{say:'q2_bjorn2'},{give:{healing_potion:1,stamina_tonic:1}},{set:'q2_done'},{done:'q2'},{toast:'Bjorn gave you a healing potion and a stamina tonic!'},{msg:'Murl at the boatyard needs some help. Go and have a chat with him.'}]}
);
