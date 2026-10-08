// ---------- story flags: yes/no switches that quests will flip, and things that happen overnight because of them ----------
// S.flags (saved) holds them, e.g. S.flags.pirates_called (a quest sets this) and S.flags.pirates_here (set by the game at the next sleep).
// For testing, a link ending in  ?flags=pirates_here  (several allowed, comma separated) turns flags on for that visit without saving them.
const FORCE_FLAGS=new Set((new URLSearchParams(location.search).get('flags')||'').split(',').filter(Boolean));
const flag=n=>FORCE_FLAGS.has(n)||!!(S.flags&&S.flags[n]);
const setFlag=(n,v=1)=>{S.flags=S.flags||{};S.flags[n]=v?1:0;save()};
// overnight arrivals: when `when` is set and `set` is not yet, sleeping sets it, runs `apply` (which changes the world) and shows `msg`. Add a row for each future arrival.
const ARRIVALS=[
 {when:'pirates_called',set:'pirates_here',msg:'In the night, three ships dropped anchor off the volcano island. Pirates have come ashore!',apply:()=>applyPirates(true)}
];
function dailyEvents(){const out=[];ARRIVALS.forEach(a=>{if(flag(a.when)&&!flag(a.set)){setFlag(a.set,1);a.apply();out.push(a.msg)}});return out.join(' ')}
