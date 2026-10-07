// ---------- bag icons ----------
const MC={softwood:'#c9a06a',medium_wood:'#a8743f',hardwood:'#6b4423',copper_ore:'#d9803f',tin_ore:'#cfe3ef',bronze_ore:'#c9a227',iron_bar:'#b8c2cc',softwood_plank:'#d9b27a',medium_plank:'#b9824a',hardwood_plank:'#7a5230',fiber:'#d8c88a',rope:'#b08a52'};
const FORC={moss:'#5d9a48',holly:'#2d7a46',basil:'#6bc04d',forest_sprig:'#78b552',red_cap:'#d83828',death_cap:'#c8c890',blue_cap:'#4a7ae0'};
const ING={carrot:'#e8762f',parsnip:'#e8d9a8',potato:'#b08850',cabbage:'#6fae4c',broccoli:'#3f8f3a',beef:'#b83a3a',chicken:'#e0a050',pork:'#e8908a'};
const FOODC={roast_carrots:'#e8762f',baked_potato:'#b08850',roast_parsnip:'#e8d9a8',braised_cabbage:'#6fae4c',grilled_broccoli:'#3f8f3a',grilled_chicken:'#e0a050',pork_chops:'#e8908a',beef_steak:'#b83a3a',veggie_stew:'#d98a3a',chicken_soup:'#e8c060',pork_roast:'#d98a5a',beef_stew:'#a85a3a',beef_stirfry:'#c8603a',grilled_sardine:'#c9a06a',grilled_mackerel:'#c98b4a',grilled_bream:'#d9803f',grilled_tuna:'#b84a3a',fish_stew:'#d98a3a',seafood_feast:'#e8632e',koi_sashimi:'#f6c85a'};
const FC={sardine:'#9bb8d0',mackerel:'#4f8fa6',bream:'#c98b5a',tuna:'#3f5fa0',koi:'#f2b83a'};
function bagArt(c){const x=$('bic').getContext('2d'),r=(a,b,w,h,k)=>{x.fillStyle=k;x.fillRect(a,b,w,h)};x.clearRect(0,0,48,56);
  r(10,22,28,30,'#383838');r(11,23,26,28,'#b5651d');r(11,23,26,6,'#d98a3d');r(14,36,20,2,'#8c4a12');r(14,44,20,2,'#8c4a12');
  r(16,4,16,12,'#383838');r(18,6,12,10,c);r(8,12,32,14,'#383838');r(9,13,30,12,'#8c4a12');r(9,13,30,3,'#a8631f');r(21,22,6,7,'#383838');r(22,23,4,5,'#f2c14e')}
function icon(id){const x=$('bdi').getContext('2d'),r=(a,b,w,h,k)=>{x.fillStyle=k;x.fillRect(a,b,w,h)};x.clearRect(0,0,16,16);
  if(!id){r(2,2,12,1,'#8a8672');r(2,13,12,1,'#8a8672');r(2,2,1,12,'#8a8672');r(13,2,1,12,'#8a8672');return}
  const K=ITEMS[id].kind;
  if(K==='fish'){r(2,6,10,5,'#383838');r(3,7,8,3,FC[id]);r(11,4,3,8,'#383838');r(11,5,2,6,FC[id]);r(4,8,1,1,'#fff')}
  else if(K==='rod'){for(let t=0;t<12;t++)r(2+t,13-t,1,1,'#7a5230');r(13,2,1,3,'#fff');r(12,5,2,2,'#d94b3a')}
  else if(K==='boat'){r(1,8,14,5,'#383838');r(2,9,12,3,'#a8703a');r(7,2,1,7,'#383838');r(8,3,5,5,'#f4f4f0')}
  else if(K==='material'){const c=MC[id];if(id.endsWith('plank')){r(2,4,12,3,'#2e1f10');r(2,8,12,3,'#2e1f10');r(2,12,12,2,'#2e1f10');r(3,5,10,1,c);r(3,9,10,1,c);r(3,12,10,1,c)}
    else if(id.endsWith('wood')||id==='softwood'){r(2,6,12,6,'#2e1f10');r(3,7,10,4,c);r(11,7,3,4,'#d9b27a');r(5,8,4,1,'#00000030')}
    else if(id==='fiber'){for(let t=0;t<5;t++)r(3+t*2,3+(t%2),1,10,c);r(2,8,12,2,'#8a6a35')}
    else if(id==='rope'){r(3,4,10,8,'#5a3f1e');r(4,5,8,6,c);r(6,7,4,2,'#5a3f1e');r(4,6,8,1,'#d8b878')}
    else if(id==='iron_bar'){r(2,6,12,5,'#2e2e36');r(3,7,10,3,c);r(3,7,10,1,'#e6edf2')}
    else{r(3,4,10,9,'#2e2e36');r(4,5,8,7,'#8d8f87');r(5,6,3,3,c);r(9,8,3,2,c)}}
  else if(K==='potion'){const c={healing_potion:'#d83828',greater_healing:'#f06a5a',stamina_tonic:'#4a9ae0',greater_stamina:'#7ac0f4',swiftness_potion:'#f2c14e',poison_vial:'#7a3ac8'}[id];
    r(6,1,4,3,'#c8b890');r(6,3,4,3,'#2e1f10');r(3,6,10,8,'#2e1f10');r(4,7,8,6,c);r(5,8,1,3,'#fff')}
  else if(K==='forage'){const c=FORC[id];if(/cap$/.test(id)){r(7,8,2,6,'#f0e8d8');r(3,4,10,5,'#2e1f10');r(4,5,8,3,c);r(6,6,1,1,'#fff');r(9,5,1,1,'#fff')}
    else{r(7,3,2,11,'#2e5a2a');r(3,5,5,4,'#2e5a2a');r(4,6,3,2,c);r(9,8,5,4,'#2e5a2a');r(10,9,3,2,c)}}
  else if(K==='garden'){r(2,6,12,8,'#2e1f10');r(3,7,10,6,'#8d5c36');r(5,4,2,4,'#4fa03e');r(9,3,2,5,'#4fa03e');r(4,10,8,1,'#6e4526')}
  else if(K==='ingredient'){const c=ING[id];
    if(id==='carrot'||id==='parsnip'){r(5,5,6,3,'#2e1f10');r(6,5,4,3,c);r(6,8,4,3,c);r(7,11,2,3,c);r(6,2,4,3,'#3f8f3a')}
    else if(id==='potato'){r(3,5,10,8,'#2e1f10');r(4,6,8,6,c);r(6,8,1,1,'#7a5a30');r(9,10,1,1,'#7a5a30')}
    else if(id==='cabbage'){r(3,4,10,10,'#2e5a2a');r(4,5,8,8,c);r(7,5,1,8,'#cfe8a0');r(5,8,6,1,'#cfe8a0')}
    else if(id==='broccoli'){r(7,9,2,5,'#9ac86a');r(3,3,10,7,'#2e5a2a');r(4,4,8,5,c);r(5,5,2,2,'#4f9f48')}
    else if(id==='chicken'){r(4,3,7,6,'#2e1f10');r(5,4,5,4,c);r(8,8,2,5,'#e8e0d0');r(7,12,4,2,'#e8e0d0')}
    else{r(2,5,12,8,'#2e1f10');r(3,6,10,6,c);r(5,8,5,1,'#f4dcdc')}}
  else if(K==='food'){const c=FOODC[id]||'#c9a06a';if(id.startsWith('grilled')&&FC[id.slice(8)]){r(2,6,10,5,'#2e1f10');r(3,7,8,3,c);r(11,4,3,8,'#2e1f10');r(11,5,2,6,c);r(5,7,1,3,'#7a4a1c');r(8,7,1,3,'#7a4a1c')}
    else if(/stew|soup|dinner|fry|feast|sashimi/.test(id)){r(2,8,12,5,'#2e1f10');r(3,8,10,4,'#a8743f');r(3,6,10,3,c);r(5,4,1,2,'#e8e8e8');r(9,3,1,2,'#e8e8e8')}
    else{r(2,10,12,3,'#2e1f10');r(3,9,10,3,'#e8e0d0');r(4,5,8,5,'#2e1f10');r(5,6,6,3,c)}}
  else if(K==='claim'){r(3,2,10,12,'#2e1f10');r(4,3,8,10,'#f3d9a4');r(5,5,6,1,'#8a6a35');r(5,7,6,1,'#8a6a35');r(5,9,4,1,'#8a6a35');r(9,10,3,3,'#c83820')}
  else if(K==='prefab'){r(2,7,12,7,'#2e1f10');r(3,8,10,5,'#e9d9b8');r(6,10,3,4,'#6b4423');r(1,3,14,5,'#2e1f10');r(2,4,12,3,id==='house_kit'?'#5f7183':'#c9a35c')}
  else if(K==='station'){if(id==='camp_kit'){r(6,2,4,3,'#d8b878');r(3,4,10,10,'#2e1f10');r(4,5,8,8,'#d8b878');r(7,8,2,5,'#3d2a14')}
    else if(id==='alchemy_station'){r(3,8,10,6,'#2e1f10');r(4,9,8,4,'#a8743f');r(3,3,10,6,'#2e1f10');r(4,4,8,4,'#8a5ac8')}
    else if(id==='shipwright'){r(1,7,14,6,'#2e1f10');r(2,8,12,4,'#a8743f');r(4,3,1,6,'#d8b878');r(8,2,1,7,'#d8b878');r(11,3,1,6,'#d8b878')}
    else if(id==='cooking_station'){r(3,8,10,6,'#2e1f10');r(4,9,8,4,'#8d8f87');r(4,4,8,5,'#2e1f10');r(5,5,6,3,'#c0713a')}
    else if(id==='forge'){r(2,4,12,10,'#2e2e36');r(3,5,10,8,'#8d8f87');r(5,8,6,5,'#2e1f10');r(6,10,4,3,'#e8632e')}
    else{r(2,6,12,4,'#2e1f10');r(3,7,10,2,'#a8743f');r(3,10,2,4,'#6b4423');r(11,10,2,4,'#6b4423')}}
  else if(id==='knife'){for(let t=0;t<6;t++)r(3+t,12-t,2,2,'#7a5230');for(let t=0;t<5;t++)r(8+t,7-t,2,2,'#c9d2da')}
  else if(K==='weapon'){const c=ITEMS[id].blade||'#c9d2da',w=ITEMS[id].wide?3:2;for(let t=0;t<9;t++)r(5+t,9-t,w,w,c);r(3,10,5,2,'#6b4423');r(2,12,3,3,'#6b4423')}
  else{for(let t=0;t<11;t++)r(2+t,13-t,1,1,'#7a5230');const mc=ITEMS[id].metal||'#8d8f87';if(/pickaxe/.test(id)){r(8,1,6,2,mc);r(12,2,2,5,mc)}else{r(8,2,6,5,mc);r(8,2,6,1,'#c9cac1')}}}
