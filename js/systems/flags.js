// ---------- story flags: yes/no switches that quests will flip, and things that happen overnight because of them ----------
// S.flags (saved) holds them, e.g. S.flags.pirates_called (a quest sets this) and S.flags.pirates_here (set by the game at the next sleep).
// For testing, a link ending in  ?flags=pirates_here  (several allowed, comma separated) turns flags on for that visit without saving them.
const FORCE_FLAGS=new Set((new URLSearchParams(location.search).get('flags')||'').split(',').filter(Boolean));
const flag=n=>FORCE_FLAGS.has(n)||!!(S.flags&&S.flags[n]);
const setFlag=(n,v=1)=>{S.flags=S.flags||{};S.flags[n]=v?1:0;save()};
// ---- story state (roadmap 2.1): S.flags above are the story's yes/no switches; S.story says where the player is in the quests. All of it is saved and survives sleeping and reloading. ----
// S.story = { q: the current quest id (or null), step: the step inside it, seen: ids of scenes, letters and talks already shown }. Old saves get the default.
const storyState=()=>{const s=S.story=S.story||{};if(!Array.isArray(s.seen))s.seen=[];if(s.step===undefined)s.step=0;if(s.q===undefined)s.q=null;if(!Array.isArray(s.done))s.done=[];return s};
const questSet=(q,step=0)=>{const s=storyState();s.q=q;s.step=step;save()};
const questStep=n=>{storyState().step=n;save()};
// questDone(id) finishes a quest: it goes on the Finished list in the quest log and stops being the current one
const questDone=id=>{const s=storyState();if(!s.done.includes(id))s.done.push(id);if(s.q===id){s.q=null;s.step=0}save()};
const wasSeen=id=>storyState().seen.includes(id);
const markSeen=id=>{const s=storyState();if(!s.seen.includes(id)){s.seen.push(id);save()}};
// overnight arrivals: when `when` is set and `set` is not yet, sleeping sets it, runs `apply` (which changes the world) and shows `msg`. Add a row for each future arrival.
const ARRIVALS=[
 {when:'pirates_called',set:'pirates_here',msg:'In the night, three ships dropped anchor off the volcano island. Pirates have come ashore!',apply:()=>applyPirates(true)}
];
function dailyEvents(){const out=[];ARRIVALS.forEach(a=>{if(flag(a.when)&&!flag(a.set)){setFlag(a.set,1);a.apply();out.push(a.msg)}});return out.join(' ')}
