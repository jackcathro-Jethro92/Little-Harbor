// ---------- shops: Odo's General Store, Bram's Tackle & Tools, Rue's Boatyard ----------
const sellPrice=id=>{const i=ITEMS[id];return i.kind==='ingredient'?Math.floor(i.price/2):i.value};
function openGeneral(mode){
  const el=$('items'),buy=mode==='buy';el.innerHTML='';$('st').textContent="Odo's General Store · "+S.gold.toLocaleString()+'g';
  const row=(t,d,label,dis,fn)=>{const r=document.createElement('div');r.className='it';r.innerHTML='<div><b>'+t+'</b><br>'+d+'</div>';const b=document.createElement('button');b.textContent=label;b.disabled=dis;b.onclick=fn;r.appendChild(b);el.appendChild(r)};
  row(buy?'Buying':'Selling',buy?'Fresh produce and meat.':'Odo buys fish, ingredients and cooked meals.',buy?'Sell':'Buy',false,()=>openGeneral(buy?'sell':'buy'));
  if(buy)LIST('ingredient').forEach(id=>{const it=ITEMS[id];row(it.n,it.desc+' (you have '+count(id)+')',it.price+'g',S.gold<it.price,()=>{S.gold-=it.price;add(id);ui();save();say('Odo: Here you go.');openGeneral('buy')})});
  else{let n=0;const fc=fishCount();
    if(fc){n++;row('All fish','Sell all '+fc+' fish you are carrying.',fishValue()+'g',false,()=>{const v=fishValue();S.gold+=v;fishIds.forEach(i=>delete S.bag[i]);ui();save();say('Odo: '+fc+' fish for '+v+' gold. Pleasure!');openGeneral('sell')})}
    [...LIST('fish'),...LIST('ingredient'),...LIST('forage'),...LIST('food')].filter(count).forEach(id=>{n++;const it=ITEMS[id],pr=sellPrice(id);
      row(it.n+' x'+count(id),'Sells for '+pr+'g each.','Sell 1',false,()=>{S.gold+=pr;S.bag[id]--;if(!S.bag[id])delete S.bag[id];ui();save();say('Odo: Sold '+it.n.toLowerCase()+' for '+pr+'g.');openGeneral('sell')})});
    if(!n)row('Nothing to sell','Bring fish, ingredients or cooked meals.','-',true,()=>{})}
  $('store').classList.add('open')}
function openStore(k){
  const rod=k==='rod',kind=rod?'rod':'boat',L=LIST(kind),own=ownTier(kind),el=$('items');
  $('st').textContent=(rod?"Bram's Tackle & Tools":"Rue's Boatyard")+' · '+S.gold.toLocaleString()+'g';el.innerHTML='';
  if(!rod&&L.filter(count).length===1){const n=document.createElement('div');n.className='it';n.innerHTML='<div>Rue: You only own the one boat, friend. Nothing to switch yet.</div>';el.appendChild(n)}
  L.forEach((id,i)=>{const it=ITEMS[id],r=document.createElement('div');r.className='it';
    const d=i?(rod?'Bites '+Math.round((1-it.wait)*100)+'% sooner':'Better odds of rare fish'):'Your starter gear';
    r.innerHTML='<div><b>'+it.n+'</b><br>'+d+'</div>';
    const b=document.createElement('button');
    if(rod?i<=own:count(id)>0){if(rod){b.textContent='Owned';b.disabled=true}else if(S.eq.boat===id){b.textContent='In use';b.disabled=true}else{b.textContent='Use';b.onclick=()=>{S.eq.boat=id;ui();save();say('Rue: Now sailing the '+it.n.toLowerCase()+'.');openStore(k)}}}
    else{b.textContent=it.price.toLocaleString()+'g';b.disabled=rod?!(i===own+1&&S.gold>=it.price):S.gold<it.price;
      b.onclick=()=>{S.gold-=it.price;add(id);S.eq[kind]=id;ui();save();say('Bought the '+it.n.toLowerCase()+'!');openStore(k)}}
    r.appendChild(b);el.appendChild(r)});
  if(rod)LIST('weapon').concat(LIST('tool')).filter(id=>!ITEMS[id].smith).forEach(id=>{const it=ITEMS[id],r=document.createElement('div');r.className='it';
    r.innerHTML='<div><b>'+it.n+'</b><br>'+it.desc+'</div>';
    const b=document.createElement('button');
    if(count(id)){b.textContent='Owned';b.disabled=true}
    else{b.textContent=it.price+'g';b.disabled=S.gold<it.price;b.onclick=()=>{S.gold-=it.price;add(id);if(!S.eq[slotOf(id)])S.eq[slotOf(id)]=id;ui();save();say('Bought the '+it.n.toLowerCase()+'!');openStore(k)}}
    r.appendChild(b);el.appendChild(r)});
  [...LIST('station'),...LIST('claim'),...LIST('garden')].filter(id=>rod?ITEMS[id].place!=='shipwright':ITEMS[id].place==='shipwright').forEach(id=>{const it=ITEMS[id],r=document.createElement('div');r.className='it';
    r.innerHTML='<div><b>'+it.n+'</b><br>'+it.desc+'</div>';const b=document.createElement('button');
    if(count(id)||S.placed.some(p=>p.id===id)||(it.kind==='claim'&&S.claim)){b.textContent='Owned';b.disabled=true}
    else{b.textContent=it.price+'g';b.disabled=S.gold<it.price;b.onclick=()=>{S.gold-=it.price;add(id);ui();save();say('Bought the '+it.n.toLowerCase()+'!');openStore(k)}}
    r.appendChild(b);el.appendChild(r)});
  $('store').classList.add('open');
}
$('sclose').onclick=()=>$('store').classList.remove('open');
// ---------- Garrick's Forge: the blacksmith in the Walled Settlement (stock is in js/data/shops.js) ----------
function openSmith(mode){
  const el=$('items'),buy=mode==='buy';el.innerHTML='';$('st').textContent="Garrick's Forge · "+S.gold.toLocaleString()+'g';
  const row=(t,d,label,dis,fn)=>{const r=document.createElement('div');r.className='it';r.innerHTML='<div><b>'+t+'</b>'+(d?'<br>'+d:'')+'</div>';if(label){const b=document.createElement('button');b.textContent=label;b.disabled=dis;b.onclick=fn;r.appendChild(b)}el.appendChild(r)};
  row(buy?'Buying':'Selling',buy?'Metal, blades and tools.':'Garrick buys metal and timber at half price.',buy?'Sell':'Buy',false,()=>openSmith(buy?'sell':'buy'));
  SMITH.forEach(([title,list])=>{
    if(buy){row(title);list.forEach(([id,price])=>{const it=ITEMS[id],single=it.kind==='weapon'||it.kind==='tool',owned=single?count(id)>0:it.kind==='station'&&(count(id)||S.placed.some(p=>p.id===id));
      row(it.n,(it.desc||'')+(single||it.kind==='station'?'':' (you have '+count(id)+')'),owned?'Owned':price.toLocaleString()+'g',owned||S.gold<price,()=>{S.gold-=price;add(id);if(single&&!S.eq[slotOf(id)])S.eq[slotOf(id)]=id;ui();save();say('Garrick: A fine choice.');openSmith('buy')})})}
    else if(title==='Materials'){let n=0;list.filter(([id])=>count(id)).forEach(([id,price])=>{n++;const it=ITEMS[id],pr=Math.floor(price/2);
      row(it.n+' x'+count(id),'Sells for '+pr+'g each.','Sell 1',false,()=>{S.gold+=pr;S.bag[id]--;if(!S.bag[id])delete S.bag[id];ui();save();say('Garrick: Sold '+it.n.toLowerCase()+' for '+pr+'g.');openSmith('sell')})});
      if(!n)row('Nothing to sell','Bring ore, iron bars, planks or rope.','',true,()=>{})}});
  $('store').classList.add('open')}
