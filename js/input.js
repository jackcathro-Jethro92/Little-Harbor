// ---------- input ----------
const map={up:'u',down:'d',left:'l',right:'r'};
for(const id in map){const b=$(id);let t=null;const stop=()=>{clearTimeout(t);t=null};
  b.addEventListener('pointerdown',e=>{e.preventDefault();move(map[id]);stop();const tick=()=>{move(map[id]);if(S.buff>Date.now())move(map[id]);t=setTimeout(tick,sail?STEP_MS.sail:STEP_MS.walk)};t=setTimeout(tick,sail?STEP_MS.sail:STEP_MS.walk)});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop))}
$('act').addEventListener('click',act);$('sleep').addEventListener('click',sleep);
let kbSkip=false; // a held key on land only moves on every other repeat, so walking is half speed
addEventListener('keydown',e=>{if(document.querySelector('.open'))return;
  const k=e.key.toLowerCase(),m={arrowup:'u',w:'u',arrowdown:'d',s:'d',arrowleft:'l',a:'l',arrowright:'r',d:'r'};
  if(m[k]){e.preventDefault();if(e.repeat&&!sail&&(kbSkip=!kbSkip))return;move(m[k]);if(S.buff>Date.now())move(m[k])}else if(k===' '||k==='enter'){e.preventDefault();act()}else if(k==='b'||k==='i'){openBag()}else if(k==='k'){openSkills()}else if(k==='m'){showMap()}});
