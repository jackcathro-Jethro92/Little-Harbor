// ---------- gathering: chop, mine, cut flax, pick herbs ----------
const HITS={},SHAKE={};
function gather(x,y,tt){
  const tree=tt===4,flax=tt===19,fg=tt>=24&&tt<=30,soft=flax||fg,sk=tree?'woodcutting':soft?'foraging':'mining',slot=tree?'axe':soft?'knife':'pickaxe';
  if(!eq(slot))return say(tree?"You need a woodcutter's axe to chop trees. Bram sells them.":soft?'You need a knife to cut flax and pick herbs. Bram sells them.':'You need a pickaxe to mine. Bram sells them.');
  const cost=soft?STAM.forage:STAM.gather;if(S.sta<cost)return say('Too tired. Sleep on the boat to rest.');
  const idx=y*MW+x,d=tree?WOOD[wood(x,y)]:flax?FLAX:fg?Object.assign({hits:1,min:1,max:2},FORAGE[tt]):ORE[tt],need=Math.max(1,d.hits-Math.floor(lvl(sk)/3)-((eq(slot).power||1)-1));
  spend(cost);HITS[idx]=(HITS[idx]||0)+1;SHAKE[idx]=performance.now();
  if(HITS[idx]<need)return say(tree?'Chop!':'Clink!');
  delete HITS[idx];let n=d.min+((Math.random()*(d.max-d.min+1))|0);if(Math.random()<.04*lvl(sk))n++;
  add(d.item,n);S.cut[idx]={m:tt,d:S.day};M[idx]=STUB(tt);
  say('You gathered '+ITEMS[d.item].n+' x'+n+'.');gainXp(sk,d.xp);save()}
