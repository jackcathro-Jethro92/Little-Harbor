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
  part(color,opt){const o=opt||{};this.parts.push({r:o.warm?[haMix(color,'#fff0dc',.3),color,haMix(color,'#a8503a',.26),haMix(color,'#5a2418',.55)]:haRamp(color),o});return this.parts.length-1},
  fill(k,f){for(let y=0;y<HA_H;y++)for(let x=0;x<HA_W;x++)if(f(x+.5,y+.5))this.pid[y*HA_W+x]=k},
  erase(f){this.fill(-1,f)},
  at(x,y){return x<0||y<0||x>=HA_W||y>=HA_H?-1:this.pid[y*HA_W+x]},
  dot(x,y,c){this.det.push([x,y,1,1,c])},
  rect(x,y,w,h,c){this.det.push([x,y,w,h,c])},
  line(x0,y0,x1,y1,c){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)this.dot(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),c)},
  tone(k,t){return this.parts[k].r[t]},
  render(cv){const c=cv.getContext('2d'),img=c.createImageData(HA_W,HA_H),d=img.data,set=(x,y,h)=>{const a=haHex(h),i=(y*HA_W+x)*4;d[i]=a[0];d[i+1]=a[1];d[i+2]=a[2];d[i+3]=255};
    for(let y=0;y<HA_H;y++)for(let x=0;x<HA_W;x++){const k=this.at(x,y);
      if(k<0){let j=-1;for(const[a,b]of[[0,1],[0,-1],[1,0],[-1,0]]){const q=this.at(x+a,y+b);if(q>=0&&(j<0||q>j))j=q}if(j>=0)set(x,y,this.parts[j].o.flat?HA_OUT:haMix(this.parts[j].r[3],HA_OUT,.55));continue}
      const P=this.parts[k],same=(a,b)=>this.at(x+a,y+b)===k;
      let t=1;
      if(!P.o.noLine&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const j=this.at(x+a,y+b);return j>=0&&j<k&&!this.parts[j].o.under}))t=3;
      else if(P.o.flat)t=1;
      else{let a=x,b=x;while(this.at(a-1,y)===k)a--;while(this.at(b+1,y)===k)b++;const n=b-a+1,f=(x-a+.5)/n,lo=P.o.soft?.14:.2,hi=P.o.soft?.74:.6;
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
const iaNotH=f=>(x,y)=>!f(x,y);
const haSeg=(ax,ay,bx,by,r)=>(x,y)=>{const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-ax-dx*t,y-ay-dy*t)<=r};
// POSES: how each character stands (Jack: "dynamic positions and poses, a sense of movement"). lean: how far the head and shoulders sway sideways (pixels at the head); arms and legs are joints in the front picture:
// aL/aR = [elbow, hand], lL/lR = [knee, ankle]; hand:false hides a hand (in a pocket); prop: something held. The back picture (battle) is the same pose seen from behind (mirrored).
const POSES={
 rod:{lean:1.2,turn:.6,aL:[[9.5,34],[16,41.5]],aR:[[38.5,30],[35,22]],lL:[[19,56],[17,68]],lR:[[30,56],[33,68]],prop:'rod'},
 hips:{lean:-.8,turn:-.4,aL:[[8.5,34],[16,41.5]],aR:[[39.5,34],[32,41.5]],lL:[[18,56],[15,68]],lR:[[30,56],[33,68]]},
 walk:{lean:-1.2,turn:.7,aL:[[11.5,34.5],[19,31.5]],aR:[[36,35],[38,43]],lL:[[19,56],[17.5,68]],lR:[[29.5,55],[32,65.5,1]]},
 wave:{lean:-1,turn:-.6,aL:[[11,35],[17,42],false],aR:[[40.5,22],[41,12]],lL:[[19,56],[16,68]],lR:[[29.5,56],[32,68]]},
 cross:{lean:0,turn:.4,aL:[[11,35],[28,33.5],false],aR:[[37,35],[20,35]],lL:[[18.5,56],[15.5,68]],lR:[[29.5,56],[32.5,68]]},
 point:{lean:1.4,turn:.8,aL:[[8.5,34],[16,41.5]],aR:[[39,27.5],[45.5,23]],lL:[[17.5,56],[13.5,67.5]],lR:[[29.5,57],[30.5,68]]},
 brim:{lean:-.6,hip:1.4,turn:.5,aL:[[9,34],[16,41.5]],aR:[[38.5,19.5],[30,6.5]],lL:[[20.5,56.2],[18.2,67.6,1]],lR:[[29.6,56],[29.8,68]],front:'R'},
 book:{lean:.5,hip:-1.2,turn:-.3,aL:[[12,35.5],[21.5,32]],aR:[[36,35.5],[26.5,32]],lL:[[18.6,56],[18.6,68]],lR:[[27.6,56.4],[29.8,67.6,1]],prop:'book'},
 stride:{lean:-1,hip:.8,turn:.6,aL:[[8.5,34],[16,41.5]],aR:[[37,35],[38.6,42.8]],lL:[[19,55.6],[17,67.6]],lR:[[29,56.2],[31.2,65.8,1]]},
 greet:{lean:.7,hip:-1.3,turn:-.5,aL:[[12,35],[13.6,43.6]],aR:[[40.5,26],[42,16]],lL:[[18.6,56],[18.6,68]],lR:[[27.4,56.4],[29.6,67.6,1]]},
 rope:{lean:-.5,hip:1.3,turn:.5,aL:[[9.5,33.5],[15,25.5]],aR:[[37,35.5],[35.6,43.6]],lL:[[20.6,56.4],[18.4,67.6,1]],lR:[[29.4,56],[29.6,68]],prop:'rope'},
 crossed:{lean:-.4,hip:1.2,turn:.4,aL:[[11,35],[28,33.5],false],aR:[[37,35],[20,35]],lL:[[20.4,56.4],[18.2,67.6,1]],lR:[[29.2,56],[29.4,68]]},
 stand:{lean:0,turn:0,aL:[[12,34],[13.6,43]],aR:[[36,34],[34.4,43]],lL:[[20,56],[19.5,68]],lR:[[28,56],[28.5,68]]}};
// spec: {sex:'f'|'m', pose, hair:'braid'|'bob'|'wavy'|'messy'|'curly'|'crop', top:'sweater'|'stripes'|'tunic'|'tee'|'shirt', over:'vest'|'flannel'|'coat'|null, acc:[...], col:{skin,hair,shirt,jacket,hat,pants,boots,eye}}
// view 'f' (front) or 'b' (back, for battle). arm: the worn armour {helm, body, boots} (ARM_PAL names), drawn over the clothes.
// Proportions follow the FireRed trainer pictures Jack sent: a smaller head (about a sixth of the height), long legs, the face turned a little to one side (turn), sharp eyes and brows, coloured outlines.
function paintHero(spec,view,arm){const p=new HAPainter(),C=spec.col,fem=spec.sex==='f',back=view==='b',acc=spec.acc||[],A=arm||{},ap=k=>A[k]&&ARM_PAL[k==='boots'&&A[k]==='enchanted'?'enchanted_boots':A[k]];
  const P0=POSES[spec.pose]||POSES.stand,mx=back?(v=>48-v):(v=>v),hipX=(back?-1:1)*(P0.hip||0),J=v=>Array.isArray(v)?[mx(v[0]),v[1],v[2]]:v,JA=v=>Array.isArray(v)?[mx(v[0])+hipX,v[1],v[2]]:v,P={lean:back?-P0.lean:P0.lean,aL:(back?P0.aR:P0.aL).map(JA),aR:(back?P0.aL:P0.aR).map(JA),lL:(back?P0.lR:P0.lL).map(J),lR:(back?P0.lL:P0.lR).map(J),
    hideL:(back?P0.aR:P0.aL)[2]===false,hideR:(back?P0.aL:P0.aR)[2]===false,prop:P0.prop,front:P0.front&&!back?P0.front:null},turn=back?0:P0.turn||0,s=Math.round(turn*1.4);
  const ux=y=>hipX+(y<43?P.lean*(43-y)/15:0),U=f=>(x,y)=>f(x-ux(y),y);   // the upper body sways: U shifts a shape, DU/RU/LU a detail
  const DU=(x,y,c)=>p.dot(Math.round(x+ux(y)),y,c),RU=(x,y,w,h,c)=>p.rect(Math.round(x+ux(y)),y,w,h,c),LU=(x0,y0,x1,y1,c)=>p.line(Math.round(x0+ux(y0)),y0,Math.round(x1+ux(y1)),y1,c);
  const long=spec.hair==='wavy'||spec.hair==='long',skin=p.part(C.skin,{soft:1,warm:1}),dk=C.skin,sk=haRamp(dk);
  const hairBack=p.part(C.hair,{under:1});
  if(long&&!back)p.fill(hairBack,U(haPoly([[14.5,10],[33.5,10],[35.5,33],[31.5,35],[24,36],[16.5,35],[12.5,33]])));
  // legs (hip, knee, ankle) and boots
  const pants=p.part(C.pants||'#3b4a6b'),bootC=ap('boots')?ap('boots')[0]:C.boots||'#5a3a22',boots=p.part(bootC),tr=fem?3.3:3.6;
  [[20+hipX,P.lL],[28+hipX,P.lR]].forEach(([hx,[k,f]])=>{p.fill(pants,haOr(haTaper(hx,43.5,k[0],k[1],tr+.4,tr-.45),haEl(k[0],k[1],tr-.45,tr-.45),haTaper(k[0],k[1],f[0],f[1],tr-.45,tr-1.2),haEl(hx,43.8,tr+.6,3),haOEl(k[0]+(f[0]-k[0])*.3+(f[0]<24?-.5:.5),k[1]+(f[1]-k[1])*.3,0,1,3.4,tr-.2)))});
  [[20+hipX,P.lL],[28+hipX,P.lR]].forEach(([hx,[k,f]])=>{const dir=f[0]<24?-1:1,t=.58,bx=k[0]+(f[0]-k[0])*t,by=k[1]+(f[1]-k[1])*t;
    p.fill(boots,haOr(haTaper(bx,by,f[0],f[1],tr-.6,tr-.9),f[2]?haEl(f[0]+dir*1.2,f[1]+.6,2.8,2):haEl(f[0]+dir*1.7,f[1]+1.2,3.9,2.1)))});
  // body: the shirt (or tunic), the coat or jacket over it, the arms, then the head
  const bodyC=ap('body')?ap('body')[0]:C.shirt,shirt=p.part(bodyC);
  const torso=U(spec.build==='stout'?haPoly([[20.5,20.5],[27.5,20.5],[34.5,23.4],[36.5,27],[36.6,33],[35.6,40],[34.6,43.5],[13.4,43.5],[12.4,40],[11.4,33],[11.5,27],[13.5,23.4]]):fem?haPoly([[21,20.5],[27,20.5],[32.5,23.4],[33.6,26.5],[32.8,30.5],[31.2,35],[32.6,40],[32.8,43.5],[15.2,43.5],[15.4,40],[16.8,35],[15.2,30.5],[14.4,26.5],[15.5,23.4]])
    :haPoly([[20.5,20.5],[27.5,20.5],[33.5,23.4],[35,26.5],[34.2,31],[33,36],[32.6,43.5],[15.4,43.5],[15,36],[13.8,31],[13,26.5],[14.5,23.4]]));
  p.fill(shirt,haOr(torso,spec.top==='tunic'?haPoly([[15,40],[33,40],[35,50],[13,50]]):spec.top==='dress'?haPoly([[15,40],[33,40],[36.5,57],[11.5,57]]):()=>false));
  const jk=spec.over&&!ap('body')?p.part(C.jacket):-1;
  if(jk>=0){if(spec.over==='coat')p.fill(jk,haOr(torso,haPoly([[14.5,40],[33.5,40],[35.5,49.5],[12.5,49.5]])));
    else if(spec.over==='robe')p.fill(jk,haOr(torso,haPoly([[14.5,38],[33.5,38],[36.5,66],[11.5,66]])));
    else if(spec.over==='longcoat')p.fill(jk,haOr(torso,haPoly([[14.5,38],[33.5,38],[36,62],[12,62]])));
    else if(spec.over==='cloak')p.fill(jk,haAnd(haOr(U(haPoly([[13.5,22.6],[34.5,22.6],[38.5,58],[9.5,58]])),U(haEl(24,22.4,8.6,3.2))),(x,y)=>back||y<24||Math.abs(x-ux(y)-24)>3+(y-24)*.12))
    else if(spec.over!=='apron')p.fill(jk,haAnd(torso,(x,y)=>back||Math.abs(x-ux(y)-24)>(spec.over==='vest'?2.6:2.2)+(y-24)*.09))}
  if(spec.over==='apron'&&!back){const apr=p.part(C.apron||'#e8e0c8');p.fill(apr,U(haPoly([[19.5,25.5],[28.5,25.5],[29.5,31],[31.5,49],[16.5,49],[18.5,31]])))}
  const short=(spec.top==='stripes'||spec.top==='shirt')&&!ap('body');
  const sleeves=p.part(spec.over&&!['vest','apron','cloak'].includes(spec.over)&&!ap('body')?C.jacket:bodyC),bare=spec.top==='tank'&&!['coat','longcoat','flannel'].includes(spec.over)&&!ap('body');
  // arms: a rounded shoulder, an upper arm that tapers to the elbow, a forearm that narrows to the wrist, and a hand turned the way the forearm points (palm, thumb and finger lines)
  const hands=[];
  if(P.prop==='book'&&!back){const bk=p.part('#7a3a2a');p.fill(bk,U(haPoly([[17.5,26.5],[30.5,26.5],[30.5,37],[17.5,37]])));const pg2=p.part('#f2ead0',{flat:1});p.fill(pg2,U(haPoly([[18.5,27.5],[29.5,27.5],[29.5,29],[18.5,29]])));RU(23,31,2,4,'#d9a441')}
  const drawArm=([sx,[e,h],hide])=>{const S=[sx+ux(25.5),25.5],L=Math.hypot(h[0]-e[0],h[1]-e[1])||1,d=[(h[0]-e[0])/L,(h[1]-e[1])/L],W=[h[0]-d[0]*1.9,h[1]-d[1]*1.9];
    const up=haOr(haTaper(S[0],S[1],e[0],e[1],3,2.3),haEl(S[0],S[1]+.3,3.2,3)),elbow=haEl(e[0],e[1],2.3,2.3),fore=haTaper(e[0],e[1],W[0],W[1],2.25,1.45),cuff=[e[0]+(W[0]-e[0])*(short?.22:.86),e[1]+(W[1]-e[1])*(short?.22:.86)];
    p.fill(skin,fore);if(bare)p.fill(skin,haOr(up,elbow));else p.fill(sleeves,haOr(up,elbow,haTaper(e[0],e[1],cuff[0],cuff[1],2.5,short?2.3:1.75)));
    if(!hide){const n=[-d[1],d[0]],sg=((24-h[0])*n[0]+(h[1]<28?-n[1]:0))>=0?1:-1,C2=[h[0]+d[0]*.4,h[1]+d[1]*.4];
      p.fill(skin,haOr(haOEl(C2[0],C2[1],d[0],d[1],2.5,1.9),haEl(C2[0]+n[0]*sg*1.75-d[0]*.6,C2[1]+n[1]*sg*1.75-d[1]*.6,1.05,1.05),haTaper(W[0],W[1],C2[0],C2[1],1.45,1.75)));
      hands.push([C2,d,n])}};
  const ARMS=[[15,P.aL,P.hideL,'L'],[33,P.aR,P.hideR,'R']];ARMS.forEach(q=>{if(q[3]!==P.front)drawArm(q)});
  if(P.prop==='rope'){const rp=p.part('#c8a060');p.fill(rp,U(haAnd(haEl(15,31,5.6,7.2),iaNotH(haEl(15,31,3.4,5)))));for(let y=25;y<38;y+=2)DU(11,y,'#8a6a30')}
  if(P.prop==='rod'){const h=(back?P.aL:P.aR)[1],rod=p.part('#7a5230',{flat:1}),dx=back?-1:1;p.fill(rod,haSeg(h[0]-dx*2,h[1]+3,h[0]+dx*10,h[1]-21,.75));p.fill(skin,haEl(h[0]+.3,h[1]+.3,2.2,2));p.dot(h[0]+dx*1.5|0,h[1]+1|0,'#c9c9d0')}
  if(spec.top==='sweater'&&!back&&!ap('body')){const col=p.part(C.shirt);p.fill(col,U(haPoly([[20.6,19.5],[27.4,19.5],[27.8,23.5],[20.2,23.5]])))}
  // neck and head. The neck is its own, slightly shaded part drawn first, so the jaw gets a clean line where it meets it (no lump at the side); the face is an oval that is widest at the
  // cheekbones and narrows to a small chin, which moves a little toward the way the face is turned (the far ear hides)
  const neck=p.part(haMix(C.skin,'#a8503a',.12),{warm:1});
  p.fill(neck,U(haPoly([[22,14.5],[26,14.5],[26.3,20.5],[27.6,23.6],[20.4,23.6],[21.7,20.5]])));
  const head=p.part(C.skin,{soft:1,warm:1}),FW=[[12,7.15],[13.5,7],[15,6.55],[16.3,5.85],[17.4,4.95],[18.4,3.85],[19.2,2.7],[19.8,1.4]];
  const faceW=y=>{if(y<=12)return null;for(let i=1;i<FW.length;i++)if(y<=FW[i][0])return FW[i-1][1]+(FW[i][1]-FW[i-1][1])*(y-FW[i-1][0])/(FW[i][0]-FW[i-1][0]);return -1};
  const face=(x,y)=>{if(y<3.2)return false;if(y<=12)return((x-24)/7.3)**2+((y-12)/8.8)**2<=1;const w=faceW(y);return w>0&&Math.abs(x-24-turn*.9*(y-12)/7.8)<=w};
  p.fill(head,U(haOr(face,turn>.25?()=>false:haEl(16.6,12.4,1.35,1.9),turn<-.25?()=>false:haEl(31.4,12.4,1.35,1.9))));
  // hair, by style
  const hair=p.part(C.hair,{shade:(x,y)=>x-ux(y)>27&&y>7});
  const dome=haEl(24,9.3,9.1,7.9),fringe=(x,y)=>y<9.2+Math.sin(x*1.4)*.8+(Math.abs(x-24-s)>5?1.4:0);
  let hf;
  if(back&&spec.hair==='bald')hf=acc.includes('old')?haAnd(haEl(24,11,8.2,8.8),(x,y)=>y>12&&y<17):()=>false;
  else if(back)hf=haOr(haAnd(haEl(24,11,8.2,8.8),(x,y)=>y<18.5),spec.hair==='bob'?haPoly([[15.8,10],[32.2,10],[32.2,18.5],[15.8,18.5]]):()=>false);
  else if(spec.hair==='braid')hf=haOr(haAnd(dome,fringe),haPoly([[15.6,8],[18.2,8],[17.8,17],[15.6,16]]),haPoly([[29.8,8],[32.4,8],[32.4,15],[30.2,15]]));
  else if(spec.hair==='bob')hf=haOr(haAnd(dome,(x,y)=>y<8.8),haPoly([[15.3,7.5],[18.6,7.5],[18.2,18],[15.3,18]]),haPoly([[29.4,7.5],[32.7,7.5],[32.7,18],[29.8,18]]));
  else if(spec.hair==='wavy')hf=haOr(haAnd(dome,fringe),haPoly([[15,7.5],[18,9],[17.6,24],[15.4,27],[13.6,22]]),haPoly([[30,9],[33,7.5],[34.4,22],[32.6,27],[30.4,24]]));
  else if(spec.hair==='messy')hf=haOr(haAnd(haEl(24,8.8,9.4,7.8),(x,y)=>y<8.6+Math.abs(Math.sin(x*.9))*1.8&&y>1.6+Math.abs(Math.sin(x*.8))*2.4),haPoly([[15.6,7],[18,9],[17.4,14],[15.6,13]]),haPoly([[30,9],[32.4,7],[32.4,13],[30.6,14]]));
  else if(spec.hair==='curly')hf=haAnd(haEl(24,9.2,8,6.4),(x,y)=>y<(Math.abs(x-24)>5.5?10.5:8.4));
  else if(spec.hair==='long')hf=haOr(haAnd(dome,(x,y)=>y<8.6),haPoly([[15,7.5],[18,8.5],[17.8,25],[15.2,27],[14,22]]),haPoly([[30,8.5],[33,7.5],[34,22],[32.8,27],[30.2,25]]));
  else if(spec.hair==='bun')hf=haOr(haAnd(dome,fringe),haEl(24,2.4,3.4,2.6),haPoly([[15.6,8],[17.8,9],[17.4,14],[15.6,13]]),haPoly([[30.2,9],[32.4,8],[32.4,13],[30.6,14]]));
  else if(spec.hair==='ponytail')hf=haOr(haAnd(dome,fringe),haPoly([[30,8],[33.8,9.5],[35.2,21],[33,24],[31.4,14]]),haPoly([[15.6,8],[17.8,9],[17.4,14],[15.6,13]]));
  else if(spec.hair==='buns')hf=haOr(haAnd(dome,fringe),haEl(17,3.4,3.4,2.9),haEl(31,3.4,3.4,2.9),haPoly([[15.6,8],[17.8,9],[17.4,14],[15.6,13]]),haPoly([[30.2,9],[32.4,8],[32.4,13],[30.6,14]]));
  else if(spec.hair==='pixie')hf=haOr(haAnd(dome,(x,y)=>y<8.6+(x-24)*.22+Math.sin(x*1.6)*.6),haPoly([[15.6,7.5],[18,8.5],[17.6,13],[15.6,12]]),haPoly([[30.2,8.5],[32.4,7.5],[32.4,12],[30.6,13]]));
  else if(spec.hair==='bald')hf=haOr(haPoly([[15.6,8.5],[17.6,9.5],[17.4,14],[15.6,13]]),haPoly([[30.4,9.5],[32.4,8.5],[32.4,13],[30.6,14]]));
  else hf=haAnd(haEl(24,9.2,8,6.6),(x,y)=>y<8.2+(Math.abs(x-24)>6?2.4:0));
  p.fill(hair,U(hf));
  if(spec.hair==='braid'){const br=p.part(C.hair);for(let i=0;i<6;i++){const cx=back?24:16.6-i*.35,cy=(back?19:18)+i*3;p.fill(br,U(haEl(cx,cy,2.2,1.7)))}
    RU(back?23:14,back?37:35,3,2,C.jacket)}
  if(back&&long){const hl=p.part(C.hair);p.fill(hl,U(haPoly([[15,10],[33,10],[35,32],[30.5,34.5],[24,33],[17.5,34.5],[13,32]])))}
  // beards and moustaches (C.beard, or the hair colour)
  const BC=C.beard||C.hair;
  if(!back&&acc.includes('goatee')){const gt=p.part(BC);p.fill(gt,U(haAnd(haEl(24+turn*.8,18.9,2.3,1.9),face)))}
  if(!back&&(acc.includes('beard')||acc.includes('longbeard'))){const bd=p.part(BC,{shade:(x,y)=>x-ux(y)>27});
    p.fill(bd,U(haAnd(haOr(haAnd(face,(x,y)=>y>14.6&&Math.abs(x-24-turn*.6)>(y<16.8?2.8:0)),haEl(24+turn*.8,18.6,5.4,3.3),acc.includes('longbeard')?haPoly([[18.5,17],[29.5,17],[27.5,25],[24.5,30.5],[21,25]]):()=>false),(x,y)=>!haEl(24+s,16.3,2.1,.9)(x,y))))}
  // hats and scarves
  if(acc.includes('scarf')||acc.includes('bandana')){const sc=p.part(C.hat);
    if(acc.includes('scarf'))p.fill(sc,U(haOr(haAnd(haEl(24,8.2,8.8,6.4),(x,y)=>y<7.6+(back?2.5:0)),haEl(back?24:31.5,back?12:9.8,2.1,1.7))));
    else{p.fill(sc,U(haAnd(haEl(24,9.5,8.6,7.6),(x,y)=>y>(back?4:5.6)&&y<(back?9:8.2))));p.fill(sc,U(haOr(haPoly([[30,7],[33.5,8.5],[32.8,11]]),haPoly([[30,7.6],[32.6,12],[31,12.6]]))))}}
  if(acc.includes('captain')&&!ap('helm')){const cp=p.part(C.hat);p.fill(cp,U(haAnd(haEl(24,7.2,9.4,5.6),(x,y)=>y<8.4)));const pk=p.part('#2a2228');if(!back)p.fill(pk,U(haAnd(haEl(24.5+s,9,8.4,1.8),(x,y)=>y>8)));RU(16,7,17,1,'#e8c24a');if(!back)RU(23+s,4,2,2,'#e8c24a')}
  if(acc.includes('cap')&&!ap('helm')){const cp=p.part(C.hat);p.fill(cp,U(haAnd(haEl(24,7.6,8.6,5.2),(x,y)=>y<8.2)));if(!back)p.fill(cp,U(haAnd(haEl(25.5+s,8.6,9,1.6),(x,y)=>y>7.6)))}
  if(acc.includes('straw')){const st=p.part(C.hat);p.fill(st,U(haOr(haAnd(haEl(24,7.3,13,2.2),(x,y)=>true),haAnd(haEl(24,5.4,7.2,4.2),(x,y)=>y<7.4))))}
  if(acc.includes('tricorn')){const tc=p.part(C.hat2||'#2a2228');p.fill(tc,U(haOr(haAnd(haEl(24,5.6,8.3,5),(x,y)=>y<7.6),haPoly([[10.5,8.6],[24,4.6],[37.5,8.6],[33.5,10],[24,8.4],[14.5,10]]))));LU(12,8,24,5,'#d9a441');LU(24,5,36,8,'#d9a441');if(acc.includes('skull'))RU(23,5,2,2,'#f2f0e6')}
  if(acc.includes('beanie')){const bn=p.part(C.hat);p.fill(bn,U(haOr(haAnd(haEl(24,8.6,9.2,7.2),(x,y)=>y<9.2),haEl(24,1.8,2.2,2))));const bb=p.part(haMix(C.hat,'#000000',.15));p.fill(bb,U(haAnd(haEl(24,9.6,9.6,8),(x,y)=>y>6.4&&y<9.4)));for(let x=17;x<32;x+=2)DU(x,7,haRamp(C.hat)[2])}
  if(acc.includes('chef')){const ch=p.part('#f4f2ea');p.fill(ch,U(haOr(haEl(24,2.6,6.4,3),haPoly([[18.5,3],[29.5,3],[29.5,7.4],[18.5,7.4]]))))}
  if(acc.includes('hood')){const hd=p.part(C.jacket);p.fill(hd,U(haAnd(haOr(haEl(24,10.6,10.4,11),haPoly([[14,14],[34,14],[36,25],[12,25]])),(x,y)=>back||!(face(x,y)&&y>6.2)&&!(y>19.5&&Math.abs(x-24)<3.8))))}
  if(ap('helm')){const h=ap('helm'),hm=p.part(h[0]);p.fill(hm,U(haAnd(haEl(24,9.6,8.9,8),(x,y)=>y<(back?16:8.6))));if(!back)p.fill(hm,U(haOr(haPoly([[15.4,8],[18,8],[18,15],[15.4,14]]),haPoly([[30,8],[32.6,8],[32.6,14],[30,15]]))))}
  ARMS.forEach(q=>{if(q[3]===P.front)drawArm(q)});
  if(acc.includes('satchel')){const bag=p.part('#8a5a30');p.fill(bag,back?haPoly([[29,41],[35.5,41],[35.5,47.5],[29,47.5]]):haPoly([[12.5,41],[19,41],[19,47.5],[12.5,47.5]]))}
  // -------- the hand-placed details --------
  const D=(x,y,c)=>p.dot(x,y,c),eye=C.eye||'#3a2a20',lip=fem?'#c0565a':haMix(dk,'#6a2a20',.45),brow=haRamp(C.hair)[3],OUT=haMix(sk[3],HA_OUT,.6);
  if(!back){
    [[20+s,11],[27+s,11]].forEach(([x,y],i)=>{
      if(fem&&!acc.includes('old')){RU(x,y,2,1,OUT);DU(i?x+2:x-1,y-(i?1:1),OUT);RU(x,y+1,2,2,eye);DU(i?x:x+1,y+2,haRamp(eye)[3]);DU(x,y+1,'#ffffff')}
      else{RU(x-(i?0:1),y,3,1,OUT);RU(x,y+1,2,1,eye);DU(i?x:x+1,y+1,haRamp(eye)[3]);DU(x,y+1,'#ffffff');RU(x-(i?0:1),y-2,3,1,brow);DU(i?x+2:x-1,y-1,brow)}});
    if(fem){DU(20+s-(1),9,brow);RU(20+s,8,2,1,brow);RU(27+s,8,2,1,brow);DU(29+s,9,brow)}
    DU(24+s+(turn>0?1:0),14,sk[2]);DU(24+s+(turn>0?1:0),13,sk[0]);
    RU(23+s,16,fem?2:3,1,lip);if(!fem)DU(23+s,17,sk[2]);
    if(fem)[[19+s,14],[28+s,14]].forEach(([x,y])=>RU(x,y,2,1,haMix(dk,'#ff7a80',.35)));
    if(acc.includes('old')){[[18,13],[30,13],[21,15],[27,15],[22,6.6],[25,6.6]].forEach(([x,y],i)=>i<4?DU(x+s,y,sk[2]):RU(x+s,Math.round(y),2,1,sk[2]))}
    if(acc.includes('glasses')){const G='#3a3440';[[20+s,11],[27+s,11]].forEach(([x,y])=>{RU(x-1,y,4,1,G);RU(x-1,y+3,4,1,G);RU(x-1,y,1,4,G);RU(x+2,y,1,4,G)});RU(23+s,11,1,1,G)}
    if(acc.includes('eyepatch')){RU(27+s,10,3,4,'#1a1416');LU(29+s,10,32,7,'#1a1416');LU(26+s,10,17,7,'#1a1416')}
    if(acc.includes('earring')&&turn<=.25){DU(16,14,'#e8c24a');DU(16,15,'#e8c24a')}
    if(acc.includes('scar'))LU(18+s,12,20+s,15,sk[3]);
    if(acc.includes('moustache')||acc.includes('beard')||acc.includes('longbeard')||acc.includes('goatee')){RU(21+s,15,6,1,BC);DU(21+s,16,BC);DU(26+s,16,BC);RU(22+s,15,4,1,haRamp(BC)[0])}
    if(acc.includes('stubble'))for(let y=16;y<20;y++)for(let x=17;x<32;x+=3){const X=x+(y%3)+s;if(p.at(Math.round(X+ux(y)),y)===head&&(y>=18||Math.abs(X-24-s)>3.5)&&!(y===16&&Math.abs(X-24-s)<3))DU(X,y,haMix(dk,sk[3],.35))}
    if(acc.includes('freckles'))[[20,14],[22,14],[21,15],[26,14],[28,14],[27,15]].forEach(([x,y])=>DU(x+s,y,haMix(dk,'#9a5a30',.45)));
  }
  hands.forEach(([c,d,n])=>{[-.85,.85].forEach(o=>p.dot(Math.round(c[0]+d[0]*1.7+n[0]*o),Math.round(c[1]+d[1]*1.7+n[1]*o),sk[2]));p.dot(Math.round(c[0]-d[0]*.3),Math.round(c[1]-d[1]*.3),sk[0])});
  // hair texture: a shine band and a few clumps
  const HR=haRamp(C.hair);
  if(spec.hair==='curly')for(let y=3;y<9;y+=2)for(let x=17+(y%4);x<32;x+=3)DU(x,y,HR[0]);
  else for(let x=17;x<=30;x++){const y=Math.round((back?6:4.4)+((x-23.5)/6)**2*1.6),X=Math.round(x+ux(y));if(p.at(X,y)===hair){D(X,y,HR[0]);if(x%2)D(X,y+1,HR[0])}if(x%3===0&&p.at(X,y+3)===hair)D(X,y+3,HR[2])}
  if(spec.hair==='braid')for(let i=0;i<6;i++){const x=back?23:15.6-i*.35|0,y=(back?18:17)+i*3|0;DU(x,y,HR[0]);DU(x+2,y+1,HR[3])}
  // clothes
  if(!ap('body')){
    if(spec.top==='stripes')for(let y=25;y<44;y+=3)for(let x=4;x<44;x++){const k=p.at(x,y);if(k===shirt||k===sleeves)D(x,y,'#f4f2ea')}
    if(spec.top==='sweater')for(let x=13;x<36;x+=3)for(let y=25;y<43;y++)if(p.at(Math.round(x+ux(y)),y)===shirt)D(Math.round(x+ux(y)),y,haRamp(C.shirt)[2]);
    if(spec.top==='tunic'){RU(15,40,19,2,'#6b4423');RU(23,40,3,2,'#d9a441')}
    if(spec.over==='longcoat'&&!back){for(let y=27;y<56;y+=5){DU(21.5,y,'#e8c24a');DU(26.5,y,'#e8c24a')}LU(24,22,24,60,haRamp(C.jacket)[3]);LU(20,21,23,27,haRamp(C.jacket)[0]);LU(28,21,25,27,haRamp(C.jacket)[0])}
    if(spec.over==='cloak'&&!back){LU(19,23,21,26,'#d9a441');LU(29,23,27,26,'#d9a441')}
    if(spec.over==='flannel')for(let y=20;y<50;y++)for(let x=4;x<44;x++){const k=p.at(x,y);if(k>=0&&p.parts[k].r[1]===C.jacket&&((x-Math.round(ux(y)))%4===0||y%4===0))D(x,y,haRamp(C.jacket)[2])}
    if(spec.over==='coat'&&!back){for(let y=27;y<44;y+=4){if(p.at(Math.round(21.5+ux(y)),y)===jk)DU(21.5,y,'#e8c24a');if(p.at(Math.round(26.5+ux(y)),y)===jk)DU(26.5,y,'#e8c24a')}RU(21,21,6,2,C.shirt);LU(24,23,24,40,haRamp(C.jacket)[3])}
    if(spec.over==='vest'&&!back)for(let y=27;y<42;y+=5){DU(21,y,haRamp(C.jacket)[3]);DU(27,y,haRamp(C.jacket)[3])}
    if(acc.includes('satchel')&&!back)LU(32,24,17.5,41,'#6b4423');
    if(acc.includes('satchel')&&back)LU(16,24,30.5,41,'#6b4423');
    // a fold or two in the cloth
    LU(18,38,20,42,haRamp(bodyC)[2]);
  }else{const a=ap('body');for(let y=27;y<43;y+=5)for(let x=8;x<40;x++)if(p.at(x,y)===shirt)D(x,y,a[1]);RU(22,24,4,17,a[2])}
  return p}
const HA_CACHE=new Map();
// a person's picture as a canvas (cached): key names it for ART_FILES, spec describes it
function heroCanvas(key,spec,view,arm){const k=key+'|'+view+'|'+JSON.stringify(spec.col)+'|'+JSON.stringify(arm||{});if(HA_CACHE.has(k))return HA_CACHE.get(k);
  const cv=document.createElement('canvas');cv.width=HA_W;cv.height=HA_H;
  const file=ART_FILES[key+(view==='b'?'_back':'')];
  if(file&&file.complete&&file.naturalWidth)cv.getContext('2d').drawImage(file,0,0,HA_W,HA_H);else paintHero(spec,view,arm).render(cv);
  HA_CACHE.set(k,cv);return cv}
// the player's own picture: their chosen character (HEROES in js/data/heroes.js) in the colours of S.look, wearing what they wear
function heroSpecFor(h,L){return{...h.art,sex:h.sex,col:{skin:OPT.skin[L.skin],hair:OPT.hair[L.hair],shirt:OPT.shirt[L.shirt],jacket:OPT.jacket[L.jk===undefined?1:L.jk],hat:h.art.hatCol||OPT.hat[L.hc||0],eye:h.art.eye,pants:h.art.pants,boots:h.art.boots}}}
function heroSpec(){const h=HEROES.find(q=>q.id===S.hero)||HEROES[0];return heroSpecFor(h,S.look||h.look)}
const playerArt=view=>heroCanvas('hero_'+(S.hero||'f1'),heroSpec(),view||'f',armourLook());
// draw a picture onto a canvas, keeping its shape (centred, no blurring)
function drawArt(cv,art,bg){const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);if(bg){c.fillStyle=bg;c.fillRect(0,0,cv.width,cv.height)}
  const s=Math.min(cv.width/art.width,cv.height/art.height),w=art.width*s,h=art.height*s;c.drawImage(art,(cv.width-w)/2,(cv.height-h)/2,w,h)}
// the head and shoulders, for the box beside someone's words
function drawBust(cv,art,bg){const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);if(bg){c.fillStyle=bg;c.fillRect(0,0,cv.width,cv.height)}
  c.drawImage(art,10,1,28,25,0,0,cv.width,cv.height)}
