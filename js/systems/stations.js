// ---------- stations: camp, benches, crafting ----------
const CAMP_R=5;
// a camp placed since playtest #3 (`big:1`) is a tent two tiles wide and two tall plus a one-tile fire to its right; `x,y` is the fire. Everything else, and older camps, fill the one tile.
const campTent=p=>[[p.x-2,p.y-1],[p.x-1,p.y-1],[p.x-2,p.y],[p.x-1,p.y]];
function placedAt(x,y){return S.placed.find(p=>(p.x===x&&p.y===y)||(p.big&&p.id==='camp_kit'&&campTent(p).some(c=>c[0]===x&&c[1]===y)))}
const campOf=()=>S.placed.find(p=>p.id==='camp_kit');
// the camp's tent: you can sleep when you stand next to the camp kit (within 2 tiles), the same as on the boat
const atTent=()=>{const c=campOf();return !!c&&!sail&&Math.hypot(c.x-P.x,c.y-P.y)<=(c.big?3:2)};
let placing=null; // id of the station you are currently placing
function placeWhy(id,x,y){
  if(sail)return 'Step onto land first.';
  const t=at(x,y),it=ITEMS[id];
  if(x===P.x&&y===P.y)return 'You are standing there.';
  if(t===0)return "That's water. Face dry land.";
  if(t===4)return 'A tree is in the way.';
  if(t===5)return 'A building is in the way.';
  if(t===19)return 'A flax bush is there. Cut it first.';
  if(t===3)return "You can't build on the pier.";
  if(zoneOf(x,y)>=3)return "You can't place that here.";
  if(![1,2,6,18,20,21,48].includes(t))return "You can't place that there.";
  if(npcAt(x,y))return 'Someone is standing there.';
  if(placedAt(x,y))return 'Something is already there.';
  if((B.x===x&&B.y===y)||enemyAt(x,y))return "You can't place that there.";
  if(it.place==='camp')return inRoom(x,y)?"You can't set up camp indoors.":campOf()?'You already have a camp set up.':'';
  if((S.home&&x===S.home.x+1&&y===S.home.y+2)||(x===IR.dx&&y===IR.dy))return 'Keep the doorway clear.';
  if(inRoom(x,y))return '';
  const c=campOf(),nearHome=S.home&&Math.hypot(x-(S.home.x+1),y-(S.home.y+1))<=CAMP_R,nearCamp=c&&Math.hypot(c.x-x,c.y-y)<=CAMP_R;
  if(nearHome||nearCamp||onIsle(x,y))return '';   // (on Haven Isle stations go anywhere on the island, not only near the house)
  return c||S.home?'Too far from camp or home. Stations go within '+CAMP_R+' tiles.':'Stations need a camp (or a home) nearby. Set up a camp kit first.'}
// Haven Isle (Quest 10, js/story/quest10.js): once the island is risen the whole of it is yours, so stations can stand anywhere on it
const onIsle=(x,y)=>typeof ISLE!=='undefined'&&flag('island_risen')&&Math.hypot((x-ISLE.cx)/ISLE.rx,(y-ISLE.cy)/ISLE.ry)<=1;
const inClaim=(x,y)=>S.claim&&x>=S.claim.x&&x<S.claim.x+S.claim.w&&y>=S.claim.y&&y<S.claim.y+S.claim.h;
const okGround=(x,y,l)=>l.includes(at(x,y))&&!placedAt(x,y)&&!(B.x===x&&B.y===y)&&!inRoom(x,y)&&zoneOf(x,y)<3;
// the camp kit (playtest #3): a 3 x 2 footprint (tent 2 x 2, fire 1) that can go over almost any open ground, as long as no tile of it touches a building, tree, plant, water, person, station or door. It extends away from you so you are never inside it.
const CAMP_BAD=[3,10,18,19,21,22,23,24,25,26,27,28,29,30,50,57,96,97,105,108,125,131,136];
function campPlan(){const [fx,fy]=front(),f=P.f,x0=f==='l'?fx-2:f==='r'?fx:fx-1,y0=f==='d'?fy:fy-1,t=[];
  const why=(x,y)=>{const k=at(x,y);if(inRoom(x,y))return "You can't set up camp indoors.";if(k===0)return "That's water.";if(zoneOf(x,y)>=3)return "You can't place that here.";
    if(!WK.includes(k)||CAMP_BAD.includes(k))return 'Something is in the way.';
    if(npcAt(x,y)||(x===P.x&&y===P.y)||(B.x===x&&B.y===y)||enemyAt(x,y)||placedAt(x,y)||gardenAt(x,y)||(typeof animalAt==='function'&&animalAt(x,y)))return 'Something is in the way.';
    if((S.home&&x===S.home.x+1&&y===S.home.y+2)||(x===IR.dx&&y===IR.dy))return 'Keep the doorway clear.';return ''};
  for(let y=y0;y<y0+2;y++)for(let x=x0;x<x0+3;x++)t.push([x,y,why(x,y)]);
  return{x:x0,y:y0,w:3,h:2,tiles:t,glob:sail?'Step onto land first.':campOf()?'You already have a camp set up.':''}}
function plan(id){if(id==='camp_kit')return campPlan();const it=ITEMS[id],[fx,fy]=front(),t=[];
  if(it.kind==='claim'){const x0=fx-3,y0=fy-2;
    for(let y=y0;y<y0+5;y++)for(let x=x0;x<x0+7;x++)t.push([x,y,okGround(x,y,[1,2,4,14,15,16,17,18,19,20])?'':'Part of that land is blocked (water, buildings, paths or fences).']);
    return{x:x0,y:y0,w:7,h:5,tiles:t,glob:sail?'Step onto land first.':S.claim?'You already have a claim.':''}}
  if(it.kind==='garden'){const x0=fx-1,y0=fy-1;
    for(let y=y0;y<y0+2;y++)for(let x=x0;x<x0+3;x++)t.push([x,y,okGround(x,y,[1,2,18,19,20])&&!gardenAt(x,y)?'':'A garden needs clear open ground.']);
    return{x:x0,y:y0,w:3,h:2,tiles:t,glob:sail?'Step onto land first.':''}}
  const x0=fx-1,y0=fy-2;
  for(let y=y0;y<y0+2;y++)for(let x=x0;x<x0+3;x++)t.push([x,y,inClaim(x,y)&&okGround(x,y,[1,2,14,18,19,20])?'':'The house must sit inside your claim on ground cleared of trees and ore.']);
  t.push([fx,fy,okGround(fx,fy,[1,2,6,18,19,20])&&!npcAt(fx,fy)?'':'Leave a clear tile in front of the door.']);
  return{x:x0,y:y0,w:3,h:2,tiles:t,glob:sail?'Step onto land first.':!S.claim?'Claim some land first.':S.home?'You already have a house.':''}}
function placeItem(id){
  const it=ITEMS[id];
  if(it.kind==='claim'||it.kind==='prefab'||it.kind==='garden'){const pl=plan(id),why=pl.glob||(pl.tiles.find(q=>q[2])||[])[2];
    if(why){toast(why,2400);return say(why)}
    S.bag[id]--;if(!S.bag[id])delete S.bag[id];placing=null;
    if(it.kind==='claim'){S.claim={x:pl.x,y:pl.y,w:pl.w,h:pl.h};say('Land claimed! Craft a house kit and place it on your plot.');toast('Land claimed!')}
    else if(it.kind==='garden'){S.gardens.push({x:pl.x,y:pl.y,cells:Array(6).fill(null)});for(let j=0;j<2;j++)for(let i=0;i<3;i++){const k=(pl.y+j)*MW+pl.x+i;if([18,19,20].includes(M[k])){M[k]=1;delete S.cut[k]}}say('Garden set up! Face a plot to plant something.');toast('Garden ready!')}
    else{S.home={x:pl.x,y:pl.y,roof:it.roof};for(let j=0;j<2;j++)for(let i=0;i<3;i++){const k=(pl.y+j)*MW+pl.x+i;M[k]=5;delete S.cut[k]}say('Your house is built! Face the door and tap Use to go in.');toast('House built!')}
    ui();save();return}
  if(id==='camp_kit'){const pl=campPlan(),why=pl.glob||(pl.tiles.find(q=>q[2])||[])[2];if(why){toast(why,2200);return say(why)}
    S.bag[id]--;if(!S.bag[id])delete S.bag[id];S.placed.push({id,x:pl.x+2,y:pl.y+1,big:1});placing=null;say('Camp set up. Stand close to the tent and tap Sleep to start a new day.');toast('Camp set up!');ui();save();return}
  const[x,y]=front(),why=placeWhy(id,x,y);if(why){toast(why,2200);return say(why)}
  S.bag[id]--;if(!S.bag[id])delete S.bag[id];S.placed.push({id,x,y});placing=null;
  say(ITEMS[id].n+' placed.');toast(ITEMS[id].n+' placed!');ui();save()}
function pickUp(p){
  if(p.id==='camp_kit'){const rest=S.placed.filter(q=>q!==p);rest.forEach(q=>add(q.id));S.placed=[];add('camp_kit');
    say('Packed up the camp'+(rest.length?' and '+rest.length+' station'+(rest.length>1?'s':''):'')+'.')}
  else{S.placed=S.placed.filter(q=>q!==p);add(p.id);say(ITEMS[p.id].n+' picked up.')}
  ui();save()}
function useStation(p){const it=ITEMS[p.id];
  if(p.id==='camp_kit')return menu(it.n,['Cook','Pick up camp','Cancel'],o=>{if(o==='Cook')openCraft('fire');else if(o==='Pick up camp')pickUp(p)});
  const verb=it.place==='cooking'?'Cook':it.place==='shipwright'?'Build':it.place==='alchemy'?'Brew':'Craft';
  menu(it.n,[verb,'Move','Pick up','Cancel'],o=>{if(o===verb)openCraft(it.place);else if(o==='Pick up')pickUp(p);else if(o==='Move'){S.placed=S.placed.filter(q=>q!==p);add(p.id);placing=p.id;ui();say('Choose a new spot, then tap Use.')}})}
