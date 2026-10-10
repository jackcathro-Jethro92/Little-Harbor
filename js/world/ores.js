// ---------- ore outcrops: only in the mountain country north of the Darkwood, and few of them ----------
// Runs right after overworld.js, which builds the mountain terraces (tile 48 rock floor) and no longer scatters ore. Outcrops: 15 copper, 16 tin, 17 bronze, 124 silver (rare), 123 gold (rare).
// The counts are in ORE_PLAN: [tile, how many, least distance between two of the same kind]. Every outcrop stands on open flat rock, so a pickaxe user can walk up to it; the spots are
// picked with the world's fixed hash, so everybody's mountains have the same ore. ORE_AT holds the spots (saved records of ore anywhere else are dropped when loading).
const ORE_PLAN=[[123,3,26],[124,5,16],[17,8,13],[16,12,9],[15,14,9]],ORE_AT=new Set();
{for(let y=0;y<WH;y++)for(let x=0;x<MW;x++)if(at(x,y)>=15&&at(x,y)<=17)setT(x,y,1);   // any outcrop left by the older world builders (the village island had a few) goes: ore is only in the mountains now
 const flat=(x,y)=>{if(at(x,y)!==48)return false;let n=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const t=at(x+i,y+j);if(t===49||t===50||t===5||t===0||t===12)return false;if(t===48)n++}return n>=7};
 const near=(x,y,r,f)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(f(at(x+i,y+j)))return true;return false};
 const out=(x,y)=>(x>=9&&x<=44&&y>=54&&y<=84)||(x<=20&&y>=17&&y<=35);       // the Mountain Town and the Temple to the Mountains and their grounds
 const cand=[];for(let y=2;y<100;y++)for(let x=2;x<100;x++)if(flat(x,y)&&!out(x,y)&&!near(x,y,2,t=>t===6))cand.push([x,y]);
 const placed=[];
 ORE_PLAN.forEach(([tile,count,gap])=>{let got=0;cand.map(([x,y])=>[x,y,hs(x*131+tile,y*37+7)]).sort((a,b)=>a[2]-b[2]).forEach(([x,y])=>{
   if(got>=count||at(x,y)!==48)return;if(placed.some(([px,py,pt])=>Math.hypot(px-x,py-y)<(pt===tile?gap:3)))return;
   setT(x,y,tile);placed.push([x,y,tile]);ORE_AT.add(y*MW+x);got++})})}
