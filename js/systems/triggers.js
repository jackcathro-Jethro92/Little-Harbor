// ---------- triggers (roadmap step 2.3): one table of "when this happens, do that", so a quest is rows, not new code ----------
// Each row of TRIGGERS: {id, when:{...what happens...}, if:{...what must already be true...}, do:[...actions...], repeat:1}.
//   when (one of; leave it out to fire at the next step or morning once `if` is true):
//     area:[x0,y0,x1,y1]  the player steps into that box      zone:n    the player enters hidden room / zone n      talk:'Name'  the player talks to that person
//     day:1               a morning starts (sleeping)         beaten:'group'  an enemy group is beaten (the enemy table, step 3.1, calls enemyBeaten('group'))
//   if (all must be true):  flag:'a'  noflag:'a'  has:{item:n}  gold:n  day:n (this day or later)  quest:'q' (and optional step:n)
//   do (run one after another; a `say` waits until the box is closed):
//     {say:'dlg_id'}  {set:'flag'}  {clear:'flag'}  {give:{item:n}}  {take:{item:n}}  {gold:n}  {toast:'text'}  {quest:['q',step]}  {step:n}  {move:['Name',x,y]}  {msg:'text'}
//   Later steps add their own rows to TACT: scenes (2.4), gates (2.5), world variants (2.6), seagull letters (2.7).
// A row fires once and is remembered in S.story.seen (saved), unless it has repeat:1. Only one row fires at a time; while a box is open nothing fires.
// Story rows are added to this table by their quest's file; keep `id`s unique. Test rows for the smoke test are pushed in by the test itself.
const TRIGGERS=[];
const TACT={
 say:(v,next)=>{if(!runDialogue(v,next))next()},
 set:v=>setFlag(v,1), clear:v=>setFlag(v,0),
 give:v=>{Object.entries(v).forEach(([id,n])=>add(id,n));ui();save()},
 take:v=>{Object.entries(v).forEach(([id,n])=>{S.bag[id]=Math.max(0,count(id)-n);if(!S.bag[id])delete S.bag[id]});ui();save()},
 gold:v=>{S.gold=Math.max(0,S.gold+v);ui();save()},
 toast:v=>toast(v,2600), msg:v=>say(v),
 quest:v=>questSet(v[0],v[1]||0), step:v=>questStep(v),
 move:v=>{const m=storyState().moved=storyState().moved||{};m[v[0]]=[v[1],v[2]];save();placeStoryNpcs()}
};
// people a trigger has moved stay where they were put (saved in S.story.moved, put back at load)
function placeStoryNpcs(){const m=storyState().moved||{};Object.keys(m).forEach(name=>{const n=NPC.find(q=>q.n===name);if(n){n.x=m[name][0];n.y=m[name][1]}})}
placeStoryNpcs();
let trgRunning=false;const trgInside=new Set();
function trgIf(c){if(!c)return true;const s=storyState();
  if(c.flag&&!flag(c.flag))return false;if(c.noflag&&flag(c.noflag))return false;
  if(c.has&&!Object.entries(c.has).every(([id,n])=>count(id)>=n))return false;
  if(c.gold!==undefined&&S.gold<c.gold)return false;if(c.day!==undefined&&S.day<c.day)return false;
  if(c.quest!==undefined&&s.q!==c.quest)return false;if(c.step!==undefined&&s.step!==c.step)return false;return true}
function trgRun(list,i,done){if(i>=list.length){trgRunning=false;if(done)done();return}
  const a=list[i],k=Object.keys(a).find(q=>TACT[q]);const next=()=>trgRun(list,i+1,done);if(!k){next();return}
  if(k==='say')TACT.say(a.say,next);else{TACT[k](a[k]);next()}}
// kind: 'step' (the player moved), 'talk' (ev = the person), 'day' (a morning), 'beaten' (ev = the group). Returns true if a row fired.
function fireTriggers(kind,ev){if(trgRunning||(typeof dlgActive==='function'&&dlgActive()))return false;
  const now=new Set();let hit=null;
  for(const t of TRIGGERS){const w=t.when||{};
    let ok;if(kind==='talk')ok=w.talk!==undefined&&w.talk===ev;else if(kind==='beaten')ok=w.beaten!==undefined&&w.beaten===ev;else if(kind==='day')ok=w.day!==undefined||(!w.area&&!w.zone&&w.talk===undefined&&w.beaten===undefined);
    else{ // a step: areas and zones fire on the way in, not again while the player stays inside; a row with no `when` fires as soon as its `if` is true
      const inside=w.area?(P.x>=w.area[0]&&P.y>=w.area[1]&&P.x<=w.area[2]&&P.y<=w.area[3]):w.zone!==undefined?zoneOf(P.x,P.y)===w.zone:null;
      if(inside!==null){if(inside)now.add(t.id);ok=inside&&!trgInside.has(t.id)}else ok=w.talk===undefined&&w.beaten===undefined&&w.day===undefined}
    if(ok&&!hit&&(t.repeat||!wasSeen('trg:'+t.id))&&trgIf(t.if))hit=t}
  if(kind==='step'){trgInside.clear();now.forEach(i=>trgInside.add(i))}
  if(!hit)return false;if(!hit.repeat)markSeen('trg:'+hit.id);trgRunning=true;trgRun(hit.do||[],0);return true}
const enemyBeaten=group=>fireTriggers('beaten',group);
