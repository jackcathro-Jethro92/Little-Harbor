// ---------- the equipment screen (playtest #3, redrawn in batch F3 from Jack's sketch): helmet, armour and boots down the left; amulet, your picture and ring in the middle; weapon and the equipped tool on the right ----------
// Opens from the Bag's Equipment button, the Menu screen, or the E key. Tap a square to see what you own for it, then tap an item to wear it (or Take off). What you wear is drawn on your character everywhere (`playerLook` in
// js/render/sprites.js). Armour pieces add up their `fx.ward` (the share of damage they stop; Amulet of Warding counts too). The Equipped Tool box holds ONE tool at a time (S.eq.tool names its slot: rod, pickaxe, axe or knife): you have to
// put the tool you need in your hand here before you can use it (fish, chop, mine, cut). S.eq.rod / pickaxe / axe / knife still remember which version of each you prefer (the best one you bought), so choosing a pickaxe brings that one.
const EQ_SLOTS=[['helmet','Helmet'],['armour','Armour'],['boots','Boots'],['weapon','Weapon'],['amulet','Amulet'],['ring','Ring'],['tool','Equipped Tool']];
let eqPick=null;
const eqCurrent=sl=>sl==='tool'?(S.eq.tool?S.eq[S.eq.tool]:null):S.eq[sl];
const eqOwned=sl=>Object.keys(S.bag).filter(id=>count(id)&&ITEMS[id]&&(sl==='tool'?TOOLSLOTS.includes(slotOf(id)):slotOf(id)===sl)).sort((a,b)=>sl==='tool'?TOOLSLOTS.indexOf(slotOf(a))-TOOLSLOTS.indexOf(slotOf(b))||(ITEMS[a].price||0)-(ITEMS[b].price||0):(ITEMS[a].price||0)-(ITEMS[b].price||0));
function equipItem(id){const sl=slotOf(id);S.eq[sl]=id;if(TOOLSLOTS.includes(sl))S.eq.tool=sl;if(ITEMS[id].kind==='clothes')wearLook(id)}
function unequipItem(id){const sl=slotOf(id);if(TOOLSLOTS.includes(sl))S.eq.tool=null;else S.eq[sl]=null;if(ITEMS[id].kind==='clothes')takeOffLook(sl)}
const eqEffect=id=>{const it=ITEMS[id],f=it.fx||{};return it.kind==='weapon'?'Damage '+(it.damage||2):it.kind==='rod'?(it.wait<1?'Bites '+Math.round((1-it.wait)*100)+'% sooner':'A plain starter rod'):it.kind==='tool'?it.desc:f.ward?'Stops '+Math.round(f.ward*100)+'% of damage':f.speed?'Walk faster':it.desc||''};
function eqPortrait(){drawArt($('eqs-pt'),playerArt('f'),'#8ec0e8')}   // your detailed picture, wearing your armour
function drawEquip(){
  EQ_SLOTS.forEach(([sl,n])=>{const b=$('eq-'+sl),id=eqCurrent(sl),c=b.querySelector('canvas').getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,24,24);
    if(id&&ITEMS[id])icon(id,b.querySelector('canvas'));b.querySelector('span').textContent=id&&ITEMS[id]?ITEMS[id].n:'Empty';b.classList.toggle('sel',eqPick===sl)});
  eqPortrait();
  const w=eq('weapon');
  $('eqs-stats').innerHTML='<div><span>Damage stopped</span><b>'+Math.round(Math.min(.9,fx('ward'))*100)+'%</b></div><div><span>Weapon damage</span><b>'+(w?w.damage:2)+'</b></div><div><span>Health</span><b>'+Math.ceil(S.hp)+' / '+maxHp()+'</b></div>';
  const pk=$('eqs-pick');pk.innerHTML='';if(!eqPick)return;
  const sl=eqPick,name=EQ_SLOTS.find(q=>q[0]===sl)[1],owned=eqOwned(sl),cur=eqCurrent(sl);
  pk.innerHTML='<h4>'+name+': tap one to '+(sl==='tool'?'hold it':'wear it')+'</h4>';
  const row=(label,sub,right,on,fn)=>{const d=document.createElement('div');d.className='eqrow'+(on?' on':'');d.innerHTML='<div>'+label+'<small>'+sub+'</small></div><em>'+right+'</em>';d.onclick=fn;pk.appendChild(d)};
  owned.forEach(id=>row(ITEMS[id].n,eqEffect(id),isWorn(id)||(sl!=='tool'&&S.eq[sl]===id)?(sl==='tool'?'In hand':'Worn'):(sl==='tool'?'Hold':'Wear'),isWorn(id)||(sl!=='tool'&&S.eq[sl]===id),()=>{equipItem(id);ui();save();drawEquip()}));
  if(cur)row(sl==='tool'?'Put it away':'Take off',sl==='tool'?'Empty hands':'Put it back in your bag','',false,()=>{if(sl==='tool')S.eq.tool=null;else S.eq[sl]=null;ui();save();drawEquip()});
  if(!owned.length&&!cur){const d=document.createElement('div');d.className='eqrow';d.textContent=sl==='weapon'?'You have no weapon.':sl==='tool'?'You have no tools. Bram sells them.':sl==='ring'||sl==='amulet'?'You have no '+name.toLowerCase()+' yet. Lucie sells them in the Mountain Town.':'You have no '+name.toLowerCase()+' yet. Garrick sells armour in the Walled Settlement.';pk.appendChild(d)}}
function openEquip(){if(BATTLE||SCENE)return;eqPick=null;drawEquip();['bag','ch','skills','qs'].forEach(i=>$(i).classList.remove('open'));$('eqs').classList.add('open')}
const closeEquip=()=>{eqPick=null;$('eqs').classList.remove('open')};
EQ_SLOTS.forEach(([sl])=>{$('eq-'+sl).onclick=()=>{eqPick=eqPick===sl?null:sl;drawEquip()}});
$('eqs-back').onclick=closeEquip;$('ch-eq').onclick=()=>{closeCharacter();openEquip()};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();
  if($('eqs').classList.contains('open')){if(['escape','backspace','x','e'].includes(k)){e.preventDefault();if(eqPick){eqPick=null;drawEquip()}else closeEquip()}return}
  if(k==='e'&&![...document.querySelectorAll('.open')].length&&!e.ctrlKey&&!e.metaKey&&!e.altKey)openEquip()});
