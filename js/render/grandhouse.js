// ---------- the grand house on Haven Isle (Quest 10): a big Japanese-style manor after Jack's reference picture ----------
// S.home.grand marks it. Its footprint is 9 x 4 tiles (x from home.x-3 to home.x+5, y from home.y-2 to home.y+1, all tile 5); the door is still the home system's (home.x+1, home.y+1). The picture is 9 tiles wide and 128 tall:
// the ground floor and its deep tiled roof, an upper floor with a gabled tower on the left and a flat-roofed block on the right, a gabled porch with steps over the door, lattice windows, a fence and stones. It is drawn once into a
// cached picture and sorted with the people by its front edge (draw.js), so you can walk behind the upper floors.
function grandHouse(x,y,t){g.drawImage(sprite('grandhouse',144,128,c=>{
  const O='#1a1220',rD='#1f3552',rM='#2c4c72',rL='#41688f',W1='#8a5e42',W2='#6b4430',W3='#a87a58',TR='#eadfc6',RD='#7a3a38',GL='#f4e8c0',GD='#c9b68a',ST='#8d8f87';
  pShadow(c,72,124,70,4,.3);
  const tiles=(x0,y0,x1,y1)=>{pF(c,x0,y0,x1-x0,y1-y0,rM);for(let yy=y0+2;yy<y1;yy+=3){pF(c,x0,yy,x1-x0,1,rD);for(let xx=x0+(((yy-y0)/3|0)%2)*3;xx<x1;xx+=6)pF(c,xx,yy-2,1,2,rD)}pF(c,x0,y0,x1-x0,1,rL)};
  const band=(x0,y0,x1,y1)=>{pF(c,x0-1,y0,x1-x0+2,y1-y0+1,O);tiles(x0,y0+1,x1,y1);pF(c,x0,y1-1,x1-x0,1,RD)};          // a flat tiled roof band with a dark outline and a red eave
  const gable=(cx,top,w,h)=>{for(let r=0;r<h;r++){const hw=Math.round(w/2*(r+1)/h);pF(c,cx-hw-1,top+r,hw*2+2,1,O);}for(let r=0;r<h;r++){const hw=Math.round(w/2*(r+1)/h);tiles(cx-hw,top+r,cx+hw,top+r+1)}
    for(let r=0;r<h;r++){const hw=Math.round(w/2*(r+1)/h);pP(c,cx-hw,top+r,rL);pP(c,cx+hw-1,top+r,rD)}pF(c,cx-1,top-1,2,2,O)};
  const lattice=(x0,y0,w,h)=>{pF(c,x0-1,y0-1,w+2,h+2,O);pF(c,x0,y0,w,h,GL);for(let i=3;i<w;i+=4)pF(c,x0+i,y0,1,h,W2);for(let j=3;j<h;j+=4)pF(c,x0,y0+j,w,1,W2);pF(c,x0,y0,w,1,GD)};
  const wall=(x0,y0,x1,y1)=>{pF(c,x0,y0,x1-x0,y1-y0,W1);for(let yy=y0+3;yy<y1;yy+=4)pF(c,x0,yy,x1-x0,1,W2);for(let xx=x0+5;xx<x1;xx+=9)pF(c,xx,y0,1,y1-y0,W3)};
  const post=(x0,y0,y1)=>{pF(c,x0,y0,3,y1-y0,O);pF(c,x0+1,y0,1,y1-y0,TR)};
  // the upper right block: a tall flat-roofed box with three lattice windows
  band(80,10,136,26);wall(82,26,134,66);for(const wx of[88,104,120])lattice(wx,31,10,22);post(82,26,66);post(131,26,66);
  // the upper left tower: a gabled roof over a long lattice band
  gable(42,16,64,28);pF(c,12,42,60,3,O);pF(c,13,43,58,1,RD);wall(14,45,70,66);lattice(20,49,44,8);post(14,45,66);post(67,45,66);
  lattice(37,33,10,8);pF(c,36,32,12,1,O);   // one small lattice window in the gable
  // the deep tiled roof over the ground floor, with a red eave and wooden brackets
  band(4,62,140,84);for(let xx=10;xx<138;xx+=18)pF(c,xx,84,3,4,W2);
  // the ground floor walls with posts, two lattice windows each side, and a porch in the middle
  wall(8,88,136,118);post(8,86,120);post(133,86,120);post(48,86,120);post(93,86,120);
  lattice(16,94,26,14);lattice(100,94,28,14);pF(c,16,110,26,6,W2);pF(c,100,110,28,6,W2);for(let i=0;i<26;i+=4)pF(c,17+i,111,2,4,W3);for(let i=0;i<28;i+=4)pF(c,101+i,111,2,4,W3);
  // the porch: its own small gabled roof with cream trim, a lattice side window and the open door
  gable(72,66,44,22);pF(c,51,86,42,3,O);pF(c,52,87,40,1,TR);pF(c,52,88,40,1,RD);
  pF(c,53,89,38,31,W2);pF(c,54,89,36,31,W1);post(52,88,120);post(89,88,120);
  lattice(56,96,8,14);pF(c,66,92,12,28,O);pF(c,67,93,10,27,'#20182a');pF(c,68,94,8,26,'#2c2036');pF(c,70,98,4,2,'#4a3a58');                  // the open doorway
  pF(c,64,118,16,3,O);pF(c,65,119,14,1,W3);pF(c,62,121,20,3,O);pF(c,63,122,18,1,W3);pF(c,60,124,24,3,O);pF(c,61,125,22,1,W3);                  // three wooden steps
  // fence pieces, stones and moss at the foot
  for(const[fx,fw]of[[0,14],[122,20]]){pF(c,fx,116,fw,2,O);pF(c,fx,117,fw,1,RD);for(let i=0;i<fw;i+=4){pF(c,fx+i,112,2,12,O);pF(c,fx+i,113,1,10,W3)}}
  for(const[sx,sy,sw]of[[34,122,8],[44,125,6],[88,123,7],[98,126,9],[22,125,5],[112,122,6]]){pF(c,sx,sy,sw,4,O);pF(c,sx+1,sy,sw-2,3,ST);pF(c,sx+1,sy,sw-3,1,'#b4b6ae')}
  for(let i=0;i<10;i++)pP(c,6+i*14,119+(i%3),'#4e8a3a')}),Math.round(x-48),Math.round(y-96));
  if(((t/150|0)%2)===0){g.fillStyle='rgba(210,210,210,.5)';g.fillRect(Math.round(x+107),Math.round(y-100),2,2)}   // a wisp of chimney smoke
}
