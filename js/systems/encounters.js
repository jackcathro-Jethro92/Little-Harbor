// ---------- encounters (roadmap step 3.3): groups of enemies that appear when the story starts them, and a flag when every one is beaten ----------
// ENCOUNTERS is a table: {id, mode:'battle'|'realtime', foes:[{foe:'foe id' (battle) or type:'enemy id' (realtime), at:[x,y]}...], near:1, together:1, noRun:1, start:'flag', win:[actions]}
//   id       names it; its flags are enc_<id>_on (it has started) and enc_<id>_done (every foe is beaten), and when it is done the triggers waiting for {beaten:'id'} fire
//   foes     battle mode: each one stands in the world as a person (a row of FOES, js/data/battles.js); face them and press Use to fight (one by one, or all at once with `together`, up to three).
//            realtime mode: each one is an enemy (a row of ENEMY_TYPES, js/data/enemies.js) that chases you; beating the whole group finishes the encounter
//   at       world tile coordinates (or offsets from the player when `near` is set, which the test fights use)      noRun   the fights cannot be run from
//   start    the flag that starts it (default enc_<id>_on). A trigger or scene starts one with the action {encounter:'id'}, or any story flag can be named here
//   win      actions run once when it is done (set a flag, give an item or gold, move a person, change the quest step...)
// Beaten foes stay beaten (S.story.enc, saved) and the foes still standing come back after a reload, at full health. Losing a fight wakes you on your boat as usual and the foes wait for another try.
// A foe that escapes (the boss, `flee`) counts as dealt with. Nothing spawns inside a wall or on the player: the nearest free tile is used. Rows named test_* appear in the testing menu (TEST_STORY).
const ENCOUNTERS=[
 {id:'test_gang',name:'Three pirates, one by one',mode:'battle',near:1,foes:[{foe:'pirate_grunt',at:[-2,-2]},{foe:'pirate_gunner',at:[0,-3]},{foe:'pirate_grunt',at:[2,-2]}],win:[{toast:'The pirates are beaten!'}]},
 {id:'test_captain',name:'The pirate captain',mode:'battle',near:1,noRun:1,foes:[{foe:'pirate_captain',at:[0,-3]}],win:[{toast:'The captain is beaten!'}]}
];
const encRow=id=>ENCOUNTERS.find(e=>e.id===id),encOn=e=>flag(e.start||'enc_'+e.id+'_on'),encDoneFlag=e=>'enc_'+e.id+'_done';
const encDown=id=>{const s=storyState();s.enc=s.enc||{};const d=s.enc[id]=s.enc[id]||{down:[]};return d.down};
const encFigures=id=>NPC.filter(n=>n.enc&&n.enc.id===id);
const encPresent=e=>e.mode==='realtime'?ENEMIES.some(q=>q.group===e.id):encFigures(e.id).length>0;
function encSpot(e,f){let x=f.at[0],y=f.at[1];if(e.near){x+=P.x;y+=P.y}
  if(!WK.includes(at(x,y))||npcAt(x,y)||(P.x===x&&P.y===y)||(enemyAt(x,y))){const s=nearestTile(x,y,(a,b)=>WK.includes(at(a,b))&&!npcAt(a,b)&&!(P.x===a&&P.y===b)&&!enemyAt(a,b));if(s){x=s[0];y=s[1]}}return[x,y]}
function encSpawn(e){const down=encDown(e.id);
  e.foes.forEach((f,i)=>{if(down.includes(i))return;const[x,y]=encSpot(e,f);
    if(e.mode==='realtime')spawnEnemy(f.type,x,y,{group:e.id,encI:i});
    else{const t=FOES[f.foe];NPC.push({...t.look,n:t.n,x,y,hx:x,hy:y,f:f.f||'d',fixed:1,enc:{id:e.id,i}})}})}
function encClear(e){for(let i=NPC.length-1;i>=0;i--)if(NPC[i].enc&&NPC[i].enc.id===e.id)NPC.splice(i,1);dropEnemies(e.id)}
// make the world match the flags: a started, unfinished encounter has its foes standing; otherwise none
function applyEncounters(){ENCOUNTERS.forEach(e=>{const on=encOn(e)&&!flag(encDoneFlag(e)),here=encPresent(e);if(on&&!here)encSpawn(e);else if(!on&&here)encClear(e)})}
const startEncounter=id=>{const e=encRow(id);if(!e||flag(encDoneFlag(e)))return false;setFlag(e.start||'enc_'+id+'_on',1);return true};   // setFlag brings the foes in
function encDone(e){encClear(e);setFlag(encDoneFlag(e),1);bActions(e.win);if(e.mode!=='realtime')enemyBeaten(e.id);save()}
// realtime: enemyDie (js/systems/combat.js) calls this when the last enemy of a group falls
function encounterGroupBeaten(group){const e=encRow(group);if(e&&e.mode==='realtime'&&!flag(encDoneFlag(e)))encDone(e)}
// battle mode: facing one of the figures and pressing Use fights it (or the whole group at once)
function encFight(n){const e=encRow(n.enc.id);if(!e||BATTLE||SCENE)return;
  const figs=e.together?encFigures(e.id).slice(0,3):[n],key='enc:'+e.id+':'+(e.together?'all':n.enc.i);
  BATTLES[key]={foes:figs.map(q=>e.foes[q.enc.i].foe),noRun:e.noRun?1:0};
  startBattle(key,res=>{delete BATTLES[key];if(res!=='won'&&res!=='escaped'){figs.forEach(q=>{q.coolUntil=performance.now()+6000});return}   // (a pirate that beat you does not spot you again for six seconds)
    const down=encDown(e.id);figs.forEach(q=>{if(!down.includes(q.enc.i))down.push(q.enc.i);const k=NPC.indexOf(q);if(k>=0)NPC.splice(k,1)});
    if(e.foes.every((f,i)=>down.includes(i)))encDone(e);else save()})}
// testing menu helper: forget an encounter's progress and start it again around the player
function restartEncounter(id){const e=encRow(id);if(!e)return false;encClear(e);const s=storyState();if(s.enc)delete s.enc[id];setFlag(e.start||'enc_'+id+'_on',0);setFlag(encDoneFlag(e),0);return startEncounter(id)}

// ---------- sight (playtest #4, P60): a pirate that sees you comes for you, like a Pokemon trainer ----------
// Every few moments each standing figure of a battle encounter looks for the player: close enough (SIGHT_R tiles), on foot, and nothing solid in the way (water does not block the view). The one that sees you
// hops with a red "!" over its head, walks up to the tile beside you, says a short line (DLG.pirate_spot, placeholders) and then the battle starts, as if you had pressed Use on it. It is a scene, so Skip
// works. A pirate with no way to reach you stays where it is (you can still walk up and press Use). `sight:0` on an encounter row turns it off; the tests turn all of it off (window.__NO_SIGHT, set before the page loads).
let ENC_SIGHT=!window.__NO_SIGHT;const SIGHT_R=6;
DLG.pirate_spot={start:'a',nodes:{a:{who:'Pirate',text:'[Placeholder] Hey, you! Stop right there!'},b:{who:'Pirate',text:'[Placeholder] A visitor! This is as far as you go.'},c:{who:'Pirate',text:'[Placeholder] You are not getting past me!'},d:{who:'Pirate',text:'[Placeholder] The captain said to watch for you. Come on, then!'}}};
const faceToward=(a,b)=>Math.abs(b[0]-a.x)>=Math.abs(b[1]-a.y)?(b[0]>a.x?'r':'l'):(b[1]>a.y?'d':'u');
function seesPlayer(n){if(Math.abs(n.x-P.x)>SIGHT_R||Math.abs(n.y-P.y)>SIGHT_R)return false;
  const dx=P.x-n.x,dy=P.y-n.y,k=Math.max(Math.abs(dx),Math.abs(dy));
  for(let i=1;i<k;i++){const x=Math.round(n.x+dx*i/k),y=Math.round(n.y+dy*i/k),t=at(x,y);if(t!==0&&!WK.includes(t))return false}return true}
// the shortest way to a tile beside the player (breadth-first over open ground), or null
function encPath(n,maxd){maxd=maxd||SIGHT_R+2;const start=n.x+','+n.y,prev={[start]:null},q=[[n.x,n.y]];
  const near=(x,y)=>Math.abs(x-P.x)+Math.abs(y-P.y)===1;if(near(n.x,n.y))return[];
  for(let h=0;h<q.length&&q.length<4000;h++){const[x,y]=q[h];
    for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(k in prev||!walkable(nx,ny)||Math.abs(nx-n.x)>maxd||Math.abs(ny-n.y)>maxd)continue;prev[k]=x+','+y;
      if(near(nx,ny)){const path=[[nx,ny]];let c=x+','+y;while(c!==start){const[cx,cy]=c.split(',').map(Number);path.unshift([cx,cy]);c=prev[c]}return path}
      q.push([nx,ny])}}
  return null}
SCSTEP.alert=([n,ms],c)=>{n.alertAt=performance.now();n.alertUntil=n.alertAt+ms;n.f=faceToward(n,[P.x,P.y]);if(c.fast){n.alertUntil=0;return c.go()}
  const t=setTimeout(()=>{n.alertUntil=0;c.go()},ms);c.hold(()=>{clearTimeout(t);n.alertUntil=0})};
SCSTEP.trek=([n,path,per],c)=>{n.busy=1;let k=0,last=[n.x,n.y];
  const stepOnce=()=>{if(k>=path.length)return false;const p=path[k++];n.f=faceToward(n,p);n.x=p[0];n.y=p[1];return true},end=()=>{n.f=faceToward(n,[P.x,P.y])};
  if(c.fast){while(stepOnce());end();return c.go()}
  const t=setInterval(()=>{if(!stepOnce()){clearInterval(t);end();c.go()}},per);c.hold(()=>{clearInterval(t);while(stepOnce());end()})};
function encNotice(n,path){const er=encRow(n.enc.id),L=Object.values((er&&DLG[er.spot]||DLG.pirate_spot).nodes),txt=L[(n.enc.i+n.x)%L.length].text;
  runScene([{alert:[n,700]},{trek:[n,path,190]},{wait:150},{line:[n.n,txt]}],()=>{n.alertUntil=0;encFight(n)})}
function encSightTick(){if(!ENC_SIGHT||SCENE||BATTLE||sail||dlgActive()||document.querySelector('.open')||(typeof trgRunning!=='undefined'&&trgRunning))return;
  const now=performance.now(),z=zoneOf(P.x,P.y);
  for(const n of NPC){if(!n.enc||n.hidden||(n.coolUntil||0)>now||zoneOf(n.x,n.y)!==z)continue;const e=encRow(n.enc.id);if(!e||e.mode!=='battle'||e.sight===0)continue;
    if(!seesPlayer(n))continue;const path=encPath(n);if(!path)continue;encNotice(n,path);return}}
setInterval(encSightTick,250);
