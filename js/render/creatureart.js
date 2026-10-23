// ---------- detailed battle pictures for creatures and pirates (Jack: the same detail as the people, FireRed Pokemon as the reference) ----------
// Each creature is painted with the painter from js/render/heroart.js (shaded parts, coloured outlines) in a lively pose: the ghost drifts with its arms up and mouth open, the centipede coils
// and rears, the shark lunges out of a splash with its jaws open, the squid looms with curling tentacles, the rock dragon snarls with fire in its mouth, and the zombie shambles with its hands up.
// The pirates you fight are full detailed people (js/data/portraits.js designs or a pirate look) holding a cutlass or, for gunners, a pistol. The small sprites on the map are not changed.
// CREATURE_FILES[art] can hold an image file to use instead. creatureArt(art, name) gives the canvas (cached).
const CREATURE_FILES={},CR_CACHE=new Map();
const GHOST_COL={'Spirit':'#cfe6ff','Restless spirit':'#c4f0cc','Wailing ghost':'#d4baf4'};
const CREATURES={
 ghost:{w:48,h:52,paint(p,name){const c=GHOST_COL[name]||'#cfe6ff',b=p.part(c);
   p.fill(b,haOr(haEl(24,20,14,15),haPoly([[11,24],[37,24],[34,36],[39,45],[30,40],[26,50],[22,40],[13,45],[15,34]]),haOEl(8.5,20,.5,-.86,5,3),haOEl(39.5,19,-.5,-.86,5,3)));
   const ey=p.part('#1a1430');p.fill(ey,haOr(haEl(18.5,17,3,4.4),haEl(29.5,17,3,4.4)));const m=p.part('#3a1a4a');p.fill(m,haEl(24,27.5,4,5));const t=p.part('#d84a6a',{flat:1});p.fill(t,haEl(24,30,2.4,1.6));
   p.dot(17,15,'#ffffff');p.dot(28,15,'#ffffff');p.rect(18,15,1,1,'#ffffff');[[6,8],[41,9],[9,38],[42,32],[24,2]].forEach(([x,y])=>{p.dot(x,y,haMix(c,'#ffffff',.6));p.dot(x+1,y,c)});p.line(14,10,18,7,'#ffffff')}},
 centipede:{w:64,h:44,paint(p){const pts=[];for(let i=0;i<=11;i++){const t=i/11;pts.push([52-46*t,12+22*t+Math.sin(t*Math.PI*2)*4])}
   const leg=p.part('#3a1a10',{flat:1});pts.slice(1).forEach(([x,y],i)=>{p.fill(leg,haOr(haSeg(x,y,x-2.5,y+7.5,.7),haSeg(x,y,x+2.2,y+7,.7)))});
   const A=p.part('#8a2a1a'),B=p.part('#d8582a');pts.slice(1).reverse().forEach(([x,y],i)=>p.fill(i%2?A:B,haEl(x,y,4.6-(pts.length-1-i)*.0,4.2)));
   const hd=p.part('#6a1a10');p.fill(hd,haEl(54,11,6,5));const mn=p.part('#e8c24a');p.fill(mn,haOr(haTaper(57,14,61,18,1.3,.4),haTaper(52,15,50,20,1.3,.4)));
   const an=p.part('#3a1a10',{flat:1});p.fill(an,haOr(haSeg(52,7,47,1,.6),haSeg(56,7,61,1,.6)));p.rect(55,9,2,2,'#f2e04a');p.rect(51,9,2,2,'#f2e04a');p.dot(55,9,'#ffffff');
   pts.slice(1).forEach(([x,y])=>p.line(Math.round(x-3),Math.round(y-2),Math.round(x+2),Math.round(y-3),'#f08a4a'))}},
 shark:{w:64,h:40,paint(p){const sp=p.part('#cfe8f4');p.fill(sp,haOr(haEl(12,35,10,3.6),haEl(44,36,12,3.2),haEl(26,37,8,2.6)));
   const top=p.part('#5a7a9a');p.fill(top,haOr(haEl(31,20,22,9),haPoly([[2,7],[11,19],[2,31],[6,19]]),haPoly([[25,13],[33,1],[38,12]]),haPoly([[30,25],[22,35],[37,27]])));
   const bel=p.part('#eef2f4');p.fill(bel,haAnd(haEl(31,20,22,9),(x,y)=>y>21+(x-31)*.05));
   const mo=p.part('#4a1a24');p.fill(mo,haPoly([[44,20],[57,15],[58,26]]));const th=p.part('#ffffff',{flat:1});[[47,19],[50,18],[53,17],[48,22],[51,23],[54,24]].forEach(([x,y],i)=>p.fill(th,haPoly(i<3?[[x,y],[x+1.6,y],[x+.8,y+2]]:[[x,y],[x+1.6,y],[x+.8,y-2]])));
   p.rect(45,14,2,2,'#1a1418');p.dot(45,14,'#ffffff');[[39,17],[40,19],[41,21]].forEach(([x,y])=>p.line(x,y,x,y+3,'#3a5a7a'));p.line(14,15,40,12,'#8aaac8')}},
 squid:{w:56,h:60,paint(p){const tc=p.part('#a83a4a');const T=(x0,y0,dir,len,amp)=>{let x=x0,y=y0;for(let i=0;i<len;i++){const nx=x+dir*.9+Math.sin(i*.55)*amp,ny=y+2.2;p.fill(tc,haTaper(x,y,nx,ny,2.6-i*.13,2.5-(i+1)*.13));x=nx;y=ny}};
   [[20,32,-1,12,.6],[24,33,-.4,13,.8],[32,33,.4,13,-.8],[36,32,1,12,-.6],[22,33,-1.6,9,1.2],[34,33,1.6,9,-1.2]].forEach(a=>T(...a));
   const ma=p.part('#c84a5a');p.fill(ma,haOr(haEl(28,24,12,14),haPoly([[18,12],[28,0],[38,12]]),haPoly([[16,10],[9,16],[18,20]]),haPoly([[40,10],[47,16],[38,20]])));
   const ey=p.part('#f2d84a');p.fill(ey,haEl(28,28,5.2,5.2));const pu=p.part('#1a1018',{flat:1});p.fill(pu,haEl(28,28,1.4,4.2));p.dot(26,26,'#ffffff');
   [[22,16],[33,14],[24,22],[34,22],[28,10]].forEach(([x,y])=>{p.dot(x,y,'#7a2030');p.dot(x+1,y,'#e8788a')});for(let y=40;y<58;y+=4){p.dot(18,y,'#f0b0b8');p.dot(38,y-2,'#f0b0b8')}}},
 dragon:{w:64,h:44,paint(p){const st='#7a7470',lg=p.part(st);[[22,28,18,40],[30,29,29,40],[42,28,44,40],[50,27,53,39]].forEach(([a,b,c,d])=>p.fill(lg,haOr(haTaper(a,b,c,d,3.4,2.4),haEl(c-1,d+.5,3.2,1.8))));
   const tl=p.part(st);p.fill(tl,haOr(haTaper(52,24,63,13,5,1),haTaper(48,22,55,22,5,5)));
   const bd=p.part(st);p.fill(bd,haOr(haEl(36,23,17,8),haTaper(22,22,13,17,6.5,5)));const hd=p.part('#8a8480');p.fill(hd,haOr(haEl(11,17,7.5,5.6),haPoly([[3,15],[10,13],[10,20],[2,19]])));
   const jw=p.part('#3a1a10');p.fill(jw,haPoly([[1.5,18],[9,18.5],[9,21],[2,22]]));const fi=p.part('#f2a03a',{flat:1});p.fill(fi,haEl(3.5,20,2.6,1.4));p.dot(2,20,'#ffe080');
   const sp=p.part('#5a5450');[[24,15],[30,13.5],[36,13],[42,13.5],[48,15]].forEach(([x,y])=>p.fill(sp,haPoly([[x-2.5,y+2.5],[x,y-3.5],[x+2.5,y+2.5]])));
   p.rect(10,14,2,2,'#f2c83a');p.dot(10,14,'#ffffff');[[28,22,33,25],[38,20,41,24],[46,24,48,28],[18,19,21,22]].forEach(([a,b,c,d])=>p.line(a,b,c,d,'#e8783a'));
   [[26,18],[33,17],[40,18],[45,20],[30,25]].forEach(([x,y])=>p.dot(x,y,'#a8a29c'))}}};
// zombies are people: painted with paintHero in a shambling pose
const ZOMBIE_SPEC={sex:'m',pose:'zombie',hair:'messy',top:'tee',over:null,acc:['zombie'],col:{skin:'#8aa878',hair:'#3a3a2a',shirt:'#6a5a4a',jacket:'#4a4a3a',hat:'#4a4a3a',pants:'#4a4a3a',boots:'#3a2a20',eye:'#e0e0c0'}};
function creatureArt(art,name){const k=art+'|'+(name||'');if(CR_CACHE.has(k))return CR_CACHE.get(k);let cv=null;const f=CREATURE_FILES[art];
  if(f&&f.complete&&f.naturalWidth){cv=document.createElement('canvas');cv.width=f.naturalWidth;cv.height=f.naturalHeight;cv.getContext('2d').drawImage(f,0,0)}
  else if(art==='zombie')cv=heroCanvas('zombie',ZOMBIE_SPEC,'f');
  else if(CREATURES[art]){const C=CREATURES[art],p=new HAPainter(C.w,C.h);C.paint(p,name);cv=document.createElement('canvas');cv.width=C.w;cv.height=C.h;p.render(cv)}
  CR_CACHE.set(k,cv);return cv}
// a pirate (or anyone) you fight: their portrait design if they have one, otherwise a pirate built from their battle look; gunners hold a pistol, the rest a cutlass
function foeArt(t){const des=NPC_ART[t.n],L=lo(t.look||{}),cl=L.colors||{},gun=/pistol|fires|shoot/.test(t.atk||'');
  const base=des?{...des,col:{eye:'#3a2a20',pants:'#4a4a58',boots:'#3a2a20',skin:cl.skin,hair:cl.hair,shirt:cl.shirt,jacket:cl.jacket,hat:cl.hat,...(des.col||{})}}
    :{sex:'m',hair:{long:'long',bun:'bun',ponytail:'ponytail',spiky:'messy',bald:'bald'}[L.style]||'crop',top:'stripes',over:t.look&&t.look.jon!==false?'vest':null,build:/brute|bruiser/i.test(t.n)?'stout':undefined,
      acc:['bandana',t.hp>40?'beard':'stubble'],col:{skin:cl.skin||'#e0ac84',hair:cl.hair||'#3a2a20',shirt:cl.shirt||'#3a5a9a',jacket:cl.jacket||'#4a3a2a',hat:'#a82a2a',eye:'#3a2a20',pants:'#4a4a58',boots:'#3a2a20'}};
  const spec={...base,pose:gun?'aim':'fight'};return heroCanvas('foe_'+t.n+(gun?'_g':''),spec,'f',t.look&&t.look.armour)}
