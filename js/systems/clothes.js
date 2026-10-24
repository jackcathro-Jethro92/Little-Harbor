// ---------- wearing clothes (CLOTHES in js/data/clothes.js): Wear and Take off in the Bag (Clothing) ----------
// What you wear is kept with your equipment: S.eq.c_top, S.eq.c_over and S.eq.c_hat hold a piece's id, nothing (your character's own clothes, as at the start), or 'none' (taken off: no jacket, no hat).
// Your detailed picture (heroSpec in js/render/heroart.js) and your small walking figure (S.look) both follow it. Wearing a piece also sets its colour, which Wynn can dye afterwards.
const HAT_ACC=['cap','captain','beanie','straw','tricorn','skull','chef','hood','scarf','bandana'];
const wornKey=()=>['c_top','c_over','c_hat'].map(k=>S.eq[k]||'-').join(',');
function wearLook(id){const w=ITEMS[id].wear,L=S.look;if(w.slot==='top')L.shirt=w.col;else if(w.slot==='over'){L.jon=true;L.jk=w.col}else{L.hat=w.hat||'cap';L.hc=w.col}}
function takeOffLook(sl){if(sl==='c_top')return;S.eq[sl]='none';if(sl==='c_over')S.look.jon=false;else S.look.hat='none'}
// your character's picture with the clothes you wear put on
function dressSpec(sp,L){const top=S.eq.c_top,over=S.eq.c_over,hat=S.eq.c_hat,out={...sp,acc:[...(sp.acc||[])],col:{...sp.col}};
  if(top&&ITEMS[top])out.top=ITEMS[top].wear.art;
  if(over==='none')out.over=null;else if(over&&ITEMS[over])out.over=ITEMS[over].wear.art;
  if(hat){out.acc=out.acc.filter(a=>!HAT_ACC.includes(a));if(hat!=='none'&&ITEMS[hat]){out.acc.push(ITEMS[hat].wear.art);out.col.hat=OPT.hat[L.hc||0]}}
  return out}
