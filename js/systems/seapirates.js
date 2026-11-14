// ---------- roaming pirate ships (Jack's note after playtest #5) ----------
// Pirate ships sail the open sea: Murl's sloop, schooner and brig in red and black with a black skull flag (tiers 4-6 of SHIPSPEC in js/render/ships.js). While you sail, every tile of open water
// has a small chance of one appearing out of sight, 10 to 13 tiles away. A ship wanders until you come within PSHIP.SIGHT tiles; then a red "!" shows over it and it gives chase, steering round
// islands towards your boat. If it reaches you, the pirates board: a battle with two or three of them that cannot be run from (playtest #4, P44). Get far enough ahead (PSHIP.GIVEUP tiles) or keep
// ahead for PSHIP.CHASE_S seconds and they give up for a while. Each boat sails at its own speed (`sailMs` in js/data/items.js), so a faster boat can outrun them; the pirates get faster too.
// How common, how fast and how tough they are depends on how far the story has gone (PIRATE_SEAS, by the number of quests done). They are not saved: a reload clears the sea.
// They never appear before the festival is over, within SEA_SAFE tiles of the village, in a story scene, or in the tests (window.__NO_SIGHT) unless a test turns PSHIP_ON on.
const PSHIP={SIGHT:8,GIVEUP:16,CHASE_S:30,CALM_S:25,FAR:34,GAP:40,TICK:40};
// PIRATE_SEAS: one row per stage of the story. [quests done at least, chance per tile sailed, most ships at sea at once, ms per tile they sail, chance of a third pirate, the crew they draw from]
// (for comparison: the rowboat sails a tile in 90 ms, the sloop 80, the schooner 72 and the brig 64)
const PIRATE_SEAS=[
 [0,.0008,1,86,0,['pirate_grunt','pirate_gunner']],
 [2,.0015,1,84,.2,['earth_grunt','earth_gunner']],
 [4,.003,2,80,.4,['sea_cutthroat','sea_gunner','sea_mate']],
 [5,.0045,2,78,.5,['sky_grunt','sky_gunner','sky_bruiser']],
 [6,.007,3,75,.7,['raid_raider','raid_gunner','raid_brute']],
 [8,.01,4,72,.85,['final_raider','final_gunner','final_brute']]];
const questsDone=()=>((S.story&&S.story.done)||[]).filter(q=>/^q\d+$/.test(q)).length;
const pseaRow=()=>PIRATE_SEAS.filter(r=>questsDone()>=r[0]).pop();
let PSHIPS=[],PSHIP_ON=!window.__NO_SIGHT,pshipQuiet=PSHIP.GAP;
const pshipAt=(x,y)=>PSHIPS.find(s=>s.x===x&&s.y===y&&!s.boarding);
const pshipWater=(x,y)=>x>=0&&y>=0&&x<MW&&y<WH&&at(x,y)===0&&!pshipAt(x,y)&&!harbourBoatAt(x,y);
// a ship appears somewhere you cannot see, in open water
function pshipSpawn(near){const r=pseaRow();
  for(let k=0;k<40;k++){const a=Math.random()*Math.PI*2,d=near?4+Math.random()*2:10+Math.random()*3,x=Math.round(P.x+Math.cos(a)*d),y=Math.round(P.y+Math.sin(a)*d);
    if(!pshipWater(x,y)||(P.x===x&&P.y===y))continue;const big=Math.min(2,Math.floor(questsDone()/4)),tier=4+Math.max(0,big-(Math.random()<.4?1:0));
    const s={x,y,rx:x,ry:y,f:Math.random()<.5?'l':'r',tier,ms:r[3],next:0,state:'roam',calm:0};PSHIPS.push(s);return s}
  return null}
// called for every tile you sail (js/systems/player.js)
function pshipSeaTick(){if(!PSHIP_ON||!sail||BATTLE||SCENE||!flag('festival_done'))return;if(--pshipQuiet>0)return;const r=pseaRow();
  if(PSHIPS.length>=r[2]||Math.hypot(P.x-SEA_HOME[0],P.y-SEA_HOME[1])<SEA_SAFE||Math.random()>r[1])return;if(pshipSpawn())pshipQuiet=PSHIP.GAP}
// the first step of the shortest way over water towards the player (breadth-first, a short way out), or null
function pshipStepTo(s){const start=s.x+','+s.y,prev={[start]:null},q=[[s.x,s.y]];
  for(let h=0;h<q.length&&q.length<900;h++){const[x,y]=q[h];
    for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(k in prev)continue;
      if(nx===P.x&&ny===P.y){let c=x+','+y,step=[nx,ny];while(c!==start){step=c.split(',').map(Number);c=prev[c]}return step}
      if(!pshipWater(nx,ny)||Math.abs(nx-s.x)>PSHIP.GIVEUP||Math.abs(ny-s.y)>PSHIP.GIVEUP)continue;prev[k]=x+','+y;q.push([nx,ny])}}
  return null}
function pshipMove(s,nx,ny){if(nx!==s.x)s.f=nx<s.x?'l':'r';else s.f=ny<s.y?'u':'d';s.x=nx;s.y=ny}
const pshipPaused=()=>BATTLE||SCENE||dlgActive()||!!document.querySelector('.open')||SEA_ALERT>performance.now();
function pshipTick(){if(!PSHIPS.length)return;const now=performance.now();
  PSHIPS.forEach(s=>{const k=.25;s.rx+=(s.x-s.rx)*k;s.ry+=(s.y-s.ry)*k});
  if(pshipPaused())return;
  for(const s of PSHIPS.slice()){if(s.boarding||now<s.next)continue;s.next=now+s.ms;
    const d=Math.hypot(s.x-P.x,s.y-P.y);
    if(d>PSHIP.FAR||zoneOf(P.x,P.y)){PSHIPS.splice(PSHIPS.indexOf(s),1);continue}
    if(s.state==='roam'&&sail&&d<=PSHIP.SIGHT&&now>s.calm){s.state='chase';s.until=now+PSHIP.CHASE_S*1000;s.alertAt=now;s.alertUntil=now+900;say('A pirate ship! It turns to give chase!');toast('Pirates!',1200)}
    if(s.state==='chase'){
      if(!sail||d>PSHIP.GIVEUP||now>s.until){s.state='roam';s.calm=now+PSHIP.CALM_S*1000;if(sail)toast('You lost the pirates!',1800);continue}
      if(Math.abs(s.x-P.x)+Math.abs(s.y-P.y)<=1){pshipBoard(s);return}
      const st=pshipStepTo(s);if(st&&!(st[0]===P.x&&st[1]===P.y))pshipMove(s,st[0],st[1]);else if(st)pshipBoard(s);continue}
    // roaming: keep a heading, turn now and then, and turn back at land
    if(!s.dir||Math.random()<.15)s.dir=[[1,0],[-1,0],[0,1],[0,-1]][Math.random()*4|0];
    const nx=s.x+s.dir[0],ny=s.y+s.dir[1];if(pshipWater(nx,ny)&&!(nx===P.x&&ny===P.y))pshipMove(s,nx,ny);else s.dir=null}}
// the pirates board: a red "!", the picture shakes, then the battle (2 or 3 of them, no running away). The ship is gone afterwards, whoever wins.
function pshipBoard(s){if(BATTLE||SCENE||s.boarding)return;s.boarding=1;cancel();releaseAll();const r=pseaRow(),crew=r[5],n=Math.random()<r[4]?3:2,key='pship';
  BATTLES[key]={foes:Array.from({length:n},(_,i)=>crew[i===2?crew.length-1:Math.random()*Math.min(2,crew.length)|0]),field:'sea',noRun:1};
  SEA_ALERT=performance.now()+1300;$('c').classList.add('quake');setTimeout(()=>$('c').classList.remove('quake'),1100);say('Grappling hooks! The pirates are boarding your boat!');toast('!',900);
  setTimeout(()=>{SEA_ALERT=0;const done=()=>{const i=PSHIPS.indexOf(s);if(i>=0)PSHIPS.splice(i,1)};if(BATTLE||SCENE||!sail){done();return}
    startBattle(key,res=>{delete BATTLES[key];done();pshipQuiet=PSHIP.GAP*2;if(res==='won')toast('The pirate ship limps away!',2200)})},1300)}
setInterval(pshipTick,PSHIP.TICK);
// drawing (js/render/draw.js): each ship near the view, sorted with everything else by its row, and the "!" when it starts the chase
function pshipDraw(E,cx,cy,t){if(zoneOf(P.x,P.y))return;
  PSHIPS.forEach(s=>{if(Math.abs(s.rx-P.rx)>14||Math.abs(s.ry-P.ry)>14)return;const bob=Math.round(Math.sin(t/400+s.x));
    E.push({y:s.ry,f:()=>{boatArt(s.tier,s.f==='u'||s.f==='d',s.f,s.rx*T-cx,s.ry*T-cy+bob,'back');if(s.alertUntil>t)alertMark({x:s.rx,y:s.ry-1,alertAt:s.alertAt,alertUntil:s.alertUntil},cx,cy,t)}})})}
