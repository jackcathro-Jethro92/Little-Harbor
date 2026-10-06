// ---------- crafting screen (the keyboard handler below also drives the pop-up menu) ----------
let crSt=null,crSel=0;
const recipesAt=()=>RECIPES.filter(r=>r.station===crSt||(crSt==='cooking'&&r.station==='fire')),canMake=r=>Object.entries(r.needs).every(([id,n])=>count(id)>=n)&&(!r.gold||S.gold>=r.gold)&&!(r.unique&&count(r.out));
function openCraft(st){crSt=st;crSel=0;drawCraft();$('craft').classList.add('open')}
const closeCraft=()=>$('craft').classList.remove('open');
function drawCraft(){
  const rs=recipesAt(),L=$('cr-list');$('cr-title').textContent=({bench:'WORKBENCH',forge:'FORGE',fire:'CAMPFIRE',cooking:'COOKING STATION',shipwright:'SHIPWRIGHT',alchemy:'ALCHEMY STATION'})[crSt];L.innerHTML='';
  rs.forEach((r,i)=>{const d=document.createElement('div');d.className='crow'+(i===crSel?' cur':'')+(canMake(r)?'':' no');
    d.innerHTML='<span class="bcur">▶</span><span class="bn">'+ITEMS[r.out].n+'</span><span>x'+r.n+'</span>';d.onclick=()=>{crSel=i;drawCraft()};L.appendChild(d)});
  const r=rs[crSel];
  $('cr-det').innerHTML=r?'<b>'+ITEMS[r.out].n+'</b> x'+r.n+'<br>'+(ITEMS[r.out].desc||foodDesc(r.out))+'<br>Needs: '+Object.entries(r.needs).map(([id,n])=>'<span class="'+(count(id)>=n?'ok':'lack')+'">'+ITEMS[id].n+' '+count(id)+'/'+n+'</span>').join(' &middot; ')+(r.gold?' &middot; <span class="'+(S.gold>=r.gold?'ok':'lack')+'">Gold '+S.gold.toLocaleString()+'/'+r.gold.toLocaleString()+'</span>':'')+(r.unique&&count(r.out)?' &middot; <span class="ok">Already built</span>':''):'';
  $('cr-go').disabled=!(r&&canMake(r))}
function doCraft(){const r=recipesAt()[crSel];if(!r||!canMake(r))return;
  for(const[id,n]of Object.entries(r.needs)){S.bag[id]-=n;if(!S.bag[id])delete S.bag[id]}
  if(r.gold)S.gold-=r.gold;let n=r.n;if(!r.skill&&!r.unique&&Math.random()<.03*lvl('crafting'))n++;add(r.out,n);
  if(ITEMS[r.out].kind==='boat'){S.eq.boat=r.out;say('You built the '+ITEMS[r.out].n.toLowerCase()+' and set it as your boat! Switch boats any time at Rue\'s boatyard.');toast('Ship built!',2600)}
  else say((r.skill==='cooking'?'Cooked ':r.skill==='alchemy'?'Brewed ':'Crafted ')+ITEMS[r.out].n+' x'+n+'.');ui();gainXp(r.skill||'crafting',r.xp);save();drawCraft()}
$('cr-go').onclick=doCraft;$('cr-back').onclick=closeCraft;
addEventListener('keydown',e=>{const k=e.key.toLowerCase(),up=k==='arrowup'||k==='w',dn=k==='arrowdown'||k==='s',ok=k==='enter'||k===' ',back=k==='escape'||k==='x'||k==='backspace';
  if(mn){if(mn.fresh)return;if(!(up||dn||ok||back))return;e.preventDefault();
    if(up)mn.i=Math.max(0,mn.i-1);else if(dn)mn.i=Math.min(mn.opts.length-1,mn.i+1);else if(ok)return menuPick();else if(back){mn=null;$('menu').classList.remove('open');return}
    return menuRender()}
  if($('craft').classList.contains('open')){if(!(up||dn||ok||back))return;e.preventDefault();
    if(up){crSel=Math.max(0,crSel-1);drawCraft()}else if(dn){crSel=Math.min(recipesAt().length-1,crSel+1);drawCraft()}else if(ok)doCraft();else closeCraft()}});
