// Round 2: characters, chickens, props and plants in the same detailed style.
(function(){
const H=(a,b)=>{let h=(a*374761393+b*668265263)^0x5bf03635;h=(h^(h>>>13))*1274126177;return (h^(h>>>16))>>>0};
const px=(x,y,c)=>{g.fillStyle=c;g.fillRect(x|0,y|0,1,1)};
const F=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x|0,y|0,w,h)};
const shadow=(cx,cy,rx,ry,a)=>{g.fillStyle='rgba(20,35,10,'+(a||.3)+')';g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,7);g.fill()};
// ---------- characters: shade the existing sprite instead of redrawing it ----------
const CS=CharacterSprite,oDraw=CS.draw,cache=new Map();
const off=document.createElement('canvas');off.width=24;off.height=24;const oc=off.getContext('2d');
function mix(c,f){return[Math.min(255,c[0]*f|0),Math.min(255,c[1]*f|0),Math.min(255,c[2]*f|0)]}
function build(o){
  oc.clearRect(0,0,24,24);oDraw(oc,2,2,o);const im=oc.getImageData(0,0,24,24),d=im.data,W=24;
  const at=(x,y)=>{if(x<0||y<0||x>=W||y>=W)return null;const i=(y*W+x)*4;return d[i+3]?[d[i],d[i+1],d[i+2]]:null};
  const isOL=c=>c&&c[0]===43&&c[1]===33&&c[2]===24;
  const out=new Uint8ClampedArray(d);
  const sk=(o.colors&&o.colors.skin)||'#f1c8a0',SK=[parseInt(sk.slice(1,3),16),parseInt(sk.slice(3,5),16),parseInt(sk.slice(5,7),16)];
  const same=(p,q)=>p&&q&&Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])+Math.abs(p[2]-q[2])<6;
  for(let y=0;y<W;y++)for(let x=0;x<W;x++){const c=at(x,y);if(!c)continue;const i=(y*W+x)*4;
    if(isOL(c)){
      const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>!at(x+a,y+b));
      if(!edge)continue;                                  // eyes, mouth and inner lines stay dark
      let n=null;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const q=at(x+a,y+b);if(q&&!isOL(q)){n=q;break}}
      const t=n?mix(n,.3):[43,33,24];out[i]=t[0];out[i+1]=t[1];out[i+2]=t[2];continue}
    if(same(c,SK))continue;                               // keep faces and hands clean
    const up=at(x,y-1),dn=at(x,y+1);
    let f=1;if(!up||isOL(up))f+=.14;else if(!dn||isOL(dn))f-=.16;
    const t=mix(c,f);out[i]=t[0];out[i+1]=t[1];out[i+2]=t[2]}
  const cv=document.createElement('canvas');cv.width=W;cv.height=W;cv.getContext('2d').putImageData(new ImageData(out,W,W),0,0);
  // eye shine and cheeks on front view
  if((o.view||'f')==='f'){const k=cv.getContext('2d');const dy=(!o.fishing&&(o.frame===1||o.frame===3))?1:0;k.fillStyle='rgba(230,120,110,.55)';k.fillRect(2+5,2+9+dy,1,1);k.fillRect(2+10,2+9+dy,1,1)}
  return cv}
CS.draw=function(ctx,x,y,o){
  if(ctx!==g)return oDraw(ctx,x,y,o);
  const key=JSON.stringify([o.view,o.frame,o.fishing,o.bite,o.jacket,o.pack,o.hat,o.colors,o.fishing?((o.t||0)>>5)&1:0]);
  let cv=cache.get(key);if(!cv){cv=build(o);if(cache.size>400)cache.clear();cache.set(key,cv)}
  shadow(Math.round(x)+8,Math.round(y)+19,6,2,.22);
  ctx.drawImage(cv,Math.round(x)-2,Math.round(y)-2);
};
// ---------- chickens ----------
window.chick=function(c,cx,cy,t){
  const bob=((t/260+c.x)%6<.6?1:0),x=c.x*T-cx+3,y=c.y*T-cy+5+bob,q=(a,b,w,h,col)=>F(c.f?x+10-a-w:x+a,y+b,w,h,col),O='#5a4636';
  shadow(c.x*T-cx+8,c.y*T-cy+15,6,2,.25);
  q(0,3,9,6,O);q(1,4,7,4,'#f8f6ee');q(1,7,7,1,'#e2ddd0');q(1,4,3,1,'#ffffff');
  q(2,5,4,2,'#e8e2d4');q(2,5,3,1,'#f8f6ee');                    // wing
  q(-1,3,2,3,O);q(0,4,1,1,'#e8e2d4');                             // tail
  q(5,0,5,5,O);q(6,1,3,3,'#f8f6ee');q(6,1,2,1,'#ffffff');
  q(6,-1,2,1,'#d83828');q(7,-1,1,1,'#f05848');q(9,2,2,1,'#e8a030');q(9,3,1,1,'#d83828');q(8,2,1,1,'#2a2018');
  q(3,9,1,2,'#e8a030');q(5,9,1,2,'#e8a030');
};
// ---------- props and plants on top of the new grass ----------
const oT=window.tile;
function lantern(sx,sy,t){shadow(sx+8,sy+14,6,2);
  F(sx+5,sy+11,6,4,'#5e5a52');F(sx+5,sy+11,6,1,'#a8a498');F(sx+6,sy+7,4,5,'#8a867c');F(sx+6,sy+7,1,5,'#b0aca0');
  F(sx+4,sy+4,8,4,'#4a463e');F(sx+5,sy+5,6,2,'#ffd86a');F(sx+7,sy+5,2,2,'#fff2b8');
  F(sx+3,sy+2,10,3,'#6e6a62');F(sx+3,sy+2,10,1,'#b8b4a8');F(sx+6,sy,4,2,'#8a867c');
  const gl=g.createRadialGradient(sx+8,sy+6,1,sx+8,sy+6,10);gl.addColorStop(0,'rgba(255,220,130,.35)');gl.addColorStop(1,'rgba(255,220,130,0)');g.fillStyle=gl;g.fillRect(sx-4,sy-6,24,24)}
function fence(tx,ty,sx,sy){const L=v=>v===8;const l=L(at(tx-1,ty)),r=L(at(tx+1,ty)),u=L(at(tx,ty-1)),d=L(at(tx,ty+1));
  shadow(sx+8,sy+14,8,2,.2);
  if(l||r||!(u||d)){for(const yy of[6,10]){F(l?sx:sx+4,sy+yy,(l?4:0)+4+(r?8:4),3,'#3a2414');F(l?sx:sx+4,sy+yy,(l?4:0)+4+(r?8:4),2,'#a8743f');F(l?sx:sx+4,sy+yy,(l?4:0)+4+(r?8:4),1,'#c9965a')}}
  if(u||d){F(sx+6,u?sy:sy+4,4,d?16:12,'#3a2414');F(sx+7,u?sy:sy+4,2,d?16:12,'#a8743f')}
  F(sx+5,sy+3,6,12,'#2a1a0c');F(sx+6,sy+3,4,11,'#8a5a2e');F(sx+6,sy+3,1,11,'#b07a42');F(sx+6,sy+3,4,1,'#c9965a')}
function barrel(sx,sy){shadow(sx+8,sy+14,6,2);F(sx+3,sy+2,10,13,'#2a1a0c');F(sx+4,sy+3,8,11,'#8a5a2e');F(sx+4,sy+3,2,11,'#a8743f');F(sx+10,sy+3,2,11,'#6b4423');
  for(const yy of[5,11])F(sx+3,sy+yy,10,1,'#4a4a52');F(sx+4,sy+2,8,2,'#6b4423');F(sx+5,sy+2,6,1,'#a8743f')}
function stump(sx,sy){shadow(sx+8,sy+14,7,2);F(sx+3,sy+7,10,8,'#2a1a0c');F(sx+4,sy+8,8,6,'#7a5230');F(sx+4,sy+8,2,6,'#8e6236');
  F(sx+3,sy+5,10,4,'#2a1a0c');F(sx+4,sy+5,8,3,'#d8b07a');F(sx+5,sy+6,6,1,'#b88a52');px(sx+8,sy+6,'#9a6e3a');F(sx+2,sy+13,3,2,'#5e3d22');F(sx+11,sy+13,3,2,'#5e3d22')}
function rock(sx,sy,ore){shadow(sx+8,sy+14,7,2);F(sx+2,sy+5,12,10,'#3a3a40');F(sx+3,sy+4,10,10,'#8a8c92');F(sx+3,sy+4,10,3,'#b0b2b8');F(sx+3,sy+11,10,3,'#6a6c72');F(sx+4,sy+4,3,2,'#d0d2d8');
  if(ore){[[5,8],[9,6],[8,10],[11,9]].forEach(([a,b])=>{F(sx+a,sy+b,2,2,ore);px(sx+a,sy+b,'#ffffff')})}}
function flax(sx,sy,n){for(let k=0;k<5;k++){const x=sx+2+k*3,h=8+((n>>k)&3);F(x,sy+14-h,1,h,'#3f7f35');px(x+((k&1)?1:-1),sy+14-h+3,'#78b552');
  F(x-1,sy+12-h,3,3,'#4a7ad8');px(x,sy+12-h,'#8ab0f8');px(x,sy+13-h,'#f4f8ff')}}
function bush(sx,sy,base,hi,lo,berry){shadow(sx+8,sy+14,7,2);g.fillStyle=lo;g.beginPath();g.ellipse(sx+8,sy+10,6.5,5,0,0,7);g.fill();
  g.fillStyle=base;g.beginPath();g.ellipse(sx+7.5,sy+9,5.5,4,0,0,7);g.fill();g.fillStyle=hi;g.beginPath();g.ellipse(sx+6,sy+7.5,3,2,0,0,7);g.fill();
  if(berry)[[5,10],[9,8],[11,11],[7,12]].forEach(([a,b])=>{F(sx+a,sy+b,2,2,berry);px(sx+a,sy+b,'#ffd0c8')})}
function mush(sx,sy,cap,spots){shadow(sx+8,sy+14,5,1.5);F(sx+6,sy+9,4,5,'#e8dcc8');F(sx+6,sy+9,1,5,'#fff8e8');
  g.fillStyle='#3a1e14';g.beginPath();g.ellipse(sx+8,sy+8,6,4,0,Math.PI,0);g.fill();g.fillStyle=cap;g.beginPath();g.ellipse(sx+8,sy+8,5,3.2,0,Math.PI,0);g.fill();
  F(sx+3,sy+8,10,1,'#3a1e14');if(spots)[[5,6],[9,5],[10,7]].forEach(([a,b])=>px(sx+a,sy+b,spots));px(sx+5,sy+5,'rgba(255,255,255,.7)')}
function pond(tx,ty,sx,sy,t){const n=H(tx,ty)%100;F(sx,sy,16,16,'#3f9aa0');
  for(let k=0;k<2;k++){const h=H(tx+k,ty*3),y=(h>>>3)%13+1,x=(h%9)+Math.round(Math.sin(t/800+h)*2);F(sx+x,sy+y,4,1,'#8ad8d0')}
  if(n%3===0){F(sx+4,sy+8,6,4,'#3a8a3a');F(sx+5,sy+8,4,1,'#5ab04a');px(sx+7,sy+10,'#3f9aa0');if(n%2)F(sx+8,sy+8,2,2,'#f8b8d0')}
  if(n%4===1){F(sx+8,sy+5,5,2,'#e8863a');F(sx+12,sy+4,2,4,'#e8863a');px(sx+9,sy+5,'#fff')}
  [[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b],k)=>{if(at(tx+a,ty+b)===9)return;
    for(let j=0;j<16;j+=4){const h=H(tx*7+j,ty+k)%3;const c1='#5e5a52',c2=['#a8a498','#b8b4a8','#989488'][h];
      if(k===0){F(sx+j,sy,4,4,c1);F(sx+j,sy,4,3,c2);px(sx+j,sy,'#d0ccc0')}if(k===1){F(sx+j,sy+12,4,4,c1);F(sx+j,sy+12,4,3,c2)}
      if(k===2){F(sx,sy+j,4,4,c1);F(sx,sy+j,3,4,c2)}if(k===3){F(sx+12,sy+j,4,4,c1);F(sx+13,sy+j,3,4,c2)}}})}
function crops(tx,ty,sx,sy){F(sx,sy,16,16,'#7a4e2c');for(const ry of[2,9]){F(sx,sy+ry+4,16,2,'#5e3a1e');F(sx,sy+ry+3,16,1,'#9a6a40');
  for(let k=0;k<3;k++){const x=sx+1+k*5,c=H(tx*3+k,ty+ry)%4;shadow(x+2.5,sy+ry+4,2.5,1,.25);F(x,sy+ry,4,3,'#3f8a34');F(x+1,sy+ry-1,2,1,'#78c257');px(x,sy+ry,'#5aa83c');
    if(c===0){F(x+1,sy+ry+2,2,2,'#e0762f');px(x+1,sy+ry+2,'#f8a050')}}}}
function wall(sx,sy,tx,ty){F(sx,sy,16,16,'#5e5a52');for(let r=0;r<4;r++){const off=(r%2)*4;for(let c=-1;c<4;c++){const x=sx+c*5+off,h=H(tx*9+c,ty*4+r)%3;
  F(x+1,sy+r*4+1,4,3,['#9a968c','#a8a498','#8a867c'][h]);F(x+1,sy+r*4+1,4,1,'#c4c0b4')}}F(sx,sy+14,16,2,'#3a3630')}
window.tile=function(tx,ty,sx,sy,t){
  const m=M[ty*MW+tx];
  if(zoneOf(tx,ty)!==zoneOf(P.x,P.y)||inRoom(P.x,P.y))return oT(tx,ty,sx,sy,t);
  const deco={7:1,8:1,11:1,14:1,15:1,16:1,17:1,18:1,19:1,20:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1};
  if(m===9)return pond(tx,ty,sx,sy,t);
  if(m===10)return crops(tx,ty,sx,sy);
  if(m===12)return wall(sx,sy,tx,ty);
  if(!deco[m])return oT(tx,ty,sx,sy,t);
  // ground first (reuse the new grass by asking for a plain grass tile at this spot)
  const cnt={1:0,2:0,6:0};[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const v=at(tx+a,ty+b);if(v in cnt)cnt[v]++});const gnd=cnt[2]>cnt[1]&&cnt[2]>=cnt[6]?2:cnt[6]>cnt[1]?6:1;
  const keep=M[ty*MW+tx];M[ty*MW+tx]=gnd;try{oT(tx,ty,sx,sy,t)}finally{M[ty*MW+tx]=keep}
  const n=hs(tx,ty)%100;
  if(m===7)lantern(sx,sy,t);else if(m===8)fence(tx,ty,sx,sy);else if(m===11)barrel(sx,sy);else if(m===14)stump(sx,sy);
  else if(m>=15&&m<=17)rock(sx,sy,['#e08a4a','#d8e8f0','#d8b040'][m-15]);else if(m===18){[[3,9,4],[9,6,3],[8,11,3]].forEach(([a,b,s])=>{F(sx+a,sy+b+1,s,s-1,'#4a4a50');F(sx+a,sy+b,s,s-1,'#9a9ca2');px(sx+a,sy+b,'#c8cad0')})}
  else if(m===19)flax(sx,sy,n);else if(m===20||m===31){F(sx+3,sy+11,1,3,'#8aa05a');F(sx+7,sy+10,1,4,'#8aa05a');F(sx+11,sy+11,1,3,'#8aa05a')}
  else if(m===24)bush(sx,sy,'#3f8a3a','#7cc45a','#2a5a26');else if(m===25)bush(sx,sy,'#1f6a3a','#3f9a5a','#12402a','#d83828');
  else if(m===26)bush(sx,sy,'#5aaa3e','#9ad46a','#3a7a2a');else if(m===27){F(sx+7,sy+3,1,11,'#4f7a2a');[[4,5],[9,7],[4,10],[9,11]].forEach(([a,b])=>{F(sx+a,sy+b,3,2,'#78b552');px(sx+a,sy+b,'#a8dc78')})}
  else if(m===28)mush(sx,sy,'#d83828','#ffffff');else if(m===29)mush(sx,sy,'#d8d8a0','#8a8a60');else if(m===30)mush(sx,sy,'#3a6ad8','#cfe0ff');
};
})();
