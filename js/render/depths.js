// ---------- the Depths and the chamber under the Temple Tower (Quest 8; world code in js/world/depths.js) ----------
// 142 flagstones (walk), 143 dark wall, 145 stairs up, 146 wall torch, 147 the chamber's floor with its rune circle, 148 to 151 the four braziers (earth green, sea blue, sky white, fire red and low). Drawn per tile each frame like the
// other rooms; the torches and braziers flicker. The Depths are shown through a dark light radius round the player (js/render/draw.js).
const BRAZ={148:['#6bd04a','#2e7a22'],149:['#4aa8f0','#1e5a9a'],150:['#f4f8ff','#8a98b0'],151:['#ff7a2a','#a8280a']};
function depthTile(m,sx,sy,tx,ty,n,t){const O='#0c0e14',fl=((t/140|0)+n)%3;
  const floor=()=>{R(sx,sy,T,T,'#262a38');R(sx,sy,T,1,'#1c2030');R(sx,sy,1,T,'#1c2030');R(sx+1,sy+1,T-2,2,'#303548');if(n%4===0)R(sx+3+n%7,sy+5+n%5,6,1,'#1a1d2a');if(n%9===0){R(sx+2,sy+9,2,2,'#3a4a3a');R(sx+4,sy+10,1,1,'#4a5a44')}if(n%13===0)R(sx+8,sy+3,5,1,'#444a60')};
  const wall=()=>{R(sx,sy,T,T,'#10121a');R(sx,sy,T,3,'#2a2e3e');R(sx,sy+3,T,1,'#1a1c28');for(let r=0;r<3;r++){const y=sy+4+r*4;R(sx,y,T,1,'#1a1d28');R(sx+((n+r*5)%8)+1,y+1,1,3,'#1a1d28')}};
  if(m===142){floor();return}
  // the traps are subtle (playtest #4): a plate with a faint seam, a small dark hole in the wall, a vent with faint grating
  if(m===172){floor();R(sx+2,sy+2,T-4,1,'#191c2b');R(sx+2,sy+T-3,T-4,1,'#191c2b');R(sx+2,sy+2,1,T-4,'#191c2b');R(sx+T-3,sy+2,1,T-4,'#191c2b');return}
  if(m===173){wall();R(sx+6,sy+8,4,4,'#0a0b12');R(sx+7,sy+9,2,2,'#030306');return}
  if(m===174){floor();for(let i=0;i<3;i++)R(sx+4,sy+4+i*3,8,1,'#181a26');R(sx+3,sy+13,10,1,'#1e2132');return}
  if(m===143){wall();return}
  if(m===146){wall();R(sx+6,sy+6,4,8,O);R(sx+7,sy+7,2,6,'#4a3a2a');R(sx+5,sy+2,6,5,O);R(sx+6,sy+3,4,3,fl?'#ffb040':'#ff8a28');R(sx+7,sy+3+(fl%2),2,2,'#fff2a8');R(sx-3,sy-3,22,22,'rgba(255,170,60,.07)');return}
  if(m===145){floor();for(let i=0;i<4;i++){R(sx,sy+1+i*4,T,3,i%2?'#4a4e62':'#5a5e74');R(sx,sy+3+i*4,T,1,'#2a2d3c')}R(sx,sy,T,1,'#7a7e94');return}
  if(m===147){const cx=CZ.dx,cy=CZ.y0+6,d=Math.hypot(tx-cx,ty-cy);R(sx,sy,T,T,'#2c2a3e');R(sx,sy,T,1,'#222034');R(sx,sy,1,T,'#222034');R(sx+1,sy+1,T-2,2,'#383650');
    if(Math.abs(d-3.2)<.7){R(sx+1,sy+1,T-2,T-2,'#4a3a78');R(sx+2,sy+2,T-4,T-4,fl?'#7a5ac8':'#6a4ab8')}
    else if(Math.abs(d-1.5)<.55){R(sx+3,sy+3,T-6,T-6,'#3a3260');R(sx+5,sy+5,T-10,T-10,'#9a7ae8')}
    else if(d<.8){R(sx+2,sy+2,T-4,T-4,'#d8c8ff');R(sx+5,sy+5,T-10,T-10,'#ffffff')}
    else if(n%6===0)R(sx+4,sy+6,8,1,'#201e30');return}
  if(m>=148&&m<=151){const[a,b]=BRAZ[m];R(sx,sy,T,T,'#2c2a3e');R(sx+3,sy+12,10,3,'#00000040');R(sx+4,sy+8,8,6,O);R(sx+5,sy+9,6,4,'#5a5668');R(sx+3,sy+6,10,3,O);R(sx+4,sy+7,8,1,'#7a768a');
    const h=m===151?4:7;R(sx+5,sy+6-h,6,h,b);R(sx+6,sy+6-h-(fl%2),4,h,a);R(sx+7,sy+5-h/2,2,2,'#ffffff');R(sx-4,sy-6,24,24,'rgba('+(m===148?'107,208,74':m===149?'74,168,240':m===150?'240,248,255':'255,122,42')+',.08)')}}
