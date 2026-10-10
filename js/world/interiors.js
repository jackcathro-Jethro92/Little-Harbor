const FY=258; // the Darkwood is drawn FY rows below where its own coordinates say (see below)
// ---------- home interior: a hidden room in the south-east sea, shown only when you are inside ----------
const IR={x0:300,y0:250,x1:311,y1:259,dx:305,dy:258},inRoom=(x,y)=>x>=IR.x0&&x<=IR.x1&&y>=IR.y0&&y<=IR.y1;
if(!S.wv){S.wv=2; // saves from the small world used old coordinates: move them into the big map
  const mv=o=>{const ir=o.x>=50&&o.x<=61&&o.y>=41&&o.y<=50;o.x+=ir?IR.x0-50:OX;o.y+=ir?IR.y0-41:OY};
  S.placed.forEach(mv);S.gardens.forEach(g=>{g.x+=OX;g.y+=OY});if(S.claim){S.claim.x+=OX;S.claim.y+=OY}if(S.home){S.home.x+=OX;S.home.y+=OY}
  const nc={};for(const k in S.cut){const x=k%64,y=(k/64)|0;nc[(y+OY)*MW+x+OX]=S.cut[k]}S.cut=nc}
if(S.wv<3){S.wv=3; // the hidden rooms moved below the sea (world version 3): carry saved things inside the home room and the Darkwood to their new places
  S.placed.forEach(o=>{if(o.x>=300&&o.x<=311&&o.y>=226&&o.y<=235)o.y+=24});
  const nc={};for(const k in S.cut){const x=k%MW,y=(k/MW)|0,fz=x>=100&&x<=147&&y>=4&&y<=39;nc[fz?(y+FY)*MW+x:k]=S.cut[k]}S.cut=nc}
for(let y=IR.y0;y<=IR.y1;y++)for(let x=IR.x0;x<=IR.x1;x++)M[y*MW+x]=(x===IR.x0||x===IR.x1||y===IR.y0||y===IR.y1)?22:21;
M[IR.y1*MW+IR.dx]=23;
if(S.home)for(let j=0;j<2;j++)for(let i=0;i<3;i++)M[(S.home.y+j)*MW+S.home.x+i]=5;
// ---------- the Darkwood: a separate forest map. Gates at both ends, a winding trail, dead ends with treasure, tall grass ----------
const FZ={x0:100,y0:4+FY,x1:147,y1:39+FY},inFZ=(x,y)=>x>=FZ.x0&&x<=FZ.x1&&y>=FZ.y0&&y<=FZ.y1,zoneOf=(x,y)=>inRoom(x,y)?1:inFZ(x,y)?2:inGZ(x,y)?3:inAZ(x,y)?4:inSZ(x,y)?5:inHZ(x,y)?6:inVZ(x,y)?7:inPH(x,y)?8:inPG(x,y)?9:inTS(x,y)?10:0;
// zone 3: the Fighters Guild hall, zone 4: the Gladiators' Arena (hidden rooms in the south-east sea, like the home interior)
const GZ={x0:270,y0:250,x1:281,y1:259,dx:275},inGZ=(x,y)=>x>=GZ.x0&&x<=GZ.x1&&y>=GZ.y0&&y<=GZ.y1;
const AZ={x0:270,y0:262,x1:283,y1:275,dx:277},inAZ=(x,y)=>x>=AZ.x0&&x<=AZ.x1&&y>=AZ.y0&&y<=AZ.y1;
// zone 5: the Earth temple's sanctum
const SZ={x0:250,y0:248,x1:263,y1:259,dx:257},inSZ=(x,y)=>x>=SZ.x0&&x<=SZ.x1&&y>=SZ.y0&&y<=SZ.y1;
// zones 6 and 7: the Temple of the Sea's hall and the vault under the lake
const HZ={x0:230,y0:248,x1:243,y1:259,dx:237},inHZ=(x,y)=>x>=HZ.x0&&x<=HZ.x1&&y>=HZ.y0&&y<=HZ.y1;
const VZ={x0:210,y0:248,x1:223,y1:259,dx:217},inVZ=(x,y)=>x>=VZ.x0&&x<=VZ.x1&&y>=VZ.y0&&y<=VZ.y1;
// zone 8: the Temple of Fire's hall
const PH={x0:190,y0:248,x1:203,y1:259,dx:196},inPH=(x,y)=>x>=PH.x0&&x<=PH.x1&&y>=PH.y0&&y<=PH.y1;
// zone 9: the inside of the Temple of Fire's great gate (a short hall with a door at each end)
const PG={x0:170,y0:252,x1:183,y1:259,dx:177},inPG=(x,y)=>x>=PG.x0&&x<=PG.x1&&y>=PG.y0&&y<=PG.y1;
const TS={x0:156,y0:250,x1:166,y1:259,dx:161},inTS=(x,y)=>x>=TS.x0&&x<=TS.x1&&y>=TS.y0&&y<=TS.y1;   // zone 10: the Temple Tower's shrine room
const FSET=setT,FAT=at,FNPC=NPC,FBL=BL;   // the forest is drawn in its own coordinates (y 4-39) and placed FY rows lower, in the hidden area below the sea
{const FZ={x0:100,y0:4,x1:147,y1:39},setT=(x,y,t)=>FSET(x,y+FY,t),at=(x,y)=>FAT(x,y+FY),nearT=(x,y,r,f)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(f(at(x+i,y+j)))return true;return false},NPC={push:(...o)=>o.forEach(n=>FNPC.push({...n,y:n.y+FY,hy:n.hy+FY}))},BL={push:(...o)=>o.forEach(b=>FBL.push({...b,y:b.y+FY}))};
rect(FZ.x0,FZ.y0,FZ.x1,FZ.y1,(x,y)=>setT(x,y,41));
const inner=(x,y)=>x>FZ.x0&&x<FZ.x1&&y>FZ.y0&&y<FZ.y1;
const trail=(pts,w,t)=>{for(let k=1;k<pts.length;k++){const a=pts[k-1],b=pts[k],n=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]));let lx=a[0],ly=a[1];for(let q=0;q<=n;q++){const x=Math.round(a[0]+(b[0]-a[0])*q/n),y=Math.round(a[1]+(b[1]-a[1])*q/n);rect(x-w,y-w,x+w,y+w,(xx,yy)=>{if(inner(xx,yy))setT(xx,yy,t)});if(lx!==x&&ly!==y&&inner(x,ly))setT(x,ly,t);lx=x;ly=y}}};
const clearing=(cx,cy,r)=>rect(cx-r,cy-r,cx+r,cy+r,(x,y)=>{if(inner(x,y)&&(x-cx)**2+(y-cy)**2<=r*r)setT(x,y,40)});
[[109,29,3],[140,21,3],[106,11,3],[140,10,3],[123,10,6]].forEach(a=>clearing(...a));
trail([[123,38],[123,34],[128,31],[128,26],[121,24],[115,20],[118,15],[123,12]],1,42);
trail([[123,12],[129,10],[134,7],[136,5]],1,42);
trail([[123,34],[112,34],[110,30]],0,42);trail([[128,26],[138,26],[140,22]],0,42);trail([[115,20],[108,18],[106,13]],0,42);trail([[134,8],[140,11]],0,42);
setT(123,39,43);setT(122,39,51);setT(124,39,51);setT(136,4,43);setT(135,4,51);setT(137,4,51); // exit arches: a three-wide torii at each end
{const gr=[],hb=[];rect(FZ.x0,FZ.y0,FZ.x1,FZ.y1,(x,y)=>{if(at(x,y)!==40)return;const n=hs(x*13,y*7)%100;
  if(Math.hypot(x-123,y-10)<=6.5){if(n<10)hb.push([x,y]);return}
  if(n<45)gr.push([x,y]);else if(n<62&&nearT(x,y,1,v=>v===41))hb.push([x,y])});
  gr.forEach(([x,y])=>setT(x,y,47));hb.forEach(([x,y])=>setT(x,y,[28,29,29,30,30,25,24,27][hs(x,y*5)%8]))}
BL.push({x:120,y:7,w:3,roof:'thatch'});for(let j=0;j<2;j++)for(let i=0;i<3;i++)setT(120+i,7+j,5);       // the woodcutter's cottage
[[126,9],[127,11],[117,11]].forEach(([x,y])=>{if(at(x,y)===40)setT(x,y,14)});
setT(121,9,40);setT(107,12,40);
NPC.push({n:'Hale',x:121,y:9,hx:121,hy:9,f:'d',skin:2,hair:1,shirt:2,jk:3,hat:'cap',fixed:1,say:['Keep to the trail. The Darkwood swallows folk who wander off it.','Thirty winters I have cut timber here. Something is stirring in the deep woods.','Mind the mushrooms. Some will cure you and some will kill you.']},
  {n:'Wren',x:107,y:12,hx:107,hy:12,f:'r',skin:0,hair:4,shirt:3,jk:4,hat:'none',fixed:1,say:['I forage here for the alchemists. Dead ends hide the best finds.','Tall grass hides hornets. Do not say I did not warn you.']});
}
const FB=[[109,29],[140,21],[106,11],[140,10],[119,16],[130,28]].map(([x,y])=>[x,y+FY]);FB.forEach(([x,y])=>setT(x,y,46)); // treasure bundles
const FLOOT=[{i:[['healing_potion',1]],g:30},{i:[['stamina_tonic',1],['blue_cap',2]]},{i:[['greater_healing',1]]},{i:[['iron_bar',1],['rope',2]]},{i:[['death_cap',1]],g:80},{i:[['swiftness_potion',1],['forest_sprig',2]]}];
Object.keys(S.cut).forEach(i=>{if(([15,16,17].includes(S.cut[i].m)&&cleared(i%MW,(i/MW)|0))||[48,49,50].includes(M[i])){delete S.cut[i];return}M[i]=STUB(S.cut[i].m)});
