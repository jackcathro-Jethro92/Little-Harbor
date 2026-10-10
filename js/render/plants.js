// ---------- trees and plants, drawn in more detail (graphics step 1.2) ----------
// Trees (three woods, the pink blossom tree and the apple tree) and the small plants (bushes, holly, basil, moss, forest sprigs, the three mushrooms, flax, tall grass, picked patches)
// are drawn once into small offscreen pictures and copied each frame, like the ground (js/render/ground.js). Art ported from art/graphics/graphics_upgrade_mockup.js and
// graphics_upgrade_round2.js. Drawing only: which tile is a tree or a herb, and how they are gathered, is unchanged.
const SPRC=new Map();
function sprite(key,w,h,paint){let cv=SPRC.get(key);if(cv)return cv;if(SPRC.size>400)SPRC.clear();
  cv=document.createElement('canvas');cv.width=w;cv.height=h;paint(cv.getContext('2d'));SPRC.set(key,cv);return cv}
const pF=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)},pP=(c,x,y,col)=>pF(c,x,y,1,1,col);
const pShadow=(c,cx,cy,rx,ry,a)=>{c.fillStyle='rgba(20,35,10,'+(a||.3)+')';c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,7);c.fill()};
// ---- trees: a 32 x 32 picture whose tile's top-left corner is at (8,14) ----
const TREE_PAL={pink:['#e9a7bd','#f8c8d8','#c27896','#6a2f48','#fff0f4'],soft:['#5e9e3e','#7cbc52','#3f7a2c','#1f3f16','#a8dc78'],medium:['#4a8638','#68a44a','#2f6626','#173414','#8ec668'],hard:['#2f6f4a','#468a5e','#1d4f34','#0f2a1c','#6cae80']};
function canopy(c,cx,cy,r,P,seed){const[mid,hi,lo,ol,hi2]=P;
  for(let y=-r-1;y<=r+1;y++)for(let x=-r-1;x<=r+1;x++){const d=Math.hypot(x,y*1.05);if(d>r+.6)continue;if(d>r-.4){pP(c,cx+x,cy+y,ol);continue}
    const l=(-x-y)/(r*1.6)+((GH(cx+x+seed,cy+y)%100)/100-.5)*.5;pP(c,cx+x,cy+y,l>.55?hi2:l>.15?hi:l<-.45?lo:mid)}}
function treeSprite(wood,pk,fruit,v){return sprite('t'+wood+pk+fruit+v,32,32,c=>{const ox=8,oy=14,P=TREE_PAL[pk?'pink':wood],s=v*53;
  pShadow(c,ox+8,oy+14,11,4,.32);
  pF(c,ox+5,oy+5,6,11,'#2a1a0c');pF(c,ox+6,oy+5,4,10,'#6e4826');pF(c,ox+6,oy+5,1,10,'#8e6236');pF(c,ox+9,oy+5,1,10,'#4e3018');pP(c,ox+7,oy+9,'#4e3018');pP(c,ox+8,oy+12,'#4e3018');
  pF(c,ox+3,oy+14,10,2,'#2a1a0c');pF(c,ox+4,oy+14,2,1,'#6e4826');pF(c,ox+10,oy+14,2,1,'#6e4826');
  const o=[[[2,2],[14,2],[8,4],[8,-4]],[[2,3],[14,2],[8,4],[7,-4]],[[3,2],[13,3],[8,4],[9,-4]],[[2,2],[14,3],[8,5],[8,-3]]][v%4],r=[6,6,6,7];
  [0,1,2,3].forEach(k=>canopy(c,ox+o[k][0],oy+o[k][1],r[k],P,s));
  if(pk)[[4,-1],[11,-4],[8,3],[13,1],[3,3],[7,-6]].forEach(([a,b])=>pP(c,ox+a,oy+b,'#ffffff'));
  else if(fruit)[[5,-2],[11,1],[8,5]].forEach(([a,b])=>{pP(c,ox+a,oy+b,'#d84a3a');pP(c,ox+a,oy+b-1,'#f08070')})})}
function treeArt(tx,ty,sx,sy){const n=hs(tx,ty)%100,sh=SHAKE[ty*MW+tx];if(sh&&performance.now()-sh<220)sx+=((performance.now()/40|0)%2?1:-1);
  if(n%7===0&&n%2){const c='#7a5230',o='#2e1f10';R(sx-1,sy+11,18,5,'#00000026');R(sx+6,sy+2,4,14,o);R(sx+7,sy+3,2,13,c);R(sx+7,sy-2,2,6,c);R(sx+3,sy,5,2,c);R(sx+9,sy+1,5,2,c);R(sx+2,sy-3,2,4,c);R(sx+12,sy-2,2,4,c);return}
  g.drawImage(treeSprite(wood(tx,ty),n%5===0?1:0,n%3===0?1:0,(n>>1)%4),(sx|0)-8,(sy|0)-14)}
// ---- small plants: 16 x 16 pictures (drawn over the grass) ----
function bushPaint(c,base,hi,lo,berry){pShadow(c,8,14,7,2);c.fillStyle=lo;c.beginPath();c.ellipse(8,10,6.5,5,0,0,7);c.fill();c.fillStyle=base;c.beginPath();c.ellipse(7.5,9,5.5,4,0,0,7);c.fill();
  c.fillStyle=hi;c.beginPath();c.ellipse(6,7.5,3,2,0,0,7);c.fill();if(berry)[[5,10],[9,8],[11,11],[7,12]].forEach(([a,b])=>{pF(c,a,b,2,2,berry);pP(c,a,b,'#ffd0c8')})}
function mushPaint(c,cap,spots){pShadow(c,8,14,5,1.5);pF(c,6,9,4,5,'#e8dcc8');pF(c,6,9,1,5,'#fff8e8');c.fillStyle='#3a1e14';c.beginPath();c.ellipse(8,8,6,4,0,Math.PI,0);c.fill();
  c.fillStyle=cap;c.beginPath();c.ellipse(8,8,5,3.2,0,Math.PI,0);c.fill();pF(c,3,8,10,1,'#3a1e14');[[5,6],[9,5],[10,7]].forEach(([a,b])=>pP(c,a,b,spots));pP(c,5,5,'rgba(255,255,255,.7)')}
function plantArt(m,n,sx,sy){
  const spr=(key,paint)=>g.drawImage(sprite(key,16,16,paint),sx|0,sy|0);
  if(m===24)spr('p24',c=>bushPaint(c,'#3f8a3a','#7cc45a','#2a5a26'));
  else if(m===25)spr('p25',c=>bushPaint(c,'#1f6a3a','#3f9a5a','#12402a','#d83828'));
  else if(m===26)spr('p26',c=>bushPaint(c,'#5aaa3e','#9ad46a','#3a7a2a'));
  else if(m===27)spr('p27',c=>{pShadow(c,8,14,5,1.5);pF(c,7,3,1,11,'#4f7a2a');[[4,5],[9,7],[4,10],[9,11]].forEach(([a,b])=>{pF(c,a,b,3,2,'#78b552');pP(c,a,b,'#a8dc78')})});
  else if(m>=28&&m<=30)spr('p'+m,c=>mushPaint(c,['#d83828','#d8d8a0','#3a6ad8'][m-28],['#ffffff','#8a8a60','#cfe0ff'][m-28]));
  else if(m===19)spr('p19'+(n&15),c=>{pShadow(c,8,14,6,2,.2);for(let k=0;k<5;k++){const x=2+k*3,h=8+((n>>k)&3);pF(c,x,14-h,1,h,'#3f7f35');pP(c,x+((k&1)?1:-1),14-h+3,'#78b552');pF(c,x-1,12-h,3,3,'#4a7ad8');pP(c,x,12-h,'#8ab0f8');pP(c,x,13-h,'#f4f8ff')}});
  else if(m===20)spr('p20',c=>{pF(c,3,11,1,3,'#8aa05a');pF(c,7,10,1,4,'#8aa05a');pF(c,11,11,1,3,'#8aa05a');pP(c,3,11,'#a8bc72');pP(c,7,10,'#a8bc72')});
  else if(m===31)spr('p31',c=>{pF(c,4,11,3,2,'#6e8a4a');pF(c,9,12,2,1,'#6e8a4a');pP(c,4,11,'#8aa860')});
  else if(m===47)spr('p47'+(n&7),c=>{for(let k=0;k<7;k++){const h=8+((n+k*3)&3),x=1+k*2,top=14-h-((n+k)%3);pF(c,x,top,1,14-top,k%2?'#1f5a2a':'#2f7a3a');pF(c,x,top,1,2,'#6cc060');pP(c,x+(k%2?1:-1),top+3,'#3f8a3a')}})}
const bushArt=(sx,sy)=>g.drawImage(sprite('pb',16,16,c=>bushPaint(c,'#5b8f3a','#78ad4e','#43702e')),sx|0,sy|0);
