// ---------- people, boats, animals and the spirit, drawn in more detail (graphics step 1.4) ----------
// People: the existing character pictures (CharacterSprite, all its options and colour slots) are shaded once (lit tops, darker undersides, coloured outlines, cheeks and a soft shadow under the feet)
// and the finished picture is copied each frame, which is also much faster than painting every pixel each time. Boats, farm animals, chickens and the spirit are drawn in the same style.
// Art ported from art/graphics/graphics_upgrade_round2.js. Drawing only: where people stand, how they move and every rule are unchanged.
const CSdraw=CharacterSprite.draw,PCACHE=new Map(),poff=document.createElement('canvas');poff.width=24;poff.height=24;const poc=poff.getContext('2d');
const pmix=(c,f)=>[Math.min(255,c[0]*f|0),Math.min(255,c[1]*f|0),Math.min(255,c[2]*f|0)];
function shadePerson(o){poc.clearRect(0,0,24,24);CSdraw(poc,2,2,o);const im=poc.getImageData(0,0,24,24),d=im.data,W=24;
  const at2=(x,y)=>{if(x<0||y<0||x>=W||y>=W)return null;const i=(y*W+x)*4;return d[i+3]?[d[i],d[i+1],d[i+2]]:null};
  const isOL=c=>c&&c[0]===43&&c[1]===33&&c[2]===24,out=new Uint8ClampedArray(d);
  const sk=(o.colors&&o.colors.skin)||'#f1c8a0',SK=[parseInt(sk.slice(1,3),16),parseInt(sk.slice(3,5),16),parseInt(sk.slice(5,7),16)];
  const same=(p,q)=>p&&q&&Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])+Math.abs(p[2]-q[2])<6;
  for(let y=0;y<W;y++)for(let x=0;x<W;x++){const c=at2(x,y);if(!c)continue;const i=(y*W+x)*4;
    if(isOL(c)){const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>!at2(x+a,y+b));if(!edge)continue;
      let n=null;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const q=at2(x+a,y+b);if(q&&!isOL(q)){n=q;break}}
      const t=n?pmix(n,.3):[43,33,24];out[i]=t[0];out[i+1]=t[1];out[i+2]=t[2];continue}
    if(same(c,SK))continue;const up=at2(x,y-1),dn=at2(x,y+1);let f=1;if(!up||isOL(up))f+=.14;else if(!dn||isOL(dn))f-=.16;
    const t=pmix(c,f);out[i]=t[0];out[i+1]=t[1];out[i+2]=t[2]}
  const cv=document.createElement('canvas');cv.width=W;cv.height=W;const k=cv.getContext('2d');k.putImageData(new ImageData(out,W,W),0,0);
  if((o.view||'f')==='f'){const dy=(!o.fishing&&(o.frame===1||o.frame===3))?1:0;k.fillStyle='rgba(230,120,110,.55)';k.fillRect(2+5,2+9+dy,1,1);k.fillRect(2+10,2+9+dy,1,1)}
  return cv}
CharacterSprite.draw=function(ctx,x,y,o){if(ctx!==g)return CSdraw(ctx,x,y,o);
  const key=JSON.stringify([o.view,o.frame,o.fishing,o.bite,o.jacket,o.pack,o.hat,o.style,o.colors,o.fishing?((o.t||0)>>5)&1:0]);
  let cv=PCACHE.get(key);if(!cv){cv=shadePerson(o);if(PCACHE.size>500)PCACHE.clear();PCACHE.set(key,cv)}
  if(!o.noShadow)pShadow(g,Math.round(x)+8,Math.round(y)+19,6,2,.22);
  g.drawImage(cv,Math.round(x)-2,Math.round(y)-2)};
// ---- chickens ----
function chickArt(c,cx,cy,t){const bob=((t/260+c.x)%6<.6?1:0),x=c.x*T-cx+3,y=c.y*T-cy+5+bob,q=(a,b,w,h,col)=>pF(g,c.f?x+10-a-w:x+a,y+b,w,h,col),O='#5a4636';
  pShadow(g,c.x*T-cx+8,c.y*T-cy+15,6,2,.25);
  q(0,3,9,6,O);q(1,4,7,4,'#f8f6ee');q(1,7,7,1,'#e2ddd0');q(1,4,3,1,'#ffffff');q(2,5,4,2,'#e8e2d4');q(2,5,3,1,'#f8f6ee');q(-1,3,2,3,O);q(0,4,1,1,'#e8e2d4');
  q(5,0,5,5,O);q(6,1,3,3,'#f8f6ee');q(6,1,2,1,'#ffffff');q(6,-1,2,1,'#d83828');q(7,-1,1,1,'#f05848');q(9,2,2,1,'#e8a030');q(9,3,1,1,'#d83828');q(8,2,1,1,'#2a2018');q(3,9,1,2,'#e8a030');q(5,9,1,2,'#e8a030')}
// ---- farm animals and pets: cached pictures facing right (mirrored by painting from the other side) ----
function critterSprite(k,col,fl,fr){return sprite('c'+k+col+fl+fr,24,22,c=>{const O='#2a1b0e',W=16,ox=4,oy=4,q=(p,b,w,h,cc)=>pF(c,ox+(fl?W-p-w:p),oy+b,w,h,cc),pq=(p,b,cc)=>q(p,b,1,1,cc);
  pShadow(c,ox+8,oy+14,7,2,.25);
  if(k==='cow'){q(2,10,2,4,O);q(3,10,1,3,'#e8e4da');q(5,10,2,4,O);q(6,10,1,3,'#d8d4c8');q(9,10,2,4,O);q(10,10,1,3,'#e8e4da');q(12,10,2,4,O);q(13,10,1,3,'#d8d4c8');q(2,13,2,1,'#3a2a20');q(9,13,2,1,'#3a2a20');
    q(0,4,1,5,O);q(0,8,1,2,'#6a5a4a');q(1,3,12,8,O);q(2,4,10,6,'#f6f4ee');q(2,4,10,1,'#ffffff');q(2,9,10,1,'#d8d4c8');q(3,4,3,3,'#3a3a3a');q(3,4,1,1,'#5a5a5a');q(8,6,3,3,'#3a3a3a');q(8,6,1,1,'#5a5a5a');
    q(11,2,5,7,O);q(12,3,3,5,'#f6f4ee');q(13,7,3,2,'#e8a8a0');pq(14,8,'#a86058');q(11,1,1,2,'#e8d8a0');q(14,1,1,2,'#e8d8a0');q(11,3,2,1,'#e8a8a0');pq(14,5,O)}
  else if(k==='pig'){q(3,10,2,3,O);q(4,10,1,2,'#f0a0a8');q(9,10,2,3,O);q(10,10,1,2,'#e8909a');q(1,5,1,2,O);pq(0,4,'#e07a86');q(2,4,10,7,O);q(3,5,8,5,'#f4a8b0');q(3,5,8,1,'#fcc8ce');q(3,9,8,1,'#e0909a');
    q(11,4,5,7,O);q(12,5,3,5,'#f4a8b0');q(14,7,2,3,'#e07a86');pq(14,8,'#a04a56');pq(15,8,'#a04a56');q(11,2,3,3,'#e07a86');q(12,3,1,1,'#f4a8b0');pq(13,5,O)}
  else if(k==='sheep'){q(4,10,1,4,O);q(5,10,1,3,'#4a4a4a');q(10,10,1,4,O);q(11,10,1,3,'#4a4a4a');q(1,3,12,8,O);q(2,4,10,6,'#f6f6f0');q(4,2,6,2,'#f6f6f0');q(0,5,2,4,'#f6f6f0');
    for(const[a,b]of[[3,5],[6,4],[9,5],[4,8],[8,8],[11,7]]){q(a,b,2,2,'#ffffff');pq(a,b+1,'#dcdcd2')}q(2,9,10,1,'#d6d6cc');
    q(12,5,4,6,O);q(13,6,2,4,'#4a4a4a');pq(14,7,'#ffffff');q(12,4,2,1,'#f6f6f0')}
  else if(k==='dog'){const cc=col;q(3,9,2,4,O);q(3,9,1,3,cc);q(8,9,2,4,O);q(8,9,1,3,cc);q(2,4,9,6,O);q(3,5,7,4,cc);q(3,5,7,1,'rgba(255,255,255,.25)');q(3,8,7,1,'rgba(0,0,0,.2)');
    q(9,2,5,6,O);q(10,3,3,4,cc);q(9,2,2,3,'#4a2e18');q(13,4,1,1,O);q(11,6,3,2,'#e8d8c0');pq(13,6,O);q(0,3+fr,3,1,O);pq(1,3+fr,cc)}
  else if(k==='cat'){const cc=col;q(3,10,2,3,O);q(7,10,2,3,O);q(2,6,8,5,O);q(3,7,6,3,cc);q(3,7,6,1,'rgba(255,255,255,.28)');q(3,9,6,1,'rgba(0,0,0,.2)');q(9,3,5,6,O);q(10,4,3,4,cc);q(9,2,1,2,O);q(13,2,1,2,O);pq(10,2,cc);pq(13,2,cc);
    pq(11,5,'#3a8a3a');pq(12,5,'#3a8a3a');pq(12,7,'#e8a0a0');q(0,3+fr,2,1,O);q(0,4,1,6,O);q(1,5,1,3,cc);for(const y of[7,9])q(5,y,1,1,'rgba(0,0,0,.25)')}
  else{q(7,5,2,10,O);q(3,3,10,3,O);q(4,4,8,1,'#d8b878');q(5,6,6,5,O);q(6,6,4,4,'#d8b878');q(6,0,4,4,O);q(7,1,2,2,'#d8b878');q(5,13,6,2,O)}})}
function critterArt(a,cx,cy,t){const bob=((t/300+a.x*3)%7<.5)?1:0,fr=((t/180)|0)%2;g.drawImage(critterSprite(a.k,a.c||'',a.f?1:0,a.k==='dog'||a.k==='cat'?fr:0),(a.x*T-cx|0)-4,(a.y*T-cy+bob|0)-4)}
// ---- boats: rowboat (brown), sloop (blue and white), trawler (red); bow toward the way you sail ----
const BOATC=[{d:'#3a2210',m:'#a8703a',s:'#7a4a26',h:'#c99a5e',t:'#e8c898'},{d:'#10243a',m:'#4a82b8',s:'#2f5f8e',h:'#8ab8e0',t:'#f2f6fa'},{d:'#2a1212',m:'#b04a3c',s:'#7a2e24',h:'#d8806c',t:'#e8d8b0'}];
const BOATROWS=[[2,9],[1,12],[0,14],[0,15],[0,16],[0,15],[0,14],[1,12],[2,9]];   // [first column, one past the last] of each hull row (y 3 to 11), bow to the right
function boatSprite(tier,dir,part){return sprite('b'+tier+dir+part,32,32,c=>{const C=BOATC[tier]||BOATC[0],ox=8,oy=8,f=(x,y,w,h,col)=>pF(c,x,y,w,h,col);c.translate(ox+8,oy+7);
    if(dir==='l')c.scale(-1,1);else if(dir==='u')c.rotate(-Math.PI/2);else if(dir==='d')c.rotate(Math.PI/2);c.translate(-8,-7);
    const from=part==='front'?5:0;
    BOATROWS.forEach(([a,b],i)=>{if(i<from)return;f(a-1,3+i,b-a+2,1,C.d);if(i===0)f(a,2,b-a,1,C.d);if(i===8)f(a,12,b-a,1,C.d)});
    BOATROWS.forEach(([a,b],i)=>{if(i<from)return;f(a,3+i,b-a,1,i<=1?C.h:i<=5?C.m:i<=7?C.s:C.d)});
    if(part==='back'){for(let x=3;x<14;x+=3)f(x,5,1,4,C.s);f(2,5,3,3,C.t);f(5,4,10,1,C.h);
      if(tier===1){f(3,3+1,11,1,C.t);f(5,6,8,1,C.t)}if(tier===2){f(8,5,4,4,C.d);f(9,6,2,2,'#ffd86a');f(3,10,10,1,C.h)}}
    else f(1,8,12,1,C.h)})}
function boatArt(tier,vert,dir,bx,by,part){const s=boatSprite(tier,dir,part);g.drawImage(s,(bx|0)-8,(by|0)-8)}
// ---- the spirit: a glowing ghost that sways, with a soft glow and a rippling hem ----
function ghostArt(cx,cy,t){const x=G.x*T-cx,y=G.y*T-cy-2+Math.round(Math.sin(t/300)*2),w=t-G.hitAt<250&&((t/60|0)%2),B2=w?'#ffffff':(G.pois>t)?'rgba(180,238,160,.95)':'rgba(225,238,255,.92)',O='rgba(55,65,110,.95)',gw=g.createRadialGradient(x+8,y+7,2,x+8,y+7,16);
  gw.addColorStop(0,G.pois>t?'rgba(160,230,140,.35)':'rgba(190,210,255,.35)');gw.addColorStop(1,'rgba(190,210,255,0)');g.fillStyle=gw;g.fillRect(x-8,y-9,32,32);
  pF(g,x+3,y+16,10,2,'rgba(0,0,0,.2)');pF(g,x+4,y,8,2,O);pF(g,x+2,y+1,12,13,O);pF(g,x+3,y+2,10,12,B2);pF(g,x+5,y+1,6,1,B2);pF(g,x+4,y+3,3,2,'rgba(255,255,255,.7)');
  const wv=(t/180|0)%2;pF(g,x+3,y+12,3,3,B2);pF(g,x+10,y+12,3,3,B2);pF(g,x+6,y+13,4,2,O);pF(g,x+3,y+13+wv,2,2,B2);pF(g,x+11,y+14-wv,2,1,B2);
  pF(g,x+5,y+5,2,3,'#1a1a2a');pF(g,x+9,y+5,2,3,'#1a1a2a');pP(g,x+5,y+5,'#6a7aff');pP(g,x+9,y+5,'#6a7aff');pF(g,x+7,y+10,2,2,'#1a1a2a');
  if(G.hp<G.max){pF(g,x+1,y-5,14,4,'#383838');pF(g,x+2,y-4,12*G.hp/G.max,2,'#58d058')}}
