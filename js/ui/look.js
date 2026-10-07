// ---------- character customization ----------
const pv=$('pv'),pg=pv.getContext('2d');let pvv='f';
function preview(){pg.clearRect(0,0,16,20);pg.fillStyle='#5aa83c';pg.fillRect(0,0,16,20);CharacterSprite.draw(pg,0,0,{...lo(LK),view:pvv,frame:0})}
pv.onclick=()=>{const v=['f','r','b','l'];pvv=v[(v.indexOf(pvv)+1)%4];preview()};
// mode 'start' (first launch, free), 'tailor' (clothes) or 'barber' (hair). The shops edit a copy (LK) and charge LOOK_PRICES for each field changed.
let lookMode='start',LK=S.look,LK0=null;
const LDEF={skin:0,hair:0,shirt:0,jk:1,hc:0,hat:'cap',jon:true,pack:true,hstyle:'short'},lkv=(o,k)=>o[k]===undefined?LDEF[k]:o[k];
const lookCost=()=>lookMode==='start'?0:Object.entries(LOOK_PRICES[lookMode]).reduce((a,[k,p])=>a+(lkv(LK,k)!==lkv(LK0,k)?p:0),0);
const LFIELDS={start:['skin','hair','shirt','jk','hc','hat','jon','pack','hstyle'],tailor:['shirt','jk','hc','hat','jon','pack'],barber:['hair','hstyle']};
function buildSw(){const el=$('sws'),L=LK,F=LFIELDS[lookMode],P=lookMode==='start'?{}:LOOK_PRICES[lookMode];el.innerHTML='';
  const tag=k=>P[k]?' ('+P[k]+'g)':'',changed=()=>{buildSw();preview();if(lookMode==='start')save()};
  [['skin','Skin','skin'],['hair','Hair','hair'],['shirt','Shirt','shirt'],['jacket','Jacket','jk'],['hat','Hat','hc']].filter(r=>F.includes(r[2])).forEach(([k,label,lk])=>{
    const r=document.createElement('div');r.className='sw';r.innerHTML='<span>'+label+'</span>';
    OPT[k].forEach((c,i)=>{const b=document.createElement('button');b.style.background=c;b.setAttribute('aria-label',label+' '+(i+1));
      if(lkv(L,lk)===i)b.className='sel';b.onclick=()=>{L[lk]=i;changed()};r.appendChild(b)});
    el.appendChild(r)});
  if(F.includes('hstyle')){const r=document.createElement('div');r.className='sw';r.style.cssText='flex-wrap:wrap;justify-content:center;max-width:300px';
    HSTYLES.forEach(h=>{const b=document.createElement('button');b.textContent=h;b.style.cssText='width:auto;height:auto;border-radius:6px;padding:6px 8px';if(lkv(L,'hstyle')===h)b.className='sel';b.onclick=()=>{L.hstyle=h;changed()};r.appendChild(b)});
    el.appendChild(r)}
  const t=document.createElement('div');t.className='sw';t.style.cssText='justify-content:center;flex-wrap:wrap';
  const hv=lkv(L,'hat');
  [['hat','Hat: '+hv+tag('hat'),()=>{const o=['cap','straw','none'];L.hat=o[(o.indexOf(hv)+1)%3]}],['jon','Jacket: '+(L.jon===false?'off':'on')+tag('jon'),()=>{L.jon=L.jon===false}],['pack','Pack: '+(L.pack===false?'off':'on')+tag('pack'),()=>{L.pack=L.pack===false}]].filter(r=>F.includes(r[0])).forEach(([k,n,f])=>{
    const b=document.createElement('button');b.textContent=n;b.style.cssText='width:auto;height:auto;border-radius:6px;padding:6px 8px';b.onclick=()=>{f();changed()};t.appendChild(b)});
  el.appendChild(t);
  const c=lookCost(),go=$('go');if(lookMode!=='start'){go.textContent=c?'Pay '+c+'g':'Done';go.disabled=S.gold<c;
    $('lookt').textContent=(lookMode==='tailor'?"Tailor's fittings":'Barber chair')+' · '+S.gold.toLocaleString()+'g'}}
function openLook(mode){lookMode=mode||'start';
  if(lookMode==='start'){LK=S.look;$('go').textContent='Set sail';$('go').disabled=false;$('lookt').textContent="Who's the fisher?";$('lookx').style.display='none'}
  else{LK=JSON.parse(JSON.stringify(S.look));LK0=JSON.parse(JSON.stringify(S.look));$('lookx').style.display='inline-block'}
  buildSw();preview();$('look').classList.add('open')}
$('lookx').onclick=()=>{$('look').classList.remove('open');$('lookx').style.display='none';say('Come back any time.')};
$('go').onclick=()=>{
  if(lookMode==='start'){$('look').classList.remove('open');S.seen=1;save();say('Walk down the pier to your boat, face it, and tap Use.');return}
  const c=lookCost();if(S.gold<c)return;S.gold-=c;S.look=LK;$('look').classList.remove('open');$('lookx').style.display='none';ui();save();
  say(c?(lookMode==='tailor'?'Wynn: Looking sharp!':'Fenwick: Lovely. Very dashing.'):'Nothing changed. No charge.')};
