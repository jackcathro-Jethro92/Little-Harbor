// ---------- the Haven house's furniture: the shop and carpenter props (js/render/props.js) set out room by room (table HAVEN_DECOR in js/data/interiors.js) ----------
// The house's own tiles (js/world/granthome.js) still give the floors, walls, windows, doorways, crates, mannequins and bathtub; the old one-tile furniture (tables, futon, shelves, lanterns and so on) is cleared back to the room's floor
// and these props stand in its place. They work just like a shop room's: a prop blocks the way unless it lies flat (rugs, runners), INTBLK marks the tiles in the way, and draw() draws them sorted with the people.
// HG_DECOR has the shape of a shop room (props, glows, light), so draw() and roomLight() treat it the same way; its light 'lit' adds the lamps' and fire's glow without darkening the room.
const HG_DECOR=(()=>{const props=[],glows=[],x0=HG.x0,y0=HG.y0,old=[156,157,158,159,160,162,164,165,166,168,170,171,178,179,180,181,182,183];
  for(let y=HG.y0;y<=HG.y1;y++)for(let x=HG.x0;x<=HG.x1;x++)if(old.includes(at(x,y)))setT(x,y,GH_TATAMI(x,y)?108:153);
  HAVEN_DECOR.forEach(rm=>{const rx=HG_COL[rm.c][0],ry=HG_ROW[rm.r][0];
    rm.props.forEach(([id,px,py,mirror,turns])=>{if(!PROPS.DEF[id])return;const rot=turns||0,[w,h]=propDim(id,rot),ax=rx+px,ay=ry+py;
      const p={id,x:ax-x0,y:ay-y0,flip:mirror?1:0,rot,w,h,ax,ay,flat:PROPS.DEF[id].z===0,room:rm.n};props.push(p);const gl=propGlow(p);if(gl){p.glow=gl;glows.push(gl)}})});
  return{kind:'haven',x0,y0,x1:HG.x1,y1:HG.y1,light:'lit',props,glows}})();
// which tiles the furniture covers: rebuilt when a game loads (haveFixtures), and a prop that would cover something you placed in an older save stays hidden instead, so nothing of yours is ever covered or lost
function hgDecorFit(){const d=HG_DECOR,under=(p,x,y)=>x>=p.ax&&x<p.ax+p.w&&y>=p.ay&&y<p.ay+p.h;
  d.props.forEach(p=>{for(let j=0;j<p.h;j++)for(let k=0;k<p.w;k++)INTBLK[(p.ay+j)*MW+p.ax+k]=0});
  d.props.forEach(p=>{p.hide=!p.flat&&S.placed.some(q=>{if(!inHG(q.x,q.y))return false;const f=isFurn(q)?furnFp(q.id):{w:WIDE[q.id]||1,h:1};
      for(let j=0;j<f.h;j++)for(let k=0;k<f.w;k++)if(under(p,q.x+k,q.y+j))return true;return false});
    if(!p.flat&&!p.hide)for(let j=0;j<p.h;j++)for(let k=0;k<p.w;k++)INTBLK[(p.ay+j)*MW+p.ax+k]=1});
  d.glows=d.props.filter(p=>p.glow&&!p.hide).map(p=>p.glow)}
hgDecorFit();
