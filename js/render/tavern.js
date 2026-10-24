// ---------- the taverns' outside (Jack's "Pixel Pub" reference): a stone ground floor with an arched door, a timber-framed upper floor, a tall red tiled roof with a chimney, a striped awning and a hanging PUB sign ----------
// It stands on the same 3 x 2 tiles as before (the door is still the middle tile of the bottom row), but rises well above them, so draw() sorts it with the people: you walk behind its roof.
// The Mountain Town's tavern has snow on its roof. Drawn once into a picture and copied; only the chimney smoke moves.
const PUB_FONT={P:[7,5,7,4,4],U:[5,5,5,5,7],B:[6,5,6,5,6]};
function tavernSprite(b){const W=b.w*T,snow=b.y<120,key='tavern'+b.x+','+b.y+W;
  return sprite(key,W+44,104,c=>{const ox=24,oy=70,O='#24170c',f=(x,y,w,h,col)=>pF(c,ox+x,oy+y,w,h,col),q=(x,y,col)=>pP(c,ox+x,oy+y,col),
    RT=['#e8907e','#d0685a','#b0473a','#8e3328','#64221a'];
    f(-2,30,W+8,4,'rgba(20,30,10,.35)');f(W+2,2,4,30,'rgba(20,30,10,.3)');
    // ground floor: rough stone blocks
    f(-1,2,W+2,30,O);for(let r=0;r<6;r++)for(let i=(r%2)*4;i<W;i+=8){const h=GH(b.x*7+i,b.y*3+r);const w=Math.min(7,W-i);f(i,3+r*5,w,4,['#9a9890','#8a887e','#a8a69c','#7e7c74'][h%4]);f(i,3+r*5,w,1,'#c4c2b8')}
    // the arched wooden door on the middle tile, with an iron hinge, a step and a lantern each side
    const dx=W/2-7|0;f(dx-1,10,16,22,O);f(dx,14,14,18,'#5a3820');f(dx+2,11,10,4,'#5a3820');f(dx+1,12,12,3,'#5a3820');
    for(let i=0;i<4;i++)f(dx+1+i*3,13,1,19,'#3e2614');f(dx+1,19,12,1,'#2a1a0c');f(dx+1,25,12,1,'#2a1a0c');q(dx+10,22,'#e8c050');q(dx+10,23,'#c89a30');
    f(dx-3,30,20,2,'#b4b2a8');f(dx-3,30,20,1,'#d4d2c8');
    [dx-5,dx+17].forEach(lx=>{f(lx,12,3,1,'#2a1a0c');f(lx,13,3,5,O);f(lx+1,14,1,3,'#ffd96a');f(lx-2,11,7,8,'rgba(255,200,90,.18)')});
    // a small window on the left with a flower box, and one on the right under a red and white striped awning
    f(3,12,9,8,O);f(4,13,7,6,'#ffe9a8');f(4,16,7,3,'#ffd070');f(7,13,1,6,'#6e4b2c');f(4,15,7,1,'#6e4b2c');f(2,20,11,2,'#6b4423');q(4,19,'#e85a5a');q(7,19,'#f8d050');q(10,19,'#e85a5a');
    f(W-12,14,9,8,O);f(W-11,15,7,6,'#ffe9a8');f(W-11,18,7,3,'#ffd070');f(W-8,15,1,6,'#6e4b2c');
    f(W-14,9,13,5,O);for(let i=0;i<11;i++)f(W-13+i,10,1,4,i%2?'#f4ece0':'#c8402a');for(let i=0;i<11;i+=2)q(W-13+i,14,'#c8402a');
    // upper floor: cream plaster in a dark timber frame, two windows with shutters
    f(-2,-14,W+4,17,O);f(-1,-13,W+2,15,'#e8dcc0');f(-1,0,W+2,2,'#5a3a1e');f(-1,-13,W+2,2,'#5a3a1e');
    [0,W/2-1|0,W-3].forEach(x=>f(x,-13,3,15,'#5a3a1e'));
    for(let i=0;i<6;i++){q(3+i,-11+i*2,'#5a3a1e');q(4+i,-11+i*2,'#5a3a1e');q(W-4-i,-11+i*2,'#5a3a1e');q(W-5-i,-11+i*2,'#5a3a1e')}
    [[9,-10],[W-17,-10]].forEach(([wx,wy])=>{f(wx-3,wy,3,7,'#7a3a24');f(wx+8,wy,3,7,'#7a3a24');f(wx-1,wy-1,10,8,O);f(wx,wy,8,6,'#9ccbe8');f(wx,wy,8,2,'#bfe0f4');f(wx+3,wy,1,6,'#5a3a1e');f(wx,wy+3,8,1,'#5a3a1e')});
    // the tall red tiled roof, wider than the walls, with a chimney on the right
    f(W-15,-40,9,18,O);f(W-14,-39,7,17,'#8a887e');for(let r=0;r<3;r++)f(W-14,-38+r*5,7,1,'#6a685e');f(W-15,-41,9,3,'#5a5850');
    for(let r=0;r<7;r++){const y=-33+r*3,inset=Math.max(0,6-r),x0=-7+inset,w=W+14-inset*2;f(x0-1,y-1,w+2,4,O);f(x0,y,w,3,RT[r<1?0:r<3?1:r<6?2:3]);
      for(let i=(r%2)*3;i<w;i+=6)f(x0+i,y+2,1,1,RT[4]);f(x0,y+2,w,1,'rgba(0,0,0,.18)')}
    f(-8,-12,W+16,3,O);f(-7,-12,W+14,2,RT[3]);f(-1,-35,W+2,2,RT[0]);
    if(snow){for(let i=-1;i<W+1;i++){const h=GH(b.x*13+i,b.y);f(i,-34,1,2+h%3,'#f4f8fc');if(h%4===0)q(i,-31+h%5,'#e4eef6')}f(W-15,-42,9,2,'#f4f8fc')}
    // the PUB sign, hanging from an iron bracket on the left of the upper floor
    f(-14,-7,14,1,'#2a2a30');f(-2,-8,2,4,'#2a2a30');f(-13,-6,1,2,'#2a2a30');f(-4,-6,1,2,'#2a2a30');
    f(-18,-4,18,10,O);f(-17,-3,16,8,'#8a5a2e');f(-17,-3,16,1,'#a8743f');
    let px=-16;['P','U','B'].forEach(ch=>{PUB_FONT[ch].forEach((row,j)=>{for(let k=0;k<3;k++)if(row&(4>>k))q(px+k,-2+j,'#f4e8c4')});px+=5})})}
// while you walk behind it (on the street above it) the whole building fades, so you never lose sight of yourself
function tavernArt(b,x,y,t){const W=b.w*T,behind=!sail&&P.ry<b.y+1&&P.ry>b.y-3&&P.rx>b.x-2&&P.rx<b.x+b.w+1;g.globalAlpha=behind?.45:1;g.drawImage(tavernSprite(b),(x|0)-24,(y|0)-70);g.globalAlpha=1;
  for(let p=0;p<4;p++){const a=.55-p*.12,yy=y-42-p*5-((t/120|0)%5),xx=x+W-12+Math.round(Math.sin(t/500+p)*2)+p;g.fillStyle='rgba(235,235,235,'+a+')';g.beginPath();g.arc(xx+2,yy,2+p*.6,0,7);g.fill()}}
