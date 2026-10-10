// ---------- chickens, the spirit, placed stations ----------
function chick(c,cx,cy,t){chickArt(c,cx,cy,t)}   // the art is in js/render/people.js
function ghost(cx,cy,t){ghostArt(cx,cy,t)}
function obj(p,cx,cy,t){stationArt(p,cx,cy,t)}   // the art is in js/render/objects.js
// ---------- farm animals and pets (sprites face right; a.f=1 mirrors them) ----------
function critter(a,cx,cy,t){critterArt(a,cx,cy,t)}
// an arena opponent: drawn like a townsperson, with a health bar (AR is in js/systems/arena.js)
function arenaFoe(cx,cy,t){const x=AR.x*T-cx,y=AR.y*T-cy,w=t-AR.hitAt<250&&((t/60|0)%2);
  CharacterSprite.draw(g,x,y-3,{...lo(AR.look),view:vw(AR.f),frame:AR.on&&((t/200|0)%2)?1:0});
  if(w)R(x,y-3,16,18,'rgba(255,255,255,.55)');
  R(x+1,y-9,14,4,'#383838');R(x+2,y-8,Math.max(0,12*AR.hp/AR.max),2,AR.pois>t?'#9ae06a':'#d84a3a')}
