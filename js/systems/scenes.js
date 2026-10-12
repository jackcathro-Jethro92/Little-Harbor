// ---------- scenes (roadmap step 2.4): small cutscenes made of a list of steps ----------
// SCENES.some_id = [step, step, ...]. runScene('some_id', onEnd) plays it; a trigger row starts one with {scene:'some_id'} (js/systems/triggers.js). While a scene plays the player cannot move, use things,
// sleep or open menus, and a small Skip button (or Escape) jumps to the end: every remaining step is applied at once, so people end up where the scene would have left them and flags are still set.
// Steps (one key each):
//   {wait:ms}                         pause                     {fade:'out'|'in', ms:600}   fade the picture to dark / back
//   {walk:['You'|'Name', x, y]}       walk there one tile at a time (along x, then y; choose a clear path, nothing is checked). Add a 4th number for ms per tile (default 220)
//   {face:['You'|'Name', 'l'|'r'|'u'|'d']}                      {tp:['You'|'Name', x, y]}   jump there at once (hide it with a fade)
//   {say:'dlg_id'}                    run a dialogue from DLG   {line:['Who','Text']}       one spoken line
//   {pan:[x, y, ms]}                  slide the camera to a tile; {pan:['back', ms]} slides it back to the player      {shake:ms}  shake the picture
//   anything in TACT (js/systems/triggers.js): {set:'flag'} {clear:'flag'} {give:{item:n}} {gold:n} {toast:'text'} {quest:['q',step]} {move:['Name',x,y]} ... run at once. Note {move} puts a person there for good (saved);
//   {walk} is only for the scene, so walk a person back if they should return.
// A scene never changes where the player really is except through its own walk and tp steps. The camera is released and the fade cleared when it ends or is skipped.
const SCENES={},SCSTEP={};   // SCSTEP: extra step kinds added by other files (the seagull letters add gull and letter)
let SCENE=null,SCENECAM=null;
const scActor=n=>n==='You'?P:NPC.find(q=>q.n===n);
function scEnd(){const s=SCENE;if(!s)return;SCENE=null;SCENECAM=null;clearInterval(s.shakeT);GULL=null;$('c').style.transform='';const fl=$('flash');fl.style.transitionDuration='';fl.style.opacity=0;
  document.body.classList.remove('scene');NPC.forEach(n=>{n.busy=0});if(s.onEnd)s.onEnd()}
// a step that takes time registers `hold`: finish() puts the end state in place and goes on; skipping calls it
function scNext(){const s=SCENE;if(!s)return;if(s.i>=s.steps.length)return scEnd();const st=s.steps[s.i++];let done=false;
  const go=()=>{if(done)return;done=true;s.hold=null;scNext()};const hold=fin=>{s.hold={finish:()=>{fin();go()}}};const fast=s.fast;
  if(st.wait!==undefined){if(fast)return go();const t=setTimeout(go,st.wait);hold(()=>clearTimeout(t))}
  else if(st.fade){const fl=$('flash'),ms=st.ms||600,out=st.fade==='out';fl.style.transitionDuration=ms+'ms';fl.style.opacity=out?1:0;if(fast)return go();const t=setTimeout(go,ms);hold(()=>clearTimeout(t))}
  else if(st.walk){const[who,x,y,per]=st.walk,a=scActor(who);if(!a)return go();if(a!==P)a.busy=1;else if(sail&&at(x,y)!==0)sail=false;   // walking the player onto land means getting out of the boat, which stays where it is
    const path=[];let cx=a.x,cy=a.y;while(cx!==x){cx+=cx<x?1:-1;path.push([cx,cy])}while(cy!==y){cy+=cy<y?1:-1;path.push([cx,cy])}
    let k=0,last=[a.x,a.y];const face=(p,q)=>p[0]<q[0]?'r':p[0]>q[0]?'l':p[1]<q[1]?'d':'u';
    const stepOnce=()=>{if(k>=path.length)return false;const p=path[k++];a.f=face(last,p);a.x=p[0];a.y=p[1];last=p;return true};
    const finish=()=>{while(stepOnce());if(a===P){P.rx=P.x;P.ry=P.y;if(sail){B.x=P.x;B.y=P.y}reveal()}};
    if(fast){finish();return go()}
    const t=setInterval(()=>{if(!stepOnce()){clearInterval(t);if(a===P)reveal();go()}else if(a===P&&sail){B.x=P.x;B.y=P.y}},per||220);hold(()=>{clearInterval(t);finish()})}
  else if(st.face){const a=scActor(st.face[0]);if(a)a.f=st.face[1];go()}
  else if(st.tp){const a=scActor(st.tp[0]);if(a){if(a===P&&sail&&at(st.tp[1],st.tp[2])!==0)sail=false;a.x=st.tp[1];a.y=st.tp[2];if(a===P){P.rx=P.x;P.ry=P.y;if(sail){B.x=P.x;B.y=P.y}reveal()}}go()}
  else if(st.say!==undefined||st.line){if(fast)return go();
    const end=()=>go();const ok=st.say!==undefined?runDialogue(st.say,end):(dlgSay(st.line[0],st.line[1],end),true);if(!ok)return go();
    hold(()=>{dlgDone=null;if(dlgActive())dlgEnd()})}
  else if(st.pan){const p=st.pan,back=p[0]==='back',tx=back?P.x:p[0],ty=back?P.y:p[1],ms=(back?p[1]:p[2])||800,from=SCENECAM||{x:P.rx,y:P.ry};
    if(fast){SCENECAM=back?null:{x:tx,y:ty};return go()}
    const t0=performance.now(),t=setInterval(()=>{const k=Math.min(1,(performance.now()-t0)/ms),e=k*k*(3-2*k);SCENECAM={x:from.x+(tx-from.x)*e,y:from.y+(ty-from.y)*e};if(k>=1){clearInterval(t);if(back)SCENECAM=null;go()}},16);
    hold(()=>{clearInterval(t);SCENECAM=back?null:{x:tx,y:ty}})}
  else if(st.shake!==undefined){if(fast)return go();const c=$('c'),t0=performance.now();clearInterval(s.shakeT);
    s.shakeT=setInterval(()=>{const k=(performance.now()-t0)/st.shake;if(k>=1){clearInterval(s.shakeT);c.style.transform='';return}c.style.transform='translate('+((Math.random()*6-3)*(1-k)).toFixed(1)+'px,'+((Math.random()*6-3)*(1-k)).toFixed(1)+'px)'},40);
    const t=setTimeout(go,st.shake);hold(()=>{clearTimeout(t);clearInterval(s.shakeT);c.style.transform=''})}
  else if(Object.keys(st).some(q=>SCSTEP[q])){const k=Object.keys(st).find(q=>SCSTEP[q]);SCSTEP[k](st[k],{go,hold,fast,s})}
  else{const k=Object.keys(st).find(q=>TACT[q]);if(k)TACT[k](st[k]);go()}}
function runScene(id,onEnd){const steps=Array.isArray(id)?id:SCENES[id];if(!steps||SCENE)return false;cancel();releaseAll();if(dlgActive())dlgEnd();
  SCENE={id:Array.isArray(id)?'(list)':id,steps,i:0,fast:false,hold:null,onEnd,shakeT:null};document.body.classList.add('scene');scNext();return true}
function skipScene(){const s=SCENE;if(!s||s.fast)return;s.fast=true;if(s.hold){s.hold.finish()}else scNext()}
$('scene-skip').onclick=skipScene;
addEventListener('keydown',e=>{if(!SCENE||dlgActive()||$('letter').classList.contains('open'))return;e.stopImmediatePropagation();e.preventDefault();if(e.key==='Escape')skipScene()},true);   // (while a box is open, js/ui/dialogue.js handles Space, Enter and Escape itself)
