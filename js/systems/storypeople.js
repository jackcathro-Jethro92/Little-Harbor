// ---------- people by story (roadmap step 2.9): where a person stands, what they say and whether they are there at all can depend on the story ----------
// STORY_PEOPLE is a table. A row is {npc:'Name', if:{...}, at:[x,y], f:'d', hide:1, say:['line', ...], dlg:'dialogue_id'}. For each person the FIRST row (top to bottom) whose `if` is true is used; with no matching row
// they are as they were built (so put the specific rows first and, for someone who only appears in the story, end with a plain {npc:'Name', hide:1}).
//   if    the same conditions as a trigger (js/systems/triggers.js): flag, noflag, has, gold, day, quest (and step)
//   at    where they stand, in world tile coordinates (the numbers on the map), and f the way they face; they also wander round that new spot
//   hide  they are not there: not drawn, not in the way, cannot be spoken to
//   say   their ordinary chat lines are replaced by these          dlg   talking to them runs this dialogue (js/ui/dialogue.js) instead of the chat or the shop
// The table is checked at load, whenever a flag or the quest changes, when a morning starts and as the player steps, and only a person whose row really changed is touched. Nothing is saved except the
// flags and quest the rows read, so a reload gives the same result. Someone who would land on the player or a wall is put on the nearest free tile.
// Words in `say` and in dialogues are placeholders until Jack's own lines are added (STORY_TEXT.md, JACKS_LINES.txt); existing lines are never changed.
const STORY_PEOPLE=[];
function applyStoryPeople(){let changed=false;const byNpc={};STORY_PEOPLE.forEach((r,i)=>{(byNpc[r.npc]=byNpc[r.npc]||[]).push([i,r])});
  Object.keys(byNpc).forEach(name=>{const n=NPC.find(q=>q.n===name);if(!n)return;
    if(!n._b)n._b={x:n.x,y:n.y,hx:n.hx,hy:n.hy,f:n.f,say:n.say};
    const hit=byNpc[name].find(([,r])=>trgIf(r.if)),id=hit?hit[0]:-1;if(n._row===id)return;n._row=id;changed=true;const r=hit?hit[1]:null,b=n._b;
    n.hidden=r&&r.hide?1:0;n.say=r&&r.say?r.say:b.say;n.dlg=r&&r.dlg?r.dlg:null;
    let x=b.x,y=b.y,hx=b.hx,hy=b.hy,f=b.f;if(r&&r.at){x=hx=r.at[0];y=hy=r.at[1];f=r.f||f}else if(r&&r.f)f=r.f;
    n.f=f;n.x=x;n.y=y;n.hx=hx;n.hy=hy;
    if(!n.hidden&&(typeof P!=='undefined')&&((P.x===x&&P.y===y)||!WK.includes(at(x,y))||NPC.some(q=>q!==n&&!q.hidden&&q.x===x&&q.y===y))){
      const s=nearestTile(x,y,(a,c)=>WK.includes(at(a,c))&&!NPC.some(q=>q!==n&&!q.hidden&&q.x===a&&q.y===c)&&!(P.x===a&&P.y===c));if(s){n.x=n.hx=s[0];n.y=n.hy=s[1]}}});
  return changed}
