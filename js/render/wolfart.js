// ---------- the wolves (Jack's reference sheet): shaggy, long-bodied wolves with a heavy mane, a big bushy tail and the head held low, in four coats ----------
// One pixel drawing (WOLF_PIX, facing right; O outline, L light fur, M mid fur, D dark fur, E eye, W teeth) in two walking frames, coloured by WOLF_COL (by the wolf's name).
// On the map it is drawn as it is (about two and a half tiles long); in battle it is doubled with the EPX pixel-art scaler, which rounds the steps, and given fur strands.
const WOLF_COL={'White wolf':{O:'#3a3e48',L:'#ffffff',M:'#d8dce4',D:'#9aa0ac',E:'#d83a4a'},'Pale wolf':{O:'#3a342a',L:'#f0e8d4',M:'#cfc4aa',D:'#8f8670',E:'#3a2a20'},
  'Grey wolf':{O:'#141a22',L:'#7a8a9c',M:'#4e5e70',D:'#2e3a48',E:'#d83a4a'},'Black wolf':{O:'#101010',L:'#6a6a6a',M:'#444444',D:'#262626',E:'#e8d040'}};
const WOLF_FRAME0=[
 "..............................O...O.....",
 "......................O.O....OLO.OLO....",
 "....................O.OLOLO.OLLLOLLLO...",
 "...................OLOLLLLLOLLLLLLLLLO..",
 "...OOO......OOOOOOOLLLLLLLLLLLLLLLELLLO.",
 "..OLLLOO..OOLLLLLLLLLLMLLLLLLMLLLLLLLLLO",
 ".OLLMMLLOOLLLLLLLLLLMMMMLLLMMMMMMMDDDOOO",
 "OLLMMMMLLLLLLLLLLMMMMMMMMMMMMMMMMDDWO...",
 "OLMMMDMMMMMMMMMMMMMMMMMMMMMMMMMDOOO.....",
 "OLMMDDMMMMMMMMMMMMMMMMMMMMMMMMDMDO......",
 "OLMDDMMMMMMMMMMMMMDMMMMMMMMMMDMDO.......",
 ".OLDOODMMMMMMDDOOODDMMMMMMDDDODO........",
 "..OO..ODMMMDDO....OODMMMDDODO...........",
 ".......ODDMDDO......ODDDO.ODDO..........",
 ".......ODDO.ODO.....ODDO..ODDO..........",
 "......ODDO..ODO.....ODO...ODO...........",
 "......ODO...ODO.....ODO...ODO...........",
 ".....ODDO..ODDO....ODDO..ODDO...........",
 ".....OOO...OOO.....OOO...OOO............"];
// the second walking frame: the back legs step one pixel back and the front legs one pixel forward (rows 14 and down)
const WOLF_PIX=[WOLF_FRAME0,WOLF_FRAME0.map((r,y)=>y<14?r:[...r].map((_,x)=>x<18?(x>0?r[x-1]:'.'):(r[x+1]||'.')).join(''))];
const WOLF_CACHE=new Map();
// the wolf as a small canvas: frame 0 or 1, flipped to face left when `left`, at 1x (map) or doubled with EPX (battle), white when it has just been hit
function wolfCanvas(name,frame,left,big,flash){const key=name+frame+(left?1:0)+(big?1:0)+(flash?1:0);if(WOLF_CACHE.has(key))return WOLF_CACHE.get(key);
  const col=WOLF_COL[name]||WOLF_COL['Grey wolf'];let g0=WOLF_PIX[frame].map(r=>left?[...r].reverse():[...r]);
  if(big){const h=g0.length,w=g0[0].length,o=[];for(let y=0;y<h*2;y++)o.push(new Array(w*2).fill('.'));
    const at=(x,y)=>x<0||y<0||x>=w||y>=h?'.':g0[y][x];
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const P=at(x,y),A=at(x,y-1),B=at(x+1,y),C=at(x-1,y),D=at(x,y+1);let a=P,b=P,c=P,d=P;
      if(C===A&&C!==D&&A!==B)a=A;if(A===B&&A!==C&&B!==D)b=B;if(D===C&&D!==B&&C!==A)c=C;if(B===D&&B!==A&&D!==C)d=D;o[y*2][x*2]=a;o[y*2][x*2+1]=b;o[y*2+1][x*2]=c;o[y*2+1][x*2+1]=d}
    g0=o}
  const h=g0.length,w=g0[0].length,cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d');
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=g0[y][x];if(k==='.')continue;c.fillStyle=flash&&k!=='O'?'#ffffff':k==='W'?'#f4f0e8':col[k];c.fillRect(x,y,1,1)}
  if(big&&!flash){c.fillStyle=col.D;for(let i=0;i<18;i++){const x=14+((i*37)%50),y=10+((i*13)%10);if(g0[y]&&g0[y][x]==='L'||g0[y]&&g0[y][x]==='M')c.fillRect(x,y,1,2)}   // fur strands
    c.fillStyle=col.L;for(let i=0;i<12;i++){const x=8+((i*29)%60),y=6+((i*7)%8);if(g0[y]&&g0[y][x]==='L')c.fillRect(x,y,2,1)}}
  WOLF_CACHE.set(key,cv);return cv}
// on the map: two tiles long, trotting while it moves, facing the way it goes
function wolfArt(e,cx,cy,t){const name=ENEMY_TYPES[e.t].n,left=!(e.f==='r'||e.f==='d'&&(e.x+e.y)%2===0),fr=(t/160|0)%2,flash=t-e.hitAt<250&&((t/60|0)%2),x=e.x*T-cx-12,y=e.y*T-cy-3;
  R(x+5,y+17,28,2,'rgba(0,0,0,.25)');g.drawImage(wolfCanvas(name,fr,left,false,flash),x|0,y|0)}
