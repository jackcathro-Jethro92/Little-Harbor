// ---------- gathering: chop, mine, cut flax, pick herbs ----------
const HITS={},SHAKE={},WORK={kind:null,at:-1e9};   // WORK: the tool swing the player is drawn making (js/render/people.js `toolSwing`), restarted by every swing
function gather(x,y,tt){
  const tree=tt===4,flax=tt===19,fg=tt>=24&&tt<=30,soft=flax||fg,sk=tree?'woodcutting':soft?'foraging':'mining',slot=tree?'axe':soft?'knife':'pickaxe';
  if(!eq(slot)&&S.eq[slot])return say('Equip your '+ITEMS[S.eq[slot]].n.toLowerCase()+' in the Equipment menu first.');
  if(!eq(slot))return say(tree?"You need a woodcutter's axe to chop trees. Bram sells them.":soft?'You need a knife to cut flax and pick herbs. Bram sells them.':'You need a pickaxe to mine. Bram sells them.');
  const cost=soft?STAM.forage:STAM.gather;if(S.sta<cost)return say('Too tired. Sleep on the boat to rest.');
  const idx=y*MW+x,d=tree?WOOD[wood(x,y)]:flax?FLAX:fg?Object.assign({hits:1,min:1,max:2},FORAGE[tt]):ORE[tt],need=Math.max(1,d.hits-Math.floor(lvl(sk)/3)-((eq(slot).power||1)-1));
  spend(cost);HITS[idx]=(HITS[idx]||0)+1;SHAKE[idx]=performance.now();if(!soft){WORK.kind=tree?'axe':'pick';WORK.at=performance.now()}
  if(HITS[idx]<need)return say(tree?'Chop!':'Clink!');
  delete HITS[idx];let n=d.min+((Math.random()*(d.max-d.min+1))|0);if(Math.random()<.04*lvl(sk)+fx('yield'))n++;
  add(d.item,n);S.cut[idx]={m:tt,d:S.day};M[idx]=STUB(tt);
  say('You gathered '+ITEMS[d.item].n+' x'+n+'.');gainXp(sk,d.xp);save()}

// pick up a tile that needs no tool (PICKUPS in js/data/gathering.js): a story log, say
function pickupTile(x,y,tt){const p=PICKUPS[tt];if(p.need&&!flag(p.need))return say(p.no);if(count(p.item))return say(p.have);
  const idx=y*MW+x;add(p.item,1);S.cut[idx]={m:tt,d:S.day};M[idx]=STUB(tt);say(p.msg);(p.do||[]).forEach(a=>{const k=Object.keys(a).find(q=>TACT[q]);if(k)TACT[k](a[k])});save()}
