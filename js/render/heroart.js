// ---------- detailed character art (batch H1): the big picture of a person used on menus, in battle and beside their words ----------
// Jack asked for art at the detail of the FireRed trainer pictures. Everything is drawn here in code from a small description (a "spec"), so any picture can later be swapped for an image file:
// put a PNG in ART_FILES (below) under the person's key and it is used instead.
// How a picture is made: the body is built from shapes, each a "part" with one colour (skin, hair, shirt, vest...). Every part is shaded automatically (light from the top left: a light edge on the top and left,
// a shadow on the bottom and right), parts lying on top of others get a dark line where they meet, and the whole figure gets a dark outline. Then small details are put on by hand (eyes, mouth, stripes, buttons).
// The figure is HA_W x HA_H pixels (48 x 72); the face sits in the top 30 rows, so a talking portrait is a crop of the head and shoulders (heroPortrait).
const HA_W=48,HA_H=72,HA_OUT='#2b2118',ART_FILES={};
const haHex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const haToHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const haMix=(a,b,t)=>{const A=haHex(a),B=haHex(b);return haToHex(A.map((v,i)=>v+(B[i]-v)*t))};
// a colour's four tones: light, base, shadow (cooler) and deep (for lines)
const haRamp=c=>[haMix(c,'#fff6dc',.34),c,haMix(haMix(c,'#000000',.24),'#3a2a6a',.16),haMix(haMix(c,'#000000',.5),'#2a1a3a',.2)];
function HAPainter(){this.pid=new Int16Array(HA_W*HA_H).fill(-1);this.parts=[];this.det=[]}
HAPainter.prototype={
  part(color,opt){this.parts.push({r:haRamp(color),o:opt||{}});return this.parts.length-1},
  fill(k,f){for(let y=0;y<HA_H;y++)for(let x=0;x<HA_W;x++)if(f(x+.5,y+.5))this.pid[y*HA_W+x]=k},
  erase(f){this.fill(-1,f)},
  at(x,y){return x<0||y<0||x>=HA_W||y>=HA_H?-1:this.pid[y*HA_W+x]},
  dot(x,y,c){this.det.push([x,y,1,1,c])},
  rect(x,y,w,h,c){this.det.push([x,y,w,h,c])},
  line(x0,y0,x1,y1,c){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)this.dot(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),c)},
  tone(k,t){return this.parts[k].r[t]},
  render(cv){const c=cv.getContext('2d'),img=c.createImageData(HA_W,HA_H),d=img.data,set=(x,y,h)=>{const a=haHex(h),i=(y*HA_W+x)*4;d[i]=a[0];d[i+1]=a[1];d[i+2]=a[2];d[i+3]=255};
    for(let y=0;y<HA_H;y++)for(let x=0;x<HA_W;x++){const k=this.at(x,y);
      if(k<0){if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>this.at(x+a,y+b)>=0))set(x,y,HA_OUT);continue}
      const P=this.parts[k],same=(a,b)=>this.at(x+a,y+b)===k;
      let t=1;
      if(!P.o.noLine&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const j=this.at(x+a,y+b);return j>=0&&j<k&&!this.parts[j].o.under}))t=3;
      else if(P.o.flat)t=1;
      else{let a=x,b=x;while(this.at(a-1,y)===k)a--;while(this.at(b+1,y)===k)b++;const n=b-a+1,f=(x-a+.5)/n,lo=P.o.soft?.14:.24,hi=P.o.soft?.8:.7;
        if(n>=4&&f<lo)t=0;else if(n>=3&&f>hi)t=2;else if(!same(0,1))t=2;else if(!same(0,-1)&&f<.6)t=0;
        if(P.o.shade&&P.o.shade(x,y))t=2}
      set(x,y,P.r[t])}
    c.putImageData(img,0,0);this.det.forEach(([x,y,w,h,col])=>{c.fillStyle=col;c.fillRect(x,y,w,h)})}};
const haEl=(cx,cy,rx,ry)=>(x,y)=>((x-cx)/rx)**2+((y-cy)/ry)**2<=1;
const haPoly=pts=>(x,y)=>{let ins=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)ins=!ins}return ins};
const haOr=(...fs)=>(x,y)=>fs.some(f=>f(x,y));
const haAnd=(...fs)=>(x,y)=>fs.every(f=>f(x,y));
// a limb: everything within r of the line from (ax,ay) to (bx,by)
// a tapering limb (radius r0 at a, r1 at b), and an ellipse turned to point along (ux,uy)
const haTaper=(ax,ay,bx,by,r0,r1)=>(x,y)=>{const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-ax-dx*t,y-ay-dy*t)<=r0+(r1-r0)*t};
const haOEl=(cx,cy,ux,uy,ra,rb)=>(x,y)=>{const a=(x-cx)*ux+(y-cy)*uy,b=-(x-cx)*uy+(y-cy)*ux;return(a/ra)**2+(b/rb)**2<=1};
const haSeg=(ax,ay,bx,by,r)=>(x,y)=>{const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-ax-dx*t,y-ay-dy*t)<=r};
// POSES: how each character stands (Jack: "dynamic positions and poses, a sense of movement"). lean: how far the head and shoulders sway sideways (pixels at the head); arms and legs are joints in the front picture:
// aL/aR = [elbow, hand], lL/lR = [knee, ankle]; hand:false hides a hand (in a pocket); prop: something held. The back picture (battle) is the same pose seen from behind (mirrored).
const POSES={
 rod:{lean:1.4,aL:[[8.5,37],[15.5,44]],aR:[[39.5,33],[36.5,24.5]],lL:[[19,56],[16.5,68]],lR:[[30.5,56],[33.5,68]],prop:'rod'},
 hips:{lean:-.8,aL:[[7.5,37.5],[15.5,44]],aR:[[40.5,37.5],[32.5,44]],lL:[[18,56],[14.5,68]],lR:[[30,56],[33.5,68]]},
 walk:{lean:-1.4,aL:[[11,37],[18.5,34.5]],aR:[[36.5,38],[38.5,45.5]],lL:[[18.5,56.5],[17,68]],lR:[[29.5,55.5],[32.5,65.5,1]]},
 wave:{lean:-1.2,aL:[[10.5,38],[16.5,45.5],false],aR:[[41.5,25],[42,14.5]],lL:[[19,56],[16,68]],lR:[[29.5,56],[32,68]]},
 cross:{lean:0,aL:[[10.5,38.5],[28.5,37],false],aR:[[37.5,38.5],[19.5,38.5]],lL:[[18.5,56],[15.5,68]],lR:[[29.5,56],[32.5,68]]},
 point:{lean:1.6,aL:[[7.5,37],[15.5,44]],aR:[[40,30.5],[46,26]],lL:[[17.5,56],[13.5,67.5]],lR:[[29.5,57],[30.5,68]]},
 stand:{lean:0,aL:[[11.5,37],[13.3,46]],aR:[[36.5,37],[34.7,46]],lL:[[20,56],[19.5,68]],lR:[[28,56],[28.5,68]]}};
// spec: {sex:'f'|'m', pose, hair:'braid'|'bob'|'wavy'|'messy'|'curly'|'crop', top:'sweater'|'stripes'|'tunic'|'tee'|'shirt', over:'vest'|'flannel'|'coat'|null, acc:[...], col:{skin,hair,shirt,jacket,hat,pants,boots,eye}}
// view 'f' (front) or 'b' (back, for battle). arm: the worn armour {helm, body, boots} (ARM_PAL names), drawn over the clothes.
function paintHero(spec,view,arm){const p=new HAPainter(),C=spec.col,fem=spec.sex==='f',back=view==='b',acc=spec.acc||[],A=arm||{},ap=k=>A[k]&&ARM_PAL[k==='boots'&&A[k]==='enchanted'?'enchanted_boots':A[k]];
  const P0=POSES[spec.pose]||POSES.stand,mx=back?(v=>48-v):(v=>v),J=v=>Array.isArray(v)?[mx(v[0]),v[1],v[2]]:v,P={lean:back?-P0.lean:P0.lean,aL:(back?P0.aR:P0.aL).map(J),aR:(back?P0.aL:P0.aR).map(J),lL:(back?P0.lR:P0.lL).map(J),lR:(back?P0.lL:P0.lR).map(J),
    hideL:(back?P0.aR:P0.aL)[2]===false,hideR:(back?P0.aL:P0.aR)[2]===false,prop:P0.prop};
  const ux=y=>y<45?P.lean*(45-y)/16:0,U=f=>(x,y)=>f(x-ux(y),y);   // the upper body sways: U shifts a shape, DU/RU a detail
  const DU=(x,y,c)=>p.dot(Math.round(x+ux(y)),y,c),RU=(x,y,w,h,c)=>p.rect(Math.round(x+ux(y)),y,w,h,c),LU=(x0,y0,x1,y1,c)=>p.line(Math.round(x0+ux(y0)),y0,Math.round(x1+ux(y1)),y1,c);
  const long=spec.hair==='wavy',skin=p.part(C.skin,{soft:1}),dk=C.skin;
  // long hair falls behind the shoulders, so it is drawn first
  const hairBack=p.part(C.hair,{under:1});
  if(long&&!back)p.fill(hairBack,U(haPoly([[13,14],[35,14],[37,38],[33,40],[24,41],[15,40],[11,38]])));
  // legs (hip, knee, ankle) and boots
  const pants=p.part(C.pants||'#3b4a6b'),bootC=ap('boots')?ap('boots')[0]:C.boots||'#5a3a22',boots=p.part(bootC),tr=fem?3.5:3.8;
  [[20,P.lL],[28,P.lR]].forEach(([hx,[k,f]])=>{p.fill(pants,haOr(haTaper(hx,46,k[0],k[1],tr+.5,tr-.35),haEl(k[0],k[1],tr-.35,tr-.35),haTaper(k[0],k[1],f[0],f[1],tr-.35,tr-1.15),haEl(hx,46.5,tr+.6,3.2),haOEl(k[0]+(f[0]-k[0])*.3+(f[0]<24?-.5:.5),k[1]+(f[1]-k[1])*.3,0,1,3.6,tr-.1)))});
  [[20,P.lL],[28,P.lR]].forEach(([hx,[k,f]])=>{const dir=f[0]<24?-1:1,t=.55,bx=k[0]+(f[0]-k[0])*t,by=k[1]+(f[1]-k[1])*t;
    p.fill(boots,haOr(haSeg(bx,by,f[0],f[1],tr-.3),f[2]?haEl(f[0]+dir*1.2,f[1]+.6,3,2.1):haEl(f[0]+dir*1.6,f[1]+1.2,4.1,2.2)))});
  // body: the shirt (or tunic), the coat or jacket over it, the arms, then the head
  const bodyC=ap('body')?ap('body')[0]:C.shirt,shirt=p.part(bodyC);
  const torso=U(fem?haPoly([[20.5,24.5],[27.5,24.5],[33,27.2],[34.3,30],[33.6,34],[32,38.5],[33.4,43],[33.6,47],[14.4,47],[14.6,43],[16,38.5],[14.4,34],[13.7,30],[15,27.2]]):haPoly([[20,24.5],[28,24.5],[34.2,27],[35.8,30],[35,35],[33.6,40],[33.2,47],[14.8,47],[14.4,40],[13,35],[12.2,30],[13.8,27]]));
  p.fill(shirt,haOr(torso,spec.top==='tunic'?haPoly([[15,44],[33,44],[35,53],[13,53]]):()=>false));
  const jk=spec.over&&!ap('body')?p.part(C.jacket):-1;
  if(jk>=0){if(spec.over==='coat')p.fill(jk,haOr(torso,haPoly([[14,44],[34,44],[35.5,52],[12.5,52]])));
    else p.fill(jk,haAnd(torso,(x,y)=>back||Math.abs(x-ux(y)-24)>(spec.over==='vest'?3:2.5)+(y-27)*.08))}
  const short=(spec.top==='stripes'||spec.top==='shirt')&&!ap('body');   // short or rolled sleeves show the forearm
  const sleeves=p.part(spec.over&&spec.over!=='vest'&&!ap('body')?C.jacket:bodyC);
  // arms: a rounded shoulder, an upper arm that tapers to the elbow, a forearm that narrows to the wrist, and a hand turned the way the forearm points (palm, thumb and finger lines)
  const hands=[];
  [[14.5,P.aL,P.hideL],[33.5,P.aR,P.hideR]].forEach(([sx,[e,h],hide])=>{const S=[sx+ux(29),29.5],L=Math.hypot(h[0]-e[0],h[1]-e[1])||1,d=[(h[0]-e[0])/L,(h[1]-e[1])/L],W=[h[0]-d[0]*2.1,h[1]-d[1]*2.1];
    const up=haOr(haTaper(S[0],S[1],e[0],e[1],3.3,2.55),haEl(S[0],S[1]+.4,3.5,3.2)),elbow=haEl(e[0],e[1],2.55,2.55),fore=haTaper(e[0],e[1],W[0],W[1],2.45,1.55),cuff=[e[0]+(W[0]-e[0])*(short?.22:.86),e[1]+(W[1]-e[1])*(short?.22:.86)];
    const sleeveBit=haOr(up,elbow,haTaper(e[0],e[1],cuff[0],cuff[1],2.7,short?2.5:1.9));
    p.fill(skin,fore);p.fill(sleeves,sleeveBit);
    if(!hide){const n=[-d[1],d[0]],sg=((24-h[0])*n[0]+(h[1]<30?-n[1]:0))>=0?1:-1,C2=[h[0]+d[0]*.5,h[1]+d[1]*.5];
      p.fill(skin,haOr(haOEl(C2[0],C2[1],d[0],d[1],2.7,2.05),haEl(C2[0]+n[0]*sg*1.9-d[0]*.7,C2[1]+n[1]*sg*1.9-d[1]*.7,1.15,1.15),haTaper(W[0],W[1],C2[0],C2[1],1.55,1.9)));
      hands.push([C2,d,n,sg])}});
  if(P.prop==='rod'){const h=(back?P.aL:P.aR)[1],rod=p.part('#7a5230',{flat:1}),dx=back?-1:1;p.fill(rod,haSeg(h[0]-dx*2,h[1]+3,h[0]+dx*11,h[1]-23,.75));p.fill(skin,haEl(h[0]+.3,h[1]+.3,2.4,2.2));p.dot(h[0]+dx*1.5|0,h[1]+1|0,'#c9c9d0')}
  if(spec.top==='sweater'&&!back&&!ap('body')){const col=p.part(C.shirt);p.fill(col,U(haPoly([[20,25],[28,25],[28.5,29],[19.5,29]])))}
  p.fill(skin,U(haPoly([[21,21],[27,21],[27,28],[21,28]])));
  p.fill(skin,U(haOr(haEl(24,15,9.2,10),haEl(14.6,16.5,1.7,2.3),haEl(33.4,16.5,1.7,2.3))));
  p.erase(U((x,y)=>y>21.5&&Math.abs(x-24)>7-(y-21.5)*1.2&&y<26&&!(Math.abs(x-24)<3.2)&&!(y>24)));   // a softer jaw
  // hair, by style
  const hair=p.part(C.hair,{shade:(x,y)=>x-ux(y)>28&&y>9});
  const dome=haEl(24,12,10.4,9),fringe=(x,y)=>y<(back?24:11.5+Math.sin(x*1.3)*.9);
  let hf;
  if(back)hf=haOr(haAnd(haEl(24,14,10,10.6),(x,y)=>y<23.5),spec.hair==='bob'?haPoly([[14.5,13],[33.5,13],[33.5,22],[14.5,22]]):()=>false);
  else if(spec.hair==='braid')hf=haOr(haAnd(dome,fringe),haPoly([[14.5,11],[17.5,11],[17,22],[14.5,21]]),haPoly([[30.5,11],[33.5,11],[33.5,19],[31,19]]));
  else if(spec.hair==='bob')hf=haOr(haAnd(dome,(x,y)=>y<11),haPoly([[14.2,10],[18,10],[17.5,23],[14.2,23]]),haPoly([[30,10],[33.8,10],[33.8,23],[30.5,23]]));
  else if(spec.hair==='wavy')hf=haOr(haAnd(dome,fringe),haPoly([[14,10],[17.5,12],[17,30],[14.5,33],[12.5,28]]),haPoly([[30.5,12],[34,10],[35.5,28],[33.5,33],[31,30]]));
  else if(spec.hair==='messy')hf=haOr(haAnd(haEl(24,11,10.4,8.4),(x,y)=>y<10.5+Math.abs(Math.sin(x*.8))*2.2&&y>3.6+Math.abs(Math.sin(x*.75))*2.6),haPoly([[14.6,9],[17.5,11],[16.8,18],[14.6,17]]),haPoly([[30.5,11],[33.4,9],[33.4,17],[31.2,18]]));
  else if(spec.hair==='curly')hf=haAnd(haEl(24,11.5,9.4,7.6),(x,y)=>y<10.6-(Math.abs(x-24)>6?-1.6:0));
  else hf=haAnd(haEl(24,11.5,9.4,7.8),(x,y)=>y<10.4+(Math.abs(x-24)>7?3:0));
  p.fill(hair,U(hf));
  // the braid over her shoulder (front) or down her back
  if(spec.hair==='braid'){const br=p.part(C.hair);for(let i=0;i<6;i++){const cx=back?24:15.5-i*.3,cy=(back?24:22)+i*3.2;p.fill(br,U(haEl(cx,cy,2.5,1.9)))}
    RU(back?23:13,back?43:40,3,2,C.jacket)}
  if(back&&long){const hl=p.part(C.hair);p.fill(hl,U(haPoly([[14,14],[34,14],[35.5,36],[30,39],[24,37.5],[18,39],[12.5,36]])))}
  // hats and scarves
  if(acc.includes('scarf')||acc.includes('bandana')){const sc=p.part(C.hat);
    if(acc.includes('scarf'))p.fill(sc,U(haOr(haAnd(haEl(24,10.5,10.2,7.6),(x,y)=>y<9.6+(back?3:0)),haEl(back?24:34,back?15:12.5,2.4,2))));
    else{p.fill(sc,U(haAnd(haEl(24,12,9.9,8.8),(x,y)=>y>(back?6:7.6)&&y<(back?11:10.4))));p.fill(sc,U(haOr(haPoly([[32,9],[36,11],[35,14]]),haPoly([[32,10],[35,15],[33,16]]))))}}
  if(acc.includes('cap')&&!ap('helm')){const cp=p.part(C.hat);p.fill(cp,U(haAnd(haEl(24,9.6,9.8,6),(x,y)=>y<10.2)));if(!back)p.fill(cp,U(haAnd(haEl(25.5,10.8,10.5,1.9),(x,y)=>y>9.6)))}
  if(ap('helm')){const h=ap('helm'),hm=p.part(h[0]);p.fill(hm,U(haAnd(haEl(24,12,10.2,9.2),(x,y)=>y<(back?20:10.8))));if(!back)p.fill(hm,U(haOr(haPoly([[14,10],[17,10],[17,19],[14,18]]),haPoly([[31,10],[34,10],[34,18],[31,19]]))))}
  // the satchel bag at her hip
  if(acc.includes('satchel')){const bag=p.part('#8a5a30');p.fill(bag,back?haPoly([[29,45],[36,45],[36,52],[29,52]]):haPoly([[12,45],[19,45],[19,52],[12,52]]))}
  // -------- the hand-placed details --------
  const D=(x,y,c)=>p.dot(x,y,c),eye=C.eye||'#3a2a20',lip=fem?'#c0565a':haMix(dk,'#6a2a20',.45),brow=haRamp(C.hair)[3];
  if(!back){
    if(fem){[[19,14],[27,14]].forEach(([x,y],i)=>{RU(x,y,3,1,HA_OUT);DU(i?x+3:x-1,y,HA_OUT);RU(x,y+1,3,3,eye);RU(x+1,y+1,1,2,haRamp(eye)[3]);DU(x,y+1,'#ffffff');DU(x+2,y+3,haMix(eye,'#ffffff',.35))});
      RU(23,21,3,1,lip);[[18,19],[29,19]].forEach(([x,y])=>RU(x,y,2,1,haMix(dk,'#ff7a80',.35)))}
    else{[[19,15],[27,15]].forEach(([x,y],i)=>{RU(x,y,3,1,HA_OUT);RU(x,y+1,3,2,eye);RU(x+1,y+1,1,2,haRamp(eye)[3]);DU(i?x+2:x,y+1,'#ffffff')});RU(18,13,4,1,brow);RU(26,13,4,1,brow);RU(23,21,3,1,lip);DU(22,21,haRamp(dk)[2])}
    DU(24,19,haRamp(dk)[2]);DU(24,18,haRamp(dk)[0]);
    if(acc.includes('freckles'))[[19,19],[21,19],[20,20],[27,19],[29,19],[28,20]].forEach(([x,y])=>DU(x,y,haMix(dk,'#9a5a30',.4)));
    if(spec.hair==='bob'&&!acc.includes('scarf'))RU(18,11,12,1,haRamp(C.hair)[3]);
  }
  const sk=haRamp(dk);hands.forEach(([c,d,n,sg])=>{[-.9,.9].forEach(o=>p.dot(Math.round(c[0]+d[0]*1.9+n[0]*o),Math.round(c[1]+d[1]*1.9+n[1]*o),sk[2]));p.dot(Math.round(c[0]-d[0]*.3),Math.round(c[1]-d[1]*.3),sk[0])});
  // hair texture
  if(spec.hair==='curly')for(let y=4;y<11;y+=2)for(let x=16+(y%4);x<33;x+=3)DU(x,y,haRamp(C.hair)[0]);
  else for(let x=17;x<=29;x++){const y=Math.round((back?9:6.6)+((x-23)/6)**2*1.6),X=Math.round(x+ux(y));if(p.at(X,y)===hair)D(X,y,haRamp(C.hair)[0]);if(x%3===0&&p.at(X,y+2)===hair)D(X,y+2,haRamp(C.hair)[2])}
  if(spec.hair==='braid')for(let i=0;i<6;i++){const x=back?23:14-i*.3|0,y=(back?23:21)+i*3.2|0;DU(x,y,haRamp(C.hair)[0]);DU(x+2,y+1,haRamp(C.hair)[3])}
  // clothes
  if(!ap('body')){
    if(spec.top==='stripes')for(let y=29;y<47;y+=3)for(let x=6;x<42;x++){const k=p.at(x,y);if(k===shirt||k===sleeves)D(x,y,'#f4f2ea')}
    if(spec.top==='sweater')for(let x=12;x<36;x+=3)for(let y=30;y<46;y++)if(p.at(Math.round(x+ux(y)),y)===shirt)D(Math.round(x+ux(y)),y,haRamp(C.shirt)[2]);
    if(spec.top==='tunic'){RU(15,44,19,2,'#6b4423');RU(23,44,3,2,'#d9a441')}
    if(spec.over==='flannel')for(let y=22;y<54;y++)for(let x=4;x<44;x++){const k=p.at(x,y);if(k>=0&&p.parts[k].r[1]===C.jacket&&((x-Math.round(ux(y)))%4===0||y%4===0))D(x,y,haRamp(C.jacket)[2])}
    if(spec.over==='coat'&&!back){for(let y=31;y<48;y+=4){if(p.at(Math.round(21+ux(y)),y)===jk)DU(21,y,'#e8c24a');if(p.at(Math.round(27+ux(y)),y)===jk)DU(27,y,'#e8c24a')}RU(20,25,8,3,C.shirt);LU(24,28,24,44,haRamp(C.jacket)[3])}
    if(spec.over==='vest'&&!back)for(let y=31;y<46;y+=5){DU(20,y,haRamp(C.jacket)[3]);DU(28,y,haRamp(C.jacket)[3])}
    if(acc.includes('satchel')&&!back)LU(33,28,17,45,'#6b4423');
    if(acc.includes('satchel')&&back)LU(15,28,31,45,'#6b4423');
  }else{const a=ap('body');for(let y=31;y<47;y+=5)for(let x=8;x<40;x++)if(p.at(x,y)===shirt)D(x,y,a[1]);RU(22,28,4,17,a[2])}
  return p}
const HA_CACHE=new Map();
// a person's picture as a canvas (cached): key names it for ART_FILES, spec describes it
function heroCanvas(key,spec,view,arm){const k=key+'|'+view+'|'+JSON.stringify(spec.col)+'|'+JSON.stringify(arm||{});if(HA_CACHE.has(k))return HA_CACHE.get(k);
  const cv=document.createElement('canvas');cv.width=HA_W;cv.height=HA_H;
  const file=ART_FILES[key+(view==='b'?'_back':'')];
  if(file&&file.complete&&file.naturalWidth)cv.getContext('2d').drawImage(file,0,0,HA_W,HA_H);else paintHero(spec,view,arm).render(cv);
  HA_CACHE.set(k,cv);return cv}
// the player's own picture: their chosen character (HEROES in js/data/heroes.js) in the colours of S.look, wearing what they wear
function heroSpec(){const h=HEROES.find(q=>q.id===S.hero)||HEROES[0],L=S.look||h.look;
  return{...h.art,sex:h.sex,col:{skin:OPT.skin[L.skin],hair:OPT.hair[L.hair],shirt:OPT.shirt[L.shirt],jacket:OPT.jacket[L.jk===undefined?1:L.jk],hat:OPT.hat[L.hc||0],eye:h.art.eye,pants:h.art.pants,boots:h.art.boots}}}
const playerArt=view=>heroCanvas('hero_'+(S.hero||'f1'),heroSpec(),view||'f',armourLook());
// draw a picture onto a canvas, keeping its shape (centred, no blurring)
function drawArt(cv,art,bg){const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);if(bg){c.fillStyle=bg;c.fillRect(0,0,cv.width,cv.height)}
  const s=Math.min(cv.width/art.width,cv.height/art.height),w=art.width*s,h=art.height*s;c.drawImage(art,(cv.width-w)/2,(cv.height-h)/2,w,h)}
// the head and shoulders, for the box beside someone's words
function drawBust(cv,art,bg){const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);if(bg){c.fillStyle=bg;c.fillRect(0,0,cv.width,cv.height)}
  c.drawImage(art,8,2,32,28,0,0,cv.width,cv.height)}
