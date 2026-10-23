// ---------- furniture (batch G3): the carpenter's beds, tables, racks and crates, placed in homes and at camp ----------
// A furniture item is a row of ITEMS with kind:'furniture' and furn:{prop, bed?, store?:{cap, only?, title}}. `prop` names a picture in PROPS.DEF (js/render/props.js), which also gives its size in tiles. It is placed from the Bag like a station
// (the footprint extends away from you, so you are never inside it), kept in S.placed as {id,x,y} (plus `st`, the {item: count} contents, for storage pieces) and drawn by js/render/objects.js. Carpets lie flat: you walk over them and
// furniture can stand on them. Everything else is in the way. Storage pieces hold `cap` things and must be empty before you pick them up or move them. A bed lets you sleep beside it at camp (atBed).
const FPC={};
function furnFp(id){return FPC[id]||(FPC[id]=(()=>{const f=ITEMS[id].furn,[w,h]=propDim(f.prop,0);return{w,h,flat:PROPS.DEF[f.prop].z===0,prop:f.prop}})())}
const isFurn=p=>!!(ITEMS[p.id]&&ITEMS[p.id].furn);
const inFp=(p,x,y)=>{const f=furnFp(p.id);return x>=p.x&&x<p.x+f.w&&y>=p.y&&y<p.y+f.h};
const furnAt=(x,y,flat)=>S.placed.find(p=>isFurn(p)&&furnFp(p.id).flat===flat&&inFp(p,x,y));
const atBed=()=>!sail&&S.placed.some(p=>{if(!isFurn(p)||!ITEMS[p.id].furn.bed)return false;const f=furnFp(p.id);for(let y=p.y;y<p.y+f.h;y++)for(let x=p.x;x<p.x+f.w;x++)if(Math.hypot(x-P.x,y-P.y)<=2)return true;return false});
function furnWhy(id,x,y){const fp=furnFp(id),t=at(x,y);
  if(x===P.x&&y===P.y)return 'You are standing there.';
  if(zoneOf(x,y)>=3)return "You can't place that here.";
  if(inRoom(x,y)){if(!WK.includes(t)||[23,144,145,169].includes(t))return 'Furniture goes on the floor.'}
  else{if(t===0)return "That's water.";if(![1,2,6,18,20,48].includes(t))return "You can't place that there.";
    if(S.home&&x===S.home.x+1&&y===S.home.y+2)return 'Keep the doorway clear.';if(S.isle&&x===S.isle.x+1&&y===S.isle.y+2)return 'Keep the doorway clear.';
    const c=campOf(),nearHome=S.home&&Math.hypot(x-(S.home.x+1),y-(S.home.y+1))<=CAMP_R,nearCamp=c&&Math.hypot(c.x-x,c.y-y)<=CAMP_R;
    if(!(nearHome||nearCamp||onIsle(x,y)))return c||S.home?'Too far from camp or home. Furniture goes within '+CAMP_R+' tiles.':'Furniture needs a camp (or a home) nearby.'}
  if((x===IR.dx&&y===IR.dy)||(x===HG.dx&&y===HG.dy))return 'Keep the doorway clear.';
  if(npcAt(x,y)||(B.x===x&&B.y===y)||enemyAt(x,y))return 'Something is in the way.';
  if(S.placed.some(p=>!isFurn(p)&&placedAt(x,y)===p)||furnAt(x,y,fp.flat)||gardenAt(x,y))return 'Something is already there.';
  return ''}
// where a piece goes: the footprint starts at the tile you face and reaches away from you
function furnPlan(id){const fp=furnFp(id),[fx,fy]=front(),f=P.f,x0=f==='l'?fx-fp.w+1:f==='r'?fx:fx-((fp.w-1)>>1),y0=f==='u'?fy-fp.h+1:f==='d'?fy:fy-((fp.h-1)>>1),t=[];
  for(let y=y0;y<y0+fp.h;y++)for(let x=x0;x<x0+fp.w;x++)t.push([x,y,furnWhy(id,x,y)]);
  return{x:x0,y:y0,w:fp.w,h:fp.h,tiles:t,glob:sail?'Step onto land first.':''}}
function placeFurn(id){const pl=furnPlan(id),why=pl.glob||(pl.tiles.find(q=>q[2])||[])[2];if(why){toast(why,2200);return say(why)}
  S.bag[id]--;if(!S.bag[id])delete S.bag[id];const p={id,x:pl.x,y:pl.y};if(ITEMS[id].furn.store)p.st={};S.placed.push(p);placing=null;say(ITEMS[id].n+' placed.');toast(ITEMS[id].n+' placed!');ui();save()}
const furnHeld=p=>p.st?Object.values(p.st).reduce((a,b)=>a+b,0):0;
function useFurn(p){const it=ITEMS[p.id],f=it.furn,opts=[];
  if(f.store)opts.push('Open');if(f.bed)opts.push('Sleep');opts.push('Move','Pick up','Cancel');
  menu(it.n,opts,o=>{
    if(o==='Open')openFurn(p);
    else if(o==='Sleep'){if(!atBed()&&!inRoom(P.x,P.y))return say('Stand next to the bed to sleep.');sleep()}
    else if(o==='Pick up'||o==='Move'){if(furnHeld(p))return say('Take everything out of it first.');if(!room(p.id))return bagFull();S.placed=S.placed.filter(q=>q!==p);add(p.id);
      if(o==='Move'){placing=p.id;ui();say('Choose a new spot, then tap Use.')}else{say(it.n+' picked up.');ui()}save()}})}
function openFurn(p){const s=ITEMS[p.id].furn.store;p.st=p.st||{};openStash(s.title||ITEMS[p.id].n,p.st,s.cap,()=>openFurn(p),s.only)}
// the picture: the prop, and on a rack the things it holds (up to three kinds, small)
const FIC={};
function furnIcon(id){if(FIC[id])return FIC[id];const c=document.createElement('canvas');c.width=c.height=24;icon(id,c);return FIC[id]=c}
function furnArt(p,cx,cy,t){const f=furnFp(p.id),sx=p.x*T-cx,sy=p.y*T-cy;drawProp({id:f.prop,rot:0,flip:0},sx,sy,(t/250)|0);
  if(p.st&&ITEMS[p.id].furn.store.only){const ids=Object.keys(p.st).filter(i=>p.st[i]>0&&ITEMS[i]).slice(0,f.w);g.imageSmoothingEnabled=false;ids.forEach((i,k)=>g.drawImage(furnIcon(i),Math.round(sx+k*T+1),Math.round(sy+1),14,14))}}
