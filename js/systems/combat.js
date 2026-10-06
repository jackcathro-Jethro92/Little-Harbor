// ---------- combat (the spirit on Spirit Isle), getting hurt and fainting ----------
function swing(){
  if(!eq('weapon'))return say('You have no weapon! Buy a sword from Bram.');
  if(S.sta<STAM.swing)return say('Too tired to swing. Sleep on the boat to rest.');
  spend(STAM.swing);const d=Math.round(eq('weapon').damage*(1+.08*lvl('combat')));G.hp-=d;G.hitAt=performance.now();say('You hit the spirit for '+d+'!');gainXp('combat',2);
  if(S.coat>0){S.coat--;G.pois=performance.now()+6000;say('You hit the spirit for '+d+'! It is poisoned.');ui()}
  if(G.hp<=0)ghostDie();save()}
function ghostDie(){G.alive=false;G.resp=40;G.pois=0;say('The spirit fades away... for now.');gainXp('combat',20)}
function ghostTick(){
  if(!G.alive){if(--G.resp<=0){G.alive=true;G.hp=G.max;G.x=G.hx;G.y=G.hy}return}
  const pz=G.pois>performance.now();if(pz&&Math.random()<.4)return;
  const dx=P.x-G.x,dy=P.y-G.y,dist=Math.abs(dx)+Math.abs(dy);
  if(dist===1){if(G.cd<=0){hurt(pz?3:6,'The spirit');G.cd=2}else G.cd--;return}
  if(G.cd>0)G.cd--;
  const hx=Math.abs(dx)>=Math.abs(dy),c=dist<=7?[hx?[Math.sign(dx),0]:[0,Math.sign(dy)],hx?[0,Math.sign(dy)]:[Math.sign(dx),0]]:[Object.values(D)[Math.random()*4|0]];
  for(const[a,b]of c){if(!a&&!b)continue;const nx=G.x+a,ny=G.y+b,i=ny*MW+nx;
    if(ISL.has(i)&&WK.includes(M[i])&&!(P.x===nx&&P.y===ny)){G.x=nx;G.y=ny;break}}}
function faint(){cancel();const loss=Math.floor(S.gold*.1);S.gold-=loss;S.hp=Math.ceil(maxHp()/2);S.sta=Math.ceil(maxSta()/2);
  P.x=P.rx=B.x;P.y=P.ry=B.y;sail=true;say('You blacked out... and woke up on your boat. Lost '+loss+' gold.');ui();save()}
function hurt(n,src){S.hp=Math.max(0,S.hp-n);flashHit();say(src+' hits you for '+n+'!');ui();save();if(S.hp<=0)faint()}
