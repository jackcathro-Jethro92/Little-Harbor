// ---------- traps in the Depths, and poison (playtest #4, P67) ----------
// Two traps hide in the corridors under the Temple Tower (placed by js/world/depths.js): a dart plate (tile 172, a floor tile with a faint seam; the dart comes from a small hole, tile 173, in the wall across the corridor)
// and a fire vent (tile 174, a floor tile with faint grating). Both are walkable and spring when you step on them (and again if you stay: at most once a second). They are always on one lane of a two-wide corridor, so a careful
// player can walk round them. A dart hurts for TRAP_DART (your Ward helps) and poisons you; a jet of flame hurts for TRAP_FIRE.
// Poison (S.poison, saved, default 0): you lose 1 health with every step for POISON_STEPS steps (never below 1: poison cannot knock you out), shown as PSN beside your health. Any healing potion cures it, and so does sleeping.
const TRAP_DART=8,TRAP_FIRE=14,POISON_STEPS=10;
let TRAPFX=null,trapQuiet=0;
function trapStep(){const t=at(P.x,P.y);if(t!==172&&t!==174)return;const now=performance.now();if(now<trapQuiet)return;trapQuiet=now+1000;
  if(t===172){let from=[P.x,P.y-2];for(const[a,b]of[[0,-2],[0,2],[-2,0],[2,0]])if(at(P.x+a,P.y+b)===173){from=[P.x+a,P.y+b];break}
    TRAPFX={kind:'dart',fx:from[0],fy:from[1],x:P.x,y:P.y,at:now,until:now+500};
    hurt(TRAP_DART,'A dart');if(S.hp>0){S.poison=Math.max(S.poison||0,POISON_STEPS);say($('msg').textContent+' You are poisoned!');ui()}}
  else{TRAPFX={kind:'fire',x:P.x,y:P.y,at:now,until:now+750};$('c').classList.add('quake');setTimeout(()=>$('c').classList.remove('quake'),500);hurt(TRAP_FIRE,'A jet of flame')}}
function poisonStep(){if(!(S.poison>0))return;S.poison--;if(S.hp>1)S.hp--;if(!S.poison)say('The poison wears off.');ui()}
const curePoison=()=>{if(S.poison>0){S.poison=0;ui();return true}return false};
// the picture of a trap going off (called from js/render/draw.js)
function drawTrapFx(cx,cy,t){const f=TRAPFX;if(!f||f.until<=t)return;const k=(t-f.at)/(f.until-f.at),px=f.x*T-cx+8,py=f.y*T-cy+8;
  if(f.kind==='dart'){const sx=f.fx*T-cx+8,sy=f.fy*T-cy+8,u=Math.min(1,k*3),x=sx+(px-sx)*u,y=sy+(py-sy)*u;
    g.fillStyle='#2a2018';g.fillRect(Math.round(x)-1,Math.round(y)-1,3,3);g.fillStyle='#8fd05a';g.fillRect(Math.round(x),Math.round(y),1,1);
    if(u>=1){g.fillStyle='rgba(120,220,80,'+(.6*(1-k)).toFixed(2)+')';g.beginPath();g.arc(px,py,4+k*8,0,7);g.fill()}}
  else{g.fillStyle='rgba(255,170,60,'+(.5*(1-k)).toFixed(2)+')';g.beginPath();g.arc(px,py,10+k*8,0,7);g.fill();raidFlames(px-8,py+8,16,t,3);raidFlames(px-14,py+4,14,t,4)}}
