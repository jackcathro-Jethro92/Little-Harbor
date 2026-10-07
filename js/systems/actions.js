// ---------- actions: the Use button and sleeping ----------
function act(){
  if(placing)return placeItem(placing);
  if(fs===1)return say('Too early. Wait for the bite.');
  if(fs===2)return hook();
  const[x,y]=front(),n=npcAt(x,y);
  if(G.alive&&G.x===x&&G.y===y)return swing();
  if(at(x,y)===23&&inRoom(P.x,P.y))return exitHome();
  {const t2=at(x,y);if(!sail){if(t2===44)return enterForest(y<130);if(t2===43&&inFZ(P.x,P.y))return exitForest(y<20);if(t2===46)return pickup(x,y)}}
  if(S.home&&!sail&&x===S.home.x+1&&y===S.home.y+1)return enterHome();
  const po=placedAt(x,y);if(po&&!sail)return useStation(po);
  const gc=gardenAt(x,y);if(gc&&!sail)return useGarden(gc);
  const tt=at(x,y);if(!sail&&(tt===4||tt===19||(tt>=15&&tt<=17)||(tt>=24&&tt<=30)))return gather(x,y,tt);
  if(n){
    if(n.store){openStore(n.store);return}
    if(n.shop){menu("Odo's General Store",['Buy food','Sell','Cancel'],o=>{if(o==='Buy food')openGeneral('buy');else if(o==='Sell')openGeneral('sell')});return}
    n.i=((n.i||0)+1)%n.say.length;n.f={u:'d',d:'u',l:'r',r:'l'}[P.f];say(n.n+': '+n.say[n.i]);return;
  }
  if(!sail){
    if(B.x===x&&B.y===y){P.x=x;P.y=y;sail=true;say('Aboard! Face open water and tap Use to cast.');ui();return}
    if(at(x,y)===0)say('You need the boat to fish. It is at the end of the pier.');
    return;
  }
  const t=at(x,y);
  if(WK.includes(t)){if(!npcAt(x,y)&&!placedAt(x,y)){P.x=x;P.y=y;sail=false;say('Back on land.');ui()}return}
  if(t===0&&x>=0&&y>=0&&x<MW&&y<MH){
    if(S.sta<STAM.cast)return say('Too tired to fish. Sleep on the boat to rest.');
    spend(STAM.cast);fs=1;say('Line cast. Wait for the bite...');
    ft.push(setTimeout(()=>{fs=2;say('Bite! Tap Use now!');
      ft.push(setTimeout(()=>{fs=0;say('It got away. Cast again.')},1100))},(1500+Math.random()*3000)*eq('rod').wait*(1-.03*lvl('fishing'))));
  }
}
function sleep(){
  if(!sail&&!inRoom(P.x,P.y))return;cancel();const f=$('flash');f.style.opacity=.9;S.day++;S.hp=maxHp();S.sta=maxSta();G.alive=true;G.hp=G.max;G.x=G.hx;G.y=G.hy;
  Object.keys(S.cut).forEach(i=>{const c=S.cut[i];if(S.day-c.d>=REGROW(c.m)&&P.y*MW+P.x!==+i){M[i]=c.m;delete S.cut[i]}});
  say((inRoom(P.x,P.y)?'You sleep soundly at home.':'You doze off on the boat.')+' Day '+S.day+' begins.');ui();save();setTimeout(()=>f.style.opacity=0,700);
}
