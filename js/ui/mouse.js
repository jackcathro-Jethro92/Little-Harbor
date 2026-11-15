// ---------- clicking on the picture (Jack, after playtest #5: the game is played on a PC) ----------
// The on-screen arrow pad and Use button are gone. A left click on a tile right next to you turns you to face it and does what Use (Space or Enter) would: talk, open, chop, mine, fish, place.
// While a fish is biting, a click anywhere on the picture hooks it; while someone is talking, a click moves the words on. A click further away says to walk closer. People are drawn a little taller than
// their tile, so a click on someone's head counts for the tile they stand on.
function clickTile(e){const c=$('c'),r=c.getBoundingClientRect(),b=2,gx=(e.clientX-r.left-b)/(r.width-2*b)*VW+CAM.x,gy=(e.clientY-r.top-b)/(r.height-2*b)*VH+CAM.y;return[Math.floor(gx/T),Math.floor(gy/T)]}
$('c').addEventListener('click',e=>{if(SCENE||BATTLE||document.querySelector('.open'))return;
  if(dlgActive()){dlgAdvance();return}
  if(fs){act();return}   // fishing: a click hooks the fish (or says it is too early)
  let[tx,ty]=clickTile(e);const near=(x,y)=>Math.abs(x-P.x)+Math.abs(y-P.y)===1;
  if(!near(tx,ty)&&near(tx,ty+1)&&(npcAt(tx,ty+1)||enemyAt(tx,ty+1)))ty++;
  if(tx===P.x&&ty===P.y){act();return}   // a click on yourself uses what you face
  if(!near(tx,ty)){say('Walk up next to it, then click it.');return}
  P.f=tx>P.x?'r':tx<P.x?'l':ty>P.y?'d':'u';act()});
