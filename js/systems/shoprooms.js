// ---------- rooms built from interior designs (batch G1): shops with the shopkeeper behind a counter ----------
// Every design in INTERIOR_DESIGNS (js/data/interiors.js) is built as a hidden room in rows 300 and down (the map grew to 420 rows for them: slot i sits at x = (i mod 20) * 16, y = 300 + (i div 20) * 17, so the first 20 rooms are in the first
// band), and so is every shop in SHOP_ROOMS (an edited copy of a design). A room's zone number is 30 + its slot. Its tiles are one of ten floors (tile 184 to 193) and eight walls (194 to 201), a door (tile 23) in the bottom row where
// the design has its door prop, and its furniture is a list of props drawn over the tiles (js/render/props.js, drawn by draw()). A prop blocks the way unless it lies flat (rugs, mats): INTBLK marks the tiles that are in the way.
// Shops: facing the shop's door tile from the street and pressing Use walks you in (ENTR and HALLS in js/systems/guild.js do the work, as for the Fighters Guild); the shopkeeper moves inside and stands behind the counter. Facing the counter
// (or the tiles beside the shopkeeper) and pressing Use talks to them across it, and all the usual shop menus work. Facing the door from inside leads back out.
const INTR=[],INTBLK=new Uint8Array(MW*MH),FLOORT=Object.keys(PROPS.FLOORS),WALLT=Object.keys(PROPS.WALLS),INT_DOORS=['door','dbl','roomdoor'];
WK.push(...FLOORT.map((k,i)=>184+i));
const intrOf=(x,y)=>INTR.find(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);
function buildRoom(key,d,name){const i=INTR.length,rw=d.rw||11,rh=d.rh||13,x0=(i%20)*16,y0=300+((i/20)|0)*17,fl=184+Math.max(0,FLOORT.indexOf(d.floor)),wl=194+Math.max(0,WALLT.indexOf(d.wall));
  for(let y=0;y<rh;y++)for(let x=0;x<rw;x++)setT(x0+x,y0+y,y<3?wl:fl);
  const props=[],glows=[];let door=null;
  (d.props||[]).forEach(([id,px,py,mirror,turns])=>{const df=PROPS.DEF[id];if(!df)return;const rot=turns||0,[w,h]=propDim(id,rot);if(px<0||py<0||px+w>rw||py+h>rh)return;
    const p={id,x:px,y:py,flip:mirror?1:0,rot,w,h,ax:x0+px,ay:y0+py,flat:df.z===0};props.push(p);
    if(!p.flat)for(let j=0;j<h;j++)for(let k=0;k<w;k++)INTBLK[(p.ay+j)*MW+p.ax+k]=1;
    if(INT_DOORS.includes(id)&&py+h-1===rh-1){for(let k=0;k<w;k++)setT(p.ax+k,y0+rh-1,23);if(door===null)door=px}
    const gl=propGlow(p);if(gl)glows.push(gl)});
  if(door===null){door=rw>>1;setT(x0+door,y0+rh-1,23)}   // a design with no door gets one in the middle of the bottom row
  const room={z:30+i,x0,y0,x1:x0+rw-1,y1:y0+rh-1,dx:x0+door,kind:'shop',key,name,rw,rh,light:d.light||'day',props,glows};ROOMTAB.push(room);INTR.push(room);return room}
// every starter design gets a room (the testing menu visits them), then every shop gets its own (edited) copy
Object.entries(INTERIOR_DESIGNS).forEach(([key,d])=>buildRoom(key,d,d.n));
SHOP_ROOMS.forEach(sr=>{const base=SHOP_DESIGNS[sr.design]||INTERIOR_DESIGNS[sr.design],ed=sr.edit||{},props=(base.props||[]).filter(p=>!(ed.remove||[]).some(([id,x,y])=>p[0]===id&&p[1]===x&&p[2]===y)).concat(ed.add||[]),
  room=buildRoom('shop_'+sr.id,{...base,props},sr.name);sr.room=room;
  HALLS['shop_'+sr.id]={z:room,id:room.z,msg:sr.msg,name:sr.name};ENTR.push({x:sr.door[0],y:sr.door[1],to:'shop_'+sr.id,out:[sr.door[0],sr.door[1]+1]});
  // the shopkeeper moves inside, behind the counter: the tile just north of the middle of the table prop, or the nearest free one along it
  const n=NPC.find(q=>q.n===sr.npc),tb=room.props.find(p=>p.id===sr.table);
  if(n&&tb){const free=(x,y)=>y>room.y0+2&&!INTBLK[y*MW+x]&&WK.includes(at(x,y)),cx=tb.ax+(tb.w>>1);let spot=null;
    for(const dx of[0,-1,1,-2,2,-3,3,-4,4])for(const dy of[-1,-2])if(!spot&&tb.ax<=cx+dx&&cx+dx<tb.ax+tb.w&&free(cx+dx,tb.ay+dy))spot=[cx+dx,tb.ay+dy];
    if(!spot)for(let y=tb.ay-1;y>room.y0+2&&!spot;y--)for(let x=room.x0;x<=room.x1&&!spot;x++)if(free(x,y))spot=[x,y];
    if(spot){n.x=n.hx=spot[0];n.y=n.hy=spot[1];n.f='d';n.shopRoom=sr.id}}});
// taverns: the innkeeper rents out rooms (INN_PRICE gold a night). Each guest room is built after all the shops (so no shop's room ever moves); its door leads back down into the tavern
const INN_PRICE=100;
SHOP_ROOMS.filter(sr=>sr.inn).forEach(sr=>{const n=NPC.find(q=>q.n===sr.npc),tav=sr.room;if(!n)return;n.inn=sr.inn.map(([label,design])=>{const key='inn_'+sr.id+'_'+design,g=buildRoom(key,SHOP_DESIGNS[design]||INTERIOR_DESIGNS[design],label+' ('+sr.name+')');g.guest=true;
  HALLS[key]={z:g,id:g.z,msg:'The innkeeper shows you up to your room. Sleep in the bed to rest.',name:label};ENTR.push({x:-1,y:-1,to:key,out:[tav.dx,tav.y1-1],back:'You step back down into the tavern.'});return{label,key}})});
const inInn=()=>{const r=!sail&&zoneOf(P.x,P.y)>=30?intrOf(P.x,P.y):null;return!!(r&&r.guest)};
function innMenu(n){const sr=SHOP_ROOMS.find(s=>s.id===n.shopRoom);
  menu(sr.name,[...n.inn.map(r=>r.label+' ('+INN_PRICE+'g)'),'Talk','Cancel'],o=>{const r=n.inn.find(q=>o===q.label+' ('+INN_PRICE+'g)');
    if(r){if(S.gold<INN_PRICE)return say('A night costs '+INN_PRICE+' gold, friend.');S.gold-=INN_PRICE;fade();const z=HALLS[r.key].z;P.x=P.rx=z.dx;P.y=P.ry=z.y1-1;P.f='u';say(HALLS[r.key].msg);toast(r.label);ui();save()}
    else if(o==='Talk'){n.i=((n.i||0)+1)%n.say.length;dlgSay(n.n,n.say[n.i])}})}
// talking across the counter: when the tile you face is in the way (a counter or table) and the shopkeeper stands just beyond it (or beside the spot straight beyond it), you talk to them
function counterNpc(x,y){if(!INTBLK[y*MW+x]||sail)return null;const[dx,dy]=D[P.f],bx=x+dx,by=y+dy;
  return npcAt(bx,by)||(dx?npcAt(bx,by-1)||npcAt(bx,by+1):npcAt(bx-1,by)||npcAt(bx+1,by))||null}
// the rooms' light (the designer's four moods) and a way to visit a room from the testing menu
let ROOMLIGHT=null;
function roomLight(room,cx,cy,t){const m=room.light;if(m==='day')return;if(!ROOMLIGHT){ROOMLIGHT=document.createElement('canvas');ROOMLIGHT.width=VW;ROOMLIGHT.height=VH}
  const a={dusk:'rgba(255,150,70,.20)',night:'rgba(8,14,48,.62)',warm:'rgba(70,24,0,.34)'}[m]||'rgba(0,0,0,0)',c=ROOMLIGHT.getContext('2d'),ox=room.x0*T-cx,oy=room.y0*T-cy;
  c.globalCompositeOperation='source-over';c.clearRect(0,0,VW,VH);c.fillStyle=a;c.fillRect(0,0,VW,VH);
  if(m!=='dusk'){c.globalCompositeOperation='destination-out';room.glows.forEach(l=>{const x=ox+l.x,y=oy+l.y,q=c.createRadialGradient(x,y,2,x,y,l.r);q.addColorStop(0,'rgba(0,0,0,1)');q.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=q;c.fillRect(x-l.r,y-l.r,l.r*2,l.r*2)})}
  g.drawImage(ROOMLIGHT,0,0);g.globalCompositeOperation='lighter';
  room.glows.forEach(l=>{const x=ox+l.x,y=oy+l.y,q=g.createRadialGradient(x,y,2,x,y,l.r);q.addColorStop(0,l.c.replace('A','.30'));q.addColorStop(1,l.c.replace('A','0'));g.fillStyle=q;g.fillRect(x-l.r,y-l.r,l.r*2,l.r*2)});g.globalCompositeOperation='source-over'}
function visitRoom(room){sail=false;P.x=P.rx=room.dx;P.y=P.ry=room.y1-1;P.f='u';ui()}
