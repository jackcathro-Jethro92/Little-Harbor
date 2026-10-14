// ---------- the equipment screen (playtest #3): helmet, armour and boots down the left, your picture in the middle and the weapon on the right ----------
// Opens from the Menu screen ("Equipment"), the E key, or the first row of the Bag's EQUIPPED pocket. Tap a square to see what you own for it, then tap an item to wear it (or Take off). What you wear is drawn on your
// character everywhere (`playerLook` in js/render/sprites.js). Armour pieces add up their `fx.ward` (the share of damage they stop; Amulet of Warding counts too). Rods, tools, rings and amulets stay in the Bag's EQUIPPED pocket.
const EQ_SLOTS=[['helmet','Helmet'],['armour','Armour'],['boots','Boots'],['weapon','Weapon']];
let eqPick=null;
const eqEffect=id=>{const it=ITEMS[id],f=it.fx||{};return it.kind==='weapon'?'Damage '+(it.damage||2):f.ward?'Stops '+Math.round(f.ward*100)+'% of damage':f.speed?'Walk faster':''};
function eqPortrait(){const cv=$('eqs-pt'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);c.fillStyle='#8ec0e8';c.fillRect(0,0,cv.width,cv.height);
  c.drawImage(shadePerson({...playerLook(),view:'f',frame:0}),1,1,22,22,0,0,cv.width,cv.height)}
function drawEquip(){
  EQ_SLOTS.forEach(([sl,n])=>{const b=$('eq-'+sl),id=S.eq[sl],c=b.querySelector('canvas').getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,16,16);
    if(id&&ITEMS[id]){icon(id);c.drawImage($('bdi'),0,0)}b.querySelector('span').textContent=id&&ITEMS[id]?ITEMS[id].n:'Empty';b.classList.toggle('sel',eqPick===sl)});
  eqPortrait();
  const w=eq('weapon');
  $('eqs-stats').innerHTML='<div><span>Damage stopped</span><b>'+Math.round(Math.min(.9,fx('ward'))*100)+'%</b></div><div><span>Weapon damage</span><b>'+(w?w.damage:2)+'</b></div><div><span>Health</span><b>'+Math.ceil(S.hp)+' / '+maxHp()+'</b></div><p style="font-size:12px;margin:8px 0 0;text-align:center">Rods, tools, rings and amulets are in the Bag, under EQUIPPED.</p>';
  const pk=$('eqs-pick');pk.innerHTML='';if(!eqPick)return;
  const sl=eqPick,name=EQ_SLOTS.find(q=>q[0]===sl)[1],owned=Object.keys(S.bag).filter(id=>count(id)&&ITEMS[id]&&slotOf(id)===sl);
  pk.innerHTML='<h4>'+name+': tap one to wear it</h4>';
  const row=(label,sub,right,on,fn)=>{const d=document.createElement('div');d.className='eqrow'+(on?' on':'');d.innerHTML='<div>'+label+'<small>'+sub+'</small></div><em>'+right+'</em>';d.onclick=fn;pk.appendChild(d)};
  owned.sort((a,b)=>(ITEMS[a].price||0)-(ITEMS[b].price||0)).forEach(id=>row(ITEMS[id].n,eqEffect(id),S.eq[sl]===id?'Worn':'Wear',S.eq[sl]===id,()=>{S.eq[sl]=id;ui();save();drawEquip()}));
  if(S.eq[sl])row('Take off','Put it back in your bag','',false,()=>{S.eq[sl]=null;ui();save();drawEquip()});
  if(!owned.length&&!S.eq[sl]){const d=document.createElement('div');d.className='eqrow';d.textContent=sl==='weapon'?'You have no weapon.':'You have no '+name.toLowerCase()+' yet. Garrick sells armour in the Walled Settlement.';pk.appendChild(d)}}
function openEquip(){if(BATTLE||SCENE)return;eqPick=null;drawEquip();['bag','ch','skills','qs'].forEach(i=>$(i).classList.remove('open'));$('eqs').classList.add('open')}
const closeEquip=()=>{eqPick=null;$('eqs').classList.remove('open')};
EQ_SLOTS.forEach(([sl])=>{$('eq-'+sl).onclick=()=>{eqPick=eqPick===sl?null:sl;drawEquip()}});
$('eqs-back').onclick=closeEquip;$('ch-eq').onclick=()=>{closeCharacter();openEquip()};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();
  if($('eqs').classList.contains('open')){if(['escape','backspace','x','e'].includes(k)){e.preventDefault();if(eqPick){eqPick=null;drawEquip()}else closeEquip()}return}
  if(k==='e'&&![...document.querySelectorAll('.open')].length&&!e.ctrlKey&&!e.metaKey&&!e.altKey)openEquip()});
