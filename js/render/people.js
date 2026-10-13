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
// ---- the spirit: a glowing ghost that sways, with a soft glow and a rippling hem ----
function ghostArt(e,cx,cy,t){const x=e.x*T-cx,y=e.y*T-cy-2+Math.round(Math.sin(t/300)*2),w=t-e.hitAt<250&&((t/60|0)%2),B2=w?'#ffffff':(e.pois>t)?'rgba(180,238,160,.95)':'rgba(225,238,255,.92)',O='rgba(55,65,110,.95)',gw=g.createRadialGradient(x+8,y+7,2,x+8,y+7,16);
  gw.addColorStop(0,e.pois>t?'rgba(160,230,140,.35)':'rgba(190,210,255,.35)');gw.addColorStop(1,'rgba(190,210,255,0)');g.fillStyle=gw;g.fillRect(x-8,y-9,32,32);
  pF(g,x+3,y+16,10,2,'rgba(0,0,0,.2)');pF(g,x+4,y,8,2,O);pF(g,x+2,y+1,12,13,O);pF(g,x+3,y+2,10,12,B2);pF(g,x+5,y+1,6,1,B2);pF(g,x+4,y+3,3,2,'rgba(255,255,255,.7)');
  const wv=(t/180|0)%2;pF(g,x+3,y+12,3,3,B2);pF(g,x+10,y+12,3,3,B2);pF(g,x+6,y+13,4,2,O);pF(g,x+3,y+13+wv,2,2,B2);pF(g,x+11,y+14-wv,2,1,B2);
  pF(g,x+5,y+5,2,3,'#1a1a2a');pF(g,x+9,y+5,2,3,'#1a1a2a');pP(g,x+5,y+5,'#6a7aff');pP(g,x+9,y+5,'#6a7aff');pF(g,x+7,y+10,2,2,'#1a1a2a');
  if(e.hp<e.max){pF(g,x+1,y-5,14,4,'#383838');pF(g,x+2,y-4,12*e.hp/e.max,2,'#58d058')}}

// the giant centipede, about two tiles long: its head stands on the enemy's tile, facing e.f, and its body trails behind in a wave. Drawn from rectangles.
function centipedeArt(e,cx,cy,t){const D4={l:[-1,0],r:[1,0],u:[0,-1],d:[0,1]},dir=D4[e.f]||D4.d,back=[-dir[0],-dir[1]],perp=[-dir[1],dir[0]],hx=e.x*T-cx+8,hy=e.y*T-cy+8;
  const hit=t-e.hitAt<250&&((t/60|0)%2),pz=e.pois>t,N=5,SEG=4,fr=(t/110|0)%2;
  const body=hit?['#ffffff','#ffffff']:pz?['#4f6e22','#6a9632']:['#4e1c12','#7a2f1d'],edge=hit?'#ffffff':pz?'#2e4414':'#2a0e08',leg=hit?'#ffffff':'#f0b030',head=hit?'#ffffff':pz?'#8fb040':'#e0561f',fang='#1c0f08';
  R(hx-10,hy+7,20,3,'rgba(0,0,0,.22)');
  const px0=(d,wob)=>hx+back[0]*d+perp[0]*wob,py0=(d,wob)=>hy+back[1]*d+perp[1]*wob;
  for(let i=N;i>=0;i--){const d=i*SEG+4,wob=Math.sin(t/170+i*.85)*3*(.3+i/N),px=px0(d,wob),py=py0(d,wob),sz=i===N?5:i>N-2?7:8,o=Math.floor(sz/2);
    for(const s of[-1,1]){const j=(i+fr)%2,sw=j?1:0;   // a pair of long legs on each plate, stepping in turn
      if(perp[0])R(px+s*(o)+(s>0?0:-3)+0,py-1+sw,4,2,leg);else R(px-1+sw,py+s*(o)+(s>0?0:-3),2,4,leg)}
    R(px-o,py-o,sz,sz,edge);R(px-o+1,py-o+1,sz-2,sz-2,body[i%2]);R(px-o+1,py-o+1,Math.max(1,sz-3),1,'rgba(255,255,255,.2)')}
  R(hx-5,hy-5,10,10,fang);R(hx-4,hy-4,8,8,head);R(hx-3,hy-4,6,2,'rgba(255,255,255,.25)');
  const E1=[hx+dir[0]*2+perp[0]*-3,hy+dir[1]*2+perp[1]*-3],E2=[hx+dir[0]*2+perp[0]*3,hy+dir[1]*2+perp[1]*3];
  R(E1[0]-1,E1[1]-1,2,2,'#101010');R(E2[0]-1,E2[1]-1,2,2,'#101010');
  const sn=Math.round(Math.sin(t/130)*1);   // the great curved fangs open and snap shut
  for(const s of[-1,1]){const bx=hx+dir[0]*5+perp[0]*s*(3-sn),by=hy+dir[1]*5+perp[1]*s*(3-sn);R(bx-1,by-1,3,3,fang);R(hx+dir[0]*8+perp[0]*s*(2-sn)-1,hy+dir[1]*8+perp[1]*s*(2-sn)-1,2,2,'#c8c0b0')}
  for(const s of[-1,1]){const wv=Math.round(Math.sin(t/200+s)*1);for(const k of[7,10])R(hx+dir[0]*k+perp[0]*(s*(k-3)+wv),hy+dir[1]*k+perp[1]*(s*(k-3)+wv),1,1,leg)}   // feelers
  if(e.hp<e.max){pF(g,hx-8,hy-12,16,4,'#383838');pF(g,hx-7,hy-11,14*e.hp/e.max,2,'#58d058')}}

// a person swinging a pickaxe or an axe at the tile in front of them (playtest #3). The handle and head are drawn pixel by pixel in four beats (raised, raised, struck, rebound) towards the way they face,
// with a spark (pickaxe) or chips (axe) on the strike. `ph` is the beat 0-3. Used by Miner Dell (`work:'pick'`, on a timer) and by the player while mining or chopping (WORK in js/systems/gathering.js).
function toolSwing(kind,sx,sy,f,ph){const th={u:0,r:Math.PI/2,d:Math.PI,l:-Math.PI/2}[f]??Math.PI,a=[th+Math.PI+.35,th+Math.PI+.2,th-.25,th-1.05][ph],
    px=sx+(f==='l'||f==='u'?4:12),py=sy+(f==='u'?9:11),len=kind==='axe'?9:10,sn=Math.sin(a),cs=Math.cos(a),hx=px+len*sn,hy=py-len*cs,nx=cs,ny=sn;
  const px_=[],dot=(x,y,c,w=1,h=1)=>px_.push([Math.round(x),Math.round(y),c,w,h]);   // collect the pixels, then draw every dark outline first and the colours on top
  for(let k=0;k<=len;k++)dot(px+k*sn,py-k*cs,'#a8743f');
  if(kind==='axe'){for(let k=-1;k<=4;k++)for(let j=0;j<=(k<0?1:3);j++)dot(hx+k*nx-j*sn,hy+k*ny+j*cs,k===4?'#e6eaee':'#aab0b8')}
  else{for(let k=-5;k<=5;k++)dot(hx+k*nx,hy+k*ny,Math.abs(k)>3?'#e6eaee':'#b4b8c0',1,2)}
  g.fillStyle='#2a1a0c';px_.forEach(([x,y,,w,h])=>{g.fillRect(x-1,y,w+2,h);g.fillRect(x,y-1,w,h+2)});px_.forEach(([x,y,c,w,h])=>{g.fillStyle=c;g.fillRect(x,y,w,h)});
  if(ph===2){const[dx,dy]=D[f]||[0,1],cx=Math.round(hx+dx*4),cy=Math.round(hy+dy*4);g.fillStyle=kind==='axe'?'#f2d9a0':'#fff2a0';g.fillRect(cx,cy,2,2);g.fillRect(cx+2,cy-2,1,1);g.fillRect(cx-2,cy+2,1,1)}}
const pickSwing=(sx,sy,t,f)=>toolSwing('pick',sx,sy,f||'d',((t/260)|0)%4);   // Miner Dell keeps swinging on a timer
