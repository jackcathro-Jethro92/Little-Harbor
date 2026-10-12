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
const ART_SHOT={ghost:{w:48,h:48,x:1,y:1,f:'d',k:3},centipede:{w:48,h:30,x:.5,y:.55,f:'l',k:4}},artOff=document.createElement('canvas');
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
    else{cv.width=96;cv.height=96;cv.getContext('2d').imageSmoothingEnabled=false;cv.getContext('2d').drawImage(shadePerson({...lo(f.t.look),view:'f',frame:0}),0,0,24,24,0,0,96,96)}
    f.cv=cv;d.appendChild(cv);const mk=document.createElement('div');mk.className='bt-mark';d.appendChild(mk);
    const tag=document.createElement('div');tag.className='bt-tag';const nm=document.createElement('span');nm.textContent=f.t.n+(f.pois>0?' (poisoned)':'');tag.appendChild(nm);
    const bar=document.createElement('div');bar.className='bt-bar';const fill=document.createElement('i');fill.style.width=Math.max(0,Math.round(100*f.hp/f.max))+'%';bar.appendChild(fill);tag.appendChild(bar);d.appendChild(tag);
    d.onclick=()=>{if(f.alive&&B.picking){B.sel=i;bDraw()}};f.el=d;$('bt-foes').appendChild(d)});
  const cv=$('bt-me'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);c.drawImage(shadePerson({...lo({...S.look}),view:'b',frame:0}),0,0,24,24,0,0,cv.width,cv.height);
  $('bt-hp').style.width=Math.max(0,Math.round(100*S.hp/maxHp()))+'%';$('bt-hpn').textContent=Math.ceil(S.hp)+' / '+maxHp()+' HP';$('bt-stan').textContent=Math.ceil(S.sta)+' STA'}
const bShake=(el,cls)=>{if(!el||BATTLE_FAST)return;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),320)};
function startBattle(id,onEnd){const row=BATTLES[id];if(!row||BATTLE||SCENE)return false;cancel();releaseAll();if(dlgActive())dlgEnd();
  BATTLE={id,row,onEnd,sel:0,picking:false,foes:row.foes.slice(0,3).map(k=>({k,t:FOES[k],hp:FOES[k].hp,max:FOES[k].hp,pois:0,alive:true,fled:false}))};
  $('battle').classList.add('open');drawField();bDraw();BATTLE.anim=setInterval(()=>{if(BATTLE)BATTLE.foes.forEach(f=>{if(f.alive&&f.t.art&&f.cv&&f.cv.isConnected)paintCreature(f,f.cv)})},130);
  (async()=>{await bSay(BATTLE.foes.length>1?'Enemies block your way!':BATTLE.foes[0].t.n+' attacks!');bTurn()})();return true}
function bTurn(){const B=BATTLE;if(!B)return;B.picking=true;bDraw();$('bt-msg').textContent='What will you do?';
  bMenu([['Attack',bAttack],['Item',bItems],['Run',bRun]])}
async function bAttack(){const B=BATTLE;B.picking=false;bMenu([]);let f=B.foes[B.sel];if(!f||!f.alive)f=bAlive()[0];B.sel=B.foes.indexOf(f);
  const w=eq('weapon'),base=w?hitDamage():2,d=Math.max(1,Math.round(base*(.85+Math.random()*.3)));f.hp-=d;gainXp('combat',1);
  bShake(f.el,'hit');await bSay('You '+(w?'strike':'punch')+' '+f.t.n+' for '+d+'!');
  if(w&&S.coat>0){S.coat--;f.pois=3;ui();await bSay(f.t.n+' is poisoned!')}
  if(f.hp<=0){f.alive=false;bDraw();await bSay(f.t.n+' is beaten!')}else bDraw();
  if(!bAlive().length)return bEnd('won');bFoes()}
function bItems(){const B=BATTLE;B.picking=false;const ids=[...LIST('food'),...LIST('potion')].filter(count);
  if(!ids.length){$('bt-msg').textContent='You have nothing to use.';return bMenu([['Back',bTurn]])}
  $('bt-msg').textContent='Use which?';bMenu([...ids.map(id=>[ITEMS[id].n+' x'+count(id),()=>bUse(id)]),['Back',bTurn]])}
async function bUse(id){bMenu([]);const n0=count(id),it=ITEMS[id];if(it.kind==='food')eat(id);else drink(id);const used=count(id)<n0;bDraw();
  await bSay($('msg').textContent);if(!used)return bTurn();bFoes()}
async function bRun(){const B=BATTLE;B.picking=false;bMenu([]);
  if(B.row.noRun){await bSay('There is no way to run from this!');return bFoes()}
  if(Math.random()<.6){await bSay('You got away!');return bEnd('ran')}
  await bSay('You could not get away!');bFoes()}
// the foes that are left take their turns
async function bFoes(){const B=BATTLE;
  for(const f of B.foes){if(!f.alive)continue;
    if(f.pois>0){f.pois--;f.hp-=2;bDraw();if(f.hp<=0){f.alive=false;bDraw();await bSay(f.t.n+' succumbs to the poison!');if(!bAlive().length)return bEnd('won');continue}}
    if(f.t.flee&&f.hp<=f.max*f.t.flee.at){f.alive=false;f.fled=true;bDraw();await bSay(f.t.flee.msg||f.t.n+' runs away!');if(!bAlive().length)return bEnd('escaped');continue}
    const raw=rnd(f.t.hit[0],f.t.hit[1]),d=Math.max(1,Math.round((f.pois>0?raw/2:raw)*(1-fx('ward'))));S.hp=Math.max(0,S.hp-d);ui();flashHit();bShake($('bt-meBox'),'hit');bDraw();
    await bSay(f.t.n+' '+(f.t.atk||'attacks')+'! -'+d+' health.');if(S.hp<=0)return bEnd('lost')}
  bTurn()}
function bActions(list){(list||[]).forEach(a=>{const k=Object.keys(a).find(q=>TACT[q]&&!['say','scene','letter','battle'].includes(q));if(k)TACT[k](a[k])})}
async function bEnd(result){const B=BATTLE;let msg='';
  if(result==='won'||result==='escaped'){let xp=0,gold=0;const got=[];B.foes.forEach(f=>{if(!f.fled||result==='escaped'){xp+=Math.round(f.t.xp*(f.fled?.5:1))}if(!f.fled){if(f.t.gold)gold+=rnd(f.t.gold[0],f.t.gold[1]);(f.t.drops||[]).forEach(([id,ch,n])=>{if(Math.random()<ch){add(id,n||1);got.push(ITEMS[id].n.toLowerCase()+(n>1?' x'+n:''))}})}});
    gainXp('combat',xp);S.gold+=gold;msg=(result==='won'?'You won! ':'')+'+'+xp+' xp'+(gold?', +'+gold+' gold':'')+(got.length?', got '+got.join(', '):'')+'.';ui()}
  if(msg)await bSay(msg);
  clearInterval(B.anim);$('battle').classList.remove('open');BATTLE=null;
  if(result==='lost')faint();
  bActions(B.row[result==='won'?'win':result==='lost'?'lose':result==='ran'?'ran':'escaped']);save();ui();if(B.onEnd)B.onEnd(result)}
// arrows move between the menu buttons
addEventListener('keydown',e=>{if(!BATTLE)return;const bs=[...$('bt-menu').querySelectorAll('button:not(:disabled)')];if(!bs.length)return;const i=bs.indexOf(document.activeElement);
  if(['ArrowDown','ArrowRight','s','d'].includes(e.key)){e.preventDefault();bs[(i+1)%bs.length].focus()}else if(['ArrowUp','ArrowLeft','w','a'].includes(e.key)){e.preventDefault();bs[(i+bs.length-1+bs.length)%bs.length].focus()}},true);
