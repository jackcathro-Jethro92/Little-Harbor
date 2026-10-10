// ---------- ships: rowboat, sloop, schooner and brig, drawn from real sailing ships (graphics, boats remodelled) ----------
// Reference: the sailing-ship chart Jack supplied. Rowboat (oars, no sail); sloop (one mast, a mainsail and a jib); schooner (two masts with fore-and-aft gaff sails and jibs); brig (two masts carrying
// square sails, a spanker and jibs, a black hull with a yellow stripe and gun ports). Sailing left or right shows the ship from the side, bow first; sailing up or down shows it end on.
// Each is drawn once into a cached picture (js/render/plants.js `sprite`); the sails stand above the tile, the hull sits on the water at the boat's tile. Drawing only.
const SHIPSPEC=[
 {id:'rowboat',L:20,Hh:5,hull:'#7a4a26',mid:'#a8703a',rail:'#d8a868',stripe:null,dark:'#3a2210'},
 {id:'sloop',L:26,Hh:6,hull:'#24507e',mid:'#3f7ab0',rail:'#e8eef4',stripe:'#f2f6fa',dark:'#10243a',sail:'#f4efe0',shade:'#d4cdb6'},
 {id:'schooner',L:36,Hh:7,hull:'#3a2a20',mid:'#6a4a38',rail:'#d8c8a0',stripe:'#b04a3c',dark:'#1c120c',sail:'#efe6cc',shade:'#cbbd96'},
 {id:'brig',L:46,Hh:9,hull:'#1e1e28',mid:'#34343e',rail:'#8a8a94',stripe:'#d8b040',dark:'#0c0c12',sail:'#f6f2e6',shade:'#cfc9b6'}];
function shpPoly(c,pts,col){c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}
function shpLine(c,x0,y0,x1,y1,col,w){c.strokeStyle=col;c.lineWidth=w||1;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke()}
function shpHull(c,s){const L=s.L,H=s.Hh;   // side view, rail line at y = 0, bow to the right
  shpPoly(c,[[-L/2,0],[L/2-2,0],[L/2+4,-2],[L/2-3,H],[-L/2+4,H],[-L/2,H-2]],s.dark);
  shpPoly(c,[[-L/2+1,1],[L/2-3,1],[L/2+2,-1],[L/2-4,H-1],[-L/2+4,H-1],[-L/2+1,H-3]],s.hull);
  shpPoly(c,[[-L/2+1,H*.55],[L/2-5,H*.55],[L/2-4,H-1],[-L/2+4,H-1],[-L/2+1,H-3]],s.mid);
  c.fillStyle=s.rail;c.fillRect(-L/2,-1,L-1,2);c.fillRect(L/2-2,-2,4,1);
  if(s.stripe){c.fillStyle=s.stripe;c.fillRect(-L/2+2,H*.35|0,L-7,1)}
  if(s.id==='brig'){c.fillStyle=s.dark;for(let x=-L/2+6;x<L/2-6;x+=6)c.fillRect(x,3,3,2);c.fillStyle='#f2c84a';c.fillRect(-L/2+1,2,2,2);c.fillStyle=s.dark;c.fillRect(-L/2+1,1,3,1)}   // gun ports and a stern window
  if(s.id==='rowboat'){c.fillStyle=s.dark;c.fillRect(-6,0,12,1);c.fillStyle='#c9965a';c.fillRect(-5,-1,10,1);shpLine(c,-3,-1,-9,5,'#6b4423',1);shpLine(c,4,-1,10,5,'#6b4423',1);c.fillStyle='#d8b878';c.fillRect(-10,5,2,1);c.fillRect(9,5,2,1)}   // seats and oars
  c.fillStyle='rgba(255,255,255,.18)';c.fillRect(-L/2+1,0,L-4,1)}
function shpSide(c,s){   // sails first, then the hull over their feet
  const Wd=s.sail,Sh=s.shade,M='#5a3a24',L=s.L;
  if(s.id==='sloop'){const m=-1;
    shpPoly(c,[[m,-27],[m,-3],[-L/2-1,-3]],Wd);shpPoly(c,[[m,-27],[m-3,-9],[m-5,-3],[-L/2-1,-3]],Sh);   // mainsail with a shaded fold
    shpPoly(c,[[m+1.5,-26],[m+1.5,-3],[L/2+9,-4]],Wd);shpPoly(c,[[m+1.5,-26],[m+4,-12],[L/2+9,-4],[m+1.5,-3]],Sh);
    shpLine(c,m+.5,-29,m+.5,-1,M,2);shpLine(c,m,-3,-L/2-1,-3,M,1);shpLine(c,L/2-2,-1,L/2+9,-4,M,1);pF(c,m-1,-31,5,2,'#d83828');}
  else if(s.id==='schooner'){const f=7,mm=-8;
    shpPoly(c,[[f+1.5,-27],[f+1.5,-4],[L/2+11,-5]],Wd);shpPoly(c,[[f+1.5,-27],[f+4,-15],[L/2+11,-5],[f+1.5,-4]],Sh);   // big jib
    shpPoly(c,[[f+1.5,-18],[f+1.5,-4],[L/2+4,-5]],Sh);                                                                 // second jib
    shpPoly(c,[[f,-25],[f-11,-21],[f-13,-4],[f,-4]],Wd);shpPoly(c,[[f,-25],[f-5,-23],[f-6,-4],[f,-4]],Sh);              // fore gaff sail
    shpPoly(c,[[mm,-30],[mm-12,-26],[mm-15,-4],[mm,-4]],Wd);shpPoly(c,[[mm,-30],[mm-6,-28],[mm-7,-4],[mm,-4]],Sh);      // main gaff sail
    shpPoly(c,[[f,-32],[f-3,-26],[f+4,-27]],Wd);shpPoly(c,[[mm,-37],[mm-5,-30],[mm+5,-31]],Wd);                        // topsails
    shpLine(c,f+.5,-33,f+.5,-1,M,2);shpLine(c,mm+.5,-38,mm+.5,-1,M,2);shpLine(c,L/2-3,-1,L/2+11,-5,M,1);pF(c,mm-1,-40,5,2,'#b04a3c');}
  else if(s.id==='brig'){const f=11,mm=-8,tier=(m,y,w,h,k)=>{shpPoly(c,[[m-w/2+k,y],[m+w/2+k,y],[m+w/2+k+1,y+h],[m-w/2+k-1,y+h]],Wd);shpPoly(c,[[m-w/2+k,y],[m-w/2+k+3,y],[m-w/2+k+2,y+h],[m-w/2+k-1,y+h]],Sh);pF(c,m-w/2+k-1,y+h,w+2,1,'#b8b098')};
    shpPoly(c,[[f+2,-33],[f+2,-5],[L/2+12,-6]],Wd);shpPoly(c,[[f+2,-24],[f+2,-5],[L/2+6,-6]],Sh);shpPoly(c,[[f+2,-40],[f+2,-34],[L/2+6,-8]],Wd);                      // three jibs
    shpPoly(c,[[mm-1,-34],[mm-13,-29],[mm-17,-5],[mm-1,-5]],Wd);shpPoly(c,[[mm-1,-34],[mm-7,-32],[mm-9,-5],[mm-1,-5]],Sh);                                       // spanker
    for(const m of[f,mm]){const top=m===f?-45:-47;tier(m,top+2,11,7,1);tier(m,top+11,15,9,1);tier(m,top+22,19,11,1)}                                              // royal, topsail and course
    shpLine(c,f+.5,-47,f+.5,-1,M,2);shpLine(c,mm+.5,-49,mm+.5,-1,M,2);shpLine(c,L/2-3,-1,L/2+12,-6,M,1);for(const m of[f,mm])pF(c,m-1,m===f?-48:-50,5,2,'#d83828')}
  shpHull(c,s)}
function shpEnd(c,s,away){   // seen from ahead (away=false) or from behind (away=true): the hull is short and the square sails face you
  const B=s.id==='rowboat'?9:s.id==='sloop'?11:s.id==='schooner'?13:17,H=s.Hh;
  const sails=()=>{const Wd=s.sail,Sh=s.shade,M='#5a3a24';
    if(s.id==='sloop'){shpLine(c,0,-28,0,-1,M,2);pF(c,away?-5:1,-26,4,20,Wd);pF(c,away?-1:-1,-26,1,22,Sh);pF(c,-1,-30,5,2,'#d83828')}
    else if(s.id==='schooner'){shpLine(c,-4,-32,-4,-1,M,2);shpLine(c,4,-27,4,-1,M,2);pF(c,-7,-30,3,24,Wd);pF(c,5,-25,3,20,Wd);pF(c,away?-2:0,-22,2,18,Sh)}
    else if(s.id==='brig'){for(const[m,top,sc]of[[-4,-48,.8],[3,-44,1]]){shpLine(c,m,top-2,m,-1,M,2);for(const[yy,w,h]of[[2,8,7],[11,12,9],[22,15,11]]){const ww=Math.round(w*sc);pF(c,m-ww/2|0,top+yy,ww,h,Wd);pF(c,m-ww/2|0,top+yy,ww,2,Sh);pF(c,m-ww/2|0,top+yy+h,ww,1,'#b8b098')}}}};
  sails();
  shpPoly(c,[[-B/2-1,0],[B/2+1,0],[B/2-1,H+1],[-B/2+1,H+1]],s.dark);shpPoly(c,[[-B/2,1],[B/2,1],[B/2-2,H],[-B/2+2,H]],s.hull);shpPoly(c,[[-B/2+1,H*.5],[B/2-1,H*.5],[B/2-2,H],[-B/2+2,H]],s.mid);
  c.fillStyle=s.rail;c.fillRect(-B/2-1,-1,B+2,2);if(s.stripe){c.fillStyle=s.stripe;c.fillRect(-B/2+1,H*.35|0,B-2,1)}
  if(away&&s.id!=='rowboat'){c.fillStyle='#f2c84a';c.fillRect(-2,2,4,2);c.fillStyle=s.dark;c.fillRect(0,2,1,2)}}
function boatSprite(tier,dir,part){const s=SHIPSPEC[tier]||SHIPSPEC[0];return sprite('ship'+tier+dir+part,96,80,c=>{c.translate(48,56);   // the rail line of the hull's middle is at (48,56)
    const draw=()=>{if(dir==='l'){c.scale(-1,1);shpSide(c,s)}else if(dir==='r')shpSide(c,s);else shpEnd(c,s,dir==='u')};
    if(part==='front'){c.save();c.beginPath();c.rect(-60,-1,120,4);c.clip();draw();c.restore()}else draw()})}
function boatArt(tier,vert,dir,bx,by,part){g.drawImage(boatSprite(tier,dir,part),(bx|0)+8-48,(by|0)+9-56)}
