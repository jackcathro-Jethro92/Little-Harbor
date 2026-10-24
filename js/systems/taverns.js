// ---------- the taverns (tables in js/data/taverns.js): regulars sitting inside, a notice board of jobs, and tables and barrels outside ----------
// The regulars are ordinary people (NPC rows) placed in the tavern's room; they stay put (fixed). The notice board is the 'notices' prop on the back wall of the tavern design (c_tavern): face it, or the wall just
// below it, and press Use to read it. The yard props are drawn on the map and sorted with the people; they stand in the way (INTBLK), like furniture indoors.
TAVERN_REGULARS.forEach((r,i)=>{const room=SHOP_ROOMS.find(s=>s.id===r.at).room,x=room.x0+r.x,y=room.y0+r.y;
  NPC.push({id:'tv'+i,n:r.n,x,y,hx:x,hy:y,f:r.f||'d',skin:r.skin,hair:r.hair,shirt:r.shirt,jk:r.jk,hc:r.hc,hat:r.hat,fixed:1,regular:r.at,bio:{age:null,job:null,backstory:null,likes:[],quests:[]},say:r.say})});
const YARD_PROPS=Object.entries(TAVERN_YARDS).flatMap(([at,list])=>list.map(([id,x,y])=>{const[w,h]=propDim(id,0),p={id,x,y,ax:x,ay:y,w,h,rot:0,flip:0,flat:PROPS.DEF[id].z===0,at};
  if(!p.flat)for(let j=0;j<h;j++)for(let k=0;k<w;k++)INTBLK[(y+j)*MW+x+k]=1;return p}));
// the notice board you are facing (inside a tavern), or null
function boardAt(x,y){const r=zoneOf(P.x,P.y)>=30?intrOf(P.x,P.y):null;if(!r||sail)return null;const sr=SHOP_ROOMS.find(s=>s.room===r&&s.inn);if(!sr)return null;
  const b=r.props.find(p=>p.id==='notices'&&x>=p.ax&&x<p.ax+p.w&&(y===p.ay||y===p.ay+1));return b?sr:null}
function openBoard(sr){const jobs=JOBS.filter(j=>j.at===sr.id||j.at==='any');
  if(!jobs.length){toast('Notice board');return say('The notice board is empty for now. Check back soon.')}
  menu('Notice board',[...jobs.map(j=>j.title+' ('+j.reward+')'),'Close'],o=>{const j=jobs.find(q=>o===q.title+' ('+q.reward+')');if(j)say(j.desc)})}
