// ---------- the Temple to the Sky: dolmen gateway, avenue of standing stones, outer stone circle, inner trilithons and the carved temple stone ----------
// Built from art/temples/sky_stonehenge_temple, on the plateau from skyisland.js. Everything is laid out round the north-south axis x = 236 (where the route arrives, via the
// stairway at (236,127)). Tiles: 78 standing stone, 79 lintel slab, 80/81 the temple stone; the gateway's lintel is a building ('skygate'). No story items.
{const AX=236,CY=108,R6=7,set=(x,y,t)=>{if(at(x,y)!==0)setT(x,y,t)};
 // the carved temple stone in the middle (two tiles wide), with a ring of bare sandy earth round it
 rect(AX-4,CY-3,AX+3,CY+3,(x,y)=>{if(at(x,y)===1&&((x-AX+.5)/3.6)**2+((y-CY)/2.8)**2<=1)setT(x,y,6)});
 set(AX-1,CY,80);set(AX,CY,81);
 // five trilithons in a horseshoe open to the south: two uprights and a lintel above (the lintel row is blocked, the gap between the uprights can be walked into)
 [[AX,CY-3],[AX+4,CY-2],[AX-4,CY-2],[AX+5,CY+1],[AX-5,CY+1]].forEach(([x,y])=>{set(x-1,y,78);set(x+1,y,78);set(x-1,y-1,79);set(x,y-1,79);set(x+1,y-1,79)});
 // the outer circle (radius 7): stones every few tiles with low lintel slabs between them, and a three-tile gap in the south for the avenue
 {const ring=[];for(let a=0;a<360;a+=2){const x=Math.round(AX+R6*Math.cos(a*Math.PI/180)),y=Math.round(CY+R6*Math.sin(a*Math.PI/180));if(!ring.some(p=>p[0]===x&&p[1]===y))ring.push([x,y])}
  const open=ring.filter(([x,y])=>!(y>CY+4&&Math.abs(x-AX)<=1)),gap=Math.max(1,Math.round(open.length/16));
  open.forEach(([x,y],i)=>set(x,y,i%gap===0?78:79))}
 // the avenue: a dirt road (drawn by the route in skyisland.js) lined with pairs of standing stones, and the dolmen gateway at its foot
 [121,119,117].forEach(y=>{set(AX-3,y,78);set(AX+3,y,78)});
 [123,124].forEach(y=>{set(AX-2,y,78);set(AX+2,y,78)});BL.push({x:AX-2,y:123,w:5,skygate:1});
 Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x>=AX-12&&x<=AX+12&&y>=96&&y<=128)delete S.cut[i]})}
