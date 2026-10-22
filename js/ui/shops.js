// ---------- shops: Odo's General Store, Bram's Tackle & Tools, Murl's Boatyard ----------
const sellPrice=id=>{const i=ITEMS[id];return i.kind==='ingredient'?Math.floor(i.price/2):i.value};
// shop sub-menus (roadmap N5): every shop row is tagged with a category (r.dataset.cat); shopTabs() adds a row of buttons for the categories (Rods, Tools, Weapons ... / Fish, Forage, Meals ...)
// and shows only the chosen one. The choice is remembered per shop and mode. Rows with no category (the Buying / Selling switch, notes) always show.
const SHOPCAT={};
function shopTabs(el,key){const all=[...el.querySelectorAll('.it')],rows=[...el.querySelectorAll('.it[data-cat]')],cats=[...new Set(rows.map(r=>r.dataset.cat).filter(Boolean))];if(cats.length<2){shopLayout(el,key,all);return}
  const cur=cats.includes(SHOPCAT[key])?SHOPCAT[key]:cats[0],bar=document.createElement('div');bar.className='tabs';
  cats.forEach(c=>{const b=document.createElement('button');b.textContent=c;b.className=c===cur?'sel':'';b.onclick=()=>{SHOPCAT[key]=c;shopTabs.redo&&shopTabs.redo()};bar.appendChild(b)});
  rows.forEach(r=>{if(r.dataset.cat&&r.dataset.cat!==cur)r.style.display='none'});
  const first=el.firstElementChild;if(first&&first.nextSibling)el.insertBefore(bar,first.nextSibling);else el.appendChild(bar);shopLayout(el,key,all)}
// ---------- the Vendors screen (batch F2, from Jack's sketch): sections down the left, a grid of item squares, and the chosen one's words and buttons below ----------
// The shop functions above still build their list of rows (#items, now hidden): a row is {title, words, button(s)} tagged with its section (data-cat) and item (data-id). shopLayout reads those rows and draws them as squares;
// the buttons below a square press the row's own buttons, so buying and selling work exactly as before. The Buying / Selling switch becomes the bar across the top. What was chosen is remembered per shop (SHOPSEL).
const SHOPSEL={};
function shopLayout(el,key,rows){
  const bt=r=>r.querySelector('b')?r.querySelector('b').textContent:'',sw=rows.find(r=>!r.dataset.cat&&/^(Buying|Selling)$/.test(bt(r))),items=rows.filter(r=>r!==sw&&r.querySelector('button')),ct=r=>r.dataset.cat||'Goods',
    cats=[...new Set(items.map(ct))],cur=cats.includes(SHOPCAT[key])?SHOPCAT[key]:cats[0],mine=items.filter(r=>ct(r)===cur),notes=rows.filter(r=>r!==sw&&!r.querySelector('button')&&(!r.dataset.cat||r.dataset.cat===cur));
  const sel=SHOPSEL[key]&&SHOPSEL[key].cat===cur?Math.min(SHOPSEL[key].i,mine.length-1):0;
  $('store').classList.add('grid');
  const swb=$('sswitch');swb.innerHTML='';
  if(sw){const b=document.createElement('button'),real=sw.querySelector('button');b.textContent=bt(sw)+' · tap to '+real.textContent.toLowerCase();b.onclick=()=>real.click();swb.appendChild(b)}
  notes.forEach(n=>{const d=document.createElement('div');d.className='snote';d.textContent=n.textContent;swb.appendChild(d)});
  const tabs=$('stabs');tabs.innerHTML='';cats.forEach(c=>{const b=document.createElement('button');b.className='btab'+(c===cur?' cur':'');b.textContent=c;b.onclick=()=>{SHOPCAT[key]=c;SHOPSEL[key]={cat:c,i:0};shopTabs.redo&&shopTabs.redo()};tabs.appendChild(b)});
  const grid=$('sgrid');grid.innerHTML='';
  const words=r=>{const d=r.firstElementChild.cloneNode(true),b=d.querySelector('b');if(b)b.remove();const br=d.querySelector('br');if(br)br.remove();return d.textContent};
  mine.forEach((r,i)=>{const d=document.createElement('button'),m=bt(r).match(/^(.*) x(\d+)$/),btn=r.querySelector('button'),dead=btn&&btn.disabled;d.className='bcell'+(i===sel?' cur':'')+(dead?' dim':'');d.title=m?m[1]:bt(r);
    const cv=document.createElement('canvas');cv.width=cv.height=16;d.appendChild(cv);
    if(r.dataset.id&&ITEMS[r.dataset.id])icon(r.dataset.id,cv);else{const x=cv.getContext('2d');x.fillStyle='#383838';x.fillRect(4,3,8,10);x.fillRect(3,4,10,8);x.fillStyle='#f2c14e';x.fillRect(4,4,8,8);x.fillStyle='#d9a441';x.fillRect(7,6,2,4)}
    if(m){const n=document.createElement('i');n.className='bn';n.textContent=m[2];d.appendChild(n)}
    if(btn&&/^(Owned|In use|Aboard)$/.test(btn.textContent)){const n=document.createElement('i');n.className='be';n.textContent='✓';d.appendChild(n)}
    d.onclick=()=>{SHOPSEL[key]={cat:cur,i};shopLayout(el,key,rows)};grid.appendChild(d)});
  if(!mine.length){const d=document.createElement('div');d.className='bnone';d.textContent=(notes[0]?notes[0].textContent:'Nothing here.');grid.appendChild(d)}
  const r=mine[sel],cv=$('sdi'),x=cv.getContext('2d');x.clearRect(0,0,16,16);$('sbtns').innerHTML='';
  if(r){if(r.dataset.id&&ITEMS[r.dataset.id])icon(r.dataset.id,cv);const m=bt(r).match(/^(.*) x(\d+)$/);$('stxt').innerHTML='<b></b><br><span></span>';$('stxt').querySelector('b').textContent=m?m[1]+' x'+m[2]:bt(r);$('stxt').querySelector('span').textContent=words(r);
    [...r.querySelectorAll('button')].forEach(real=>{const b=document.createElement('button');b.textContent=real.textContent;b.disabled=real.disabled;b.onclick=()=>real.click();$('sbtns').appendChild(b)})}
  else $('stxt').textContent='';
}
function openGeneral(mode){
  const el=$('items'),buy=mode==='buy';el.innerHTML='';$('st').textContent="Odo's General Store · "+S.gold.toLocaleString()+'g';let cat='';
  const row=(t,d,label,dis,fn,id)=>{const r=document.createElement('div');r.className='it';if(cat)r.dataset.cat=cat;if(id)r.dataset.id=id;r.innerHTML='<div><b>'+t+'</b><br>'+d+'</div>';const b=document.createElement('button');b.textContent=label;b.disabled=dis;b.onclick=fn;r.appendChild(b);el.appendChild(r)};
  row(buy?'Buying':'Selling',buy?'Fresh produce and meat.':'Odo buys fish, ingredients and cooked meals.',buy?'Sell':'Buy',false,()=>openGeneral(buy?'sell':'buy'));
  if(buy)LIST('ingredient').forEach(id=>{const it=ITEMS[id];row(it.n,it.desc+' (you have '+count(id)+')',it.price+'g',S.gold<it.price,()=>{S.gold-=it.price;add(id);ui();save();say('Odo: Here you go.');openGeneral('buy')},id)});
  else{let n=0;const fc=fishCount();
    cat='Fish';if(fc){n++;row('All fish','Sell all '+fc+' fish you are carrying.',fishValue()+'g',false,()=>{const v=fishValue();S.gold+=v;fishIds.forEach(i=>delete S.bag[i]);ui();save();say('Odo: '+fc+' fish for '+v+' gold. Pleasure!');openGeneral('sell')},fishIds.find(count))}
    [...LIST('fish'),...LIST('ingredient'),...LIST('food')].filter(count).forEach(id=>{n++;const it=ITEMS[id],pr=sellPrice(id);cat=ITEMS[id].kind==='fish'?'Fish':ITEMS[id].kind==='ingredient'?'Ingredients':'Meals';
      row(it.n+' x'+count(id),'Sells for '+pr+'g each.','Sell 1',false,()=>{S.gold+=pr;S.bag[id]--;if(!S.bag[id])delete S.bag[id];ui();save();say('Odo: Sold '+it.n.toLowerCase()+' for '+pr+'g.');openGeneral('sell')},id)});
    cat='';if(!n)row('Nothing to sell','Bring fish, ingredients or cooked meals.','-',true,()=>{})}
  shopTabs.redo=()=>openGeneral(mode);shopTabs(el,'general:'+mode);$('store').classList.add('open')}
function openStore(k){
  const rod=k==='rod',kind=rod?'rod':'boat',L=LIST(kind),own=ownTier(kind),el=$('items'),tag=(r,c)=>{r.dataset.cat=c;return r};
  $('st').textContent=(rod?"Bram's Tackle & Tools":"Murl's Boatyard")+' · '+S.gold.toLocaleString()+'g';el.innerHTML='';
  if(!rod&&L.filter(count).length===1){const n=tag(document.createElement('div'),'Boats');n.className='it';n.innerHTML='<div>Murl: You only own the one boat, friend. Nothing to switch yet.</div>';el.appendChild(n)}
  L.forEach((id,i)=>{const it=ITEMS[id],r=tag(document.createElement('div'),rod?'Rods':'Boats');r.className='it';r.dataset.id=id;
    const d=i?(rod?'Bites '+Math.round((1-it.wait)*100)+'% sooner':'Better odds of rare fish. Needs '+crewNeed(id)+' crew (you count).'):'Your starter gear';
    r.innerHTML='<div><b>'+it.n+'</b><br>'+d+'</div>';
    const b=document.createElement('button');
    if(rod?i<=own:count(id)>0){if(rod){b.textContent='Owned';b.disabled=true}else if(S.eq.boat===id){b.textContent='In use';b.disabled=true}else if(!crewOk(id)){b.textContent='Need '+crewNeed(id)+' crew';b.disabled=true}else{b.textContent='Use';b.onclick=()=>{S.eq.boat=id;ui();save();say('Murl: Now sailing the '+it.n.toLowerCase()+'.');openStore(k)}}}
    else{b.textContent=it.price.toLocaleString()+'g';b.disabled=rod?!(i===own+1&&S.gold>=it.price):S.gold<it.price;
      b.onclick=()=>{S.gold-=it.price;add(id);const ok=rod||crewOk(id);if(ok)S.eq[kind]=id;ui();save();say(ok?'Bought the '+it.n.toLowerCase()+'!':'Bought the '+it.n.toLowerCase()+'. '+crewNote(id)+' Hire sailors here first.');openStore(k)}}
    r.appendChild(b);el.appendChild(r)});
  if(!rod){const h=document.createElement('div');h.className='it';h.dataset.cat='Crew';h.innerHTML='<div>Murl: Bigger ships need more hands. You count as one. Right now your crew is '+crewHave()+(crewList().length?' ('+crewList().map(c=>c.n).join(', ')+')':'')+'.</div>';el.appendChild(h);
    CREW.filter(c=>c.where==='boatyard').forEach(c=>{const r=document.createElement('div');r.className='it';r.dataset.cat='Crew';r.innerHTML='<div><b>'+c.n+'</b> · '+c.job+'<br>'+c.desc+'</div>';const b=document.createElement('button');
      if(flag(c.flag)){b.textContent='Aboard';b.disabled=true}else{b.textContent=c.price.toLocaleString()+'g';b.disabled=S.gold<c.price;b.onclick=()=>{S.gold-=c.price;setFlag(c.flag);ui();save();say('Murl: '+c.n+' will sail with you. Crew: '+crewHave()+'.');openStore(k)}}
      r.appendChild(b);el.appendChild(r)})}
  if(rod)LIST('tool').filter(id=>!ITEMS[id].smith&&!ITEMS[id].starter&&!ITEMS[id].reward&&(!SHOP_LOCKS[id]||flag(SHOP_LOCKS[id])||count(id)>0)).forEach(id=>{const it=ITEMS[id],r=tag(document.createElement('div'),ITEMS[id].kind==='weapon'?'Weapons':'Tools');r.className='it';r.dataset.id=id;
    r.innerHTML='<div><b>'+it.n+'</b><br>'+it.desc+'</div>';
    const b=document.createElement('button');
    if(count(id)){b.textContent='Owned';b.disabled=true}
    else{b.textContent=it.price+'g';b.disabled=S.gold<it.price;b.onclick=()=>{S.gold-=it.price;add(id);if(!S.eq[slotOf(id)])S.eq[slotOf(id)]=id;ui();save();say('Bought the '+it.n.toLowerCase()+'!');openStore(k)}}
    r.appendChild(b);el.appendChild(r)});
  [...LIST('station'),...LIST('claim'),...LIST('garden')].filter(id=>rod?ITEMS[id].place!=='shipwright':ITEMS[id].place==='shipwright').forEach(id=>{const it=ITEMS[id],r=tag(document.createElement('div'),rod?'Home':'Yard');r.className='it';r.dataset.id=id;
    r.innerHTML='<div><b>'+it.n+'</b><br>'+it.desc+'</div>';const b=document.createElement('button');
    if(count(id)||S.placed.some(p=>p.id===id&&!p.fixed)||(it.kind==='claim'&&S.claim)){b.textContent='Owned';b.disabled=true}
    else{b.textContent=it.price+'g';b.disabled=S.gold<it.price;b.onclick=()=>{S.gold-=it.price;add(id);ui();save();say('Bought the '+it.n.toLowerCase()+'!');openStore(k)}}
    r.appendChild(b);el.appendChild(r)});
  shopTabs.redo=()=>openStore(k);shopTabs(el,'store:'+k);$('store').classList.add('open');
}
$('sclose').onclick=()=>$('store').classList.remove('open');
// ---------- traders with a stock table (SHOPS in js/data/shops.js): Garrick's Forge, Lucie's Gold & Gems ----------
const openSmith=m=>openTrader('smith',m);
function openTrader(key,mode){
  const sh=SHOPS[key],el=$('items'),buy=mode==='buy';el.innerHTML='';$('st').textContent=sh.name+' · '+S.gold.toLocaleString()+'g';let cat='';
  const row=(t,d,label,dis,fn,id)=>{const r=document.createElement('div');r.className='it';if(cat)r.dataset.cat=cat;if(id)r.dataset.id=id;r.innerHTML='<div><b>'+t+'</b>'+(d?'<br>'+d:'')+'</div>';if(label){const b=document.createElement('button');b.textContent=label;b.disabled=dis;b.onclick=fn;r.appendChild(b)}el.appendChild(r)};
  row(buy?'Buying':'Selling',buy?sh.buyTag:sh.sellTag,buy?'Sell':'Buy',false,()=>openTrader(key,buy?'sell':'buy'));
  let n=0;
  sh.list.forEach(([title,list])=>{
    if(buy&&(sh.noBuy||[]).includes(title))return;
    if(buy){cat=title;list.forEach(([id,price])=>{const it=ITEMS[id],single=['weapon','tool','jewel','armour'].includes(it.kind),owned=single?count(id)>0:it.kind==='station'&&(count(id)||S.placed.some(p=>p.id===id&&!p.fixed));
      row(it.n,(it.desc||'')+(single||it.kind==='station'?'':' (you have '+count(id)+')'),owned?'Owned':price.toLocaleString()+'g',owned||S.gold<price,()=>{S.gold-=price;add(id);if(single&&!S.eq[slotOf(id)])S.eq[slotOf(id)]=id;ui();save();say(sh.who+': '+sh.thanks);openTrader(key,'buy')},id)})}
    else if(sh.sell.includes(title)){cat=title;list.filter(([id])=>count(id)).forEach(([id,price])=>{n++;const it=ITEMS[id],pr=Math.floor(price*((sh.rate||{})[title]||.5));
      row(it.n+' x'+count(id),'Sells for '+pr.toLocaleString()+'g each.','Sell 1',false,()=>{S.gold+=pr;S.bag[id]--;if(!S.bag[id]){delete S.bag[id];if(S.eq[slotOf(id)]===id){S.eq[slotOf(id)]=null;if(it.kind==='weapon'&&count('wooden_sword'))S.eq.weapon='wooden_sword'}}ui();save();say(sh.who+': Sold '+it.n.toLowerCase()+' for '+pr.toLocaleString()+'g.');openTrader(key,'sell')},id)})}});
  cat='';if(!buy&&!n)row('Nothing to sell',sh.none,'',true,()=>{});
  shopTabs.redo=()=>openTrader(key,mode);shopTabs(el,key+':'+mode);$('store').classList.add('open')}
