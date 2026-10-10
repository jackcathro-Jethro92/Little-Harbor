// ---------- start: draw loop, timers, restore explored map, first screen ----------
(function loop(){draw();requestAnimationFrame(loop)})();
setInterval(ghostTick,600);setInterval(arenaTick,600);setInterval(()=>{if(S.buff)ui();const t=performance.now();if(G.alive&&G.pois>t){G.hp-=2;G.hitAt=t;if(G.hp<=0)ghostDie()}},1000);setInterval(save,5000);
setInterval(()=>NPC.forEach(n=>{if(n.fixed||Math.random()<.6)return;
  const d=Object.values(D)[Math.random()*4|0],x=n.x+d[0],y=n.y+d[1];
  if(Math.abs(x-n.hx)>3||Math.abs(y-n.hy)>2||(P.x===x&&P.y===y)||!walkable(x,y))return;
  n.x=x;n.y=y;n.f=d[0]?(d[0]>0?'r':'l'):(d[1]>0?'d':'u')}),900);
setInterval(()=>AN.forEach(a=>{if(Math.random()<.5)return;const d=Object.values(D)[Math.random()*4|0],x=a.x+d[0],y=a.y+d[1];
  if(Math.abs(x-a.hx)>a.rx||Math.abs(y-a.hy)>a.ry||(P.x===x&&P.y===y)||!walkable(x,y)||npcAt(x,y))return;a.x=x;a.y=y;if(d[0])a.f=d[0]<0?1:0}),800);
setInterval(()=>CH.forEach(c=>{if(Math.random()<.5)return;const d=Object.values(D)[Math.random()*4|0],x=c.x+d[0],y=c.y+d[1];
  if(Math.abs(x-c.hx)>2||Math.abs(y-c.hy)>2||!walkable(x,y)||(P.x===x&&P.y===y))return;c.x=x;c.y=y;if(d[0])c.f=d[0]<0?1:0}),700);
if(typeof S.fog==='string'&&S.fog.length===4800)for(let i=0;i<4800;i++)FOG[i]=S.fog[i]==='1'?1:0;
// testing: a link ending in  ?go=212,218  puts the player on that tile (on foot) for the visit
{const g=(new URLSearchParams(location.search).get('go')||'').split(',').map(Number);if(g.length===2&&g.every(Number.isFinite)&&at(g[0],g[1])!==undefined){sail=false;P.x=P.rx=g[0];P.y=P.ry=g[1];P.f='u'}}
reveal();ui();
showTitleOrStart();
