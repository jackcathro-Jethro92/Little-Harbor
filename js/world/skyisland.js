// ---------- the Temple to the Sky's island (Island 3): wide open terraces climbing to a high flat plateau, with a lantern-lined path ----------
// Runs after seatemple.js. The island is rebuilt here from rings round its centre, like the Temple of the Sea's island, but wide and open: broad meadows, five-tile-wide
// stairways, no trees. Levels from the shore inwards: 0 beach, 1 and 2 grass terraces, 3 the plateau (a big flat grass top, edged by a cliff, where the temple will sit).
// Uses the terrace tiles 49 cliff face (blocks) and 50 stone steps; TLV holds each tile's height (colour). A three-wide dirt path zigzags across the meadows between the stairways:
// west up to terrace 1, north up to terrace 2, then round the east side to the south edge of the plateau. Lanterns (tile 7) line both sides of the path every 5 then 6 tiles.
const SKY_LAN=[]; // {k path, d distance along the path in tiles, x, y}: one entry per lantern pair, so the spacing can be checked
{const cx=244,cy=138,rx=32,ry=31,LVL_TLV=[2,4,6,10],RING=[.93,.72,.54],A=[Math.PI,1.5*Math.PI,2.5*Math.PI]; // stair angles: west, north, south (y grows downwards)
 const inb=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH,D4=[[1,0],[-1,0],[0,1],[0,-1]];
 const wob=a=>1+.05*Math.sin(3*a+1)+.03*Math.sin(7*a+2);
 const rr=(x,y)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry;return Math.hypot(dx,dy)*wob(Math.atan2(dy,dx))};
 {const i=BL.findIndex(b=>b.col==='#cfe3f0'&&b.x===242);if(i>=0)BL.splice(i,1)}                // the old placeholder temple goes
 const X0=cx-rx-6,X1=cx+rx+6,Y0=cy-ry-6,Y1=cy+ry+6;
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){if(!inb(x,y))continue;const i=y*MW+x;M[i]=0;TLV[i]=0}   // wipe the old island and its placeholder
 const LV=new Map();
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){const r=rr(x,y),i=y*MW+x;if(r>=1)continue;
   const lv=r<RING[2]?3:r<RING[1]?2:r<RING[0]?1:0,n=hs(x*11,y*13)%100;LV.set(i,lv);TLV[i]=LVL_TLV[lv];
   M[i]=lv===0&&r>.97?2:n<4?19:n<6?[26,27,25][n%3]:1}                                           // sand on the shore, grass everywhere else (a little flax and a few herbs)
 const lvAt=(x,y)=>{const v=LV.get(y*MW+x);return v===undefined?0:v};                           // the sea outside counts as level 0
 const border=[[],[],[]];
 LV.forEach((lv,i)=>{if(lv<1)return;const x=i%MW,y=(i/MW)|0;if(D4.some(([a,b])=>lvAt(x+a,y+b)<lv)){M[i]=49;border[lv-1].push(i)}});   // a cliff face wherever a tile has a lower neighbour
 const angd=(i,t)=>{const a=Math.atan2(((i/MW|0)-cy)/ry,(i%MW-cx)/rx);let d=Math.abs(a-t)%(2*Math.PI);return Math.min(d,2*Math.PI-d)};
 border.forEach((list,k)=>{list.sort((a,b)=>angd(a,A[k])-angd(b,A[k]));                                          // a five-tile-wide stairway through each cliff ring
   const a=list[0],ax=a%MW,ay=(a/MW)|0;list.filter(j=>Math.hypot(j%MW-ax,(j/MW|0)-ay)<=3).sort((p,q)=>Math.hypot(p%MW-ax,(p/MW|0)-ay)-Math.hypot(q%MW-ax,(q/MW|0)-ay)).slice(0,5).forEach(j=>M[j]=50)});
 // the path: from each stairway's top, along the middle of the terrace, to the next stairway (a 3-wide dirt strip), with lanterns on both sides every 5 then 6 tiles
 let step=0,next0=5;
 [[0,A[0],A[1],.91,.825,.74],[1,A[1],A[2],.70,.63,.56]].forEach(([k,a0,a1,rIn,rMid,rOut])=>{const pts=[],add=(a,rho)=>{const w=wob(a),x=Math.round(cx+rx*rho/w*Math.cos(a)),y=Math.round(cy+ry*rho/w*Math.sin(a));if(!pts.length||pts[pts.length-1][0]!==x||pts[pts.length-1][1]!==y)pts.push([x,y])};
   for(let r=rIn;(rIn>rMid?r>=rMid:r<=rMid);r+=rIn>rMid?-.004:.004)add(a0,r);                    // from the stairway's top in to the middle of the terrace
   for(let a=a0;a<=a1;a+=.004)add(a,rMid);                                                      // round the terrace
   for(let r=rMid;(rMid>rOut?r>=rOut:r<=rOut);r+=rMid>rOut?-.004:.004)add(a1,r);                // out to the next stairway
   let len=0,next=k?next0:5;
   pts.forEach(([x,y],q)=>{if(q)len+=Math.hypot(x-pts[q-1][0],y-pts[q-1][1]);
     for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const i=(y+dy)*MW+x+dx;if(lvAt(x+dx,y+dy)===k+1&&M[i]!==49&&M[i]!==50)M[i]=6}
     if(len>=next&&q>1&&q<pts.length-2){const[px,py]=pts[q-2],[qx,qy]=pts[q+2],tx=qx-px,ty=qy-py,tl=Math.hypot(tx,ty)||1,nx=-ty/tl,ny=tx/tl;
       [1,-1].forEach(s=>{const lx=Math.round(x+nx*2.4*s),ly=Math.round(y+ny*2.4*s),i=ly*MW+lx;if(lvAt(lx,ly)===k+1&&(M[i]===1||M[i]===19||M[i]>=24&&M[i]<=30))M[i]=7});
       SKY_LAN.push({k,d:next,x,y});next+=(step++%2?5:6)}});next0=next-len});
 // the plateau's floor is level, open grass; a ring of the final stairway's path continues in the temple step
 Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x>=X0&&x<=X1&&y>=Y0&&y<=Y1)delete S.cut[i]})}   // old cut-tree records must not put trees back on the new ground
