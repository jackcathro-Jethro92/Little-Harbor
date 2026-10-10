// ---------- world ----------
const M=new Uint8Array(MW*MH); // 0 water 1 grass 2 sand 3 plank 4 tree 5 building 6 dirt 7 lantern
const hs=(x,y)=>(Math.imul(x+7,73856093)^Math.imul(y+13,19349663))>>>0;
const at=(x,y)=>x<0||y<0||x>=MW||y>=MH?0:M[y*MW+x];
for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
  const dx=(x-32)/20,dy=(y-22)/14,d=dx*dx+dy*dy+.08*Math.sin(x*1.7+y*1.3);
  M[y*MW+x]=d<1?(d>.78?2:1):0;
}
for(let y=36;y<=38;y++)M[y*MW+32]=3;
// 10 houses (door stand tile = x+1, y+2) plus 3 shops
const H=[[21,13],[26,13],[35,13],[40,13],[20,19],[26,19],[21,27],[26,27],[35,27],[40,27]];
const RO=['thatch','slate','red','thatch','slate','thatch','red','thatch','slate','thatch'];
const BL=H.map(([x,y],i)=>({x,y,w:3,roof:RO[i]})).concat([{x:35,y:19,w:3,roof:'red',sign:'fish'},{x:40,y:19,w:3,roof:'slate',sign:'rod'},{x:36,y:32,w:3,roof:'thatch',sign:'boat'}]);
BL.forEach(b=>{for(let j=0;j<2;j++)for(let i=0;i<b.w;i++)M[(b.y+j)*MW+b.x+i]=5});
const dirt=(x,y)=>{const t=at(x,y);if(t===1||t===2)M[y*MW+x]=6};
[15,21,29].forEach(y=>{for(let x=17;x<=46;x++)dirt(x,y)});
for(let x=31;x<=40;x++)dirt(x,34);
for(let y=15;y<=35;y++){dirt(31,y);dirt(32,y)}
[[30,24],[33,24],[30,32],[33,32]].forEach(([x,y])=>{if(at(x,y)===1)M[y*MW+x]=7});
const WK=[1,2,3,6,10,18,19,20,21,24,25,26,27,28,29,30,31,40,42,47,48,50,52,57,58,59,64,65,69,75,82,83,85,88,94,96,97,103,104,105,108],put=(x,y,t)=>{if(at(x,y)===1||at(x,y)===2||at(x,y)===6)M[y*MW+x]=t};
for(let x=24;x<=26;x++)for(let y=23;y<=24;y++)put(x,y,9);
for(let x=43;x<=46;x++){for(let y=24;y<=26;y++)put(x,y,10);put(x,23,8)}
for(let y=24;y<=26;y++)put(47,y,8);
for(let x=17;x<=19;x++){for(let y=24;y<=26;y++)put(x,y,10);put(x,23,8)}
for(let y=24;y<=26;y++)put(16,y,8);
[[30,35],[34,35],[29,33],[41,34]].forEach(([x,y])=>put(x,y,11));
const CH=[[26,16],[38,22],[29,25],[22,22],[44,29],[33,30]].map(([x,y])=>({x,y,hx:x,hy:y,f:0}));
for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
  if(M[y*MW+x]===1&&hs(x,y)%100<(x>=17&&x<=47&&y>=11&&y<=35?5:26))M[y*MW+x]=4;
}
// ---------- spirit isle (combat test) ----------
const ISL=new Set();
for(let y=38;y<=50;y++)for(let x=14;x<=30;x++){const dx=(x-22)/5,dy=(y-44)/3.6,d=dx*dx+dy*dy+.1*Math.sin(x*1.3+y*.9);
  if(d<1&&!M[y*MW+x]){M[y*MW+x]=d>.7?2:1;ISL.add(y*MW+x)}}
[[20,43],[24,45],[23,41],[19,45]].forEach(([x,y])=>{if(M[y*MW+x]===1)M[y*MW+x]=13});
const G={x:22,y:44,hx:22,hy:44,hp:12,max:12,alive:true,cd:0,hitAt:0,resp:0,f:'d'};
// ---------- ore outcrops (copper 15, tin 16, bronze 17) ----------
for(let y=10;y<=34;y++)for(let x=12;x<=19;x++){const i=y*MW+x;if((M[i]===1||M[i]===2)&&hs(x*5,y*3)%100<14)M[i]=15+hs(x,y*7)%3}
ISL.forEach(i=>{const x=i%MW,y=(i/MW)|0;if(M[i]===1&&hs(x*5,y*3)%100<14)M[i]=15+hs(x,y*7)%3});
// ---------- flax (19) ----------
for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=y*MW+x;if(M[i]===1&&hs(x*11,y*13)%100<12)M[i]=19}
[[34,32],[35,33],[36,31],[37,31],[30,30],[29,33],[34,29]].forEach(([x,y])=>{if(M[y*MW+x]===1)M[y*MW+x]=19});
// ---------- herbs and mushrooms ----------
{const near=(x,y,r,f)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(f(at(x+i,y+j)))return true;return false},put2=[];
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){if(M[y*MW+x]!==1)continue;const n=hs(x*17,y*19)%100;let t=0;
   if(near(x,y,1,v=>v===4)){if(n<16)t=[28,28,29,30][hs(x,y*5)%4];else if(n<26)t=25}
   else if(near(x,y,1,v=>[9,13,15,16,17].includes(v))){if(n<40)t=24}
   else if(near(x,y,2,v=>v===5||v===8||v===10)){if(n<9)t=26}
   else if(n<10)t=27;
   if(t)put2.push([y*MW+x,t])}
 put2.forEach(([i,t])=>M[i]=t)}
// ---------- residents (20) ----------
// Each has id, home, look fields, a generic line, and an empty bio to fill in later.
const NPC=[
 {n:'Odo',x:36,y:21,f:'d',skin:1,hair:3,shirt:2,shop:1,fixed:1,say:['Fresh fish, fair prices. Hand them over and I will pay.','Tuna fetch the best coin around here.']},
 {n:'Bram',x:41,y:21,f:'d',skin:2,hair:1,shirt:0,store:'rod',fixed:1},
 {n:'Captain Rue',x:37,y:34,f:'u',skin:1,hair:3,shirt:1,store:'boat',fixed:1},
 {n:'Mara',x:28,y:15,f:'d',skin:0,hair:4,shirt:3,say:['I paint the harbor every morning. Never looks the same twice.','Try fishing at dawn. The sardines run thick.']},
 {n:'Pip',x:31,y:26,f:'r',skin:3,hair:0,shirt:4,say:['Is it true there is a golden koi out past the rocks?','I want a boat when I grow up!']},
 {n:'Old Tess',x:24,y:21,f:'l',skin:2,hair:3,shirt:5,say:['Forty years on these waters, and the sea still surprises me.','Sleep on the boat and the waves will rock you right off.']},
];
const NM=['Hana','Ren','Sora','Kenji','Yuki','Aiko','Taro','Mei','Haru','Nao','Daichi','Emi','Goro','Kiku'];
const GR=['Lovely day for it.','Mind the tide if you head out.','The fish have been shy lately.','Welcome to the harbor!','Busy morning, is it not?','I keep meaning to learn to fish.'];
NM.forEach((n,i)=>{const[hx,hy]=H[i%10];NPC.push({id:'v'+i,n,x:hx+(i<10?1:2),y:hy+2,f:'d',skin:i%5,hair:(i*2+1)%6,shirt:(i*5)%6,jk:(i*7+2)%6,hc:i%5,
  hat:['cap','straw','none','none','straw'][i%5],pack:i%4===0,jon:i%3!==0,home:i%10,
  bio:{age:null,job:null,backstory:null,likes:[],quests:[]},say:[GR[i%6]]})});
NPC.forEach(n=>{n.hx=n.x;n.hy=n.y});
