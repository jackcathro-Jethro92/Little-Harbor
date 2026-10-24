// ---------- stats: health, stamina, skill levels and XP ----------
const STEP_MS={walk:160,sail:90},GLIDE={walk:.085,sail:.14},SWIFT_MS={walk:110,sail:60},SWIFT_GLIDE={walk:.12,sail:.2}; // SWIFT_* is the old normal speed, now what a swiftness potion gives
// Enchanted boots (a Quest 4 reward) speed up walking only, between the normal and the swiftness-potion speed; the potion wins if both apply. (Jack will tune the boots' speed later.)
const BOOT_MS=135,BOOT_GLIDE=.1,swift=()=>S.buff>Date.now(),boots=()=>!sail&&fx('speed')>0;
// Out of stamina you move much more slowly (EXH_*); a swiftness potion brings you back to the normal pace, and only sleep, food or a tonic refill the bar.
const EXH_MS={walk:300,sail:170},EXH_GLIDE={walk:.05,sail:.08},tired=()=>S.sta<=0;
const stepMs=()=>tired()?(swift()?STEP_MS:EXH_MS)[sail?'sail':'walk']:swift()?SWIFT_MS[sail?'sail':'walk']:boots()?BOOT_MS:STEP_MS[sail?'sail':'walk'],glideAmt=()=>tired()?(swift()?GLIDE:EXH_GLIDE)[sail?'sail':'walk']:swift()?SWIFT_GLIDE[sail?'sail':'walk']:boots()?BOOT_GLIDE:GLIDE[sail?'sail':'walk'];
// // movement: time between steps while a direction is held, and how fast the sprite slides to the next tile (walking is half the boat's speed)
const MAXHP=50,MAXSTA=100,STAM={walk:0,sail:0,cast:2,swing:5,storm:.5,gather:3,forage:1.5}; // stamina costs; storm is for the weather system later
const lvl=id=>{const x=S.xp[id]||0;let l=0;while(l<10&&x>=LV[l])l++;return l};
const fx=k=>['ring','amulet','boots','armour','helmet'].reduce((a,s)=>a+(((ITEMS[S.eq[s]]||{}).fx||{})[k]||0),0); // enchanted jewellery bonuses (ITEMS[..].fx)
const maxHp=()=>MAXHP+4*lvl('combat')+fx('hp')+((S.boost||{}).hp||0),maxSta=()=>MAXSTA+fx('sta')+((S.boost||{}).sta||0);   // (S.boost: Astrid's vigour draughts, for good)
function gainXp(id,n){n=Math.round(n*(1+fx('xp'))*100)/100;const k=SKILLS.find(q=>q.id===id),b=lvl(id);S.xp[id]=(S.xp[id]||0)+n;const a=lvl(id);
  if(n>=1&&a===b)toast('+'+n+' '+k.n+' XP');
  if(a>b){if(id==='combat')S.hp=Math.min(maxHp(),S.hp+4*(a-b));toast('★ '+k.n+' level '+a+'! ★',2800);
    if(WEAPON_MOVES[id]&&!(typeof BATTLE!=='undefined'&&BATTLE)){const nw=WEAPON_MOVES[id].filter(([,r])=>r>b&&r<=a).map(([i])=>ATTACKS[i].n);if(nw.length)setTimeout(()=>toast('New attack learned: '+nw.join(' and ')+'!',3600),1200)}   // (in a battle the battle screen announces it)
say(k.n+' reached level '+a+'! '+k.perk(a));save()}
  ui()}
const ownTier=k=>Math.max(0,...LIST(k).map((id,i)=>count(id)?i:-1)),TOOLSLOTS=['rod','pickaxe','axe','knife'],eq=k=>TOOLSLOTS.includes(k)&&S.eq.tool!==k?undefined:ITEMS[S.eq[k]],isWorn=id=>{const sl=slotOf(id);return S.eq[sl]===id&&(!TOOLSLOTS.includes(sl)||S.eq.tool===sl)},tier=k=>LIST(k).indexOf(S.eq[k]);
function spend(n){n*=1-fx('thrift');const was=S.sta;S.sta=Math.max(0,S.sta-n);if(!S.sta&&was>0)say('You are exhausted and move slowly. Sleep, eat or drink a tonic to recover.');ui()}
