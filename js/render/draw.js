// ---------- one frame: tiles, trees, buildings, entities sorted by y, light, fishing line ----------
function draw(){
  const t=performance.now();
  const gl=sail?GLIDE.sail:GLIDE.walk;P.rx+=(P.x-P.rx)*gl;P.ry+=(P.y-P.ry)*gl;if(Math.abs(P.x-P.rx)<.02)P.rx=P.x;if(Math.abs(P.y-P.ry)<.02)P.ry=P.y;
  let cx=Math.max(0,Math.min(MW*T-VW,P.rx*T+8-VW/2)),cy=Math.max(0,Math.min(MH*T-VH,P.ry*T+8-VH/2));
  cx|=0;cy|=0;
  for(let ty=(cy/T)|0;ty<=((cy+VH)/T|0);ty++)for(let tx=(cx/T)|0;tx<=((cx+VW)/T|0);tx++)
    if(tx<MW&&ty<MH)tile(tx,ty,tx*T-cx,ty*T-cy,t);
  for(let ty=(cy/T)|0;ty<=((cy+VH)/T|0)+1;ty++)for(let tx=(cx/T)|0;tx<=((cx+VW)/T|0);tx++)
    if(at(tx,ty)===4)tree(tx,ty,tx*T-cx,ty*T-cy);
  const cp=campOf();if(cp&&Math.hypot(P.rx-cp.x,P.ry-cp.y)<10){g.strokeStyle='rgba(255,255,255,.4)';g.setLineDash([3,3]);g.beginPath();g.arc(cp.x*T+8-cx,cp.y*T+8-cy,CAMP_R*T,0,7);g.stroke();g.setLineDash([])}
  BL.forEach(b=>{if(zoneOf(b.x,b.y)===zoneOf(P.x,P.y))(b.hall?hall:b.skysmoke?skySmoke:b.towergate?towerGate:b.pagoda?towerPagoda:b.firegate?fireGate:b.firehall?fireHall:b.tent?tent:b.decor?campDecor:b.ship?pirateShip:b.skygate?skyGate:b.knossos?seaTemple:b.mayan?mayanB:b.col||b.tower?tmp:bld)(b,b.x*T-cx,b.y*T-cy,t)});
  if(S.claim){const c0=S.claim,X=c0.x*T-cx,Y=c0.y*T-cy,W=c0.w*T,H=c0.h*T,rc='#d8b878';
    R(X,Y+2,W,1,rc);R(X,Y+H-3,W,1,rc);R(X+2,Y,1,H,rc);R(X+W-3,Y,1,H,rc);
    for(let i=0;i<=c0.w;i+=2)for(const yy of[Y,Y+H-6])R(X+Math.min(i*T,W-4),yy,3,6,'#7a5230');
    for(let j=0;j<=c0.h;j+=2)for(const xx of[X,X+W-4])R(xx,Y+Math.min(j*T,H-6),3,6,'#7a5230')}
  if(S.home)bld({x:S.home.x,y:S.home.y,w:3,roof:S.home.roof},S.home.x*T-cx,S.home.y*T-cy,t);
  if(placing&&ITEMS[placing].kind==='station'&&S.home&&!inRoom(P.x,P.y)&&Math.hypot(P.rx-S.home.x,P.ry-S.home.y)<10){g.strokeStyle='rgba(255,255,255,.4)';g.setLineDash([3,3]);g.beginPath();g.arc((S.home.x+1)*T+8-cx,(S.home.y+1)*T+8-cy,CAMP_R*T,0,7);g.stroke();g.setLineDash([])}
  // boat
  const bx=(sail?P.rx:B.x)*T-cx,by=(sail?P.ry:B.y)*T-cy,bob=Math.round(Math.sin(t/400));
  const vert=sail&&(P.f==='u'||P.f==='d');
  const h=[['#7a4a26','#a8703a','#8a5a2e'],['#1f4a73','#4a82b8','#3b6fa0'],['#4a2323','#b04a3c','#8a3730']][tier('boat')];
  if(!vert){R(bx,by+4+bob,16,9,h[0]);R(bx+1,by+5+bob,14,7,h[1]);R(bx+14,by+6+bob,2,5,h[0]);R(bx+3,by+7+bob,10,3,h[2])}
  else{R(bx+3,by+bob,9,16,h[0]);R(bx+4,by+1+bob,7,14,h[1]);R(bx+6,by+3+bob,3,10,h[2])}
  // entities by y
  S.gardens.forEach(g=>g.cells.forEach((cell,i)=>{const x=(g.x+i%3)*T-cx,y=(g.y+(i/3|0))*T-cy;
    R(x+1,y+1,T-2,T-2,'#2e1f10');R(x+2,y+2,T-4,T-4,'#8d5c36');R(x+3,y+5,T-6,1,'#6e4526');R(x+3,y+10,T-6,1,'#6e4526');
    if(cell){const c=CROPS[cell.c],age=S.day-cell.d,st=age>=c.d?3:Math.min(2,Math.floor(3*age/c.d)),col=CROPC[cell.c];
      if(st===0)R(x+7,y+8,2,2,'#c9a35c');else if(st===1){R(x+7,y+6,2,6,'#3f8f3a');R(x+5,y+7,2,2,'#78b552');R(x+9,y+7,2,2,'#78b552')}
      else if(st===2){R(x+5,y+4,6,8,'#3f8f3a');R(x+4,y+6,8,4,'#5aa83c')}
      else{R(x+4,y+3,8,9,'#2f7d32');R(x+3,y+5,10,5,'#4fa03e');R(x+5,y+4,3,3,col);R(x+9,y+7,3,3,col);R(x+6,y+9,3,2,col)}}}));
  if(placing){const k0=ITEMS[placing].kind,cell=(x,y,bad)=>R(x*T-cx+1,y*T-cy+1,T-2,T-2,bad?'rgba(220,70,60,.42)':'rgba(70,130,235,.5)');let m;
    if(k0==='claim'||k0==='prefab'||k0==='garden'){const pl=plan(placing);pl.tiles.forEach(([x,y,w])=>cell(x,y,w||pl.glob));
      g.strokeStyle='#fff';g.lineWidth=2;g.strokeRect(pl.x*T-cx+1,pl.y*T-cy+1,pl.w*T-2,pl.h*T-2);
      m=pl.glob||(pl.tiles.find(q=>q[2])||[])[2]||'It fits! Tap Use to place it.'}
    else{const[fx,fy]=front(),w=placeWhy(placing,fx,fy);
      for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const x=P.x+dx,y=P.y+dy;if(x<0||y<0||x>=MW||y>=MH)continue;cell(x,y,placeWhy(placing,x,y))}
      g.strokeStyle='#fff';g.lineWidth=2;g.strokeRect(fx*T-cx+1,fy*T-cy+1,T-2,T-2);m=w||'It fits! Tap Use to place it.'}
    if($('msg').textContent!==m)say(m)}
  const E=NPC.filter(n=>zoneOf(n.x,n.y)===zoneOf(P.x,P.y)).map(n=>({y:n.y,f:()=>{R(n.x*T-cx+2,n.y*T-cy+13,12,3,'#00000033');CharacterSprite.draw(g,n.x*T-cx,n.y*T-cy-3,{...lo({...n,...NL[n.n]}),view:vw(n.f),frame:0})}}));
  CH.forEach(c=>E.push({y:c.y,f:()=>chick(c,cx,cy,t)}));
  if(AR.on)E.push({y:AR.y,f:()=>arenaFoe(cx,cy,t)});
  AN.forEach(a=>E.push({y:a.y,f:()=>critter(a,cx,cy,t)}));
  S.placed.forEach(p=>E.push({y:p.y,f:()=>obj(p,cx,cy,t)}));
  if(G.alive)E.push({y:G.y,f:()=>ghost(cx,cy,t)});
  E.push({y:P.ry+.1,f:()=>{
    const mv=Math.abs(P.x-P.rx)+Math.abs(P.y-P.ry)>.04,fi=fs&&sail,sx=P.rx*T-cx,sy=P.ry*T-cy;
    if(!sail)R(sx+2,sy+13,12,3,'#00000033');
    CharacterSprite.draw(g,sx,sy+(sail?-6+bob:-3),{...lo(S.look),view:fi?(P.f==='l'?'l':'r'):vw(P.f),frame:(mv&&!sail)?[1,0,3,0][(t/90|0)%4]:0,fishing:!!fi,bite:fs===2,t,noLine:true});
    if(sail){if(!vert){R(bx,by+9+bob,16,4,h[0]);R(bx+1,by+9+bob,14,3,h[1])}else{R(bx+3,by+10+bob,9,6,h[0]);R(bx+4,by+10+bob,7,5,h[1])}}
  }});
  E.sort((a,b)=>a.y-b.y).forEach(e=>e.f());
  if(zoneOf(P.x,P.y)===2||zoneOf(P.x,P.y)===7){const px=P.rx*T+8-cx,py=P.ry*T+4-cy,gr=g.createRadialGradient(px,py,26,px,py,92);gr.addColorStop(0,'rgba(2,6,14,0)');gr.addColorStop(1,'rgba(2,6,14,.93)');g.fillStyle=gr;g.fillRect(0,0,VW,VH)}
  // fishing line
  if(fs){const [fx,fy]=front(),px=P.rx*T+(P.f==='l'?-1:18)-cx,py=P.ry*T+2-cy,ex=fx*T+8-cx,ey=fy*T+8-cy+(Math.sin(t/200)*(fs===2?3:1))|0;
    g.strokeStyle='#fff';g.lineWidth=1;g.beginPath();g.moveTo(px,py);g.lineTo(ex,ey);g.stroke();
    R(ex-2,ey-2,4,4,'#e8403a');R(ex-2,ey-2,4,2,'#fff');
    if(fs===2){R(ex-4,ey-18,8,11,'#fff');R(ex-4,ey-18,8,1,'#23222e');R(ex-1,ey-16,2,5,'#e8403a');R(ex-1,ey-9,2,2,'#e8403a')}}
}
