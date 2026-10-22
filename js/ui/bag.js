// ---------- bag screen (batch F1): sections down the left, a grid of item squares on the right (Jack's sketch of the Bag / Vendors menu) ----------
// A section lists the kinds of item it holds (`list` gives the item ids in tier order). Tap a square to select it (its name and words show below); tap it again, or press Enter, for what you can do with it
// (Eat, Drink, Place, Equip, Unequip, Read). Equipped things stay in the grid with an E on them. The Equipment button opens the equipment screen.
const SECTIONS=[
 {k:'home',t:'Home Items',c:'#7a8f4a',list:()=>['station','prefab','claim','garden','furniture'].flatMap(LIST),none:'Nothing for the home yet. The carpenter sells furniture.'},
 {k:'ingr',t:'Ingredients',c:'#d8683c',list:()=>[...fishIds,...LIST('ingredient'),...LIST('forage')],none:'No ingredients yet. Go fishing or visit Odo!'},
 {k:'mat',t:'Materials',c:'#a8742f',list:()=>LIST('material'),none:'No materials yet. Chop trees and mine ore!'},
 {k:'food',t:'Food',c:'#d8a43c',list:()=>[...LIST('food'),...LIST('potion')],none:'No food yet. Cook something at a campfire!'},
 {k:'weap',t:'Weapons',c:'#8a5a5a',list:()=>LIST('weapon'),none:'No weapons.'},
 {k:'cloth',t:'Clothing',c:'#4f7ac0',list:()=>[...LIST('armour'),...LIST('jewel')],none:'No clothing or jewellery yet.'},
 {k:'tool',t:'Tools',c:'#4f9a5a',list:()=>[...LIST('rod'),...LIST('tool')],none:'No tools.'},
 {k:'keep',t:'Keepsakes',c:'#b99a6a',list:()=>LIST('key'),letters:1,none:'No letters or keepsakes yet.'}];
const SLOTS=[['rod','Rod'],['weapon','Weapon'],['pickaxe','Pickaxe'],['axe','Axe'],['knife','Knife'],['ring','Ring'],['amulet','Amulet'],['helmet','Helmet'],['armour','Armour'],['boots','Boots']];
let bs=0,bc=0,bpop=null;   // the section, the selected square
const BAGCOLS=5;
const describe=id=>{const i=ITEMS[id];return i.kind==='rod'?(i.wait<1?'Bites '+Math.round((1-i.wait)*100)+'% sooner.':'A plain starter rod.'):i.kind==='boat'?(i.price?'Better odds of rare fish.':'Your trusty starter boat.'):i.desc};
function cellDesc(id){const it=ITEMS[id];
  if(it.kind==='fish')return 'Worth '+it.value+' gold. Sell it to Odo, or cook it.';
  if(it.kind==='forage')return it.desc+' Sells for '+it.value+'g. You can plant it in a garden.';
  if(it.kind==='ingredient')return it.desc+' Cook it, or plant it in a garden.';
  if(it.kind==='food')return foodDesc(id)+' Sells for '+it.value+'g.';
  if(it.kind==='potion')return potionDesc(id);
  return describe(id)}
// the squares of a section: {id, label, n, eq, desc} (or {letter, label, desc} for a letter)
function cellsOf(si){const s=SECTIONS[si],eqd=isWorn;
  const cells=s.list().filter(count).map(id=>({id,label:ITEMS[id].n,n:count(id),eq:eqd(id),desc:cellDesc(id)+(eqd(id)?' (Equipped)':'')}));
  if(s.letters)myLetters().filter(id=>LETTERS[id]).forEach(id=>cells.push({letter:id,label:LETTERS[id].title||id,n:1,desc:(LETTERS[id].from?'From '+LETTERS[id].from+'. ':'')+'Tap to read it again.'}));
  return cells}
function drawBag(){
  const s=SECTIONS[bs],cells=cellsOf(bs),tabs=$('btabs'),grid=$('bgrid');bc=Math.max(0,Math.min(bc,cells.length-1));
  $('bag').style.setProperty('--acc',s.c);$('btitle').textContent='BAG '+slotsUsed()+'/'+bagSlots();$('bcap').textContent='Gold '+S.gold.toLocaleString()+'g';$('btitle').classList.toggle('full',slotsUsed()>=bagSlots());
  tabs.innerHTML='';SECTIONS.forEach((q,i)=>{const b=document.createElement('button');b.className='btab'+(i===bs?' cur':'');b.textContent=q.t;b.onclick=()=>{bpop=null;popRender();bs=i;bc=0;drawBag()};tabs.appendChild(b)});
  grid.innerHTML='';
  if(!cells.length){const d=document.createElement('div');d.className='bnone';d.textContent=s.none;grid.appendChild(d)}
  cells.forEach((r,i)=>{const d=document.createElement('button');d.className='bcell'+(i===bc?' cur':'');d.title=r.label;
    const cv=document.createElement('canvas');cv.width=cv.height=16;d.appendChild(cv);
    if(r.id)icon(r.id,cv);else{const x=cv.getContext('2d');x.fillStyle='#383838';x.fillRect(2,3,12,10);x.fillStyle='#f8f4dc';x.fillRect(3,4,10,8);x.fillStyle='#383838';x.fillRect(2,3,12,1);x.fillRect(3,5,5,1);x.fillRect(3,7,8,1);x.fillRect(3,9,6,1)}
    if(r.n>1){const n=document.createElement('i');n.className='bn';n.textContent=r.n;d.appendChild(n)}
    if(r.eq){const e=document.createElement('i');e.className='be';e.textContent='E';d.appendChild(e)}
    d.onclick=()=>{if(bc===i)bagPick();else{bpop=null;popRender();bc=i;drawBag()}};grid.appendChild(d)});
  const r=cells[bc];if(r&&r.id)icon(r.id);else $('bdi').getContext('2d').clearRect(0,0,16,16);
  $('btxt').innerHTML=r?'<b>'+r.label+(r.n>1?' x'+r.n:'')+'</b><br>'+r.desc:'';
  const c=grid.querySelector('.cur');if(c&&c.scrollIntoView)c.scrollIntoView({block:'nearest'});
}
function popRender(){const p=$('bpop');p.innerHTML='';if(!bpop){p.classList.remove('open');return}
  bpop.opts.forEach((o,i)=>{const d=document.createElement('div');d.className='brow'+(i===bpop.i?' cur':'');d.innerHTML='<span class="bcur">▶</span><span class="bn">'+o+'</span>';d.onclick=()=>{bpop.i=i;popChoose()};p.appendChild(d)});
  p.classList.add('open')}
function bagPick(){
  const r=cellsOf(bs)[bc];if(!r)return;if(r.letter)return openLetter(r.letter);
  const it=ITEMS[r.id];if(it.kind==='key')return;   // key items just sit in the bag: nothing to equip or use
  if(it.kind==='food'||it.kind==='potion'){bpop={opts:[it.kind==='food'?'Eat':it.coat?'Apply to weapon':'Drink','Cancel'],i:0,row:r};return popRender()}
  if(['station','prefab','claim','garden','furniture'].includes(it.kind)){bpop={opts:['Place','Cancel'],i:0,row:r};return popRender()}
  if(!['rod','weapon','tool','jewel','armour'].includes(it.kind))return;   // fish, materials and the like: nothing to do
  const sl=slotOf(r.id);
  const on=isWorn(r.id),opts=[];
  if(!on)opts.push('Equip');else opts.push('Unequip');
  opts.push('Cancel');bpop={opts,i:0,row:r};popRender()}
function popChoose(){const o=bpop.opts[bpop.i],r=bpop.row,sl=slotOf(r.id);
  if(o==='Eat'){bpop=null;popRender();return eat(r.id)}
  if(o==='Drink'||o==='Apply to weapon'){bpop=null;popRender();return drink(r.id)}
  if(o==='Place'){bpop=null;popRender();closeBag();placing=r.id;return say('Face a clear tile and tap Use to place it. Open the Bag to cancel.')}
  if(o==='Equip')equipItem(r.id);if(o==='Unequip')unequipItem(r.id);
  bpop=null;popRender();ui();save();drawBag()}
function openBag(){placing=null;bs=0;bc=0;bpop=null;popRender();drawBag();$('bag').classList.add('open')}
function closeBag(){bpop=null;popRender();$('bag').classList.remove('open')}
const bagGo=d=>{bpop=null;popRender();bs=(bs+d+SECTIONS.length)%SECTIONS.length;bc=0;drawBag()};
$('bagbtn').onclick=openBag;$('bback').onclick=closeBag;$('beq').onclick=()=>{closeBag();openEquip()};
addEventListener('keydown',e=>{if(!$('bag').classList.contains('open'))return;const k=e.key.toLowerCase();
  const up=k==='arrowup'||k==='w',dn=k==='arrowdown'||k==='s',lf=k==='arrowleft'||k==='a',rt=k==='arrowright'||k==='d',ok=k==='enter'||k===' ',back=k==='escape'||k==='backspace'||k==='x',pv=k==='q'||(k==='tab'&&e.shiftKey),nx=k==='e'||(k==='tab'&&!e.shiftKey);
  if(!(up||dn||lf||rt||ok||back||pv||nx))return;e.preventDefault();
  if(bpop){if(up)bpop.i=Math.max(0,bpop.i-1);else if(dn)bpop.i=Math.min(bpop.opts.length-1,bpop.i+1);else if(ok)return popChoose();else if(back)bpop=null;popRender();return}
  if(pv)bagGo(-1);else if(nx)bagGo(1);else if(lf){bc--;drawBag()}else if(rt){bc++;drawBag()}else if(up){bc=Math.max(0,bc-BAGCOLS);drawBag()}else if(dn){bc+=BAGCOLS;drawBag()}else if(ok)bagPick();else if(back)closeBag()});
