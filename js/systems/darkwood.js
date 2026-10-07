// ---------- the Darkwood: gates, treasure, tall grass ----------
function enterForest(north){if(north){P.x=P.rx=136;P.y=P.ry=5;P.f='d'}else{P.x=P.rx=123;P.y=P.ry=38;P.f='u'}say('The trees close in around you...');toast('The Darkwood');ui()}
function exitForest(north){if(north){P.x=P.rx=31;P.y=P.ry=109;P.f='u'}else{P.x=P.rx=36;P.y=P.ry=150;P.f='d'}say('You step back out into the light.');ui()}
function pickup(x,y){const li=Math.max(0,FB.findIndex(p=>p[0]===x&&p[1]===y)),L=FLOOT[li%FLOOT.length],k=y*MW+x,got=[];
  if(L.g){S.gold+=L.g;got.push(L.g+' gold')}L.i.forEach(([id,n])=>{add(id,n);got.push(ITEMS[id].n.toLowerCase()+(n>1?' x'+n:''))});
  S.cut[k]={m:46,d:S.day};M[k]=31;say('You found '+got.join(', ')+'!');toast('Treasure!');ui();save()}
function grassEvent(){const r=Math.random();
  if(r<.07){const id=['basil','moss','forest_sprig','red_cap','blue_cap','death_cap','holly'][Math.random()*7|0];add(id);toast('Found '+ITEMS[id].n.toLowerCase()+' in the grass');ui()}
  else if(r<.10){S.hp=Math.max(1,S.hp-4);flashHit();say('Hornets sting you! -4 health.');ui()}}
