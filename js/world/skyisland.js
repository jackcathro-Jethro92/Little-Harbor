// ---------- the Temple to the Sky's island (Island 3): a zigzag path up the western hillside to a high flat plateau, forest everywhere else ----------
// Runs after seatemple.js. The island is rebuilt here. Its west half is a hillside of four wide terraces (bands running east to west, one above the next) topped by a big
// flat grass plateau where the temple will sit. A three-wide dirt path zigzags up the hill: it climbs from the south-west beach, runs east along a terrace, climbs at its east end,
// runs west along the next, and so on, each climb a five-tile-wide stairway cut through the terrace's cliff. The east, south and north of the island are lowland forest.
// Stone lanterns (tile 7) line both sides of the whole route every 5 then 6 tiles. Tiles: 49 cliff face (blocks), 50 stone steps; TLV holds each tile's height (colour).
const SKY_LAN=[]; // {d distance along the route in tiles, x, y}: one entry per lantern pair, so the spacing can be checked
const SKY_STAIRS=[[222,151],[242,145],[222,139],[242,133],[232,127]]; // centre of each stairway (x, cliff row y)
{const cx=244,cy=138,rx=32,ry=31,BANDS=[152,146,140,134,128],TLV_OF=[2,3,4,6,8,10]; // band k starts at row BANDS[k]-6 .. (level 1 = rows 146-151 ...); plateau is level 5 (rows 127 and up)
 const inb=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH,D4=[[1,0],[-1,0],[0,1],[0,-1]];
 const wob=a=>1+.07*Math.sin(2*a+.5)+.05*Math.sin(5*a+1)+.03*Math.sin(9*a);
 const rr=(x,y)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry;return Math.hypot(dx,dy)*wob(Math.atan2(dy,dx))};
 const xE=y=>Math.round(254-(y-112)*.15+1.3*Math.sin(y*.4));                                    // the hill's east edge: wide at the top, narrower below, a little wavy
 const hillLv=(x,y)=>x>xE(y)||y>151?0:y>=146?1:y>=140?2:y>=134?3:y>=128?4:5;
 {const i=BL.findIndex(b=>b.col==='#cfe3f0'&&b.x===242);if(i>=0)BL.splice(i,1)}                // the old placeholder temple goes
 const X0=cx-rx-8,X1=cx+rx+8,Y0=cy-ry-8,Y1=cy+ry+8;
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){if(!inb(x,y))continue;const i=y*MW+x;M[i]=0;TLV[i]=0}   // wipe the old island and its placeholder
 const LV=new Map();
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){const r=rr(x,y),i=y*MW+x;if(r>=1)continue;
   const lv=r>.93?0:hillLv(x,y);LV.set(i,lv);TLV[i]=TLV_OF[lv];M[i]=lv===0&&r>.97?2:1}
 const lvAt=(x,y)=>{const v=LV.get(y*MW+x);return v===undefined?0:v};                           // the sea outside counts as level 0
 LV.forEach((lv,i)=>{if(lv<1)return;const x=i%MW,y=(i/MW)|0;if(D4.some(([a,b])=>lvAt(x+a,y+b)<lv))M[i]=49});   // a cliff face wherever a tile has a lower neighbour
 SKY_STAIRS.forEach(([sx,sy])=>{for(let x=sx-2;x<=sx+2;x++)if(M[sy*MW+x]===49)M[sy*MW+x]=50});  // the five stairways, through the cliff rows
 // the route: south-west beach, up the first stairway, east along terrace 1, up, west along terrace 2, up, east along terrace 3, up, west to the middle of terrace 4, up onto the plateau
 const ROUTE=[[222,159],[222,148],[242,148],[242,142],[222,142],[222,136],[242,136],[242,130],[232,130],[232,124]],pts=[];
 for(let k=1;k<ROUTE.length;k++){const[a,b]=ROUTE[k-1],[c,d]=ROUTE[k],n=Math.max(Math.abs(c-a),Math.abs(d-b));for(let q=0;q<=n;q++){const x=Math.round(a+(c-a)*q/n),y=Math.round(b+(d-b)*q/n);if(!pts.length||pts[pts.length-1][0]!==x||pts[pts.length-1][1]!==y)pts.push([x,y])}}
 let len=0,next=5,step=0;
 pts.forEach(([x,y],q)=>{if(q)len+=Math.hypot(x-pts[q-1][0],y-pts[q-1][1]);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const i=(y+dy)*MW+x+dx;if(LV.has(i)&&M[i]!==49&&M[i]!==50&&M[i]!==0)M[i]=6}   // a three-wide dirt strip (stairways and cliffs stay as they are)
   if(len>=next&&q>2&&q<pts.length-3){const[px,py]=pts[q-3],[qx,qy]=pts[q+3],tx=qx-px,ty=qy-py,tl=Math.hypot(tx,ty)||1,nx=-ty/tl,ny=tx/tl;
     [1,-1].forEach(s=>{const lx=Math.round(x+nx*2.5*s),ly=Math.round(y+ny*2.5*s),i=ly*MW+lx;if(LV.has(i)&&(M[i]===1||M[i]===19||M[i]>=24&&M[i]<=30))M[i]=7});
     SKY_LAN.push({d:next,x,y});next+=(step++%2?5:6)}});
 // the rest: a few flax and herbs everywhere, and forest on the lowland (not on the beach, not hiding the cliffs' feet, not near the route)
 const routeNear=(x,y,r)=>pts.some(([a,b])=>Math.abs(a-x)<=r&&Math.abs(b-y)<=r);
 const hillNear=(x,y,r)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(lvAt(x+i,y+j)>0)return true;return false};
 LV.forEach((lv,i)=>{if(M[i]!==1)return;const x=i%MW,y=(i/MW)|0,n=hs(x*11,y*13)%100,r=rr(x,y);
   if(lv===0&&r<.9&&!hillNear(x,y,2)&&!routeNear(x,y,4)&&n<24)M[i]=4;else if(n<3)M[i]=19;else if(n<5)M[i]=[26,27,25][n%3]});
 Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x>=X0&&x<=X1&&y>=Y0&&y<=Y1)delete S.cut[i]})}   // old cut-tree records must not put trees back on the new ground
