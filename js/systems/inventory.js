// ---------- inventory helpers ----------
const count=id=>S.bag[id]||0,add=(id,n=1)=>{S.bag[id]=count(id)+n};
const fishIds=LIST('fish'),fishCount=()=>fishIds.reduce((a,i)=>a+count(i),0),fishValue=()=>fishIds.reduce((a,i)=>a+count(i)*ITEMS[i].value,0);
// TESTING: items granted once to every save (empty this list to stop)
const TEST_GRANTS=['sword'];
S.granted=S.granted||[];
TEST_GRANTS.forEach(id=>{if(!S.granted.includes(id)){S.granted.push(id);if(!count(id))add(id);if(!S.eq[slotOf(id)])S.eq[slotOf(id)]=id}});
// TESTING: one-time starter materials and gold for trying out crafting (delete this block to stop)
const TEST_KITS={roundA:()=>{S.gold+=800;add('fiber',6);add('softwood',4);add('medium_wood',2);add('hardwood',2);add('copper_ore',2);add('tin_ore',2);add('bronze_ore',2)},
  roundB:()=>{S.gold+=300;add('sardine',4);add('mackerel',3);add('bream',2);add('tuna',1);add('koi',1);S.hp=Math.min(S.hp,30);S.sta=Math.min(S.sta,40)},
  roundC:()=>{S.gold+=150},
  roundD:()=>{S.gold+=300;add('home_claim');add('cottage_kit')},
  roundG:()=>{S.gold+=500;add('basil',3);add('holly',2);add('forest_sprig',4);add('moss',3);add('death_cap',2);add('blue_cap',1);add('red_cap',1);S.hp=Math.min(S.hp,20);S.sta=Math.min(S.sta,30)},
  roundF:()=>{S.gold+=300;add('garden_kit');add('carrot',2);add('potato',2);add('basil',2);add('red_cap',1);if(!count('knife')){add('knife');if(!S.eq.knife)S.eq.knife='knife'}},
  roundE:()=>{S.gold+=4000;add('medium_plank',12);add('hardwood_plank',6);add('rope',8);add('iron_bar',4)}};
Object.keys(TEST_KITS).forEach(k=>{if(!S.granted.includes(k)){S.granted.push(k);TEST_KITS[k]()}});
