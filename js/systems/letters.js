// ---------- seagull letters (roadmap step 2.7) ----------
// LETTERS.some_id = {from:'Who sent it', title:'Short title', text:'The letter. A blank line starts a new paragraph.'}. A trigger row with {letter:'some_id'} sends it: a seagull flies in, lands beside the player,
// the letter opens to read, and when it is closed the gull flies off and the letter is kept in the bag's LETTERS pocket (S.letters, saved) to re-read at any time. A letter you already have is not sent twice.
// It is a small scene (js/systems/scenes.js), so the player cannot move while it plays, and Skip keeps the letter without showing it. The words are placeholders until Jack's own text is added (STORY_TEXT.md).
const LETTERS={};
let GULL=null;
const myLetters=()=>{if(!Array.isArray(S.letters))S.letters=[];return S.letters};
const hasLetter=id=>myLetters().includes(id);
// the tile the gull lands on: in front of the player if it is free, else beside or behind
function gullSpot(){if(sail)return[P.x,P.y];   // aboard the boat the gull lands on the boat
 const f=[P.f,...({u:'lrd',d:'lru',l:'udr',r:'udl'}[P.f]||'').split('')];
  for(const d of f){const x=P.x+D[d][0],y=P.y+D[d][1];if(at(x,y)!==undefined&&WK.includes(at(x,y))&&!npcAt(x,y)&&!(B.x===x&&B.y===y))return[x,y]}return[P.x,P.y-1]}
function drawGull(cx,cy,t){const G2=GULL;if(!G2)return;const x=G2.x-cx,y=G2.y-cy-G2.h,flap=G2.fly?Math.sin(t/110)>0:0;
  g.fillStyle='rgba(0,0,0,.22)';g.fillRect((G2.x-cx)-3|0,(G2.y-cy)+4,7,2);
  const W='#f4f6f8',Gy='#8c97a6',Dk='#3a4250',Or='#e8a23a';
  R(x-3,y-2,7,3,W);R(x+4,y-3,3,3,W);R(x+7,y-2,2,1,Or);R(x+5,y-3,1,1,Dk);   // body, head, beak, eye
  if(G2.fly){if(flap){R(x-4,y-7,3,5,Gy);R(x+1,y-8,3,6,Gy)}else{R(x-5,y-1,4,2,Gy);R(x+1,y,5,2,Gy)}}
  else{R(x-3,y-2,5,2,Gy);R(x-4,y-1,2,1,Dk)}   // wings folded
  R(x-1,y+1,1,2,Or);R(x+1,y+1,1,2,Or)}
const gullTo=(from,to,ms,h0,h1,fly,done)=>{const t0=performance.now();GULL={x:from[0],y:from[1],h:h0,fly};
  const tick=()=>{if(!GULL)return;const k=Math.min(1,(performance.now()-t0)/ms),e=k*(2-k);GULL.x=from[0]+(to[0]-from[0])*e;GULL.y=from[1]+(to[1]-from[1])*e+Math.sin(k*Math.PI)*-6;GULL.h=h0+(h1-h0)*e;GULL.fly=k<1?true:fly&&k<1;
    if(k<1)GULL.raf=requestAnimationFrame(tick);else{GULL.fly=false;done&&done()}};
  tick();return()=>{if(GULL)cancelAnimationFrame(GULL.raf)}};
// the camera is where the player is, so screen position = world pixels minus the camera; the gull is placed in world pixels
function camNow(){const cx=Math.max(0,Math.min(MW*T-VW,P.rx*T+8-VW/2)),cy=Math.max(0,Math.min((zoneOf(P.x,P.y)?MH:WH)*T-VH,P.ry*T+8-VH/2));return[cx|0,cy|0]}
// ----- the letter paper -----
let letterDone=null;
function openLetter(id,onClose){const L=LETTERS[id];if(!L)return onClose&&onClose();letterDone=onClose||null;
  $('letter-from').textContent=L.from?'From '+L.from:'';$('letter-title').textContent=L.title||'';
  $('letter-text').innerHTML=(L.text||'').split(/\n\s*\n/).map(p=>'<p>'+p.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</p>').join('');
  $('letter').classList.add('open');$('letter-body').scrollTop=0}
function closeLetter(){if(!$('letter').classList.contains('open'))return;$('letter').classList.remove('open');const f=letterDone;letterDone=null;if(f)f()}
$('letter-close').onclick=closeLetter;
addEventListener('keydown',e=>{if(!$('letter').classList.contains('open'))return;if(['escape','backspace','x','enter',' '].includes(e.key.toLowerCase())){e.preventDefault();e.stopImmediatePropagation();closeLetter()}},true);
// ----- scene steps: {gull:'in'}, {gull:'out'}, {read:'id'} -----
SCSTEP.gull=(mode,c)=>{const[cx,cy]=camNow();
  if(mode==='in'){const[tx,ty]=gullSpot(),to=[tx*T+8,ty*T+12];if(c.fast){GULL={x:to[0],y:to[1],h:0,fly:false};return c.go()}
    const stop=gullTo([cx-24,cy+6],to,3400,46,0,true,()=>setTimeout(c.go,500));c.hold(()=>{stop();GULL={x:to[0],y:to[1],h:0,fly:false}})}
  else{if(!GULL||c.fast){GULL=null;return c.go()}const from=[GULL.x,GULL.y],to=[cx+VW+30,cy-20];
    const stop=gullTo(from,to,2800,0,50,true,()=>{GULL=null;c.go()});c.hold(()=>{stop();GULL=null})}};
SCSTEP.read=(id,c)=>{if(!LETTERS[id])return c.go();if(!hasLetter(id)){myLetters().push(id);save()}
  if(c.fast)return c.go();openLetter(id,()=>c.go());c.hold(()=>{letterDone=null;$('letter').classList.remove('open')})};
// sends a letter by a seagull (a trigger row {letter:'id'} calls this); returns false if there is nothing to do
function sendLetter(id,onEnd){if(!LETTERS[id]||hasLetter(id))return false;return runScene([{wait:300},{gull:'in'},{read:id},{gull:'out'}],onEnd)}
