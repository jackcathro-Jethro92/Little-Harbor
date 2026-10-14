// ---------- the grand house's rooms (tiles 153-171; world code in js/world/granthome.js) ----------
// 153 wood floor (walk), 154 wall (plaster face with beams where a floor is below it, dark top elsewhere), 155 doorway with a noren curtain (walk), 156 low table, 157 cushion, 158 futon, 159 chest of drawers, 160 kitchen counter
// (sink or stove by column), 161 wooden bathtub, 162 flowers on a stand, 163 tokonoma alcove with a hanging scroll, 164 shoe rack, 165 rug (walk), 166 standing paper lantern, 167 shoji window, 168 bookshelf, 169 the front door,
// 170 wash basin, 171 sunken hearth with a kettle. Furniture is drawn on the floor of its room (wood in the bathroom, kitchen and hall, tatami elsewhere). Drawn straight onto the picture each frame (a few rectangles each).
const GH_WOOD=(x,y)=>(x>=287&&x<=296&&y>=266&&y<=274)||(x>=287&&x<=305&&y>=276&&y<=286);
function ghFloor(tx,ty,sx,sy,n,t){if(GH_WOOD(tx,ty)){R(sx,sy,T,T,'#a06c3a');R(sx,sy+7,T,1,'#7f5329');R(sx,sy+15,T,1,'#7f5329');R(sx+((tx*7+ty*3)%11)+2,sy,1,7,'#8a5a2e');R(sx+((tx*5+ty*9)%11)+2,sy+8,1,7,'#8a5a2e');R(sx,sy,T,1,'#b88252')}
  else towerTile(108,sx,sy,tx,ty,n,t)}
function grandHomeTile(m,sx,sy,tx,ty,n,t){const O='#2a1a10',fl=((t/160|0)+n)%3;
  if(m===153){ghFloor(tx,ty,sx,sy,n,t);return}
  if(m===154){const face=at(tx,ty+1)!==154;if(face){R(sx,sy,T,T,'#e6d8b8');R(sx,sy,T,3,'#3a2616');R(sx,sy+13,T,3,'#5a3a22');R(sx,sy+12,T,1,'#c8b890');if(tx%4===0)R(sx+7,sy+3,2,10,'#4a3020');R(sx+3,sy+6,1,1,'#d8c8a0')}
    else{R(sx,sy,T,T,'#2a1c12');R(sx,sy,T,2,'#4a3020');if(at(tx,ty-1)===154&&at(tx,ty+1)===154)R(sx+7,sy,2,T,'#34241a')}return}
  if(m===155){ghFloor(tx,ty,sx,sy,n,t);R(sx,sy,2,T,'#4a3020');R(sx+14,sy,2,T,'#4a3020');R(sx,sy,T,2,'#3a2616');R(sx+2,sy+2,12,6,'#2a4a6a');R(sx+2,sy+2,12,1,'#3a6a8a');R(sx+7,sy+3,2,4,'#e8e8e0');R(sx+4,sy+7,3,1,'#1f3a52');R(sx+9,sy+7,3,1,'#1f3a52');return}
  if(m===165){ghFloor(tx,ty,sx,sy,n,t);R(sx+1,sy,T-2,T,'#7a2a2a');R(sx+2,sy,T-4,T,'#8a3a32');R(sx+1,sy,1,T,'#e8c050');R(sx+T-2,sy,1,T,'#e8c050');if(ty%2===0)R(sx+6,sy+7,4,2,'#e8c050');return}
  if(m===167){R(sx,sy,T,T,'#e6d8b8');R(sx,sy,T,3,'#3a2616');R(sx,sy+13,T,3,'#5a3a22');R(sx+1,sy+2,14,12,O);R(sx+2,sy+3,12,10,'#f6ecc8');R(sx+2,sy+3,12,1,'#d8c890');for(let i=5;i<14;i+=4)R(sx+i,sy+3,1,10,'#8a6a3a');R(sx+2,sy+8,12,1,'#8a6a3a');R(sx+3,sy+4,3,3,'#fff8e0');return}
  if(m===163){R(sx,sy,T,T,'#e6d8b8');R(sx,sy,T,3,'#3a2616');R(sx+1,sy+2,14,13,O);R(sx+2,sy+3,12,11,'#d8c8a0');R(sx+4,sy+3,8,9,'#f4ecd8');R(sx+4,sy+3,8,1,'#8a2a2a');R(sx+7,sy+5,2,6,'#2a1a10');R(sx+6,sy+7,4,1,'#2a1a10');R(sx+2,sy+12,12,2,'#8a5a32');return}
  if(m===169){R(sx,sy,T,T,'#e6d8b8');R(sx,sy,T,3,'#3a2616');R(sx+1,sy+1,14,15,O);R(sx+2,sy+2,12,14,'#c8a070');R(sx+3,sy+3,4,10,'#bfe0f0');R(sx+9,sy+3,4,10,'#bfe0f0');R(sx+3,sy+3,4,2,'#e6f4fa');R(sx+9,sy+3,4,2,'#e6f4fa');R(sx+7,sy+3,2,13,'#7a5230');R(sx+2,sy+8,12,1,'#7a5230');R(sx+6,sy+9,1,2,'#e8c050');return}
  ghFloor(tx,ty,sx,sy,n,t);   // everything else stands on its room's floor
  if(m===156){R(sx,sy+4,T,10,O);R(sx+1,sy+5,14,8,'#8a5a32');R(sx+1,sy+5,14,2,'#a8784a');R(sx+2,sy+13,3,2,O);R(sx+11,sy+13,3,2,O);if(tx%2===0)R(sx+5,sy+7,4,3,'#e8e0d0');else R(sx+7,sy+7,3,3,'#3a6a8a')}
  else if(m===157){R(sx+2,sy+3,12,11,O);R(sx+3,sy+4,10,9,'#a83a4a');R(sx+3,sy+4,10,2,'#c8586a');R(sx+7,sy+8,2,2,'#e8c050')}
  else if(m===158){R(sx,sy+1,T,15,O);R(sx+1,sy+2,14,13,'#e8e8f0');R(sx+2,sy+3,12,4,'#f4d8d8');R(sx+1,sy+8,14,7,'#3a5a9a');R(sx+1,sy+8,14,1,'#5a7ab8');R(sx+4,sy+11,8,1,'#2a4a88')}
  else if(m===159){R(sx,sy+1,T,15,O);R(sx+1,sy+2,14,13,'#8a5a32');R(sx+1,sy+2,14,2,'#a8784a');for(let i=0;i<3;i++){R(sx+2,sy+5+i*3,12,2,'#6b4423');R(sx+7,sy+5+i*3,2,1,'#e8c050')}}
  else if(m===160){R(sx,sy+2,T,14,O);R(sx+1,sy+3,14,12,'#b0a89a');R(sx+1,sy+3,14,4,'#e8e0d0');if(tx%2===0){R(sx+3,sy+4,10,3,'#6a8aa0');R(sx+3,sy+4,10,1,'#9ac0d8');R(sx+7,sy+1,2,3,'#c0c8d0')}else{R(sx+3,sy+4,4,3,'#2a2a30');R(sx+9,sy+4,4,3,'#2a2a30');if(fl)R(sx+4,sy+3,2,1,'#ff8a28')}R(sx+2,sy+9,12,1,'#8a8478');R(sx+3,sy+11,3,1,'#6a645a')}
  else if(m===161){R(sx,sy+1,T,15,O);R(sx+1,sy+2,14,13,'#b88a52');R(sx+3,sy+4,10,9,'#6ab4d8');R(sx+3,sy+4,10,2,'#9ad4ea');for(let i=0;i<2;i++)R(sx+5+i*4+((t/300|0)%2),sy+3-i*1,1,2,'rgba(255,255,255,.7)')}
  else if(m===162){R(sx+4,sy+9,8,6,O);R(sx+5,sy+10,6,4,'#8a5a32');R(sx+6,sy+5,4,5,'#3a6a8a');R(sx+7,sy+1,2,5,'#4a8a3a');R(sx+4,sy+1,3,4,'#e8688a');R(sx+9,sy+2,3,3,'#f2c14e');R(sx+6,sy,2,2,'#e8688a')}
  else if(m===164){R(sx,sy+6,T,10,O);R(sx+1,sy+7,14,8,'#7a5230');R(sx+1,sy+7,14,2,'#a0723e');R(sx+3,sy+4,4,3,'#2a2a3a');R(sx+9,sy+4,4,3,'#a83a2a');R(sx+3,sy+4,4,1,'#4a4a5a')}
  else if(m===166){R(sx+3,sy+13,10,2,'#00000030');R(sx+5,sy+2,6,12,O);R(sx+6,sy+3,4,10,fl?'#ffe08a':'#ffd070');R(sx+6,sy+3,4,2,'#fff2c0');R(sx+4,sy+1,8,2,'#3a2616');R(sx+4,sy+13,8,2,'#3a2616');R(sx-3,sy-2,22,20,'rgba(255,190,90,.10)')}
  else if(m===168){R(sx,sy+1,T,15,O);R(sx+1,sy+2,14,13,'#6b4423');for(let r=0;r<3;r++){R(sx+1,sy+2+r*4+3,14,1,'#3a2616');for(let b=0;b<5;b++)R(sx+2+b*3,sy+3+r*4,2,3,['#a83a2a','#3a5a9a','#4a8a3a','#e8c050','#8a4a8a'][(b+r+tx)%5])}}
  else if(m===170){R(sx+2,sy+5,12,10,O);R(sx+3,sy+6,10,8,'#8a5a32');R(sx+4,sy+4,8,5,O);R(sx+5,sy+5,6,3,'#a8c8d8');R(sx+7,sy+2,2,3,'#c0c8d0')}
  else if(m===171){R(sx,sy,T,T,'#2a1a10');R(sx+1,sy+1,14,14,'#5a4a38');R(sx+3,sy+3,10,10,'#2a2018');R(sx+5,sy+8,6,3,fl?'#ff8a28':'#e8501a');R(sx+6,sy+7,4,1,'#ffd070');R(sx+5,sy+2,6,5,'#3a3a40');R(sx+6,sy+2,4,1,'#6a6a72');R(sx+10,sy+3,3,1,'#3a3a40')}}
