// ---------- the Temple of Fire's island (the old Pirate Island): an active volcano with lava rivers running into the sea ----------
// Runs after skytemple.js. The island is rebuilt here, about 42 x 36 tiles round (71,28). Jagged volcanic peaks (tile 86) fill the north around a crater lava lake (87);
// rivers of lava (84) run down from it, two of them flanking a big flat basalt plateau at the volcano's southern base (x 60-82, y 29-41) where the temple will sit, and
// flow on into the sea. A black-sand beach (83) is the landing in the south and a three-wide path of basalt slabs (85) leads from it up to the plateau. The sea round the island is
// tinted turquoise (REEF). The three pirate houses and the gravestones keep their place on the island's east shore, beyond the east lava river. Tiles 82 basalt ground.
const REEF=new Set();
{const cx=71,cy=28,rx=21,ry=18,D4=[[1,0],[-1,0],[0,1],[0,-1]];
 const inb=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH;
 const rr=(x,y)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry,a=Math.atan2(dy,dx);return Math.hypot(dx,dy)*(1+.08*Math.sin(3*a+.4)+.05*Math.sin(6*a+1.3)+.03*Math.sin(10*a))};
 {const i=BL.findIndex(b=>b.col==='#c8402a'&&b.x===69);if(i>=0)BL.splice(i,1)}               // the old placeholder temple goes
 const pirates=BL.filter(b=>b.x>=60&&b.x<=80&&b.y>=30&&b.y<=36&&b.roof).map(b=>({...b}));BL.splice(0,BL.length,...BL.filter(b=>!(b.x>=60&&b.x<=80&&b.y>=30&&b.y<=36&&b.roof)));
 const X0=cx-rx-8,X1=cx+rx+8,Y0=cy-ry-8,Y1=cy+ry+8;
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){if(inb(x,y)&&rr(x,y)<1.3)setT(x,y,0)}       // wipe the old island, its islets and their gravestones
 const land=new Set();
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){const r=rr(x,y);if(r>=1)continue;land.add(y*MW+x);setT(x,y,r>.92?83:82)}   // basalt with a ring of black sand
 const vd=(x,y)=>Math.hypot((x-71)/12,(y-19)/9.5)+.12*Math.sin(x*.9)+.1*Math.sin(y*1.3+x*.4);
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){if(land.has(y*MW+x)&&at(x,y)===82&&vd(x,y)<1)setT(x,y,86)}   // the volcano: jagged peaks
 rect(60,29,82,41,(x,y)=>{if(land.has(y*MW+x)&&at(x,y)!==83)setT(x,y,82)});                  // the flat plateau at the base
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++)if(land.has(y*MW+x)&&vd(x,y)<.28)setT(x,y,87)    // the crater's lava lake
 const river=(pts,w)=>{for(let k=1;k<pts.length;k++){const[a,b]=pts[k-1],[c,d]=pts[k],n=Math.max(Math.abs(c-a),Math.abs(d-b));for(let q=0;q<=n;q++){const x=Math.round(a+(c-a)*q/n),y=Math.round(b+(d-b)*q/n),o=Math.round(.8*Math.sin(y*.7+k));
     for(let j=-w;j<=w;j++)for(let i=-w;i<=w;i++)if(inb(x+i+o,y+j)&&Math.abs(i)+Math.abs(j)<=w+1)setT(x+i+o,y+j,84)}}};
 river([[67,19],[63,21],[60,24],[58,29],[58,34],[59,39],[58,44],[57,49]],1);                  // the west river, flowing down past the plateau into the sea
 river([[75,19],[79,21],[82,24],[84,29],[84,34],[83,39],[85,44],[86,49]],1);                  // the east river
 river([[68,16],[64,14],[60,13],[55,13],[51,11]],1);river([[75,16],[79,14],[83,13],[88,13],[92,11]],1);   // two more running out to the north-west and north-east
 river([[71,16],[71,12],[71,9]],1);                                                         // and one straight north
 rect(70,41,72,44,(x,y)=>setT(x,y,85));rect(65,45,77,46,(x,y)=>{if(land.has(y*MW+x)&&at(x,y)!==84)setT(x,y,83)});   // the slab path up from the landing, and the landing beach
 for(let y=36;y<=40;y++)for(let x=69;x<=73;x++)if(at(x,y)===82)setT(x,y,82);
 pirates.forEach((b,k)=>{const nb={...b,x:86,y:[20,26,32][k]};rect(nb.x,nb.y,nb.x+2,nb.y+1,(x,y)=>setT(x,y,5));BL.push(nb)});      // the pirate houses move to the east shore
 [[90,24],[90,30],[89,36],[88,17]].forEach(([x,y])=>{if(at(x,y)===82||at(x,y)===83)setT(x,y,13)});
 // the sea round the island is turquoise reef
 for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){if(!inb(x,y)||at(x,y)!==0)continue;let near=false;for(let j=-3;j<=3&&!near;j++)for(let i=-3;i<=3;i++){const v=at(x+i,y+j);if(v!==0&&inb(x+i,y+j)){near=true;break}}if(near)REEF.add(y*MW+x)}
 Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x>=X0&&x<=X1&&y>=Y0&&y<=Y1)delete S.cut[i]})}
