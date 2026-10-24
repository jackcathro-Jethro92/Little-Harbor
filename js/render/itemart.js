// ---------- detailed item icons (batch H3): every item drawn at 24 x 24 in the same style as the people ----------
// Jack's reference sheets: a dark coloured outline, shading from the top left, and weapons and armour that get fancier with each tier. Each icon is built from shaded parts with the painter in
// js/render/heroart.js (HAPainter); families below (sword, axe, pickaxe, rod, helmet, chest, boots, ring, amulet, potion, fish, plate and bowl meals, vegetables, herbs, ore, logs...) take colours,
// and ITEM_ICONS says which family and colours each item uses. An image file can replace any icon: put it in ITEM_FILES[id]. itemArt(id) gives the canvas (cached); icon() in js/render/icons.js uses it.
const IA=24,ITEM_FILES={},IA_CACHE=new Map();
const IA_WOOD={soft:'#d8a868',medium:'#b07840',hard:'#6e4424',dark:'#4a3a3a'};
const iaNot=f=>(x,y)=>!f(x,y);
// ---- families: each paints onto p ----
const IAF={
 sword(p,o){const tip=o.tip||[21,3],w=o.wide?2.5:1.9;
   const bl=p.part(o.blade);p.fill(bl,haTaper(8.5,15.5,tip[0],tip[1],w,.35));
   const gd=p.part(o.guard||'#8a8a94');p.fill(gd,o.cross===false?haEl(8,16,2,2):haSeg(5.2,12.6,11.4,18.8,1.25));
   const gr=p.part(o.grip||'#6b4423');p.fill(gr,haSeg(3.6,20.4,7.6,16.4,1.35));
   const pm=p.part(o.pommel||o.guard||'#8a8a94');p.fill(pm,haEl(3.2,20.8,1.7,1.7));
   const R=haRamp(o.blade);p.line(10,14,tip[0]-2,tip[1]+2,o.fuller?R[2]:R[0]);if(o.fuller)p.line(11,12,tip[0]-3,tip[1]+3,R[0]);
   p.line(5,19,7,17,haRamp(o.grip||'#6b4423')[0]);if(o.gem)p.rect(7,15,2,2,o.gem);if(o.glow){p.dot(tip[0]-1,tip[1]+1,'#ffffff');p.dot(15,9,'#ffffff')}},
 axe(p,o){const h=p.part(o.handle||IA_WOOD.medium);p.fill(h,haSeg(4.5,21,16.5,5.5,1.15));
   const hd=p.part(o.head);p.fill(hd,haOr(haPoly([[12.5,4.5],[17,6.5],[16,10],[11.5,8]]),haAnd(haEl(19,8.5,3.6,5.6),(x,y)=>x>15.8)));if(o.double)p.fill(hd,haAnd(haEl(10.5,3.5,3.4,4),(x,y)=>x<12.6));
   const R=haRamp(o.head);p.line(21,5,21,12,R[0]);p.line(6,19,15,7.5,haRamp(o.handle||IA_WOOD.medium)[0]);if(o.gem)p.rect(14,6,2,2,o.gem)},
 pick(p,o){const h=p.part(o.handle||IA_WOOD.medium);p.fill(h,haSeg(6.5,21.5,14.5,6.5,1.15));
   const hd=p.part(o.head);p.fill(hd,haAnd(haEl(13.5,8.5,10,5.2),iaNot(haEl(13.5,11.4,9.4,4.6)),(x,y)=>y<10));p.fill(hd,haEl(14.2,6.2,2,1.9));
   p.line(5,4,10,3,haRamp(o.head)[0]);p.line(7.5,19.5,13.5,8.5,haRamp(o.handle||IA_WOOD.medium)[0])},
 knife(p,o){const bl=p.part(o.blade||'#c8ccd4');p.fill(bl,haOr(haTaper(9.5,14.5,20,4,2.2,.3),haPoly([[9,13],[11.5,15.5],[9.5,16]])));
   const h=p.part(o.handle||IA_WOOD.medium);p.fill(h,haSeg(4.5,19.5,9,15,1.6));p.dot(6,18,'#d9c08a');p.line(11,13,18,6,haRamp(o.blade||'#c8ccd4')[0])},
 rod(p,o){const r=p.part(o.rod,{flat:1});p.fill(r,haSeg(3.5,21,20.5,3,.85));const g=p.part(o.grip||'#4a3020');p.fill(g,haSeg(3,21.5,7.5,16.8,1.45));
   const re=p.part(o.reel||'#a8acb4');p.fill(re,haEl(8.6,13.6,2.3,2.3));p.dot(8,13,'#ffffff');
   if(o.seg)for(let i=0;i<4;i++){const t=.25+i*.18;p.dot(Math.round(3.5+17*t),Math.round(21-18*t),haRamp(o.rod)[3])}
   for(let y=4;y<15;y+=2)p.dot(21,y,'#f4f4f4');p.dot(20,15,'#c8402a');p.dot(21,16,'#8a8a94')},
 helmet(p,o){const c=p.part(o.col);
   if(o.kind==='hood'){p.fill(c,haAnd(haOr(haEl(12,11.5,8,8.5),haPoly([[4,12],[20,12],[21,21],[3,21]]),haPoly([[9,4],[12,1],[15,4]])),iaNot(haEl(12,14.5,4.6,5))));return}
   if(o.kind==='coif'){p.fill(c,haAnd(haOr(haEl(12,11,8,8.5),haPoly([[4,11],[20,11],[21.5,21],[2.5,21]])),iaNot(haEl(12,14,4.4,4.8))));for(let y=4;y<21;y+=2)for(let x=4+(y%4?1:0);x<21;x+=2)if(p.at(x,y)===c)p.dot(x,y,haRamp(o.col)[2]);return}
   p.fill(c,haAnd(haEl(12,13,8.2,8.6),(x,y)=>y<14.2));const rim=p.part(o.trim||haMix(o.col,'#000',.15));p.fill(rim,haPoly([[3,13],[21,13],[21.5,15.6],[2.5,15.6]]));
   if(o.kind==='cap'){p.fill(c,haOr(haPoly([[3.6,15],[6.8,15],[6.4,20],[3.8,19.6]]),haPoly([[17.2,15],[20.4,15],[20.2,19.6],[17.6,20]])));p.line(12,5,12,13,haRamp(o.col)[2])}
   if(o.kind==='winged'){const w=p.part(o.wing||'#f2f4f8');p.fill(w,haOr(haPoly([[3,11],[0.5,4],[2.5,5],[3.5,2.5],[5.5,6],[6,10]]),haPoly([[21,11],[23.5,4],[21.5,5],[20.5,2.5],[18.5,6],[18,10]])));p.rect(11,6,2,2,o.gem||'#f2c14e')}
   p.line(8,7,10,5.5,haRamp(o.col)[0])},
 chest(p,o){const c=p.part(o.col);p.fill(c,haAnd(haPoly([[7,3],[10,4.6],[14,4.6],[17,3],[21.2,5.6],[22,12],[19,12],[18.6,21.5],[5.4,21.5],[5,12],[2,12],[2.8,5.6]]),iaNot(haEl(12,3.6,2.8,2.2))));
   const R=haRamp(o.col);
   if(o.kind==='mail')for(let y=5;y<21;y+=2)for(let x=3+(y%4?1:0);x<22;x+=2)if(p.at(x,y)===c)p.dot(x,y,R[2]);
   if(o.kind==='leather'){p.line(12,6,12,20,R[3]);for(let y=8;y<19;y+=3){p.dot(11,y,'#d9c08a');p.dot(13,y,'#d9c08a')}p.rect(6,16,12,1,R[2])}
   if(o.kind==='cloth'){p.line(12,6,12,12,R[2]);p.rect(6,17,12,1,R[2]);p.dot(12,8,R[0])}
   if(o.kind==='plate'){const t=p.part(o.trim||'#f2d46a');p.fill(t,haOr(haPoly([[10,6],[14,6],[13,20],[11,20]]),haEl(4.6,7.4,2.8,2.4),haEl(19.4,7.4,2.8,2.4)));if(o.gem)p.rect(11,10,2,2,o.gem);p.line(6,11,9,18,R[0])}},
 boots(p,o){const c=p.part(o.col);p.fill(c,haPoly([[7,2.5],[15,2.5],[15,13],[20,15],[21.5,18],[21.5,21],[6,21],[6.5,13]]));
   const cf=p.part(o.trim||haMix(o.col,'#ffffff',.25));p.fill(cf,haPoly([[6.6,2.5],[15.4,2.5],[15.4,5.4],[6.6,5.4]]));
   const so=p.part(o.sole||'#3a2a20');p.fill(so,haPoly([[5.6,19.6],[22,19.6],[22,22],[5.6,22]]));const R=haRamp(o.col);
   if(o.kind==='mail')for(let y=7;y<19;y+=2)for(let x=7+(y%4?1:0);x<21;x+=2)if(p.at(x,y)===c)p.dot(x,y,R[2]);
   if(o.kind==='leather')for(let y=8;y<14;y+=2)p.dot(11,y,'#d9c08a');
   if(o.kind==='winged'){const w=p.part('#f2f4f8');p.fill(w,haPoly([[15,5],[21,1.5],[19.5,5],[22,6],[16,9]]))}
   p.line(8,7,8,15,R[0])},
 ring(p,o){const b=p.part(o.band||'#e0b84a');p.fill(b,haAnd(haEl(12,14.5,7.2,6.2),iaNot(haEl(12,15,4.6,3.6))));const g=p.part(o.gem);p.fill(g,haEl(12,7.6,3.4,3.2));
   p.dot(11,6,'#ffffff');p.dot(10,7,haRamp(o.gem)[0]);p.line(7,12,9,10.5,haRamp(o.band||'#e0b84a')[0])},
 amulet(p,o){const ch=p.part(o.band||'#e0b84a',{flat:1});p.fill(ch,haAnd(haEl(12,9,8.5,8),iaNot(haEl(12,9,7.4,6.9)),(x,y)=>y<13));
   const g=p.part(o.gem),sh={heart:haOr(haEl(10,15.5,2.6,2.6),haEl(14,15.5,2.6,2.6),haPoly([[7.6,16.2],[16.4,16.2],[12,21.6]])),shield:haPoly([[8,13],[16,13],[16,17],[12,21.5],[8,17]]),
     drop:haOr(haEl(12,17.5,3.6,3.6),haPoly([[9,16],[15,16],[12,11.5]])),fish:haOr(haEl(11.5,17,4.6,2.8),haPoly([[15,17],[18.5,14.5],[18.5,19.5]])),gem:haPoly([[12,12],[16.5,16.5],[12,21.5],[7.5,16.5]])};
   p.fill(g,sh[o.shape||'gem']);const set=p.part(o.band||'#e0b84a');p.fill(set,haEl(12,12.6,1.6,1.3));p.dot(11,15,'#ffffff');p.dot(10,16,haRamp(o.gem)[0])},
 potion(p,o){const gl=p.part('#cfe4ec');const big=o.big,vial=o.vial;
   const body=vial?haOr(haEl(12,17.5,3.8,3.8),haPoly([[8.2,8],[15.8,8],[15.8,17.5],[8.2,17.5]])):haEl(12,15,big?7.6:6.4,big?7:6.2);
   p.fill(gl,haOr(body,haPoly([[10.2,3.5],[13.8,3.5],[13.8,9],[10.2,9]])));const lq=p.part(o.liquid);p.fill(lq,haAnd(body,(x,y)=>y>(vial?11:big?12:13)));
   const ck=p.part('#8a5a30');p.fill(ck,haPoly([[9.6,1],[14.4,1],[14.4,4.2],[9.6,4.2]]));if(big){const bd=p.part('#e0b84a');p.fill(bd,haPoly([[9.8,8.2],[14.2,8.2],[14.2,9.8],[9.8,9.8]]))}
   p.dot(9,13,'#ffffff');p.dot(8,15,'#ffffff');p.dot(9,14,'#ffffff');if(o.skull){p.rect(11,14,2,2,'#f2f0e6');p.dot(11,16,'#f2f0e6');p.dot(12,16,'#f2f0e6')}},
 fish(p,o){const bw=o.w||9,bh=o.h||4.6,body=haEl(12.5,12,bw,bh);const tl=p.part(o.fin||haMix(o.body,'#000',.15));
   p.fill(tl,haOr(haPoly([[0.8,7],[5.5,12],[0.8,17],[3.2,12]]),haPoly([[9,12-bh+.8],[13,12-bh-2.2],[15.5,12-bh+.8]])));
   const b=p.part(o.body);p.fill(b,body);const be=p.part(o.belly||haMix(o.body,'#ffffff',.45));p.fill(be,haAnd(body,(x,y)=>y>12.6+(x-12)*.05));
   if(o.stripe)for(let x=7;x<17;x+=3)p.line(x,8,x+1,11,haRamp(o.body)[3]);
   if(o.patch){const w=p.part('#f8f4ea');p.fill(w,haOr(haEl(10,10,2.6,1.8),haEl(15,13.5,2,1.6)))}
   p.rect(17+Math.round((bw-9)/2),10,2,2,'#1a1418');p.dot(17+Math.round((bw-9)/2),10,'#ffffff');p.line(15,9,15,15,haRamp(o.body)[2])},
 plate(p,o){const pl=p.part('#e8e4dc');p.fill(pl,haEl(12,16.5,10.6,5.2));p.line(4,17,20,17,'#c8c2b8');o.food(p)},
 bowl(p,o){const bw=p.part(o.bowl||'#b07840');p.fill(bw,haAnd(haEl(12,13,9.6,8.6),(x,y)=>y>12.4));const sp=p.part(o.soup,{flat:1});p.fill(sp,haEl(12,12.6,9,2.8));
   (o.bits||[]).forEach(([x,y,c])=>p.rect(x,y,2,1,c));p.dot(8,12,haRamp(o.soup)[0]);p.line(5,16,8,19,haRamp(o.bowl||'#b07840')[0]);if(o.steam){p.line(9,7,10,4,'#ffffff');p.line(14,8,15,5,'#ffffff')}},
 ore(p,o){const r=p.part('#8a8a90');p.fill(r,haOr(haEl(12,14,9,6.6),haEl(8,11,4.6,4)));const n=p.part(o.ore);
   [[8,12,2.4,1.9],[14,10.4,2.2,1.8],[15,16,2.6,1.8],[10,17,1.6,1.3]].forEach(([x,y,a,b])=>p.fill(n,haEl(x,y,a,b)));[[7,11],[13,10],[14,15]].forEach(([x,y])=>p.dot(x,y,haRamp(o.ore)[0]))},
 log(p,o){const b=p.part(o.bark);p.fill(b,haSeg(5,17,17.5,9,4.4));const e=p.part(o.end||'#e8c88a');p.fill(e,haOEl(18.6,8.4,.55,.83,3.4,4.2));
   p.dot(18,8,haRamp(o.end||'#e8c88a')[3]);p.line(17,7,19,10,haRamp(o.end||'#e8c88a')[2]);p.line(6,15,14,10,haRamp(o.bark)[2]);p.line(8,18,15,14,haRamp(o.bark)[3])},
 planks(p,o){const w=p.part(o.wood);[[3,15],[5,10.5],[7,6]].forEach(([x,y])=>p.fill(w,haPoly([[x,y],[x+15,y-2.5],[x+15,y+1.4],[x,y+3.9]])));const R=haRamp(o.wood);[[3,15],[5,10.5],[7,6]].forEach(([x,y])=>{p.line(x+1,y+1,x+13,y-1,R[0]);p.dot(x+4,y+2,R[3])})},
 bar(p,o){const b=p.part(o.col);p.fill(b,haPoly([[5,10],[19,10],[21.5,16],[2.5,16]]));const t=p.part(haMix(o.col,'#ffffff',.25));p.fill(t,haPoly([[6.5,10],[17.5,10],[18.5,12],[5.5,12]]));p.line(6,13,9,13,haRamp(o.col)[0])},
 key(p,o){const c=p.part(o.col);p.fill(c,haOr(haAnd(haEl(7,8,4.6,4.6),iaNot(haEl(7,8,1.9,1.9))),haSeg(10,11,20,21,1.25),haPoly([[16,17],[19,14],[20.5,15.5],[17.5,18.5]]),haPoly([[13,14],[15.5,11.5],[16.6,12.6],[14,15]])));
   if(o.gem){const g=p.part(o.gem);p.fill(g,haEl(7,4,1.6,1.4))}p.line(4,7,6,5,haRamp(o.col)[0])},
 mushroom(p,o){const st=p.part('#efe6cf');p.fill(st,haPoly([[10,11],[14,11],[14.6,20],[9.4,20]]));const cp=p.part(o.cap);p.fill(cp,haAnd(haEl(12,11,9,7.4),(x,y)=>y<12.2));
   (o.spots?[[8,8],[13,6],[16,9],[10,5]]:[]).forEach(([x,y])=>p.rect(x,y,2,1,'#f8f4ea'));p.line(6,9,9,6,haRamp(o.cap)[0])},
 leaves(p,o){const st=p.part(o.stem||'#5a7a2a',{flat:1});p.fill(st,haSeg(11,21,12.5,9,.8));const l=p.part(o.leaf);
   (o.at||[[8,12,-.6],[16,10,.6],[10,6,-.3],[15,15,.5]]).forEach(([x,y,a])=>p.fill(l,haOEl(x,y,Math.cos(a),Math.sin(a),4.2,2.1)));
   (o.berries||[]).forEach(([x,y])=>{const b=p.part('#d0283a');p.fill(b,haEl(x,y,1.5,1.5))})},
 building(p,o){const w=p.part(o.wall||'#d8c8a0');p.fill(w,haPoly([[4.5,11],[19.5,11],[19.5,20.5],[4.5,20.5]]));const r=p.part(o.roof);p.fill(r,haPoly([[1.5,12],[12,3],[22.5,12]]));
   const d=p.part('#6b4423');p.fill(d,haPoly([[10.5,14],[13.5,14],[13.5,20.5],[10.5,20.5]]));p.rect(15,14,3,2,'#8ec0e8')},
 boat(p,o){const h=p.part(o.hull||IA_WOOD.medium);p.fill(h,haPoly([[2,14],[22,14],[19,20],[5,20]]));if(o.mast){const m=p.part(IA_WOOD.hard,{flat:1});p.fill(m,haSeg(12,14,12,2,.7));
   const s=p.part(o.sail||'#f2efe6');p.fill(s,haPoly([[12.8,3],[12.8,13],[20,13]]));if(o.mast>1)p.fill(s,haPoly([[11.2,5],[11.2,13],[5,13]]))}p.line(4,16,20,16,haRamp(o.hull||IA_WOOD.medium)[0])}};
// small helpers for the meals
const iaFood={fish:(p,c)=>{const f=p.part(c||'#b8783a');p.fill(f,haOr(haEl(12.5,13.5,7,3),haPoly([[4,10.5],[7,13.5],[4,16.5]])));for(let x=9;x<17;x+=3)p.line(x,11,x-1,15,'#5a3010');p.dot(17,12,'#1a1418')},
  meat:(p,c,r)=>{const m=p.part(c);p.fill(m,haEl(12,13.6,r||6.6,3.8));p.line(8,13,15,12,haRamp(c)[3]);p.line(9,15,16,14,haRamp(c)[3])},
  bits:(p,list)=>list.forEach(([x,y,c,w])=>{const k=p.part(c);p.fill(k,haEl(x,y,w||2.4,1.6))})};
// which family and colours each item uses
const ITEM_ICONS={
 wooden_sword:['sword',{blade:'#c89a5a',guard:'#8a5a30',grip:'#6b4423'}],sword:['sword',{blade:'#b8bcc4',guard:'#7a7a84'}],bronze_sword:['sword',{blade:'#d8964a',guard:'#a86a2a',fuller:1}],
 iron_sword:['sword',{blade:'#dfe4ec',guard:'#5a6070',grip:'#3a2a30',fuller:1,gem:'#3a78c8'}],greatsword:['sword',{blade:'#c8ced8',guard:'#4a4a58',grip:'#2a2228',wide:1,fuller:1,tip:[22,2]}],
 divine_blade:['sword',{blade:'#f4f6ff',guard:'#f2c14e',grip:'#6a3a8a',pommel:'#f2c14e',fuller:1,gem:'#e84a6a',glow:1,wide:1,tip:[22,2]}],
 hand_axe:['axe',{head:'#a8acb4'}],woodcutters_axe:['axe',{head:'#9a9ea8'}],iron_axe:['axe',{head:'#dfe4ec',handle:IA_WOOD.hard,double:1}],
 pickaxe:['pick',{head:'#8a8e98'}],iron_pickaxe:['pick',{head:'#dfe4ec',handle:IA_WOOD.hard}],knife:['knife',{}],
 driftwood_rod:['rod',{rod:'#a8835a'}],bamboo_rod:['rod',{rod:'#c8b048',seg:1,grip:'#6a8a3a'}],fiberglass_rod:['rod',{rod:'#e8eef4',grip:'#3a6ab8',reel:'#4a8ad8'}],carbon_rod:['rod',{rod:'#2a2a32',grip:'#c8402a',reel:'#e8c24a'}],
 cloth_hood:['helmet',{col:'#7f93b8',kind:'hood'}],leather_cap:['helmet',{col:'#9a6a3a',kind:'cap'}],chain_coif:['helmet',{col:'#aeb4bd',kind:'coif'}],sky_helm:['helmet',{col:'#7ec8f0',kind:'winged',trim:'#f2c14e'}],
 cloth_tunic:['chest',{col:'#7f93b8',kind:'cloth'}],leather_jerkin:['chest',{col:'#9a6a3a',kind:'leather'}],chain_hauberk:['chest',{col:'#aeb4bd',kind:'mail'}],enchanted_armour:['chest',{col:'#9ec6e8',kind:'plate',gem:'#e84a6a'}],
 cloth_shoes:['boots',{col:'#7f93b8'}],leather_boots:['boots',{col:'#9a6a3a',kind:'leather'}],chain_boots:['boots',{col:'#aeb4bd',kind:'mail'}],enchanted_boots:['boots',{col:'#58a8e8',kind:'winged',trim:'#f2c14e'}],
 ring_vigor:['ring',{gem:'#d83848'}],ring_might:['ring',{gem:'#e8782a'}],ring_endurance:['ring',{gem:'#3aa860'}],ring_harvest:['ring',{gem:'#e8c83a',band:'#c8a050'}],
 amulet_angler:['amulet',{gem:'#3a8ad8',shape:'fish'}],amulet_vital:['amulet',{gem:'#d83848',shape:'heart'}],amulet_ward:['amulet',{gem:'#4a7ac8',shape:'shield',band:'#c8ccd4'}],amulet_sage:['amulet',{gem:'#8a4ac8',shape:'drop'}],
 healing_potion:['potion',{liquid:'#d83848'}],greater_healing:['potion',{liquid:'#a81838',big:1}],stamina_tonic:['potion',{liquid:'#4ab84a'}],greater_stamina:['potion',{liquid:'#2a8a3a',big:1}],
 swiftness_potion:['potion',{liquid:'#5ac8e8'}],poison_vial:['potion',{liquid:'#8a3ab8',vial:1,skull:1}],
 sardine:['fish',{body:'#8aa8c0',w:8,h:3.6}],mackerel:['fish',{body:'#3f7f96',stripe:1}],bream:['fish',{body:'#c98b5a',h:6}],tuna:['fish',{body:'#2f4f90',w:10,h:5.4,fin:'#e8c24a'}],koi:['fish',{body:'#f2a03a',patch:1,fin:'#e8783a'}],
 copper_ore:['ore',{ore:'#d9803f'}],tin_ore:['ore',{ore:'#d8dce4'}],bronze_ore:['ore',{ore:'#c8963a'}],gold_ore:['ore',{ore:'#f2c83a'}],silver_ore:['ore',{ore:'#e8eef8'}],
 softwood:['log',{bark:'#9a7a4a',end:'#f0d498'}],medium_wood:['log',{bark:'#7a5230',end:'#d8a868'}],hardwood:['log',{bark:'#4a3020',end:'#b07840'}],ironwood_log:['log',{bark:'#3a3a48',end:'#7a7a8a'}],
 softwood_plank:['planks',{wood:IA_WOOD.soft}],medium_plank:['planks',{wood:IA_WOOD.medium}],hardwood_plank:['planks',{wood:IA_WOOD.hard}],iron_bar:['bar',{col:'#9aa4b4'}],
 sky_key:['key',{col:'#7ec8f0',gem:'#ffffff'}],fire_key:['key',{col:'#e8582a',gem:'#f2c14e'}],earth_key:['key',{col:'#6a9a3a',gem:'#a86a2a'}],sea_key:['key',{col:'#3ab8b8',gem:'#3a6ad8'}],house_key:['key',{col:'#d8b04a'}],
 red_cap:['mushroom',{cap:'#d83828',spots:1}],death_cap:['mushroom',{cap:'#c8c890'}],blue_cap:['mushroom',{cap:'#3a78c8',spots:1}],
 moss:['leaves',{leaf:'#5d9a48',at:[[7,16,0],[12,14,.2],[17,16,-.2],[10,18,0],[15,19,0]],stem:'#3a6a2a'}],holly:['leaves',{leaf:'#2d7a46',berries:[[11,9],[13.5,10],[12,12]]}],
 basil:['leaves',{leaf:'#6bc04d'}],forest_sprig:['leaves',{leaf:'#78b552',stem:'#7a5230',at:[[8,10,-.8],[15,7,.8],[9,15,-.8],[16,13,.8]]}],
 cottage_kit:['building',{roof:'#c8a050'}],house_kit:['building',{roof:'#6a7078'}],
 rowboat:['boat',{}],sloop:['boat',{mast:1}],schooner:['boat',{mast:2}],brig:['boat',{mast:2,hull:IA_WOOD.hard,sail:'#e8e0c8'}]};
// one-off drawings for the rest
const ITEM_DRAW={
 carrot(p){const c=p.part('#e8762f');p.fill(c,haTaper(8,8,18.5,20,4.2,.5));const l=p.part('#4caf52');p.fill(l,haOr(haOEl(5,4,-.7,-.7,3.6,1.4),haOEl(8,3,0,-1,3.4,1.3),haOEl(4,7.5,-1,0,3.2,1.3)));for(let i=0;i<3;i++)p.line(10+i*2,12+i*2,12+i*2,11+i*2,haRamp('#e8762f')[2])},
 parsnip(p){const c=p.part('#eadcae');p.fill(c,haTaper(8,8,18.5,20,4.4,.5));const l=p.part('#7abf52');p.fill(l,haOr(haOEl(5,4,-.7,-.7,3.6,1.4),haOEl(8,3,0,-1,3.4,1.3)));p.line(11,12,13,11,haRamp('#eadcae')[2])},
 potato(p){const c=p.part('#b08850');p.fill(c,haOr(haEl(12,13,8.4,6.4),haEl(8,10,4,3.6)));[[8,11],[14,10],[15,15],[10,16]].forEach(([x,y])=>p.dot(x,y,'#6b4a20'))},
 cabbage(p){const c=p.part('#6fae4c');p.fill(c,haEl(12,13,9,8));const i=p.part('#a8d878');p.fill(i,haEl(12,13,5.2,4.6));[[12,5,12,21],[5,10,11,13],[19,10,13,13]].forEach(([a,b,cc,d])=>p.line(a,b,cc,d,'#e8f4d0'))},
 broccoli(p){const s=p.part('#8ac860');p.fill(s,haTaper(12,21,12,12,2.6,2));const f=p.part('#3f8f3a');[[8,10,4.2],[16,10,4.2],[12,7,4.6],[12,12,3.4]].forEach(([x,y,r])=>p.fill(f,haEl(x,y,r,r*.9)));[[7,8],[11,5],[15,8],[17,11]].forEach(([x,y])=>p.dot(x,y,'#7acf62'))},
 chicken(p){const b=p.part('#f4f0e6');p.fill(b,haOr(haSeg(14,14,19.5,19.5,1.3),haEl(20.5,20.5,1.8,1.8),haEl(19.2,21.6,1.6,1.4)));const m=p.part('#f0a8a0');p.fill(m,haOEl(10,10,.7,.7,7,5.4))},
 pork(p){const f=p.part('#f8ece4');p.fill(f,haEl(12,13,9.4,7));const m=p.part('#f09a98');p.fill(m,haEl(12.6,13.6,7.6,5.4));p.line(8,12,16,15,'#d87878')},
 beef(p){const f=p.part('#f4e6d8');p.fill(f,haEl(12,13,9.6,7.2));const m=p.part('#c83838');p.fill(m,haEl(12.4,13.4,8,5.8));[[9,12,12,11],[13,15,16,14],[10,16,11,15]].forEach(([a,b,c,d])=>p.line(a,b,c,d,'#f0c8c0'))},
 grilled_sardine:['plate',p=>iaFood.fish(p,'#b88a5a')],grilled_mackerel:['plate',p=>iaFood.fish(p,'#8a7a5a')],grilled_bream:['plate',p=>iaFood.fish(p,'#c8783a')],grilled_tuna:['plate',p=>iaFood.meat(p,'#8a4a3a',7)],
 koi_sashimi:['plate',p=>iaFood.bits(p,[[8,14,'#f2a03a',2.6],[12,13,'#f8f4ea',2.6],[16,14,'#f2a03a',2.6],[12,16,'#f2a03a',2.6]])],
 seafood_feast:['plate',p=>{iaFood.fish(p,'#c8783a');iaFood.bits(p,[[18,16,'#f2d84a',1.8],[6,16,'#e8784a',1.8]])}],
 roast_carrots:['plate',p=>iaFood.bits(p,[[8,14,'#d8642a',3],[13,13,'#d8642a',3],[15,16,'#d8642a',3],[10,17,'#6aa840',1.4]])],
 baked_potato:['plate',p=>{iaFood.meat(p,'#a87840',6);const b=p.part('#f2d84a');p.fill(b,haEl(12,12.4,2.6,1.4))}],
 roast_parsnip:['plate',p=>iaFood.bits(p,[[8,14,'#d8b870',3],[13,13,'#d8b870',3],[16,16,'#d8b870',2.6]])],
 grilled_broccoli:['plate',p=>iaFood.bits(p,[[8,13,'#2f7f2a',2.4],[12,12,'#3f8f3a',2.6],[16,14,'#2f7f2a',2.4],[12,16,'#3f8f3a',2.4]])],
 grilled_chicken:['plate',p=>{iaFood.meat(p,'#c8783a',6);const b=p.part('#f4f0e6');p.fill(b,haSeg(16,12,20,9,1.1))}],
 pork_chops:['plate',p=>{iaFood.meat(p,'#b8784a',6.4);const b=p.part('#f4f0e6');p.fill(b,haSeg(15,12,19,10,1))}],
 beef_steak:['plate',p=>iaFood.meat(p,'#7a3a2a',7)],pork_roast:['plate',p=>{const r=p.part('#a85a3a');p.fill(r,haEl(12,12.5,7.4,5.2));p.line(8,10,8,15,'#6a3018');p.line(12,9,12,16,'#6a3018');p.line(16,10,16,15,'#6a3018')}],
 fish_stew:['bowl',{soup:'#e8783a',bits:[[8,12,'#f4f0e6'],[13,11,'#f4f0e6'],[15,13,'#4caf52']],steam:1}],veggie_stew:['bowl',{soup:'#d89a3a',bits:[[8,12,'#e8762f'],[12,11,'#4caf52'],[15,13,'#e8762f']],steam:1}],
 chicken_soup:['bowl',{soup:'#f2d070',bits:[[8,12,'#f4f0e6'],[13,12,'#e8762f'],[15,11,'#4caf52']],steam:1}],beef_stew:['bowl',{soup:'#8a4a2a',bits:[[8,12,'#c8783a'],[13,11,'#e8762f'],[15,13,'#c8783a']],steam:1}],
 braised_cabbage:['bowl',{soup:'#8ac860',bits:[[8,12,'#5a9a3a'],[13,11,'#5a9a3a']]}],
 beef_stirfry(p){const pan=p.part('#3a3a42');p.fill(pan,haOr(haAnd(haEl(11,14,9.4,6.4),(x,y)=>y>11),haSeg(19,13,23,11,1.1)));const f=p.part('#8a4a2a',{flat:1});p.fill(f,haEl(11,12.6,8.4,2.6));[[7,12,'#4caf52'],[11,12,'#e8762f'],[14,13,'#4caf52']].forEach(([x,y,c])=>p.rect(x,y,2,1,c))},
 rope(p){const r=p.part('#c8a060');p.fill(r,haAnd(haEl(12,13,9,7.6),iaNot(haEl(12,13,4.2,3.4))));for(let a=0;a<6.28;a+=.7)p.dot(Math.round(12+Math.cos(a)*6.6),Math.round(13+Math.sin(a)*5.5),'#8a6a30');p.line(19,15,22,20,'#c8a060')},
 fiber(p){const f=p.part('#c8c070',{flat:1});for(let i=0;i<5;i++)p.fill(f,haSeg(5+i*1.4,20,10+i*1.6,3,.7));const t=p.part('#8a5a30');p.fill(t,haPoly([[5,11],[17,11],[17,13.4],[5,13.4]]))},
 cloth(p){const c=p.part('#5a7ac0');p.fill(c,haPoly([[3,8],[19,6],[21,10],[21,18],[5,20],[3,15]]));const f=p.part('#7a9ae0');p.fill(f,haPoly([[3,8],[19,6],[21,10],[5,12]]));p.line(5,15,19,13,haRamp('#5a7ac0')[2])},
 leather(p){const c=p.part('#9a6a3a');p.fill(c,haPoly([[4,6],[9,4],[15,5],[20,4],[21,10],[19,16],[21,20],[13,19],[6,20],[3,16],[5,11]]));p.line(8,9,16,9,haRamp('#9a6a3a')[0]);[[7,14],[12,12],[16,15]].forEach(([x,y])=>p.dot(x,y,haRamp('#9a6a3a')[2]))},
 wolf_pelt(p){const f=p.part('#8d8b88');p.fill(f,haOr(haEl(12,13,7,6),haPoly([[4,8],[7,5],[8,10]]),haPoly([[20,8],[17,5],[16,10]]),haPoly([[3,17],[7,15],[6,20]]),haPoly([[21,17],[17,15],[18,20]]),haTaper(12,18,12,23,2.4,1)));const b=p.part('#d8d4cc');p.fill(b,haEl(12,14,3.4,3.6));p.line(8,9,11,11,'#5a5854')},
 centipede_fang(p){const f=p.part('#ece0c0');p.fill(f,haOr(haTaper(6,19,12,8,3,1.2),haTaper(12,8,19,4,1.2,.3)));p.line(7,17,11,10,'#ffffff')},
 grandfather_compass(p){const b=p.part('#c8963a');p.fill(b,haOr(haEl(12,13,9,9),haEl(12,3.4,2,1.6)));const f=p.part('#f2ead0',{flat:1});p.fill(f,haEl(12,13,6.6,6.6));p.line(12,13,15,8,'#d83828');p.line(12,13,9,18,'#3a5ab8');p.dot(12,13,'#2a2228')},
 camp_kit(p){const t=p.part('#3a7ab8');p.fill(t,haPoly([[1.5,20.5],[12,3.5],[22.5,20.5]]));const d=p.part('#1e3a5a');p.fill(d,haPoly([[9,20.5],[12,12],[15,20.5]]));p.line(12,4,12,11,'#ffffff')},
 standard_bench(p){const t=p.part(IA_WOOD.medium);p.fill(t,haPoly([[2,9],[22,9],[22,12],[2,12]]));p.fill(t,haOr(haPoly([[3.5,12],[6,12],[6,21],[3.5,21]]),haPoly([[18,12],[20.5,12],[20.5,21],[18,21]])));const v=p.part('#8a8a94');p.fill(v,haPoly([[15,5],[20,5],[20,9],[15,9]]));p.line(4,10,20,10,haRamp(IA_WOOD.medium)[0])},
 forge(p){const b=p.part('#9a5a3a');p.fill(b,haPoly([[3,7],[21,7],[21,21],[3,21]]));const m=p.part('#f2a03a');p.fill(m,haPoly([[7,12],[17,12],[17,19],[7,19]]));p.rect(9,15,6,2,'#ffe080');for(let y=8;y<21;y+=3)p.line(3,y,20,y,'#6a3a24')},
 cooking_station(p){const f=p.part('#f2a03a');p.fill(f,haOr(haEl(8,19,2.6,2.6),haEl(12,18,2.8,3.4),haEl(16,19,2.6,2.6)));const pot=p.part('#3a3a42');p.fill(pot,haAnd(haEl(12,10,8,6.6),(x,y)=>y>7));p.line(4,7,20,7,'#5a5a64')},
 alchemy_station(p){const t=p.part(IA_WOOD.medium);p.fill(t,haPoly([[2,14],[22,14],[22,17],[2,17]]));p.fill(t,haOr(haPoly([[3.5,17],[5.5,17],[5.5,22],[3.5,22]]),haPoly([[18.5,17],[20.5,17],[20.5,22],[18.5,22]])));const g=p.part('#cfe4ec');p.fill(g,haOr(haEl(9,10,3.6,3.6),haPoly([[8,3],[10,3],[10,7],[8,7]])));const l=p.part('#8a4ac8');p.fill(l,haAnd(haEl(9,10,3.6,3.6),(x,y)=>y>10));const g2=p.part('#cfe4ec');p.fill(g2,haPoly([[14,7],[18,7],[18,14],[14,14]]))},
 shipwright(p){const a=p.part('#5a6070');p.fill(a,haOr(haSeg(12,4,12,19,1.2),haAnd(haEl(12,13,8,7),iaNot(haEl(12,13,6,5.6)),(x,y)=>y>14),haAnd(haEl(12,3.6,2.6,2.6),iaNot(haEl(12,3.6,1.1,1.1))),haSeg(8,8,16,8,.9)))},
 home_claim(p){const s=p.part(IA_WOOD.medium);p.fill(s,haSeg(12,8,12,22,1.2));const b=p.part('#e8d8a8');p.fill(b,haPoly([[4,3],[20,3],[20,11],[4,11]]));p.line(6,6,17,6,'#6b4423');p.line(6,8,14,8,'#6b4423')},
 garden_kit(p){const b=p.part(IA_WOOD.medium);p.fill(b,haPoly([[2,13],[22,13],[21,21],[3,21]]));const s=p.part('#5a3a22');p.fill(s,haPoly([[3,13],[21,13],[21,15.6],[3,15.6]]));const l=p.part('#4caf52');p.fill(l,haOr(haSeg(12,13,12,7,.8),haOEl(9,7,-.8,-.6,3,1.5),haOEl(15,6,.8,-.6,3,1.5)))}};
function paintItem(p,id){const d=ITEM_DRAW[id];
  if(typeof d==='function'){d(p);return true}
  if(Array.isArray(d)){IAF[d[0]](p,typeof d[1]==='function'?{food:d[1]}:d[1]);return true}
  const r=ITEM_ICONS[id];if(r){IAF[r[0]](p,r[1]);return true}
  return false}
// the icon for an item as a 24 x 24 canvas, or null if it has none (furniture uses its own picture, see icon())
function itemArt(id){if(IA_CACHE.has(id))return IA_CACHE.get(id);let cv=null;
  const f=ITEM_FILES[id];
  if(f&&f.complete&&f.naturalWidth){cv=document.createElement('canvas');cv.width=cv.height=IA;cv.getContext('2d').drawImage(f,0,0,IA,IA)}
  else{const p=new HAPainter(IA,IA);if(paintItem(p,id)){cv=document.createElement('canvas');cv.width=cv.height=IA;p.render(cv)}}
  IA_CACHE.set(id,cv);return cv}
