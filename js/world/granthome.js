// ---------- the grand house's insides (Quest 10, Haven Isle): six furnished rooms in one hidden room below the sea ----------
// HG (x 286-317, y 264-287, set in interiors.js) counts as "home" everywhere the single home room does (zone 1: sleeping, stations anywhere, the door out), so the home system needs no new rules. Rooms are joined by open
// doorways (tile 155, walkable), not teleports. Plan (columns x 287-296 | 298-305 | 307-316, walls at x 286, 297, 306 and 317; rows y 266-274 | 276-286, walls at y 264-265, 275 and 287):
//   top row:    bathroom (wood: a long wooden tub, wash basin, lantern) | living room (tatami: tokonoma alcove, sunken hearth, low table with cushions, rugs, vases) | bedroom (tatami: two futons, chest of drawers, shelves)
//   bottom row: kitchen (wood: counters with sink and stove, a table with cushions, shelves) | entrance hall (wood: shoe racks, rugs, lanterns; the front door in the bottom wall) | workshop (tatami: shelves, a big table, plenty of bare floor for stations)
// Doorways: bathroom-living, living-bedroom, kitchen-hall, hall-workshop on the vertical walls; bathroom-kitchen, living-hall (two wide) and bedroom-workshop on the horizontal wall. Tiles 153-171: see js/render/granthome.js.
// Stations can stand anywhere in any room (the usual home rule); you sleep anywhere inside (Sleep button).
WK.push(153,155,165);
{const Z=HG,put=(t,x,y)=>setT(x,y,t),fill=(x0,y0,x1,y1,t)=>rect(x0,y0,x1,y1,(x,y)=>setT(x,y,t));
 fill(Z.x0,Z.y0,Z.x1,Z.y1,154);
 [[287,266,296,274,153],[298,266,305,274,108],[307,266,316,274,108],[287,276,296,286,153],[298,276,305,286,153],[307,276,316,286,108]].forEach(([a,b,c,d,t])=>fill(a,b,c,d,t));
 [[297,270],[306,270],[297,281],[306,281],[292,275],[301,275],[302,275],[311,275]].forEach(([x,y])=>put(155,x,y));
 put(169,Z.dx,Z.y1);                                                                                          // the front door
 [288,292,295,299,304,310,314].forEach(x=>put(167,x,265));[292,296,310,314].forEach(x=>put(167,x,287));put(163,301,265);   // windows and the tokonoma alcove
 // bathroom
 [288,289,290].forEach(x=>put(161,x,267));[294,295].forEach(x=>put(170,x,267));put(166,296,267);put(162,295,273);put(168,288,273);put(157,292,271);
 // living room
 [[301,268,171],[301,270,156],[302,270,156],[300,270,157],[303,270,157],[301,272,157],[302,272,157],[299,267,162],[304,267,162],[298,273,166],[305,273,166]].forEach(([x,y,t])=>put(t,x,y));
 for(let x=300;x<=303;x++){if(at(x,269)===108)put(165,x,269);if(at(x,271)===108)put(165,x,271)}
 // bedroom
 [[309,267],[309,268],[313,267],[313,268]].forEach(([x,y])=>put(158,x,y));[315,316].forEach(x=>put(159,x,266));[308,309].forEach(x=>put(168,x,266));put(166,311,267);put(162,311,273);put(166,315,273);
 for(let x=310;x<=312;x++)for(let y=270;y<=272;y++)put(165,x,y);
 // kitchen
 for(let x=288;x<=293;x++)put(160,x,276);[[292,281],[293,281]].forEach(([x,y])=>put(156,x,y));[[291,281],[294,281],[292,283],[293,283]].forEach(([x,y])=>put(157,x,y));put(168,288,277);put(168,288,278);put(159,288,284);put(162,295,277);put(166,295,285);
 // entrance hall
 [299,300].forEach(x=>put(164,x,285));[298,305].forEach(x=>put(166,x,285));put(162,304,285);put(162,298,277);
 for(let y=276;y<=285;y++){put(165,301,y);put(165,302,y)}
 // workshop: shelves along the top and a big table, with the middle left bare for stations
 for(let x=308;x<=311;x++)put(168,x,276);[[313,280],[314,280],[313,281],[314,281]].forEach(([x,y])=>put(156,x,y));[[312,280],[315,280],[313,282],[314,282]].forEach(([x,y])=>put(157,x,y));
 [277,278].forEach(y=>put(159,316,y));[308,316].forEach(x=>put(166,x,285));put(162,308,278)}
