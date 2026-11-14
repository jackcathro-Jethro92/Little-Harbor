// ---------- the storage screen (playtest #5, P93): crates, chests of drawers, racks and ship storage ----------
// Two grids of item squares, like the Bag: what is stored on the left (on top in a narrow window) and your bag on the right, with a bar showing how full the storage is. Tap a square to choose it: its name
// shows below with Store 1 / Store all (from your bag) or Take 1 / Take all (from storage). Tapping a chosen square again moves one. Things you wear or hold, boats and quest keys stay with you.
// openStash(title, store, cap, again, only) is called by every storage piece (js/systems/shipboard.js, js/systems/furniture.js); `store` is the {item: count} object it keeps in the save.
let SH=null;   // {title, st, cap, only, sel:{side,id}}
const shUsed=()=>Object.values(SH.st).reduce((a,b)=>a+b,0);
const shStowable=id=>(S.bag[id]||0)-(Object.values(S.eq).includes(id)?1:0);
function shBagIds(){return Object.keys(S.bag).filter(id=>ITEMS[id]&&!['boat','key'].includes(ITEMS[id].kind)&&(!SH.only||ITEMS[id].kind===SH.only)&&shStowable(id)>0)}
function shInIds(){return Object.keys(SH.st).filter(id=>SH.st[id]>0&&ITEMS[id])}
function openStashGrid(title,st,cap,only){const keep=SH&&SH.st===st?SH.sel:null;SH={title,st,cap,only,sel:keep};['store','bag'].forEach(i=>$(i).classList.remove('open'));shDraw();$('stash').classList.add('open')}
function shCell(id,n,side){const d=document.createElement('button');d.className='bcell'+(SH.sel&&SH.sel.side===side&&SH.sel.id===id?' cur':'');d.dataset.id=id;d.title=ITEMS[id].n;
  const c=document.createElement('canvas');c.width=c.height=24;icon(id,c);d.appendChild(c);const b=document.createElement('i');b.className='bn';b.textContent=n;d.appendChild(b);
  d.onclick=()=>{if(SH.sel&&SH.sel.side===side&&SH.sel.id===id){side==='in'?shTake(id,1):shPut(id,1);return}SH.sel={side,id};shDraw()};return d}
function shDraw(){const used=shUsed(),ins=shInIds(),bag=shBagIds();
  $('sh-title').textContent=SH.title;$('sh-num').textContent=used+' / '+SH.cap;$('sh-fill').style.width=Math.min(100,Math.round(used/SH.cap*100))+'%';
  if(SH.sel&&!(SH.sel.side==='in'?ins:bag).includes(SH.sel.id))SH.sel=null;
  const gi=$('sh-in'),gb=$('sh-bag');gi.innerHTML='';gb.innerHTML='';
  ins.forEach(id=>gi.appendChild(shCell(id,SH.st[id],'in')));bag.forEach(id=>gb.appendChild(shCell(id,shStowable(id),'bag')));
  if(!ins.length)gi.innerHTML='<p class="sh-none">Empty. Tap something in your bag to put it in.</p>';
  if(!bag.length)gb.innerHTML='<p class="sh-none">'+(SH.only?'Only '+SH.only+'s go here.':'Nothing to store.')+' Things you wear or hold stay with you.</p>';
  const tx=$('sh-txt'),bt=$('sh-btns'),cv=$('sh-di'),c=cv.getContext('2d');c.clearRect(0,0,24,24);bt.innerHTML='';
  const btn=(label,dis,fn)=>{const b=document.createElement('button');b.textContent=label;b.disabled=dis;b.onclick=fn;bt.appendChild(b)};
  if(!SH.sel){tx.innerHTML='<b>Tap a square</b><br>Pick something to store or to take out.';return}
  const id=SH.sel.id,it=ITEMS[id];icon(id,cv);
  if(SH.sel.side==='in'){tx.innerHTML='<b>'+it.n+'</b> x'+SH.st[id]+'<br>In storage.';btn('Take 1',false,()=>shTake(id,1));btn('Take all',false,()=>shTake(id,SH.st[id]))}
  else{const free=SH.cap-used,n=shStowable(id);tx.innerHTML='<b>'+it.n+'</b> x'+n+'<br>'+(free<1?'The storage is full.':'In your bag.');btn('Store 1',free<1,()=>shPut(id,1));btn('Store all',free<1,()=>shPut(id,Math.min(n,free)))}}
function shPut(id,n){n=Math.min(n,SH.cap-shUsed(),shStowable(id));if(n<1)return say('The storage is full.');S.bag[id]-=n;if(!S.bag[id])delete S.bag[id];SH.st[id]=(SH.st[id]||0)+n;ui();save();shDraw()}
function shTake(id,n){n=maxRoom(id,Math.min(n,SH.st[id]||0));if(!n)return bagFull();SH.st[id]-=n;if(!SH.st[id])delete SH.st[id];add(id,n);ui();save();shDraw()}
const closeStash=()=>{$('stash').classList.remove('open');SH=null};
$('sh-close').onclick=closeStash;
addEventListener('keydown',e=>{if(!$('stash').classList.contains('open'))return;const k=e.key.toLowerCase();
  if(['escape','backspace','x'].includes(k)){e.preventDefault();closeStash()}
  else if(k==='enter'||k===' '){e.preventDefault();if(SH.sel)SH.sel.side==='in'?shTake(SH.sel.id,1):shPut(SH.sel.id,1)}});
