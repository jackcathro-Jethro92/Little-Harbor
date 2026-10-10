// ---------- the Temple of the Sea's island (Island 5): terraces rising to a crater rim, a crater lake in the middle, stairs winding up ----------
// Runs after earthtemple.js. The island is rebuilt here from rings round its centre (so every ring is a clean band all the way round).
// Uses the mountain terrace tiles: 48 rock floor, 49 cliff face (blocks), 50 stone steps; TLV holds each tile's height, which picks the colour
// (warm tan low, cool grey-blue high). Levels from the shore inwards: 0 beach, 1 and 2 grass terraces, 3 the rock rim, then the lake (open water, enclosed).
// The three stairways wind round the island: west up to terrace 1, north up to terrace 2, east up to the rim. The rim's south side is kept for the temple's crater gate (next step).
{const cx=283,cy=36,rx=24,ry=19,LVL_TLV=[2,4,7,10],RING=[.84,.66,.50,.34],ANG=[Math.PI,-Math.PI/2,0]; // stair angles: west, north, east (0 = east, y grows downwards)
 const inb=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH,D4=[[1,0],[-1,0],[0,1],[0,-1]];
 {const i=BL.findIndex(b=>b.col==='#2f7fc4'&&b.x===281);if(i>=0)BL.splice(i,1)}                // the old placeholder temple goes
 const X0=cx-rx-5,X1=cx+rx+5,Y0=cy-ry-5,Y1=cy+ry+5;
 const rr=(x,y)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry,a=Math.atan2(dy,dx);return Math.hypot(dx,dy)*(1+.04*Math.sin(5*a+.7)+.025*Math.sin(8*a+2))};
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){if(!inb(x,y))continue;const i=y*MW+x;M[i]=0;TLV[i]=0}   // wipe the old island and its placeholder
 const LV=new Map();
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){const r=rr(x,y),i=y*MW+x;if(r>=1||r<RING[3])continue;
   const lv=r<RING[2]?3:r<RING[1]?2:r<RING[0]?1:0,n=hs(x*11,y*13)%100;LV.set(i,lv);TLV[i]=LVL_TLV[lv];
   M[i]=lv===3?48:lv===0&&r>.93?2:n<6?19:n<9?[26,25][n%2]:1}                                    // sand on the shore, bare rock on the rim, grass between (with some flax and herbs)
 const lvAt=(x,y)=>{const v=LV.get(y*MW+x);return v===undefined?(rr(x,y)<RING[3]?99:0):v};      // the lake counts as high, the sea outside as level 0
 const border=[[],[],[]];
 LV.forEach((lv,i)=>{if(lv<1)return;const x=i%MW,y=(i/MW)|0;if(D4.some(([a,b])=>lvAt(x+a,y+b)<lv)){M[i]=49;border[lv-1].push(i)}});   // a cliff face wherever a tile has a lower neighbour
 const angd=(i,t)=>{const a=Math.atan2(((i/MW|0)-cy)/ry,(i%MW-cx)/rx);const d=Math.abs(a-t);return Math.min(d,2*Math.PI-d)};
 border.forEach((list,k)=>{list.sort((a,b)=>angd(a,ANG[k])-angd(b,ANG[k]));                                       // a three-tile stairway through each cliff ring
   const a=list[0],ax=a%MW,ay=(a/MW)|0;list.filter(j=>Math.abs(j%MW-ax)+Math.abs((j/MW|0)-ay)<=2).slice(0,3).forEach(j=>M[j]=50)});
 Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x>=X0&&x<=X1&&y>=Y0&&y<=Y1)delete S.cut[i]})}   // old cut-tree records must not put trees back on the new ground
