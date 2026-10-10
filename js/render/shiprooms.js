// ---------- the insides of the ships (tiles 125 to 139, see js/world/shiprooms.js) ----------
// Three looks by ship: the sloop is plain pine, the schooner stained oak with brass, the brig dark mahogany with brass, velvet and gold. Each tile is drawn once into a cached picture.
const SHIPLOOK=[{plank:'#c8a070',seam:'#9a7448',wall:'#8a6238',wall2:'#6a4824',trim:'#5a3a1e',floor:'#a8784a',floor2:'#8a5e38',cloth:'#4a6a9a',cloth2:'#6a8aba',rug:'#7a3a2a',rug2:'#c8a050',brass:'#b89850'},
 {plank:'#b98a56',seam:'#8a6238',wall:'#6e4a2a',wall2:'#523420',trim:'#3a2414',floor:'#8a5e38',floor2:'#6a4628',cloth:'#2f6a58',cloth2:'#58a088',rug:'#2a4a7a',rug2:'#d8c070',brass:'#d8b050'},
 {plank:'#8a5a34',seam:'#5a3820',wall:'#4a2c1a',wall2:'#34200f',trim:'#241408',floor:'#6a4026',floor2:'#4a2a18',cloth:'#8a2a34',cloth2:'#c04a52',rug:'#5a1a2a',rug2:'#e8c860',brass:'#f0c850'}];
const shipRoomAt=(tx,ty)=>ROOMTAB.find(r=>tx>=r.x0&&tx<=r.x1&&ty>=r.y0&&ty<=r.y1);
function shipTile(m,sx,sy,tx,ty,n,t){const r=shipRoomAt(tx,ty),lv=r?r.lv:0,L=SHIPLOOK[lv],fl=((t/170)|0)%2;
  const B=(dx,dy)=>at(tx+dx,ty+dy)===m?1:0,nb=B(-1,0)+2*B(1,0)+4*B(0,-1)+8*B(0,1);
  const spr=(key,paint,ox,oy,w,h)=>g.drawImage(sprite(key,w||16,h||16,paint),(sx|0)-(ox||0),(sy|0)-(oy||0));
  const floor=(c,deck)=>{pF(c,0,0,16,16,deck?L.plank:L.floor);for(let k=0;k<4;k++){pF(c,0,k*4+3,16,1,deck?L.seam:L.floor2);pF(c,(n*3+k*5)%14+1,k*4,1,3,deck?L.seam:L.floor2)}pF(c,0,0,16,1,'rgba(255,255,255,.08)');if(deck&&lv>1&&n%3===0)pP(c,3+n%9,4+n%8,L.brass)};
  if(m===125)spr('s125'+lv+(n%3)+(ty&1),c=>floor(c,true));
  else if(m===131)spr('s131'+lv+(n%3),c=>floor(c,false));
  else if(m===136)spr('s136'+lv+nb,c=>{floor(c,false);const l=!(nb&1),rr=!(nb&2),u=!(nb&4),d=!(nb&8);pF(c,l?1:0,u?1:0,16-(l?1:0)-(rr?1:0),16-(u?1:0)-(d?1:0),L.rug);if(u)pF(c,l?2:0,2,16-(l?2:0)-(rr?2:0),1,L.rug2);if(d)pF(c,l?2:0,13,16-(l?2:0)-(rr?2:0),1,L.rug2);if(l)pF(c,2,u?2:0,1,16,L.rug2);if(rr)pF(c,13,u?2:0,1,16,L.rug2);
      if(!l&&!rr&&!u&&!d){pF(c,6,6,4,4,L.rug2);pF(c,7,7,2,2,L.rug)}});
  else if(m===126)spr('s126'+lv+(tx===r.x0?'l':tx===r.x1?'r':'b'),c=>{floor(c,true);const side=tx===r.x0?-1:tx===r.x1?1:0;
      if(side){const x=side<0?0:10;pF(c,x,0,6,16,L.trim);pF(c,x+1,0,4,16,L.wall);pF(c,x+(side<0?1:3),0,1,16,'rgba(255,255,255,.18)');for(let y=2;y<16;y+=5)pF(c,x,y,6,2,L.trim)}
      else{pF(c,0,7,16,9,L.trim);pF(c,0,8,16,7,L.wall);pF(c,0,8,16,1,'rgba(255,255,255,.2)');for(let x=1;x<16;x+=5){pF(c,x,9,2,6,L.trim);pP(c,x,9,L.brass)}pF(c,0,15,16,1,L.wall2)}});
  else if(m===127){spr('s127'+lv,c=>{floor(c,true);pF(c,2,7,12,8,L.trim);pF(c,3,8,10,6,L.wall);pF(c,3,8,10,1,'rgba(255,255,255,.2)');for(let k=0;k<3;k++)pF(c,3,9+k*2,10,1,L.trim)},0,0);   // the mast base, and the mast rising above it
    spr('s127m'+lv,c=>{pF(c,4,0,8,40,L.trim);pF(c,5,0,6,40,L.wall);pF(c,5,0,2,40,'rgba(255,255,255,.18)');pF(c,9,0,2,40,'rgba(0,0,0,.2)');for(let y=6;y<40;y+=10)pF(c,4,y,8,1,L.trim);pF(c,1,10,14,6,'#efe6cc');pF(c,1,10,14,1,'#fffdf4');pF(c,1,15,14,1,'#cbbd96');pF(c,5,2,6,3,L.brass)},0,24,16,40)}
  else if(m===128)spr('s128'+lv,c=>{floor(c,true);pF(c,5,10,6,6,L.trim);pF(c,6,10,4,6,L.wall);c.strokeStyle=L.trim;c.lineWidth=4;c.beginPath();c.arc(8,6,6,0,7);c.stroke();c.strokeStyle=L.brass;c.lineWidth=2;c.beginPath();c.arc(8,6,6,0,7);c.stroke();
      c.strokeStyle=L.trim;c.lineWidth=1.5;for(let a=0;a<4;a++){c.beginPath();c.moveTo(8+Math.cos(a*Math.PI/4)*8,6+Math.sin(a*Math.PI/4)*8);c.lineTo(8-Math.cos(a*Math.PI/4)*8,6-Math.sin(a*Math.PI/4)*8);c.stroke()}pF(c,7,5,3,3,L.brass)},0,4,16,20);
  else if(m===132){const top=ty===r.y0,side=!top&&(tx===r.x0||tx===r.x1);
    spr('s132'+lv+(top?'t':side?'s':'b')+(r.kind==='deck'?'d':'')+((tx+ty)%4===0?'p':''),c=>{pF(c,0,0,16,16,L.wall);for(let x=0;x<16;x+=4)pF(c,x,0,1,16,L.wall2);pF(c,0,0,16,2,'rgba(255,255,255,.12)');
      if(top&&r.kind!=='deck'||!top&&r.kind==='deck'&&ty===r.y0+1){pF(c,0,12,16,4,L.trim);pF(c,0,12,16,1,L.brass)}
      if(top&&(tx+ty)%4===0&&r.kind!=='deck'){c.fillStyle=L.brass;c.beginPath();c.arc(8,8,5,0,7);c.fill();c.fillStyle='#1a3a5a';c.beginPath();c.arc(8,8,3.6,0,7);c.fill();pF(c,6,6,2,2,'#8ac0e8')}
      if(r.kind==='deck'){pF(c,0,ty===r.y0?0:12,16,ty===r.y0?3:4,L.trim);if(ty===r.y0+1&&(tx+ty)%4===0){pF(c,5,2,6,6,L.trim);pF(c,6,3,4,4,'#1a3a5a');pP(c,7,4,'#8ac0e8')}}
      if(side){pF(c,tx===r.x0?12:0,0,4,16,L.trim)}})}
  else if(m===129)spr('s129'+lv+nb,c=>{floor(c,false);const u=!(nb&4),d=!(nb&8),l=!(nb&1),rr=!(nb&2);
      pF(c,l?1:0,u?1:0,16-(l?1:0)-(rr?1:0),16-(u?1:0)-(d?1:0),L.trim);pF(c,l?2:0,u?2:0,16-(l?2:0)-(rr?2:0),16-(u?2:0)-(d?2:0),lv?L.cloth:'#e8dcc0');
      if(lv===0){pF(c,2,3,12,9,'#d8cca8');pF(c,2,3,12,2,'#efe6cc');pF(c,3,7,10,1,'#b8a888')}
      else{pF(c,l?2:0,u?6:0,16-(l?2:0)-(rr?2:0),6,L.cloth2);if(lv===2)pF(c,l?2:0,u?2:0,16-(l?2:0)-(rr?2:0),1,L.brass)}
      if(u&&lv>0){pF(c,l?3:1,3,6,4,'#f4efe0');pF(c,l?3:1,3,6,1,'#ffffff');if(lv===2&&nb===0||lv===2&&!rr)pF(c,9,3,5,4,'#f4efe0')}
      if(lv===0&&u)pF(c,3,2,6,3,'#fffdf4');pF(c,0,15,16,1,'rgba(0,0,0,.25)')});
  else if(m===130)spr('s130'+lv+(n%3),c=>{floor(c,false);pShadow(c,8,14,7,2,.3);pF(c,1,3,14,12,L.trim);pF(c,2,4,12,10,lv===0?'#b8844c':lv===1?'#a8743f':'#9a6a3a');pF(c,2,4,12,2,'rgba(255,255,255,.2)');pF(c,2,8,12,1,L.trim);pF(c,2,12,12,1,L.trim);pF(c,7,3,2,12,L.trim);pF(c,1,3,14,1,L.brass);
      pF(c,3,5,1,1,L.trim);pF(c,12,5,1,1,L.trim);if(n%3===0)pF(c,5,9,3,2,'#d8b878')});
  else if(m===133)spr('s133'+lv+nb,c=>{floor(c,false);pShadow(c,8,14,7,2,.25);pF(c,1,5,14,5,L.trim);pF(c,2,6,12,3,lv===0?'#b8844c':L.wall);pF(c,2,6,12,1,'rgba(255,255,255,.22)');pF(c,2,10,2,5,L.trim);pF(c,12,10,2,5,L.trim);
      if(lv>0){pF(c,4,5,4,2,'#efe6cc');pF(c,10,4,2,3,'#1a1a2a');pP(c,10,3,L.brass)}if(lv===2){pF(c,5,5,3,1,'#c04a52');pF(c,9,6,3,1,'#fff')}});
  else if(m===134)spr('s134'+lv,c=>{floor(c,false);pShadow(c,8,14,5,1.5);pF(c,4,8,8,4,L.trim);pF(c,5,8,6,3,L.wall);pF(c,5,8,6,1,'rgba(255,255,255,.25)');pF(c,5,12,1,3,L.trim);pF(c,10,12,1,3,L.trim)});
  else if(m===135)spr('s135'+lv+(fl?1:0),c=>{pF(c,0,0,16,16,L.wall);for(let x=0;x<16;x+=4)pF(c,x,0,1,16,L.wall2);pF(c,0,12,16,4,L.trim);pF(c,0,12,16,1,L.brass);pF(c,7,1,2,4,L.trim);pF(c,5,5,6,7,L.brass);pF(c,6,6,4,5,fl?'#ffe08a':'#ffd060');pF(c,7,7,2,3,'#fff6c8');pF(c,5,12,6,1,L.trim);
      const gl=c.createRadialGradient(8,9,1,8,9,14);gl.addColorStop(0,'rgba(255,200,100,.35)');gl.addColorStop(1,'rgba(255,200,100,0)');c.fillStyle=gl;c.fillRect(0,0,16,16)});
  else if(m===137)spr('s137'+lv+nb,c=>{pF(c,0,0,16,16,L.wall);pF(c,0,0,16,16,L.wall);pF(c,1,1,14,14,L.trim);pF(c,2,2,12,12,L.wall2);for(const y of[6,11])pF(c,2,y,12,1,L.trim);
      const cols=['#a83a34','#3a6aa8','#d8b040','#3a8a5a','#7a4a9a','#c8683c'];for(let row=0;row<2;row++)for(let k=0;k<5;k++){const h=GH(tx*7+k,ty*3+row)%3;pF(c,3+k*2,(row?7:2)+h,2,4-h+(row?1:0),cols[(k+row*2+n)%6])}pF(c,0,15,16,1,L.trim)});
  else if(m===138)spr('s138'+lv,c=>{floor(c,false);pShadow(c,8,14,6,2);pF(c,3,2,10,13,'#2a1a0c');pF(c,4,3,8,11,L.lvbarrel||'#8a5a2e');pF(c,4,3,2,11,'#a8743f');pF(c,10,3,2,11,'#6b4423');for(const y of[5,11])pF(c,3,y,10,1,'#4a4a52');pF(c,4,2,8,2,'#6b4423')});
  else if(m===139)spr('s139'+lv,c=>{floor(c,false);pShadow(c,8,14,7,2,.3);pF(c,1,5,14,10,L.trim);pF(c,2,6,12,8,L.wall);pF(c,2,6,12,3,'rgba(255,255,255,.14)');pF(c,1,9,14,1,L.brass);pF(c,7,8,2,3,L.brass);pF(c,1,5,14,1,L.brass);pF(c,2,14,12,1,'rgba(0,0,0,.3)')})}
