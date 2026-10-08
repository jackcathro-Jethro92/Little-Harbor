// ---------- Earth temple (Mayan ruins, see art/temples/mayan_temple and TEMPLES.md) ----------
// Tiles: 56 pyramid stone (blocked), 57 pyramid stairs, 58 plaza paving, 59 sanctum floor, 60 sanctum wall (ceiling on the top row, torches on the sides),
// 61 sanctum mural (glyph blocks, codex strip, painted figures by row), 62 stone altar, 63 jaguar statue. Palette: taupe ground, grey stone, cream plaster, red and orange paint.
const SERP=[[4,15],[8,15]]; // serpent heads at the top of the stairs (drawn on tile 56)
function templeTile(m,sx,sy,tx,ty,n,t){const O='#141410',fl=((t/130)|0)%3,inS=zoneOf(tx,ty)===5;
  const floor=()=>{if(inS){R(sx,sy,T,T,'#8d8f87');R(sx,sy+7,T,1,'#707068');R(sx,sy+15,T,1,'#707068');R(sx+(ty%2?5:12),sy,1,8,'#707068');R(sx+(ty%2?12:5),sy+8,1,8,'#707068')}else{R(sx,sy,T,T,'#a89a88');R(sx,sy+7,T,1,'#9a8c7a');R(sx+(ty%2?4:11),sy,1,T,'#9a8c7a')}};
  if(m===56){R(sx,sy,T,T,'#8a8a82');for(let r=0;r<T;r+=5){R(sx,sy+r,T,1,'#6e6e68');for(let c=((r/5|0)%2)*5+n%3;c<T;c+=10)R(sx+c,sy+r,1,5,'#6e6e68')}
    if(n%3===0)R(sx+n%11+1,sy+n%9+2,4,2,'#a4a49a');if(n%5===0)R(sx+n%7+3,sy+n%10+1,3,2,'#7a7a72');
    const up=at(tx,ty-1),dn=at(tx,ty+1),lf=at(tx-1,ty),rt=at(tx+1,ty);
    if(up!==56&&up!==5){R(sx,sy,T,3,'#c4c4b8');R(sx,sy+3,T,1,'#6e6e68')}if(dn!==56&&dn!==57)R(sx,sy+T-2,T,2,'#00000040');
    if(lf!==56&&lf!==5)R(sx,sy,1,T,'#5e5e58');if(rt!==56&&rt!==5)R(sx+T-1,sy,1,T,'#5e5e58');
    if(SERP.some(p=>p[0]===tx&&p[1]===ty)){R(sx+1,sy+2,14,12,O);R(sx+2,sy+3,12,10,'#b0b0a6');R(sx+4,sy+5,2,2,O);R(sx+10,sy+5,2,2,O);R(sx+4,sy+9,8,2,'#b8402a');R(sx+5,sy+9,6,1,'#f2ece0')}}
  else if(m===57){R(sx,sy,T,T,'#c4c4b8');for(let j=3;j<T;j+=4){R(sx,sy+j,T,1,'#8a8a82');R(sx,sy+j+1,T,1,'#dcdcd0')}
    if(at(tx-1,ty)!==57)R(sx,sy,2,T,'#6e6e68');if(at(tx+1,ty)!==57)R(sx+T-2,sy,2,T,'#6e6e68')}
  else if(m===58){R(sx,sy,T,T,'#a89a88');R(sx,sy+7,T,1,'#9a8c7a');R(sx+(ty%2?4:11),sy,1,T,'#9a8c7a');
    if(n%6===0)R(sx+n%10+2,sy+n%9+1,3,1,'#8b7a68');if(n%4===0)R(sx+n%12+1,sy+n%11+3,1,1,'#b8aa98');if(n%23===0)R(sx+n%10+3,sy+n%7+6,1,2,'#5d9a48')}
  else if(m===59)floor();
  else if(m===60){const top=ty===SZ.y0;R(sx,sy,T,T,top?'#4a4a46':'#7a7a72');
    if(top){R(sx,sy+9,T,7,'#5e5e58');R(sx,sy+9,T,1,'#7a7a72');R(sx,sy+13,T,3,'#6e6e68');R(sx,sy+13,T,1,'#8a8a82')}
    else{for(let r=0;r<T;r+=5){R(sx,sy+r,T,1,'#5e5e58');for(let c=((r/5|0)%2)*5;c<T;c+=10)R(sx+c,sy+r,1,5,'#5e5e58')}
      if(n%4===0)R(sx+n%10+2,sy+n%9+1,4,2,'#8a8a82');
      if((tx===SZ.x0||tx===SZ.x1)&&ty===SZ.y0+7){R(sx+5,sy+7,6,8,'#5a3a22');R(sx+6,sy+2+(fl%2),4,6,'#f2a22e');R(sx+7,sy+3+(fl%2),2,3,'#ffe27a')}}}
  else if(m===61){const r=ty-SZ.y0,k=tx-SZ.x0-1;
    if(r===1){R(sx,sy,T,T,'#5e4630');R(sx+1,sy+1,14,14,'#c8a878');R(sx+1,sy+1,14,1,'#e0c898');const g=n%4,G='#7a5a3a';
      if(g===0){R(sx+3,sy+3,10,2,G);R(sx+3,sy+3,2,9,G);R(sx+3,sy+10,10,2,G);R(sx+10,sy+5,2,6,G);R(sx+6,sy+6,4,2,G)}
      else if(g===1){R(sx+3,sy+3,4,4,G);R(sx+9,sy+3,4,4,G);R(sx+3,sy+9,10,3,G);R(sx+7,sy+3,2,9,'#c8a878')}
      else if(g===2){R(sx+3,sy+3,10,3,G);R(sx+3,sy+7,10,2,G);R(sx+3,sy+10,6,3,G);R(sx+10,sy+10,3,3,G)}
      else{R(sx+3,sy+3,3,10,G);R(sx+7,sy+3,6,3,G);R(sx+7,sy+7,3,6,G);R(sx+11,sy+8,2,5,G)}}
    else if(r===2){R(sx,sy,T,T,'#efe8d8');R(sx,sy,T,2,'#a8322a');for(let q=0;q<3;q++){R(sx+1+q*5,sy+5,4,5,O);R(sx+2+q*5,sy+6,2,3,'#efe8d8');if((n+q)%2)R(sx+2+q*5,sy+7,2,1,O)}
      R(sx+2+n%8,sy+12,3,1,'#a8322a');R(sx+8,sy+13,4,1,'#a8322a');if(tx===SZ.x0+1){R(sx,sy,2,T,'#a8322a')}if(tx===SZ.x1-1){R(sx+T-2,sy,2,T,'#a8322a')}}
    else{const p=(k/4)|0,pc=['#e8a830','#c8502a','#e8a830'][p%3];R(sx,sy,T,T,pc);if(n%3===0)R(sx+n%12+2,sy+n%10+2,1,1,'#f2d070');R(sx,sy+T-2,T,2,'#a8322a');
      if(k%4===0&&k>0)R(sx,sy,2,T-2,'#a8322a');
      if(k%4===1||k%4===2){const fx=k%4===1?sx+8:sx;
        if(p===0&&k%4===1){R(fx,sy+3,6,6,'#efe8d8');R(fx+1,sy+4,1,2,O);R(fx+3,sy+4,1,2,O);for(let j=0;j<3;j++)R(fx+1,sy+9+j*2,5,1,'#efe8d8');R(fx,sy+2,6,1,'#a8322a')}
        else if(p===1&&k%4===1){R(fx,sy+2,8,5,'#d8c860');R(fx+1,sy+3,2,2,O);R(fx+5,sy+3,2,2,O);R(fx-1,sy+7,10,6,'#d8c860');R(fx+1,sy+8,2,2,'#7a5a20');R(fx+6,sy+10,2,2,'#7a5a20')}
        else if(p===2&&k%4===1){R(fx,sy+2,6,6,'#efe8d8');R(fx+4,sy+4,3,1,'#c8a020');R(fx+1,sy+3,1,2,O);R(fx+2,sy,2,2,'#3fb87a');R(fx,sy+8,6,5,'#efe8d8');R(fx+2,sy+9,1,4,O);R(fx+4,sy+9,1,4,O)}}}}
  else if(m===62){floor();R(sx,sy+2,T,13,'#5e6a60');R(sx,sy+2,T,11,'#a8b4a8');
    if(at(tx,ty-1)!==62)R(sx,sy+2,T,2,'#d8e0d4');if(at(tx-1,ty)!==62)R(sx,sy+2,1,13,'#5e6a60');if(at(tx+1,ty)!==62)R(sx+T-1,sy+2,1,13,'#5e6a60');
    if(at(tx,ty+1)!==62)R(sx,sy+11,T,2,'#8a968a');R(sx+(at(tx-1,ty)===62?0:3),sy+8,at(tx+1,ty)===62?T:T-3,1,'#b8582a')}
  else if(m===63){floor();R(sx+2,sy+10,12,5,'#6e6e68');R(sx+3,sy+10,10,1,'#8a8a82');R(sx+2,sy+1,12,10,'#4a4a46');R(sx+3,sy+2,10,8,'#8a8a82');R(sx+2,sy,3,3,'#4a4a46');R(sx+11,sy,3,3,'#4a4a46');
    R(sx+4,sy+5,2,2,'#3fb87a');R(sx+10,sy+5,2,2,'#3fb87a');R(sx+7,sy+7,2,1,'#4a4a46');R(sx+5,sy+9,6,1,'#4a4a46')}}
// the temple on top of the pyramid ('top', 5 tiles wide) and the two side shrines ('shrine', 3 tiles wide)
function mayanB(b,x,y,t){const O='#141410',W=b.w*T,top=b.mayan==='top';R(x-2,y+29,W+4,6,'#00000030');
  if(top){R(x+16,y-10,W-32,12,'#3a352f');R(x+17,y-9,W-34,10,'#b0b0a6');for(let j=0;j<2;j++)for(let i=0;i<(W-42)/5;i++)R(x+20+i*5,y-7+j*4,3,2,'#3a352f')}
  R(x-3,y+(top?1:6),W+6,4,'#d8d4c4');R(x-3,y+(top?1:6),W+6,1,'#f0ece0');
  const by=top?5:10;R(x,y+by,W,32-by,'#9a9a90');
  if(top){R(x,y+5,W,8,'#8a8a82');for(let i=3;i<W;i+=8)R(x+i,y+8,2,2,'#c8502a');R(x,y+13,W,1,'#d8d4c4')}
  for(let j=by+(top?9:2);j<30;j+=4){R(x,y+j,W,1,'#7a7a72');for(let i=((j/4|0)%2)*5;i<W;i+=10)R(x+i,y+j,1,4,'#7a7a72')}
  if(top){[1,2,3].forEach(k=>{R(x+k*16+2,y+14,12,15,O);R(x+k*16+2,y+14,12,2,'#2a2a26')});[1,2].forEach(k=>R(x+k*16+14,y+13,4,16,'#d8d4c4'));R(x-3,y+29,W+6,3,'#d8d4c4')}
  else{[0,1,2].forEach(k=>R(x+6+k*14,y+16,8,10,O));R(x+18,y+26,12,6,'#c4c4b8');for(let j=27;j<32;j+=2)R(x+18,y+j,12,1,'#8a8a82');R(x-1,y+30,W+2,2,'#d8d4c4')}}
// ---------- Temple of the Sea (Knossos style, see art/temples/knossos_temple) ----------
// Tiles: 64 limestone courtyard, 65 stone boardwalk slab, 66 red column with black capital, 67 pool (dolphin fountain in the middle), 68 red lamp post on the water,
// 69 hall floor, 70 hall wall (red plaster, white bands, cream frieze with red hills and blue dolphins), 71 sea-god statue (2 tiles tall), 72 stairs down,
// 73 vault cave rock, 74 vault dark water, 75 vault stone (ledge, stepping stone or platform: drawn by its neighbours), 76 pedestal, 77 brazier.
function seaTile(m,sx,sy,tx,ty,n,t){const O='#2a2a2a',fl=((t/130)|0)%3,z=zoneOf(tx,ty),RED='#b8322a',CREAM='#efe6d0',TEAL='#2a9ab0';
  const lime=()=>{const c=['#d8cfb8','#e2dac4','#cfc6ae'][n%3];R(sx,sy,T,T,c);R(sx,sy+T-1,T,1,'#b8ad94');R(sx+T-1,sy,1,T,'#b8ad94');if(n%7===0)R(sx+n%9+2,sy+n%11+2,4,1,'#b8ad94');
    if((tx===280||tx===286)&&ty>=32&&ty<=37){R(sx+5,sy,5,T,TEAL);R(sx+5,sy,1,T,'#1f7a90');if(((t/300|0)+ty)%3===0)R(sx+7,sy+4,2,1,'#8adcec')}};
  const hallFloor=()=>{const P=['#b8b4a8','#9fa4ac','#d4c9ac','#a8acb4'];for(let r=0;r<2;r++)for(let c=0;c<2;c++)R(sx+c*8,sy+r*8,8,8,P[hs(tx*2+c,ty*2+r)%4]);R(sx,sy+7,T,1,'#7a7a74');R(sx,sy+15,T,1,'#7a7a74');R(sx+7,sy,1,T,'#7a7a74');
    if(z===6&&(tx===HZ.x0+1||tx===HZ.x1-1)){R(sx+5,sy,5,T,'#1f7a90');R(sx+6,sy,3,T,TEAL);if(((t/300|0)+ty)%3===0)R(sx+7,sy+5,1,2,'#8adcec')}};
  const bg=()=>z===6?hallFloor():z===7?(R(sx,sy,T,T,'#3a3e48'),R(sx,sy+T-1,T,1,'#2a2e36')):lime();
  const wetV=()=>{R(sx,sy,T,T,'#14323f');if(((t/400|0)+n)%5<2)R(sx+2+n%9,sy+3+(n>>1)%9,5,1,'#2a6a82')};
  if(m===64)lime();
  else if(m===65){R(sx,sy,T,T,'#e0d8c0');R(sx,sy+T-1,T,1,'#b8ad94');R(sx,sy+7,T,1,'#c8bea4');if(n%3===0)R(sx+n%8+2,sy+n%6+1,5,2,'#ece4d0');R(sx,sy,1,T,'#a89c80');R(sx+T-1,sy,1,T,'#a89c80')}
  else if(m===66){bg();R(sx+4,sy+3,8,12,RED);R(sx+4,sy+3,2,12,'#d84a3a');R(sx+10,sy+3,2,12,'#8a2420');R(sx+2,sy,12,4,O);R(sx+3,sy+14,10,2,O)}
  else if(m===67){lime();const up=at(tx,ty-1)===67,dn=at(tx,ty+1)===67,lf=at(tx-1,ty)===67,rt=at(tx+1,ty)===67;
    R(sx,sy,T,T,'#4a4238');R(sx+(lf?0:2),sy+(up?0:2),T-(lf?0:2)-(rt?0:2),T-(up?0:2)-(dn?0:2),TEAL);
    for(let k=0;k<3;k++)if(((t/350|0)+k+tx)%3===0)R(sx+3+k*4,sy+4+k*3,3,1,'#9ae4f2');
    if(tx===283&&ty===34){R(sx+6,sy+5,4,9,'#c8ccd4');R(sx+6,sy+5,4,1,'#eceef2');R(sx+4,sy+2,8,4,'#233a8a');R(sx+10,sy+1,3,3,'#233a8a');R(sx+12,sy+2,1,1,CREAM);if(fl)R(sx+13,sy,1,2,'#bfeaf6')}}
  else if(m===68){R(sx,sy,T,T,'#2f6fc4');if(((t/450|0)+n)%5<2)R(sx+2+n%9,sy+4+(n>>1)%8,5,1,'#5f9fe8');R(sx+1,sy+12,14,2,'#00000030');R(sx+6,sy+4,4,9,RED);R(sx+6,sy+4,1,9,'#d84a3a');R(sx+5,sy+2,6,3,'#ffd870');R(sx+3,sy,10,6,'rgba(255,220,120,.22)')}
  else if(m===69)hallFloor();
  else if(m===70){const r=ty-HZ.y0,side=tx===HZ.x0||tx===HZ.x1||ty===HZ.y1;
    if(side||r>2){R(sx,sy,T,T,'#8a8078');for(let q=0;q<T;q+=5){R(sx,sy+q,T,1,'#6e665e');for(let c=((q/5|0)%2)*5;c<T;c+=10)R(sx+c,sy+q,1,5,'#6e665e')}}
    else if(r===0){R(sx,sy,T,T,'#8a2420');R(sx,sy+10,T,1,CREAM);R(sx,sy+13,T,1,CREAM);R(sx,sy+3,T,1,'#a8322a')}
    else if(r===1){R(sx,sy,T,T,'#e6dcc8');R(sx,sy,T,2,'#b8322a');for(let x=0;x<T;x++){const h=7+Math.round(2.4*Math.sin((tx*16+x)*.5));R(sx+x,sy+h,1,T-h,RED)}
      if((tx+ty)%3===0){R(sx+2,sy+4,7,2,'#233a8a');R(sx+7,sy+2,3,3,'#233a8a');R(sx+10,sy+3,2,1,'#233a8a')}}
    else{R(sx,sy,T,T,RED);R(sx,sy,T,1,CREAM);R(sx,sy+3,T,1,CREAM);R(sx,sy+13,T,2,'#7a1f1c');R(sx,sy+8,T,1,'#d86a5a')}}
  else if(m===71){const top=at(tx,ty-1)!==71;R(sx,sy,T,T,top?'#e6dcc8':RED);if(!top){R(sx,sy,T,1,CREAM)}
    R(sx+1,sy,14,T,'#2a2a34');R(sx+2,sy,12,T,'#6a7a8c');
    if(top){R(sx+5,sy+3,6,6,'#d4dce8');R(sx+5,sy+2,6,2,'#2f6fc4');R(sx+6,sy+5,1,1,O);R(sx+9,sy+5,1,1,O);R(sx+3,sy+10,10,6,'#c0c8d4');R(sx+12,sy+1,1,15,'#d9a441')}
    else{R(sx+4,sy,8,10,'#c0c8d4');R(sx+4,sy+2,8,1,'#a8b0bc');R(sx+12,sy,1,10,'#d9a441');R(sx+1,sy+11,14,5,'#e8ecf0');R(sx+1,sy+11,14,1,'#ffffff')}}
  else if(m===72){hallFloor();const r=Math.min(2,Math.max(0,ty-(HZ.y0+4))),sh=['#3a3e46','#555a62','#7a7e86'][r];R(sx,sy,T,T,'#2a2a2e');for(let k=0;k<4;k++){R(sx+1,sy+k*4,14,3,sh);R(sx+1,sy+k*4+3,14,1,'#1c1c20')}
    if(at(tx-1,ty)!==72)R(sx,sy,2,T,'#4a4a50');if(at(tx+1,ty)!==72)R(sx+T-2,sy,2,T,'#4a4a50');if(r===0)R(sx,sy,T,4,'#101014')}
  else if(m===73){const top=ty<=VZ.y0+1,side=tx===VZ.x0||tx===VZ.x1;R(sx,sy,T,T,'#2e2e38');R(sx+n%10,sy+(n*3)%12,5,3,'#3a3a46');R(sx+(n*7)%11,sy+(n*5)%12,3,2,'#242430');
    if(top){const h=4+n%7;R(sx+4+n%6,sy+T-h,3,h,'#3e3e4c');R(sx+5+n%6,sy+T-2,1,2,'#4a4a5a')}
    if(side&&ty===VZ.y1-2){R(sx+5,sy+5,6,8,'#16202a');R(sx+6,sy+6,4,6,'#3a8ad0');R(sx+7,sy+7,2,3,'#a8e0ff');R(sx+2,sy+2,12,12,'rgba(80,170,255,.18)')}}
  else if(m===74)wetV();
  else if(m===75){wetV();const mg=(a,b)=>at(a,b)===74?2:0,l=mg(tx-1,ty),r=mg(tx+1,ty),u=mg(tx,ty-1),d=mg(tx,ty+1);
    R(sx+l,sy+u,T-l-r,T-u-d,'#868b95');R(sx+l,sy+u,T-l-r,2,'#a8aeb8');R(sx+l,sy+T-d-2,T-l-r,2,'#6a6f79');if(n%2)R(sx+l+3+n%6,sy+u+5,4,1,'#6a6f79');if(l&&u)R(sx,sy,2,2,'#14323f');if(r&&u)R(sx+T-2,sy,2,2,'#14323f');if(l&&d)R(sx,sy+T-2,2,2,'#14323f');if(r&&d)R(sx+T-2,sy+T-2,2,2,'#14323f')}
  else if(m===76){R(sx,sy,T,T,'#868b95');R(sx+(at(tx-1,ty)===76?0:2),sy+5,T-(at(tx-1,ty)===76?0:2)-(at(tx+1,ty)===76?0:2),9,'#2a2e34');R(sx+(at(tx-1,ty)===76?0:3),sy+4,T-(at(tx-1,ty)===76?0:3)-(at(tx+1,ty)===76?0:3),8,'#a8b8c0');R(sx,sy+3,T,2,'#d8e4e8');R(sx+4,sy+6,8,3,'#4a6a78')}
  else if(m===77){bg();R(sx+3,sy+8,10,3,'#4a4238');R(sx+4,sy+10,8,5,'#6e5a3c');R(sx+6,sy+3+(fl%2),4,5,'#f2a22e');R(sx+7,sy+4,2,3,'#ffe27a');R(sx+2,sy+1,12,9,'rgba(255,170,60,.18)')}}
// the Temple of the Sea's hall seen from the courtyard: cream wall, a band of blue-centred discs, four red columns with black capitals, a dark doorway ('knossos', 5 tiles wide)
function seaTemple(b,x,y,t){const W=b.w*T,O='#2a2a2a';R(x-2,y+29,W+4,6,'#00000030');
  R(x-1,y,W+2,32,'#cfc6ae');R(x,y+1,W,31,'#e6dcc8');for(let j=9;j<32;j+=6){R(x,y+j,W,1,'#cfc6ae')}
  R(x,y+2,W,6,'#b8322a');for(let i=1;i<W-4;i+=8){R(x+i,y+3,4,4,'#efe6d0');R(x+i+1,y+4,2,2,'#2f6fc4')}
  R(x+28,y+10,24,22,'#141018');R(x+29,y+10,22,2,'#2a2630');R(x+26,y+30,28,2,'#d8cfb8');
  [4,16,58,70].forEach(cx=>{R(cx+x-1,y+9,10,4,O);R(cx+x,y+13,8,19,'#b8322a');R(cx+x,y+13,2,19,'#d84a3a');R(cx+x+6,y+13,2,19,'#8a2420')})}
