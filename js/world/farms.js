// ---------- farms outside the Walled Settlement, livestock, and the town's pets ----------
// Runs after settlement.js. Animals live in AN (see ANIMALS below); chickens use the older CH list.
const FARMS=[ // fenced plot x0,y0,x1,y1, gate tile, farmhouse corner, crop rows, roof
 {r:[118,205,131,213],gate:[125,213],path:[[125,214],[125,215]],house:[119,206,'thatch'],crops:[124,206,129,208]},
 {r:[118,222,132,232],gate:[125,222],path:[[125,221],[125,220],[125,219]],house:[119,228,'red'],crops:[124,228,130,230]},
 {r:[90,187,110,196],gate:[100,196],path:[[100,197],[100,198],[100,199]],house:[92,188,'slate'],crops:[96,188,108,190]}];
FARMS.forEach(f=>{const[x0,y0,x1,y1]=f.r;clr(x0-1,y0-1,x1+1,y1+1);
  rect(x0,y0,x1,y1,(x,y)=>setT(x,y,(x===x0||x===x1||y===y0||y===y1)?8:1));
  setT(...f.gate,6);f.path.forEach(([x,y])=>setT(x,y,6));
  const[hx,hy,roof]=f.house;BL.push({x:hx,y:hy,w:3,roof});rect(hx,hy,hx+2,hy+1,(x,y)=>setT(x,y,5));
  rect(...f.crops,(x,y)=>setT(x,y,10));setT(hx+4,hy+2,11);setT(hx+5,hy+2,11)}); // barrels of feed beside the farmhouse
NPC.push(
 {n:'Farmer Hobb',x:121,y:208,hx:121,hy:208,f:'d',skin:2,hair:1,shirt:3,jk:3,hat:'straw',pack:false,jon:false,bio:{age:null,job:'Dairy farmer',backstory:null,likes:[],quests:[]},say:['My cows give the creamiest milk for miles.','Mind the fence, friend.']},
 {n:'Maude',x:120,y:230,hx:120,hy:230,f:'d',skin:0,hair:4,shirt:1,jk:0,hat:'straw',pack:false,jon:false,bio:{age:null,job:'Shepherd',backstory:null,likes:[],quests:[]},say:['The sheep are shorn in spring. Soft wool, that.','Pigs eat anything. Anything!']},
 {n:'Perrin',x:93,y:190,hx:93,hy:190,f:'d',skin:3,hair:2,shirt:5,jk:4,hat:'cap',hc:3,pack:false,jon:true,bio:{age:null,job:'Egg farmer',backstory:null,likes:[],quests:[]},say:['Fresh eggs every morning, if the hens feel like it.','The settlement folk buy most of what I grow.']});
// ---------- animals ----------
// k kind, hx/hy home, rx/ry how far it roams, solid animals block the way (pets do not)
const ANIMALS={dummy:{solid:1,say:'A straw practice dummy.',use:()=>hitDummy()},cow:{solid:1,say:'Moo!'},pig:{solid:1,say:'Oink oink!'},sheep:{solid:1,say:'Baa!'},dog:{say:'Woof! It wags its tail.'},cat:{say:'Meow.'}};
const AN=[];
const addAn=(k,x,y,rx,ry,c)=>AN.push({k,x,y,hx:x,hy:y,rx,ry,c,f:0});
[[123,211],[126,211],[129,211]].forEach(([x,y])=>addAn('cow',x,y,2,1));
[[122,225],[124,226],[128,225]].forEach(([x,y],i)=>addAn(i<2?'sheep':'pig',x,y,2,1));
addAn('pig',130,227,1,1);
[[94,194],[104,194]].forEach(([x,y])=>addAn('sheep',x,y,3,1));
[[93,193],[96,195],[99,193],[103,195],[106,193],[109,194]].forEach(([x,y])=>CH.push({x,y,hx:x,hy:y,f:0}));
[[121,211],[128,226]].forEach(([x,y])=>CH.push({x,y,hx:x,hy:y,f:1}));
addAn('dog',97,214,5,3,'#b8793a');addAn('dog',107,226,5,3,'#e8dcc0');addAn('cat',92,218,4,2,'#e89a4a'); // the town's pets
const animalAt=(x,y)=>AN.find(a=>a.x===x&&a.y===y);
const solidAt=(x,y)=>AN.some(a=>a.x===x&&a.y===y&&ANIMALS[a.k].solid);
// a player's old cut-tree record must not put a stump back on top of a new building, fence or field
Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if((x>=84&&x<=133&&y>=186&&y<=234))delete S.cut[i]});
