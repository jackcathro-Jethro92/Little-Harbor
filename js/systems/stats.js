// ---------- stats: health, stamina, skill levels and XP ----------
const MAXHP=50,MAXSTA=100,STAM={walk:.08,sail:.08,cast:2,swing:5,storm:.5,gather:3,forage:1.5}; // stamina costs; storm is for the weather system later
const lvl=id=>{const x=S.xp[id]||0;let l=0;while(l<10&&x>=LV[l])l++;return l};
const maxHp=()=>MAXHP+4*lvl('combat'),maxSta=()=>MAXSTA;
function gainXp(id,n){const k=SKILLS.find(q=>q.id===id),b=lvl(id);S.xp[id]=(S.xp[id]||0)+n;const a=lvl(id);
  if(n>=1&&a===b)toast('+'+n+' '+k.n+' XP');
  if(a>b){if(id==='combat')S.hp=Math.min(maxHp(),S.hp+4*(a-b));toast('★ '+k.n+' level '+a+'! ★',2800);say(k.n+' reached level '+a+'! '+k.perk(a));save()}
  ui()}
const ownTier=k=>Math.max(0,...LIST(k).map((id,i)=>count(id)?i:-1)),eq=k=>ITEMS[S.eq[k]],tier=k=>LIST(k).indexOf(S.eq[k]);
function spend(n){const was=S.sta;S.sta=Math.max(0,S.sta-n);if(!S.sta&&was>0)say('You are exhausted! Sleep on the boat to recover.');ui()}
