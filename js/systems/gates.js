// ---------- gates and locks (roadmap step 2.5): places that stay blocked until a story switch (flag) is set ----------
// A gate is a row of GATES: {id, flag, cells:[[x,y],...], closed:tile, msg:'what you read when you try it', needs:{eq:'pickaxe'} or {item:'id'}, opens:'what you read when it opens'}.
// While `flag` is not set the cells are swapped for the tile `closed` (a tile that blocks, drawn by the game's own art: 36 boulder, 12 stone wall, 54 jagged rock in the sea, 101 pirate-ship water, 73 vault rock ...);
// when the flag is set the first look of each cell is put back for good. Because it only swaps tiles, walking, sailing and the map follow with no new rules. The state is simply the flag, so it is saved
// and rebuilt at load (and the same way a trigger's {set:'flag'} opens it live). `needs` lets the player open it by facing it and pressing Use (with that equipped tool, or with that item in the bag): the
// gate then sets its own flag; without `needs` it only opens when a quest or trigger sets the flag. A cell the player or a person is standing on is left open until they step off (nobody gets walled in).
// Add a gate by adding a row. Do not use tile numbers that are rooms' doors; keep the closed tile a blocking one (not in WK). Nothing in the game uses a gate yet; quests will.
const GATES=[];
const GATE_ORIG={};let gatePending=false;
const gateKey=(x,y)=>y*MW+x;
function applyGates(){let pend=false;
  GATES.forEach(g=>{g.cells.forEach(([x,y],i)=>{const open=cellOpen(g,i),k=gateKey(x,y);if(GATE_ORIG[k]===undefined)GATE_ORIG[k]=at(x,y);
    if(open)M[k]=GATE_ORIG[k];
    else if((P.x===x&&P.y===y)||(B.x===x&&B.y===y)||npcAt(x,y)||(typeof animalAt==='function'&&animalAt(x,y)))pend=true;
    else M[k]=g.closed})});
  gatePending=pend;if(typeof groundDirty==='function')groundDirty()}
// a gate can also have `cf:['flag_a','flag_b',...]`, one switch per cell, so each cell opens on its own (the rockslide's rocks break one at a time); the gate's own flag is set once every cell is open, and setting it opens every cell
const cellOpen=(g,i)=>flag(g.flag)||!!(g.cf&&flag(g.cf[i]));
const gateCell=(x,y)=>{for(const g of GATES){const i=g.cells.findIndex(c=>c[0]===x&&c[1]===y);if(i>=0&&!cellOpen(g,i))return[g,i]}return null};
const gateAt=(x,y)=>(gateCell(x,y)||[])[0];
// facing a closed gate and pressing Use: it opens if the player has what it needs, otherwise it says why not. Returns true if it handled the press.
function useGate(x,y){const gc=gateCell(x,y);if(!gc||npcAt(x,y))return false;const[g,i]=gc;
  const n=g.needs,ok=n&&((n.eq&&S.eq[n.eq])||(n.item&&count(n.item)>0));
  if(ok){if(g.cf){setFlag(g.cf[i],1);const left=g.cf.filter(f=>!flag(f)).length;if(!left)setFlag(g.flag,1);const m=left?(g.part||'It breaks!').replace('{n}',left):g.opens;if(m)say(m);toast(m||'It opens.',2200);applyGates()}
    else{setFlag(g.flag,1);if(g.opens)say(g.opens);toast(g.opens||'It opens.',2200)}
    if(g.fire)setTimeout(()=>fireTriggers('step'),1200)}else say(g.msg||'It is blocked.');return true}
applyGates();
