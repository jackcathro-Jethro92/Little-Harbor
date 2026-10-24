// ---------- the taverns: the job notice boards, the regulars inside, and the tables outside (js/systems/taverns.js) ----------
// JOBS: the jobs pinned to the taverns' notice boards (Jack's tavern quests; js/systems/jobs.js runs them). at: the tavern (its SHOP_ROOMS id). from: who asked. desc: the notice, in Jack's words.
//   need {item:count}  bring these to `to` (that person takes them and pays)           enc 'id'  an encounter (js/systems/encounters.js) to beat; paid at the board once it is done
//   find 'item'        also pick this up on the map (job.spot); it goes back with you   reward {gold, item}   what you get
const JOBS=[
 {id:'lucie_gold',at:'inn_mountain',title:'Gold for Lucie',from:'Lucie',desc:'Lucie wants you to bring her 100 gold ore and 100 silver ore.',need:{gold_ore:100,silver_ore:100},to:'Lucie',reward:{item:'amulet_healing'}},
 {id:'lost_axe',at:'inn_mountain',title:'A villager lost his axe',from:'Halvard',desc:'While clearing a rock slide on the outskirts of town, Halvard was attacked by rock dragons. He dropped his axe and ran, but he needs help getting it back. Go and find his axe and defeat the rock dragons.',enc:'job_axe',find:'halvards_axe',reward:{gold:500}},
 {id:'centipede_nests',at:'inn_mountain',title:'Clear the centipede nests',from:'The Mountain Town',desc:'It seems the centipede population is growing, and their nests in the corners of the Darkwood are getting out of control. We need someone to go in and clear them out.',enc:'job_nests',reward:{gold:2500}},
 {id:'astrid_materials',at:'inn_settlement',title:'Materials needed',from:'Astrid',desc:'Astrid wants you to bring her 20 centipede fangs, 50 red caps and 150 basil.',need:{centipede_fang:20,red_cap:50,basil:150},to:'Astrid',reward:{item:'vigour_draught'}},
 {id:'bandits',at:'inn_settlement',title:'Clear out the bandits',from:'The Mayor of the Walled Settlement',desc:'A bandit camp has moved into the lands in the south-west corner of the map. Clear them out for the Mayor of the Walled Settlement. Ten bandits to clear.',enc:'job_bandits',reward:{gold:1000}},
 {id:'winter_collection',at:'inn_settlement',title:'Tailor in need',from:'Seamstress Wynn',desc:'Wynn is looking for someone to bring her 50 wolf pelts to make her new winter collection. She knows this is no small task, so she will pay 5000 gold.',need:{wolf_pelt:50},to:'Seamstress Wynn',reward:{gold:5000}}];
// TAVERN_REGULARS: the people sitting in each tavern (at: the tavern's SHOP_ROOMS id; x, y: their tile inside the room; f: the way they face). Their looks use the usual NPC colour numbers.
const TAVERN_REGULARS=[
 {at:'inn_settlement',n:'Wendel',x:2,y:6,f:'u',skin:3,hair:5,shirt:2,jk:1,hc:4,hat:'cap',say:['Pull up a stool. The ale is warm and so is the fire.','I sailed every sea once. Now I sail this stool.']},
 {at:'inn_settlement',n:'Greta',x:8,y:7,f:'l',skin:1,hair:2,shirt:4,jk:3,hc:1,hat:'none',say:['Check the notice board. Folk pin jobs up there.','I trade cloth up and down the coast.']},
 {at:'inn_settlement',n:'Tobias',x:2,y:10,f:'u',skin:4,hair:0,shirt:1,jk:5,hc:2,hat:'none',say:['Hobb pours a fair pint.','I heard the pirates are bolder this year.']},
 {at:'inn_settlement',n:'Nell',x:7,y:11,f:'l',skin:0,hair:3,shirt:5,jk:2,hc:3,hat:'straw',say:['Shh, I am listening for gossip.','The stew here is better than mine. Do not tell anyone.']},
 {at:'inn_mountain',n:'Gunnar',x:2,y:6,f:'u',skin:2,hair:4,shirt:3,jk:4,hc:0,hat:'none',say:['Cold outside, warm inside. That is a tavern.','The arena crowd comes here after a bout.']},
 {at:'inn_mountain',n:'Astra',x:8,y:7,f:'l',skin:1,hair:1,shirt:0,jk:2,hc:4,hat:'none',say:['Ragna keeps the notice board. Have a look.','I came up the mountain for the gems.']},
 {at:'inn_mountain',n:'Bjarke',x:2,y:10,f:'u',skin:3,hair:3,shirt:5,jk:0,hc:1,hat:'cap',say:['One more song and I will go home. Maybe.','Mind the steps on your way out.']},
 {at:'inn_mountain',n:'Hilde',x:7,y:11,f:'l',skin:4,hair:2,shirt:2,jk:3,hc:2,hat:'none',say:['The guild fighters drink here. Loudly.','Have you tried the honey mead?']}];
// TAVERN_YARDS: tables, stools and barrels outside each tavern, on the map ([prop id from js/render/props.js, x, y]). They stand in the way, like furniture indoors.
const TAVERN_YARDS={
 inn_settlement:[['crate',101,219],['barrel',101,220],['barrel',105,220],['stool',106,219],['table',107,219],['stool',109,219],['cask',110,219],['stool',111,220]],
 inn_mountain:[['barrel',21,69],['crate',21,70],['cask',25,69],['stool',25,70]]};
