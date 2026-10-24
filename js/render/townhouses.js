// ---------- new house shapes for the towns (b.shape on a house in BL; js/world/settlement.js) ----------
// 'wing': the house with a lean-to shed on its right (one more tile, x+3, y+1, which stands in the way). 'porch': a covered porch over the door on two posts. 'tall': a second storey
// (a jettied timber upper floor with two windows) between the walls and the roof; it rises above its tiles, so draw() sorts it with the people and it fades while you walk behind it.
// All three are drawn on top of the usual house picture (houseSprite in js/render/houses.js), so roofs, signs and colours stay the same family.
function shapeExtras(b,x,y,t){const W=b.w*T,RP=HROOF[HROOF[b.roof]?b.roof:'thatch'],O='#24170c',f=(a,c,w,h,col)=>{g.fillStyle=col;g.fillRect((x|0)+a,(y|0)+c,w,h)};
  if(b.shape==='wing'){const ax=W;f(ax-1,14,18,18,O);f(ax,15,16,17,'#82593a');for(let i=0;i<16;i+=3)f(ax+i,15,1,17,'#5a3a1e');f(ax-1,28,18,4,O);f(ax,29,16,2,'#9a9890');
    f(ax+4,20,8,12,O);f(ax+5,21,6,11,'#4a2e16');f(ax+8,25,1,2,'#e8c050');
    f(ax-2,8,20,8,O);for(let j=0;j<6;j++)f(ax-1,9+j,18,1,RP[j<2?3:j<4?0:1]);f(ax-1,14,18,1,RP[2]);
    f(ax+16,22,6,9,O);for(let k=0;k<3;k++){f(ax+17,23+k*3,4,2,'#a8743f');f(ax+17,23+k*3,1,2,'#d8b878')}}
  if(b.shape==='porch'){const dx=(W/2-5)|0;f(dx-5,9,21,6,O);for(let j=0;j<4;j++)f(dx-4,10+j,19,1,RP[j<1?3:j<3?0:1]);f(dx-4,14,19,1,RP[2]);
    [dx-5,dx+13].forEach(px=>{f(px,15,3,15,O);f(px+1,15,1,14,'#a8743f')});f(dx-7,30,24,2,'#a8743f');f(dx-7,30,24,1,'#c9965a')}}
// the two-storey house, built from the usual picture: its walls, then an upper floor, then its roof lifted 16 pixels
function tallSprite(b){const W=b.w*T,key='tall'+b.x+','+b.y;return sprite(key,W+28,70,c=>{const src=houseSprite(b),O='#24170c',f=(a,y,w,h,col)=>pF(c,14+a,30+y,w,h,col);
  c.drawImage(src,0,26,src.width,28,0,42,src.width,28);
  f(-2,-6,W+4,20,O);f(-1,-5,W+2,18,'#e8dcc0');f(-1,11,W+2,3,'#5a3a1e');[0,(W/2|0)-1,W-3].forEach(a=>f(a,-5,3,16,'#5a3a1e'));
  [[7,-2],[W-15,-2]].forEach(([wx,wy])=>{f(wx-1,wy-1,10,9,O);f(wx,wy,8,7,'#9ccbe8');f(wx,wy,8,2,'#bfe0f4');f(wx+3,wy,1,7,'#5a3a1e');f(wx,wy+3,8,1,'#5a3a1e');f(wx-1,wy+8,10,1,'#5a3a1e');pF(c,14+wx+1,30+wy+7,1,1,'#e85a5a');pF(c,14+wx+5,30+wy+7,1,1,'#f8d050')});
  f(-2,13,W+4,2,'rgba(0,0,0,.35)');
  c.drawImage(src,0,0,src.width,29,0,0,src.width,29)})}
function tallHouseArt(b,x,y,t){const behind=!sail&&P.ry<b.y+1&&P.ry>b.y-3&&P.rx>b.x-2&&P.rx<b.x+b.w+1;g.globalAlpha=behind?.45:1;g.drawImage(tallSprite(b),(x|0)-14,(y|0)-30);g.globalAlpha=1;
  if((HROOF[b.roof]?b.roof:'thatch')==='slate'){const W=b.w*T;for(let p=0;p<4;p++){const a=.55-p*.12,yy=y-26-p*5-((t/120|0)%5),xx=x+W-11+Math.round(Math.sin(t/500+p)*2)+p;g.fillStyle='rgba(235,235,235,'+a+')';g.beginPath();g.arc(xx+2,yy,2+p*.6,0,7);g.fill()}}}
