// ---------- the pirate camp on the volcano island's east shore: empty until the pirates arrive ----------
// applyPirates(on) builds either version of the camp and is safe to call again. It runs at load with the saved flag (pirates_here, see js/systems/flags.js) and live when
// the pirates arrive overnight. Before: a quiet shore with the gravestones, a cold fire pit and a toppled crate. After: six tents, a cooking fire, flags, three ships moored
// offshore (x 93-95, y 16-35) and ten pirates (js/data/pirates.js). Everything the camp adds is marked `pirate` so it can be removed again. No shop and no services.
const PIRATE_TENTS=[[84,16,'#b8452a'],[88,16,'#3a6aa8'],[84,19,'#c8a040'],[88,19,'#b8452a'],[84,22,'#3a6aa8'],[88,22,'#c8a040']];   // two columns with a lane between, on the dry ground east of the lava
const PIRATE_SHIPS=[[93,16],[93,24],[93,32]];
function applyPirates(on){if(typeof groundDirty==="function")groundDirty();
  const ground=(x,y)=>[82,83,100].includes(at(x,y)),clearPlace=(x,y,w,h)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(!ground(x+i,y+j))return false;return true};
  // take away whatever an earlier call put here
  BL.filter(b=>b.pirate).forEach(b=>{const w=b.ship?3:b.w,h=b.ship?4:b.decor?1:2;for(let j=0;j<h;j++)for(let i=0;i<w;i++)setT(b.x+i,b.y+j,b.ship?0:82)});
  BL.splice(0,BL.length,...BL.filter(b=>!b.pirate));
  for(let i=NPC.length-1;i>=0;i--)if(NPC[i].pirate)NPC.splice(i,1);
  const L=LAND.find(l=>l[0]==='Pirate Island'||l[0]==='Volcano Island');if(L)L[0]=on?'Pirate Island':'Volcano Island';   // the island only gets its name once the pirates are on it
  const decor=(kind,x,y)=>{if(clearPlace(x,y,1,1)){BL.push({x,y,w:1,decor:kind,pirate:1});setT(x,y,100)}};
  if(!on){decor('coldfire',87,25);decor('crate',89,27);return}
  decor('campfire',87,25);decor('flag',86,23);decor('flag',89,24);decor('barrel',89,26);decor('barrel',90,27);
  const tents=PIRATE_TENTS.filter(([x,y])=>clearPlace(x,y,3,2));
  tents.forEach(([x,y,col])=>{BL.push({x,y,w:3,tent:col,pirate:1});rect(x,y,x+2,y+1,(xx,yy)=>setT(xx,yy,100))});
  PIRATE_SHIPS.forEach(([x,y])=>{if(rect&&[0,1,2,3].every(j=>[0,1,2].every(i=>at(x+i,y+j)===0))){BL.push({x,y,w:3,ship:1,pirate:1});rect(x,y,x+2,y+3,(xx,yy)=>setT(xx,yy,101))}});
  // the pirates stand in front of the tents and round the fire
  const spots=[...tents.map(([x,y])=>[x+1,y+2]),[87,18],[87,21],[87,23],[88,24],[86,24],[88,26]].filter(([x,y])=>ground(x,y)&&at(x,y)!==100);
  PIRATES.forEach((p,i)=>{const s=spots[i%spots.length];if(!s)return;const o={...p,x:s[0],y:s[1],hx:s[0],hy:s[1],f:'d',pirate:1,pack:false,jon:true,bio:{age:null,job:'Pirate',backstory:null,likes:[],quests:[]}};NPC.push(o)});
}
applyPirates(flag('pirates_here'));
