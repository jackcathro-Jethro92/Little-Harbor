// ---------- the Temple Tower's island (the old little islet at 202,200): a small pine-forest island with a stone dock in the north, a lantern path south and a clearing for the temple ----------
// Runs after pirates.js. The island is rebuilt here, about 38 x 34 tiles (centre 212,196), well clear of the hidden rooms, which now sit below the sea in rows 246 and down. A stone dock (tile 105, three wide,
// walkable over the water) runs south from the open sea into the north beach, and a gravel path with stepping stones (tiles 103/104) continues straight south through dark pine forest
// (tile 102, blocks) between stone lanterns (tile 7) set every four tiles on both sides, to a flat clearing in the south (x 203-221, y 195-208) where the temple complex will be built
// (js/world/towertemple.js, a later step; its gate will face north, towards the dock). No houses, no story items.
const TOWER_LAN=[]; // {x,y}: one entry per lantern
{const cx=212,cy=196,rx=19,ry=17,AX=212,CL={x0:203,x1:221,y0:195,y1:208},D4=[[1,0],[-1,0],[0,1],[0,-1]];
 const inb=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH;
 const rr=(x,y)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry,a=Math.atan2(dy,dx);return Math.hypot(dx,dy)*(1+.07*Math.sin(3*a+.9)+.05*Math.sin(5*a+2.1)+.03*Math.sin(9*a))};
 {const i=BL.findIndex(b=>b.tower);if(i>=0)BL.splice(i,1)}                                    // the old placeholder tower goes
 const X0=cx-rx-8,X1=cx+rx+8,Y0=cy-ry-8,Y1=cy+ry+8;
 for(let y=190;y<=208;y++)for(let x=190;x<=212;x++)if(M[y*MW+x])M[y*MW+x]=0;                    // wipe the old islet
 const land=new Set();
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){if(!inb(x,y)||y>=221)continue;const r=rr(x,y);if(r>=1)continue;land.add(y*MW+x);M[y*MW+x]=r>.93?2:1}
 // the north beach, the path south from it to the clearing, and the stone dock reaching out to sea
 let ty=cy;while(land.has((ty-1)*MW+AX))ty--;
 const PY1=CL.y0-1;
 for(let y=ty;y<=PY1;y++)for(let x=AX-1;x<=AX+1;x++){M[y*MW+x]=(x===AX&&(y-ty)%2===0)?104:103}
 for(let y=ty-8;y<ty;y++)for(let x=AX-1;x<=AX+1;x++)M[y*MW+x]=105;
 for(let y=ty+2;y<=PY1-2;y+=4)[AX-3,AX+3].forEach(x=>{if(land.has(y*MW+x)){M[y*MW+x]=7;TOWER_LAN.push({x,y})}});
 // pines: dark pine forest on the whole island, but not on the beach, the path's verge or the clearing
 land.forEach(i=>{if(M[i]!==1)return;const x=i%MW,y=(i/MW)|0,r=rr(x,y);
   if(r>.9||x>=CL.x0&&x<=CL.x1&&y>=CL.y0&&y<=CL.y1||Math.abs(x-AX)<=4&&y<=CL.y0)return;
   const n=(((x*73856093)^(y*19349663))>>>7)%100;if(n<60)M[i]=102;else if(n<63)M[i]=24});
 Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x>=X0&&x<=X1&&y>=Y0&&y<=Y1)delete S.cut[i]})}
