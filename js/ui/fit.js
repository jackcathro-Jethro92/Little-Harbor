// ---------- the game picture fills the window's height (Jack, after playtest #5) ----------
// The picture keeps the same view of the world (176 x 208 game pixels, drawn sharp), but on a PC it grows as tall as the browser window allows, with the stats, the message line and the buttons
// still showing below it. The rows of bars and buttons widen to match the picture. On a narrow window (a phone) nothing changes: the page keeps its old size of at most 352 pixels across.
// It works by measuring how much room everything else on the page takes, and setting --gamew (the width of the picture and the rows) to whatever is left. It runs at load and whenever the window changes size.
function fitGame(){const root=document.documentElement,wrap=$('wrap');if(!wrap)return;
  root.style.setProperty('--gamew','352px');   // measure the page at its old size first
  const others=document.body.scrollHeight-wrap.getBoundingClientRect().height,room=innerHeight-others-6,byH=Math.floor(room*176/208),byW=innerWidth-24;
  let w=innerWidth<=480?352:Math.max(352,Math.min(byH,byW));root.style.setProperty('--gamew',w+'px');
  // a second look: the rows can wrap differently once wider, so take off whatever still spills below the window
  const over=document.documentElement.scrollHeight-innerHeight;if(w>352&&over>0){w=Math.max(352,w-Math.ceil(over*176/208)-1);root.style.setProperty('--gamew',w+'px')}}
addEventListener('resize',fitGame);addEventListener('load',fitGame);fitGame();setTimeout(fitGame,400);   // (again once the page has finished starting, when the message line and buttons have their final size)
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitGame);   // (the page font changes the heights a little once it has loaded)
