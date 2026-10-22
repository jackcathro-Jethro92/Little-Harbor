// ---------- home and garden ----------
// two homes are possible (playtest #4): the cottage (S.home) and the Haven house (S.isle); each has its own interior room
function enterHome(h){const gr=h&&h.grand;P.x=P.rx=gr?HG.dx:IR.dx;P.y=P.ry=gr?HG.dy:IR.dy;P.f='u';say('You step inside your home.');toast('Home sweet home');ui()}
function exitHome(){const h=(inHG(P.x,P.y)&&S.isle)?S.isle:S.home;P.x=P.rx=h.x+1;P.y=P.ry=h.y+2;P.f='d';say('You step back outside.');ui()}
function gardenAt(x,y){for(const g of S.gardens)if(x>=g.x&&x<g.x+3&&y>=g.y&&y<g.y+2)return{g,i:(y-g.y)*3+(x-g.x)};return null}
function useGarden(c){const cell=c.g.cells[c.i];
  if(!cell){const own=Object.keys(CROPS).filter(count),empty=c.g.cells.every(q=>!q);
    if(!own.length&&!empty)return say('Nothing to plant. Gather herbs or buy vegetables from Odo.');
    return menu('Garden',[...own.map(id=>'Plant '+ITEMS[id].n.toLowerCase()),...(empty?['Pick up garden']:[]),'Cancel'],o=>{
      if(o==='Pick up garden'){if(!room('garden_kit'))return bagFull();S.gardens=S.gardens.filter(q=>q!==c.g);add('garden_kit');say('Garden packed up.');ui();save()}
      else if(o!=='Cancel'){const id=own.find(k=>'Plant '+ITEMS[k].n.toLowerCase()===o);S.bag[id]--;if(!S.bag[id])delete S.bag[id];c.g.cells[c.i]={c:id,d:S.day};say('Planted '+ITEMS[id].n.toLowerCase()+'. Ready in '+CROPS[id].d+' nights.');ui();save()}})}
  const need=CROPS[cell.c].d,age=S.day-cell.d;
  if(age<need)return say(ITEMS[cell.c].n+' needs '+(need-age)+' more night'+(need-age>1?'s':'')+'.');
  const cr=CROPS[cell.c];let n=cr.y[0]+((Math.random()*(cr.y[1]-cr.y[0]+1))|0);if(Math.random()<.04*lvl('farming'))n++;
  if(!room(cell.c,n+1))return bagFull();
  add(cell.c,n);c.g.cells[c.i]=null;say('Harvested '+ITEMS[cell.c].n.toLowerCase()+' x'+n+'.');gainXp('farming',6);save()}

// the built-in stations of the Haven house (playtest #4): a cooking station, a workbench, a forge and an alchemy station stand ready in their rooms. They are real stations (S.placed) marked `fixed:1`, so they work like
// any other but cannot be picked up or moved and are never packed with a camp. This puts back any that are missing (it runs at load and when the island's house is given), so it is safe to call again.
function haveFixtures(){if(!S.isle)return;HG_FIXTURES.forEach(f=>{if(!S.placed.some(p=>p.fixed&&p.id===f.id&&p.x===f.x&&p.y===f.y))S.placed.push({id:f.id,x:f.x,y:f.y,fixed:1})})}
