// ---------- the Temple to the Mountains (Earth temple): Mayan ruins on the mountain plateau, built from art/temples/mayan_temple ----------
// Runs after mountaintown.js. Layout (tile coordinates): plaza x 0-14, y 25-31 with a low altar and two side shrines; a three-wide stairway (x 5-7)
// climbing a stepped pyramid (y 16-24) to the summit, where the temple (x 4-8, y 13-14) has three doorways; each leads into the sanctum (zone 5, js/world/interiors.js).
{const etSet=(x,y,t)=>{const c=at(x,y);if(c!==0&&c!==54&&c!==55)setT(x,y,t)};
 {const i=BL.findIndex(b=>b.col&&b.x===7&&b.y===26);if(i>=0)BL.splice(i,1)}                    // the old placeholder temple goes
 rect(0,25,14,31,(x,y)=>etSet(x,y,58));                                                        // plaza paving
 [[22,24,1,11],[19,21,2,10],[16,18,3,9]].forEach(([y0,y1,x0,x1])=>rect(x0,y0,x1,y1,(x,y)=>etSet(x,y,56)));   // the three stepped tiers
 rect(3,13,9,15,(x,y)=>etSet(x,y,56));                                                         // the summit slab
 rect(5,16,7,24,(x,y)=>etSet(x,y,57));rect(5,15,7,15,(x,y)=>etSet(x,y,58));                    // the stairway and the landing in front of the temple
 BL.push({x:4,y:13,w:5,mayan:'top'});rect(4,13,8,14,(x,y)=>etSet(x,y,5));                       // the temple on top
 BL.push({x:2,y:26,w:3,mayan:'shrine'});rect(2,26,4,27,(x,y)=>etSet(x,y,5));                    // side shrines
 BL.push({x:9,y:26,w:3,mayan:'shrine'});rect(9,26,11,27,(x,y)=>etSet(x,y,5));
 rect(3,29,5,30,(x,y)=>etSet(x,y,62));                                                         // the low altar in the plaza
 const pts=[[12,35],[12,32],[9,30],[7,28],[6,25]];                                              // the mountain path in, winding up to the stairs (2 tiles wide)
 for(let k=1;k<pts.length;k++){const a=pts[k-1],b=pts[k],n=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]));for(let q=0;q<=n;q++){const x=Math.round(a[0]+(b[0]-a[0])*q/n),y=Math.round(a[1]+(b[1]-a[1])*q/n);[0,1].forEach(d=>{if(at(x+d,y)!==5&&at(x+d,y)!==57&&at(x+d,y)!==62)etSet(x+d,y,6)})}}
 [[5,25],[6,25],[7,25]].forEach(([x,y])=>etSet(x,y,58));
 // a stale cut-resource record must not put ore back on top of the new ground
 Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x<=15&&y>=12&&y<=34)delete S.cut[i]})}
// the sanctum (zone 5): a stone hall with a stepped ceiling, glyph blocks and a painted mural across the back wall, two jaguar statues beside an altar, torches
rect(SZ.x0,SZ.y0,SZ.x1,SZ.y1,(x,y)=>setT(x,y,(x===SZ.x0||x===SZ.x1||y===SZ.y1||y===SZ.y0)?60:y<=SZ.y0+3?61:59));setT(SZ.dx,SZ.y1,23);
setT(254,SZ.y0+4,63);setT(259,SZ.y0+4,63);setT(256,SZ.y0+5,62);setT(257,SZ.y0+5,62);
ENTR.push({x:5,y:14,to:'sanctum',out:[6,15]},{x:6,y:14,to:'sanctum',out:[6,15]},{x:7,y:14,to:'sanctum',out:[6,15]});
