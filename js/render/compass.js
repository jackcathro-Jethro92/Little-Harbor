// ---------- Grandfather's compass (roadmap 4.1): a small arrow that points the way to the current quest ----------
// Shown only while the player owns the compass (the item `grandfather_compass`), outdoors, and when the current quest has a goal (QUESTS rows: `goals` or `goal`, js/ui/quests.js). If the goal is on screen a small gold
// marker bobs above it; if it is off screen the arrow sits at the edge of the picture pointing towards it. Drawing only.
// inside the Darkwood (a hidden room of the map) the arrow points to the gate that leads towards the goal: the north gate if the goal is in the north, the south gate otherwise
function compassGoal(){const gl=questGoal(),z=zoneOf(P.x,P.y);if(!gl)return null;if(z===0)return gl;
  if(z===2){if(inFZ(gl[0],gl[1]))return gl;return gl[1]<130?[136,5+FY]:[123,38+FY]}return null}
function drawCompass(cx,cy,t){if(!count('grandfather_compass')||SCENE||BATTLE)return;const gl=compassGoal();if(!gl)return;
  const gx=gl[0]*T+8-cx,gy=gl[1]*T+8-cy,px=P.rx*T+8-cx,py=P.ry*T+8-cy,dx=gx-px,dy=gy-py;if(Math.hypot(dx,dy)<14)return;
  const inside=gx>10&&gx<VW-10&&gy>14&&gy<VH-10;g.save();
  if(inside){const b=Math.round(Math.sin(t/220)*2);g.translate(gx,gy-12+b);g.fillStyle='#2a1810';g.fillRect(-4,-1,9,2);g.fillRect(-1,-4,3,8);g.fillStyle='#f6d070';g.fillRect(-3,0,7,1);g.fillRect(0,-3,1,6);g.fillRect(-2,-1,5,3)}   // a bobbing marker over the goal
  else{const ux=dx/Math.hypot(dx,dy),uy=dy/Math.hypot(dx,dy),sx=(VW/2-12)/Math.max(.001,Math.abs(ux)),sy=(VH/2-14)/Math.max(.001,Math.abs(uy)),s2=Math.min(sx,sy),ex=VW/2+ux*s2,ey=VH/2+uy*s2,pul=1+Math.sin(t/260)*.12;
    g.translate(ex,ey);g.rotate(Math.atan2(uy,ux));g.scale(pul,pul);g.fillStyle='#2a1810';g.beginPath();g.moveTo(8,0);g.lineTo(-5,-6);g.lineTo(-2,0);g.lineTo(-5,6);g.closePath();g.fill();
    g.fillStyle='#f6d070';g.beginPath();g.moveTo(6,0);g.lineTo(-3,-4);g.lineTo(-1,0);g.lineTo(-3,4);g.closePath();g.fill()}
  g.restore()}
