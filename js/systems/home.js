// ---------- home and garden ----------
function enterHome(){P.x=P.rx=IR.dx;P.y=P.ry=IR.dy;P.f='u';say('You step inside your home.');toast('Home sweet home');ui()}
function exitHome(){P.x=P.rx=S.home.x+1;P.y=P.ry=S.home.y+2;P.f='d';say('You step back outside.');ui()}
function gardenAt(x,y){for(const g of S.gardens)if(x>=g.x&&x<g.x+3&&y>=g.y&&y<g.y+2)return{g,i:(y-g.y)*3+(x-g.x)};return null}
function useGarden(c){const cell=c.g.cells[c.i];
  if(!cell){const own=Object.keys(CROPS).filter(count),empty=c.g.cells.every(q=>!q);
    if(!own.length&&!empty)return say('Nothing to plant. Gather herbs or buy vegetables from Odo.');
    return menu('Garden',[...own.map(id=>'Plant '+ITEMS[id].n.toLowerCase()),...(empty?['Pick up garden']:[]),'Cancel'],o=>{
      if(o==='Pick up garden'){S.gardens=S.gardens.filter(q=>q!==c.g);add('garden_kit');say('Garden packed up.');ui();save()}
      else if(o!=='Cancel'){const id=own.find(k=>'Plant '+ITEMS[k].n.toLowerCase()===o);S.bag[id]--;if(!S.bag[id])delete S.bag[id];c.g.cells[c.i]={c:id,d:S.day};say('Planted '+ITEMS[id].n.toLowerCase()+'. Ready in '+CROPS[id].d+' nights.');ui();save()}})}
  const need=CROPS[cell.c].d,age=S.day-cell.d;
  if(age<need)return say(ITEMS[cell.c].n+' needs '+(need-age)+' more night'+(need-age>1?'s':'')+'.');
  const cr=CROPS[cell.c];let n=cr.y[0]+((Math.random()*(cr.y[1]-cr.y[0]+1))|0);if(Math.random()<.04*lvl('farming'))n++;
  add(cell.c,n);c.g.cells[c.i]=null;say('Harvested '+ITEMS[cell.c].n.toLowerCase()+' x'+n+'.');gainXp('farming',6);save()}
