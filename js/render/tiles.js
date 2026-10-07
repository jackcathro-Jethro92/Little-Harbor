// ---------- drawing ----------
function tile(tx,ty,sx,sy,t){
  const n=hs(tx,ty)%100,i=ty*MW+tx,mm=M[i],here=zoneOf(P.x,P.y)%2===1||zoneOf(P.x,P.y)===4,zt=zoneOf(tx,ty),zp=zoneOf(P.x,P.y);
  if(zt!==zp){R(sx,sy,T,T,zp?'#000':'#2f6fc4');if(!zp&&((Math.floor(t/450)+n)%5)<2)R(sx+2+n%9,sy+4+(n>>1)%8,5,1,'#5f9fe8');return}
  if(mm>=21&&mm<=23){
    if(!here){R(sx,sy,T,T,'#2f6fc4');if(((Math.floor(t/450)+n)%5)<2)R(sx+2+n%9,sy+4+(n>>1)%8,5,1,'#5f9fe8');return}
    if(mm===21){R(sx,sy,T,T,'#c49a62');R(sx,sy+3,T,1,'#a97f4a');R(sx,sy+8,T,1,'#a97f4a');R(sx,sy+13,T,1,'#a97f4a');R(sx+(ty%2?4:11),sy,1,T,'#a97f4a');if(n%9===0)R(sx+n%10+2,sy+n%12+1,3,1,'#d6b27a')}
    else{R(sx,sy,T,T,'#7a5a38');R(sx,sy,T,3,'#a8743f');R(sx,sy+T-3,T,3,'#573a21');
      if(mm===22&&ty===IR.y0&&tx%3===0){R(sx+2,sy+4,12,9,'#3d2a14');R(sx+3,sy+5,10,7,'#9ad3f0');R(sx+7,sy+5,2,7,'#3d2a14')}
      if(mm===23){R(sx+2,sy+1,12,15,'#3d2a14');R(sx+3,sy+2,10,14,'#6b4423');R(sx+10,sy+9,2,2,'#f2c14e')}}
    return}
  if(mm===54||mm===55){ // jagged rock: angular grey peaks with a lit left face, a dark right face and cracks; 54 stands in the sea, 55 on the shore
    if(mm===54){R(sx,sy,T,T,'#2f6fc4');if(((Math.floor(t/450)+n)%5)<2)R(sx+2+n%9,sy+4+(n>>1)%8,5,1,'#5f9fe8')}else{R(sx,sy,T,T,'#6e6a62');if(n%4===0)R(sx+n%12+2,sy+n%10+3,2,1,'#58544d')}
    const s=hs(tx*3,ty*5),p1=2+s%5,p2=9+(s>>3)%5,a=14+(s>>6)%6,b=10+(s>>9)%5,sl=2+s%2,O='#26272b';
    for(let x=0;x<T;x++){const h=Math.max(Math.round(a-Math.abs(x-p1)*sl),Math.round(b-Math.abs(x-p2)*2),3),top=sy+T-h,pk=(x===p1||x===p2),lit=x<(h===Math.round(a-Math.abs(x-p1)*sl)?p1:p2);
      R(sx+x,top-1,1,1,O);R(sx+x,top,1,h,lit?'#9a9ca0':'#686a70');if(!pk)R(sx+x,top,1,2,lit?'#bcbec2':'#82848a');else R(sx+x,top,1,3,'#d0d2d6');
      if((x+s)%5===0)R(sx+x,top+3+(s>>x)%5,1,3,O)}
    R(sx,sy+T-2,T,2,'#00000045');if(mm===54)R(sx+1,sy+T-1,T-2,1,'#d8ecff');return}
  if(mm===52){R(sx,sy,T,T,'#e3cf94');if(n%5===0)R(sx+n%11+2,sy+n%9+3,2,1,'#c9b277');if(n%7===0)R(sx+n%9+3,sy+n%11+2,1,1,'#f2e4b4');return}
  if(mm===53){R(sx,sy,T,T,'#6e7068');R(sx,sy+7,T,1,'#4a4c46');R(sx,sy+15,T,1,'#4a4c46');const C=['#d9534f','#3b82c4','#f2c14e','#4caf72','#9c5bb5'];[1,6,11].forEach((px,j)=>{const w=(((t/300)|0)+n+j)%6===0?1:0;R(sx+px,sy+1+w,4,4,'#2a1b0e');R(sx+px+1,sy+2+w,2,2,'#e8c8a0');R(sx+px,sy+5+w,4,2,C[(n+j*3)%5]);R(sx+px,sy+9+w,4,4,'#2a1b0e');R(sx+px+1,sy+10+w,2,2,'#e8c8a0');R(sx+px,sy+13+w,4,2,C[(n+j*2+1)%5])});return}
  if(mm===32){R(sx,sy,T,T,'#2f6fc4');if(((Math.floor(t/450)+n)%5)<2)R(sx+2+n%9,sy+4+(n>>1)%8,5,1,'#5f9fe8');R(sx+1,sy+11,14,3,'#d8ecff');R(sx+3,sy+4,10,9,'#2e2e36');R(sx+4,sy+3,8,9,'#8d8f87');R(sx+5,sy+3,4,2,'#b0b2b8');R(sx+6,sy+9,5,2,'#6e7068');return}
  if(M[i]===0){
    R(sx,sy,T,T,'#2f6fc4');
    const ph=(Math.floor(t/450)+n)%5;
    if(ph<2)R(sx+2+n%9,sy+4+(n>>1)%8,5,1,'#5f9fe8');
    if(ph===3)R(sx+8+n%5,sy+2+n%11,3,1,'#4a86d8');
    [[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b],k)=>{if(at(tx+a,ty+b)!==0&&tx+a>=0&&ty+b>=0){
      if(k===0)R(sx,sy,T,2,'#d8ecff');if(k===1)R(sx,sy+T-2,T,2,'#d8ecff');
      if(k===2)R(sx,sy,2,T,'#d8ecff');if(k===3)R(sx+T-2,sy,2,T,'#d8ecff')}});
    return;
  }
  if(M[i]===2){R(sx,sy,T,T,'#ead9a0');if(n<35)R(sx+n%13,sy+(n*3)%13,2,1,'#cdb77a');return}
  if(M[i]===3){R(sx,sy,T,T,'#a9763f');R(sx,sy+5,T,1,'#7d5530');R(sx,sy+11,T,1,'#7d5530');R(sx+3,sy,1,5,'#8a5d33');R(sx+11,sy+6,1,5,'#8a5d33');return}
  if(mm===43||mm===44||mm===51){const rt=at(tx+1,ty),lt=at(tx-1,ty);torii(sx,sy,mm===51?(rt===43||rt===44?0:2):1,zt===2,mm===43,n,t);return}
  const G=zt===2?['#2c4a2e','#27432a','#223b25']:['#7fa84f','#74a048','#678f3f'],v=Math.sin(tx*.8)+Math.sin(ty*.9)+Math.sin((tx+ty)*.45),gi=v>1.1?0:v<-1.1?2:1,m=M[i];
  const fr=(pred,col,d)=>[[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b],k)=>{if(!pred(at(tx+a,ty+b)))return;
    for(let j=0;j<4;j++){const r=hs(tx*7+j,ty*5+k)%4,e=d+(r>>1),l=4+r;
      if(k<2)R(sx+j*4,k?sy+T-e:sy,l,e,col);else R(k===2?sx:sx+T-e,sy+j*4,e,l,col)}});
  if(m===6&&tx<100&&ty<fTop(tx)-1){R(sx,sy,T,T,n%3?'#b08f6c':'#b99a78');if(n<50)R(sx+n%11,sy+(n*5)%12,4,3,'#9e7e5d');if(n>75)R(sx+n%12,sy+(n*3)%13,2,1,'#cdb08c');if(n%17===0)R(sx+n%10+2,sy+9,2,2,'#7b7d86');return}
  if(m===6){R(sx,sy,T,T,n%3?'#c8934e':'#d19c5c');if(n<50)R(sx+n%11,sy+(n*5)%12,4,3,'#b8823f');if(n>75)R(sx+n%12,sy+(n*3)%13,2,1,'#e0b378');if(n%17===0)R(sx+n%10+2,sy+9,2,2,'#9d9a90');
    fr(q=>[1,4,7,8,10,11].includes(q),G[gi],3);
    if((tx===32+OX&&ty%2)||(tx===31+OX&&!(ty%2))){R(sx+2,sy+2,12,9,'#6e5a3c');R(sx+3,sy+3,10,7,'#a3a49c');R(sx+4,sy+3,8,3,'#c9cac1');R(sx+3,sy+9,10,1,'#8a8b83')}return}
  if(m===9){R(sx,sy,T,T,'#5aaeb0');R(sx+2+n%9,sy+3+n%8,5,1,'#9bd9d3');R(sx+8,sy+10+n%3,4,1,'#7cc4c0');if(n%4===0)R(sx+5,sy+6,4,2,'#e8863a');fr(q=>q!==9,'#3f403b',4);fr(q=>q!==9,'#9a9b92',3);return}
  if(m>=48&&m<=50){rockTile(tx,ty,sx,sy,m,n);return}
  if(m===10){R(sx,sy,T,T,'#8d5c36');for(const ry of[2,9]){R(sx,sy+ry+3,T,2,'#6e4526');for(let k=0;k<3;k++){const x=sx+1+k*5,c=hs(tx*3+k,ty+ry)%4;R(x,sy+ry,4,3,'#4fa03e');R(x+1,sy+ry-1,2,1,'#78c257');if(c===0)R(x+1,sy+ry+3,2,1,'#e0762f')}}return}
  const rk=TLV[i]>0&&(m===5||(m>=14&&m<=18));
  if(rk)rockFloor(tx,ty,sx,sy);else{R(sx,sy,T,T,G[gi]);
  for(let k=0;k<4;k++){const r=hs(tx*3+k,ty*7)%100;if(r<55)R(sx+r%14,sy+(r*7)%14,2,1,G[(gi+1+(r&1))%3])}
  if(n<34){const bx=sx+2+n%10,by=sy+3+(n*3)%9;R(bx,by,1,3,'#4d7a33');R(bx+2,by-1,1,4,'#5c8c3a');R(bx+4,by,1,3,'#4d7a33')}
  if(n>=45&&n<52&&m===1)blob(sx+8,sy+9,5,'#5b8f3a','#78ad4e','#43702e','#2f4f22');
  if(n>88&&m===1){const c=['#f2e55c','#f4f4f0','#f0a0c0'][n%3];R(sx+3+n%8,sy+4+n%7,2,2,c);R(sx+8+n%4,sy+9+n%4,2,2,c);R(sx+6,sy+11,1,1,c)}
  }
  if(m===8){R(sx,sy+7,T,2,'#3a2713');R(sx,sy+8,T,2,'#8a6238');R(sx,sy+12,T,2,'#3a2713');R(sx,sy+13,T,1,'#8a6238');R(sx+1,sy+4,3,12,'#3a2713');R(sx+2,sy+4,1,11,'#7a5230');R(sx+12,sy+4,3,12,'#3a2713');R(sx+13,sy+4,1,11,'#7a5230')}
  if(m>=24&&m<=30){R(sx+2,sy+13,12,2,'#00000026');
    if(m===24){R(sx+3,sy+9,10,5,'#2e5a2a');R(sx+4,sy+8,8,2,'#5d9a48');R(sx+5,sy+10,2,2,'#86c06a');R(sx+9,sy+11,2,2,'#86c06a')}
    else if(m===25){R(sx+4,sy+5,8,8,'#12402a');R(sx+3,sy+7,10,4,'#2d7a46');R(sx+5,sy+6,3,3,'#3f9a5a');R(sx+6,sy+10,2,2,'#d83828');R(sx+9,sy+8,2,2,'#d83828')}
    else if(m===26){R(sx+5,sy+5,6,8,'#3f8a2c');R(sx+3,sy+7,10,5,'#6bc04d');R(sx+7,sy+3,2,4,'#8bd05a');R(sx+4,sy+8,2,2,'#9ad06a')}
    else if(m===27){R(sx+7,sy+3,1,11,'#4f7a2a');R(sx+4,sy+5,3,2,'#78b552');R(sx+9,sy+7,3,2,'#78b552');R(sx+4,sy+10,3,2,'#78b552');R(sx+9,sy+11,2,2,'#9ad06a')}
    else{const c=['#d83828','#d8d8a0','#4a7ae0'][m-28],o='#2e1f10';R(sx+7,sy+9,3,5,'#f0e8d8');R(sx+3,sy+4,11,6,o);R(sx+4,sy+5,9,4,c);R(sx+6,sy+6,1,1,'#fff');R(sx+10,sy+5,1,1,'#fff');R(sx+3,sy+11,1,1,'#f0e8d8');R(sx+2,sy+10,4,3,o);R(sx+3,sy+11,2,1,c)}}
  if(m===31){R(sx+4,sy+11,3,2,'#6e8a4a');R(sx+9,sy+12,2,1,'#6e8a4a')}
  if(m===19){R(sx+2,sy+13,12,2,'#00000026');for(let k=0;k<5;k++){const x=sx+3+k*2,h=8+((n>>k)&3);R(x,sy+14-h,1,h,'#3f7f35');R(x+((k&1)?1:-1),sy+14-h+2,1,3,'#78b552');R(x-1,sy+12-h,3,3,'#5b8fe6');R(x,sy+13-h,1,1,'#f4f8ff')}}
  if(m===20){R(sx+3,sy+11,1,3,'#8aa05a');R(sx+7,sy+10,1,4,'#8aa05a');R(sx+11,sy+11,1,3,'#8aa05a')}
  if(m===41){R(sx,sy,T,T,'#14291a');blob(sx+8,sy+9,8,'#1e3d27','#2b5736','#122a1b','#0a170f');R(sx+(n%3)*5,sy+3,4,3,'#2f6a42');R(sx+3+n%7,sy+9,3,2,'#122a1b')}
  if(m===42){R(sx,sy,T,T,'#46372a');R(sx+n%10,sy+(n*3)%12,4,2,'#3a2d22');R(sx+(n*7)%11,sy+(n*5)%13,3,1,'#5a4838')}
  if(m===45){R(sx+4,sy+16-16,8,16,'#6b4423');R(sx+3,sy,10,3,'#3d2a14');R(sx+7,sy+5,2,3,'#f2c14e');R(sx+5,sy+10,1,5,'#573a21')}
  if(m===46){R(sx+3,sy+12,10,2,'#00000030');R(sx+4,sy+6,8,7,'#2e1f10');R(sx+5,sy+7,6,5,'#a8743f');R(sx+7,sy+5,2,3,'#d8b878');R(sx+10+((t/200|0)%2),sy+3+((t/300|0)%2),1,1,'#fff6c9');R(sx+3,sy+5,1,1,'#fff6c9')}
  if(m===47){for(let k=0;k<6;k++){R(sx+1+k*2,sy+3+(n+k)%4,1,11,k%2?'#1f5a2a':'#2f7a3a');R(sx+1+k*2,sy+3+(n+k)%4,1,2,'#4fa04a')}}
  if(m===12){R(sx,sy,T,T,'#8d8f87');R(sx,sy,T,3,'#b3b4ab');R(sx,sy+7,T,1,'#6b6d66');R(sx+(n%2?4:10),sy+3,1,4,'#6b6d66');R(sx+(n%2?10:4),sy+8,1,6,'#6b6d66');R(sx,sy+T-2,T,2,'#55574f')}
  if(m===35||m===36){const bl=m===36;R(sx,sy,T,T,bl?'#55555d':'#6f7078');R(sx,sy,T,4,bl?'#6a6a72':'#8a8b94');R(sx+(n%3)*4,sy+6,5,3,'#5a5b63');R(sx+3+n%8,sy+11,6,3,'#5a5b63');
    if(!bl&&n%4===0)R(sx+4,sy,8,2,'#f0f4f8');if(bl){R(sx+2,sy+4,12,9,'#2e2e36');R(sx+3,sy+3,10,9,'#8d8f87');R(sx+4,sy+3,5,2,'#b0b2b8')}}
  if(m===14){R(sx+3,sy+12,10,2,'#00000030');R(sx+4,sy+7,8,7,'#2e1f10');R(sx+5,sy+8,6,5,'#7a5230');R(sx+5,sy+7,6,2,'#c9a06a');R(sx+7,sy+8,2,1,'#8a6238')}
  if(m>=15&&m<=17){const c=['#d9803f','#cfe3ef','#c9a227'][m-15];R(sx+2,sy+12,12,3,'#00000030');R(sx+2,sy+5,12,9,'#2e2e36');R(sx+3,sy+4,10,9,'#8d8f87');R(sx+4,sy+3,7,3,'#a9aaa3');R(sx+3,sy+10,10,3,'#6e7068');R(sx+5,sy+6,2,2,c);R(sx+9,sy+8,3,2,c);R(sx+6,sy+10,2,1,c);R(sx+10,sy+5,1,2,c)}
  if(m===18){R(sx+3,sy+9,3,2,'#8d8f87');R(sx+9,sy+6,2,2,'#a9aaa3');R(sx+7,sy+11,3,2,'#6e7068')}
  if(m===13){R(sx+3,sy+13,10,2,'#00000030');R(sx+4,sy+3,8,11,'#2f2f3a');R(sx+5,sy+4,6,9,'#9a9ba3');R(sx+6,sy+6,4,1,'#6b6c75');R(sx+7,sy+8,2,1,'#6b6c75')}
  if(m===11){R(sx+2,sy+12,12,3,'#00000030');R(sx+3,sy+2,10,13,'#2e1f10');R(sx+4,sy+3,8,11,'#8a5a2e');R(sx+4,sy+3,8,2,'#a8743f');R(sx+4,sy+7,8,1,'#4a3018');R(sx+4,sy+11,8,1,'#4a3018')}
  if(m===7){R(sx+3,sy+13,10,2,'#00000030');R(sx+5,sy+12,6,3,'#8b8d85');R(sx+6,sy+7,4,5,'#a5a69d');R(sx+4,sy+4,8,3,'#8b8d85');R(sx+5,sy+1,6,3,'#a5a69d');R(sx+7,sy+8,2,2,'#f2d27a')}
}
// the Darkwood gates: a red torii three tiles across (left post 51, middle 43/44, right post 51), mossy so it belongs to the forest
function torii(sx,sy,part,inside,exit,n,t){
  const K='#1c1414',RD='#d8341f',HI='#f0583a',SH='#8f2214',MO='#2f6a42',ML='#4f9a5a',mid=part===1;
  R(sx,sy,T,T,inside?'#14291a':'#c8934e');                                                   // ground: dark forest floor inside, dirt road outside
  if(inside){if(n%2)R(sx+2+n%9,sy+13,3,1,'#1e3d27');R(sx+9+n%5,sy+11,2,1,'#223b25')}else{R(sx+n%11,sy+(n*5)%12+2,4,3,'#b8823f');R(sx+(n*7)%11,sy+13,2,1,'#e0b378')}
  if(mid){                                                                                     // the way through: a dark gap with eyes outside, a bright glimpse of daylight from inside
    R(sx,sy+9,T,7,exit?'#9acb7a':'#050c08');if(exit){R(sx+3,sy+10,10,6,'#d6f0b0')}
    else{R(sx+5,sy+12,1,1,'#f2e55c');R(sx+10,sy+12,1,1,'#f2e55c')}
    R(sx,sy+9,T,1,SH)}
  else{const px=part===0?5:6;R(sx+px-1,sy+5,7,11,'#00000026');R(sx+px,sy+5,5,11,RD);R(sx+px,sy+5,1,11,HI);R(sx+px+4,sy+5,1,11,SH);   // post
    R(sx+px-1,sy+13,7,3,K);R(sx+px-1,sy+13,7,1,'#3a2d2d')}                                    // black foot
  const a=part===0?3:0,b=part===2?13:16;                                                        // lower crossbar (nuki), pokes out past the posts
  R(sx+a,sy+7,b-a,2,RD);R(sx+a,sy+7,b-a,1,HI);R(sx+a,sy+9,b-a,1,SH);
  R(sx,sy+3,T,2,RD);R(sx,sy+3,T,1,HI);R(sx,sy+5,T,1,SH);                                      // upper beam (kasagi): red band under a black cap
  R(sx,sy+1,T,2,K);if(part===0)R(sx,sy,3,2,K);if(part===2)R(sx+13,sy,3,2,K);                    // cap curls up at both ends
  if(mid){R(sx+5,sy+5,6,2,K);R(sx+6,sy+5,4,1,'#f2c14e')}                                        // name plaque
  if(!mid){R(sx+6,sy+13,2,2,MO);R(sx+7,sy+12,3,1,ML);R(sx+9,sy+14,2,1,ML);R(sx+(part?11:5),sy+9,1,3,MO)}   // moss at the foot and a vine on the post
  R(sx+(part===2?2:11),sy+4,2,1,MO);R(sx+(part===2?2:11),sy+5,1,3,ML);R(sx+(part===2?1:12),sy+1,2,1,ML)   // leaves draped over the beam
  if(inside)R(sx,sy+3,T,1,'#c43020')}                                                           // (slightly dimmer in the dark wood)
// mountain terraces: warm tan low down, cooler grey-blue higher up (colours follow the mountain reference picture)
const ROCKPAL=[{f:['#a08c78','#b09b82','#8c7a67'],c:['#c0a47e','#9a7f62','#6b5543','#3f3129']},{f:['#9a8c7e','#aa9c8a','#857868'],c:['#b6a58b','#8d7a66','#5e4f45','#392e2c']},{f:['#9a9aa0','#b4b6c0','#808391'],c:['#aeb0c0','#7f8398','#4f5478','#2c3158']}];
const rockPal=i=>ROCKPAL[TLV[i]<=4?0:TLV[i]<=8?1:2];
function rockFloor(tx,ty,sx,sy){const n=hs(tx*5,ty*3)%100,f=rockPal(ty*MW+tx).f;R(sx,sy,T,T,f[0]);if(at(tx,ty-1)===49)R(sx,sy,T,3,'#3b4278aa');
  R(sx+n%9,sy+(n*3)%9,6,3,f[1]);R(sx+(n*7)%10,sy+(n*5)%11+2,5,2,f[2]);if(n%3===0)R(sx+(n*11)%12,sy+(n*13)%12,4,2,f[1]);
  if(n%13===0)R(sx+n%11+1,sy+(n*3)%11+2,3,2,'#7b7d86')}
function rockTile(tx,ty,sx,sy,m,n){const i=ty*MW+tx,P=rockPal(i);
  if(m===48){rockFloor(tx,ty,sx,sy);return}
  if(m===50){rockFloor(tx,ty,sx,sy);for(let k=0;k<3;k++){R(sx+1,sy+2+k*5,14,2,P.f[1]);R(sx+1,sy+4+k*5,14,1,P.f[2])}return}
  const c=P.c;R(sx,sy,T,T,c[1]);R(sx,sy,T,3,c[0]);
  for(let k=0;k<3;k++){const y=sy+5+k*3;R(sx,y,T,1,c[2]);R(sx+((tx*5+k*7)%11),y+1,5,1,c[0])}
  R(sx+(n%4)*4,sy+3,2,5,c[0]);R(sx,sy+12,T,1,c[2]);R(sx,sy+13,T,3,c[3])}
function blob(cx,cy,r,c0,c1,c2,ol){for(let p=0;p<2;p++){const rr=p?r:r+1;for(let d=-rr;d<=rr;d++){const w=Math.round(Math.sqrt(rr*rr-d*d+.25));R(cx-w,cy+d,2*w+1,1,p?(d<-r*.35?c1:d>r*.3?c2:c0):ol)}}}
function tree(tx,ty,sx,sy){
  const n=hs(tx,ty)%100,sh=SHAKE[ty*MW+tx];if(sh&&performance.now()-sh<220)sx+=((performance.now()/40|0)%2?1:-1);R(sx-1,sy+11,18,5,'#00000026');
  if(n%7===0&&n%2){const c='#7a5230',o='#2e1f10';R(sx+6,sy+2,4,14,o);R(sx+7,sy+3,2,13,c);R(sx+7,sy-2,2,6,c);R(sx+3,sy,5,2,c);R(sx+9,sy+1,5,2,c);R(sx+2,sy-3,2,4,c);R(sx+12,sy-2,2,4,c);return}
  const pk=n%5===0,P=pk?['#e9a7bd','#f8d3de','#c97b99','#7a3b55']:{soft:['#6fae4c','#8cc766','#4f8a3a','#2f5a24'],medium:['#4f8a3a','#6aa84a','#3b6e2e','#25421c'],hard:['#2f6f4a','#3f8a5c','#1f5236','#143a25']}[wood(tx,ty)];
  R(sx+5,sy+6,6,10,'#2e1f10');R(sx+6,sy+6,4,10,'#7a5230');R(sx+6,sy+6,1,10,'#5e3d22');R(sx+4,sy+14,8,2,'#2e1f10');
  blob(sx+8,sy-3,6,...P);blob(sx+3,sy+2,5,...P);blob(sx+13,sy+2,5,...P);blob(sx+8,sy+4,5,...P);
  if(pk){[[4,-1],[11,-4],[8,3],[14,2],[2,3]].forEach(([a,b])=>R(sx+a,sy+b,1,1,'#fff'))}
  else{[[5,-4],[10,0],[3,3]].forEach(([a,b])=>R(sx+a,sy+b,2,1,P[3]))}
}
