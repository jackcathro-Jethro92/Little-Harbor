// ---------- bag screen ----------
const POCKETS=[{k:'fish',t:'INGREDIENTS',c:'#d8683c'},{k:'food',t:'CONSUMABLES',c:'#d8a43c'},{k:'mat',t:'MATERIALS',c:'#a8742f'},{k:'gear',t:'GEAR',c:'#4f9a5a'},{k:'equip',t:'EQUIPPED',c:'#4a74c0'}];
const SLOTS=[['rod','Rod'],['weapon','Weapon'],['pickaxe','Pickaxe'],['axe','Axe'],['knife','Knife']];
const ownedForSlot=sl=>Object.keys(S.bag).some(id=>count(id)&&ITEMS[id]&&slotOf(id)===sl);
let bp=0,bc=0,bpop=null;
const describe=id=>{const i=ITEMS[id];return i.kind==='rod'?(i.wait<1?'Bites '+Math.round((1-i.wait)*100)+'% sooner.':'A plain starter rod.'):i.kind==='boat'?(i.price?'Better odds of rare fish.':'Your trusty starter boat.'):i.desc};
function rowsOf(p){
  const k=POCKETS[p].k;
  if(k==='food')return [...LIST('food'),...LIST('potion')].filter(count).map(id=>({id,label:ITEMS[id].n,right:'x'+count(id),desc:ITEMS[id].kind==='food'?foodDesc(id)+' Sells for '+ITEMS[id].value+'g.':potionDesc(id)}));
  if(k==='mat')return LIST('material').filter(count).map(id=>({id,label:ITEMS[id].n,right:'x'+count(id),desc:ITEMS[id].desc}));
  if(k==='fish')return [...fishIds,...LIST('ingredient'),...LIST('forage')].filter(count).map(id=>({id,label:ITEMS[id].n,right:'x'+count(id),desc:ITEMS[id].kind==='fish'?'Worth '+ITEMS[id].value+' gold. Sell it to Odo, or cook it.':ITEMS[id].kind==='forage'?ITEMS[id].desc+' Sells for '+ITEMS[id].value+'g. You can plant it in a garden.':ITEMS[id].desc+' Cook it, or plant it in a garden.'}));
  if(k==='gear')return ['rod','weapon','tool','station','prefab','claim','garden'].flatMap(LIST).filter(count).map(id=>({id,label:ITEMS[id].n,right:S.eq[slotOf(id)]===id?'E':'',desc:describe(id)}));
  return SLOTS.filter(([sl])=>S.eq[sl]||ownedForSlot(sl)).map(([sl,n])=>({slot:sl,id:S.eq[sl],label:n,right:S.eq[sl]?ITEMS[S.eq[sl]].n+(sl==='weapon'&&S.coat?' (poison x'+S.coat+')':''):'---',desc:S.eq[sl]?describe(S.eq[sl]):'Nothing equipped.'}));
}
function drawBag(){
  const P=POCKETS[bp],rows=rowsOf(bp),L=$('blist');bc=Math.max(0,Math.min(bc,rows.length-1));
  $('bag').style.setProperty('--acc',P.c);$('btitle').textContent=P.t;$('bcap').textContent='Gold '+S.gold.toLocaleString()+'g';bagArt(P.c);
  L.innerHTML='';
  if(!rows.length){const d=document.createElement('div');d.className='brow dim';const kk=POCKETS[bp].k;d.textContent=kk==='fish'?'No ingredients yet. Go fishing or visit Odo!':kk==='food'?'No food yet. Cook something at a campfire!':kk==='mat'?'No materials yet. Chop trees and mine ore!':'Nothing here yet.';L.appendChild(d)}
  rows.forEach((r,i)=>{const d=document.createElement('div');d.className='brow'+(i===bc?' cur':'');
    d.innerHTML='<span class="bcur">▶</span><span class="bn">'+r.label+'</span><span class="br">'+r.right+'</span>';
    d.onclick=()=>{if(bc===i)bagPick();else{bc=i;drawBag()}};L.appendChild(d)});
  const r=rows[bc];icon(r&&r.id);$('btxt').textContent=r?r.desc:'';
  const c=L.querySelector&&L.querySelector('.cur');if(c&&c.scrollIntoView)c.scrollIntoView({block:'nearest'});
}
function popRender(){const p=$('bpop');p.innerHTML='';if(!bpop){p.classList.remove('open');return}
  bpop.opts.forEach((o,i)=>{const d=document.createElement('div');d.className='brow'+(i===bpop.i?' cur':'');d.innerHTML='<span class="bcur">▶</span><span class="bn">'+o+'</span>';d.onclick=()=>{bpop.i=i;popChoose()};p.appendChild(d)});
  p.classList.add('open')}
function bagPick(){
  const r=rowsOf(bp)[bc];const pk=POCKETS[bp].k;if(!r||pk==='fish'||pk==='mat'||(pk==='equip'&&!r.id))return;
  if(pk==='food'){const it=ITEMS[r.id];bpop={opts:[it.kind==='food'?'Eat':it.coat?'Apply to weapon':'Drink','Cancel'],i:0,row:r};return popRender()}
  if(ITEMS[r.id]&&['station','prefab','claim','garden'].includes(ITEMS[r.id].kind)){bpop={opts:['Place','Cancel'],i:0,row:r};return popRender()}
  const sl=r.slot||slotOf(r.id),on=S.eq[sl]===r.id,opts=[];
  if(!on)opts.push('Equip');else if(sl!=='rod'&&sl!=='boat')opts.push('Unequip');
  opts.push('Cancel');bpop={opts,i:0,row:r};popRender()}
function popChoose(){const o=bpop.opts[bpop.i],r=bpop.row,sl=r.slot||slotOf(r.id);
  if(o==='Eat'){bpop=null;popRender();return eat(r.id)}
  if(o==='Drink'||o==='Apply to weapon'){bpop=null;popRender();return drink(r.id)}
  if(o==='Place'){bpop=null;popRender();closeBag();placing=r.id;return say('Face a clear tile and tap Use to place it. Open the Bag to cancel.')}
  if(o==='Equip')S.eq[sl]=r.id;if(o==='Unequip')S.eq[sl]=null;
  bpop=null;popRender();ui();save();drawBag()}
function openBag(){placing=null;bp=0;bc=0;bpop=null;popRender();drawBag();$('bag').classList.add('open')}
function closeBag(){bpop=null;popRender();$('bag').classList.remove('open')}
const bagGo=d=>{bp=(bp+d+POCKETS.length)%POCKETS.length;bc=0;drawBag()};
$('bagbtn').onclick=openBag;$('bback').onclick=closeBag;$('bprev').onclick=()=>bagGo(-1);$('bnext').onclick=()=>bagGo(1);
addEventListener('keydown',e=>{if(!$('bag').classList.contains('open'))return;const k=e.key.toLowerCase();
  const up=k==='arrowup'||k==='w',dn=k==='arrowdown'||k==='s',lf=k==='arrowleft'||k==='a',rt=k==='arrowright'||k==='d',ok=k==='enter'||k===' ',back=k==='escape'||k==='backspace'||k==='x';
  if(!(up||dn||lf||rt||ok||back))return;e.preventDefault();
  if(bpop){if(up)bpop.i=Math.max(0,bpop.i-1);else if(dn)bpop.i=Math.min(bpop.opts.length-1,bpop.i+1);else if(ok)return popChoose();else if(back)bpop=null;popRender();return}
  if(up){bc--;drawBag()}else if(dn){bc++;drawBag()}else if(lf)bagGo(-1);else if(rt)bagGo(1);else if(ok)bagPick();else if(back)closeBag()});
