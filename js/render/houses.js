// ---------- houses and shops, drawn in more detail (graphics step 1.3) ----------
// A building is drawn once into a small picture (stone foundation, timber walls with plank grain and posts, plaster band, door with step, shoji windows with flower boxes, a thatch, slate or
// red tiled roof with eaves, signs and one small extra such as a barrel, firewood, a lit window or a crate) and copied each frame; only the chimney smoke on slate roofs moves. Art ported from
// art/graphics/graphics_upgrade_mockup.js. Where things stand, their size, doors and signs are unchanged. The halls, temples and placeholder buildings keep their own drawing.
const HROOF={thatch:['#c9a35c','#b08c48','#8a6a32','#e0c07c','#f0d898'],slate:['#5a6c80','#485a6e','#334356','#7c90a6','#a8bccf'],red:['#b0473a','#8e3328','#64221a','#d0685a','#e8907e']};
const HSIGN={fish:'#2f5f9e',rod:'#6a3f90',boat:'#257a68',smith:'#b8481f',gold:'#c8a02a',tailor:'#a04a8a',barber:'#c8402a',apothecary:'#3a8f4a'};
function houseSprite(b){const W=b.w*T,k=HROOF[b.roof]?b.roof:'thatch',key='h'+b.x+','+b.y+k+W+(b.sign||'');
  return sprite(key,W+28,54,c=>{const ox=14,oy=14,O='#24170c',dc=hs(b.x,b.y)%4,RP=HROOF[k],f=(x,y,w,h,col)=>pF(c,ox+x,oy+y,w,h,col),q=(x,y,col)=>pP(c,ox+x,oy+y,col);
    f(-1,30,W+6,4,'rgba(20,30,10,.35)');f(W,14,4,18,'rgba(20,30,10,.35)');
    f(0,27,W,5,O);for(let i=0;i<W;i+=5){const h=GH(b.x*9+i,b.y);f(i+1,28,4,3,['#9a9890','#a8a69c','#8a887e'][h%3]);q(i+1,28,'#c4c2b8')}
    f(0,12,W,16,O);for(let i=1;i<W-1;i+=3){const h=GH(b.x*5+i,b.y*3);f(i,13,3,14,['#7a5230','#704a2a','#82593a'][h%3]);f(i+2,13,1,14,'#5a3a1e');if(h%5===0)q(i+1,15+h%9,'#5a3a1e')}
    f(1,13,W-2,3,'#e8dcc0');f(1,15,W-2,1,'#c8b898');
    [1,W-3,(W/2|0)-1].forEach(x0=>{f(x0,13,2,15,'#3a2410');f(x0,13,1,15,'#5e3c1e')});
    const dx=(W/2-5)|0;
    f(dx-1,16,12,12,O);f(dx,17,10,11,'#4a2e16');f(dx+1,18,8,9,'#f0e4c4');for(let yy=18;yy<27;yy+=3)f(dx+1,yy,8,1,'#8a6a48');f(dx+4,18,1,9,'#8a6a48');
    f(dx-2,28,14,2,'#b4b2a8');f(dx-2,28,14,1,'#d4d2c8');
    [4,W-12].forEach(wx=>{if(Math.abs(wx-dx)<9)return;f(wx,17,8,8,O);f(wx+1,18,6,6,'#fff2c8');f(wx+1,21,6,3,'#ffe090');f(wx+3,18,1,6,'#6e4b2c');f(wx+1,20,6,1,'#6e4b2c');f(wx+1,22,6,1,'#6e4b2c');
      f(wx-1,25,10,1,'#5a3a1e');if(dc!==2){f(wx,26,8,1,'#4f8a36');q(wx+2,25,'#e85a5a');q(wx+5,25,'#f8d050')}});
    if(b.sign){const nc=HSIGN[b.sign]||'#7a5230';f(dx+1,17,8,5,nc);for(let i=0;i<3;i++)f(dx+1+i*3,17,2,6,i%2?'#ffffff':nc)}
    f(0,13,W,3,'rgba(0,0,0,.35)');
    // roof
    f(-4,1,W+8,14,O);f(2,-2,W-4,4,O);
    for(let j=0;j<13;j++){const lit=j<4?3:j<8?0:j<11?1:2;f(-3,2+j,W+6,1,RP[lit])}
    f(3,-1,W-6,2,RP[4]);f(3,1,W-6,1,RP[3]);
    if(k==='thatch'){
      for(let i=0;i<W+6;i++){const h=GH(b.x*3+i,b.y);for(let j=0;j<4;j++)q(-3+i,2+j*3+(h>>>(j*2))%3,(h>>>(j+4))&1?RP[2]:RP[4])}
      for(let i=0;i<W+6;i+=2){const h=GH(b.x+i,b.y*7);f(-3+i,13,1,1+h%3,RP[2])}
      f(4,-3,W-8,2,'#5a3f1e');for(let i=0;i<W-8;i+=5)f(4+i,-5,2,4,'#7a5a2e')
    }else{
      for(let j=0;j<4;j++){const yy=3+j*3;f(-3,yy+2,W+6,1,RP[2]);for(let i=(j%2)*3;i<W+6;i+=6){f(-3+i,yy,1,3,RP[1]);q(-2+i,yy,RP[4])}}
      f(-4,12,W+8,2,RP[2]);for(let i=0;i<W+8;i+=4)q(-4+i,12,RP[3]);f(-5,10,2,3,RP[1]);f(W+3,10,2,3,RP[1]);   // upturned corners
      if(k==='slate'){f(W-12,-6,6,10,O);f(W-11,-5,4,9,'#7a7672');f(W-11,-5,4,1,'#9a968e')}}
    f(-3,2,W+6,1,'rgba(255,255,255,.18)');
    if(b.sign){const sx=((W-20)/2|0);f(sx,14,20,6,O);f(sx+1,15,18,4,'#f4e8c4');f(sx+1,18,18,1,'#d8c898');
      if(b.sign==='fish'){f(sx+5,15,6,3,'#3b82c4');f(sx+11,16,2,1,'#3b82c4');q(sx+6,15,'#fff')}
      else if(b.sign==='rod'){f(sx+3,17,14,1,'#6b4423');f(sx+16,15,1,3,'#6b4423');q(sx+17,18,'#d94b3a')}
      else if(b.sign==='tailor'){f(sx+4,16,12,1,'#b8b8c0');f(sx+6,15,2,3,'#a04a8a');f(sx+12,15,2,3,'#a04a8a');f(sx+8,17,4,1,'#f2c14e')}
      else if(b.sign==='barber'){for(let z=0;z<5;z++)f(sx+7+z*2,15,1,3,z%2?'#3b82c4':'#d83828');f(sx+5,18,10,1,'#f2f2ec')}
      else if(b.sign==='apothecary'){f(sx+8,15,4,1,'#6b4423');f(sx+9,16,2,1,'#c8d8e0');f(sx+7,17,6,1,'#7a3fa0');f(sx+6,18,8,1,'#7a3fa0')}
      else if(b.sign==='gold'){f(sx+6,16,8,2,'#d9a441');f(sx+8,18,4,1,'#d9a441');f(sx+9,15,2,2,'#d83828');f(sx+15,15,2,1,'#fff')}
      else if(b.sign==='smith'){f(sx+5,15,10,2,'#3a3a44');f(sx+8,17,4,1,'#3a3a44');f(sx+6,18,8,1,'#3a3a44');f(sx+15,15,2,1,'#e8632e')}
      else{f(sx+4,17,12,1,'#7a4a26');f(sx+9,15,1,3,'#6b4423')}}
    else if(dc===0){f(W+2,21,7,10,O);f(W+3,22,5,8,'#8a5a2e');f(W+3,22,5,1,'#a8743f');f(W+3,25,5,1,'#4a3018');f(W+3,28,5,1,'#4a3018')}
    else if(dc===1){f(-8,15,8,1,'#4a3018');for(let z=0;z<3;z++){f(-8+z*3,16,2,4,'#e0762f');q(-8+z*3,16,'#f8a050')}}
    else if(dc===3){f(W+2,23,8,8,O);f(W+3,24,6,6,'#a8743f');f(W+3,24,6,1,'#c9965a');f(W+3,27,6,1,O)}})}
function houseArt(b,x,y,t){g.drawImage(houseSprite(b),(x|0)-14,(y|0)-14);
  if((HROOF[b.roof]?b.roof:'thatch')==='slate'){const W=b.w*T;   // chimney smoke
    for(let p=0;p<4;p++){const a=.55-p*.12,yy=y-10-p*5-((t/120|0)%5),xx=x+W-11+Math.round(Math.sin(t/500+p)*2)+p;g.fillStyle='rgba(235,235,235,'+a+')';g.beginPath();g.arc(xx+2,yy,2+p*.6,0,7);g.fill()}}}
