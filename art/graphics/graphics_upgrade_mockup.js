// Mockup only: richer art drawn on top of the same game rules. Swaps the look of
// water, sand, grass, path, pier, trees and houses; everything else falls back.
(function(){
const oTile=tile,oTree=tree,oBld=bld,oDraw=draw;
const H=(a,b)=>{let h=(a*374761393+b*668265263)^0x5bf03635;h=(h^(h>>>13))*1274126177;return (h^(h>>>16))>>>0};
const px=(x,y,c)=>{g.fillStyle=c;g.fillRect(x|0,y|0,1,1)};
const isW=v=>v===0||v===32, isLand=v=>!isW(v);
const GR=['#689f42','#71a948','#7ab24e','#84bb55','#5f9640'];
const SA=['#e8d39a','#efdcaa','#dcc386','#cfb478','#f5e6be'];
const DI=['#c8925a','#ce9a60','#c08a52','#b8824c','#d6a46c'];
const WA=['#2c6cbf','#3478c8','#2862b0','#4a8ad6','#235aa4'];
function noise(sx,sy,tx,ty,pal,dens,seed){
  for(let k=0;k<dens;k++){const h=H(tx*31+k+seed,ty*17+k*7);const x=h%16,y=(h>>>4)%16,c=pal[(h>>>8)%pal.length];
    px(sx+x,sy+y,c);if((h>>>12)&1)px(sx+x+1,sy+y,c)}
}
function cluster(sx,sy,tx,ty,base,pal){ // soft 4x4 cluster shading that continues across tiles
  for(let by=0;by<16;by+=2)for(let bx=0;bx<16;bx+=2){const gx=tx*8+bx/2,gy=ty*8+by/2;
    const v=Math.sin(gx*.21)+Math.sin(gy*.24)+Math.sin((gx+gy)*.13)+((H(gx,gy)%100)/100-.5)*.9;
    g.fillStyle=pal[v>1.5?3:v>.5?2:v>-.6?1:v>-1.6?0:4];g.fillRect(sx+bx,sy+by,2,2)}
}
function grass(tx,ty,sx,sy,t){
  cluster(sx,sy,tx,ty,0,GR);noise(sx,sy,tx,ty,['#9ad06a','#4a8232','#7cb54f'],10,3);
  const n=H(tx,ty)%100;
  if(n<40){const bx=sx+2+n%11,by=sy+4+(n*3)%9,sw=((t/700+tx)|0)%2;
    px(bx,by+2,'#3f7a2a');px(bx,by+1,'#4f8a36');px(bx+sw,by,'#7cb54f');px(bx+2,by+1,'#3f7a2a');px(bx+2+sw,by,'#9ad06a');px(bx-1,by+3,'#2f5f22')}
  if(n>90){const c=['#f8f0a0','#ffffff','#f4a8c8','#a8c8f8'][n%4];px(sx+4+n%7,sy+5+n%6,c);px(sx+5+n%7,sy+6+n%6,'#e0a030');px(sx+3+n%7,sy+6+n%6,c)}
}
function edgeBlend(tx,ty,sx,sy,pred,cols,depth){ // ragged overlap from neighbour type
  [[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b],k)=>{if(!pred(at(tx+a,ty+b)))return;
    for(let j=0;j<16;j++){const r=H(tx*13+j+k*5,ty*11+k)%3,e=depth+r-(j%5===0?1:0);
      for(let d=0;d<e;d++){const c=d===e-1?cols[1]:cols[0];
        if(k===0)px(sx+j,sy+d,c);if(k===1)px(sx+j,sy+15-d,c);if(k===2)px(sx+d,sy+j,c);if(k===3)px(sx+15-d,sy+j,c)}}})
}
function water(tx,ty,sx,sy,t){
  // depth: shallow water fades smoothly to deep water, worked out per 2x2 block
  const land=[];for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)if(isLand(at(tx+a,ty+b)))land.push([a,b]);
  const RAMP=['#56a6dc','#4898d6','#3d8ace','#347dc4','#2e70b8','#2a66ae','#275ea6'];
  let near=0;
  for(let by=0;by<16;by+=2)for(let bx=0;bx<16;bx+=2){const cx=(bx+1)/16,cy=(by+1)/16;let d=9;
    for(const[a,b]of land){const dx=Math.max(a-cx,0,cx-(a+1)),dy=Math.max(b-cy,0,cy-(b+1));d=Math.min(d,Math.hypot(dx,dy))}
    const w=Math.sin((tx*8+bx/2)*.3+t/2200)*.18+Math.sin((ty*8+by/2)*.27-t/2900)*.18+((H(tx*8+bx,ty*8+by)%7)-3)*.03;
    const k=Math.max(0,Math.min(6,Math.floor((d+w)*2.3)));if(d<1)near=1;g.fillStyle=RAMP[k];g.fillRect(sx+bx,sy+by,2,2)}
  const ph=t/900;
  for(let k=0;k<3;k++){const h=H(tx*7+k,ty*3+k),y=(h>>>3)%14+1,x0=(h%10)+Math.round(Math.sin(ph+h)*2),w=3+(h>>>6)%4,on=(Math.sin(ph*2+h%7)>-.2);
    if(on){g.fillStyle=near?'#8cc6f0':'#6aa8e6';g.fillRect(sx+x0,sy+y,w,1);g.fillStyle='#bfe2fa';g.fillRect(sx+x0+1,sy+y,1,1)}}
  // shore foam that breathes
  const f=Math.sin(t/600+tx*.7+ty*.5)>0?1:0;
  [[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b],k)=>{const v=at(tx+a,ty+b);if(!isLand(v)||v===3)return;
    for(let j=0;j<16;j++){const r=(H(tx*5+j,ty*9+k)%3===0?1:0)+f;
      for(let d=0;d<=r;d++){const c=d===0?'#e8f6ff':'#a8d8f4';
        if(k===0)px(sx+j,sy+d,c);if(k===1)px(sx+j,sy+15-d,c);if(k===2)px(sx+d,sy+j,c);if(k===3)px(sx+15-d,sy+j,c)}}})
}
function sand(tx,ty,sx,sy){
  cluster(sx,sy,tx,ty,0,SA);noise(sx,sy,tx,ty,['#c8ae70','#fff2cc','#d8bf86'],14,9);
  const n=H(tx,ty)%100;if(n<12){px(sx+n%12+2,sy+(n*5)%11+2,'#f4f0e8');px(sx+n%12+3,sy+(n*5)%11+2,'#d8c8b0')}
  if(n>92){px(sx+5,sy+9,'#e88878');px(sx+6,sy+9,'#f4a898');px(sx+5,sy+10,'#c86858')}
  edgeBlend(tx,ty,sx,sy,v=>isW(v),['#c8ad74','#b89a62'],2);
  edgeBlend(tx,ty,sx,sy,v=>v===1||v===5,['#6ea845','#4f8a36'],2);
}
function path(tx,ty,sx,sy){
  cluster(sx,sy,tx,ty,0,DI);noise(sx,sy,tx,ty,['#a87440','#e0b07a'],6,5);
  const n=H(tx,ty)%100;
  if(n<30){const x=sx+2+n%11,y=sy+3+(n*7)%10;g.fillStyle='#5e5a52';g.fillRect(x,y+1,3,2);g.fillStyle='#a8a498';g.fillRect(x,y,3,2);px(x,y,'#d0ccc0')}
  if(n>80){px(sx+n%13+1,sy+(n*3)%13+1,'#7a7468');px(sx+(n*7)%13+1,sy+n%11+3,'#b8b2a4')}
  edgeBlend(tx,ty,sx,sy,v=>v===1||v===5||v===4,['#6ea845','#4f8a36'],2);
}
function pier(tx,ty,sx,sy,t){
  water(tx,ty,sx,sy,t);
  g.fillStyle='#1c3a66';g.fillRect(sx+1,sy+2,15,15);           // shadow on water
  g.fillStyle='#3d2a18';g.fillRect(sx+1,sy,14,16);
  for(let i=0;i<4;i++){const y=sy+i*4,h=H(tx,ty*4+i);
    g.fillStyle=['#a8783f','#b4844a','#9c6e3a'][h%3];g.fillRect(sx+2,y,12,3);
    g.fillStyle='#c99a5e';g.fillRect(sx+2,y,12,1);
    g.fillStyle='#7a5228';g.fillRect(sx+2+(h>>>4)%8,y+1,3,1);
    px(sx+3,y+1,'#5a3a1e');px(sx+12,y+1,'#5a3a1e')}
  g.fillStyle='#4a3018';g.fillRect(sx,sy+2,2,13);g.fillRect(sx+14,sy+2,2,13);
  g.fillStyle='#6b4423';g.fillRect(sx,sy+2,1,13);g.fillRect(sx+14,sy+2,1,13);
  if(at(tx,ty+1)!==3){g.fillStyle='#e8f6ff';g.fillRect(sx-1,sy+15,3,1);g.fillRect(sx+14,sy+15,3,1)}
}
window.tile=function(tx,ty,sx,sy,t){
  const i=ty*MW+tx,m=M[i];
  if(zoneOf(tx,ty)!==zoneOf(P.x,P.y)||inRoom(P.x,P.y))return oTile(tx,ty,sx,sy,t);
  if(m===0)return water(tx,ty,sx,sy,t);
  if(m===2)return sand(tx,ty,sx,sy);
  if(m===3)return pier(tx,ty,sx,sy,t);
  if(m===6){path(tx,ty,sx,sy);
    if((tx===32+OX&&ty%2)||(tx===31+OX&&!(ty%2))){const h=H(tx,ty),o=h%3-1;
      g.fillStyle='rgba(40,30,20,.35)';g.beginPath();g.ellipse(sx+8+o,sy+9,6.5,4.5,0,0,7);g.fill();
      g.fillStyle='#6e6a60';g.beginPath();g.ellipse(sx+8+o,sy+8,6.5,4.6,(h%5-2)*.08,0,7);g.fill();
      g.fillStyle='#a6a296';g.beginPath();g.ellipse(sx+8+o,sy+7.4,5.8,3.8,(h%5-2)*.08,0,7);g.fill();
      g.fillStyle='#c4c0b2';g.beginPath();g.ellipse(sx+6.5+o,sy+6.2,3.2,1.8,0,0,7);g.fill();
      g.fillStyle='#8e8a7e';g.fillRect(sx+9+o,sy+8,3,1);g.fillRect(sx+5+o,sy+9,2,1);
      if(h%4===0){g.fillStyle='#6a9a42';g.fillRect(sx+3+o,sy+9,3,1);g.fillRect(sx+12+o,sy+6,2,1)}}
    return}
  if(m===1||m===5||m===4||m===31||m===20||(m>=24&&m<=30)||m===19||m===7||m===8||(m>=11&&m<=18)){
    grass(tx,ty,sx,sy,t);
    if(m===1||m===4)return;
    // let the original draw the object on top of our grass, but skip its own flat grass
    const save=g.fillRect;let first=true;
    g.fillRect=function(x,y,w,h){if(first&&w===T&&h===T){first=false;return}first=false;return save.call(g,x,y,w,h)};
    try{oTile(tx,ty,sx,sy,t)}finally{g.fillRect=save}
    return}
  return oTile(tx,ty,sx,sy,t);
};
function canopy(cx,cy,r,P){ // layered round canopy lit from the top-left
  const [mid,hi,lo,ol,hi2]=P;
  for(let y=-r-1;y<=r+1;y++)for(let x=-r-1;x<=r+1;x++){const d=Math.hypot(x,y*1.05);
    if(d>r+.6)continue;if(d>r-.4){px(cx+x,cy+y,ol);continue}
    const l=(-x-y)/(r*1.6)+((H(cx+x,cy+y)%100)/100-.5)*.5;
    px(cx+x,cy+y,l>.55?hi2:l>.15?hi:l<-.45?lo:mid)}
}
window.tree=function(tx,ty,sx,sy){
  const n=hs(tx,ty)%100;
  if(n%7===0&&n%2)return oTree(tx,ty,sx,sy);
  const sh=SHAKE[ty*MW+tx];if(sh&&performance.now()-sh<220)sx+=((performance.now()/40|0)%2?1:-1);
  g.fillStyle='rgba(20,40,10,.32)';g.beginPath();g.ellipse(sx+8,sy+14,11,4,0,0,7);g.fill();
  const pk=n%5===0,w=pk?'pink':wood(tx,ty);
  const PAL={pink:['#e9a7bd','#f8c8d8','#c27896','#6a2f48','#fff0f4'],soft:['#5e9e3e','#7cbc52','#3f7a2c','#1f3f16','#a8dc78'],medium:['#4a8638','#68a44a','#2f6626','#173414','#8ec668'],hard:['#2f6f4a','#468a5e','#1d4f34','#0f2a1c','#6cae80']}[w];
  // trunk with roots and bark
  g.fillStyle='#2a1a0c';g.fillRect(sx+5,sy+5,6,11);g.fillStyle='#6e4826';g.fillRect(sx+6,sy+5,4,10);
  g.fillStyle='#8e6236';g.fillRect(sx+6,sy+5,1,10);g.fillStyle='#4e3018';g.fillRect(sx+9,sy+5,1,10);
  px(sx+7,sy+9,'#4e3018');px(sx+8,sy+12,'#4e3018');g.fillStyle='#2a1a0c';g.fillRect(sx+3,sy+14,10,2);g.fillStyle='#6e4826';g.fillRect(sx+4,sy+14,2,1);g.fillRect(sx+10,sy+14,2,1);
  canopy(sx+2,sy+2,6,PAL);canopy(sx+14,sy+2,6,PAL);canopy(sx+8,sy+4,6,PAL);canopy(sx+8,sy-4,7,PAL);
  if(pk)[[4,-1],[11,-4],[8,3],[13,1],[3,3],[7,-6]].forEach(([a,b])=>px(sx+a,sy+b,'#ffffff'));
  else if(n%3===0)[[5,-2],[11,1],[8,5]].forEach(([a,b])=>{px(sx+a,sy+b,'#d84a3a');px(sx+a,sy+b-1,'#f08070')});
};
window.bld=function(b,x,y,t){
  const W=b.w*T,k=b.roof,O='#24170c',dc=hs(b.x,b.y)%4;
  const RP={thatch:['#c9a35c','#b08c48','#8a6a32','#e0c07c','#f0d898'],slate:['#5a6c80','#485a6e','#334356','#7c90a6','#a8bccf'],red:['#b0473a','#8e3328','#64221a','#d0685a','#e8907e']}[k];
  // ground shadow
  g.fillStyle='rgba(20,30,10,.35)';g.fillRect(x-1,y+30,W+6,4);g.fillRect(x+W,y+14,4,18);
  // stone foundation
  g.fillStyle=O;g.fillRect(x,y+27,W,5);
  for(let i=0;i<W;i+=5){const h=H(b.x*9+i,b.y);g.fillStyle=['#9a9890','#a8a69c','#8a887e'][h%3];g.fillRect(x+i+1,y+28,4,3);px(x+i+1,y+28,'#c4c2b8')}
  // timber walls with plank grain and posts
  g.fillStyle=O;g.fillRect(x,y+12,W,16);
  for(let i=1;i<W-1;i+=3){const h=H(b.x*5+i,b.y*3);g.fillStyle=['#7a5230','#704a2a','#82593a'][h%3];g.fillRect(x+i,y+13,3,14);g.fillStyle='#5a3a1e';g.fillRect(x+i+2,y+13,1,14);if(h%5===0)px(x+i+1,y+15+h%9,'#5a3a1e')}
  g.fillStyle='#e8dcc0';g.fillRect(x+1,y+13,W-2,3);g.fillStyle='#c8b898';g.fillRect(x+1,y+15,W-2,1); // plaster band
  [x+1,x+W-3,x+(W/2|0)-1].forEach(px0=>{g.fillStyle='#3a2410';g.fillRect(px0,y+13,2,15);g.fillStyle='#5e3c1e';g.fillRect(px0,y+13,1,15)});
  // door with frame, step and warm glow inside
  const dx=x+((W/2-5)|0);
  g.fillStyle=O;g.fillRect(dx-1,y+16,12,12);g.fillStyle='#4a2e16';g.fillRect(dx,y+17,10,11);
  g.fillStyle='#f0e4c4';g.fillRect(dx+1,y+18,8,9);
  for(let yy=y+18;yy<y+27;yy+=3){g.fillStyle='#8a6a48';g.fillRect(dx+1,yy,8,1)}g.fillStyle='#8a6a48';g.fillRect(dx+4,y+18,1,9);
  g.fillStyle='#b4b2a8';g.fillRect(dx-2,y+28,14,2);g.fillStyle='#d4d2c8';g.fillRect(dx-2,y+28,14,1);
  // windows: shoji with lit panes and sill
  [x+4,x+W-12].forEach(wx=>{if(Math.abs(wx-dx)<9)return;g.fillStyle=O;g.fillRect(wx,y+17,8,8);g.fillStyle='#fff2c8';g.fillRect(wx+1,y+18,6,6);
    g.fillStyle='#ffe090';g.fillRect(wx+1,y+21,6,3);g.fillStyle='#6e4b2c';g.fillRect(wx+3,y+18,1,6);g.fillRect(wx+1,y+20,6,1);g.fillRect(wx+1,y+22,6,1);
    g.fillStyle='#5a3a1e';g.fillRect(wx-1,y+25,10,1);if(dc!==2){g.fillStyle='#4f8a36';g.fillRect(wx,y+26,8,1);px(wx+2,y+25,'#e85a5a');px(wx+5,y+25,'#f8d050')}});
  if(b.sign){const nc={fish:'#2f5f9e',rod:'#6a3f90',boat:'#257a68'}[b.sign];g.fillStyle=nc;g.fillRect(dx+1,y+17,8,5);for(let i=0;i<3;i++){g.fillStyle=i%2?'#ffffff':nc;g.fillRect(dx+1+i*3,y+17,2,6)}}
  // eave shadow on the wall
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x,y+13,W,3);
  // roof
  g.fillStyle=O;g.fillRect(x-4,y+1,W+8,14);g.fillRect(x+2,y-2,W-4,4);
  for(let j=0;j<13;j++){const yy=y+2+j,lit=j<4?3:j<8?0:j<11?1:2;g.fillStyle=RP[lit];g.fillRect(x-3,yy,W+6,1)}
  g.fillStyle=RP[4];g.fillRect(x+3,y-1,W-6,2);g.fillStyle=RP[3];g.fillRect(x+3,y+1,W-6,1);
  if(k==='thatch'){
    for(let i=0;i<W+6;i++){const h=H(b.x*3+i,b.y);for(let j=0;j<4;j++){const yy=y+2+j*3+(h>>>(j*2))%3;px(x-3+i,yy,(h>>>(j+4))&1?RP[2]:RP[4])}}
    for(let i=0;i<W+6;i+=2){const h=H(b.x+i,b.y*7);g.fillStyle=RP[2];g.fillRect(x-3+i,y+13,1,1+h%3)}
    g.fillStyle='#5a3f1e';g.fillRect(x+4,y-3,W-8,2);for(let i=0;i<W-8;i+=5){g.fillStyle='#7a5a2e';g.fillRect(x+4+i,y-5,2,4)}
  } else {
    for(let j=0;j<4;j++){const yy=y+3+j*3;g.fillStyle=RP[2];g.fillRect(x-3,yy+2,W+6,1);
      for(let i=(j%2)*3;i<W+6;i+=6){g.fillStyle=RP[1];g.fillRect(x-3+i,yy,1,3);px(x-2+i,yy,RP[4])}}
    g.fillStyle=RP[2];g.fillRect(x-4,y+12,W+8,2);
    for(let i=0;i<W+8;i+=4)px(x-4+i,y+12,RP[3]);
    g.fillStyle=RP[1];g.fillRect(x-5,y+10,2,3);g.fillRect(x+W+3,y+10,2,3);  // upturned corners
    if(k==='slate'){g.fillStyle=O;g.fillRect(x+W-12,y-6,6,10);g.fillStyle='#7a7672';g.fillRect(x+W-11,y-5,4,9);g.fillStyle='#9a968e';g.fillRect(x+W-11,y-5,4,1);
      for(let p=0;p<4;p++){const a=.55-p*.12,yy=y-10-p*5-((t/120|0)%5),xx=x+W-11+Math.round(Math.sin(t/500+p)*2)+p;g.fillStyle='rgba(235,235,235,'+a+')';g.beginPath();g.arc(xx+2,yy,2+p*.6,0,7);g.fill()}}
  }
  g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x-3,y+2,W+6,1);
  if(b.sign){const sx=x+((W-20)/2|0);g.fillStyle=O;g.fillRect(sx,y+14,20,6);g.fillStyle='#f4e8c4';g.fillRect(sx+1,y+15,18,4);g.fillStyle='#d8c898';g.fillRect(sx+1,y+18,18,1);
    if(b.sign==='fish'){g.fillStyle='#3b82c4';g.fillRect(sx+5,y+16,6,2);g.fillRect(sx+11,y+15,2,4);px(sx+6,y+16,'#fff')}
    else if(b.sign==='rod'){g.fillStyle='#6b4423';g.fillRect(sx+3,y+17,13,1);g.fillRect(sx+15,y+15,1,3);px(sx+16,y+18,'#d94b3a')}
    else{g.fillStyle='#7a4a26';g.fillRect(sx+4,y+17,12,2);g.fillStyle='#f0e8d8';g.fillRect(sx+9,y+15,4,2)}}
  else if(dc===0){g.fillStyle=O;g.fillRect(x+W+2,y+21,7,10);g.fillStyle='#8a5a2e';g.fillRect(x+W+3,y+22,5,8);g.fillStyle='#a8743f';g.fillRect(x+W+3,y+22,5,1);g.fillStyle='#4a3018';g.fillRect(x+W+3,y+25,5,1);g.fillRect(x+W+3,y+28,5,1)}
  else if(dc===1){g.fillStyle='#4a3018';g.fillRect(x-8,y+15,8,1);for(let q=0;q<3;q++){g.fillStyle='#e0762f';g.fillRect(x-8+q*3,y+16,2,4);px(x-8+q*3,y+16,'#f8a050')}}
  else if(dc===3){g.fillStyle=O;g.fillRect(x+W+2,y+23,8,8);g.fillStyle='#a8743f';g.fillRect(x+W+3,y+24,6,6);g.fillStyle='#c9965a';g.fillRect(x+W+3,y+24,6,1);g.fillStyle=O;g.fillRect(x+W+3,y+27,6,1)}
};
window.draw=function(){
  oDraw();
  // soft warm light from the top-left and a gentle vignette
  const gr=g.createLinearGradient(0,0,VW,VH);gr.addColorStop(0,'rgba(255,236,190,.10)');gr.addColorStop(1,'rgba(40,30,80,.08)');g.fillStyle=gr;g.fillRect(0,0,VW,VH);
  const v=g.createRadialGradient(VW/2,VH/2,VH*.35,VW/2,VH/2,VH*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(10,10,30,.22)');g.fillStyle=v;g.fillRect(0,0,VW,VH);
};
})();
