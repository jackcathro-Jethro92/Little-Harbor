// ---------- the bandit camp (a tavern job from the Walled Settlement's notice board): the far south-west corner of the mainland ----------
// A clearing among the trees with three tents round a camp fire, crates and barrels (TOWN_DECOR.bandits). It is always there; the ten bandits only stand in it once the job is taken (encounter job_bandits).
const BANDIT_CAMP={x:18,y:229,tents:[[11,224,'#7a5a3a'],[17,223,'#6a4a2a'],[23,225,'#8a6a3a']]};
{const{x:cx,y:cy}=BANDIT_CAMP;
 rect(cx-11,cy-8,cx+11,cy+7,(x,y)=>{const t=at(x,y);if(t===4||t===14||t===19){const d=Math.hypot((x-cx)/11,(y-cy)/7.5);if(d<1)setT(x,y,1)}});   // the clearing (trees at its edge stay)
 for(let y=cy-2;y<=cy+2;y++)for(let x=cx-3;x<=cx+3;x++)if(Math.hypot((x-cx)/3.4,(y-cy)/2.4)<1)setT(x,y,6);                                       // trampled earth round the fire
 BANDIT_CAMP.tents.forEach(([x,y,col])=>{BL.push({x,y,w:3,tent:col,bandit:1});rect(x,y,x+2,y+1,(xx,yy)=>setT(xx,yy,100))})}
