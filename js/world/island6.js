// ---------- Oak Island (Island 6, centre (144,170)): the ironwood logs for Quest 3 (roadmap 5.3) ----------
// Three fallen ironwood logs (tile 140) lie on the grass of the island. Picking one up needs no tool (PICKUPS in js/data/gathering.js) and a taken log lies there again three days later.
// Each log is put on the nearest plain grass tile to its spot, so the island keeps its shape and nothing is walled in.
[[139,167],[150,168],[143,174]].forEach(([x,y])=>{let best=null;
  for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const xx=x+dx,yy=y+dy;if(at(xx,yy)!==1)continue;
    if(![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>at(xx+a,yy+b)===1))continue;
    const d=dx*dx+dy*dy;if(!best||d<best[0])best=[d,xx,yy]}
  if(best)setT(best[1],best[2],140)});

