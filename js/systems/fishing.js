// ---------- fishing ----------
let fs=0,ft=[],cur=null,prog=0,sg=0;
function cancel(){ft.forEach(clearTimeout);ft=[];fs=0}
function pick(){const L=lvl('fishing'),W=fishIds.map((id,i)=>ITEMS[id].rarity*(1+L*.08*i)),tot=W.reduce((a,b)=>a+b);let r=Math.random()*tot;for(let i=0;i<W.length;i++){if(r<W[i])return fishIds[i];r-=W[i]}return fishIds[0]}
function hook(){
  cancel();const bt=tier('boat');cur=pick();
  if(bt&&Math.random()<.3*bt){const c=pick();if(ITEMS[c].value>ITEMS[cur].value)cur=c}
  land();
}
function land(){const f=ITEMS[cur];add(cur);cancel();say('Landed a '+f.n.toLowerCase()+'! Worth about '+f.value+' gold.');gainXp('fishing',f.xp);ui();save()}
