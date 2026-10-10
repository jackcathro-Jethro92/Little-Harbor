// ---------- buildings and temples ----------
function tmp(b,x,y,t){const W=b.w*T,O='#2a1b0e',fl=((t/140)|0)%3;R(x-2,y+30,W+6,5,'#00000030');
  if(b.tower){R(x+2,y-14,W-4,46,O);R(x+3,y-13,W-6,44,'#8d8f87');R(x+3,y-13,W-6,3,'#b3b4ab');R(x+W/2-2,y-4,4,7,'#2e3a52');R(x+W/2-2,y+8,4,7,'#2e3a52');R(x+W/2-3,y+22,6,10,O);R(x,y-18,W,6,O);R(x+1,y-17,W-2,4,'#5f7183');R(x+W/2-1,y-24-(fl%2),2,6,'#f2c14e');return}
  R(x,y+22,W,10,O);R(x+1,y+23,W-2,8,'#9a9b93');R(x+1,y+23,W-2,2,'#c2c3ba');
  for(let i=0;i<4;i++){const px=x+4+i*((W-14)/3|0);R(px,y+8,5,15,O);R(px+1,y+8,3,15,'#d8d4c4')}
  R(x-3,y+2,W+6,8,O);R(x-2,y+3,W+4,6,b.col);R(x+W/2-9,y-4,18,7,O);R(x+W/2-8,y-3,16,5,b.col);R(x+W/2-2,y-10-(fl%2),4,6,b.orb);R(x+W/2-1,y-12-(fl%2),2,3,'#fff')}
function bld(b,x,y,t){houseArt(b,x,y,t)}   // houses and shops: the art is in js/render/houses.js
// the Fighters Guild and the Gladiators' Arena: wide stone halls (b.hall 'guild' or 'arena')
function hall(b,x,y,t){const W=b.w*T,O='#2a1b0e',g1='#9a9b93',g2='#b3b4ab',g3='#6e7068',arena=b.hall==='arena',dx=x+((W/2-5)|0),fl=((t/160)|0)%3;
  R(x-2,y+29,W+6,6,'#00000030');R(x,y+8,W,24,O);R(x+1,y+9,W-2,22,g1);
  for(let j=0;j<22;j+=4){R(x+1,y+9+j,W-2,1,g3);for(let i=((j/4|0)%2)*5;i<W-2;i+=10)R(x+1+i,y+9+j,1,4,g3)}
  R(x+1,y+9,W-2,2,g2);R(x,y+29,W,3,O);R(x+1,y+29,W-2,2,g2);
  R(dx-3,y+14,16,18,O);R(dx-2,y+15,14,17,arena?'#1a1612':'#3d2a14');R(dx-2,y+15,14,3,O);
  if(arena){for(let i=0;i<4;i++)R(dx-1+i*4,y+16,1,15,'#6e7068');R(dx-2,y+22,14,1,'#6e7068');R(dx-2,y+27,14,1,'#6e7068')}else{R(dx+4,y+16,1,15,'#6b4423');R(dx-2,y+22,14,1,'#8a5a2e')}
  R(x-3,y+1,W+6,9,O);R(x-2,y+2,W+4,7,arena?'#c8b88a':'#a63f30');R(x-2,y+2,W+4,1,arena?'#e8dcb0':'#d4684d');
  if(arena)for(let i=0;i<W+4;i+=8){R(x-3+i,y-2,6,4,O);R(x-2+i,y-1,4,3,'#c8b88a')}
  else for(let i=0;i<W+4;i+=6)R(x-2+i,y+4,1,4,'#7c2c22');
  const bc=arena?['#c83a2a','#f2c14e']:['#2f5fa8','#e8e8e0'];
  [x+4,x+W-10].forEach(bx=>{R(bx-1,y+11,8,15,O);R(bx,y+11,6,13,bc[0]);R(bx+2,y+14,2,6,bc[1]);R(bx,y+24,2,2,bc[0]);R(bx+4,y+24,2,2,bc[0])});
  const cx=x+((W/2)|0);
  if(arena){R(cx-6,y+3,12,5,O);R(cx-5,y+4,10,3,'#f2c14e');R(cx-1,y+4,2,3,'#c83a2a');R(cx-1,y-6-(fl%2),2,5,'#d83828');R(cx-5,y-5-(fl%2),4,3,'#d83828')}
  else{for(let k=-1;k<=1;k+=2){for(let q=0;q<6;q++)R(cx+k*(q-3)-1,y+2+q,2,1,'#dfe6ec');R(cx+k*3-1,y+8,3,1,'#c8a040')}R(cx-1,y+2,2,7,'#dfe6ec')}
}
