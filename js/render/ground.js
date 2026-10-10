// ---------- ground and water, drawn in more detail and kept in a cache (graphics step 1.1) ----------
// Grass, sand, dirt paths, piers and the sea floor of every water tile are drawn ONCE into a small offscreen picture and then simply copied onto the screen each frame, so the richer art is
// also cheaper than the old flat colours. Only the sparkles and the foam on the water move, and those are drawn fresh each frame. Art ported from art/graphics/graphics_upgrade_mockup.js.
// groundDirty() empties the cache; call it whenever land or water tiles change while playing (the pirates' ships, the damaged Sky temple). Drawing only: no tile numbers or rules change.
const GCACHE=new Map();
const groundDirty=()=>GCACHE.clear();
const GH=(a,b)=>{let h=(a*374761393+b*668265263)^0x5bf03635;h=(h^(h>>>13))*1274126177;return (h^(h>>>16))>>>0};
const GGR=['#689f42','#71a948','#7ab24e','#84bb55','#5f9640'],GSA=['#e8d39a','#efdcaa','#dcc386','#cfb478','#f5e6be'],GDI=['#c8925a','#ce9a60','#c08a52','#b8824c','#d6a46c'];
const GRAMP=['#56a6dc','#4898d6','#3d8ace','#347dc4','#2e70b8','#2a66ae','#275ea6'];
const gIsW=v=>v===0||v===32,gIsLand=v=>!gIsW(v);
function gpx(c,x,y,col){c.fillStyle=col;c.fillRect(x|0,y|0,1,1)}
function gnoise(c,tx,ty,pal,dens,seed){for(let k=0;k<dens;k++){const h=GH(tx*31+k+seed,ty*17+k*7),x=h%16,y=(h>>>4)%16,col=pal[(h>>>8)%pal.length];gpx(c,x,y,col);if((h>>>12)&1)gpx(c,x+1,y,col)}}
function gcluster(c,tx,ty,pal){for(let by=0;by<16;by+=2)for(let bx=0;bx<16;bx+=2){const gx=tx*8+bx/2,gy=ty*8+by/2,v=Math.sin(gx*.21)+Math.sin(gy*.24)+Math.sin((gx+gy)*.13)+((GH(gx,gy)%100)/100-.5)*.9;
  c.fillStyle=pal[v>1.5?3:v>.5?2:v>-.6?1:v>-1.6?0:4];c.fillRect(bx,by,2,2)}}
function gedge(c,tx,ty,pred,cols,depth){[[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b],k)=>{if(!pred(at(tx+a,ty+b)))return;
  for(let j=0;j<16;j++){const r=GH(tx*13+j+k*5,ty*11+k)%3,e=depth+r-(j%5===0?1:0);
    for(let d=0;d<e;d++){const col=d===e-1?cols[1]:cols[0];if(k===0)gpx(c,j,d,col);if(k===1)gpx(c,j,15-d,col);if(k===2)gpx(c,d,j,col);if(k===3)gpx(c,15-d,j,col)}}})}
// one finished picture per tile, remembered until the tile or its four neighbours change
function gcached(tx,ty,extra,make){const i=ty*MW+tx,m=M[i],sig=m+128*(at(tx,ty-1)+128*(at(tx,ty+1)+128*(at(tx-1,ty)+128*at(tx+1,ty))))+extra*3e14;
  let e=GCACHE.get(i);if(e&&e.sig===sig)return e;
  if(GCACHE.size>4500)GCACHE.clear();
  const cv=document.createElement('canvas');cv.width=16;cv.height=16;const c=cv.getContext('2d');e={sig,cv,near:0};make(c,e);GCACHE.set(i,e);return e}
const gdraw=(e,sx,sy)=>g.drawImage(e.cv,sx|0,sy|0);
// ---- grass ----
function grassPaint(c,tx,ty){gcluster(c,tx,ty,GGR);gnoise(c,tx,ty,['#9ad06a','#4a8232','#7cb54f'],10,3);const n=GH(tx,ty)%100;
  if(n<40){const bx=2+n%11,by=4+(n*3)%9;gpx(c,bx,by+2,'#3f7a2a');gpx(c,bx,by+1,'#4f8a36');gpx(c,bx,by,'#7cb54f');gpx(c,bx+2,by+1,'#3f7a2a');gpx(c,bx+2,by,'#9ad06a');gpx(c,bx-1,by+3,'#2f5f22')}
  if(n>90){const col=['#f8f0a0','#ffffff','#f4a8c8','#a8c8f8'][n%4];gpx(c,4+n%7,5+n%6,col);gpx(c,5+n%7,6+n%6,'#e0a030');gpx(c,3+n%7,6+n%6,col)}}
function grassTile(tx,ty,sx,sy){gdraw(gcached(tx,ty,1,(c)=>grassPaint(c,tx,ty)),sx,sy)}
// ---- sand ----
function sandTile(tx,ty,sx,sy){gdraw(gcached(tx,ty,2,(c)=>{gcluster(c,tx,ty,GSA);gnoise(c,tx,ty,['#c8ae70','#fff2cc','#d8bf86'],14,9);const n=GH(tx,ty)%100;
  if(n<12){gpx(c,n%12+2,(n*5)%11+2,'#f4f0e8');gpx(c,n%12+3,(n*5)%11+2,'#d8c8b0')}if(n>92){gpx(c,5,9,'#e88878');gpx(c,6,9,'#f4a898');gpx(c,5,10,'#c86858')}
  gedge(c,tx,ty,v=>gIsW(v),['#c8ad74','#b89a62'],2);gedge(c,tx,ty,v=>v===1||v===5,['#6ea845','#4f8a36'],2)}),sx,sy)}
// ---- dirt path (the village's stepping stones are big round grey stones set into it) ----
function pathTile(tx,ty,sx,sy){gdraw(gcached(tx,ty,3,(c)=>{gcluster(c,tx,ty,GDI);gnoise(c,tx,ty,['#a87440','#e0b07a'],6,5);const n=GH(tx,ty)%100;
  if(n<30){const x=2+n%11,y=3+(n*7)%10;c.fillStyle='#5e5a52';c.fillRect(x,y+1,3,2);c.fillStyle='#a8a498';c.fillRect(x,y,3,2);gpx(c,x,y,'#d0ccc0')}
  if(n>80){gpx(c,n%13+1,(n*3)%13+1,'#7a7468');gpx(c,(n*7)%13+1,n%11+3,'#b8b2a4')}
  gedge(c,tx,ty,v=>v===1||v===5||v===4,['#6ea845','#4f8a36'],2);
  if((tx===32+OX&&ty%2)||(tx===31+OX&&!(ty%2))){const h=GH(tx,ty),o=h%3-1,rot=(h%5-2)*.08,el=(col,dy,rx,ry,ox)=>{c.fillStyle=col;c.beginPath();c.ellipse(ox,dy,rx,ry,rot,0,7);c.fill()};
    el('rgba(40,30,20,.35)',9,6.5,4.5,8+o);el('#6e6a60',8,6.5,4.6,8+o);el('#a6a296',7.4,5.8,3.8,8+o);el('#c4c0b2',6.2,3.2,1.8,6.5+o);c.fillStyle='#8e8a7e';c.fillRect(9+o,8,3,1);c.fillRect(5+o,9,2,1);
    if(h%4===0){c.fillStyle='#6a9a42';c.fillRect(3+o,9,3,1);c.fillRect(12+o,6,2,1)}}}),sx,sy)}
// ---- water: the sea floor fades from shallow to deep with the distance from land (worked out once); sparkles and foam move ----
function seaBase(c,e,tx,ty,flat){const land=[];if(!flat)for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)if(gIsLand(at(tx+a,ty+b)))land.push([a,b]);
  for(let by=0;by<16;by+=2)for(let bx=0;bx<16;bx+=2){const cx=(bx+1)/16,cy=(by+1)/16;let d=9;
    for(const[a,b]of land){const dx=Math.max(a-cx,0,cx-(a+1)),dy=Math.max(b-cy,0,cy-(b+1));d=Math.min(d,Math.hypot(dx,dy))}
    const w=Math.sin((tx*8+bx/2)*.3)*.18+Math.sin((ty*8+by/2)*.27)*.18+((GH(tx*8+bx,ty*8+by)%7)-3)*.03,k=Math.max(0,Math.min(6,Math.floor((d+w)*2.3)));if(d<1)e.near=1;c.fillStyle=GRAMP[k];c.fillRect(bx,by,2,2)}}
function waterTile(tx,ty,sx,sy,t,flat){const e=gcached(tx,ty,flat?5:4,(c,en)=>seaBase(c,en,tx,ty,flat));gdraw(e,sx,sy);
  const ph=t/900;for(let k=0;k<3;k++){const h=GH(tx*7+k,ty*3+k),y=(h>>>3)%14+1,x0=(h%10)+Math.round(Math.sin(ph+h)*2),w=3+(h>>>6)%4;
    if(Math.sin(ph*2+h%7)>-.2){g.fillStyle=e.near?'#8cc6f0':'#6aa8e6';g.fillRect(sx+x0,sy+y,w,1);g.fillStyle='#bfe2fa';g.fillRect(sx+x0+1,sy+y,1,1)}}
  if(flat)return;
  if(e.foam===undefined){   // the foam along any shore: two small pictures (wave out, wave in), made once
    const sides=[[0,-1],[0,1],[-1,0],[1,0]].map(([a,b])=>{const v=at(tx+a,ty+b);return gIsLand(v)&&v!==3&&tx+a>=0&&ty+b>=0});
    if(!sides.some(Boolean))e.foam=false;else e.foam=[0,1].map(f=>{const cv=document.createElement('canvas');cv.width=16;cv.height=16;const c=cv.getContext('2d');
      sides.forEach((on,k)=>{if(!on)return;for(let j=0;j<16;j++){const r=(GH(tx*5+j,ty*9+k)%3===0?1:0)+f;for(let d=0;d<=r;d++){const col=d===0?'#e8f6ff':'#a8d8f4';
        if(k===0)gpx(c,j,d,col);if(k===1)gpx(c,j,15-d,col);if(k===2)gpx(c,d,j,col);if(k===3)gpx(c,15-d,j,col)}}});return cv})}
  if(e.foam)g.drawImage(e.foam[Math.sin(t/600+tx*.7+ty*.5)>0?1:0],sx|0,sy|0)}
// ---- pier: planks on posts over the water ----
function pierTile(tx,ty,sx,sy,t){const e=gcached(tx,ty,6,(c,en)=>{seaBase(c,en,tx,ty,false);
  c.fillStyle='#1c3a66';c.fillRect(1,2,15,15);c.fillStyle='#3d2a18';c.fillRect(1,0,14,16);
  for(let i=0;i<4;i++){const y=i*4,h=GH(tx,ty*4+i);c.fillStyle=['#a8783f','#b4844a','#9c6e3a'][h%3];c.fillRect(2,y,12,3);c.fillStyle='#c99a5e';c.fillRect(2,y,12,1);c.fillStyle='#7a5228';c.fillRect(2+(h>>>4)%8,y+1,3,1);gpx(c,3,y+1,'#5a3a1e');gpx(c,12,y+1,'#5a3a1e')}
  c.fillStyle='#4a3018';c.fillRect(0,2,2,13);c.fillRect(14,2,2,13);c.fillStyle='#6b4423';c.fillRect(0,2,1,13);c.fillRect(14,2,1,13);
  if(at(tx,ty+1)!==3){c.fillStyle='#e8f6ff';c.fillRect(0,15,2,1);c.fillRect(14,15,2,1)}});gdraw(e,sx,sy)}
