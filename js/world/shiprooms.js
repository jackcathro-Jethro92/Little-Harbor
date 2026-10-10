// ---------- the insides of the sloop, schooner and brig: a deck, your quarters and a storage room each (hidden rooms below the sea) ----------
// Made from a table (ROOMTAB in interiors.js, the start of roadmap step 2.9b): SHIPDIM gives each room's size, SHIPFIT what stands where ([tile, column, row] counted from the room's top-left).
// The bigger the ship, the bigger the rooms, the more crates (storage space: `store` in each boat's item row) and the nicer the furnishings. Zones 11 to 19, rows 282 and down.
// Tiles: 125 deck planks (walk), 126 rail, 127 mast base, 128 ship's wheel (use it to take the helm), 129 bed (use it to sleep), 130 crate (use it to open the storage), 131 cabin floor (walk),
// 132 cabin wall, 133 table or desk, 134 stool, 135 lantern, 136 rug (walk), 137 bookshelf, 138 barrel, 139 chest. Doors are tile 23, joined with THROUGH (js/world/mountaintown.js).
const SHIPNAMES=['sloop','schooner','brig'],SHIPR={};
const SHIPDIM={sloop:{deck:[9,6],quarters:[7,5],storage:[7,5]},schooner:{deck:[11,7],quarters:[9,6],storage:[9,6]},brig:{deck:[13,8],quarters:[11,7],storage:[11,7]}};
const SHIPFIT={
 sloop:{quarters:[[129,1,1],[133,5,1],[134,5,2],[135,3,0]],storage:[[130,1,1],[130,2,1],[138,5,1],[135,3,0]]},
 schooner:{quarters:[[129,1,1],[129,2,1],[133,6,1],[134,6,2],[137,4,0],[136,3,3],[136,4,3],[135,2,0],[135,6,0]],storage:[[130,1,1],[130,2,1],[130,6,1],[130,7,1],[138,1,3],[138,7,3],[135,4,0]]},
 brig:{quarters:[[129,1,1],[129,2,1],[129,1,2],[129,2,2],[133,7,1],[133,8,1],[134,7,2],[137,4,0],[137,5,0],[139,9,1],[139,9,2],[136,4,3],[136,5,3],[136,6,3],[136,4,4],[136,5,4],[136,6,4],[135,3,0],[135,8,0]],
  storage:[[130,1,1],[130,2,1],[130,3,1],[130,1,2],[130,7,1],[130,8,1],[130,9,1],[130,9,2],[138,1,4],[138,9,4],[139,5,1],[135,3,0],[135,7,0]]}};
{let z=11,slot=0;
 SHIPNAMES.forEach((ship,lv)=>{SHIPR[ship]={};['deck','quarters','storage'].forEach(kind=>{const[w,h]=SHIPDIM[ship][kind],x0=160+slot*15,y0=282;slot++;
   const r={z:z++,x0,y0,x1:x0+w-1,y1:y0+h-1,dx:x0+(w>>1),lv,ship,kind,w,h};SHIPR[ship][kind]=r;ROOMTAB.push(r);
   const put=(t,x,y)=>setT(x0+x,y0+y,t);
   if(kind==='deck'){rect(x0,y0,r.x1,r.y1,(x,y)=>setT(x,y,125));
     for(let x=x0;x<=r.x1;x++){setT(x,y0,132);setT(x,y0+1,132);setT(x,r.y1,126)}for(let y=y0+2;y<=r.y1;y++){setT(x0,y,126);setT(r.x1,y,126)}   // the deckhouse along the top, the rail round the rest
     put(23,(w>>1)-2,1);put(23,(w>>1)+2,1);                                                                                                      // doors: left to the quarters, right to the storage room
     const masts=ship==='sloop'?[[w>>1,2]]:[[3,h-4],[w-4,h-4]];masts.forEach(([x,y])=>put(127,x,y));put(128,w>>1,h-2);                           // masts and the wheel at the stern
     put(138,1,h-2);put(138,w-2,h-2)}
   else{rect(x0,y0,r.x1,r.y1,(x,y)=>setT(x,y,(x===x0||x===r.x1||y===y0||y===r.y1)?132:131));put(23,w>>1,h-1);SHIPFIT[ship][kind].forEach(([t,x,y])=>put(t,x,y))}})});
 // the doors: deck <-> quarters and deck <-> storage
 SHIPNAMES.forEach(ship=>{const D=SHIPR[ship].deck,Q=SHIPR[ship].quarters,S2=SHIPR[ship].storage,dl=D.x0+(D.w>>1)-2,dr=D.x0+(D.w>>1)+2;
  THROUGH.push({x:dl,y:D.y0+1,out:[Q.dx,Q.y1-1],f:'u',msg:'You duck into your quarters.'},{x:Q.dx,y:Q.y1,out:[dl,D.y0+2],f:'d',msg:'You step back out on deck.'},
               {x:dr,y:D.y0+1,out:[S2.dx,S2.y1-1],f:'u',msg:'You go down to the storage room.'},{x:S2.dx,y:S2.y1,out:[dr,D.y0+2],f:'d',msg:'You climb back up to the deck.'})})}
