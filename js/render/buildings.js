// ---------- buildings and temples ----------
function tmp(b,x,y,t){const W=b.w*T,O='#2a1b0e',fl=((t/140)|0)%3;R(x-2,y+30,W+6,5,'#00000030');
  if(b.tower){R(x+2,y-14,W-4,46,O);R(x+3,y-13,W-6,44,'#8d8f87');R(x+3,y-13,W-6,3,'#b3b4ab');R(x+W/2-2,y-4,4,7,'#2e3a52');R(x+W/2-2,y+8,4,7,'#2e3a52');R(x+W/2-3,y+22,6,10,O);R(x,y-18,W,6,O);R(x+1,y-17,W-2,4,'#5f7183');R(x+W/2-1,y-24-(fl%2),2,6,'#f2c14e');return}
  R(x,y+22,W,10,O);R(x+1,y+23,W-2,8,'#9a9b93');R(x+1,y+23,W-2,2,'#c2c3ba');
  for(let i=0;i<4;i++){const px=x+4+i*((W-14)/3|0);R(px,y+8,5,15,O);R(px+1,y+8,3,15,'#d8d4c4')}
  R(x-3,y+2,W+6,8,O);R(x-2,y+3,W+4,6,b.col);R(x+W/2-9,y-4,18,7,O);R(x+W/2-8,y-3,16,5,b.col);R(x+W/2-2,y-10-(fl%2),4,6,b.orb);R(x+W/2-1,y-12-(fl%2),2,3,'#fff')}
function bld(b,x,y,t){
  const W=b.w*T,k=b.roof,[c1,c2,c3,c4]={thatch:['#c9a35c','#a98340','#7e5f2e','#e0c07c'],slate:['#5f7183','#46586a','#2f3d4b','#8aa0b5'],red:['#a63f30','#7c2c22','#531c16','#d4684d']}[k],O='#2a1b0e',dc=hs(b.x,b.y)%4;
  R(x-2,y+29,W+8,6,'#00000030');
  R(x,y+12,W,20,O);R(x+1,y+13,W-2,18,'#6e4b2c');for(let i=3;i<W-1;i+=4)R(x+i,y+14,1,16,'#573a21');R(x+1,y+25,W-2,1,'#4a3018');
  R(x,y+29,W,3,O);R(x+1,y+29,W-2,2,'#8d8f87');R(x+1,y+29,W-2,1,'#b3b4ab');
  const dx=x+((W/2-5)|0);
  R(dx-1,y+17,12,15,O);R(dx,y+18,10,13,'#efe3bd');R(dx+4,y+18,1,13,'#6e4b2c');R(dx,y+23,10,1,'#6e4b2c');R(dx,y+27,10,1,'#6e4b2c');
  [x+4,x+W-12].forEach(wx=>{R(wx,y+18,8,8,O);R(wx+1,y+19,6,6,'#efe3bd');R(wx+3,y+19,1,6,'#6e4b2c');R(wx+1,y+22,6,1,'#6e4b2c')});
  R(x+1,y+16,2,14,'#3d2a14');R(x+W-3,y+16,2,14,'#3d2a14');
  if(b.sign){const nc={fish:'#3b6fb5',rod:'#7a4fa0',boat:'#2f8f7a',smith:'#b8481f'}[b.sign];R(dx,y+20,10,7,nc);R(dx+3,y+21,1,6,O);R(dx+6,y+21,1,6,O);R(dx,y+26,10,1,O)}
  R(x-4,y+1,W+8,14,O);R(x-3,y+2,W+6,12,c1);R(x+3,y-1,W-6,3,O);R(x+4,y,W-8,3,c1);
  if(k==='thatch'){for(let i=0;i<W+4;i+=3){const n=hs(b.x+i,b.y)%5;R(x-2+i,y+4+n*2,3,2,c2);R(x-1+i,y+3+(n*3)%9,1,1,c4)}R(x-3,y+11,W+6,3,c2);
    R(x+4,y-4,W-8,1,'#5a3f1e');for(let i=0;i<W-8;i+=6)R(x+4+i,y-5,1,3,'#5a3f1e')}
  else{for(let j=4;j<14;j+=3){R(x-3,y+j,W+6,1,c2);for(let i=((j/3|0)%2)*3;i<W+6;i+=6)R(x-3+i,y+j-3,1,3,c2);R(x-3,y+j-2,W+6,1,c4)}
    if(k==='slate'){R(x+W-12,y-5,5,9,O);R(x+W-11,y-4,3,8,'#6c6a66');for(let p=0;p<3;p++)R(x+W-12+(p%2)*2,y-9-p*5-((t/90|0)%4),4,3,'rgba(240,240,240,'+(.7-p*.2)+')')}}
  R(x-3,y+2,W+6,1,c4);R(x-3,y+14,W+6,2,'#00000045');
  if(b.sign){const sx=x+((W-20)/2|0);R(sx,y+15,20,5,O);R(sx+1,y+16,18,3,'#fff6c9');
    if(b.sign==='fish'){R(sx+5,y+16,6,3,'#3b82c4');R(sx+11,y+17,2,1,'#3b82c4')}
    else if(b.sign==='rod'){R(sx+3,y+18,14,1,'#6b4423');R(sx+16,y+16,1,3,'#6b4423')}
    else if(b.sign==='smith'){R(sx+5,y+16,10,2,'#3a3a44');R(sx+8,y+18,4,1,'#3a3a44');R(sx+6,y+19,8,1,'#3a3a44');R(sx+15,y+16,2,1,'#e8632e')}
    else{R(sx+4,y+18,12,1,'#7a4a26');R(sx+9,y+16,1,3,'#6b4423')}}
  else if(dc===0){R(x+W+2,y+22,7,9,O);R(x+W+3,y+23,5,7,'#8a5a2e');R(x+W+3,y+26,5,1,'#4a3018')}
  else if(dc===1){R(x-7,y+16,7,1,'#4a3018');for(let q=0;q<3;q++)R(x-7+q*2,y+17,2,3,'#e0762f')}
  else if(dc===2){R(x+W-11,y+17,9,9,O);R(x+W-10,y+18,7,7,'#d9b45f');R(x+W-9,y+19,5,5,'#e8cc7a');R(x+W-7,y+18,1,7,'#a8863a')}
  else{R(x+W+2,y+23,8,8,O);R(x+W+3,y+24,6,6,'#a8743f');R(x+W+3,y+27,6,1,O)}
}
