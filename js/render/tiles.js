// ---------- drawing ----------
function tile(tx,ty,sx,sy,t){
  const n=hs(tx,ty)%100,i=ty*MW+tx,mm=M[i],here=zoneOf(P.x,P.y)>=3||zoneOf(P.x,P.y)===1,zt=zoneOf(tx,ty),zp=zoneOf(P.x,P.y);
  if(zt!==zp){if(zp)R(sx,sy,T,T,'#000');else waterTile(tx,ty,sx,sy,t,true);return}
  if(mm>=21&&mm<=23){
    if(!here){waterTile(tx,ty,sx,sy,t,true);return}
    homeArt(mm,tx,ty,sx,sy,n);
    return}
  if(mm>=56&&mm<=63){templeTile(mm,sx,sy,tx,ty,n,t);return}
  if(mm>=64&&mm<=77){seaTile(mm,sx,sy,tx,ty,n,t);return}
  if(mm>=78&&mm<=81){skyTile(mm,sx,sy,tx,ty,n,t);return}
  if(mm>=82&&mm<=101){fireTile(mm,sx,sy,tx,ty,n,t);return}
  if(mm>=117&&mm<=122){skyDamagedTile(mm,sx,sy,tx,ty,n,t);return}
  if(mm>=102&&mm<=116){towerTile(mm,sx,sy,tx,ty,n,t);return}
  if(mm===54||mm===55){ // jagged rock: angular grey peaks with a lit left face, a dark right face and cracks; 54 stands in the sea, 55 on the shore
    if(mm===54){waterTile(tx,ty,sx,sy,t,true)}else{R(sx,sy,T,T,'#6e6a62');if(n%4===0)R(sx+n%12+2,sy+n%10+3,2,1,'#58544d')}
    const s=hs(tx*3,ty*5),p1=2+s%5,p2=9+(s>>3)%5,a=14+(s>>6)%6,b=10+(s>>9)%5,sl=2+s%2,O='#26272b';
    for(let x=0;x<T;x++){const h=Math.max(Math.round(a-Math.abs(x-p1)*sl),Math.round(b-Math.abs(x-p2)*2),3),top=sy+T-h,pk=(x===p1||x===p2),lit=x<(h===Math.round(a-Math.abs(x-p1)*sl)?p1:p2);
      R(sx+x,top-1,1,1,O);R(sx+x,top,1,h,lit?'#9a9ca0':'#686a70');if(!pk)R(sx+x,top,1,2,lit?'#bcbec2':'#82848a');else R(sx+x,top,1,3,'#d0d2d6');
      if((x+s)%5===0)R(sx+x,top+3+(s>>x)%5,1,3,O)}
    R(sx,sy+T-2,T,2,'#00000045');if(mm===54)R(sx+1,sy+T-1,T-2,1,'#d8ecff');return}
  if(mm===52){R(sx,sy,T,T,'#e3cf94');if(n%5===0)R(sx+n%11+2,sy+n%9+3,2,1,'#c9b277');if(n%7===0)R(sx+n%9+3,sy+n%11+2,1,1,'#f2e4b4');return}
  if(mm===53){R(sx,sy,T,T,'#6e7068');R(sx,sy+7,T,1,'#4a4c46');R(sx,sy+15,T,1,'#4a4c46');const C=['#d9534f','#3b82c4','#f2c14e','#4caf72','#9c5bb5'];[1,6,11].forEach((px,j)=>{const w=(((t/300)|0)+n+j)%6===0?1:0;R(sx+px,sy+1+w,4,4,'#2a1b0e');R(sx+px+1,sy+2+w,2,2,'#e8c8a0');R(sx+px,sy+5+w,4,2,C[(n+j*3)%5]);R(sx+px,sy+9+w,4,4,'#2a1b0e');R(sx+px+1,sy+10+w,2,2,'#e8c8a0');R(sx+px,sy+13+w,4,2,C[(n+j*2+1)%5])});return}
  if(mm===32){waterTile(tx,ty,sx,sy,t,true);R(sx+1,sy+11,14,3,'#d8ecff');R(sx+3,sy+4,10,9,'#2e2e36');R(sx+4,sy+3,8,9,'#8d8f87');R(sx+5,sy+3,4,2,'#b0b2b8');R(sx+6,sy+9,5,2,'#6e7068');return}
  if(M[i]===0){
    waterTile(tx,ty,sx,sy,t,false);
    if(REEF.has(i)){R(sx,sy,T,T,'rgba(70,215,200,.32)');if(n%3===0)R(sx+n%10+1,sy+(n*3)%11+2,5,3,'rgba(150,240,225,.35)')}
    return;
  }
  if(M[i]===2){sandTile(tx,ty,sx,sy);return}
  if(M[i]===3){pierTile(tx,ty,sx,sy,t);return}
  if(mm===43||mm===44||mm===51){const rt=at(tx+1,ty),lt=at(tx-1,ty);torii(sx,sy,mm===51?(rt===43||rt===44?0:2):1,zt===2,mm===43,n,t);return}
  const G=zt===2?['#2c4a2e','#27432a','#223b25']:['#7fa84f','#74a048','#678f3f'],v=Math.sin(tx*.8)+Math.sin(ty*.9)+Math.sin((tx+ty)*.45),gi=v>1.1?0:v<-1.1?2:1,m=M[i];
  const fr=(pred,col,d)=>[[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b],k)=>{if(!pred(at(tx+a,ty+b)))return;
    for(let j=0;j<4;j++){const r=hs(tx*7+j,ty*5+k)%4,e=d+(r>>1),l=4+r;
      if(k<2)R(sx+j*4,k?sy+T-e:sy,l,e,col);else R(k===2?sx:sx+T-e,sy+j*4,e,l,col)}});
  if(m===6&&tx<100&&ty<fTop(tx)-1){R(sx,sy,T,T,n%3?'#b08f6c':'#b99a78');if(n<50)R(sx+n%11,sy+(n*5)%12,4,3,'#9e7e5d');if(n>75)R(sx+n%12,sy+(n*3)%13,2,1,'#cdb08c');if(n%17===0)R(sx+n%10+2,sy+9,2,2,'#7b7d86');return}
  if(m===6){pathTile(tx,ty,sx,sy);return}
  if(m==9){objectBgArt(m,tx,ty,sx,sy,n,t);return}
  if(m>=48&&m<=50){rockTile(tx,ty,sx,sy,m,n);return}
  if(m==10){objectBgArt(m,tx,ty,sx,sy,n,t);return}
  const rk=TLV[i]>0&&(m===5||(m>=14&&m<=18));
  if(rk)rockFloor(tx,ty,sx,sy);else{if(zt===2)forestFloor(tx,ty,sx,sy);else grassTile(tx,ty,sx,sy);
  if(n>=45&&n<52&&m===1)bushArt(sx,sy);
  if(n>88&&m===1&&zt===2){const c=['#f2e55c','#f4f4f0','#f0a0c0'][n%3];R(sx+3+n%8,sy+4+n%7,2,2,c);R(sx+8+n%4,sy+9+n%4,2,2,c);R(sx+6,sy+11,1,1,c)}
  }
  if(m===8)objectArt(m,tx,ty,sx,sy,n,t);
  if(m>=24&&m<=30)plantArt(m,n,sx,sy);
  if(m===31)plantArt(m,n,sx,sy);
  if(m===19)plantArt(m,n,sx,sy);
  if(m===20)plantArt(m,n,sx,sy);
  if(m===41)thickTree(tx,ty,sx,sy,n);
  if(m===42)forestTrail(tx,ty,sx,sy,n);
  if(m===45){R(sx+4,sy+16-16,8,16,'#6b4423');R(sx+3,sy,10,3,'#3d2a14');R(sx+7,sy+5,2,3,'#f2c14e');R(sx+5,sy+10,1,5,'#573a21')}
  if(m===46)objectArt(m,tx,ty,sx,sy,n,t);
  if(m===47)plantArt(m,n,sx,sy);
  if(m==12){objectBgArt(m,tx,ty,sx,sy,n,t);return}
  if(m===35||m===36){const bl=m===36;R(sx,sy,T,T,bl?'#55555d':'#6f7078');R(sx,sy,T,4,bl?'#6a6a72':'#8a8b94');R(sx+(n%3)*4,sy+6,5,3,'#5a5b63');R(sx+3+n%8,sy+11,6,3,'#5a5b63');
    if(!bl&&n%4===0)R(sx+4,sy,8,2,'#f0f4f8');if(bl){R(sx+2,sy+4,12,9,'#2e2e36');R(sx+3,sy+3,10,9,'#8d8f87');R(sx+4,sy+3,5,2,'#b0b2b8')}}
  if(m===14)objectArt(m,tx,ty,sx,sy,n,t);
  if((m>=15&&m<=17)||m===123||m===124)objectArt(m,tx,ty,sx,sy,n,t);
  if(m===18)objectArt(m,tx,ty,sx,sy,n,t);
  if(m===13)objectArt(m,tx,ty,sx,sy,n,t);
  if(m===11)objectArt(m,tx,ty,sx,sy,n,t);
  if(m===7)objectArt(m,tx,ty,sx,sy,n,t);
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
  if(m===50){rockFloor(tx,ty,sx,sy);const ud=[at(tx,ty-1),at(tx,ty+1)].some(v=>v===49||v===50),lr=[at(tx-1,ty),at(tx+1,ty)].some(v=>v===49||v===50);
    if(ud&&!lr){for(let k=0;k<3;k++){R(sx+2+k*5,sy+1,2,14,P.f[1]);R(sx+4+k*5,sy+1,1,14,P.f[2])}}   // stairs in a vertical cliff run climb sideways: vertical step lines
    else for(let k=0;k<3;k++){R(sx+1,sy+2+k*5,14,2,P.f[1]);R(sx+1,sy+4+k*5,14,1,P.f[2])}return}
  const c=P.c;R(sx,sy,T,T,c[1]);R(sx,sy,T,3,c[0]);
  for(let k=0;k<3;k++){const y=sy+5+k*3;R(sx,y,T,1,c[2]);R(sx+((tx*5+k*7)%11),y+1,5,1,c[0])}
  R(sx+(n%4)*4,sy+3,2,5,c[0]);R(sx,sy+12,T,1,c[2]);R(sx,sy+13,T,3,c[3])}
function blob(cx,cy,r,c0,c1,c2,ol){for(let p=0;p<2;p++){const rr=p?r:r+1;for(let d=-rr;d<=rr;d++){const w=Math.round(Math.sqrt(rr*rr-d*d+.25));R(cx-w,cy+d,2*w+1,1,p?(d<-r*.35?c1:d>r*.3?c2:c0):ol)}}}
function tree(tx,ty,sx,sy){treeArt(tx,ty,sx,sy)}   // the art is in js/render/plants.js
