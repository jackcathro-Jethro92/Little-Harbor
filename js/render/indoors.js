// ---------- the Darkwood and the home room, drawn in more detail (graphics step 1.6) ----------
// The Darkwood: a mossy forest floor with leaf litter and roots, dense dark trees, a packed-earth trail and a few fireflies drifting about. The home room: boards with grain, a rug,
// panelled walls with a curtained window and warm light on the floor, and a framed door. Everything is drawn once into small cached pictures (`gcached` in js/render/ground.js, `sprite` in
// js/render/plants.js); only the fireflies move. Drawing only: nothing about the rooms' size, doors or rules changes.
const DWPAL=['#1b3322','#203a28','#26452f','#17291d','#2b4f36'],DWTRAIL=['#4a3a2c','#54422f','#3e3024','#5c4a36','#352a20'];
function forestFloor(tx,ty,sx,sy){gdraw(gcached(tx,ty,7,c=>{gcluster(c,tx,ty,DWPAL);const n=GH(tx,ty)%100;
  for(let k=0;k<7;k++){const h=GH(tx*7+k,ty*5+k),x=h%15,y=(h>>>4)%15;gpx(c,x,y,['#4a5a2a','#6a5030','#3a4a2a','#2f6a3f','#5a4028'][(h>>>8)%5]);if(k%3===0)gpx(c,x+1,y,'#3a2a18')}
  if(n<14){const x=2+n%10,y=3+(n*3)%9;for(let k=0;k<4;k++)gpx(c,x+k,y+(k>1?1:0),'#3a6a3a');gpx(c,x+1,y-1,'#4f8a4a')}
  if(n>=14&&n<24){const x=3+n%8,y=5+n%6;c.fillStyle='#2a1c10';c.fillRect(x,y,6,1);c.fillRect(x+5,y+1,3,1);c.fillStyle='#5a4028';c.fillRect(x,y-1,5,1)}
  if(n>=24&&n<30){const x=4+n%8,y=6+n%5;for(let k=0;k<3;k++){gpx(c,x+k*2,y,'#6ac8a8');gpx(c,x+k*2,y+1,'#2a6a58')}}   // a few glowing spores
  }),sx,sy)}
function thickTree(tx,ty,sx,sy,n){g.drawImage(sprite('dt'+(n%4),16,16,c=>{pF(c,0,0,16,16,'#0c1a10');const P=['#1f4a2c','#2f6a3f','#143822','#08140c','#4a8a55'],s=(n%4)*41;
  canopy(c,4,4,5,P,s);canopy(c,12,5,5,P,s+9);canopy(c,8,11,6,P,s+17);canopy(c,3,13,4,P,s+3);canopy(c,13,13,4,P,s+5);canopy(c,8,3,4,P,s+11);
  pF(c,6+n%3,8,2,4,'#2a1c10')}),sx|0,sy|0)}
function forestTrail(tx,ty,sx,sy,n){gdraw(gcached(tx,ty,8,c=>{gcluster(c,tx,ty,DWTRAIL);for(let k=0;k<5;k++){const h=GH(tx*3+k,ty*11+k),x=h%14,y=(h>>>4)%14;pF(c,x,y,2,1,'#2a1f16');gpx(c,x,y-1,'#6a5a46');if(k===0){pF(c,x+2,y+1,2,1,'#6a5a46')}}
  if(n%9===0){pF(c,2+n%8,6,5,1,'#2a1c10');pF(c,6+n%6,7,3,1,'#5a4028')}
  gedge(c,tx,ty,v=>v===41,['#17291d','#0e1f14'],2)}),sx,sy)}
function fireflies(cx,cy,t){for(let k=0;k<14;k++){const h=GH(k*7,3),x=P.rx+((h%15)-7)+Math.sin(t/1700+k*2.1)*2.2,y=P.ry+(((h>>>5)%11)-5)+Math.cos(t/1300+k*1.7)*1.8,on=.35+.65*Math.max(0,Math.sin(t/600+k*1.3));
  const px=x*T+8-cx,py=y*T+8-cy;if(on<.2)continue;const gr=g.createRadialGradient(px,py,0,px,py,6);gr.addColorStop(0,'rgba(232,240,122,'+(.5*on).toFixed(2)+')');gr.addColorStop(1,'rgba(232,240,122,0)');g.fillStyle=gr;g.fillRect(px-6,py-6,12,12);
  g.fillStyle='rgba(250,255,190,'+on.toFixed(2)+')';g.fillRect(px|0,py|0,2,2)}}
// ---- the home room: 21 floor, 22 wall, 23 door ----
function homeArt(m,tx,ty,sx,sy,n){const top=ty===IR.y0,bot=ty===IR.y1,left=tx===IR.x0,right=tx===IR.x1,rug=tx>=IR.x0+3&&tx<=IR.x1-3&&ty>=IR.y0+3&&ty<=IR.y1-3;
  const key=m===21?'hf'+(rug?'r'+(tx===IR.x0+3?'l':tx===IR.x1-3?'r':'m')+(ty===IR.y0+3?'t':ty===IR.y1-3?'b':'m'):'p'+(ty&1)+(n%3)):m===22?'hw'+(top?'t'+(tx%3===0?'w':'p'):bot?'b':left?'l':right?'r':'x'):'hd';
  g.drawImage(sprite(key,16,16,c=>{
    if(m===21){pF(c,0,0,16,16,'#c49a62');const off=(ty&1)*5;for(let r=0;r<4;r++){pF(c,0,r*4+3,16,1,'#a97f4a');pF(c,(off+r*4)%16,r*4,1,3,'#a97f4a')}
      for(let k=0;k<3;k++){const h=GH(tx*5+k,ty*3);pF(c,h%12+1,(h>>>4)%13+1,3,1,k%2?'#d6b27a':'#b28850')}pF(c,0,0,16,1,'rgba(255,255,255,.07)');
      if(rug){const l=tx===IR.x0+3,r=tx===IR.x1-3,t2=ty===IR.y0+3,b=ty===IR.y1-3;pF(c,l?2:0,t2?2:0,16-(l?2:0)-(r?2:0),16-(t2?2:0)-(b?2:0),'#8a2e2a');
        pF(c,l?3:0,t2?3:0,16-(l?3:0)-(r?3:0),1,'#d8b060');if(b)pF(c,l?3:0,12,16-(l?3:0)-(r?3:0),1,'#d8b060');
        if(!l&&!r&&!t2&&!b){pF(c,4,4,8,8,'#a8423a');pF(c,5,5,6,6,'#c8683c');pF(c,7,7,2,2,'#e8c878')}else{pF(c,4,4,2,2,'#c8683c');pF(c,10,10,2,2,'#c8683c')}
        if(l)pF(c,0,0,2,16,'#d8b060');if(r)pF(c,14,0,2,16,'#d8b060')}
      else if(ty===IR.y0+1&&tx%3===0)pF(c,2,0,12,16,'rgba(255,240,180,.18)')}                           // sunlight under a window
    else if(m===22){pF(c,0,0,16,16,'#6e4b2c');
      if(top){pF(c,0,0,16,10,'#e8dcc0');pF(c,0,0,16,1,'#b8a888');pF(c,0,9,16,1,'#a8906a');pF(c,0,10,16,6,'#7a5a38');for(let k=0;k<4;k++)pF(c,k*4,10,1,6,'#573a21');pF(c,0,15,16,1,'#3d2a14');pF(c,0,10,16,1,'#a8743f');
        if(tx%3===0){pF(c,2,1,12,9,'#3d2a14');pF(c,3,2,10,7,'#9ad3f0');pF(c,3,2,10,3,'#cfe8f8');pF(c,7,2,2,7,'#3d2a14');pF(c,3,5,10,1,'#3d2a14');pF(c,1,1,3,8,'#b8483a');pF(c,12,1,3,8,'#b8483a');pF(c,1,1,1,8,'#d8685a');pF(c,2,10,12,1,'#a8743f')}}
      else if(bot){pF(c,0,0,16,16,'#7a5a38');pF(c,0,0,16,3,'#a8743f');pF(c,0,3,16,1,'#3d2a14');pF(c,0,13,16,3,'#573a21');for(let k=0;k<4;k++)pF(c,k*4,4,1,9,'#6a4a2c')}
      else{pF(c,0,0,16,16,'#7a5a38');for(let k=0;k<4;k++){pF(c,k*4,0,1,16,'#6a4a2c')}pF(c,left?13:0,0,3,16,'#573a21');pF(c,left?12:3,0,1,16,'#a8743f')}}
    else{pF(c,0,0,16,16,'#7a5a38');pF(c,0,0,16,3,'#a8743f');pF(c,1,1,14,15,'#3d2a14');pF(c,2,2,12,14,'#6b4423');pF(c,2,2,12,1,'#8a5a30');for(let k=0;k<3;k++)pF(c,3+k*4,3,1,12,'#573a21');pF(c,3,7,10,1,'#573a21');pF(c,10,9,2,2,'#f2c14e');pP(c,10,9,'#fff0a8');pF(c,1,15,14,1,'#d8d2c0')}}),sx|0,sy|0)}
