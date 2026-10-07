// ---------- the Gladiators' Arena: Arena Master Dorn and one-on-one bouts (opponents are in BOUTS, js/data/arena.js) ----------
const AR={on:false,x:0,y:0,hp:1,max:1,cd:0,hitAt:0,pois:0,b:0,f:'d',n:'',dmg:0,look:{}};
const ARENA_START=[AZ.dx,AZ.y0+4];
function arenaMenu(){
  if(AR.on)return say('Dorn: Finish the bout you are in!');
  const unlocked=Math.min(S.arena,BOUTS.length-1),o=[];
  for(let i=0;i<=unlocked;i++)o.push('Bout '+(i+1)+': '+BOUTS[i].n);o.push('Cancel');
  menu("Arena Master Dorn",o,c=>{const i=o.indexOf(c);if(i>=0&&i<=unlocked)arenaStart(i)})}
function arenaStart(i){
  if(!eq('weapon'))return say('Dorn: You need a weapon, friend. Bram or Garrick will sell you one.');
  const b=BOUTS[i];Object.assign(AR,{on:true,b:i,n:b.n,hp:b.hp,max:b.hp,dmg:b.dmg,look:b.look,x:ARENA_START[0],y:ARENA_START[1],cd:2,pois:0,hitAt:0,f:'d'});
  say('Dorn: '+b.n+' enters the sand! Fight!');toast('Bout '+(i+1)+': '+b.n)}
function arenaStop(){AR.on=false;AR.pois=0}
function swingFoe(){
  if(!eq('weapon'))return say('You have no weapon!');
  if(S.sta<STAM.swing)return say('Too tired to swing. Drink a tonic or yield (leave by the door).');
  spend(STAM.swing);const d=hitDamage(),now=performance.now();AR.hp-=d;AR.hitAt=now;gainXp('combat',2);
  if(S.coat>0){S.coat--;AR.pois=now+6000;say('You hit '+AR.n+' for '+d+'! Poisoned.');ui()}else say('You hit '+AR.n+' for '+d+'!');
  if(AR.hp<=0)arenaWin();save()}
function arenaWin(){
  const b=BOUTS[AR.b],first=AR.b>=S.arena,gold=first?b.gold:Math.round(b.gold*.2);AR.on=false;
  if(first)S.arena=Math.min(BOUTS.length,AR.b+1);S.gold+=gold;gainXp('combat',first?b.xp:Math.round(b.xp*.2));
  say('Victory! '+b.n+' falls. Prize: '+gold+' gold.'+(first&&S.arena<BOUTS.length?' A tougher bout awaits.':''));toast('Victory! +'+gold+'g',2200);ui();save()}
function arenaLose(){
  AR.on=false;S.hp=Math.ceil(maxHp()/2);P.x=P.rx=ARENA_START[0];P.y=P.ry=AZ.y1-1;P.f='u';
  say('You yield. Dorn patches you up. No gold lost.');ui();save()}
function arenaTick(){
  if(!AR.on)return;const now=performance.now(),pz=AR.pois>now;
  if(pz){AR.hp-=1.2;AR.hitAt=now;if(AR.hp<=0)return arenaWin()}
  if(pz&&Math.random()<.4)return;
  const dx=P.x-AR.x,dy=P.y-AR.y,dist=Math.abs(dx)+Math.abs(dy);
  if(dist===1){AR.f=dx?(dx>0?'r':'l'):(dy>0?'d':'u');if(AR.cd<=0){hurt(pz?Math.ceil(AR.dmg/2):AR.dmg,AR.n);AR.cd=2}else AR.cd--;return}
  if(AR.cd>0)AR.cd--;
  const hx=Math.abs(dx)>=Math.abs(dy),c=[hx?[Math.sign(dx),0]:[0,Math.sign(dy)],hx?[0,Math.sign(dy)]:[Math.sign(dx),0]];
  for(const[a,b]of c){if(!a&&!b)continue;const nx=AR.x+a,ny=AR.y+b;
    if(at(nx,ny)===52&&!(P.x===nx&&P.y===ny)&&!npcAt(nx,ny)&&!solidAt(nx,ny)){AR.x=nx;AR.y=ny;AR.f=a?(a>0?'r':'l'):(b>0?'d':'u');break}}}
