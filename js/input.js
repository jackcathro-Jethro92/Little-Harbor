// ---------- input: D-pad and keyboard share one held-direction timer, so phone and PC move at the same speed ----------
const map={up:'u',down:'d',left:'l',right:'r'};
let hold=null; // the direction being held: {d, t (timer)}
const step=d=>{move(d);if(S.buff>Date.now())move(d)}; // swiftness doubles the steps
function holdStop(d){if(hold&&(!d||hold.d===d)){clearTimeout(hold.t);hold=null}}
function holdStart(d){holdStop();step(d);const h=hold={d,t:null},tick=()=>{if(hold!==h)return;if(document.querySelector('.open'))return holdStop();step(d);h.t=setTimeout(tick,sail?STEP_MS.sail:STEP_MS.walk)};h.t=setTimeout(tick,sail?STEP_MS.sail:STEP_MS.walk)}
for(const id in map){const b=$(id);
  b.addEventListener('pointerdown',e=>{e.preventDefault();holdStart(map[id])});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>holdStop(map[id])))}
$('act').addEventListener('click',act);$('sleep').addEventListener('click',sleep);
const KEYDIR={arrowup:'u',w:'u',arrowdown:'d',s:'d',arrowleft:'l',a:'l',arrowright:'r',d:'r'};
addEventListener('keydown',e=>{if(document.querySelector('.open'))return;
  const k=e.key.toLowerCase();
  if(KEYDIR[k]){e.preventDefault();if(!e.repeat)holdStart(KEYDIR[k])}else if(k===' '||k==='enter'){e.preventDefault();act()}else if(k==='b'||k==='i'){openBag()}else if(k==='k'){openSkills()}else if(k==='m'){showMap()}});
addEventListener('keyup',e=>{const d=KEYDIR[e.key.toLowerCase()];if(d)holdStop(d)});
addEventListener('blur',()=>holdStop());
