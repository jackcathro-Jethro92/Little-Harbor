// ---------- character customization ----------
const pv=$('pv'),pg=pv.getContext('2d');let pvv='f';
function preview(){pg.clearRect(0,0,16,20);pg.fillStyle='#5aa83c';pg.fillRect(0,0,16,20);CharacterSprite.draw(pg,0,0,{...lo(S.look),view:pvv,frame:0})}
pv.onclick=()=>{const v=['f','r','b','l'];pvv=v[(v.indexOf(pvv)+1)%4];preview()};
function buildSw(){const el=$('sws'),L=S.look;el.innerHTML='';
  [['skin','Skin','skin'],['hair','Hair','hair'],['shirt','Shirt','shirt'],['jacket','Jacket','jk'],['hat','Hat','hc']].forEach(([k,label,lk])=>{
    const r=document.createElement('div');r.className='sw';r.innerHTML='<span>'+label+'</span>';
    OPT[k].forEach((c,i)=>{const b=document.createElement('button');b.style.background=c;b.setAttribute('aria-label',label+' '+(i+1));
      if((L[lk]===undefined?(lk==='jk'?1:0):L[lk])===i)b.className='sel';b.onclick=()=>{L[lk]=i;buildSw();preview();save()};r.appendChild(b)});
    el.appendChild(r)});
  const t=document.createElement('div');t.className='sw';t.style.justifyContent='center';
  const hv=L.hat===undefined?'cap':L.hat;
  [['Hat: '+hv,()=>{const o=['cap','straw','none'];L.hat=o[(o.indexOf(hv)+1)%3]}],['Jacket: '+(L.jon===false?'off':'on'),()=>{L.jon=L.jon===false}],['Pack: '+(L.pack===false?'off':'on'),()=>{L.pack=L.pack===false}]].forEach(([n,f])=>{
    const b=document.createElement('button');b.textContent=n;b.style.cssText='width:auto;height:auto;border-radius:6px;padding:6px 8px';b.onclick=()=>{f();buildSw();preview();save()};t.appendChild(b)});
  el.appendChild(t)}
function openLook(){buildSw();preview();$('look').classList.add('open')}
$('go').onclick=()=>{$('look').classList.remove('open');S.seen=1;save();say('Walk down the pier to your boat, face it, and tap Use.')};
