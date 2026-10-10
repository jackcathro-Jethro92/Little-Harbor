// ---------- chickens, the spirit, placed stations ----------
function chick(c,cx,cy,t){chickArt(c,cx,cy,t)}   // the art is in js/render/people.js
function ghost(cx,cy,t){ghostArt(cx,cy,t)}
function obj(p,cx,cy,t){const x=p.x*T-cx,y=p.y*T-cy,fl=((t/130)|0)%3,O='#2e1f10';R(x+1,y+13,14,3,'#00000030');
  if(p.id==='camp_kit'){R(x+3,y+1,2,2,O);R(x+1,y+3,6,2,O);R(x,y+5,8,3,O);R(x+3,y+2,1,1,'#e8d09a');R(x+2,y+4,4,1,'#d8b878');R(x+1,y+6,6,2,'#d8b878');R(x+3,y+6,2,2,'#3d2a14');
    R(x+7,y+10,8,5,'#6e7068');R(x+8,y+11,6,3,O);R(x+8,y+12,6,1,'#7a5230');R(x+10,y+7+(fl%2),2,4,'#f2a22e');R(x+9,y+9,4,3,'#e8632e');R(x+10,y+9,2,2,'#ffe27a')}
  else if(p.id==='alchemy_station'){R(x+1,y+8,14,7,O);R(x+2,y+9,12,5,'#a8743f');R(x+3,y+3,10,7,O);R(x+4,y+4,8,5,'#3a3a44');R(x+4,y+4,8,2,'#8a5ac8');R(x+6+(fl%2)*3,y+1-fl%2,2,2,'#c8a0f0');R(x+12,y+9,2,4,'#4a9ae0')}
  else if(p.id==='shipwright'){R(x+2,y+12,3,4,'#6b4423');R(x+11,y+12,3,4,'#6b4423');R(x,y+6,16,7,O);R(x+1,y+7,14,5,'#a8743f');R(x+13,y+5,3,3,O);R(x+3,y+3,1,6,'#d8b878');R(x+7,y+2,1,7,'#d8b878');R(x+11,y+3,1,6,'#d8b878');R(x+1,y+9,14,1,'#7a5230')}
  else if(p.id==='cooking_station'){R(x+1,y+6,14,9,O);R(x+2,y+7,12,7,'#8d8f87');R(x+3,y+3,10,5,O);R(x+4,y+4,8,3,'#3a3a44');R(x+5,y+4,6,1,'#d98a3a');R(x+5,y+11,6,3,fl?'#e8632e':'#f2a22e');R(x+6+(fl%2),y+1-fl%2,2,2,'rgba(255,255,255,.65)')}
  else if(p.id==='standard_bench'){R(x+1,y+5,14,5,O);R(x+2,y+6,12,3,'#a8743f');R(x+2,y+6,12,1,'#c9965a');R(x+2,y+10,2,5,'#6b4423');R(x+12,y+10,2,5,'#6b4423');R(x+4,y+3,6,2,'#c9d2da');R(x+10,y+4,4,1,'#d8b878')}
  else{R(x+1,y+4,14,11,O);R(x+2,y+5,12,9,'#8d8f87');R(x+2,y+5,12,2,'#a9aaa3');R(x+4,y+8,8,5,O);R(x+5,y+10,6,3,fl?'#e8632e':'#f2a22e');R(x+11,y,3,5,'#6e7068')}}
// ---------- farm animals and pets (sprites face right; a.f=1 mirrors them) ----------
function critter(a,cx,cy,t){critterArt(a,cx,cy,t)}
// an arena opponent: drawn like a townsperson, with a health bar (AR is in js/systems/arena.js)
function arenaFoe(cx,cy,t){const x=AR.x*T-cx,y=AR.y*T-cy,w=t-AR.hitAt<250&&((t/60|0)%2);
  CharacterSprite.draw(g,x,y-3,{...lo(AR.look),view:vw(AR.f),frame:AR.on&&((t/200|0)%2)?1:0});
  if(w)R(x,y-3,16,18,'rgba(255,255,255,.55)');
  R(x+1,y-9,14,4,'#383838');R(x+2,y-8,Math.max(0,12*AR.hp/AR.max),2,AR.pois>t?'#9ae06a':'#d84a3a')}
