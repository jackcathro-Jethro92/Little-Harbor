// ---------- boats moored in the harbours (HARBOUR_BOATS in js/data/town.js), for show ----------
// Each stands on its own water tile, which your boat (and the roaming pirate ships) cannot sail through; drawing only otherwise, bobbing gently and sorted with everything else by its row.
const harbourBoatAt=(x,y)=>HARBOUR_BOATS.some(b=>b[1]===x&&b[2]===y);
function harbourBoatsDraw(E,cx,cy,t){if(zoneOf(P.x,P.y))return;
  HARBOUR_BOATS.forEach(([tier,x,y,f],i)=>{if(Math.abs(x-P.rx)>14||Math.abs(y-P.ry)>14)return;const bob=Math.round(Math.sin(t/430+i*1.7));
    E.push({y,f:()=>boatArt(tier,false,f,x*T-cx,y*T-cy+bob,'back')})})}
