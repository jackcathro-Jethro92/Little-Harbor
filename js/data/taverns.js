// ---------- the taverns: the job notice boards, the regulars inside, and the tables outside (js/systems/taverns.js) ----------
// JOBS: the jobs pinned to the taverns' notice boards. Quests come later; a row will look like
//   {id:'wolf_pelts', title:'Wolf pelts wanted', at:'inn_settlement' (or 'inn_mountain', or 'any'), reward:'60 gold', desc:'...'}
const JOBS=[];
// TAVERN_REGULARS: the people sitting in each tavern (at: the tavern's SHOP_ROOMS id; x, y: their tile inside the room; f: the way they face). Their looks use the usual NPC colour numbers.
const TAVERN_REGULARS=[
 {at:'inn_settlement',n:'Wendel',x:2,y:6,f:'u',skin:3,hair:5,shirt:2,jk:1,hc:4,hat:'cap',say:['Pull up a stool. The ale is warm and so is the fire.','I sailed every sea once. Now I sail this stool.']},
 {at:'inn_settlement',n:'Greta',x:7,y:9,f:'u',skin:1,hair:2,shirt:4,jk:3,hc:1,hat:'none',say:['Check the notice board. Folk pin jobs up there.','I trade cloth up and down the coast.']},
 {at:'inn_settlement',n:'Tobias',x:2,y:10,f:'u',skin:4,hair:0,shirt:1,jk:5,hc:2,hat:'none',say:['Hobb pours a fair pint.','I heard the pirates are bolder this year.']},
 {at:'inn_settlement',n:'Nell',x:7,y:11,f:'l',skin:0,hair:3,shirt:5,jk:2,hc:3,hat:'straw',say:['Shh, I am listening for gossip.','The stew here is better than mine. Do not tell anyone.']},
 {at:'inn_mountain',n:'Gunnar',x:2,y:6,f:'u',skin:2,hair:4,shirt:3,jk:4,hc:0,hat:'none',say:['Cold outside, warm inside. That is a tavern.','The arena crowd comes here after a bout.']},
 {at:'inn_mountain',n:'Astra',x:7,y:9,f:'u',skin:1,hair:1,shirt:0,jk:2,hc:4,hat:'none',say:['Ragna keeps the notice board. Have a look.','I came up the mountain for the gems.']},
 {at:'inn_mountain',n:'Bjarke',x:2,y:10,f:'u',skin:3,hair:3,shirt:5,jk:0,hc:1,hat:'cap',say:['One more song and I will go home. Maybe.','Mind the steps on your way out.']},
 {at:'inn_mountain',n:'Hilde',x:7,y:11,f:'l',skin:4,hair:2,shirt:2,jk:3,hc:2,hat:'none',say:['The guild fighters drink here. Loudly.','Have you tried the honey mead?']}];
// TAVERN_YARDS: tables, stools and barrels outside each tavern, on the map ([prop id from js/render/props.js, x, y]). They stand in the way, like furniture indoors.
const TAVERN_YARDS={
 inn_settlement:[['crate',101,219],['barrel',101,220],['barrel',105,220],['stool',106,219],['roundtable',107,219],['stool',109,220],['cask',110,219],['stool',111,220]],
 inn_mountain:[['barrel',21,69],['crate',21,70],['cask',25,69],['stool',25,70]]};
