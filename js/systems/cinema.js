// ---------- cinematics (roadmap 2.12, used first by the sea festival): film bars, a time of day that moves, effects that run in the background, crowds that walk together, and speech that closes by itself ----------
// A cinematic is a scene (js/systems/scenes.js) whose array has `.cine=true`: it gets black film bars, a tap anywhere skips it, and when it ends or is skipped everyone it moved is put back where they were. These extra
// steps work in any scene. The ones marked (background) start something and go straight on to the next step, so use {wait:ms} to give them time.
//   {bars:'on'|'off'}                     slide the film bars in or out
//   {light:[from,to,ms]}  (background)    move the time of day from one number to another (0 to 1 is a whole day: .78 night, .93 dawn, 1.07 morning); {light:'reset'} goes back to the real time
//   {build:[from,to,ms]}  (background)    raise the festival decorations from 0 (none) to 1 (all up)
//   {walks:[[who,x,y,msPerTile],...]}     several people walk at once (x then y); the step ends when they have all arrived. The list may be a function that returns it
//   {crowd:'face'}                        the people at the roadside turn to face the road (and Murl faces the crowd)
//   {speak:'dlg_id', ms:4000}             a line from the DLG table (its first node) in the speech box that closes by itself after ms; no tapping needed
//   {cheer:ms}  (background)              the crowd hops for joy          {lanterns:ms}  (background)  paper lanterns float out from the pier
// Everything a cinematic changes in the picture (time of day, decorations, cheering, lanterns) is put back to normal when it ends or is skipped.
function cineWalker(a,x,y,per){const path=[];let cx=a.x,cy=a.y;while(cx!==x){cx+=cx<x?1:-1;path.push([cx,cy])}while(cy!==y){cy+=cy<y?1:-1;path.push([cx,cy])}
  let k=0,last=[a.x,a.y];const face=(p,q)=>p[0]<q[0]?'r':p[0]>q[0]?'l':p[1]<q[1]?'d':'u';
  const once=()=>{if(k>=path.length)return false;const p=path[k++];a.f=face(last,p);a.x=p[0];a.y=p[1];last=p;return true};
  return {once,all:()=>{while(once());if(a===P){P.rx=P.x;P.ry=P.y;if(typeof reveal==='function')reveal()}},per:per||260,a}}
let LIGHT_T=null,BUILD_T=null;
const cineRamp=(get,set,a,b,ms)=>{const t0=performance.now();set(a);const t=setInterval(()=>{const k=Math.min(1,(performance.now()-t0)/ms);set(a+(b-a)*k);if(k>=1)clearInterval(t)},40);return t};
SCSTEP.bars=(on,c)=>{$('cine').classList.toggle('on',on==='on');c.go()};
SCSTEP.light=(v,c)=>{clearInterval(LIGHT_T);if(v==='reset'||c.fast){SCENE_LIGHT=null;if(typeof lightMorning==='function')lightMorning();return c.go()}
  LIGHT_T=cineRamp(null,x=>{SCENE_LIGHT=x},v[0],v[1],v[2]);c.go()};
SCSTEP.build=(v,c)=>{clearInterval(BUILD_T);if(c.fast){FESTIVAL_BUILD=1;return c.go()}BUILD_T=cineRamp(null,x=>{FESTIVAL_BUILD=x},v[0],v[1],v[2]);c.go()};
SCSTEP.walks=(spec,c)=>{const list=typeof spec==='function'?spec():spec,ws=[];
  list.forEach(([who,x,y,per])=>{const a=scActor(who);if(!a)return;if(a!==P)a.busy=1;else if(sail&&at(x,y)!==0)sail=false;ws.push(cineWalker(a,x,y,per))});
  if(c.fast||!ws.length){ws.forEach(w=>w.all());return c.go()}
  const t0=performance.now();let done=false;
  const iv=setInterval(()=>{const now=performance.now();let moving=false;
    ws.forEach(w=>{if(w.fin)return;w.n=w.n||0;while(now-t0>=w.n*w.per){if(w.once())w.n++;else{w.fin=1;break}}if(!w.fin)moving=true});
    if(!moving){clearInterval(iv);if(!done){done=true;c.go()}}},40);
  c.hold(()=>{clearInterval(iv);done=true;ws.forEach(w=>w.all())})};
SCSTEP.crowd=(mode,c)=>{NPC.forEach(n=>{if(n.n==='Murl')return;if(n.busy&&n.y>=112&&n.y<=127&&n.x>=150&&n.x<=162&&Math.abs(n.x-155.5)>1)n.f=n.x<155.5?'r':'l'});const m=NPC.find(n=>n.n==='Murl');if(m)m.f='u';c.go()};
SCSTEP.speak=(id,c)=>{const d=DLG[id];if(!d)return c.go();const node=d.nodes[d.start],ms=c.st.ms||4000;if(c.fast)return c.go();
  dlgSay(node.who,node.text,()=>c.go());const t=setTimeout(()=>{if(dlgActive())dlgEnd()},ms);c.hold(()=>{clearTimeout(t);dlgDone=null;if(dlgActive())dlgEnd()})};
SCSTEP.cheer=(ms,c)=>{if(!c.fast)CHEER_UNTIL=performance.now()+ms;c.go()};
SCSTEP.lanterns=(ms,c)=>{if(!c.fast){FLOAT_START=performance.now();FLOAT_MS=ms}c.go()};
// when a cinematic ends or is skipped: put the picture and the people back
function cineCleanup(s){SCENE_LIGHT=null;clearInterval(LIGHT_T);clearInterval(BUILD_T);FESTIVAL_BUILD=1;CHEER_UNTIL=0;FLOAT_START=0;$('cine').classList.remove('on');
  if(s&&s.snap)s.snap.forEach(([n,x,y,f])=>{n.x=x;n.y=y;n.f=f});if(s&&s.cine&&typeof lightMorning==='function')lightMorning()}
