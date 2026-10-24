// ---------- the houses people live in: a small furnished room behind every villager's front door (HOME_ROOMS and HOME_DESIGNS in js/data/interiors.js) ----------
// Each home is built after all the shops and guest rooms, so no earlier room ever moves (buildRoom in js/systems/shoprooms.js). The owner stays outside, in front of the house, as before; most of them stand on the tile in front of
// their own door, so any of the three tiles below the house's front wall leads in (face the house and press Use), and stepping back out puts you beside the door, never on top of anyone.
const HOME_LIST=HOME_ROOMS.map(h=>{const d=HOME_DESIGNS[h.design],key='home_'+h.id,[bx,by]=h.house,name=h.name||h.owner+"'s house",room=buildRoom(key,d,name);room.home=h.id;
  const homes=new Set(NPC.map(n=>n.hx+','+n.hy)),stand=[0,2,1].map(k=>[bx+k,by+2]),out=stand.find(([x,y])=>WK.includes(at(x,y))&&!homes.has(x+','+y))||stand[2];
  HALLS[key]={z:room,id:room.z,msg:h.msg||'You step into '+name+'.',name};
  [0,1,2].forEach(k=>ENTR.push({x:bx+k,y:by+1,to:key,out,back:'You step back outside.'}));
  return{...h,key,room,out}});
