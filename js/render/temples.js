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
// ---------- Temple to the Sky (standing stones, see art/temples/sky_stonehenge_temple) ----------
// Tiles (all drawn on grass): 78 standing stone (a tall pale stone with moss, rising above its tile), 79 lintel slab (a low flat slab, used between the circle's stones and over trilithons),
// 80 and 81 the left and right halves of the carved temple stone (triple spirals).
function grassBg(tx,ty,sx,sy,n){const G=['#7fa84f','#74a048','#678f3f'],v=Math.sin(tx*.8)+Math.sin(ty*.9)+Math.sin((tx+ty)*.45),gi=v>1.1?0:v<-1.1?2:1;R(sx,sy,T,T,G[gi]);
  for(let k=0;k<4;k++){const r=hs(tx*3+k,ty*7)%100;if(r<55)R(sx+r%14,sy+(r*7)%14,2,1,G[(gi+1+(r&1))%3])}}
function skyTile(m,sx,sy,tx,ty,n,t){const O='#3a3430';grassBg(tx,ty,sx,sy,n);
  if(m===78){R(sx+3,sy+12,12,3,'#00000030');R(sx+4,sy-11,8,25,O);R(sx+5,sy-10,6,23,'#a8a8a0');R(sx+5,sy-10,2,23,'#bcbcb2');R(sx+9,sy-10,2,23,'#8a8a82');
    R(sx+6+n%3,sy-7+n%6,2,1,'#b8b858');R(sx+8,sy-1+n%5,2,1,'#a8b050');R(sx+6,sy+5+n%4,2,1,'#b8b858');if(n%3===0)R(sx+5,sy+8,1,3,'#8a8a82')}
  else if(m===79){R(sx,sy+10,T,3,'#00000030');R(sx-1,sy+2,T+2,10,O);R(sx,sy+3,T,8,'#b8b8ae');R(sx,sy+3,T,2,'#d0d0c6');R(sx,sy+9,T,2,'#8a8a82');if(n%4===0)R(sx+n%10+2,sy+5,3,1,'#b8b858');if(n%5===0)R(sx+4+n%6,sy+3,1,6,'#8a8a82')}
  else if(m===80||m===81){const L=m===80;R(sx+(L?0:0),sy+2,T,14,'rgba(0,0,0,0)');R(sx+(L?1:0),sy+1,T-1,15,O);R(sx+(L?2:0),sy+2,T-2,13,'#9a9a92');R(sx+(L?2:0),sy+2,T-2,4,'#c0c0b6');R(sx+(L?2:0),sy+13,T-2,2,'#7a7a72');
    if(L){R(sx+2,sy+3,12,1,'#8a8a82');R(sx+3,sy+7,6,1,'#4a4a44');R(sx+8,sy+7,1,4,'#4a4a44');R(sx+4,sy+11,5,1,'#4a4a44');R(sx+4,sy+9,1,2,'#4a4a44');R(sx+10,sy+9,4,1,'#4a4a44');R(sx+12,sy+9,1,4,'#4a4a44')}
    else{R(sx,sy+3,13,1,'#8a8a82');R(sx+1,sy+7,5,1,'#4a4a44');R(sx+5,sy+7,1,4,'#4a4a44');R(sx+2,sy+11,5,1,'#4a4a44');R(sx+2,sy+9,1,2,'#4a4a44');R(sx+8,sy+9,4,1,'#4a4a44');R(sx+10,sy+9,1,4,'#4a4a44')}}}
// the dolmen gateway at the foot of the avenue: its two uprights are stone tiles (78); this draws the lintel resting on top of them ('skygate', 5 tiles wide; walkers pass under it)
function skyGate(b,x,y,t){const W=b.w*T,O='#3a3430';R(x-2,y-10,W+4,10,O);R(x-1,y-9,W+2,8,'#b8b8ae');R(x-1,y-9,W+2,2,'#d0d0c6');R(x-1,y-3,W+2,2,'#8a8a82');for(let i=6;i<W-6;i+=13)R(x+i,y-8,5,1,'#b8b858')}
// ---------- the Fire temple's volcano island (see art/temples/fire_temple) ----------
// Tiles: 82 basalt ground, 83 black sand, 84 flowing lava (blocks; steams where it meets the sea), 85 basalt slab (the stepping-stone path), 86 volcanic peak with glowing cracks,
// 87 the crater's lava lake with rising smoke. REEF (js/world/fireisland.js) is the set of sea tiles tinted turquoise round the island.
function fireTile(m,sx,sy,tx,ty,n,t){const O='#141418';
  const basalt=()=>{R(sx,sy,T,T,'#34343c');R(sx+n%11,sy+(n*3)%12,4,2,'#2a2a32');if(n%5===0)R(sx+(n*7)%12,sy+(n*5)%11,3,2,'#4a4a54');if(n%29===0)R(sx+n%12+2,sy+(n*3)%11+2,1,2,'#c8501c')};
  const lavaAt=(a,b)=>{const v=at(a,b);return v===84||v===87};
  if(m===82)basalt();
  else if(m===83){R(sx,sy,T,T,'#1e1e26');R(sx+n%12,sy+(n*3)%13,3,1,'#2c2c36');R(sx+(n*5)%13,sy+(n*7)%12,2,1,'#16161c');if(n%9===0)R(sx+(n*3)%12+1,sy+n%11+2,1,1,'#4a4a56')}
  else if(m===84||m===87){const lake=m===87;R(sx,sy,T,T,lake?'#f07a1c':'#e8641c');
    for(let k=0;k<3;k++){const w=((t/(lake?160:110)+n*3+k*7+(lake?0:ty*2))|0)%16;R(sx+w,sy+2+k*5,5,1,'#ffd070');R(sx+(w+8)%16,sy+4+k*5,3,1,'#c8401a')}
    [[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b],k)=>{if(lavaAt(tx+a,ty+b))return;const c=at(tx+a,ty+b)===0?'#a82a10':'#3a1810';
      if(k<2)R(sx,k?sy+T-2:sy,T,2,c);else R(k===2?sx:sx+T-2,sy,2,T,c)});
    if(!lake&&[[0,-1],[0,1],[-1,0],[1,0]].some(([a,b])=>at(tx+a,ty+b)===0)){for(let k=0;k<2;k++){const p=((t/70+n+k*40)%36)|0;R(sx+3+k*7+(p>>4),sy-p/2|0,5,3,'rgba(235,235,245,.55)')}}
    if(lake){for(let k=0;k<3;k++){const p=((t/55+n*5+k*23)%48)|0;R(sx+2+k*4+(p>>3),sy+4-p,6,5,'rgba(110,105,115,.5)')}}}
  else if(m===85){basalt();const o=(ty%2)*4;R(sx+1,sy+1,14,14,O);R(sx+2,sy+2,12,12,'#6a6a72');R(sx+2,sy+2,12,2,'#8a8a92');R(sx+2,sy+12,12,2,'#4a4a52');R(sx+6+o,sy+5,1,5,'#52525a');if(n%3===0)R(sx+4,sy+8,3,1,'#52525a')}
  else if(m===86){basalt();const s=hs(tx*3,ty*5),p1=2+s%5,p2=9+(s>>3)%5,a=15+(s>>6)%6,b=10+(s>>9)%5,sl=2+s%2;
    for(let x=0;x<T;x++){const h1=Math.round(a-Math.abs(x-p1)*sl),h2=Math.round(b-Math.abs(x-p2)*2),h=Math.max(h1,h2,3),top=sy+T-h,lit=x<(h1>=h2?p1:p2);
      R(sx+x,top-1,1,1,O);R(sx+x,top,1,h,lit?'#4a4650':'#26242c');R(sx+x,top,1,2,lit?'#6a6470':'#3a3640');
      if((x+s)%4===0){const c=top+3+(s>>x)%5;R(sx+x,c,1,4,'#e8641c');R(sx+x,c+1,1,2,'#ffb050')}}
    R(sx,sy+T-2,T,2,'#00000045')}
  else fireTile2(m,sx,sy,tx,ty,n,t)}
// the Fire temple's palace (Forbidden-City style, smaller than the other temples) and its hall: 88 hall floor (red lacquer), 89 hall wall (ceiling, gold plaque and swirl frieze, lattice windows),
// 90 red column banded in gold, 91 golden dais steps, 92 altar with the sacred flame, 93 teal bronze incense burner, 94 white marble floor, 95 balustrade, 96 marble steps, 97 marble bridge over the lava moat,
// 98 bronze brazier, 99 round fire basin
function fireTile2(m,sx,sy,tx,ty,n,t){const O='#141418',fl=((t/130)|0)%3,GOLD='#e8b030',RED='#b8322a',inH=zoneOf(tx,ty)===8;
  const lacquer=()=>{R(sx,sy,T,T,'#5a2420');R(sx,sy+7,T,1,'#3e1614');R(sx,sy+15,T,1,'#3e1614');R(sx+(ty%2?5:12),sy,1,8,'#3e1614');if(n%4===0)R(sx+n%10+2,sy+4,5,1,'#7a3a30');if(ty%4===0)R(sx,sy+3,T,1,'#c8962a')};
  const marble=()=>{R(sx,sy,T,T,'#e8e4da');R(sx,sy+7,T,1,'#cfcabc');R(sx+(ty%2?4:11),sy,1,T,'#cfcabc');if(n%7===0)R(sx+n%10+2,sy+n%9+3,4,1,'#dcd6c8')};
  const dark=()=>{R(sx,sy,T,T,'#34343c');R(sx+n%11,sy+(n*3)%12,4,2,'#2a2a32')};
  if(m===88)lacquer();
  else if(m===89){const r=ty-PH.y0,side=zoneOf(tx,ty)===9||tx===PH.x0||tx===PH.x1||ty===PH.y1;
    if(side){R(sx,sy,T,T,'#8a2420');R(sx,sy+2,T,1,GOLD);R(sx,sy+13,T,1,GOLD);if((tx===PH.x0||tx===PH.x1)&&ty>=PH.y0+4&&ty<=PH.y0+5){R(sx+2,sy+1,12,14,'#c8962a');R(sx+3,sy+2,10,12,'#efe6d0');for(let q=0;q<10;q+=3){R(sx+3+q,sy+2,1,12,'#9a8a70');R(sx+3,sy+2+q,10,1,'#9a8a70')}}}
    else if(r===0){R(sx,sy,T,T,'#3a1814');R(sx,sy+10,T,1,'#7a3a2a');for(let q=0;q<T;q+=4)R(sx+q,sy+11,2,5,'#5a2820');R(sx,sy+15,T,1,GOLD)}
    else if(r===1){R(sx,sy,T,T,'#a82a24');R(sx,sy,T,1,GOLD);if(tx===PH.dx-1||tx===PH.dx){R(sx,sy+3,T,10,GOLD);R(sx,sy+3,T,1,'#fff0b0');R(sx+3,sy+5,10,6,'#1f3a8a');for(let q=0;q<3;q++)R(sx+4+q*3,sy+7,2,2,GOLD)}else{R(sx+1,sy+3,3,10,GOLD);R(sx+12,sy+3,3,10,GOLD)}}
    else{R(sx,sy,T,T,'#7a1f1c');R(sx,sy,T,2,GOLD);R(sx,sy+T-2,T,2,GOLD);R(sx+2,sy+5,5,1,GOLD);R(sx+6,sy+5,1,5,GOLD);R(sx+2,sy+9,5,1,GOLD);R(sx+9,sy+7,5,1,GOLD);R(sx+9,sy+7,1,5,GOLD);R(sx+9,sy+11,5,1,GOLD)}}
  else if(m===90){lacquer();R(sx+4,sy+2,8,13,RED);R(sx+4,sy+2,2,13,'#d84a3a');R(sx+10,sy+2,2,13,'#8a2420');R(sx+4,sy+4,8,2,GOLD);R(sx+4,sy+10,8,2,GOLD);R(sx+3,sy,10,3,'#c8962a');R(sx+3,sy+14,10,2,'#c8962a')}
  else if(m===91){lacquer();R(sx,sy,T,T,'#6a3a10');for(let k=0;k<3;k++){R(sx,sy+k*5,T,4,GOLD);R(sx,sy+k*5,T,1,'#fff0b0');R(sx,sy+k*5+3,T,1,'#c8901a')}}
  else if(m===92){lacquer();R(sx,sy+8,T,8,'#c8901a');R(sx+1,sy+8,T-2,2,GOLD);R(sx+3,sy+6,10,4,'#8a5a1a');R(sx+5,sy-1+(fl%2),6,8,'#e8641c');R(sx+6,sy+1,4,5,'#ffb050');R(sx+7,sy+2,2,3,'#fff0b0');R(sx,sy-3,T,10,'rgba(255,150,50,.18)')}
  else if(m===93){lacquer();R(sx+4,sy+7,8,8,'#16605e');R(sx+3,sy+5,10,3,'#2aa0a0');R(sx+5,sy+2,6,4,'#2aa0a0');R(sx+7,sy,2,3,'#16605e');R(sx+4,sy+8,2,6,'#3ac0c0');const p=((t/60+n)%24)|0;R(sx+7+(p>>3),sy-p/2|0,2,3,'rgba(220,220,230,.5)')}
  else if(m===94)marble();
  else if(m===95){marble();R(sx,sy+3,T,3,'#fffdf8');R(sx,sy+3,T,1,'#ffffff');R(sx,sy+5,T,1,'#cfcabc');for(let q=1;q<T;q+=5){R(sx+q,sy+6,2,8,'#efeae0');R(sx+q,sy+6,1,8,'#fff')}R(sx,sy+14,T,2,'#bdb7a8')}
  else if(m===96){marble();for(let j=2;j<T;j+=4){R(sx,sy+j,T,1,'#cfcabc');R(sx,sy+j+1,T,1,'#fffdf8')}}
  else if(m===97){R(sx,sy,T,T,'#e8641c');R(sx+1,sy,T-2,T,'#f0ece2');R(sx+1,sy,1,T,'#cfcabc');R(sx+T-2,sy,1,T,'#cfcabc');R(sx,sy,3,T,'#fffdf8');R(sx+T-3,sy,3,T,'#fffdf8');R(sx+3,sy+7,T-6,1,'#dcd6c8')}
  else if(m===98){if(ty>=36)dark();else marble();R(sx+4,sy+11,8,4,'#6e4a1a');R(sx+3,sy+8,10,4,'#a8782a');R(sx+2,sy+6,12,3,'#c8962a');R(sx+5,sy+1+(fl%2),6,6,'#e8641c');R(sx+6,sy+2,4,4,'#ffb050');R(sx+7,sy+3,2,2,'#fff0b0');R(sx+1,sy-1,14,10,'rgba(255,150,50,.2)')}
  else if(m===100)dark();
  else if(m===101){R(sx,sy,T,T,'#2f6fc4');if(((t/450|0)+n)%5<2)R(sx+2+n%9,sy+4+(n>>1)%8,5,1,'#5f9fe8');R(sx,sy,T,T,'rgba(70,215,200,.32)')}
  else if(m===99){marble();R(sx+1,sy+2,14,12,'#8a6a3a');R(sx+2,sy+3,12,10,'#c8962a');R(sx+3,sy+4,10,8,'#e8641c');const w=((t/120+n)|0)%8;R(sx+3+w,sy+6,4,1,'#ffd070');R(sx+4,sy+9,5,1,'#ffb050');R(sx+3,sy+4,10,8,'rgba(255,170,60,.18)')}}
// buildings: the great gate ('firegate', 11 tiles wide: red wall, three arched gateways, a two-tier golden roof), the fire hall's front ('firehall', 7 wide), and the pirates' tents ('tent', 3 wide)
function fireGate(b,x,y,t){const W=b.w*T,O='#141010',GOLD='#e8b030',G2='#c8901a';R(x-4,y+44,W+8,6,'#00000030');
  R(x,y+6,W,42,'#b8322a');R(x,y+6,W,2,'#d84a3a');R(x,y+40,W,8,'#e8e4da');R(x,y+40,W,1,'#fffdf8');
  [[28,24],[76,40],[128,24]].forEach(([ax,aw])=>{R(x+ax,y+16,aw,32,O);R(x+ax,y+16,3,3,'#b8322a');R(x+ax+aw-3,y+16,3,3,'#b8322a');R(x+ax+2,y+14,aw-4,3,O)});
  R(x+W/2-18,y+8,36,6,GOLD);R(x+W/2-16,y+9,32,4,'#1f3a8a');for(let i=0;i<6;i++)R(x+W/2-14+i*5,y+10,3,2,GOLD);
  R(x-10,y-4,W+20,12,G2);R(x-9,y-3,W+18,10,GOLD);for(let i=0;i<W+18;i+=4)R(x-9+i,y-3,1,10,G2);R(x-10,y+6,W+20,2,'#2a9a8a');R(x-10,y-4,W+20,1,'#fff0b0');
  R(x+14,y-20,W-28,16,'#b8322a');for(let i=0;i<W-30;i+=8){R(x+16+i,y-18,4,10,GOLD);R(x+17+i,y-17,2,8,'#7a1f1c')}
  R(x+6,y-32,W-12,14,G2);R(x+7,y-31,W-14,12,GOLD);for(let i=0;i<W-14;i+=4)R(x+7+i,y-31,1,12,G2);R(x+6,y-21,W-12,2,'#2a9a8a');R(x+6,y-32,W-12,1,'#fff0b0');R(x+W/2-3,y-38,6,8,GOLD)}
function fireHall(b,x,y,t){const W=b.w*T,O='#141010',GOLD='#e8b030',G2='#c8901a';R(x-2,y+29,W+4,6,'#00000030');
  R(x,y+4,W,28,'#b8322a');R(x,y+4,W,2,'#d84a3a');R(x,y+30,W,2,'#e8e4da');
  for(let i=0;i<7;i++){const cx=x+i*16;if(i===3)continue;R(cx+3,y+8,10,22,'#8a2420');R(cx+4,y+9,8,20,GOLD);R(cx+5,y+10,6,18,'#a82a24');R(cx+7,y+10,2,18,GOLD)}
  R(x+W/2-8,y+10,16,22,O);R(x+W/2-8,y+10,16,2,'#2a2630');
  R(x-8,y-8,W+16,14,G2);R(x-7,y-7,W+14,12,GOLD);for(let i=0;i<W+14;i+=4)R(x-7+i,y-7,1,12,G2);R(x-8,y+4,W+16,2,'#2a9a8a');R(x-8,y-8,W+16,1,'#fff0b0');
  R(x+8,y-22,W-16,14,'#b8322a');for(let i=0;i<W-18;i+=8){R(x+10+i,y-20,4,10,GOLD)}
  R(x+2,y-32,W-4,12,G2);R(x+3,y-31,W-6,10,GOLD);for(let i=0;i<W-6;i+=4)R(x+3+i,y-31,1,10,G2);R(x+2,y-22,W-4,2,'#2a9a8a');R(x+W/2-2,y-38,4,8,GOLD)}
function tent(b,x,y,t){const W=b.w*T,c=b.tent,O='#2a1b0e';R(x-2,y+27,W+4,5,'#00000030');
  for(let r=0;r<26;r++){const hw=Math.round(4+r*.78),mx=x+W/2;R(mx-hw,y+4+r,hw*2,1,O);R(mx-hw+1,y+4+r,hw*2-2,1,c)}
  for(let r=0;r<26;r+=5){const hw=Math.round(4+r*.78);R(x+W/2-hw+1,y+4+r,hw*2-2,2,'#efe6d0')}
  R(x+W/2-1,y+3,2,26,'#00000020');R(x+W/2-5,y+16,10,14,O);R(x+W/2-4,y+17,8,13,'#1a1008');R(x+W/2,y+17,1,13,'#3a2a18');
  R(x+W/2-1,y-4,1,9,'#6e4a1a');R(x+W/2,y-4,6,4,'#d8302a');R(x+W/2,y-3,5,1,'#f0b040')}
// ---------- the Temple Tower's island (see art/temples/temple_tower) ----------
// Tiles: 102 pine tree (drawn on grass, rises above its tile, blocks), 103 raked gravel (walkable), 104 gravel with a flat stepping stone (walkable).
function towerTile(m,sx,sy,tx,ty,n,t){const O='#1c2a22';
  if(m===102){grassBg(tx,ty,sx,sy,n);R(sx+2,sy+11,12,3,'#00000030');R(sx+7,sy+9,2,6,'#5a3a24');
    R(sx+2,sy+6,12,5,O);R(sx+3,sy+7,10,3,'#24533a');R(sx+4,sy+1,8,6,O);R(sx+5,sy+2,6,4,'#2b6444');R(sx+6,sy-5,4,7,O);R(sx+7,sy-4,2,5,'#2f7050');
    R(sx+3,sy+7,3,1,'#3a8060');R(sx+5,sy+2,2,1,'#3a8060')}
  else{R(sx,sy,T,T,'#d4cbb6');for(let k=0;k<5;k++){const r=hs(tx*5+k,ty*3)%100;R(sx+r%14,sy+(r*3)%14,2,1,k%2?'#b8ae98':'#e6dfcf')}
    R(sx,sy+3,T,1,'#c6bda8');R(sx,sy+9,T,1,'#c6bda8');R(sx,sy+14,T,1,'#c6bda8');
    if(m===104){R(sx+3,sy+3,10,9,'#8d8f87');R(sx+4,sy+3,8,2,'#a9aba2');R(sx+3,sy+10,10,2,'#6e7068')}}}
