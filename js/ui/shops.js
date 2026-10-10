// ---------- shops: Odo's General Store, Bram's Tackle & Tools, Murl's Boatyard ----------
const sellPrice=id=>{const i=ITEMS[id];return i.kind==='ingredient'?Math.floor(i.price/2):i.value};
// shop sub-menus (roadmap N5): every shop row is tagged with a category (r.dataset.cat); shopTabs() adds a row of buttons for the categories (Rods, Tools, Weapons ... / Fish, Forage, Meals ...)
// and shows only the chosen one. The choice is remembered per shop and mode. Rows with no category (the Buying / Selling switch, notes) always show.
const SHOPCAT={};
function shopTabs(el,key){const rows=[...el.querySelectorAll('.it[data-cat]')],cats=[...new Set(rows.map(r=>r.dataset.cat).filter(Boolean))];if(cats.length<2)return;
  const cur=cats.includes(SHOPCAT[key])?SHOPCAT[key]:cats[0],bar=document.createElement('div');bar.className='tabs';
  cats.forEach(c=>{const b=document.createElement('button');b.textContent=c;b.className=c===cur?'sel':'';b.onclick=()=>{SHOPCAT[key]=c;shopTabs.redo&&shopTabs.redo()};bar.appendChild(b)});
  rows.forEach(r=>{if(r.dataset.cat&&r.dataset.cat!==cur)r.style.display='none'});
  const first=el.firstElementChild;if(first&&first.nextSibling)el.insertBefore(bar,first.nextSibling);else el.appendChild(bar)}
function openGeneral(mode){
  const el=$('items'),buy=mode==='buy';el.innerHTML='';$('st').textContent="Odo's General Store · "+S.gold.toLocaleString()+'g';let cat='';
  const row=(t,d,label,dis,fn)=>{const r=document.createElement('div');r.className='it';if(cat)r.dataset.cat=cat;r.innerHTML='<div><b>'+t+'</b><br>'+d+'</div>';const b=document.createElement('button');b.textContent=label;b.disabled=dis;b.onclick=fn;r.appendChild(b);el.appendChild(r)};
  row(buy?'Buying':'Selling',buy?'Fresh produce and meat.':'Odo buys fish, ingredients and cooked meals.',buy?'Sell':'Buy',false,()=>openGeneral(buy?'sell':'buy'));
  if(buy)LIST('ingredient').forEach(id=>{const it=ITEMS[id];row(it.n,it.desc+' (you have '+count(id)+')',it.price+'g',S.gold<it.price,()=>{S.gold-=it.price;add(id);ui();save();say('Odo: Here you go.');openGeneral('buy')})});
  else{let n=0;const fc=fishCount();
    cat='Fish';if(fc){n++;row('All fish','Sell all '+fc+' fish you are carrying.',fishValue()+'g',false,()=>{const v=fishValue();S.gold+=v;fishIds.forEach(i=>delete S.bag[i]);ui();save();say('Odo: '+fc+' fish for '+v+' gold. Pleasure!');openGeneral('sell')})}
    [...LIST('fish'),...LIST('ingredient'),...LIST('forage'),...LIST('food')].filter(count).forEach(id=>{n++;const it=ITEMS[id],pr=sellPrice(id);cat=ITEMS[id].kind==='fish'?'Fish':ITEMS[id].kind==='ingredient'?'Ingredients':ITEMS[id].kind==='forage'?'Forage':'Meals';
      row(it.n+' x'+count(id),'Sells for '+pr+'g each.','Sell 1',false,()=>{S.gold+=pr;S.bag[id]--;if(!S.bag[id])delete S.bag[id];ui();save();say('Odo: Sold '+it.n.toLowerCase()+' for '+pr+'g.');openGeneral('sell')})});
    cat='';if(!n)row('Nothing to sell','Bring fish, ingredients or cooked meals.','-',true,()=>{})}
  shopTabs.redo=()=>openGeneral(mode);shopTabs(el,'general:'+mode);$('store').classList.add('open')}
function openStore(k){
  const rod=k==='rod',kind=rod?'rod':'boat',L=LIST(kind),own=ownTier(kind),el=$('items'),tag=(r,c)=>{r.dataset.cat=c;return r};
  $('st').textContent=(rod?"Bram's Tackle & Tools":"Murl's Boatyard")+' · '+S.gold.toLocaleString()+'g';el.innerHTML='';
  if(!rod&&L.filter(count).length===1){const n=tag(document.createElement('div'),'Boats');n.className='it';n.innerHTML='<div>Murl: You only own the one boat, friend. Nothing to switch yet.</div>';el.appendChild(n)}
  L.forEach((id,i)=>{const it=ITEMS[id],r=tag(document.createElement('div'),rod?'Rods':'Boats');r.className='it';
    const d=i?(rod?'Bites '+Math.round((1-it.wait)*100)+'% sooner':'Better odds of rare fish'):'Your starter gear';
    r.innerHTML='<div><b>'+it.n+'</b><br>'+d+'</div>';
    const b=document.createElement('button');
    if(rod?i<=own:count(id)>0){if(rod){b.textContent='Owned';b.disabled=true}else if(S.eq.boat===id){b.textContent='In use';b.disabled=true}else{b.textContent='Use';b.onclick=()=>{S.eq.boat=id;ui();save();say('Murl: Now sailing the '+it.n.toLowerCase()+'.');openStore(k)}}}
    else{b.textContent=it.price.toLocaleString()+'g';b.disabled=rod?!(i===own+1&&S.gold>=it.price):S.gold<it.price;
      b.onclick=()=>{S.gold-=it.price;add(id);S.eq[kind]=id;ui();save();say('Bought the '+it.n.toLowerCase()+'!');openStore(k)}}
    r.appendChild(b);el.appendChild(r)});
  if(rod)LIST('weapon').concat(LIST('tool')).filter(id=>!ITEMS[id].smith).forEach(id=>{const it=ITEMS[id],r=tag(document.createElement('div'),ITEMS[id].kind==='weapon'?'Weapons':'Tools');r.className='it';
    r.innerHTML='<div><b>'+it.n+'</b><br>'+it.desc+'</div>';
    const b=document.createElement('button');
    if(count(id)){b.textContent='Owned';b.disabled=true}
    else{b.textContent=it.price+'g';b.disabled=S.gold<it.price;b.onclick=()=>{S.gold-=it.price;add(id);if(!S.eq[slotOf(id)])S.eq[slotOf(id)]=id;ui();save();say('Bought the '+it.n.toLowerCase()+'!');openStore(k)}}
    r.appendChild(b);el.appendChild(r)});
  [...LIST('station'),...LIST('claim'),...LIST('garden')].filter(id=>rod?ITEMS[id].place!=='shipwright':ITEMS[id].place==='shipwright').forEach(id=>{const it=ITEMS[id],r=tag(document.createElement('div'),rod?'Home':'Yard');r.className='it';
    r.innerHTML='<div><b>'+it.n+'</b><br>'+it.desc+'</div>';const b=document.createElement('button');
    if(count(id)||S.placed.some(p=>p.id===id)||(it.kind==='claim'&&S.claim)){b.textContent='Owned';b.disabled=true}
    else{b.textContent=it.price+'g';b.disabled=S.gold<it.price;b.onclick=()=>{S.gold-=it.price;add(id);ui();save();say('Bought the '+it.n.toLowerCase()+'!');openStore(k)}}
    r.appendChild(b);el.appendChild(r)});
  shopTabs.redo=()=>openStore(k);shopTabs(el,'store:'+k);$('store').classList.add('open');
}
$('sclose').onclick=()=>$('store').classList.remove('open');
// ---------- traders with a stock table (SHOPS in js/data/shops.js): Garrick's Forge, Lucie's Gold & Gems ----------
const openSmith=m=>openTrader('smith',m);
function openTrader(key,mode){
  const sh=SHOPS[key],el=$('items'),buy=mode==='buy';el.innerHTML='';$('st').textContent=sh.name+' · '+S.gold.toLocaleString()+'g';let cat='';
  const row=(t,d,label,dis,fn)=>{const r=document.createElement('div');r.className='it';if(cat)r.dataset.cat=cat;r.innerHTML='<div><b>'+t+'</b>'+(d?'<br>'+d:'')+'</div>';if(label){const b=document.createElement('button');b.textContent=label;b.disabled=dis;b.onclick=fn;r.appendChild(b)}el.appendChild(r)};
  row(buy?'Buying':'Selling',buy?sh.buyTag:sh.sellTag,buy?'Sell':'Buy',false,()=>openTrader(key,buy?'sell':'buy'));
  let n=0;
  sh.list.forEach(([title,list])=>{
    if(buy&&(sh.noBuy||[]).includes(title))return;
    if(buy){cat=title;list.forEach(([id,price])=>{const it=ITEMS[id],single=['weapon','tool','jewel'].includes(it.kind),owned=single?count(id)>0:it.kind==='station'&&(count(id)||S.placed.some(p=>p.id===id));
      row(it.n,(it.desc||'')+(single||it.kind==='station'?'':' (you have '+count(id)+')'),owned?'Owned':price.toLocaleString()+'g',owned||S.gold<price,()=>{S.gold-=price;add(id);if(single&&!S.eq[slotOf(id)])S.eq[slotOf(id)]=id;ui();save();say(sh.who+': '+sh.thanks);openTrader(key,'buy')})})}
    else if(sh.sell.includes(title)){cat=title;list.filter(([id])=>count(id)).forEach(([id,price])=>{n++;const it=ITEMS[id],pr=Math.floor(price/2);
      row(it.n+' x'+count(id),'Sells for '+pr.toLocaleString()+'g each.','Sell 1',false,()=>{S.gold+=pr;S.bag[id]--;if(!S.bag[id]){delete S.bag[id];if(S.eq[slotOf(id)]===id)S.eq[slotOf(id)]=null}ui();save();say(sh.who+': Sold '+it.n.toLowerCase()+' for '+pr.toLocaleString()+'g.');openTrader(key,'sell')})})}});
  cat='';if(!buy&&!n)row('Nothing to sell',sh.none,'',true,()=>{});
  shopTabs.redo=()=>openTrader(key,mode);shopTabs(el,key+':'+mode);$('store').classList.add('open')}
