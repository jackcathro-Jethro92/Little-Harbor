// ---------- the Temple Tower: gate, raked-gravel courtyard with covered walkways, five-storey pagoda and the shrine room (see art/temples/temple_tower) ----------
// Built on the clearing from towerisland.js, round the north-south axis x = 212. The dock and path arrive from the north, so the wooden gate (x 210-214, y 195) is in the
// north wall. The courtyard (x 204-220, y 196-208) is raked gravel with a line of stepping stones from the gate to the pagoda and stone lanterns. A ring of covered
// walkways (tile 106, blocks) closes it in. The pagoda (x 209-215, y 200-204, drawn by towerPagoda in js/render/temples.js) stands in the middle; walk round it by either side
// to its door on the south face (212,204), which leads into the shrine room (zone 10, x 156-166, y 226-235). Tiles: 106 walkway wall, 107 gate post, 108 tatami (walkable),
// 109 shrine room wall, 110 pillar, 111 golden shrine, 112 lacquer platform, 113 offering table, 114 plain stand, 115 hanging gold lantern, 116 the pagoda's footprint (gravel under the building; all blocked unless noted).
// No story items: the four stands are bare. The lower chamber under the pagoda is not built (it comes with the story).
{const AX=212,land=(x,y)=>at(x,y)!==0,set=(x0,y0,x1,y1,t)=>rect(x0,y0,x1,y1,(x,y)=>{if(land(x,y))setT(x,y,t)});
 set(202,194,222,210,103);                                                      // flat gravel under everything (pines and moss go; the island's edge stays)
 set(203,195,221,195,106);set(203,209,221,209,106);set(203,195,203,209,106);set(221,195,221,209,106);   // the covered walkways round the courtyard
 set(AX-1,195,AX+1,195,103);setT(AX-2,195,107);setT(AX+2,195,107);              // the gate: a gap of three, a wooden post either side (roof drawn by towerGate)
 [[AX-3,194],[AX+3,194]].forEach(([x,y])=>setT(x,y,7));                           // lanterns outside the gate
 set(AX,196,AX,199,104);set(AX,205,AX,207,104);                                 // stepping stones from the gate to the pagoda and from its door out to the south
 BL.push({x:AX-2,y:195,w:5,towergate:1});
 set(AX-3,200,AX+3,204,116);BL.push({x:AX-3,y:200,w:7,pagoda:1});                    // the pagoda; the tile in the middle of its south face is the door
 ENTR.push({x:AX,y:204,to:'shrine',out:[AX,205]});
 [[206,198],[218,198],[206,206],[218,206],[AX-5,208],[AX+5,208]].forEach(([x,y])=>setT(x,y,7));   // lanterns in the courtyard
 Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x>=200&&x<=224&&y>=192&&y<=212)delete S.cut[i]})}
// the shrine room (zone 10): dark coffered ceiling and a carved plaque over glowing paper screens, tatami floor, dark pillars, a small golden shrine on a black-and-red lacquer platform
// between two hanging gold lanterns, a red offering table, and four bare stands in a row. The door is at the bottom.
{const Z=TS,wall=(x,y)=>x===Z.x0||x===Z.x1||y<=Z.y0+2||y===Z.y1;
 rect(Z.x0,Z.y0,Z.x1,Z.y1,(x,y)=>setT(x,y,wall(x,y)?109:108));setT(Z.dx,Z.y1,23);
 [[Z.x0+1,Z.y0+3],[Z.x1-1,Z.y0+3],[Z.x0+1,Z.y1-1],[Z.x1-1,Z.y1-1]].forEach(([x,y])=>setT(x,y,110));   // pillars
 setT(Z.dx,Z.y0+3,111);[Z.dx-1,Z.dx+1].forEach(x=>setT(x,Z.y0+3,112));rect(Z.dx-1,Z.y0+4,Z.dx+1,Z.y0+4,(x,y)=>setT(x,y,112));   // the shrine on its platform
 setT(Z.dx-3,Z.y0+3,115);setT(Z.dx+3,Z.y0+3,115);                                // hanging gold lanterns
 rect(Z.dx-1,Z.y0+6,Z.dx+1,Z.y0+6,(x,y)=>setT(x,y,113));                         // the offering table
 [Z.dx-4,Z.dx-2,Z.dx+2,Z.dx+4].forEach(x=>setT(x,Z.y1-2,114))}                    // four bare stands in a row
