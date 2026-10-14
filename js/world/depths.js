// ---------- Quest 8: the Depths under the Temple Tower (a long, slightly maze-like dark hall, then the chamber where the spirits wait) ----------
// Two hidden rooms below the sea, like the Darkwood. ZONE 20, the Depths (x 20-66, y 262-297): a maze of two-tile-wide dark stone corridors, cells three tiles apart, drawn with a light radius round the player. It is cut by a fixed
// recipe (a depth-first maze with about one wall in nine knocked down so it has loops and does not feel like a single wiggling pipe), so it is the same every game and nothing is saved. You come in at the bottom left, up the
// stairs from the hatch in the Tower's shrine room, and the way out is a door in the top wall at the far right (top right cell). ZONE 21, the chamber (x 22-36, y 250-259): a rune circle with a brazier for each spirit's element
// and the door at the bottom. DEPTH_SPOTS lists where the ghosts and zombies live (js/story/quest8.js spawns them).
// Tiles: 142 flagstone floor (walk), 143 dark stone wall, 144 the hatch in the shrine room floor (blocked, used by facing it), 145 stairs up out of the Depths (blocked, used by facing), 146 wall torch (blocked),
// 147 chamber floor with the rune circle (walk), 148 earth brazier, 149 sea brazier, 150 sky brazier, 151 fire brazier (all blocked), 152 a toppled stand in the ransacked shrine room (walk). Art: js/render/depths.js and towerTile.
const DZ={z:20,x0:20,y0:262,x1:66,y1:297},CZ={z:21,x0:22,y0:250,x1:36,y1:259,dx:29};
ROOMTAB.push(DZ,CZ);WK.push(142,147,152);
const DEPTH_CW=15,DEPTH_CH=11,DEPTH_OX=DZ.x0+1,DEPTH_OY=DZ.y0+1,DEPTH_SPOTS=[];
{rect(DZ.x0,DZ.y0,DZ.x1,DZ.y1,(x,y)=>setT(x,y,143));
 let seed=8128;const rnd=()=>(seed=(seed*1103515245+12345)&0x7fffffff)/0x7fffffff;
 const cell=(i,j)=>[DEPTH_OX+3*i,DEPTH_OY+3*j],open=(i,j)=>{const[x,y]=cell(i,j);rect(x,y,x+1,y+1,(a,b)=>setT(a,b,142))};
 const link=(i,j,k,l)=>{const[x,y]=cell(Math.min(i,k),Math.min(j,l));if(i!==k)rect(x+2,y,x+2,y+1,(a,b)=>setT(a,b,142));else rect(x,y+2,x+1,y+2,(a,b)=>setT(a,b,142))};
 const seen=new Set(),adj={},add=(a,b)=>{(adj[a]=adj[a]||[]).push(b);(adj[b]=adj[b]||[]).push(a)},key=(i,j)=>i+','+j;
 const st=[[0,DEPTH_CH-1]];seen.add(key(0,DEPTH_CH-1));open(0,DEPTH_CH-1);
 while(st.length){const[i,j]=st[st.length-1],ns=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[i+a,j+b]).filter(([a,b])=>a>=0&&b>=0&&a<DEPTH_CW&&b<DEPTH_CH&&!seen.has(key(a,b)));
  if(!ns.length){st.pop();continue}const[a,b]=ns[(rnd()*ns.length)|0];seen.add(key(a,b));open(a,b);link(i,j,a,b);add(key(i,j),key(a,b));st.push([a,b])}
 for(let j=0;j<DEPTH_CH;j++)for(let i=0;i<DEPTH_CW;i++)[[1,0],[0,1]].forEach(([a,b])=>{const k=i+a,l=j+b;if(k<DEPTH_CW&&l<DEPTH_CH&&!(adj[key(i,j)]||[]).includes(key(k,l))&&rnd()<.11){link(i,j,k,l);add(key(i,j),key(k,l))}});
 // the way through: a breadth-first search from the entrance cell to the exit cell, so the creatures can be spread along it
 const S0=key(0,DEPTH_CH-1),E0=key(DEPTH_CW-1,0),prev={[S0]:null};const q=[S0];while(q.length){const c=q.shift();(adj[c]||[]).forEach(n=>{if(!(n in prev)){prev[n]=c;q.push(n)}})}
 const route=[];for(let c=E0;c;c=prev[c])route.unshift(c);
 const at2=k=>k.split(',').map(Number),spot=k=>{const[i,j]=at2(k),[x,y]=cell(i,j);return[x,y]};
 // nine creatures: six along the way (every few cells, alternating ghost and zombie) and three in side branches
 const kinds=['depths_ghost','zombie'];let n=0;
 for(let m=1;m<=6;m++){const c=route[Math.round(m*(route.length-1)/7)],[x,y]=spot(c);DEPTH_SPOTS.push({t:kinds[n++%2],x,y})}
 const side=Object.keys(adj).filter(c=>!route.includes(c)).sort((a,b)=>hs(at2(a)[0]*11,at2(a)[1]*7)-hs(at2(b)[0]*11,at2(b)[1]*7));
 for(let m=0;m<3&&side.length;m++){const c=side[(m*Math.max(1,side.length/3))|0],[x,y]=spot(c);DEPTH_SPOTS.push({t:['depths_ghost','zombie','depths_ghost'][m],x,y})}
 // wall torches where a wall has floor below it, some of the time
 for(let y=DZ.y0;y<=DZ.y1;y++)for(let x=DZ.x0;x<=DZ.x1;x++)if(at(x,y)===143&&at(x,y+1)===142&&hs(x*5,y*3)%9===0&&at(x-1,y)===143&&at(x+1,y)===143)setT(x,y,146);
 // in at the bottom left (stairs up to the shrine room), out at the top right (a door to the chamber)
 {const[x,y]=cell(0,DEPTH_CH-1);rect(x,y+2,x+1,y+2,(a,b)=>setT(a,b,145));DEPTH_START=[x,y+1];DEPTH_STAIRS=[[x,y+2],[x+1,y+2]]}
 {const[x,y]=cell(DEPTH_CW-1,0);rect(x,y-1,x+1,y-1,(a,b)=>setT(a,b,23));DEPTH_DOORS=[[x,y-1],[x+1,y-1]];DEPTH_EXIT=[x,y]}
}
var DEPTH_START,DEPTH_STAIRS,DEPTH_DOORS,DEPTH_EXIT;
// ---- the chamber ----
{const Z=CZ,wall=(x,y)=>x===Z.x0||x===Z.x1||y<=Z.y0+1||y===Z.y1;
 rect(Z.x0,Z.y0,Z.x1,Z.y1,(x,y)=>setT(x,y,wall(x,y)?143:147));setT(Z.dx,Z.y1,23);
 [Z.dx-5,Z.dx-2,Z.dx+2,Z.dx+5].forEach(x=>setT(x,Z.y0+1,146));
 setT(Z.x0+2,Z.y0+3,148);setT(Z.x1-2,Z.y0+3,149);setT(Z.x0+2,Z.y1-2,150);setT(Z.x1-2,Z.y1-2,151)}
// ---- the doors between the rooms ----
{const TSd=TS,hatch=[TSd.dx,TSd.y0+5],before=[TSd.dx-1,TSd.y0+5];
 THROUGH.push({x:hatch[0],y:hatch[1],out:[DEPTH_START[0],DEPTH_START[1]],f:'u',msg:'You climb down the stairs into the dark.'});
 DEPTH_STAIRS.forEach(([x,y])=>THROUGH.push({x,y,out:[before[0],before[1]],f:'r',msg:'You climb the stairs back up to the shrine room.'}));
 DEPTH_DOORS.forEach(([x,y])=>THROUGH.push({x,y,out:[CZ.dx,CZ.y1-1],f:'u',msg:'Light ahead. You step into a round chamber.'}));
 THROUGH.push({x:CZ.dx,y:CZ.y1,out:[DEPTH_EXIT[0],DEPTH_EXIT[1]],f:'d',msg:'You go back into the dark halls.'})}
