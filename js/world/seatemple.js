// ---------- the Temple of the Sea (Knossos style): crater gate, stone boardwalk, courtyard with the dolphin pool, temple hall, vault under the lake ----------
// Built from art/temples/knossos_temple, on the island from seaisland.js. Outdoors (tile coordinates): the crater rim gate (two red columns, x 281 and 285, y 43) opens
// onto a three-wide stone boardwalk (x 282-284, y 38-43) with red lamp posts, running north over the lake to the courtyard platform (x 279-287, y 32-37): a limestone floor,
// water channels, a pool with a dolphin fountain, red columns and braziers. The temple hall's front (x 281-285, y 30-31) stands against the crater's north wall;
// its centre doorway leads into the hall (zone 6), whose stairs lead down to the vault (zone 7). No story items: the vault's pedestal is empty.
{const set=(x0,y0,x1,y1,t)=>rect(x0,y0,x1,y1,(x,y)=>setT(x,y,t));
 set(279,32,287,37,64);                                                  // courtyard platform
 set(282,38,284,43,65);                                                  // boardwalk from the rim gate to the platform
 [[281,39],[285,39],[281,41],[285,41]].forEach(([x,y])=>setT(x,y,68));    // red lamp posts on the water
 [[281,43],[285,43],[281,37],[285,37]].forEach(([x,y])=>setT(x,y,66));    // the rim gate and the courtyard's entrance columns
 set(282,34,284,35,67);                                                  // pool with the dolphin fountain
 [[281,32],[285,32]].forEach(([x,y])=>setT(x,y,77));                       // braziers beside the doorway
 BL.push({x:281,y:30,w:5,knossos:1});set(281,30,285,31,5);                  // the temple hall's front
 // the hall (zone 6): red plaster wall with white bands and the cream frieze, the sea god in his niche, a stairway down flanked by columns and braziers
 rect(HZ.x0,HZ.y0,HZ.x1,HZ.y1,(x,y)=>setT(x,y,(x===HZ.x0||x===HZ.x1||y===HZ.y1||y<=HZ.y0+2)?70:69));setT(HZ.dx,HZ.y1,23);
 setT(HZ.dx,HZ.y0+1,71);setT(HZ.dx,HZ.y0+2,71);
 set(HZ.dx-1,HZ.y0+4,HZ.dx+1,HZ.y0+6,72);[[HZ.dx-2,HZ.y0+5],[HZ.dx+2,HZ.y0+5]].forEach(([x,y])=>setT(x,y,66));[[HZ.dx-3,HZ.y0+4],[HZ.dx+3,HZ.y0+4]].forEach(([x,y])=>setT(x,y,77));
 // the vault (zone 7): a cave of dark water, a stone ledge at the stairs, three stepping stones and a platform between two red columns with an empty pedestal
 rect(VZ.x0,VZ.y0,VZ.x1,VZ.y1,(x,y)=>setT(x,y,(x===VZ.x0||x===VZ.x1||y===VZ.y1||y<=VZ.y0+1)?73:y>=VZ.y1-2?75:74));setT(VZ.dx,VZ.y1,23);
 set(VZ.dx-2,VZ.y0+3,VZ.dx+3,VZ.y0+5,75);[[VZ.dx,VZ.y0+6],[VZ.dx,VZ.y0+7],[VZ.dx,VZ.y0+8]].forEach(([x,y])=>setT(x,y,75));
 [[VZ.dx-2,VZ.y0+4],[VZ.dx+3,VZ.y0+4]].forEach(([x,y])=>setT(x,y,66));set(VZ.dx,VZ.y0+4,VZ.dx+1,VZ.y0+4,76);
 ENTR.push({x:283,y:31,to:'seahall',out:[283,32]});
 [HZ.dx-1,HZ.dx,HZ.dx+1].forEach(x=>ENTR.push({x,y:HZ.y0+6,to:'vault',out:[HZ.dx,HZ.y0+7]}));
 Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x>=274&&x<=292&&y>=28&&y<=45)delete S.cut[i]})}
