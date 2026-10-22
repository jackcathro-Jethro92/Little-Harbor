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
// ---------- the new character maker (batch H1): pick one of the six characters (HEROES, js/data/heroes.js) and type a name ----------
let heroSel=null;
function buildHeroPick(){['f','m'].forEach(sx=>{const row=$('hp-'+sx);row.innerHTML='';
  HEROES.filter(h=>h.sex===sx).forEach(h=>{const b=document.createElement('button');b.className='hp-card'+(heroSel===h.id?' sel':'');b.setAttribute('aria-label',h.n);
    const cv=document.createElement('canvas');cv.width=48;cv.height=72;b.appendChild(cv);
    const L=h.look,spec={...h.art,sex:h.sex,col:{skin:OPT.skin[L.skin],hair:OPT.hair[L.hair],shirt:OPT.shirt[L.shirt],jacket:OPT.jacket[L.jk],hat:OPT.hat[L.hc||0],eye:h.art.eye,pants:h.art.pants,boots:h.art.boots}};
    drawArt(cv,heroCanvas('hero_'+h.id,spec,'f'),'#8ec0e8');
    b.onclick=()=>{heroSel=h.id;buildHeroPick();heroReady()};row.appendChild(b)})})}
const heroName=()=>($('hp-name').value||'').replace(/\s+/g,' ').trim().slice(0,12);
function heroReady(){const ok=!!heroSel&&heroName().length>0;$('go').disabled=!ok;$('hp-note').textContent=!heroSel?'Tap a character to choose them.':!heroName()?'Now type a name.':'Ready? Tap Set sail.';return ok}
$('hp-name').addEventListener('input',heroReady);$('hp-name').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&heroReady())$('go').click()});
function openLook(mode){lookMode=mode||'start';
  $('look').classList.toggle('start',lookMode==='start');
  if(lookMode==='start'){heroSel=S.hero;$('hp-name').value=S.name||'';$('go').textContent='Set sail';$('lookt').textContent="Who's the fisher?";$('lookx').style.display='none';buildHeroPick();heroReady();$('look').classList.add('open');return}
  else{LK=JSON.parse(JSON.stringify(S.look));LK0=JSON.parse(JSON.stringify(S.look));$('lookx').style.display='inline-block'}
  buildSw();preview();$('look').classList.add('open')}
$('lookx').onclick=()=>{$('look').classList.remove('open');$('lookx').style.display='none';say('Come back any time.')};
$('go').onclick=()=>{
  if(lookMode==='start'){if(!heroReady())return;const h=HEROES.find(q=>q.id===heroSel);S.hero=h.id;S.look=JSON.parse(JSON.stringify(h.look));S.name=heroName();$('look').classList.remove('open');S.seen=1;ui();save();say('Walk down the pier to your boat, face it, and tap Use.');setTimeout(()=>fireTriggers('start'),250);return}
  const c=lookCost();if(S.gold<c)return;S.gold-=c;S.look=LK;$('look').classList.remove('open');$('lookx').style.display='none';ui();save();
  say(c?(lookMode==='tailor'?'Wynn: Looking sharp!':'Fenwick: Lovely. Very dashing.'):'Nothing changed. No charge.')};
