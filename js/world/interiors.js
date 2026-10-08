// ---------- home interior: a hidden room in the south-east sea, shown only when you are inside ----------
const IR={x0:300,y0:226,x1:311,y1:235,dx:305,dy:234},inRoom=(x,y)=>x>=IR.x0&&x<=IR.x1&&y>=IR.y0&&y<=IR.y1;
if(!S.wv){S.wv=2; // saves from the small world used old coordinates: move them into the big map
  const mv=o=>{const ir=o.x>=50&&o.x<=61&&o.y>=41&&o.y<=50;o.x+=ir?IR.x0-50:OX;o.y+=ir?IR.y0-41:OY};
  S.placed.forEach(mv);S.gardens.forEach(g=>{g.x+=OX;g.y+=OY});if(S.claim){S.claim.x+=OX;S.claim.y+=OY}if(S.home){S.home.x+=OX;S.home.y+=OY}
  const nc={};for(const k in S.cut){const x=k%64,y=(k/64)|0;nc[(y+OY)*MW+x+OX]=S.cut[k]}S.cut=nc}
for(let y=IR.y0;y<=IR.y1;y++)for(let x=IR.x0;x<=IR.x1;x++)M[y*MW+x]=(x===IR.x0||x===IR.x1||y===IR.y0||y===IR.y1)?22:21;
M[IR.y1*MW+IR.dx]=23;
if(S.home)for(let j=0;j<2;j++)for(let i=0;i<3;i++)M[(S.home.y+j)*MW+S.home.x+i]=5;
// ---------- the Darkwood: a separate forest map. Gates at both ends, a winding trail, dead ends with treasure, tall grass ----------
const FZ={x0:100,y0:4,x1:147,y1:39},inFZ=(x,y)=>x>=FZ.x0&&x<=FZ.x1&&y>=FZ.y0&&y<=FZ.y1,zoneOf=(x,y)=>inRoom(x,y)?1:inFZ(x,y)?2:inGZ(x,y)?3:inAZ(x,y)?4:inSZ(x,y)?5:inHZ(x,y)?6:inVZ(x,y)?7:inPH(x,y)?8:0;
// zone 3: the Fighters Guild hall, zone 4: the Gladiators' Arena (hidden rooms in the south-east sea, like the home interior)
const GZ={x0:270,y0:226,x1:281,y1:235,dx:275},inGZ=(x,y)=>x>=GZ.x0&&x<=GZ.x1&&y>=GZ.y0&&y<=GZ.y1;
const AZ={x0:270,y0:208,x1:283,y1:221,dx:277},inAZ=(x,y)=>x>=AZ.x0&&x<=AZ.x1&&y>=AZ.y0&&y<=AZ.y1;
// zone 5: the Earth temple's sanctum
const SZ={x0:250,y0:224,x1:263,y1:235,dx:257},inSZ=(x,y)=>x>=SZ.x0&&x<=SZ.x1&&y>=SZ.y0&&y<=SZ.y1;
// zones 6 and 7: the Temple of the Sea's hall and the vault under the lake
const HZ={x0:230,y0:224,x1:243,y1:235,dx:237},inHZ=(x,y)=>x>=HZ.x0&&x<=HZ.x1&&y>=HZ.y0&&y<=HZ.y1;
const VZ={x0:210,y0:224,x1:223,y1:235,dx:217},inVZ=(x,y)=>x>=VZ.x0&&x<=VZ.x1&&y>=VZ.y0&&y<=VZ.y1;
// zone 8: the Temple of Fire's hall
const PH={x0:190,y0:224,x1:203,y1:235,dx:196},inPH=(x,y)=>x>=PH.x0&&x<=PH.x1&&y>=PH.y0&&y<=PH.y1;
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
const FB=[[109,29],[140,21],[106,11],[140,10],[119,16],[130,28]];FB.forEach(([x,y])=>setT(x,y,46)); // treasure bundles
const FLOOT=[{i:[['healing_potion',1]],g:30},{i:[['stamina_tonic',1],['blue_cap',2]]},{i:[['greater_healing',1]]},{i:[['iron_bar',1],['rope',2]]},{i:[['death_cap',1]],g:80},{i:[['swiftness_potion',1],['forest_sprig',2]]}];
BL.push({x:120,y:7,w:3,roof:'thatch'});for(let j=0;j<2;j++)for(let i=0;i<3;i++)setT(120+i,7+j,5);       // the woodcutter's cottage
[[126,9],[127,11],[117,11]].forEach(([x,y])=>{if(at(x,y)===40)setT(x,y,14)});
setT(121,9,40);setT(107,12,40);
NPC.push({n:'Hale',x:121,y:9,hx:121,hy:9,f:'d',skin:2,hair:1,shirt:2,jk:3,hat:'cap',fixed:1,say:['Keep to the trail. The Darkwood swallows folk who wander off it.','Thirty winters I have cut timber here. Something is stirring in the deep woods.','Mind the mushrooms. Some will cure you and some will kill you.']},
  {n:'Wren',x:107,y:12,hx:107,hy:12,f:'r',skin:0,hair:4,shirt:3,jk:4,hat:'none',fixed:1,say:['I forage here for the alchemists. Dead ends hide the best finds.','Tall grass hides hornets. Do not say I did not warn you.']});
Object.keys(S.cut).forEach(i=>{if(([15,16,17].includes(S.cut[i].m)&&cleared(i%MW,(i/MW)|0))||[48,49,50].includes(M[i])){delete S.cut[i];return}M[i]=STUB(S.cut[i].m)});
