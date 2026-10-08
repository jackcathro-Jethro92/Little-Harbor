// ---------- the Temple of Fire (Forbidden-City style, a little smaller than the other temples) ----------
// Built from art/temples/fire_temple on the plateau from fireisland.js, round the north-south axis x = 71. From the south: bronze braziers beside the slab path, a two-tile lava moat
// across the whole plateau (fed by the two lava rivers) with a white marble bridge, the great red gate (x 66-76, y 34-36: three arched gateways under a two-tier golden roof; only the
// middle one can be walked through), a white marble courtyard in two tiers (balustrade and steps between them, a round fire basin, bronze braziers), and the fire hall's front
// (x 68-74, y 27-28, red columns and a double golden roof). Facing its doorway from (71,29) enters the hall (zone 8). No story items: the altar flame burns, nothing else.
{const set=(x0,y0,x1,y1,t)=>rect(x0,y0,x1,y1,(x,y)=>setT(x,y,t));
 set(60,37,82,38,84);set(70,37,72,38,97);                                      // the lava moat and the marble bridge
 [[68,39],[74,39]].forEach(([x,y])=>setT(x,y,98));                              // braziers by the bridge
 BL.push({x:66,y:34,w:11,firegate:1});set(66,34,76,36,5);set(70,34,72,36,94);     // the great gate (the middle gateway is open)
 set(65,29,77,33,94);                                                           // courtyard floor
 set(65,31,77,31,95);set(70,31,72,31,96);                                       // balustrade between the two tiers, with steps up in the middle
 set(65,28,67,28,95);set(75,28,77,28,95);                                       // balustrade either side of the hall
 BL.push({x:68,y:27,w:7,firehall:1});set(68,27,74,28,5);                          // the fire hall's front
 setT(71,32,99);[[67,32],[75,32],[67,30],[75,30]].forEach(([x,y])=>setT(x,y,98));  // the round fire basin and the bronze braziers
 ENTR.push({x:71,y:28,to:'firehall',out:[71,29]});
 Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x>=58&&x<=84&&y>=24&&y<=42)delete S.cut[i]})}
// the fire hall (zone 8): a dark red lacquer floor, red columns banded in gold, white lattice windows, a gold plaque over a swirl frieze, a dais of golden steps with the sacred flame, teal incense burners
rect(PH.x0,PH.y0,PH.x1,PH.y1,(x,y)=>setT(x,y,(x===PH.x0||x===PH.x1||y===PH.y1||y<=PH.y0+2)?89:88));setT(PH.dx,PH.y1,23);
rect(PH.dx-3,PH.y0+4,PH.dx+2,PH.y0+5,(x,y)=>setT(x,y,91));rect(PH.dx-1,PH.y0+3,PH.dx,PH.y0+3,(x,y)=>setT(x,y,92));   // the dais steps and the altar flame
setT(PH.dx-4,PH.y0+3,93);setT(PH.dx+3,PH.y0+3,93);                                  // incense burners
[[PH.x0+2,PH.y0+5],[PH.x1-2,PH.y0+5],[PH.x0+2,PH.y0+8],[PH.x1-2,PH.y0+8]].forEach(([x,y])=>setT(x,y,90));   // red columns
