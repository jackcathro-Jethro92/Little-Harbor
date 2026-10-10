// ---------- save data (versioned) ----------
const slotOf=id=>{const i=ITEMS[id];return i.kind==='jewel'?i.slot:i.kind==='tool'?({mine:'pickaxe',chop:'axe',cut:'knife'})[i.use]:i.kind};
const SAVE_V=3;
const fresh=()=>({v:SAVE_V,look:{skin:0,hair:1,shirt:5,jk:1},day:1,gold:0,seen:0,hp:50,sta:100,xp:{},cut:{},placed:[],gardens:[],claim:null,home:null,coat:0,buff:0,arena:0,flags:{},ships:{},bag:{driftwood_rod:1,rowboat:1},eq:{rod:LIST('rod')[0],boat:LIST('boat')[0],weapon:null,pickaxe:null,axe:null,knife:null,ring:null,amulet:null}});
function migrate(o){
  const f=fresh();
  if(o.v>=SAVE_V)return {...f,...o,eq:{...f.eq,...o.eq}};
  const R=LIST('rod'),B=LIST('boat'),bag={...f.bag};let eq;
  if(o.v===2){Object.assign(bag,o.bag);eq={...o.eq}}
  else{if(o.inv)bag.sardine=o.inv;eq={rod:R[o.rod|0]||R[0],boat:B[o.boat|0]||B[0]}}
  [['rod',R],['boat',B]].forEach(([k,L])=>{for(let i=0;i<=Math.max(0,L.indexOf(eq[k]));i++)bag[L[i]]=1}); // v1/v2 bought rods and boats in order
  ['weapon','tool'].flatMap(LIST).forEach(id=>{if(bag[id]&&!eq[slotOf(id)])eq[slotOf(id)]=id});
  return {...f,look:o.look,day:o.day||1,gold:o.gold||0,seen:o.seen||0,bag,eq:{...f.eq,...eq}};
}
let S=fresh();
try{const raw=localStorage.getItem(KEY),o=JSON.parse(raw||'null');
  if(o&&o.look){if(o.v!==SAVE_V){try{localStorage.setItem(KEY+'-backup-v'+(o.v||1),raw)}catch(e){}}S=migrate(o)}}catch(e){}
// the trawler became the schooner (boats redrawn from real ships): carry old saves over
if(S.bag&&S.bag.trawler){S.bag.schooner=(S.bag.schooner||0)+S.bag.trawler;delete S.bag.trawler}if(S.eq&&S.eq.boat==='trawler')S.eq.boat='schooner';
const save=()=>{try{S.fog=Array.from(FOG).join('');localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
