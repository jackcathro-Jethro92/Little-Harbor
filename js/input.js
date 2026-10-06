// ---------- input ----------
const map={up:'u',down:'d',left:'l',right:'r'};
for(const id in map){const b=$(id);let t=null;const stop=()=>{clearInterval(t);t=null};
  b.addEventListener('pointerdown',e=>{e.preventDefault();move(map[id]);stop();t=setInterval(()=>{move(map[id]);if(S.buff>Date.now())move(map[id])},150)});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop))}
$('act').addEventListener('click',act);$('sleep').addEventListener('click',sleep);
addEventListener('keydown',e=>{if(document.querySelector('.open'))return;
  const k=e.key.toLowerCase(),m={arrowup:'u',w:'u',arrowdown:'d',s:'d',arrowleft:'l',a:'l',arrowright:'r',d:'r'};
  if(m[k]){e.preventDefault();move(m[k]);if(S.buff>Date.now())move(m[k])}else if(k===' '||k==='enter'){e.preventDefault();act()}else if(k==='b'||k==='i'){openBag()}else if(k==='k'){openSkills()}else if(k==='m'){showMap()}});
