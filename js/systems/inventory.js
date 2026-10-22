// ---------- inventory helpers ----------
const count=id=>S.bag[id]||0,add=(id,n=1)=>{S.bag[id]=count(id)+n};
// ---------- carrying space (batch F4): a bag has a number of slots ----------
// Each KIND of item takes one slot, and one slot holds STACK of them (more takes another slot). Things you are wearing or holding (one of each), letters, quest items (kind 'key') and boats take no slot. The bag you own is S.bagId, a row of BAGS
// (bigger bags are added later as rows). Things you gather, catch, craft, buy, pick up or take out of storage need room (room / tryAdd): if there is none the game says so and nothing is lost. Quest rewards, story items and battle loot
// go in with `add` whatever the room (the bag may then be over its limit until you make space; you just cannot take on more). Saves that already carry more than the limit keep everything.
const BAGS=[{id:'satchel',n:'Satchel',slots:20}],STACK=99;
const bagSlots=()=>(BAGS.find(b=>b.id===S.bagId)||BAGS[0]).slots;
const noSlot=id=>{const k=ITEMS[id]&&ITEMS[id].kind;return k==='key'||k==='boat'};
const slotsFor=n=>n>0?Math.ceil(n/STACK):0;
const heldIn=id=>count(id)-(typeof isWorn==='function'&&isWorn(id)?1:0);
const slotsUsed=()=>Object.keys(S.bag).reduce((a,id)=>a+(ITEMS[id]&&!noSlot(id)?slotsFor(heldIn(id)):0),0);
const room=(id,n=1)=>noSlot(id)||slotsUsed()-slotsFor(heldIn(id))+slotsFor(heldIn(id)+n)<=Math.max(bagSlots(),slotsUsed());
const bagFull=()=>{say('Your bag is full. Leave things in a crate to make room.');toast('Bag full',1800)};
const tryAdd=(id,n=1)=>{if(!room(id,n)){bagFull();return false}add(id,n);return true};
const maxRoom=(id,n)=>{let k=n;while(k>0&&!room(id,k))k--;return k};
const fishIds=LIST('fish'),fishCount=()=>fishIds.reduce((a,i)=>a+count(i),0),fishValue=()=>fishIds.reduce((a,i)=>a+count(i)*ITEMS[i].value,0);
// TESTING: items granted once to every save (empty this list to stop)
const TEST_STARTER=false;   // master switch for the testing gifts below: off, so a new game starts with no gold and only a driftwood rod and a wooden sword (Jack's playtest note). Switch on to get the test kits again.
const TEST_GRANTS=['sword'];
S.granted=S.granted||[];
if(TEST_STARTER)TEST_GRANTS.forEach(id=>{if(!S.granted.includes(id)){S.granted.push(id);if(!count(id))add(id);if(!S.eq[slotOf(id)])S.eq[slotOf(id)]=id}});
// TESTING: one-time starter materials and gold for trying out crafting (delete this block to stop)
const TEST_KITS={roundA:()=>{S.gold+=800;add('fiber',6);add('softwood',4);add('medium_wood',2);add('hardwood',2);add('copper_ore',2);add('tin_ore',2);add('bronze_ore',2)},
  roundB:()=>{S.gold+=300;add('sardine',4);add('mackerel',3);add('bream',2);add('tuna',1);add('koi',1);S.hp=Math.min(S.hp,30);S.sta=Math.min(S.sta,40)},
  roundC:()=>{S.gold+=150},
  roundD:()=>{S.gold+=300;add('home_claim');add('cottage_kit')},
  roundG:()=>{S.gold+=500;add('basil',3);add('holly',2);add('forest_sprig',4);add('moss',3);add('death_cap',2);add('blue_cap',1);add('red_cap',1);S.hp=Math.min(S.hp,20);S.sta=Math.min(S.sta,30)},
  roundF:()=>{S.gold+=300;add('garden_kit');add('carrot',2);add('potato',2);add('basil',2);add('red_cap',1);if(!count('knife')){add('knife');if(!S.eq.knife)S.eq.knife='knife'}},
  roundE:()=>{S.gold+=4000;add('medium_plank',12);add('hardwood_plank',6);add('rope',8);add('iron_bar',4)}};
if(TEST_STARTER)Object.keys(TEST_KITS).forEach(k=>{if(!S.granted.includes(k)){S.granted.push(k);TEST_KITS[k]()}});
