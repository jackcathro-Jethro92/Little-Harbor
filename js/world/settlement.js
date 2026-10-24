// ---------- the Walled Settlement grows: more homes, townsfolk and Garrick's forge ----------
// Runs right after overworld.js, which builds the walls, the gates and the main street.
// The town is laid out by hand so it feels grown rather than planned: a north road that bends from the gate down to a village square with a well, lanes that wander from each
// home to the square, the main street or the lane south to the forge, fenced front yards, trees, signposts and benches (the props are in TOWN_DECOR, js/data/town.js).
// SET_LAYOUT: the fifteen homes, in the order of SET_NAMES below (whoever lives there). x, y: the house's top-left tile (3 x 2; its door stand tile is (x+1, y+2)); shape: 'tall' (two storeys), 'wing' (a
// shed on the right, one more tile) or 'porch' (a covered porch) or none; yard: a fence round a small front yard with a gate in front of the door. HOME_ROOMS (js/data/interiors.js) uses the same corners.
const SET_LAYOUT=[{x:87,y:203,roof:'red',shape:'wing'},{x:92,y:202,roof:'thatch',shape:'tall'},{x:104,y:202,roof:'slate',shape:'porch'},{x:109,y:203,roof:'thatch',yard:1},
 {x:87,y:209,roof:'thatch',yard:1},{x:108,y:209,roof:'red',shape:'wing',yard:1},{x:87,y:220,roof:'slate',shape:'tall'},{x:110,y:222,roof:'thatch',yard:1},
 {x:92,y:208,roof:'slate',shape:'porch'},{x:104,y:212,roof:'thatch'},{x:92,y:221,roof:'red',shape:'wing'},{x:96,y:226,roof:'thatch',shape:'porch'},
 {x:87,y:227,roof:'slate'},{x:91,y:229,roof:'thatch',shape:'wing'},{x:109,y:228,roof:'red',shape:'tall'}];
// the lanes: each is a list of waypoints joined by a lane that steps diagonally between them (dirt, tile 6)
const SET_LANES=[[[100,201],[100,203],[101,204],[101,206]],[[100,211],[100,216]],[[88,205],[91,206],[95,208],[96,209]],[[93,204],[95,206],[96,208]],[[105,204],[104,206],[103,207]],
 [[110,205],[110,207],[109,208],[105,208]],[[88,211],[88,213],[91,214],[94,215],[94,216]],[[93,210],[95,211],[97,211]],[[109,211],[109,213],[108,214],[108,216]],[[105,214],[106,215],[106,216]],
 [[100,219],[100,221],[98,224],[99,227],[101,229],[101,231],[104,231]],[[101,221],[103,221]],[[88,222],[88,219]],[[93,223],[94,220],[94,219]],[[97,228],[98,226],[98,224]],
 [[88,229],[90,226],[92,224],[93,224]],[[92,231],[96,231],[99,229]],[[111,224],[111,226],[113,227],[113,221],[112,219]],[[110,230],[108,230],[106,232],[104,232],[104,231]],
 [[84,216],[86,216]],[[115,216],[113,216]]];
{const lane=(a,b)=>{let[x,y]=a;const[tx,ty]=b,dx=Math.abs(tx-x),dy=Math.abs(ty-y),sx=Math.sign(tx-x),sy=Math.sign(ty-y);let err=dx-dy;setT(x,y,6);
   while(x!==tx||y!==ty){const e2=2*err;if(e2>-dy&&x!==tx){err-=dy;x+=sx}else if(y!==ty){err+=dx;y+=sy}else{x+=sx}setT(x,y,6)}};
 rect(85,201,114,233,(x,y)=>{if(y!==217&&y!==218)setT(x,y,1)});                                                            // start again from grass (the main street stays)
 for(let y=207;y<=211;y++)for(let x=95;x<=106;x++)if(((x-100.5)/5)**2+((y-209)/2.6)**2<=1)setT(x,y,6);                      // the village square, round, around the well
 for(let x=85;x<=114;x++){const h=hs(x*7,13)%5;if(h===0)setT(x,216,6);if(h===1)setT(x,219,6)}                                // the main street's edges wander a little
 SET_LANES.forEach(l=>{for(let i=1;i<l.length;i++)lane(l[i-1],l[i])});
 SET_LAYOUT.forEach(h=>{BL.push({x:h.x,y:h.y,w:3,roof:h.roof,shape:h.shape});rect(h.x,h.y,h.x+2,h.y+1,(x,y)=>setT(x,y,5));if(h.shape==='wing')setT(h.x+3,h.y+1,5);
   if(h.yard){const x0=h.x-1,x1=h.x+3,y0=h.y+2,y1=h.y+4;for(let y=y0;y<=y1;y++){setT(x0,y,8);setT(x1,y,8)}for(let x=x0;x<=x1;x++)if(x!==h.x+1)setT(x,y1,8);for(let y=y0;y<=y1;y++)setT(h.x+1,y,6)}})}
BL.push({x:103,y:229,w:3,roof:'slate',sign:'smith'});rect(103,229,105,230,(x,y)=>setT(x,y,5)); // Garrick's forge
[[106,229],[106,230],[95,216],[105,216],[95,219],[105,219]].forEach(([x,y],i)=>{if(at(x,y)===1||at(x,y)===6)setT(x,y,i<2?11:7)}); // barrels at the forge, lanterns on the street
// the tailor and the barber, side by side on the main street either side of the road (door stand tiles are on the street)
BL.push({x:97,y:215,w:3,roof:'red',sign:'tailor'});rect(97,215,99,216,(x,y)=>setT(x,y,5));
BL.push({x:101,y:215,w:3,roof:'slate',sign:'barber'});rect(101,215,103,216,(x,y)=>setT(x,y,5));
// Astrid's Apothecary, on the north side of the main street beside the tailor: potions and poisons (door stand tile is (91,217))
BL.push({x:90,y:215,w:3,roof:'thatch',sign:'apothecary'});rect(90,215,92,216,(x,y)=>setT(x,y,5));
// The Salty Anchor tavern, south of the main street (door stand tile is (103,221))
BL.push({x:102,y:219,w:3,roof:'red',sign:'tavern'});rect(102,219,104,220,(x,y)=>setT(x,y,5));
const SET_NAMES=['Wilf','Edda','Marek','Sunniva','Corin','Hesper','Dunstan','Lysa','Osric','Maren','Thom','Bryn','Alder','Fenna','Joss'];
const SET_SAY=[['Welcome to the settlement. Mind the cobbles.','The walls keep the wolves out, mostly.'],['Garrick makes the best blades this side of the mountains.','I bake bread before sunrise. Come by early!'],['My boy wants to sail. I want him to stay!','The docks are east, along the wide path.'],['Quiet times. I like it that way.','The Darkwood is west, past the woodcutters.'],['Ore is dear this year. Try the forge, they buy it.','Hale the woodcutter sends us good timber.'],['I grow herbs behind the house. Basil, mostly.','Lovely day, is it not?'],['Seen any pirates? Me neither, thank goodness.','Strangers always bring news.'],['Our little town gets bigger every year.','Fresh planks make a house last.'],['I patch nets for the docks.','The sea brings us everything, good and bad.'],['Have you met Garrick? Loud, but kind.','Rope and planks, that is what builds a town.'],['Trade is good with the harbor village.','Take care on the road. It is long.'],['Hush, the baby is finally asleep.','Home is where the hearth is.'],['I would like a sword someday. Just to hang on the wall.','Bring Garrick some iron. He will be grateful.'],['I keep chickens. They keep me up.','The gate guard never sleeps, I swear.'],['New face! Stay a while.','Stew tonight. There is plenty.']];
const SET_HOMES=SET_LAYOUT.map(h=>[h.x,h.y]);
SET_NAMES.forEach((n,i)=>{const[hx,hy]=SET_HOMES[i%SET_HOMES.length],x=hx+1+(i>=SET_HOMES.length?1:0),y=hy+2;
  NPC.push({id:'s'+i,n,x,y,hx:x,hy:y,f:'d',skin:i%5,hair:(i*5+2)%6,shirt:(i*3+1)%6,jk:(i*7+3)%6,hc:i%5,hat:['cap','none','straw','none','cap'][i%5],pack:i%4===1,jon:i%3!==1,
    bio:{age:null,job:null,backstory:null,likes:[],quests:[]},say:SET_SAY[i]})});
NPC.push(
 {n:'Garrick',x:104,y:231,hx:104,hy:231,f:'d',skin:2,hair:3,shirt:5,jk:5,hat:'none',pack:false,jon:true,store:'smith',fixed:1,bio:{age:null,job:'Blacksmith',backstory:null,likes:[],quests:[]},say:['Metal, blades and tools. Take a look.']},
 {n:'Tilda',x:107,y:231,hx:107,hy:231,f:'l',skin:1,hair:2,shirt:0,jk:3,hat:'cap',pack:false,jon:true,say:['I am Garrick\'s apprentice. I work the bellows.','Bring ore and bars, and he pays fair.']},
 {n:'Innkeeper Hobb',x:103,y:221,hx:103,hy:221,f:'u',skin:2,hair:1,shirt:1,jk:4,hat:'none',pack:false,jon:true,fixed:1,bio:{age:null,job:'Innkeeper',backstory:null,likes:[],quests:[]},say:['Rooms are 100 gold a night. Clean sheets, I promise.','The stew is on the house. Well, not really.']},
 {n:'Gate Guard Bors',x:99,y:202,hx:99,hy:202,f:'d',skin:3,hair:0,shirt:4,jk:5,hat:'cap',hc:2,pack:false,fixed:1,say:['Halt. Oh, it is you. Carry on.','Keep to the road in the forest.']},
 {n:'Astrid',x:91,y:217,hx:91,hy:217,f:'u',skin:1,hair:5,shirt:3,jk:2,hat:'none',pack:false,jon:true,store:'apothecary',fixed:1,bio:{age:null,job:'Apothecary',backstory:null,likes:[],quests:[]},say:['Potions to heal, poisons to harm. Mind which is which.']},
 {n:'Seamstress Wynn',x:98,y:217,hx:98,hy:217,f:'u',skin:0,hair:4,shirt:4,jk:3,hat:'none',pack:false,jon:true,store:'tailor',fixed:1,bio:{age:null,job:'Tailor',backstory:null,likes:[],quests:[]},say:['Clothes make the fisher.']},
 {n:'Barber Fenwick',x:102,y:217,hx:102,hy:217,f:'u',skin:2,hair:3,shirt:5,jk:0,hat:'none',hstyle:'spiky',pack:false,jon:false,store:'barber',fixed:1,bio:{age:null,job:'Barber',backstory:null,likes:[],quests:[]},say:['A trim, a shave, a new you.']});
