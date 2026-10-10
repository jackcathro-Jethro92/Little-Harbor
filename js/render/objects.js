// ---------- objects and stations, drawn in more detail (graphics step 1.5) ----------
// Lanterns, fences, barrels, gravestones, stumps, rubble, treasure bundles, the five ores (copper, tin, bronze, silver, gold), ponds, crop plots, stone walls, the crafting stations, the camp kit
// and the garden plots in your own garden. Each is drawn once into a small picture and copied each frame; only flames, bubbles, glints and ripples move. Art ported from
// art/graphics/graphics_upgrade_round2.js. Drawing only: what is solid, what can be mined and every price and rule are unchanged.
const ORECOL={15:'#e08a4a',16:'#d8e8f0',17:'#d8b040',123:'#f6c93a',124:'#e4ecf4'};
function oSpr(key,paint,sx,sy){g.drawImage(sprite(key,16,16,paint),sx|0,sy|0)}
function objectArt(m,tx,ty,sx,sy,n,t){
  if(m===7)oSpr('o7',c=>{pShadow(c,8,14,6,2);pF(c,5,11,6,4,'#5e5a52');pF(c,5,11,6,1,'#a8a498');pF(c,6,7,4,5,'#8a867c');pF(c,6,7,1,5,'#b0aca0');pF(c,4,4,8,4,'#4a463e');pF(c,5,5,6,2,'#ffd86a');pF(c,7,5,2,2,'#fff2b8');
    pF(c,3,2,10,3,'#6e6a62');pF(c,3,2,10,1,'#b8b4a8');pF(c,6,0,4,2,'#8a867c');const gl=c.createRadialGradient(8,6,1,8,6,10);gl.addColorStop(0,'rgba(255,220,130,.35)');gl.addColorStop(1,'rgba(255,220,130,0)');c.fillStyle=gl;c.fillRect(0,0,16,16)},sx,sy);
  else if(m===8){const L=v=>v===8,l=L(at(tx-1,ty)),r=L(at(tx+1,ty)),u=L(at(tx,ty-1)),d=L(at(tx,ty+1));oSpr('o8'+(l?1:0)+(r?1:0)+(u?1:0)+(d?1:0),c=>{pShadow(c,8,14,8,2,.2);
    if(l||r||!(u||d)){for(const yy of[6,10]){const x0=l?0:4,w=(l?4:0)+4+(r?8:4);pF(c,x0,yy,w,3,'#3a2414');pF(c,x0,yy,w,2,'#a8743f');pF(c,x0,yy,w,1,'#c9965a')}}
    if(u||d){pF(c,6,u?0:4,4,d?16:12,'#3a2414');pF(c,7,u?0:4,2,d?16:12,'#a8743f')}
    pF(c,5,3,6,12,'#2a1a0c');pF(c,6,3,4,11,'#8a5a2e');pF(c,6,3,1,11,'#b07a42');pF(c,6,3,4,1,'#c9965a')},sx,sy)}
  else if(m===11)oSpr('o11',c=>{pShadow(c,8,14,6,2);pF(c,3,2,10,13,'#2a1a0c');pF(c,4,3,8,11,'#8a5a2e');pF(c,4,3,2,11,'#a8743f');pF(c,10,3,2,11,'#6b4423');for(const yy of[5,11])pF(c,3,yy,10,1,'#4a4a52');pF(c,4,2,8,2,'#6b4423');pF(c,5,2,6,1,'#a8743f')},sx,sy);
  else if(m===13)oSpr('o13',c=>{pShadow(c,8,14,6,2);pF(c,3,4,10,11,'#2a2a34');pF(c,4,3,8,11,'#2a2a34');pF(c,4,4,8,10,'#9a9ba3');pF(c,5,3,6,1,'#9a9ba3');pF(c,4,4,3,10,'#b4b5bc');pF(c,5,6,6,1,'#6b6c75');pF(c,7,5,2,5,'#6b6c75');pF(c,4,12,3,2,'#5e8a4a');pF(c,9,13,4,1,'#5e8a4a')},sx,sy);
  else if(m===14)oSpr('o14',c=>{pShadow(c,8,14,7,2);pF(c,3,7,10,8,'#2a1a0c');pF(c,4,8,8,6,'#7a5230');pF(c,4,8,2,6,'#8e6236');pF(c,3,5,10,4,'#2a1a0c');pF(c,4,5,8,3,'#d8b07a');pF(c,5,6,6,1,'#b88a52');pP(c,8,6,'#9a6e3a');pF(c,2,13,3,2,'#5e3d22');pF(c,11,13,3,2,'#5e3d22')},sx,sy);
  else if(ORECOL[m]){oSpr('o'+m,c=>{pShadow(c,8,14,7,2);pF(c,2,5,12,10,'#3a3a40');pF(c,3,4,10,10,'#8a8c92');pF(c,3,4,10,3,'#b0b2b8');pF(c,3,11,10,3,'#6a6c72');pF(c,4,4,3,2,'#d0d2d8');
      [[5,8],[9,6],[8,10],[11,9]].forEach(([a,b])=>{pF(c,a,b,2,2,ORECOL[m]);pP(c,a,b,'#ffffff')})},sx,sy);
    if(m>=123&&((t/260|0)+tx*3+ty)%6===0){g.fillStyle='#ffffff';g.fillRect(sx+5+(n%7),sy+5+(n%5),1,1)}}   // gold and silver twinkle
  else if(m===18)oSpr('o18',c=>{[[3,9,4],[9,6,3],[8,11,3]].forEach(([a,b,s])=>{pF(c,a,b+1,s,s-1,'#4a4a50');pF(c,a,b,s,s-1,'#9a9ca2');pP(c,a,b,'#c8cad0')})},sx,sy);
  else if(m===46){oSpr('o46',c=>{pShadow(c,8,14,6,2);pF(c,4,6,8,8,'#2e1f10');pF(c,5,7,6,6,'#a8743f');pF(c,5,7,6,2,'#c9965a');pF(c,7,5,2,3,'#d8b878');pF(c,5,11,6,1,'#7a5230');pF(c,7,8,2,1,'#f2c14e')},sx,sy);
    g.fillStyle='#fff6c9';g.fillRect(sx+10+((t/200|0)%2),sy+3+((t/300|0)%2),1,1)}}
function objectBgArt(m,tx,ty,sx,sy,n,t){   // whole-tile objects: pond, crop plot, stone wall
  if(m===9){const e=sprite('o9'+(n%4),16,16,c=>{pF(c,0,0,16,16,'#3f9aa0');for(let k=0;k<3;k++){const h=GH(tx+k,ty*3);pF(c,(h%9)+1,(h>>>3)%13+1,4,1,'#5fb8b8')}
      if(n%3===0){pF(c,4,8,6,4,'#3a8a3a');pF(c,5,8,4,1,'#5ab04a');pP(c,7,10,'#3f9aa0');if(n%2)pF(c,8,8,2,2,'#f8b8d0')}if(n%4===1){pF(c,8,5,5,2,'#e8863a');pF(c,12,4,2,4,'#e8863a');pP(c,9,5,'#ffffff')}
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b],k)=>{if(at(tx+a,ty+b)===9)return;for(let j=0;j<16;j+=4){const h=GH(tx*7+j,ty+k)%3,c1='#5e5a52',c2=['#a8a498','#b8b4a8','#989488'][h];
        if(k===0){pF(c,j,0,4,4,c1);pF(c,j,0,4,3,c2);pP(c,j,0,'#d0ccc0')}if(k===1){pF(c,j,12,4,4,c1);pF(c,j,12,4,3,c2)}if(k===2){pF(c,0,j,4,4,c1);pF(c,0,j,3,4,c2)}if(k===3){pF(c,12,j,4,4,c1);pF(c,13,j,3,4,c2)}}})});
    g.drawImage(e,sx|0,sy|0);for(let k=0;k<2;k++){const h=GH(tx+k,ty*3),y=(h>>>3)%11+3,x=(h%7)+3+Math.round(Math.sin(t/800+h)*2);g.fillStyle='#8ad8d0';g.fillRect(sx+x,sy+y,4,1)}}   // ripples
  else if(m===10)g.drawImage(sprite('o10'+(n%4),16,16,c=>{pF(c,0,0,16,16,'#7a4e2c');for(const ry of[2,9]){pF(c,0,ry+4,16,2,'#5e3a1e');pF(c,0,ry+3,16,1,'#9a6a40');
      for(let k=0;k<3;k++){const x=1+k*5,cc=GH(tx*3+k,ty+ry)%4;pShadow(c,x+2.5,ry+4,2.5,1,.25);pF(c,x,ry,4,3,'#3f8a34');pF(c,x+1,ry-1,2,1,'#78c257');pP(c,x,ry,'#5aa83c');if(cc===0){pF(c,x+1,ry+2,2,2,'#e0762f');pP(c,x+1,ry+2,'#f8a050')}}}}),sx|0,sy|0);
  else if(m===12)g.drawImage(sprite('wall'+((tx+ty)&3),16,16,c=>{pF(c,0,0,16,16,'#5e5a52');for(let r=0;r<4;r++){const off=(r%2)*4;for(let cc=-1;cc<4;cc++){const x=cc*5+off,h=GH(tx*9+cc,ty*4+r)%3;pF(c,x+1,r*4+1,4,3,['#9a968c','#a8a498','#8a867c'][h]);pF(c,x+1,r*4+1,4,1,'#c4c0b4')}}pF(c,0,14,16,2,'#3a3630')}),sx|0,sy|0)}
// ---- crafting stations and the camp kit (drawn once; flames, bubbles and steam move) ----
function stationArt(p,cx,cy,t){const x=p.x*T-cx,y=p.y*T-cy,fl=((t/130)|0)%3,id=p.id;
  g.drawImage(sprite('s'+id,16,16,c=>{const O='#2e1f10';pShadow(c,8,14,7,2,.3);
    if(id==='camp_kit'){pF(c,3,1,2,2,O);pF(c,1,3,6,2,O);pF(c,0,5,8,3,O);pF(c,3,2,1,1,'#e8d09a');pF(c,2,4,4,1,'#d8b878');pF(c,1,6,6,2,'#d8b878');pF(c,3,6,2,2,'#3d2a14');pF(c,2,3,2,1,'#f4e8c4');
      pF(c,7,10,8,5,'#6e7068');pF(c,7,10,8,1,'#a8a8a0');pF(c,8,11,6,3,O);pF(c,8,12,6,1,'#7a5230')}
    else if(id==='alchemy_station'){pF(c,1,8,14,7,O);pF(c,2,9,12,5,'#a8743f');pF(c,2,9,12,1,'#c9965a');pF(c,3,3,10,7,O);pF(c,4,4,8,5,'#3a3a44');pF(c,4,4,8,2,'#8a5ac8');pP(c,5,4,'#c8a0f0');pF(c,12,9,2,4,'#4a9ae0');pP(c,12,9,'#a8d8ff');pF(c,2,10,2,3,'#d83828')}
    else if(id==='shipwright'){pF(c,2,12,3,4,'#6b4423');pF(c,11,12,3,4,'#6b4423');pF(c,0,6,16,7,O);pF(c,1,7,14,5,'#a8743f');pF(c,1,7,14,1,'#c9965a');pF(c,13,5,3,3,O);pF(c,3,3,1,6,'#d8b878');pF(c,7,2,1,7,'#d8b878');pF(c,11,3,1,6,'#d8b878');pF(c,1,9,14,1,'#7a5230');pF(c,4,10,3,1,'#c9d2da')}
    else if(id==='cooking_station'){pF(c,1,6,14,9,O);pF(c,2,7,12,7,'#8d8f87');pF(c,2,7,12,1,'#b3b4ab');pF(c,3,3,10,5,O);pF(c,4,4,8,3,'#3a3a44');pF(c,5,4,6,1,'#d98a3a');pF(c,5,11,6,3,'#2e1f10');pF(c,12,8,2,2,'#d83828')}
    else if(id==='standard_bench'){pF(c,1,5,14,5,O);pF(c,2,6,12,3,'#a8743f');pF(c,2,6,12,1,'#c9965a');pF(c,2,10,2,5,'#6b4423');pF(c,12,10,2,5,'#6b4423');pF(c,4,3,6,2,'#c9d2da');pF(c,10,4,4,1,'#d8b878');pF(c,5,10,6,1,'#7a5230')}
    else{pF(c,1,4,14,11,O);pF(c,2,5,12,9,'#8d8f87');pF(c,2,5,12,2,'#a9aaa3');pF(c,4,8,8,5,O);pF(c,11,0,3,5,'#6e7068');pF(c,11,0,1,5,'#8d8f87')}}),x|0,y|0);
  if(id==='camp_kit'){g.fillStyle='#f2a22e';g.fillRect(x+10,y+7+(fl%2),2,4);g.fillStyle='#e8632e';g.fillRect(x+9,y+9,4,3);g.fillStyle='#ffe27a';g.fillRect(x+10,y+9,2,2)}
  else if(id==='alchemy_station'){g.fillStyle='#c8a0f0';g.fillRect(x+6+(fl%2)*3,y+1-fl%2,2,2);g.fillStyle='rgba(200,170,240,.5)';g.fillRect(x+9-(fl%2)*3,y-1-fl%2,1,1)}
  else if(id==='cooking_station'){g.fillStyle=fl?'#e8632e':'#f2a22e';g.fillRect(x+5,y+11,6,3);g.fillStyle='#ffe27a';g.fillRect(x+7,y+12,2,2);g.fillStyle='rgba(255,255,255,.65)';g.fillRect(x+6+(fl%2),y+1-fl%2,2,2)}
  else if(id!=='standard_bench'&&id!=='shipwright'){g.fillStyle=fl?'#e8632e':'#f2a22e';g.fillRect(x+5,y+10,6,3);g.fillStyle='#ffe27a';g.fillRect(x+7,y+11,2,2)}}
// ---- your garden plots: tilled soil and crops growing in four stages ----
function gardenCellArt(cell,x,y){g.drawImage(sprite('gs',16,16,c=>{pF(c,1,1,14,14,'#2e1f10');pF(c,2,2,12,12,'#8d5c36');pF(c,2,2,12,1,'#a8744a');pF(c,3,5,10,1,'#6e4526');pF(c,3,10,10,1,'#6e4526');pP(c,4,7,'#7a4e2c');pP(c,10,12,'#7a4e2c')}),x|0,y|0);
  if(!cell)return;const c0=CROPS[cell.c],age=S.day-cell.d,st=age>=c0.d?3:Math.min(2,Math.floor(3*age/c0.d)),col=CROPC[cell.c];
  g.drawImage(sprite('gc'+col+st,16,16,c=>{if(st===0){pF(c,7,8,2,2,'#c9a35c');pP(c,7,8,'#e0c07c')}else if(st===1){pF(c,7,6,2,6,'#3f8f3a');pF(c,5,7,2,2,'#78b552');pF(c,9,7,2,2,'#78b552');pP(c,7,6,'#a8dc78')}
    else if(st===2){pF(c,5,4,6,8,'#3f8f3a');pF(c,4,6,8,4,'#5aa83c');pF(c,6,4,2,2,'#78b552');pP(c,5,5,'#a8dc78')}else{pF(c,4,3,8,9,'#2f7d32');pF(c,3,5,10,5,'#4fa03e');pF(c,5,4,3,3,col);pF(c,9,7,3,3,col);pF(c,6,9,3,2,col);pP(c,5,4,'#ffffff');pP(c,9,7,'#ffffff')}}),x|0,y|0)}
