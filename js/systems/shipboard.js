// ---------- aboard the sloop, schooner and brig: the deck, your quarters (a bed to sleep in) and the storage room (crates) ----------
// While you sail one of these ships the helmsman is not drawn (only the rowboat shows you). The Deck button takes you down onto the deck (a hidden room, see js/world/shiprooms.js); the boat stays
// where it is at sea. Use the ship's wheel to take the helm again, the bed to sleep (same as sleeping on the boat) and any crate to put things in the ship's storage or take them out. The space is
// the boat's `store` number (sloop 40, schooner 100, brig 240 things), shared by all its crates, saved in S.ships[ship].store ({item id: count}).
const shipLevel=()=>SHIPNAMES.indexOf(S.eq.boat);                       // -1 for the rowboat
const shipHidesPlayer=()=>sail&&shipLevel()>=0;                          // used by draw(): no character on the bigger boats
const shipRoomOf=(x,y)=>ROOMTAB.find(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);
const inShipRoom=(x,y)=>!!shipRoomOf(x,y);
function boardDeck(){if(!sail||shipLevel()<0)return;const r=SHIPR[S.eq.boat].deck;cancel();fade();sail=false;P.x=P.rx=r.dx;P.y=P.ry=r.y1-2;P.f='u';
  say('You climb down onto the deck. Use the wheel to take the helm again.');toast(ITEMS[S.eq.boat].n+': deck');ui()}
function takeHelm(){fade();P.x=P.rx=B.x;P.y=P.ry=B.y;P.f='d';sail=true;say('You take the helm.');ui()}
function shipStore(ship){S.ships=S.ships||{};const o=S.ships[ship]=S.ships[ship]||{store:{}};o.store=o.store||{};return o.store}
function openStorage(ship){const el=$('items'),cap=ITEMS[ship].store,st=shipStore(ship),used=()=>Object.values(st).reduce((a,b)=>a+b,0);
  $('st').textContent=ITEMS[ship].n+' storage · '+used()+'/'+cap;el.innerHTML='';
  const head=t=>{const r=document.createElement('div');r.className='it';r.innerHTML='<div><b>'+t+'</b></div>';el.appendChild(r)};
  const row=(title,sub,btns)=>{const r=document.createElement('div');r.className='it';r.innerHTML='<div><b>'+title+'</b>'+(sub?'<br>'+sub:'')+'</div>';btns.forEach(([label,dis,fn])=>{const b=document.createElement('button');b.textContent=label;b.disabled=dis;b.onclick=fn;r.appendChild(b)});el.appendChild(r)};
  head('In storage');
  const ids=Object.keys(st).filter(id=>st[id]>0);if(!ids.length)row('Empty','Put things in from your bag below.',[]);
  ids.forEach(id=>row(ITEMS[id].n+' x'+st[id],'',[['Take 1',false,()=>{take(id,1)}],['Take all',false,()=>{take(id,st[id])}]]));
  head('Your bag');
  const equipped=id=>Object.values(S.eq).includes(id),stowable=id=>(S.bag[id]||0)-(equipped(id)?1:0);
  const bag=Object.keys(S.bag).filter(id=>ITEMS[id]&&ITEMS[id].kind!=='boat'&&stowable(id)>0);if(!bag.length)row('Nothing to store','Equipped things stay with you.',[]);
  bag.forEach(id=>{const free=cap-used(),n=stowable(id);row(ITEMS[id].n+' x'+n,'',[['Store 1',free<1,()=>{put(id,1)}],['Store all',free<1,()=>{put(id,Math.min(n,free))}]])});
  function put(id,n){S.bag[id]-=n;if(!S.bag[id])delete S.bag[id];st[id]=(st[id]||0)+n;ui();save();openStorage(ship)}
  function take(id,n){st[id]-=n;if(!st[id])delete st[id];add(id,n);ui();save();openStorage(ship)}
  $('store').classList.add('open')}
function bedSleep(){const r=shipRoomOf(P.x,P.y);if(!r||r.kind!=='quarters')return say('Nowhere to sleep here. Try your quarters.');sleep()}
function shipUse(tt){const r=shipRoomOf(P.x,P.y);if(!r)return false;
  if(tt===128){takeHelm();return true}
  if(tt===129){bedSleep();return true}
  if(tt===130){openStorage(r.ship);return true}
  if(tt===127){say('The mast is thick as a tree.');return true}
  if(tt===137){say('Charts, logbooks and a few worn novels.');return true}
  if(tt===139){say('A locked chest, bolted to the floor. Use the crates to store things.');return true}
  return false}
$('deck').addEventListener('click',boardDeck);
