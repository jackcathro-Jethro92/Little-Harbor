// ---------- the opening film behind the home menu (roadmap 2.12, a first short version) ----------
// While the title menu is open at the start of a visit, the game plays a slow film of its own world behind the buttons: a few shots of the village, Mountain Town, the Walled Settlement and the Sky temple at dusk,
// with the windows and lanterns glowing, people strolling, boats bobbing and the sea moving. It uses the real game picture (nothing is drawn twice), the camera moves by itself and the player's own
// figure is left out. Nothing in the save or the world changes. It stops when you press Continue or New game. The ☰ menu during play has no film.
// Add a shot by adding a row: {x, y} = where the camera starts and {x2, y2} = where it ends (in tiles). Each shot lasts SHOT_MS.
let CINEMA=null;
const SHOTS=[{x:154,y:116,x2:159,y2:123},{x:24,y:73,x2:30,y2:79},{x:96,y:199,x2:104,y2:205},{x:233,y:113,x2:239,y2:108}],SHOT_MS=8000,SHOT_FADE=.09;
function cinemaStart(){CINEMA={t0:performance.now(),phase:.6,cx:0,cy:0};$('title').classList.add('cine')}
function cinemaStop(){CINEMA=null;$('title').classList.remove('cine');$('title-bg').style.opacity=0}
// one frame of the film: put the real player's place aside, point the camera at the shot, draw the world, copy it behind the menu and put everything back
function cinemaFrame(){const c=CINEMA,n=performance.now()-c.t0,i=Math.floor(n/SHOT_MS)%SHOTS.length,k=(n%SHOT_MS)/SHOT_MS,e=k*k*(3-2*k),sh=SHOTS[i];
  const px=sh.x+(sh.x2-sh.x)*e,py=sh.y+(sh.y2-sh.y)*e;c.cx=Math.max(0,Math.min(MW*T-VW,px*T+8-VW/2));c.cy=Math.max(0,Math.min(WH*T-VH,py*T+8-VH/2));
  const keep={x:P.x,y:P.y,rx:P.rx,ry:P.ry,f:P.f,sail};P.x=P.rx=Math.round(px);P.y=P.ry=Math.round(py);sail=false;
  try{draw()}finally{P.x=keep.x;P.y=keep.y;P.rx=keep.rx;P.ry=keep.ry;P.f=keep.f;sail=keep.sail}
  const bg=$('title-bg');bg.getContext('2d').drawImage($('c'),0,0);bg.style.opacity=(k<SHOT_FADE||k>1-SHOT_FADE)?0:1}
