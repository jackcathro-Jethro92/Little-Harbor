// ---------- the opening cinematic (roadmap N10 / 2.12): plays when the game opens, before the title menu, once per visit ----------
// It looks up into a blue sky with white clouds and two sea birds, tilts down to the horizon while the driftwood title (with seaweed hanging off it)
// rises up out of the sea, and a sailing ship, seen from behind, sails forward away from us towards the horizon.
// Tap (or press any key) once to skip to the end, and again to go on to the title menu.
// Everything is drawn in code at a low resolution and scaled up, in the game's own pixel style. It has its own canvas, so the game is not touched.
const INTRO_SEEN='lh-intro';
const playIntro=(()=>{
  const LEN=15.5; // seconds until "Tap to start"
  const BASE=270; // pixels across the shorter side of the screen (more = finer detail)
  const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  const SKY=['#2557ad','#2c63ba','#3471c6','#3e7fd0','#4a8cd8','#589ade','#69a8e4','#7db6e9','#93c4ed','#aad1f1','#c0ddf4','#d3e8f6'];
  const SEA=['#21427a','#264e8b','#2b5899','#3064a6','#3770b1','#3e7db9','#4689c1','#4f95c8','#58a0cd'];
  const ease=t=>t<=0?0:t>=1?1:t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2, outE=t=>t<=0?0:t>=1?1:1-Math.pow(1-t,3);
  const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const hash=(x,y)=>{const v=Math.sin(x*12.9898+y*78.233)*43758.5453;return v-Math.floor(v)};
  const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
  let el,cv,g,hintEl,W,H,K,HZ,TILT,D,S0,sky,sea,clouds,waves,glints,gulls,ships,island,title,foam=[],emit=0,last=0,t0=0,raf=0,phase='play',onDone=null,onKey=null,onResize=null;

  // a vertical gradient with ordered (checkerboard-like) dithering between the colour bands, like old console skies
  function dithered(w,h,cols,shape){const c=mk(w,h),x=c.getContext('2d'),im=x.createImageData(w,h),P=cols.map(rgb),n=P.length-1;
    for(let y=0;y<h;y++){const f=shape(y/(h-1||1))*n,i=Math.min(n-1,f|0),fr=f-i;
      for(let xx=0;xx<w;xx++){const p=P[fr*16>BAYER[(y&3)*4+(xx&3)]+.5?i+1:i],o=(y*w+xx)*4;im.data[o]=p[0];im.data[o+1]=p[1];im.data[o+2]=p[2];im.data[o+3]=255}}
    x.putImageData(im,0,0);return c}

  // a puffy pixel cloud: round bumps on a flat base, lit from the top left, with soft creases where the puffs overlap and a blue-grey underside
  function makeCloud(w,h,r){const bumps=[],n=2+Math.max(1,Math.round(w/16));
    for(let i=0;i<n;i++){const u=i/(n-1),rad=Math.min(h*.5,w*.2)*(.6+.4*(1-Math.abs(u-.5)*1.6)+r()*.15);bumps.push([w*(.16+.68*u)+(r()-.5)*6,h-3-rad*(.45+r()*.35),rad])}
    const inBase=(x,y)=>{const ex=(x-w/2)/(w/2-1),ey=(y-(h-3))/(h*.2);return ex*ex+ey*ey<=1};
    const inside=(x,y)=>{if(y>h-2||y<0||x<0||x>=w)return false;if(inBase(x,y))return true;for(const b of bumps){const dx=x-b[0],dy=y-b[1];if(dx*dx+dy*dy<=b[2]*b[2])return true}return false};
    const c=mk(w,h),x=c.getContext('2d');
    for(let y=0;y<h;y++)for(let xx=0;xx<w;xx++){if(!inside(xx,y))continue;const ch=(xx+y)%2;let col;
      if(!inside(xx,y-1)||!inside(xx-1,y-1))col='#ffffff';
      else if(!inside(xx,y+1))col='#9fb8d4';
      else if(!inside(xx+1,y+2)||!inside(xx,y+3)&&ch)col='#b9cee4';
      else if(y>h*.74||y>h*.62&&ch)col='#d3e1ef';
      else if(!inside(xx-2,y-3)&&ch||!inside(xx,y-3))col='#f8fbfe';
      else col='#e8f1f9';
      // creases: the lower edge of a puff that sits over another puff
      if(col==='#e8f1f9'||col==='#f8fbfe')for(const b of bumps){const dx=xx-b[0],dy=y-b[1],d=Math.sqrt(dx*dx+dy*dy)-b[2];if(d>-1.4&&d<=0&&dy>0&&dx>-b[2]*.3){col=ch?'#d3e1ef':'#dde8f3';break}}
      x.fillStyle=col;x.fillRect(xx,y,1,1)}
    return c}

  // a sea bird seen from the side, three wing positions; k = dark wing tips, g = grey, w = white, s = soft grey shading, o = beak, e = eye
  const GULL=[["k.................k","gk...............kg",".gw.............wg.","..ww...........ww..","...www.......www...","....wwws...swww....","......swwwwwwweoo..","........sss........"],
              ["...................","...................","...................","kggwwws.....swwwggk","......swwwwwwweoo..","........sss........","...................","..................."],
              ["...................","...................","......swwwwwwweoo..","....wwws...swww....","...www.......www...","..ww...........ww..",".gw.............wg.","gk...............kg"]];
  const GC={k:'#232b36',g:'#55606f',w:'#ffffff',s:'#b4c3d4',o:'#f0a030',e:'#232b36'};
  function makeGull(rows,sc){const c=mk(19*sc,8*sc),x=c.getContext('2d');rows.forEach((r,y)=>[...r].forEach((ch,xx)=>{if(GC[ch]){x.fillStyle=GC[ch];x.fillRect(xx*sc,y*sc,sc,sc)}}));return c}

  // the sailing ship seen from behind, sailing away from us: stern with lit cabin windows, rudder and lantern,
  // the masts lined up one behind the other with their square sails filled with wind, the tip of the jib, rigging and a red pennant
  const SW=64,SH=78,WL=73; // sprite size and the waterline row
  function makeShip(fr){const c=mk(SW,SH),x=c.getContext('2d');
    const p=(X,Y,col)=>{x.fillStyle=col;x.fillRect(X,Y,1,1)},hl=(a,b,Y,col)=>{if(b>=a){x.fillStyle=col;x.fillRect(a,Y,b-a+1,1)}};
    const line=(a,b,c2,d,col)=>{const n=Math.max(Math.abs(c2-a),Math.abs(d-b));for(let i=0;i<=n;i++)p(Math.round(a+(c2-a)*i/n),Math.round(b+(d-b)*i/n),col)};
    const INK='#2a1d16',SAIL='#f7f2e4',SL='#fffdf6',SS='#e2d8c1',SD='#c2b394',SX='#a39373',MAST='#4a2f1d',ML='#6b4630',ROPE='#5b4636',
          HULL='#7c4a2a',HD='#5b3720',HL='#9a6236',GOLD='#e8b84a',GD='#b9852c',WIN='#ffd66b',RED='#c8473a',RD='#8f2c25';
    // rigging (behind the sails): shrouds from the mast tops down to the sides of the hull, and the forestay
    line(31,6,9,56,ROPE);line(32,6,54,56,ROPE);line(30,17,6,56,ROPE);line(33,17,57,56,ROPE);line(30,34,11,56,ROPE);line(33,34,52,56,ROPE);
    // the tip of the jib showing to the right, beyond the big lower sail
    for(let y=38;y<=52;y++){const b=58+Math.round((y-38)*.28);hl(56,b,y,y>48?SS:SAIL);p(b,y,SD)}
    // the mast
    x.fillStyle=MAST;x.fillRect(31,2,2,56);x.fillStyle=ML;x.fillRect(31,2,1,56);
    // a square sail seen from behind, filled with wind: wider at the foot, the foot curving up at the corners, light on the left, shade on the right, seams and reef points
    const sail=(a0,b0,a1,b1,y0,y1,yard)=>{hl(a0-3,b0+3,y0-2,MAST);hl(a0-3,b0+3,y0-1,INK);p(a0-3,y0-2,INK);p(b0+3,y0-2,INK);
      const c0=(a0+b0)/2;
      for(let y=y0;y<=y1;y++){const u=(y-y0)/(y1-y0),a=Math.round(a0+(a1-a0)*u),b=Math.round(b0+(b1-b0)*u),hw=(b-a)/2;
        for(let X=a;X<=b;X++){const q=(X-c0)/hw,lift=Math.round(q*q*(y1-y0)*.16);if(y>y1-lift)continue;
          let col=q<-.55?SL:q<.25?SAIL:q<.7?SS:SD;
          if(y===y0||y===y0+1&&(X%2))col=SS;            // shadow under the yard
          if(y===y0+3&&X%4===1)col=SD;                    // reef points
          if((X-a)%7===0&&X>a&&X<b&&col!==SL)col=col===SAIL?SS:SD; // vertical seams
          if(y===y1-lift)col=SX;                          // the foot of the sail
          if(X===a)col=SD;if(X===b)col=SX;p(X,y,col)}}};
    sail(22,42,19,45,6,13);sail(15,49,11,53,18,31);sail(9,55,6,58,35,53);
    // the pennant at the top of the mast, waving
    p(31,1,INK);p(32,1,INK);if(fr){hl(33,39,2,RED);hl(33,37,3,RD);p(40,3,RED)}else{hl(33,38,2,RED);hl(33,40,3,RD);p(39,1,RED)}
    // the stern: taffrail with posts, a lantern, the transom with carved gold trim and five lit cabin windows, planks, and the rudder
    hl(11,52,54,INK);hl(12,51,55,GOLD);for(let X=12;X<=51;X+=4)p(X,56,MAST);hl(11,52,56,INK);
    for(let y=57;y<=WL+3;y++){const u=(y-57)/(WL+3-57),hw=Math.round(21-u*u*12),a=32-hw,b=31+hw;
      let col=(y-57)%3===2?HD:HULL;if(y===57||y===62)col=GOLD;if(y===58||y===63)col=GD;if(y>WL-1)col=HD;
      hl(a,b,y,col);p(a,y,INK);p(b,y,INK);p(a+1,y,HL);p(b-1,y,HD)}
    for(const wx of[14,21,28,35,42]){hl(wx,wx+5,64,INK);for(let y=65;y<=68;y++){hl(wx,wx+5,y,INK);hl(wx+1,wx+4,y,y===65?'#fff2b8':WIN)}hl(wx,wx+5,69,INK);p(wx+2,66,GD);p(wx+2,67,GD)}
    for(let X=14;X<=48;X+=3)p(X,70,GOLD);
    x.fillStyle=INK;x.fillRect(30,60,4,WL+4-60);x.fillStyle=MAST;x.fillRect(31,61,2,WL+3-61);
    // the lantern on the taffrail
    hl(30,33,47,INK);hl(29,34,48,INK);for(let y=49;y<=52;y++){p(29,y,INK);p(34,y,INK);hl(30,33,y,y===49?'#fff6c8':WIN)}hl(29,34,53,INK);
    return c}

  // a far island on the horizon: two hills, round trees, a few cottages with red roofs, and a lighthouse whose light flashes
  function makeIsland(){const w=Math.round(62*K),h=Math.round(22*K),c=mk(w,h),x=c.getContext('2d'),r=rng(31);
    const hill=(cx,hw,hh,col)=>{x.fillStyle=col;for(let i=-hw;i<=hw;i++){const v=Math.round(hh*Math.pow(Math.cos(i/hw*Math.PI/2),.8));if(v>0)x.fillRect(cx+i,h-v,1,v)}};
    hill(Math.round(w*.33),Math.round(w*.32),Math.round(h*.55),'#86a5c0');hill(Math.round(w*.62),Math.round(w*.3),Math.round(h*.38),'#7697b5');
    for(let i=0;i<9;i++){const tx=Math.round(w*(.08+r()*.5)),top=h-Math.round(h*.55*Math.pow(Math.cos((tx-w*.33)/(w*.32)*Math.PI/2),.8))-1;
      x.fillStyle='#5f83a4';x.fillRect(tx-1,top-2,3,3);x.fillRect(tx,top-3,1,1);x.fillStyle='#6d90af';x.fillRect(tx-1,top-2,1,1)}
    for(const hx of[.48,.56,.66]){const bx=Math.round(w*hx),by=h-Math.round(h*.2);x.fillStyle='#e6edf2';x.fillRect(bx,by,4,3);x.fillStyle='#b8655a';x.fillRect(bx-1,by-2,6,2);x.fillStyle='#4d6f8f';x.fillRect(bx+1,by+1,1,1)}
    const lx=Math.round(w*.8),ly=h-Math.round(h*.3);x.fillStyle='#7697b5';x.fillRect(lx-3,ly+2,8,h-ly-2);
    for(let y=0;y<10;y++){x.fillStyle=y%4<2?'#eef3f6':'#c8473a';x.fillRect(lx,ly-8+y,2,1)}
    x.fillStyle='#3d5874';x.fillRect(lx-1,ly-10,4,2);
    return{img:c,lx:lx+1,ly:ly-11}}

  // the title, built from pieces of sun-bleached driftwood laid along the strokes of each capital letter (like driftwood letters on a beach):
  // every stick has its own shade, rounded ends, wood grain and a dark gap around it; sticks poke out past the corners and overlap where strokes meet.
  // Strands of seaweed hang off the bottoms of the letters (and a few are draped over the tops), drawn every frame so they sway.
  // Each letter is a list of strokes on a 6 x 8 grid (x across, y down), with its width.
  const OCT=[[1.5,0,4.5,0],[4.5,0,6,1.5],[6,1.5,6,6.5],[6,6.5,4.5,8],[4.5,8,1.5,8],[1.5,8,0,6.5],[0,6.5,0,1.5],[0,1.5,1.5,0]];
  const LETTERS={L:[5,[[0,0,0,8],[0,8,5,8]]],I:[3,[[1.5,0,1.5,8],[0,0,3,0],[0,8,3,8]]],T:[6,[[0,0,6,0],[3,0,3,8]]],
    E:[5,[[0,0,0,8],[0,0,5,0],[0,4,4,4],[0,8,5,8]]],H:[5.5,[[0,0,0,8],[5.5,0,5.5,8],[0,4,5.5,4]]],A:[6.4,[[0,8,3.2,0],[3.2,0,6.4,8],[1.3,5.2,5.1,5.2]]],
    R:[5.5,[[0,0,0,8],[0,0,4,0],[4,0,5.5,1.4],[5.5,1.4,5.5,2.8],[5.5,2.8,4,4.2],[4,4.2,0,4.2],[2.2,4.2,5.5,8]]],
    B:[5.8,[[0,0,0,8],[0,0,4,0],[4,0,5.2,1.2],[5.2,1.2,5.2,2.9],[5.2,2.9,4,4],[4,4,0,4],[4,4,5.8,5.3],[5.8,5.3,5.8,6.8],[5.8,6.8,4.6,8],[4.6,8,0,8]]],
    O:[6,OCT]};
  function makeTitle(){const k=Math.min(W,H)/BASE,r=rng(2024),sticks=[];
    const rows=[['LITTLE',Math.max(3,3.4*k),1.7*k,1],['HARBOR',Math.max(4,5*k),2.3*k,2]];
    const gapRow=Math.round(17*k),M8=Math.round(10*k);let y=M8;
    for(const[word,u,rad,bundle]of rows){const sp=2.3*u,wid=[...word].reduce((t,ch)=>t+LETTERS[ch][0]*u,0)+sp*(word.length-1);let x0=(W-wid)/2;
      for(const ch of word){const[lw,segs]=LETTERS[ch];
        for(const[a1,b1,a2,b2]of segs){const ax=x0+a1*u,ay=y+b1*u,bx=x0+a2*u,by=y+b2*u,len=Math.hypot(bx-ax,by-ay),dx=(bx-ax)/len,dy=(by-ay)/len,nx=-dy,ny=dx;
          // long strokes are made of two or three overlapping pieces; thick strokes are a bundle of two sticks side by side
          const pieces=len>u*5.5?(r()<.5?2:3):len>u*3?(r()<.6?1:2):1;
          for(let b=0;b<bundle;b++){const off=bundle>1?(b-.5)*rad*1.5:0;
            for(let q=0;q<pieces;q++){const s0=q/pieces*len-(q?rad*1.5:0),s1=(q+1)/pieces*len+(q<pieces-1?rad*1.5:0),e0=(q===0?-(1+r()*rad*1.1):0),e1=(q===pieces-1?1+r()*rad*1.1:0),tilt=(r()-.5)*1.2,jit=(r()-.5)*.8;
              sticks.push({ax:ax+dx*(s0+e0)+nx*(off+tilt+jit),ay:ay+dy*(s0+e0)+ny*(off+tilt+jit),bx:ax+dx*(s1+e1)+nx*(off-tilt+jit),by:ay+dy*(s1+e1)+ny*(off-tilt+jit),
                r:rad*(.8+r()*.4),bend:(r()-.5)*rad*.8,tone:r()*6|0,seed:r()*1000})}}}
        x0+=lw*u+sp}
      y+=8*u+gapRow}
    const tw=W,th=Math.ceil(y+M8);
    for(let i=sticks.length-1;i>0;i--){const j=r()*(i+1)|0;[sticks[i],sticks[j]]=[sticks[j],sticks[i]]}
    // paint the sticks: dark gap around each, light top edge, shaded underside, grain along the length, darker rounded ends, the odd knot
    const TONES=['#d3c7ae','#c2b294','#ad9b7e','#dcd2bf','#9f8d71','#b9a98b'],DARK=['#a89a80','#978669','#84735a','#b3a690','#78684f','#8f7f64'],LIGHT=['#e9e1cf','#dacdb2','#c8b89b','#f0e9db','#b9a88b','#d2c4a8'];
    const S=new Uint8Array(tw*th),px=new Array(tw*th).fill(null);
    for(const st of sticks){const rad=st.r,x0=Math.floor(Math.min(st.ax,st.bx)-rad-2),x1=Math.ceil(Math.max(st.ax,st.bx)+rad+2),y0=Math.floor(Math.min(st.ay,st.by)-rad-2),y1=Math.ceil(Math.max(st.ay,st.by)+rad+2),len=Math.hypot(st.bx-st.ax,st.by-st.ay);
      const knot=r()<.35?.2+r()*.6:-1;
      for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++){if(xx<0||yy<0||xx>=tw||yy>=th)continue;const q=segQ(st,xx,yy);if(q.d>rad+.9)continue;const i=yy*tw+xx;
        if(q.d>rad){px[i]='#3b2f23';S[i]=1;continue}
        const v=q.v/rad,along=q.u*len,end=Math.min(q.u*len,(1-q.u)*len);let col=TONES[st.tone];
        if(v<-.45)col=LIGHT[st.tone];else if(v>.5)col=DARK[st.tone];
        const lane=Math.round(v*rad*1.6+st.seed);if(hash(lane,Math.floor((along+st.seed)/(4+hash(lane,1)*6)))>.72)col=DARK[st.tone];
        if(end<1.6)col=DARK[st.tone];
        if(knot>0&&Math.hypot(along-knot*len,v*rad)<1.3)col='#5e4f3c';
        if(hash(xx*3+st.seed,yy)>.97)col='#6d5d47';
        px[i]=col;S[i]=1}}
    let X0=tw,X1=0,Y0=th,Y1=0;for(let i=0;i<tw*th;i++)if(S[i]){const X=i%tw,Y=i/tw|0;if(X<X0)X0=X;if(X>X1)X1=X;if(Y<Y0)Y0=Y;if(Y>Y1)Y1=Y}
    if(X1<X0)return null;
    const m=(X,Y)=>X>=0&&Y>=0&&X<tw&&Y<th&&S[Y*tw+X];
    const P=4,ow=X1-X0+1+P*2,oh=Y1-Y0+1+P*2,o=mk(ow,oh),ox=o.getContext('2d');
    for(let Y=Y0-P;Y<=Y1+P;Y++)for(let X=X0-P;X<=X1+P;X++){let col=null;
      if(m(X,Y))col=px[Y*tw+X];
      else if(m(X-1,Y)||m(X+1,Y)||m(X,Y-1)||m(X,Y+1))col='#2a2119';
      else if(m(X,Y-2)||m(X-1,Y-2)||m(X+1,Y-2)||m(X,Y-3))col='rgba(12,28,58,.45)';
      if(col){ox.fillStyle=col;ox.fillRect(X-X0+P,Y-Y0+P,1,1)}}
    // seaweed: hanging from the bottom edges of the letters, and a few strands draped over the tops
    const weed=[];let lastX=-9;
    for(let X=X0;X<=X1;X++)for(let Y=Y1;Y>=Y0;Y--){if(m(X,Y)&&!m(X,Y+1)&&!m(X,Y+2)){if(hash(X,Y*3)>.74&&X-lastX>2){weed.push({x:X-X0+P,y:Y-Y0+P+1,len:Math.round((5+hash(Y,X)*14)*k),ph:hash(X*7,Y)*6,w:hash(X,Y*7)<.55?2:1,top:0});lastX=X}break}}
    lastX=-9;
    for(let X=X0;X<=X1;X++)for(let Y=Y0;Y<=Y1;Y++){if(m(X,Y)&&!m(X,Y-1)){if(hash(X*3,Y)>.93&&X-lastX>6){weed.push({x:X-X0+P,y:Y-Y0+P-1,len:Math.round((6+hash(Y,X*5)*9)*k),ph:hash(X,Y*11)*6,w:2,top:1});lastX=X}break}}
    return{img:o,mask:S,tw,x0:X0,y0:Y0,x1:X1,y1:Y1,P,weed}}
  // where a pixel sits relative to a (slightly bent) stick: distance from its centre line, how far along it is, and which side
  function segQ(st,X,Y){const vx=st.bx-st.ax,vy=st.by-st.ay,l2=vx*vx+vy*vy||1;let u=((X-st.ax)*vx+(Y-st.ay)*vy)/l2;u=u<0?0:u>1?1:u;
    const l=Math.sqrt(l2),nx=-vy/l,ny=vx/l,b=st.bend*Math.sin(Math.PI*u),cx=st.ax+vx*u+nx*b,cy=st.ay+vy*u+ny*b,ex=X-cx,ey=Y-cy;
    const up=ny>0||(ny===0&&nx>0)?-1:1;return{d:Math.hypot(ex,ey),u,v:-(ex*nx+ey*ny)*up}} // v < 0 on the upper (lit) side

  function drawWeed(tx,ty,t){for(const s of title.weed){for(let j=0;j<s.len;j++){const u=j/s.len,off=Math.round(Math.sin(t*1.4+s.ph-j*.28)*j*.11),X=tx+s.x+off,Y=ty+s.y+j;
      const w=u<.65?s.w:1;g.fillStyle='#1b4227';g.fillRect(X-1,Y,1,1);
      g.fillStyle=u<.25?'#2d6a3a':(j+Math.round(s.ph))%5===0?'#6cb85c':'#3f8b47';g.fillRect(X,Y,w,1);
      if(j===Math.round(s.len*.5)&&s.w>1){g.fillStyle='#57a24f';g.fillRect(X+w,Y-1,1,2)}}}}

  function setup(){const iw=innerWidth||390,ih=innerHeight||844,px=Math.max(1,Math.min(iw,ih)/BASE);
    W=Math.max(160,Math.round(iw/px));H=Math.max(160,Math.round(ih/px));K=Math.min(W,H)/BASE*1.42;cv.width=W;cv.height=H;g.imageSmoothingEnabled=false;
    HZ=Math.round(H*.6);TILT=Math.round(H*.78);D=(H-HZ)*.95;S0=Math.min(3.2*Math.min(W,H)/BASE,D*1.15/WL);
    const HW=HZ+TILT;sky=dithered(W,HW+1,SKY,f=>Math.pow(f,1.25));
    sea=dithered(W,H-HZ+2,SEA,f=>Math.pow(f,.55));
    const r=rng(7);clouds=[];
    for(let i=0;i<12;i++){const u=i/11,wy=Math.round(u*(HW-40*K)+r()*12*K),near=1-wy/HW,w=Math.round((24+near*58+r()*18)*K),h=Math.round(w*(.46+r()*.1));
      clouds.push({img:makeCloud(w,h,r),x:r()*(W+60),y:Math.min(wy,HW-h-3),v:(2+near*5)*K})}
    for(let i=0;i<4;i++){const w=Math.round((14+r()*12)*K),h=Math.round(w*.45);clouds.push({img:makeCloud(w,h,r),x:r()*W,y:HW-h-2-Math.round(r()*7*K),v:.8})}
    const SHT=H-HZ;waves=[];glints=[];
    for(let i=0;i<260;i++){const k=1+Math.floor(Math.pow(r(),1.25)*SHT),u=k/SHT;waves.push({k,x:r()*W,len:1+Math.round(u*11*K),sp:.6+r()*1.4,ph:r()*7,cap:u>.35&&r()<.5})}
    for(let i=0;i<110;i++){const k=1+Math.floor(r()*SHT);glints.push({k,x:r()*W,len:1+Math.round(k/SHT*4*K),sp:1.2+r()*2.6,ph:r()*7})}
    gulls=[0,1,2].map(f=>[makeGull(GULL[f],Math.max(2,Math.round(K*1.8))),makeGull(GULL[f],Math.max(3,Math.round(K*2.6)))]);
    ships=[makeShip(0),makeShip(1)];island=makeIsland();title=makeTitle()}

  // the ship heads straight out to sea: it starts close behind us and shrinks as it gets further away, drifting slightly towards the middle
  const SHIP_T=4.6,shipAt=t=>{const z=.85*Math.exp((t-SHIP_T)*.12);return{z,X:W*.1}};

  function frame(now){raf=requestAnimationFrame(frame);
    const t=Math.max(0,(now-t0)/1000),dt=Math.min(.05,Math.max(0,t-last));last=t;
    if(phase==='play'&&t>=LEN){phase='end';hint('Tap to start',true)}
    if(phase==='play'&&t>3&&hintEl.textContent==='Tap to skip')hintEl.style.opacity=0;
    const cam=Math.round(TILT*ease((t-3.2)/5.3)),hz=HZ+TILT-cam,SHT=H-HZ;
    g.drawImage(sky,0,-cam);
    for(const c of clouds){const span=W+c.img.width+20,x=((c.x+c.v*t)%span+span)%span-c.img.width-10,y=c.y-cam;if(y<H&&y+c.img.height>0)g.drawImage(c.img,Math.round(x),y)}
    if(hz<H+island.img.height){const ix=Math.round(W*.06);g.drawImage(island.img,ix,hz-island.img.height);
      if(Math.sin(t*2.6)>.4){g.fillStyle='#fff3b0';g.fillRect(ix+island.lx-3,hz-island.img.height+island.ly,7,1);g.fillRect(ix+island.lx-1,hz-island.img.height+island.ly-1,3,3)}}
    // two sea birds, the near one bigger, flying right and riding up out of view as the camera tilts down
    [[W*.04,W*.11,H*.34,1.3,0,1],[W*.3,W*.08,H*.2,1.1,1.7,0]].forEach(([x0,v,y0,w,ph,big])=>{
      const glide=Math.sin(t*.8+ph)>.45,f=glide?1:[0,1,2,1][Math.floor(t*(big?7:9)+ph*3)%4],x=x0+v*t,y=y0+Math.sin(t*w+ph)*4*K-cam*(big?1.2:1.05);
      const img=gulls[f][big];if(y>-30&&x<W+30)g.drawImage(img,Math.round(x),Math.round(y))});
    // the title rises up out of the sea; nothing below the horizon line is drawn, so it looks like it comes up from behind it
    if(title&&t>7.6){const r=outE((t-7.6)/3.2),img=title.img,tx=Math.round((W-img.width)/2),top=HZ-Math.round(H*.09)-img.height,ty=Math.round(hz+2+(top-HZ-2)*r);
      g.save();g.beginPath();g.rect(0,0,W,hz);g.clip();g.drawImage(img,tx,ty);drawWeed(tx,ty,t);
      g.restore()}
    // the sea: rolling wave crests (bigger close up, tiny far away), white caps on the near ones, and twinkling light
    if(hz<H){g.drawImage(sea,0,hz);
      for(const w of waves){const y=hz+w.k;if(y>=H-1)continue;const s=Math.sin(t*w.sp+w.ph);if(s<-.3)continue;const u=w.k/SHT,x=Math.round(w.x+Math.sin(t*.5+w.ph)*u*5*K);
        g.fillStyle=u<.2?'#3f75b0':'#6ea5d4';g.fillRect(x,y,w.len,1);g.fillStyle='#22477f';g.fillRect(x+1,y+1,w.len,1);
        if(w.cap&&s>.55){g.fillStyle='#d6ebf7';g.fillRect(x+Math.round(w.len*.3),y-1,Math.max(1,Math.round(w.len*.35)),1)}}
      for(const w of glints){const y=hz+w.k;if(y>=H)continue;if(Math.sin(t*w.sp+w.ph)<.55)continue;g.fillStyle=w.k<SHT*.3?'#b4d6ea':'#f0f8fc';g.fillRect(Math.round(w.x),y,w.len,1)}}
    // the ship sails straight away from us towards the horizon, rolling gently, leaving a V-shaped white wake
    if(t>SHIP_T){const{z,X}=shipAt(t),s=S0/z,ys=hz+D/z+Math.sin(t*2.1)*.9*Math.min(s,1.6),xs=W/2+X/z;
      if(phase==='play'||t<LEN+3){emit+=dt*110;while(emit>=1){emit--;const q=Math.random(),side=Math.random()<.5?-1:1;
        foam.push(q<.45?{X:X+(Math.random()-.5)*16*S0,z:z*(1-Math.random()*.02),b:t,dx:(Math.random()-.5)*6*S0,life:2.2}
                :{X:X+side*(17+Math.random()*4)*S0,z:z*(1-Math.random()*.03),b:t,dx:side*(4+Math.random()*7)*S0,life:3})}}
      if(z<80){const img=ships[Math.floor(t*3)%2],w=Math.max(1,Math.round(SW*s)),h=Math.max(1,Math.round(WL*s));
        g.save();g.translate(Math.round(xs),Math.round(ys));g.rotate(Math.sin(t*1.3)*.03);g.drawImage(img,0,0,SW,WL,-Math.round(w/2),-h,w,h);g.restore()}}
    foam=foam.filter(p=>t-p.b<p.life);
    for(let i=0;i<foam.length;i++){const p=foam[i],a=(t-p.b)/p.life,X=p.X+p.dx*(t-p.b),x=W/2+X/p.z,y=hz+D/p.z;if(y>=H||(a>.55&&(i+Math.floor(t*20))%2))continue;
      const sz=Math.max(1,Math.round(1.3*S0/p.z*(1-a*.5)));g.fillStyle=a<.2?'#ffffff':a<.55?'#d6ecf7':'#a8cfe6';g.fillRect(Math.round(x-sz/2),Math.round(y-sz/2),sz,Math.max(1,Math.round(sz*.6)))}
    // letterbox bars while it plays; they slide away when it is ready to start
    const lb=Math.round(H*.075*(1-outE((t-LEN)/.7)));if(lb>0){g.fillStyle='#0b1018';g.fillRect(0,0,W,lb);g.fillRect(0,H-lb,W,lb)}}

  function hint(text,blink){hintEl.textContent=text;hintEl.classList.toggle('blink',!!blink);hintEl.style.opacity=1}
  function tap(e){if(e&&e.type==='keydown'){e.preventDefault();e.stopImmediatePropagation()}
    if(phase==='play'){t0=performance.now()-LEN*1000;last=LEN;foam=[];phase='end';hint('Tap to start',true)}
    else if(phase==='end'){phase='out';finish()}}
  function finish(){const cb=onDone;onDone=null;cb&&cb();el.classList.add('out');el.classList.remove('open');
    removeEventListener('keydown',onKey,true);removeEventListener('resize',onResize);
    setTimeout(()=>{cancelAnimationFrame(raf);el.remove()},650)}

  return function playIntro(done){onDone=done;phase='play';foam=[];
    try{sessionStorage.setItem(INTRO_SEEN,'1')}catch(e){}
    el=document.createElement('div');el.id='intro';el.className='open';el.setAttribute('role','button');el.setAttribute('aria-label','Opening scene. Tap to skip.');
    el.innerHTML='<canvas id="intro-c"></canvas><div id="intro-hint">Tap to skip</div>';document.body.appendChild(el);
    cv=el.firstChild;g=cv.getContext('2d');hintEl=$('intro-hint');setup();
    el.addEventListener('pointerdown',e=>{e.preventDefault();tap(e)});
    onKey=e=>tap(e);addEventListener('keydown',onKey,true);
    onResize=()=>setup();addEventListener('resize',onResize);
    t0=performance.now();last=0;raf=requestAnimationFrame(frame)}
})();
