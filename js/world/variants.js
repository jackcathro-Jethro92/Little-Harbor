// ---------- world variants (roadmap step 2.6): places that look and work differently depending on a story switch (flag) ----------
// One table, VARIANTS. A row is {id, flag, apply:(on)=>{...}} for a place that is built by its own code (the pirate camp, the damaged Sky temple), or {id, flag, tiles:[[x,y,tile],...]} for a simple swap:
// while `flag` is set those cells show `tile`, and the first look of each cell comes back when it is not. The game applies every row at load (so a saved flag keeps its variant) and again whenever
// setFlag() changes a flag, but only re-applies a row whose state really changed, so it is safe and cheap. A trigger's {set:'flag'} therefore changes the world live, and so does sleeping.
// Never stuck: after any change, a player, boat or person standing on a tile that now blocks them is moved to the nearest tile they can stand on (unstick). Tile numbers are never renumbered.
// Planned rows, added as their art and quests arrive: festival decorations (the draft's opening), the village under attack (Quest 7), the Temple Tower sealed / hidden stair open, the island risen from the sea (Quest 10).
// Add a row here; the file that builds a place only needs to offer apply(on). Test links: ?flags=pirates_here,sky_damaged show a variant for that visit without saving it.
const VARIANTS=[
 {id:'pirate_camp',flag:'pirates_here',apply:on=>applyPirates(on)},
 {id:'sky_temple',flag:'sky_damaged',apply:on=>applySky(on)}
];
const VARIANT_ORIG={},variantOn={};
function applyTileVariant(v,on){v.tiles.forEach(([x,y,t])=>{const k=y*MW+x;if(VARIANT_ORIG[k]===undefined)VARIANT_ORIG[k]=M[k];M[k]=on?t:VARIANT_ORIG[k]})}
// the nearest tile (searching outwards) that `ok` accepts, or null
function nearestTile(x,y,ok){for(let r=0;r<=8;r++)for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(Math.max(Math.abs(i),Math.abs(j))===r&&ok(x+i,y+j))return[x+i,y+j];return null}
function unstick(){const stand=(x,y)=>WK.includes(at(x,y))&&!npcAt(x,y)&&!placedAt(x,y)&&!(B.x===x&&B.y===y)&&!(P.x===x&&P.y===y),water=(x,y)=>at(x,y)===0&&x>=0&&y>=0&&x<MW&&y<WH&&!npcAt(x,y);
  const inRoomNow=zoneOf(P.x,P.y)!==0;
  if(sail){if(at(P.x,P.y)!==0){const n=nearestTile(P.x,P.y,water);if(n){P.x=P.rx=B.x=n[0];P.y=P.ry=B.y=n[1]}}}
  else if(!WK.includes(at(P.x,P.y))){const n=nearestTile(P.x,P.y,(x,y)=>stand(x,y)&&(inRoomNow||zoneOf(x,y)===0));if(n){P.x=P.rx=n[0];P.y=P.ry=n[1]}}
  if(!sail&&at(B.x,B.y)!==0){const n=nearestTile(B.x,B.y,water);if(n){B.x=n[0];B.y=n[1]}}
  NPC.forEach(q=>{if(!WK.includes(at(q.x,q.y))){const n=nearestTile(q.x,q.y,(x,y)=>WK.includes(at(x,y))&&!npcAt(x,y)&&!(P.x===x&&P.y===y));if(n){q.x=n[0];q.y=n[1]}}})}
function applyVariants(atLoad){let changed=false;
  VARIANTS.forEach(v=>{const on=!!flag(v.flag);if(variantOn[v.id]===on)return;variantOn[v.id]=on;changed=true;if(v.apply)v.apply(on);else if(v.tiles)applyTileVariant(v,on)});
  if(changed){if(typeof groundDirty==='function')groundDirty();if(!atLoad)unstick()}return changed}
applyVariants(true);   // at load the player is not placed yet, so nobody can be stuck
