// ---------- the Darkwood: gates, treasure, tall grass ----------
function enterForest(north){if(north){P.x=P.rx=136;P.y=P.ry=5+FY;P.f='d'}else{P.x=P.rx=123;P.y=P.ry=38+FY;P.f='u'}say('The trees close in around you...');toast('The Darkwood');ui()}
function exitForest(north){if(north){P.x=P.rx=31;P.y=P.ry=109;P.f='u'}else{P.x=P.rx=36;P.y=P.ry=150;P.f='d'}say('You step back out into the light.');ui()}
function pickup(x,y){const li=Math.max(0,FB.findIndex(p=>p[0]===x&&p[1]===y)),L=FLOOT[li%FLOOT.length],k=y*MW+x,got=[];
  if(L.g){S.gold+=L.g;got.push(L.g+' gold')}L.i.forEach(([id,n])=>{add(id,n);got.push(ITEMS[id].n.toLowerCase()+(n>1?' x'+n:''))});
  S.cut[k]={m:46,d:S.day};M[k]=31;say('You found '+got.join(', ')+'!');toast('Treasure!');ui();save()}
function grassEvent(){const r=Math.random();
  if(r<.07){const id=['basil','moss','forest_sprig','red_cap','blue_cap','death_cap','holly'][Math.random()*7|0];if(!room(id))return;add(id);toast('Found '+ITEMS[id].n.toLowerCase()+' in the grass');ui()}
  else if(r<.10){S.hp=Math.max(1,S.hp-4);flashHit();say('Hornets sting you! -4 health.');ui()}}

// giant centipedes live in the Darkwood: homes in the forest's own coordinates (y 4-39), placed FY rows lower like the rest of the forest. They stay within 5 tiles of home, come back every morning
// and are never on the trail by the gates. Add a row to add one.
const DARKWOOD_CENTIPEDES=[[126,6],[141,9],[104,10],[117,19]];
DARKWOOD_CENTIPEDES.forEach(([x,y])=>spawnEnemy('centipede',x,y+FY));
