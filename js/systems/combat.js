// ---------- combat (real-time enemies such as the spirit on Spirit Isle), getting hurt and fainting ----------
const hitDamage=()=>Math.round(eq('weapon').damage*(1+.08*lvl('combat')+fx('dmg')));
// every enemy that exists is in ENEMIES (the spirit G first); spawnEnemy adds more from the ENEMY_TYPES table (js/data/enemies.js)
const ENEMIES=[G],enemyAt=(x,y)=>ENEMIES.find(e=>e.alive&&e.x===x&&e.y===y);
function spawnEnemy(t,x,y,o={}){const ty=ENEMY_TYPES[t];if(!ty)return null;const e={t,x,y,hx:x,hy:y,hp:ty.hp,max:ty.hp,alive:true,cd:0,hitAt:0,resp:0,f:'d',pois:0,mv:0,respawn:ty.respawn||0,group:null,...o};ENEMIES.push(e);return e}
const dropEnemies=group=>{for(let i=ENEMIES.length-1;i>=0;i--)if(ENEMIES[i].group===group)ENEMIES.splice(i,1)};
function swing(e){
  if(!eq('weapon'))return say('You have no weapon! Buy a sword from Bram.');
  if(S.sta<STAM.swing)return say('Too tired to swing. Sleep on the boat to rest.');
  const nm=ENEMY_TYPES[e.t].n.toLowerCase();
  spend(STAM.swing);const d=hitDamage();e.hp-=d;e.hitAt=performance.now();say('You hit the '+nm+' for '+d+'!');gainXp('combat',2);
  if(S.coat>0){S.coat--;e.pois=performance.now()+6000;say('You hit the '+nm+' for '+d+'! It is poisoned.');ui()}
  if(e.hp<=0)enemyDie(e);save()}
function enemyDie(e){const ty=ENEMY_TYPES[e.t];e.alive=false;e.resp=ty.respawn||0;e.pois=0;let msg=ty.die||'The '+ty.n.toLowerCase()+' falls.';gainXp('combat',ty.xp||0);
  if(ty.gold){const gd=ty.gold[0]+Math.floor(Math.random()*(ty.gold[1]-ty.gold[0]+1));if(gd){S.gold+=gd;msg+=' +'+gd+' gold.'}}
  (ty.drops||[]).forEach(([id,ch,n])=>{if(Math.random()<ch){add(id,n||1);msg+=' Got '+ITEMS[id].n.toLowerCase()+(n>1?' x'+n:'')+'.'}});
  say(msg);ui();if(e.group&&!ENEMIES.some(q=>q.group===e.group&&q.alive))enemyBeaten(e.group)}
// one tick (about 0.6 s) for every enemy
function enemiesTick(){if(BATTLE)return;
  for(let i=ENEMIES.length-1;i>=0;i--){const e=ENEMIES[i],ty=ENEMY_TYPES[e.t];
    if(!e.alive){if(ty.respawn){if(--e.resp<=0){e.alive=true;e.hp=e.max;e.x=e.hx;e.y=e.hy}}else if(e!==G&&!e.keep)ENEMIES.splice(i,1);continue}
    const pz=e.pois>performance.now();if(pz&&Math.random()<.4)continue;
    const dx=P.x-e.x,dy=P.y-e.y,dist=Math.abs(dx)+Math.abs(dy);
    if(dist===1){if(e.cd<=0){hurt(pz?Math.round(ty.dmg/2):ty.dmg,'The '+ty.n.toLowerCase());e.cd=ty.cd}else e.cd--;continue}
    if(e.cd>0)e.cd--;
    if(ty.speed>1&&(e.mv=(e.mv||0)+1)%ty.speed)continue;
    const hx=Math.abs(dx)>=Math.abs(dy),c=dist<=ty.chase?[hx?[Math.sign(dx),0]:[0,Math.sign(dy)],hx?[0,Math.sign(dy)]:[Math.sign(dx),0]]:[Object.values(D)[Math.random()*4|0]];
    for(const[a,b]of c){if(!a&&!b)continue;const nx=e.x+a,ny=e.y+b,j=ny*MW+nx;
      const ok=ty.region==='island'?ISL.has(j)&&WK.includes(M[j]):WK.includes(M[j])&&Math.abs(nx-e.hx)<=(ty.leash||8)&&Math.abs(ny-e.hy)<=(ty.leash||8)&&!npcAt(nx,ny)&&!enemyAt(nx,ny);
      if(ok&&!(P.x===nx&&P.y===ny)){e.x=nx;e.y=ny;e.f=a?(a>0?'r':'l'):(b>0?'d':'u');break}}}}
// morning: every enemy that comes back (respawn) is back at home with full health; a dead one that never respawns stays gone
function enemiesMorning(){ENEMIES.forEach(e=>{if(ENEMY_TYPES[e.t].respawn){e.alive=true;e.hp=e.max;e.x=e.hx;e.y=e.hy;e.pois=0}})}
function faint(){cancel();const loss=Math.floor(S.gold*.1);S.gold-=loss;S.hp=Math.ceil(maxHp()/2);S.sta=Math.ceil(maxSta()/2);
  P.x=P.rx=B.x;P.y=P.ry=B.y;sail=true;say('You blacked out... and woke up on your boat. Lost '+loss+' gold.');ui();save()}
function hurt(n,src){n=Math.max(1,Math.round(n*(1-fx('ward'))));S.hp=Math.max(0,S.hp-n);flashHit();say(src+' hits you for '+n+'!');ui();save();if(S.hp<=0)AR.on?arenaLose():faint()}
