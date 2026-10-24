// ---------- the towns' outdoor details (TOWN_DECOR in js/data/town.js): wells, signposts, flower beds, trees, hay and carts set out on the map ----------
// They join the taverns' tables in YARD_PROPS (js/systems/taverns.js), so draw() sorts them with the people, and they stand in the way through INTBLK.
Object.entries(TOWN_DECOR).forEach(([town,list])=>list.forEach(([id,x,y])=>{if(!PROPS.DEF[id])return;const[w,h]=propDim(id,0),p={id,x,y,ax:x,ay:y,w,h,rot:0,flip:0,flat:PROPS.DEF[id].z===0,at:town};
  if(!p.flat)for(let j=0;j<h;j++)for(let k=0;k<w;k++)INTBLK[(y+j)*MW+x+k]=1;YARD_PROPS.push(p)}));
// Fenna keeps chickens (she says so): two of them peck about beside her house
[[95,231],[97,232]].forEach(([x,y])=>CH.push({x,y,hx:x,hy:y,f:0}));
