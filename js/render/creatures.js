// ---------- the new wild creatures' pictures (playtest #4): the shark and the ancient squid of the open sea, and the rock dragon of the mountains ----------
// Same job as ghostArt and centipedeArt in js/render/people.js: each is drawn at the tile (e.x, e.y) with `e.hitAt` (a white flash after a hit) and used both on the map and, scaled up, on the battle screen
// (ENEMY_ART in js/render/entities.js; ART_SHOT in js/systems/battle.js says how big the picture is on the battle screen). The shark and the squid only ever appear in battle.
// The shark faces left: a long grey-blue body, white belly, a tall fin, a forked tail that sweeps, teeth.
function sharkArt(e,cx,cy,t){const x=e.x*T-cx,y=e.y*T-cy,sw=Math.round(Math.sin(t/240)*2),w=t-e.hitAt<250&&((t/60|0)%2),O='#16222e',B=w?'#fff':'#5f7f9c',L=w?'#fff':'#a9bfd0',W=w?'#fff':'#eef4f7',D=w?'#fff':'#47657f';
  R(x-2,y+19,50,3,'rgba(10,30,60,.25)');
  R(x+22+sw,y-3,10,8,O);R(x+24+sw,y-2,7,7,D);R(x+26+sw,y-1,4,3,B);R(x+30+sw,y+3,3,3,O);          // the tall back fin
  R(x+36,y+3,6,16,O);R(x+38+sw,y-1,8,6,O);R(x+39+sw,y,6,4,D);R(x+38+sw,y+15,8,6,O);R(x+39+sw,y+16,6,4,D);R(x+37,y+4,4,14,B);   // the forked tail
  R(x+3,y+4,36,15,O);R(x+4,y+5,34,13,B);R(x+4,y+5,34,3,D);R(x+6,y+13,32,4,L);R(x+8,y+15,28,2,W);    // body, darker back, pale belly
  R(x-3,y+9,10,9,O);R(x-2,y+10,9,7,B);R(x-2,y+14,9,3,L);R(x-4,y+12,3,3,O);                           // the snout
  R(x-2,y+16,8,1,O);for(let k=0;k<4;k++)R(x-1+k*2,y+17,1,2,W);R(x+1,y+8,2,2,'#101010');R(x+1,y+8,1,1,'#fff');   // mouth, teeth, eye
  for(let k=0;k<3;k++)R(x+13+k*3,y+9,1,5,O);                                                          // gills
  R(x+18,y+17,8,5,O);R(x+19+((sw>0)?1:0),y+18,6,3,D)}                                                 // a side fin
// the ancient squid: a huge purple mantle with two big eyes, eight waving arms and two long feelers
function squidArt(e,cx,cy,t){const x=e.x*T-cx,y=e.y*T-cy,w=t-e.hitAt<250&&((t/60|0)%2),O='#2a1236',B=w?'#fff':'#8a4f9c',L=w?'#fff':'#b27ac4',D=w?'#fff':'#5f3274',S=w?'#fff':'#d9a8e8';
  R(x-4,y+40,56,3,'rgba(10,30,60,.25)');
  for(let r=0;r<22;r++){const hw=r<4?3+r*2:r<14?11:11-Math.round((r-14)*.8);R(x+24-hw-1,y-2+r,hw*2+2,1,O);R(x+24-hw,y-2+r,hw*2,1,r%6<2?L:B)}   // the pointed mantle
  for(let r=0;r<22;r+=3){R(x+24-8,y+2+r,3,1,D);R(x+24+5,y+3+r,3,1,D)}                                                                         // spots
  R(x+8,y+14,32,10,O);R(x+9,y+15,30,8,B);R(x+9,y+15,30,2,L);                                                                                  // the head
  for(const dx of[-9,5]){R(x+24+dx-1,y+16,8,7,O);R(x+24+dx,y+17,6,5,'#f0d040');R(x+24+dx+2,y+18,3,3,'#101010');R(x+24+dx+2,y+18,1,1,'#fff')}     // big eyes
  for(let i=0;i<8;i++){const bx=x+10+i*4,sg=Math.sin(t/230+i*.9);for(let k=0;k<7;k++){const ox=Math.round(Math.sin(t/230+i*.9+k*.5)*(1+k*.5)),oy=y+23+k*2;R(bx+ox-1,oy,3,3,O);R(bx+ox,oy,2,2,k%2?B:D)}R(bx+Math.round(sg*5),y+39,3,2,S)}   // the arms
  for(const s of[-1,1]){for(let k=0;k<8;k++){const ox=Math.round(Math.sin(t/300+k*.4)*3);R(x+24+s*(14+k*2)+ox,y+22+k*2,2,2,S)}}}          // two long feelers
// the rock dragon: a stone-grey lizard, a Komodo dragon made of rock, with a ridge of boulders along its back, orange eyes and a glow in its throat. Draws two tiles long, facing left or right.
function dragonArt(e,cx,cy,t){const fl=e.f==='r'||e.f==='d'&&(e.x+e.y)%2===0?1:0,x0=e.x*T-cx-8,y=e.y*T-cy-5,w=t-e.hitAt<250&&((t/60|0)%2),O='#26221e',B=w?'#fff':'#8d8b82',L=w?'#fff':'#b4b1a4',D=w?'#fff':'#625f58',R2=w?'#fff':'#cfc9b6';
  const q=(a,b,ww,h,c)=>R(fl?x0+32-a-ww:x0+a,y+b,ww,h,c),fr=(t/180|0)%2,hot=((t/220)|0)%2;
  q(-1,17,34,3,'rgba(0,0,0,.25)');
  q(22,15,3,5,O);q(23,15,1,4,D);q(8,15,3,5+fr,O);q(9,15,1,4+fr,D);q(12+2*fr,16,3,4,O);q(26,16,3,4,O);q(27,16,1,3,D);                 // legs
  q(24,9,8,5,O);q(26,10,6,3,B);q(28,9,4,2,D);q(30,11,2,2,O);                                                                         // the tail
  q(7,5,20,12,O);q(8,6,18,10,B);q(8,6,18,3,L);q(8,13,18,3,D);                                                                         // the body
  for(let k=0;k<5;k++){q(10+k*3,2+(k%2),3,4,O);q(11+k*3,3+(k%2),1,3,R2)}                                                              // boulders along the back
  q(-1,6,11,9,O);q(0,7,9,7,B);q(0,7,9,2,L);q(-3,10,4,4,O);q(-2,11,3,2,B);                                                              // the head and snout
  q(1,8,2,2,'#f08a20');q(1,8,1,1,'#fff0a0');q(-2,13,6,1,O);                                                                            // an orange eye, the mouth
  if(hot){q(-4,12,3,2,'#f2a22e');q(-6,12,2,1,'#e8632e')}                                                                              // a glow, a lick of flame
  q(5,9,2,5,O);q(4,10,1,3,D)}
