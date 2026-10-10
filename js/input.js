// ---------- input: D-pad and keyboard share one held-direction system, so phone and PC move the same way ----------
// Held directions are kept in a list (oldest first); the newest one still held decides where you go. Pressing a direction you are not facing only turns you on the spot; if you keep
// holding it past TURN_MS you start walking. Pressing the direction you already face takes one step at once and, if held, keeps walking after REPEAT_MS. So a quick tap turns, or moves exactly
// one tile, and holding walks. Letting go of the newest key while an older one is still held carries on in the older direction instead of stopping.
const map={up:'u',down:'d',left:'l',right:'r'},TURN_MS=120,REPEAT_MS=170;
const held=[];let walkTimer=null;
const step=d=>{move(d);if(S.buff>Date.now())move(d)}; // swiftness doubles the steps
const turn=d=>{if(fs)cancel();P.f=d};
const stopTimer=()=>{clearTimeout(walkTimer);walkTimer=null};
function schedule(d,ms){stopTimer();const tick=()=>{if(held[held.length-1]!==d)return;if(document.querySelector('.open'))return releaseAll();step(d);walkTimer=setTimeout(tick,sail?STEP_MS.sail:STEP_MS.walk)};walkTimer=setTimeout(tick,ms)}
function pressDir(d){const i=held.indexOf(d);if(i>=0)held.splice(i,1);held.push(d);
  if(P.f===d){step(d);schedule(d,REPEAT_MS)}else{turn(d);schedule(d,TURN_MS)}}
function releaseDir(d){const i=held.indexOf(d);if(i<0)return;const wasTop=i===held.length-1;held.splice(i,1);
  if(!held.length)return stopTimer();
  if(wasTop){const n=held[held.length-1];turn(n);schedule(n,sail?STEP_MS.sail:STEP_MS.walk)}}   // the older key is still down: carry on that way
function releaseAll(){held.length=0;stopTimer()}
for(const id in map){const b=$(id);
  b.addEventListener('pointerdown',e=>{e.preventDefault();pressDir(map[id])});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>releaseDir(map[id])))}
$('act').addEventListener('click',act);$('sleep').addEventListener('click',sleep);
const KEYDIR={arrowup:'u',w:'u',arrowdown:'d',s:'d',arrowleft:'l',a:'l',arrowright:'r',d:'r'};
addEventListener('keydown',e=>{if(document.querySelector('.open'))return;
  const k=e.key.toLowerCase();
  if(KEYDIR[k]){e.preventDefault();if(!e.repeat)pressDir(KEYDIR[k])}else if(k===' '||k==='enter'){e.preventDefault();act()}else if(k==='b'||k==='i'){openBag()}else if(k==='k'){openSkills()}else if(k==='m'){showMap()}});
addEventListener('keyup',e=>{const d=KEYDIR[e.key.toLowerCase()];if(d)releaseDir(d)});
addEventListener('blur',releaseAll);
