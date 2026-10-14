// ---------- creatures (the spirit on Spirit Isle, the Darkwood centipedes) that start turn-based battles when they touch you, getting hurt and fainting ----------
const hitDamage=()=>Math.round(eq('weapon').damage*(1+.08*lvl('combat')+fx('dmg')));
// every enemy that exists is in ENEMIES (the spirit G first); spawnEnemy adds more from the ENEMY_TYPES table (js/data/enemies.js)
const ENEMIES=[G],enemyAt=(x,y)=>ENEMIES.find(e=>e.alive&&e.x===x&&e.y===y);
function spawnEnemy(t,x,y,o={}){const ty=ENEMY_TYPES[t];if(!ty)return null;const e={t,x,y,hx:x,hy:y,hp:ty.hp,max:ty.hp,alive:true,cd:0,hitAt:0,resp:0,f:'d',pois:0,mv:0,respawn:ty.respawn||0,group:null,...o};ENEMIES.push(e);return e}
const dropEnemies=group=>{for(let i=ENEMIES.length-1;i>=0;i--)if(ENEMIES[i].group===group)ENEMIES.splice(i,1)};
// Touching a creature starts a turn-based battle (js/systems/battle.js): the creature reaches the player, the player walks into it or faces it and presses Use. The battle's foe is made from the creature's
// ENEMY_TYPES row (health, `hit:[min,max]` or up to its `dmg`, xp, gold, drops, art), so every row can be fought without more work.
function foeFromType(id){const ty=ENEMY_TYPES[id];return {n:ty.n,hp:ty.hp,hit:ty.hit||[Math.max(1,Math.round(ty.dmg*.5)),ty.dmg],gold:ty.gold,xp:ty.xp||0,drops:ty.drops,art:ty.art,block:ty.block,atk:ty.atk||'attacks'}}
function startEnemyBattle(e){if(BATTLE||SCENE||!e.alive)return false;
  const shut=[...document.querySelectorAll('.open')];if(shut.length){shut.forEach(el=>el.classList.remove('open'));AMBUSH_NOTE=true}const key='en:'+e.t;FOES[key]=foeFromType(e.t);BATTLES[key]={foes:[key]};
  return startBattle(key,res=>{const ty=ENEMY_TYPES[e.t];
    if(res==='won'||res==='escaped')enemyDefeated(e);
    else{e.cd=6;if(res==='lost'){e.x=e.hx;e.y=e.hy}}   // run away or be knocked out: it waits a moment (and goes home if you were knocked out)
    })}
// a creature that has been beaten: it falls (and returns later if its row says so), and a group that is all beaten fires its triggers. The rewards are given by the battle.
function enemyDefeated(e){const ty=ENEMY_TYPES[e.t];e.alive=false;e.resp=ty.respawn||0;e.pois=0;if(ty.die)say(ty.die);ui();
  if(e.group&&!ENEMIES.some(q=>q.group===e.group&&q.alive)){enemyBeaten(e.group);if(typeof encounterGroupBeaten==='function')encounterGroupBeaten(e.group)}}
// screens a creature may ambush you over (you were distracted): the map, bag, skills, shops and so on. Title menu, letters and the look editor are not on the list.
let AMBUSH_NOTE=false; // set when a creature ambushes you over an open screen; the battle opens with a notice
const AMBUSH_OVER=['mapov','ch','qs','store','bag','craft','skills','menu'];
const canBeAmbushed=()=>!BATTLE&&!SCENE&&!sail&&!dlgActive()&&S.hp>0&&![...document.querySelectorAll('.open')].some(el=>!AMBUSH_OVER.includes(el.id))&&!(typeof AR!=='undefined'&&AR.on);
// one tick (about 0.6 s) for every creature: they wander, chase when you are close, and start a battle when they reach you
// a tile this creature may walk on (an island creature stays on its island; others stay near home, within `leash` tiles)
function enemyCanStand(e,ty,nx,ny){const j=ny*MW+nx;if(nx<0||ny<0||nx>=MW||ny>=MH)return false;
  return ty.region==='island'?ISL.has(j)&&WK.includes(M[j]):WK.includes(M[j])&&Math.abs(nx-e.hx)<=(ty.leash||8)&&Math.abs(ny-e.hy)<=(ty.leash||8)&&!npcAt(nx,ny)&&!enemyAt(nx,ny)}
// chasing (playtest #3): the first step of the shortest walkable way to the player (a small breadth-first search, never wider than the chase range plus a few tiles). If there is no way, it does nothing.
function chaseStep(e,ty){const R=ty.chase+6,par=new Map(),q=[[e.x,e.y]];par.set(e.y*MW+e.x,null);
  while(q.length){const[x,y]=q.shift();
    for(const[dx,dy]of Object.values(D)){const nx=x+dx,ny=y+dy,k=ny*MW+nx;if(par.has(k)||Math.abs(nx-e.x)>R||Math.abs(ny-e.y)>R)continue;
      if(nx===P.x&&ny===P.y){let c=[x,y];if(c[0]===e.x&&c[1]===e.y)return null;   // already beside the player
        for(let p=par.get(c[1]*MW+c[0]);p&&!(p[0]===e.x&&p[1]===e.y);p=par.get(c[1]*MW+c[0]))c=p;   // walk back to the first step
        const sx=c[0]-e.x,sy=c[1]-e.y;return [c[0],c[1],sx?(sx>0?'r':'l'):(sy>0?'d':'u')]}
      if(!enemyCanStand(e,ty,nx,ny))continue;par.set(k,[x,y]);q.push([nx,ny])}}
  return null}
function enemiesTick(){if(BATTLE)return;
  for(let i=ENEMIES.length-1;i>=0;i--){const e=ENEMIES[i],ty=ENEMY_TYPES[e.t];
    if(!e.alive){if(ty.respawn){if(--e.resp<=0){e.alive=true;e.hp=e.max;e.x=e.hx;e.y=e.hy}}else if(e!==G&&!e.keep)ENEMIES.splice(i,1);continue}
    const dx=P.x-e.x,dy=P.y-e.y,dist=Math.abs(dx)+Math.abs(dy);
    if(dist===1){if(e.cd<=0){if(canBeAmbushed())startEnemyBattle(e)}else e.cd--;continue}
    if(e.cd>0)e.cd--;
    if(ty.speed>1&&(e.mv=(e.mv||0)+1)%ty.speed)continue;
    if(dist<=ty.chase){const st=chaseStep(e,ty);if(st){e.x=st[0];e.y=st[1];e.f=st[2]}continue}   // chasing: walk the shortest way round trees, walls and people
    const [a,b]=Object.values(D)[Math.random()*4|0];if(!a&&!b)continue;const nx=e.x+a,ny=e.y+b;
    if(enemyCanStand(e,ty,nx,ny)&&!(P.x===nx&&P.y===ny)){e.x=nx;e.y=ny;e.f=a?(a>0?'r':'l'):(b>0?'d':'u')}}}
// morning: every enemy that comes back (respawn) is back at home with full health; a dead one that never respawns stays gone
function enemiesMorning(){ENEMIES.forEach(e=>{if(ENEMY_TYPES[e.t].respawn){e.alive=true;e.hp=e.max;e.x=e.hx;e.y=e.hy;e.pois=0}})}
function faint(){cancel();const loss=Math.floor(S.gold*.1);S.gold-=loss;S.hp=Math.ceil(maxHp()/2);S.sta=Math.ceil(maxSta()/2);
  P.x=P.rx=B.x;P.y=P.ry=B.y;sail=true;say('You blacked out... and woke up on your boat. Lost '+loss+' gold.');ui();save()}
function hurt(n,src){n=Math.max(1,Math.round(n*(1-fx('ward'))));S.hp=Math.max(0,S.hp-n);flashHit();say(src+' hits you for '+n+'!');ui();save();if(S.hp<=0)AR.on?arenaLose():faint()}
