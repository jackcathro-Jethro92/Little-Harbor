// ---------- the Haven house's insides (Quest 10, Haven Isle): nine furnished rooms in one hidden room below the sea ----------
// Rebuilt in playtest #4 (P76). HG (x 292-319, y 264-295, set in interiors.js) counts as "home" everywhere the cottage's room does (zone 1: sleeping, stations anywhere, the door out), so the home system needs no new rules. The rooms
// are joined by open doorways (tile 155, walkable), not teleports. Three columns (x 293-300 | 302-309 | 311-318, walls at x 292, 301, 310 and 319) and three rows (y 266-274 | 276-284 | 286-294, walls at y 264-265, 275, 285 and 295):
//   top row:     bedroom (tatami: a double bed, bedside lamps, chests, shelves, a mirror, garden windows) | wardrobe (tatami: four mannequins that keep armour sets, wardrobe cabinets, a mirror) | bathroom (wood: a long tub, basin)
//   middle row:  kitchen (wood: counters, a table, and a COOKING STATION built in) | living room (tatami: tokonoma alcove, sunken hearth, low table with cushions, rugs) | workshop (wood: a WORKBENCH and a FORGE built in, tool racks, a big table)
//   bottom row:  potion room (wood: an ALCHEMY STATION built in, potion shelves, herb racks, garden windows) | entrance hall (wood: shoe racks, rugs, lanterns; the front door in the bottom wall) | storage room (wood: fourteen crates)
// Every room also has a crate or two. A crate (tile 175) opens the storage screen (js/ui/storage.js); a mannequin (tile 176) keeps an armour set (js/ui/mannequin.js). The built-in stations are real stations marked `fixed:1` in S.placed
// (put there by haveFixtures() in js/systems/home.js; they cannot be picked up or moved). Windows (167 shoji, 177 garden view) throw light onto the floor below them (js/render/granthome.js).
// Doorways: bedroom-wardrobe, wardrobe-bathroom, kitchen-living, living-workshop, potion-hall, hall-storage on the vertical walls (x 301 and 310); bedroom-kitchen, wardrobe-living (two wide), bathroom-workshop, kitchen-potion,
// living-hall (two wide), workshop-storage on the horizontal walls (y 275 and 285). Tiles 153-171 and 175-183: see js/render/granthome.js.
// Stations can stand anywhere on a free floor in any room (the usual home rule); you sleep anywhere inside (Sleep button).
WK.push(153,155,165);
const mannIndex=x=>(x-303)>>1;   // the four mannequins stand at x 303, 305, 307 and 309 in the wardrobe: 0 to 3
const HG_COL=[[293,300],[302,309],[311,318]],HG_ROW=[[266,274],[276,284],[286,294]];
const HG_CRATES=[];   // where every storage crate stands, [x, y]; each is a separate store (S.crates, keyed "x,y")
const HG_FIXTURES=[{id:'cooking_station',x:300,y:279},{id:'standard_bench',x:313,y:278},{id:'forge',x:317,y:278},{id:'alchemy_station',x:296,y:289}];   // built-in stations
{const Z=HG,put=(t,x,y)=>setT(x,y,t),fill=(x0,y0,x1,y1,t)=>rect(x0,y0,x1,y1,(x,y)=>setT(x,y,t));
 fill(Z.x0,Z.y0,Z.x1,Z.y1,154);
 // the floors: wood in the bathroom, kitchen, workshop, potion room, hall and storage room (tile 153); tatami in the bedroom, wardrobe and living room (tile 108)
 const floors=[[0,0,108],[1,0,108],[2,0,153],[0,1,153],[1,1,108],[2,1,153],[0,2,153],[1,2,153],[2,2,153]];
 floors.forEach(([c,r,t])=>fill(HG_COL[c][0],HG_ROW[r][0],HG_COL[c][1],HG_ROW[r][1],t));
 // doorways
 [[301,270],[310,270],[301,280],[310,280],[301,290],[310,290],[297,275],[305,275],[306,275],[314,275],[297,285],[305,285],[306,285],[314,285]].forEach(([x,y])=>put(155,x,y));
 put(169,Z.dx,Z.y1);                                                                                          // the front door
 // windows on the outside walls: shoji along the north wall (a garden view in the bedroom) and the garden windows on the south wall, which looks onto the front garden
 [[296,265,177],[299,265,177],[304,265,167],[307,265,167],[313,265,167],[316,265,167],[295,295,177],[298,295,177],[303,295,167],[307,295,167],[314,295,167]].forEach(([x,y,t])=>put(t,x,y));
 put(163,303,275);put(163,308,275);   // tokonoma alcoves (hanging scrolls) on the living room's north wall, either side of its doorway to the wardrobe
 // the crate helper: every crate is registered, so the storage screen can find it
 const crate=(x,y)=>{put(175,x,y);HG_CRATES.push([x,y])};
 // bedroom (293-300 x 266-274)
 [[295,267],[296,267],[295,268],[296,268]].forEach(([x,y])=>put(158,x,y));[[294,267],[297,267]].forEach(([x,y])=>put(181,x,y));          // a double bed with a lamp each side
 [[293,266],[300,266]].forEach(([x,y])=>put(159,x,y));[[300,271],[300,272]].forEach(([x,y])=>put(168,x,y));put(182,293,270);put(162,293,273);put(166,300,273);crate(300,274);
 for(let x=294;x<=299;x++)for(let y=270;y<=272;y++)put(165,x,y);                                                                                // a rug
 // wardrobe (302-309 x 266-274): four mannequins along the back, cabinets down both sides, a mirror, two crates
 [303,305,307,309].forEach(x=>put(176,x,267));[[302,268],[302,272],[302,273],[309,268],[309,272],[309,273]].forEach(([x,y])=>put(178,x,y));put(182,305,271);put(182,306,271);
 for(let x=303;x<=308;x++)for(let y=269;y<=270;y++)put(165,x,y);put(166,302,266);put(166,309,266);crate(302,274);crate(309,274);
 // bathroom (311-318 x 266-274)
 [312,313,314].forEach(x=>put(161,x,267));put(166,316,267);put(170,318,267);put(182,317,267);put(162,318,273);put(168,311,272);put(168,311,273);crate(311,274);
 for(let x=313;x<=316;x++)for(let y=270;y<=272;y++)put(165,x,y);
 // kitchen (293-300 x 276-284): counters along the north wall (the doorway at 297 stays clear), a table, shelves; the cooking station is built in at (300,279)
 [293,294,295,296,298,299,300].forEach(x=>put(160,x,276));[[293,277],[293,278]].forEach(([x,y])=>put(168,x,y));[[295,281],[296,281],[297,281]].forEach(([x,y])=>put(156,x,y));
 [[294,281],[298,281],[296,283],[297,283]].forEach(([x,y])=>put(157,x,y));put(166,293,284);put(162,300,283);crate(293,283);crate(294,284);put(180,300,277);
 // living room (302-309 x 276-284)
 put(171,305,278);[[304,280],[305,280],[306,280]].forEach(([x,y])=>put(156,x,y));[[303,280],[307,280],[304,282],[306,282]].forEach(([x,y])=>put(157,x,y));
 for(let x=303;x<=308;x++)for(let y=279;y<=283;y++)if(at(x,y)===108)put(165,x,y);
 [[309,276],[309,277]].forEach(([x,y])=>put(168,x,y));put(166,302,276);put(166,309,284);put(162,302,278);put(162,309,279);crate(302,284);
 // workshop (311-318 x 276-284): tool racks and shelves, a big table; the workbench (2 wide) and the forge are built in at (313,278) and (317,278)
 [311,312,316,317,318].forEach(x=>put(183,x,276));[[318,279],[318,280],[318,281]].forEach(([x,y])=>put(168,x,y));[[313,282],[314,282],[315,282]].forEach(([x,y])=>put(156,x,y));
 [[312,282],[316,282]].forEach(([x,y])=>put(157,x,y));put(166,311,277);crate(311,284);crate(312,284);crate(318,284);
 // potion room (293-300 x 286-294): shelves of bottles and herb racks along the north wall (the doorway at 297 stays clear); the alchemy station is built in at (296,289)
 [293,294,295,296].forEach(x=>put(179,x,286));[298,299].forEach(x=>put(180,x,286));put(179,300,286);[[293,290],[294,290],[293,291]].forEach(([x,y])=>put(168,x,y));[[298,290],[299,290]].forEach(([x,y])=>put(156,x,y));
 [[298,291],[299,291]].forEach(([x,y])=>put(157,x,y));put(166,300,293);put(162,293,293);crate(293,294);crate(294,294);
 // entrance hall (302-309 x 286-294): shoe racks beside the door, lanterns, a runner rug up the middle
 [[303,293],[304,293],[307,293],[308,293]].forEach(([x,y])=>put(164,x,y));[[302,294],[309,294]].forEach(([x,y])=>put(166,x,y));put(162,302,288);put(162,309,288);crate(309,286);
 for(let y=287;y<=293;y++){put(165,305,y);put(165,306,y)}put(165,304,290);put(165,307,290);
 // storage room (311-318 x 286-294): two rows of crates with aisles, and two more in the corners
 for(let x=312;x<=317;x++){crate(x,288);crate(x,290)}crate(318,286);crate(318,294);put(168,311,293);put(168,311,294);put(166,311,286)}
