// ---------- the wider world (from your sketch; 1 tile is about 7 sketch units) ----------
const OX=124,OY=91; // the village island moves here
{const V=M.slice();M.fill(0);for(let y=0;y<52;y++)for(let x=0;x<64;x++)M[(y+OY)*MW+x+OX]=V[y*MW+x];
 BL.forEach(b=>{b.x+=OX;b.y+=OY});NPC.forEach(n=>{n.x+=OX;n.y+=OY;n.hx+=OX;n.hy+=OY});CH.forEach(c=>{c.x+=OX;c.y+=OY;c.hx+=OX;c.hy+=OY});
 G.x+=OX;G.y+=OY;G.hx+=OX;G.hy+=OY;const old=[...ISL];ISL.clear();old.forEach(i=>ISL.add(((i/MW|0)+OY)*MW+(i%MW)+OX))}
const nearT=(x,y,r,f)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(f(at(x+i,y+j)))return true;return false};
const inV=(x,y)=>x>=OX&&x<OX+64&&y>=OY&&y<OY+52,setT=(x,y,t)=>{if(x>=0&&y>=0&&x<MW&&y<MH)M[y*MW+x]=t};
const rect=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)f(x,y)};
function isl(cx,cy,rx,ry,sd){for(let y=cy-ry-3;y<=cy+ry+3;y++)for(let x=cx-rx-3;x<=cx+rx+3;x++){if(x<0||y<0||x>=MW||y>=MH||M[y*MW+x])continue;
  const dx=(x-cx)/rx,dy=(y-cy)/ry,d=dx*dx+dy*dy+.14*Math.sin(x*.7+sd)+.12*Math.sin(y*.6+sd*2)+.08*Math.sin((x+y)*.45+sd);if(d<1)M[y*MW+x]=d>.82?2:1}}
// mainland: everything west of a winding coast
const CP=[[0,9],[39,21],[51,37],[68,54],[94,61],[108,59],[126,67],[150,80],[163,91],[170,100],[190,111],[200,129],[214,149],[227,151],[240,153]];
const coastX=y=>{for(let i=1;i<CP.length;i++)if(y<=CP[i][0]){const a=CP[i-1],b=CP[i];return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0])}return 153};
for(let y=0;y<WH;y++){const c=coastX(y)+2.2*Math.sin(y*.3)+1.3*Math.sin(y*.8);for(let x=0;x<c&&x<MW;x++)if(!M[y*MW+x])M[y*MW+x]=c-x<2.4?2:1}
// mountain range (impassable) with a boulder-blocked pass at its north end
const MB=[[40,133],[47,157],[69,175],[95,198],[116,218]];
for(let k=1;k<MB.length;k++)for(let st=0;st<=40;st++){const px=Math.round(MB[k-1][0]+(MB[k][0]-MB[k-1][0])*st/40),py=Math.round(MB[k-1][1]+(MB[k][1]-MB[k-1][1])*st/40);
  rect(px-6,py-6,px+6,py+6,(x,y)=>{if((x-px)**2+(y-py)**2<=36&&(at(x,y)===1||at(x,y)===2))setT(x,y,35)})}
rect(39,130,44,135,(x,y)=>{if(at(x,y)===35)setT(x,y,36)});
// islands from the sketch: [centre x, centre y, radius x, radius y, seed]
[[206,81,8,7,1],[190,136,8,10,2],[244,138,32,31,3],[128,78,10,10,4],[144,170,9,8,6],[283,34,17,14,5],[71,28,14,13,8],[60,42,4,4,9],[82,43,4,4,10],[74,18,5,5,11]].forEach(a=>isl(...a));
// Sailors' grave rocks
for(let k=0;k<17;k++){const cx=74+hs(k,1)%33,cy=61+hs(k,2)%50,r=1+hs(k,3)%2;rect(cx-r,cy-r,cx+r,cy+r,(x,y)=>{if(!at(x,y)&&(x-cx)**2+(y-cy)**2<=r*r+1&&x>=0&&y>=0)setT(x,y,32)})}
// trees, flax, ore and herbs on the new land
for(let y=0;y<WH;y++)for(let x=0;x<MW;x++){if(inV(x,y))continue;const i=y*MW+x;if(M[i]!==1)continue;const n=hs(x*3,y*5)%100;M[i]=n<13?4:n<18?19:1}
for(let y=0;y<WH;y++)for(let x=0;x<MW;x++){if(inV(x,y))continue;const i=y*MW+x;if(M[i]!==1&&M[i]!==2)continue;
  if((hs(x*5,y*3)%100<20&&nearT(x,y,2,v=>v===35))||(M[i]===1&&hs(x*5,y*3)%100<2))M[i]=15+hs(x,y*7)%3}
{const hp=[];for(let y=0;y<WH;y++)for(let x=0;x<MW;x++){if(inV(x,y))continue;const i=y*MW+x;if(M[i]!==1)continue;const n=hs(x*17,y*19)%100;let t=0;
  if(nearT(x,y,1,v=>v===4)){if(n<16)t=[28,28,29,30][hs(x,y*5)%4];else if(n<26)t=25}
  else if(nearT(x,y,1,v=>[15,16,17,32,35].includes(v))){if(n<40)t=24}
  else if(n<5)t=27;else if(n<9)t=26;
  if(t)hp.push([i,t])}hp.forEach(([i,t])=>M[i]=t)}
// landmarks
const NB0=BL.length,clr=(x0,y0,x1,y1)=>rect(x0,y0,x1,y1,(x,y)=>{const t=at(x,y);if(t&&t!==35&&t!==36&&t!==32)setT(x,y,1)});
function walled(x0,y0,x1,y1,gx,houses){clr(x0-1,y0-1,x1+1,y1+1);rect(x0,y0,x1,y1,(x,y)=>setT(x,y,(x===x0||x===x1||y===y0||y===y1)?12:1));
  rect(gx,y0+1,gx,y1,(x,y)=>setT(x,y,6));setT(gx+1,y1,6);setT(gx,y1,6);houses.forEach(([hx,hy,roof])=>BL.push({x:hx,y:hy,w:3,roof}))}
walled(15,59,39,78,26,[[18,62,'slate'],[30,62,'thatch'],[18,69,'thatch'],[32,69,'red'],[22,72,'slate']]);        // Mountain Town, about halfway between the Temple to the Mountains and the forest
walled(84,200,115,234,100,[[87,203,'red'],[94,203,'thatch'],[103,203,'slate'],[109,203,'thatch'],[87,212,'thatch'],[109,212,'red'],[87,222,'slate'],[109,222,'thatch']]); // Walled Settlement, south end of the mainland
setT(100,234,12);setT(101,234,12);rect(85,217,114,218,(x,y)=>setT(x,y,6)); // closed south wall, one main street
[[84,216],[84,217],[84,218],[115,216],[115,217],[115,218]].forEach(([x,y])=>setT(x,y,6));[[84,215],[84,219],[115,215],[115,219]].forEach(([x,y])=>setT(x,y,45)); // west and east gates

clr(26,150,41,158);[[27,152],[30,156],[34,158]].forEach(([x,y])=>BL.push({x,y,w:3,roof:'thatch'}));         // Woodcutters' shacks
rect(26,150,41,158,(x,y)=>{if(at(x,y)===1&&hs(x,y*3)%100<10)setT(x,y,14)});
clr(67,24,76,30);BL.push({x:69,y:26,w:5,col:'#c8402a',orb:'#f2a22e'});clr(62,31,80,36);[[64,31,'red'],[75,31,'red'],[68,34,'slate']].forEach(([x,y,roof])=>BL.push({x,y,w:3,roof}));
[[66,30],[72,30],[78,34],[63,36]].forEach(([x,y])=>setT(x,y,13));                                              // Pirate Island, Temple of Fire
clr(279,30,288,35);BL.push({x:281,y:32,w:5,col:'#2f7fc4',orb:'#9ad3f0'});                                       // Temple of the Sea
clr(240,134,249,139);BL.push({x:242,y:136,w:5,col:'#cfe3f0',orb:'#ffffff'});                                    // Temple to the Sky
clr(5,24,14,29);BL.push({x:7,y:26,w:5,col:'#7a7a86',orb:'#c9cac1'});                                            // Temple to the Mountains
BL.push({x:200,y:198,w:2,tower:1});                                                                             // Temple Tower (placeholder, rebuilt by js/world/towerisland.js)
// west gate of the Walled Settlement, the road through the mountains, and the Darkwood's two gates

const carvePath=pts=>{for(let k=1;k<pts.length;k++){const a=pts[k-1],b=pts[k],n=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]));for(let q=0;q<=n;q++){const x=Math.round(a[0]+(b[0]-a[0])*q/n),y=Math.round(a[1]+(b[1]-a[1])*q/n);rect(x-1,y-1,x+1,y+1,(xx,yy)=>{if(![0,5,12,45].includes(at(xx,yy)))setT(xx,yy,6)})}}};
const RP=[[83,217],[74,205],[64,192],[54,180],[46,168],[40,158],[36,154],[36,150]];
carvePath(RP);setT(36,149,44);setT(35,149,51);setT(37,149,51);
let dkx=117;while(at(dkx,217)!==0&&dkx<MW-2)dkx++;                                   // first open water on the gate row
carvePath([[116,217],[dkx-2,217]]);                                                  // path from the east gate to the docks
rect(dkx-2,217,dkx+8,218,(x,y)=>setT(x,y,3));rect(dkx+5,215,dkx+8,220,(x,y)=>setT(x,y,3)); // the pier and its end platform
const DK=[dkx+3,217];
// no mountain rock or ore outcrops along the road to the woodcutters or around the Walled Settlement (its stone walls stay)
const segD=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy||1,q=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/l));return Math.hypot(x-a[0]-q*dx,y-a[1]-q*dy)};
const cleared=(x,y)=>(x>=78&&x<=122&&y>=194&&y<=236)||RP.some((a,k)=>k&&segD(x,y,RP[k-1],a)<=11);
rect(22,132,126,239,(x,y)=>{if(cleared(x,y)&&[35,36,15,16,17].includes(at(x,y)))setT(x,y,1)});
for(let i=0;i<M.length;i++)if(M[i]===35||M[i]===36)M[i]=1; // the mountain range is gone entirely (it kept coming back along the moved road)
// the two stone patches at the ends of the old mountain range (north of the woodcutters, south of the settlement) are gone too, including the boulder pass
rect(24,116,60,150,(x,y)=>{if([35,36].includes(at(x,y)))setT(x,y,1)});rect(94,202,130,230,(x,y)=>{if([35,36].includes(at(x,y)))setT(x,y,1)});   // south gate, by the woodcutters
carvePath([[12,34],[12,31],[9,29]]);                                                         // (the Darkwood's north gate used to be here, by the Temple to the Mountains)
// forest barrier: solid forest fills the whole width of the land, coast to coast, with no road through it: the two Darkwood gates (south by the woodcutters, north below the Mountain Town) are the way through
const FR=[[26,80],[27,95],[30,107],[31,111]]; // a road from the Mountain Town gate down to the Darkwood's north gate; the rest is closed forest
carvePath(FR);
const FOREST=[1,2,14,15,16,17,19,20,24,25,26,27,28,29,30,31];
// the barrier's north and south edges undulate (gently, one tile at a time at most, so there is never a gap), and the outer two rows are a little thinned like a real forest edge
const fTop=x=>Math.max(x>=12&&x<=50?108:100,113+Math.round(4*Math.sin(x*.17+.5)+2.5*Math.sin(x*.06+2))),fBot=x=>Math.min(148,143-Math.round(4*Math.sin(x*.14+1)+2.5*Math.sin(x*.05)));
rect(0,100,95,148,(x,y)=>{const d=Math.min(...FR.map((a,k)=>k?segD(x,y,FR[k-1],a):99)),t=fTop(x),bt=fBot(x);
  if(d<3||y<t||y>bt||!FOREST.includes(at(x,y)))return;
  if((y<t+2||y>bt-2)&&hs(x*13,y*7)%100<30)return;setT(x,y,4)});
// the forest runs on south down the west side of the map, wide at first, thinning out and tapering away toward the Walled Settlement's latitude
const wEdge=y=>(15+5*Math.sin(y*.1+1)+3*Math.sin(y*.3))*Math.min(1,Math.max(0,1-(y-148)/80));
rect(0,128,25,228,(x,y)=>{const e=wEdge(y)+(hs(x*3,y*5)%100-50)/50;if(x>=e||!FOREST.includes(at(x,y)))return;
  if(RP.some((a,k)=>k&&segD(x,y,RP[k-1],a)<4))return;
  if(e-x<2.5&&hs(x*13,y*7)%100<40)return;setT(x,y,4)});
rect(30,109,32,109,(x,y)=>setT(x,y,6));setT(31,110,44);setT(30,110,51);setT(32,110,51);                               // the Darkwood's north gate, at the end of the road from the Mountain Town
BL.slice(NB0).forEach(b=>{for(let j=0;j<2;j++)for(let i=0;i<b.w;i++)setT(b.x+i,b.y+j,5)});
// the mountain country north of the forest: no grass, trees or herbs, only bare rock in terraces that step up toward the north.
// 48 rock floor, 49 cliff face (blocks the way), 50 rock steps (a way up). TLV holds each terrace tile's height (0 = not terrace).
const TLV=new Uint8Array(MW*MH);
{const inR=(x,y,r)=>x>=r[0]&&y>=r[1]&&x<=r[2]&&y<=r[3];
 const PT=[11,55,43,82],PI=[14,58,40,79],PW=[2,21,17,32],PWI=[4,23,15,30]; // flat platforms under the Mountain Town and the Temple to the Mountains (and the parts inside them where no cliffs are allowed)
 const rw=(x,y)=>Math.max(0,Math.round((fTop(x)-y)/8+.7*Math.sin(x*.08+y*.04)+.5*Math.sin(y*.06-x*.04+2)));
 const lt=rw(27,68),lw=rw(9,26),lv=(x,y)=>inR(x,y,PT)?lt:inR(x,y,PW)?lw:rw(x,y);
 const GREEN=[1,4,14,19,20,24,25,26,27,28,29,30,31],ROCK=[5,15,16,17,18],XS=[[0,-1],[0,1],[-1,0],[1,0]];
 for(let y=0;y<WH;y++)for(let x=0;x<100;x++){if(y>=fTop(x)||inV(x,y)||x>coastX(y)+5)continue;const i=y*MW+x;
   if(GREEN.includes(M[i])){M[i]=48;TLV[i]=Math.min(250,lv(x,y)+1)}else if(ROCK.includes(M[i]))TLV[i]=Math.min(250,lv(x,y)+1)}
 const cl=[];
 for(let y=0;y<WH;y++)for(let x=0;x<100;x++){const i=y*MW+x;if(M[i]!==48||inR(x,y,PI)||inR(x,y,PWI))continue;
   if(XS.some(([a,b])=>{const j=i+b*MW+a;return TLV[j]&&TLV[j]<TLV[i]}))cl.push(i)}
 cl.forEach(i=>{M[i]=hs(i,3)%100<8?50:49});
 // join every walkable patch with a few rock steps so no terrace is cut off: add steps wherever a cliff touches two separate patches
 const R0=[0,0,99,125],lab=new Int32Array(MW*MH).fill(-1),par=[],find=a=>{while(par[a]!==a)a=par[a]=par[par[a]];return a};
 for(let y=R0[1];y<=R0[3];y++)for(let x=R0[0];x<=R0[2];x++){const i=y*MW+x;if(!WK.includes(M[i])||lab[i]>=0)continue;
   const id=par.length;par.push(id);lab[i]=id;const q=[i];while(q.length){const c=q.pop(),cx=c%MW,cy=c/MW|0;
     XS.forEach(([a,b])=>{const nx=cx+a,ny=cy+b;if(nx<R0[0]||ny<R0[1]||nx>R0[2]||ny>R0[3])return;const j=ny*MW+nx;if(lab[j]<0&&WK.includes(M[j])){lab[j]=id;q.push(j)}})}}
 cl.filter(i=>M[i]===49).sort((a,b)=>hs(a,7)-hs(b,7)).forEach(i=>{const ls=new Set();XS.forEach(([a,b])=>{const j=i+b*MW+a;if(lab[j]>=0)ls.add(find(lab[j]))});
   if(ls.size>1){const l=[...ls];M[i]=50;l.forEach(v=>par[find(v)]=find(l[0]))}})}
// the gates are set into the forest: dark thick trees close in on both sides and behind each torii, thinning to ordinary trees further out
{const OKT=[1,2,4,6,14,15,16,17,18,19,20,24,25,26,27,28,29,30,31,35,36,48,49,50];
 const tr=(x,y,d)=>{if(OKT.includes(at(x,y))&&(d<5||hs(x*13,y*7)%100>=18))setT(x,y,d<5?41:4)};
 const frame=(gx,gy,dir)=>{for(let k=-7;k<=7;k++)for(let r=1;r<=5;r++)tr(gx+k,gy+dir*r,Math.abs(k)+(r>3?2:0));
   for(let k=2;k<=7;k++){tr(gx-k,gy,k);tr(gx+k,gy,k)}
   for(let k=4;k<=7;k++){tr(gx-k,gy-dir,k);tr(gx+k,gy-dir,k)}};
 frame(36,149,-1);frame(31,110,1)}
const LAND=[['Village',OX+32,OY+22],['Mainland',50,185],['Mountain Town',27,68],['Walled Settlement',100,210],['Settlement Docks',DK[0],DK[1]-2],["Woodcutters' Shacks",33,153],['Temple to the Mountains',6,18],["Sailors' Grave Rocks",90,86],['Island 1',206,81],['Island 2',190,136],['Island 3',244,142],['Island 4',128,78],['Island 5',283,38],['Island 6',144,170],['Pirate Island',71,32],['Temple of Fire',71,25],['Temple of the Sea',283,35],['Temple to the Sky',244,138],['Temple Tower',212,196],['Spirit Isle',OX+22,OY+44],['Darkwood south gate',36,146],['Darkwood north gate',31,110]];
