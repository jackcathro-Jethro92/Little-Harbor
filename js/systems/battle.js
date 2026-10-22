// ---------- the turn-based battle screen (roadmap 3.6, basic) ----------
// startBattle('id', onEnd) (rows in js/data/battles.js) opens a full-screen battle: your foes on top, you below, a message box and a menu of Attack / Item / Run. Tap a foe to choose who you hit.
// Attack: your weapon's damage with your Combat level (a little random; bare hands do 2); a poisoned weapon coat poisons the foe (it takes 2 a turn for 3 turns and hits half as hard). Item: any food or potion
// from the bag (a turn is used only if it did something). Run: 60% to get away unless the fight cannot be run from. Then every foe that is left takes its turn. A foe with `flee` runs away at low health.
// Win: gold, Combat xp and drops, then the row's `win` actions. Lose (health 0): you wake on your boat as after any knock-out (faint()) and the `lose` actions run. onEnd gets 'won', 'lost', 'ran' or 'escaped'.
// While it plays the player cannot move, use things or sleep and nothing else attacks. BATTLE_FAST (for tests) removes the pauses.
let BATTLE=null,BATTLE_FAST=false;
const bwait=ms=>BATTLE_FAST?Promise.resolve():new Promise(r=>setTimeout(r,ms));
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const bAlive=()=>BATTLE.foes.filter(f=>f.alive);
function bSay(t){$('bt-msg').textContent=t;if(BATTLE)(BATTLE.log=BATTLE.log||[]).push(t);return bwait(900)}   // BATTLE.log keeps what was said (the tests read it)
function bMenu(buttons){const m=$('bt-menu');m.innerHTML='';buttons.forEach(([t,fn,dis])=>{const b=document.createElement('button');b.textContent=t;b.disabled=!!dis;b.onclick=fn;m.appendChild(b)});const f=m.querySelector('button:not(:disabled)');if(f&&!BATTLE_FAST)f.focus()}
// A creature (the spirit, the centipede) is drawn by its map art, once per frame onto a small spare canvas by borrowing the game's drawing surface for a moment (`g`), then scaled up on the battle screen.
// ART_SHOT says how big the picture is and where on the spare canvas the creature stands (tile coordinates) and which way it faces.
const ART_SHOT={ghost:{w:48,h:48,x:1,y:1,f:'d',k:3},zombie:{w:48,h:48,x:1,y:1,f:'d',k:3},centipede:{w:48,h:30,x:.5,y:.55,f:'l',k:4}},artOff=document.createElement('canvas');
function paintCreature(f,cv){const A=ART_SHOT[f.t.art]||ART_SHOT.ghost;artOff.width=A.w;artOff.height=A.h;const keep=g;g=artOff.getContext('2d');g.clearRect(0,0,A.w,A.h);
  try{ENEMY_ART[f.t.art]({x:A.x,y:A.y,f:A.f,hp:f.t.hp,max:f.t.hp,hitAt:0,pois:f.pois>0?performance.now()+1e4:0},0,0,performance.now())}finally{g=keep}
  const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);c.drawImage(artOff,0,0,A.w*A.k,A.h*A.k)}
// the field: sky, far hills and a treeline, then grass with tufts and flowers, drawn once in pixels and scaled up behind the fighters
function drawField(){const cv=$('bt-bg'),c=cv.getContext('2d'),W=cv.width,H=cv.height;c.imageSmoothingEnabled=false;const hz=Math.round(H*.34);
  for(let y=0;y<hz;y++){const k=y/hz;c.fillStyle='rgb('+Math.round(120+k*95)+','+Math.round(178+k*40)+','+Math.round(232-k*30)+')';c.fillRect(0,y,W,1)}
  c.fillStyle='rgba(255,255,255,.85)';[[14,8,18],[70,14,22],[104,6,14]].forEach(([x,y,w])=>{c.fillRect(x,y,w,3);c.fillRect(x+3,y-2,w-6,2);c.fillRect(x+2,y+3,w-4,1)})
  c.fillStyle='#8aa8c8';for(let x=0;x<W;x++)c.fillRect(x,hz-8-Math.round(Math.sin(x/9)*3+Math.sin(x/4.3)*1.5),1,9)          // far hills
  c.fillStyle='#4a7a4a';for(let x=0;x<W;x+=2){const h=3+((x*7)%5);c.fillRect(x,hz-h+1,2,h)}                                      // treeline
  for(let y=hz;y<H;y++){const k=(y-hz)/(H-hz);c.fillStyle='rgb('+Math.round(104-k*26)+','+Math.round(168-k*34)+','+Math.round(70-k*18)+')';c.fillRect(0,y,W,1)}
  for(let i=0;i<260;i++){const x=(i*37)%W,y=hz+2+((i*53)%(H-hz-2));c.fillStyle=i%3?'#5e9a46':'#7ab45a';c.fillRect(x,y,1,1);if(i%5===0){c.fillRect(x,y-1,1,1)}}      // grass flecks and tufts
  [['#f4e060',3],['#f0f0f0',7],['#e86a6a',11]].forEach(([col,m])=>{for(let i=0;i<9;i++){const x=(i*29+m*13)%W,y=hz+6+((i*41+m*7)%(H-hz-8));c.fillStyle=col;c.fillRect(x,y,2,2);c.fillStyle='#3a7a30';c.fillRect(x,y+2,1,1)}})
  c.fillStyle='rgba(30,60,20,.25)';c.fillRect(0,H-6,W,6)}
function bDraw(){const B=BATTLE;if(!B)return;
  $('bt-foes').innerHTML='';B.foes.forEach((f,i)=>{const d=document.createElement('div');d.className='bt-foe'+(f.alive?'':' gone')+(i===B.sel&&f.alive?' sel':'');
    const sh=document.createElement('div');sh.className='bt-shadow';d.appendChild(sh);
    const cv=document.createElement('canvas');
    if(f.t.art){const A=ART_SHOT[f.t.art]||ART_SHOT.ghost;cv.width=A.w*A.k;cv.height=A.h*A.k;paintCreature(f,cv);cv.className='bt-big'}
    else{cv.width=96;cv.height=96;cv.getContext('2d').imageSmoothingEnabled=false;cv.getContext('2d').drawImage(shadePerson({...lo(f.t.look),armour:f.t.look.armour,view:'f',frame:0}),0,0,24,24,0,0,96,96)}
    cv.style.animationDelay=swayDelay();if(i%2)cv.style.animationDirection='reverse';
    f.cv=cv;d.appendChild(cv);const mk=document.createElement('div');mk.className='bt-mark';d.appendChild(mk);
    const tag=document.createElement('div');tag.className='bt-tag';const nm=document.createElement('span');nm.textContent=f.t.n+(f.pois>0?' (poisoned)':'');tag.appendChild(nm);
    const bar=document.createElement('div');bar.className='bt-bar';const fill=document.createElement('i');fill.style.width=Math.max(0,Math.round(100*f.hp/f.max))+'%';bar.appendChild(fill);tag.appendChild(bar);d.appendChild(tag);
    d.onclick=()=>{if(f.alive&&B.picking){B.sel=i;bDraw()}};f.el=d;$('bt-foes').appendChild(d)});
  const cv=$('bt-me'),c=cv.getContext('2d');cv.style.animationDelay=swayDelay();c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);c.drawImage(shadePerson({...playerLook(),view:'b',frame:0}),0,0,24,24,0,0,cv.width,cv.height);
  $('bt-hp').style.width=Math.max(0,Math.round(100*S.hp/maxHp()))+'%';$('bt-hpn').textContent=Math.ceil(S.hp)+' / '+maxHp()+' HP';$('bt-sta').style.width=Math.max(0,Math.min(100,Math.round(100*S.sta/maxSta())))+'%';$('bt-stan').textContent=Math.ceil(S.sta)+' STA'}
// ---------- battle animations: a gentle sway for everyone, lunges, a slash or chop over the foe, a flash and a floating number on every hit, a shield flash for blocks ----------
// BATTLE.fx keeps a note of each effect (the tests read it). BATTLE_BLOCKS=false (tests) stops foes blocking so old checks stay predictable.
let BATTLE_BLOCKS=true;
const shieldImg=(()=>{const c=document.createElement('canvas');c.width=12;c.height=14;const x=c.getContext('2d');
  [[0,0,12,2],[0,2,12,6],[1,8,10,2],[2,10,8,2],[4,12,4,2]].forEach(([a,b,w,h])=>{x.fillStyle='#3d2511';x.fillRect(a,b,w,h)});
  [[1,1,10,2],[1,3,10,5],[2,8,8,2],[3,10,6,2],[5,12,2,1]].forEach(([a,b,w,h])=>{x.fillStyle='#3b7fd6';x.fillRect(a,b,w,h)});
  x.fillStyle='#f3d9a4';x.fillRect(5,2,2,9);x.fillRect(2,5,8,2);return c.toDataURL()})();
const foeBlockChance=f=>!BATTLE_BLOCKS||f.stun>0?0:(f.t.block!==undefined?f.t.block:(f.t.art?0:.2));
function bFx(cls,target,text){if(BATTLE)(BATTLE.fx=BATTLE.fx||[]).push(cls+(text?':'+text:''));if(BATTLE_FAST||!target||!target.isConnected)return;
  const a=$('bt-arena'),ar=a.getBoundingClientRect(),r=target.getBoundingClientRect(),d=document.createElement('div');d.className='bt-fx '+cls;
  d.style.left=(r.left-ar.left+r.width/2)+'px';d.style.top=(r.top-ar.top+r.height*(cls==='dmg'?.15:.5))+'px';
  if(cls==='shield'){const i=document.createElement('img');i.src=shieldImg;d.appendChild(i)}else if(text)d.textContent=text;
  a.appendChild(d);setTimeout(()=>d.remove(),1000)}
const bFlash=cv=>bShake(cv,'flash');
// being hit (playtest #4): the whole field shakes, a red flash washes over it, you blink and the health bar flashes (the old red edge was on the map behind the battle, where nobody could see it)
function bHurt(){bFx('hurt');if(BATTLE_FAST)return;const a=$('bt-arena'),m=$('bt-me'),h=$('bt-hp'),r=document.createElement('div');r.className='bt-redflash';a.appendChild(r);
  bShake($('bt-meBox'),'hit');a.classList.add('screenshake');m.classList.add('hurtblink');h.classList.add('losing');
  setTimeout(()=>{r.remove();a.classList.remove('screenshake')},520);setTimeout(()=>{m.classList.remove('hurtblink');h.classList.remove('losing')},700)}
// keeps the sway going smoothly when the foes are redrawn (the animation picks up where it was)
const swayDelay=()=>'-'+Math.round(performance.now()%2400)+'ms';
const bShake=(el,cls)=>{if(!el||BATTLE_FAST)return;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),320)};
function startBattle(id,onEnd){const row=BATTLES[id];if(!row||BATTLE||SCENE)return false;cancel();releaseAll();if(dlgActive())dlgEnd();
  BATTLE={id,row,onEnd,sel:0,picking:false,foes:row.foes.slice(0,3).map(k=>({k,t:FOES[k],hp:FOES[k].hp,max:FOES[k].hp,pois:0,alive:true,fled:false}))};
  $('battle').classList.add('open');drawField();bDraw();BATTLE.anim=setInterval(()=>{if(BATTLE)BATTLE.foes.forEach(f=>{if(f.alive&&f.t.art&&f.cv&&f.cv.isConnected)paintCreature(f,f.cv)})},130);
  const note=AMBUSH_NOTE;AMBUSH_NOTE=false;
  (async()=>{if(note)await bSay('You were attacked while distracted!');await bSay(BATTLE.foes.length>1?'Enemies block your way!':BATTLE.foes[0].t.n+' attacks!');bTurn()})();return true}
// Run is only an option against wild creatures (a foe with `art`); pirates and other people never let you go (playtest #4)
const bCanRun=()=>!BATTLE.row.noRun&&bAlive().every(f=>f.t.art);
function bTurn(){const B=BATTLE;if(!B)return;B.picking=true;bDraw();$('bt-msg').textContent='What will you do?';
  bMenu([['Attack',bAttackMenu],['Block',bBlock],['Item',bItems],...(bCanRun()?[['Run',bRun]]:[])])}
// Attack opens the list of attacks the player knows with the weapon in hand (js/data/attacks.js); each costs stamina and one you cannot afford is greyed out
// each attack shows its stamina cost and the uses it has left (playtest #4); when none can be used, Scuffle (free, weak) is offered so you are never stuck
function bAttackMenu(){const B=BATTLE;B.picking=true;const ks=knownAttacks(),worn=!ks.some(canUse);
  $('bt-msg').textContent=worn?'You have no strength or no uses left for your attacks. All you can do is Scuffle.':'Choose an attack. Stamina '+Math.ceil(S.sta)+'.';
  bMenu([...ks.map(id=>{const A=ATTACKS[id],u=usesLeft(id);return[A.n+' ('+A.cost+')'+(A.uses!==undefined&&PP_ON?'  '+u+'/'+A.uses:''),()=>bAttack(id),!canUse(id)]}),...(worn?[['Scuffle',()=>bAttack('scuffle')]]:[]),['Back',bTurn]])}
// one blow of an attack: damage, animation and the line about it (a second blow of Quick Strike runs this again)
async function bBlow(f,A,w,t,sk,first){
  const base=w?w.damage:2;let d=Math.max(1,Math.round(base*(1+.08*(sk?lvl(sk):0)+fx('dmg'))*A.power*(.85+Math.random()*.3)));
  const blocked=A.pierce?false:Math.random()<foeBlockChance(f);   // `pierce` (Divine Strike) cannot be blocked
  if(blocked)d=Math.max(1,Math.round(d*BLOCK_TAKES));
  f.hp-=d;if(first){gainXp('combat',1);if(sk&&A.xp)gainXp(sk,A.xp)}
  bShake($('bt-meBox'),'lunge');await bwait(first?230:150);
  bFx(t==='axe'?'chop':'slash',f.el);if(blocked){bFx('shield',f.el);bFx('dmg small',f.el,'-'+d)}else{bShake(f.el,'hit');bFlash(f.cv);bFx('dmg',f.el,'-'+d)}
  await bSay(blocked?f.t.n+' blocks! You use '+A.n+' for only '+d+'.':'You use '+A.n+' on '+f.t.n+' for '+d+'!');
  return blocked}
// a big banner across the field (a new attack learned)
async function bBanner(text){bFx('banner',null,text);if(BATTLE_FAST)return;const a=$('bt-arena'),d=document.createElement('div');d.className='bt-banner';d.textContent=text;a.appendChild(d);setTimeout(()=>d.remove(),2600);await bwait(1700)}
async function bAttack(id){const B=BATTLE,A=ATTACKS[id];B.picking=false;bMenu([]);let f=B.foes[B.sel];if(!f||!f.alive)f=bAlive()[0];B.sel=B.foes.indexOf(f);
  const w=eq('weapon'),t=weaponType(),sk=t==='starter'?null:t,lv0=sk?lvl(sk):0;
  S.sta=Math.max(0,S.sta-A.cost);if(A.uses!==undefined){S.pp=S.pp||{};S.pp[id]=(S.pp[id]||0)+1}
  let blocked=await bBlow(f,A,w,t,sk,true);
  if(A.twice&&f.hp>0&&!blocked&&Math.random()<A.twice){bFx('twice');await bSay('Quick! You strike again before '+f.t.n+' can answer!');blocked=await bBlow(f,A,w,t,sk,false)}   // Quick Strike (playtest #4)
  if(sk&&lvl(sk)>lv0){const learned=WEAPON_MOVES[t].filter(([,req])=>req>lv0&&req<=lvl(sk)).map(([i])=>ATTACKS[i].n);
    await bSay('Your '+SKILLS.find(q=>q.id===sk).n+' skill reached level '+lvl(sk)+'!');if(learned.length)await bBanner('New attack learned: '+learned.join(' and ')+'!')}
  if(A.stun&&f.hp>0&&!blocked&&Math.random()<A.stun){f.stun=1;await bSay(f.t.n+' is stunned!')}
  if(w&&S.coat>0){S.coat--;f.pois=3;ui();await bSay(f.t.n+' is poisoned!')}
  if(f.hp<=0){f.alive=false;bDraw();await bSay(f.t.n+' is beaten!')}else bDraw();
  if(!bAlive().length)return bEnd('won');
  if(fx('haste')&&Math.random()<fx('haste')){await bSay('You are quick! You get another turn at once.');return bTurn()}   // the Sky Helm: sometimes the foes lose their turn
  bFoes()}
// Block: much less damage this turn, and some stamina back
async function bBlock(){const B=BATTLE;B.picking=false;bMenu([]);S.sta=Math.min(maxSta(),S.sta+BLOCK_STAMINA);B.blocking=true;bDraw();bFx('shield',$('bt-meBox'));await bSay('You raise your guard and catch your breath. +'+BLOCK_STAMINA+' stamina.');bFoes()}
function bItems(){const B=BATTLE;B.picking=false;const ids=[...LIST('food'),...LIST('potion')].filter(count);
  if(!ids.length){$('bt-msg').textContent='You have nothing to use.';return bMenu([['Back',bTurn]])}
  $('bt-msg').textContent='Use which?';bMenu([...ids.map(id=>[ITEMS[id].n+' x'+count(id),()=>bUse(id)]),['Back',bTurn]])}
async function bUse(id){bMenu([]);const n0=count(id),it=ITEMS[id],h0=S.hp,s0=S.sta;if(it.kind==='food')eat(id);else drink(id);const used=count(id)<n0;bDraw();
  if(S.hp>h0)bFx('heal',$('bt-meBox'),'+'+Math.round(S.hp-h0)+' HP');if(S.sta>s0)bFx('heal',$('bt-meBox'),'+'+Math.round(S.sta-s0)+' STA');
  await bSay($('msg').textContent);if(!used)return bTurn();bFoes()}
async function bRun(){const B=BATTLE;B.picking=false;bMenu([]);
  if(!bCanRun()){await bSay('There is no way to run from this!');return bFoes()}
  const odds=Math.min(...bAlive().map(f=>f.t.escape!==undefined?f.t.escape:.6));   // each wild creature can set its own `escape` chance (default 60%; a fast or fierce one can be lower)
  if(Math.random()<odds){await bSay('You got away!');return bEnd('ran')}
  await bSay('You could not get away!');bFoes()}
// the foes that are left take their turns
async function bFoes(){const B=BATTLE;
  for(const f of B.foes){if(!f.alive)continue;
    if(f.pois>0){f.pois--;f.hp-=2;bDraw();if(f.hp<=0){f.alive=false;bDraw();await bSay(f.t.n+' succumbs to the poison!');if(!bAlive().length)return bEnd('won');continue}}
    if(f.stun>0){f.stun--;await bSay(f.t.n+' is stunned and loses its turn!');continue}
    if(f.t.flee&&f.hp<=f.max*f.t.flee.at){f.alive=false;f.fled=true;bDraw();await bSay(f.t.flee.msg||f.t.n+' runs away!');if(!bAlive().length)return bEnd('escaped');continue}
    // a foe with a `pattern` (the pirate boss) cycles through its steps: a plain hit, or `wind` (it winds up, no damage this turn, so a Block next turn takes the heavy blow that follows)
    let atk=f.t.atk,hit=f.t.hit;if(f.t.pattern){const st=f.t.pattern[((f.turns=(f.turns||0)+1)-1)%f.t.pattern.length];if(st.wind){await bSay(f.t.n+' '+st.wind);continue}atk=st.atk;hit=st.hit}
    const raw=rnd(hit[0],hit[1]),d=Math.max(1,Math.round((f.pois>0?raw/2:raw)*(1-fx('ward'))*(B.blocking?BLOCK_TAKES:1)));bShake(f.el,'foelunge');await bwait(230);
    S.hp=Math.max(0,S.hp-d);ui();flashHit();if(B.blocking){bFx('shield',$('bt-meBox'));bFx('dmg small',$('bt-meBox'),'-'+d)}else{bHurt();bFx('dmg player',$('bt-meBox'),'-'+d)}bDraw();
    await bSay(f.t.n+' '+(atk||'attacks')+'! -'+d+' health.');if(S.hp<=0)return bEnd('lost')}
  B.blocking=false;bTurn()}
function bActions(list){(list||[]).forEach(a=>{const k=Object.keys(a).find(q=>TACT[q]&&!['say','scene','letter','battle'].includes(q));if(k)TACT[k](a[k])})}
async function bEnd(result){const B=BATTLE;let msg='';
  if(result==='won'||result==='escaped'){let xp=0,gold=0;const got=[];B.foes.forEach(f=>{if(!f.fled||result==='escaped'){xp+=Math.round(f.t.xp*(f.fled?.5:1))}if(!f.fled){if(f.t.gold)gold+=rnd(f.t.gold[0],f.t.gold[1]);(f.t.drops||[]).forEach(([id,ch,n])=>{if(Math.random()<ch){add(id,n||1);got.push(ITEMS[id].n.toLowerCase()+(n>1?' x'+n:''))}})}});
    gainXp('combat',xp);S.gold+=gold;msg=(result==='won'?'You won! ':'')+'+'+xp+' xp'+(gold?', +'+gold+' gold':'')+(got.length?', got '+got.join(', '):'')+'.';ui()}
  if(msg)await bSay(msg);
  clearInterval(B.anim);$('battle').classList.remove('open');BATTLE=null;
  if(result==='lost')faint();
  bActions(B.row[result==='won'?'win':result==='lost'?'lose':result==='ran'?'ran':'escaped']);save();ui();if(B.onEnd)B.onEnd(result);if(result==='won'&&B.row.winScene)setTimeout(()=>runScene(B.row.winScene),500)}   // `winScene`: a cutscene that plays after a win (the final battle)
// arrows move between the menu buttons
addEventListener('keydown',e=>{if(!BATTLE)return;const bs=[...$('bt-menu').querySelectorAll('button:not(:disabled)')];if(!bs.length)return;const i=bs.indexOf(document.activeElement);
  if(['ArrowDown','ArrowRight','s','d'].includes(e.key)){e.preventDefault();bs[(i+1)%bs.length].focus()}else if(['ArrowUp','ArrowLeft','w','a'].includes(e.key)){e.preventDefault();bs[(i+bs.length-1+bs.length)%bs.length].focus()}},true);
