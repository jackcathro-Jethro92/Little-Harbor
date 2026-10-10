// ---------- the opening cinematic (roadmap N10 / 2.12): plays when the game opens, before the title menu, once per visit ----------
// It looks up into a blue sky with white clouds and two sea birds, tilts down to the horizon while the title rises up out of the sea,
// and a sailing ship cuts across the water towards the horizon. Tap (or press any key) once to skip to the end, and again to go on to the title menu.
// Everything is drawn in code at a low resolution and scaled up, in the game's own pixel style. It has its own canvas, so the game is not touched.
const INTRO_SEEN='lh-intro';
const playIntro=(()=>{
  const LEN=15.5; // seconds until "Tap to start"
  const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  const SKY=['#2557ad','#2c63ba','#3471c6','#3e7fd0','#4a8cd8','#589ade','#69a8e4','#7db6e9','#93c4ed','#aad1f1','#c0ddf4','#d3e8f6'];
  const SEA=['#23457b','#285290','#2d5d9e','#3369aa','#3a76b5','#4283bd','#4a8fc4','#549bca'];
  const INK='#1f2d3a';
  const ease=t=>t<=0?0:t>=1?1:t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2, outE=t=>t<=0?0:t>=1?1:1-Math.pow(1-t,3);
  const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
  let el,cv,g,hintEl,W,H,HZ,TILT,D,sky,sea,clouds,glints,gulls,ships,title,foam=[],emit=0,last=0,t0=0,raf=0,phase='play',onDone=null,onKey=null,onResize=null;

  // a vertical gradient with ordered (checkerboard-like) dithering between the colour bands, like old console skies
  function dithered(w,h,cols,shape){const c=mk(w,h),x=c.getContext('2d'),im=x.createImageData(w,h),P=cols.map(rgb),n=P.length-1;
    for(let y=0;y<h;y++){const f=shape(y/(h-1||1))*n,i=Math.min(n-1,f|0),fr=f-i;
      for(let xx=0;xx<w;xx++){const p=P[fr*16>BAYER[(y&3)*4+(xx&3)]+.5?i+1:i],o=(y*w+xx)*4;im.data[o]=p[0];im.data[o+1]=p[1];im.data[o+2]=p[2];im.data[o+3]=255}}
    x.putImageData(im,0,0);return c}

  // a puffy pixel cloud: round bumps on a flat base, white highlight on top, soft blue-grey underside
  function makeCloud(w,h,r){const inside=(x,y)=>{if(y>h-2)return false;
      const ex=(x-w/2)/(w/2-1),ey=(y-(h-3))/(h*.2);if(ex*ex+ey*ey<=1)return true;
      for(const b of bumps){const dx=x-b[0],dy=y-b[1];if(dx*dx+dy*dy<=b[2]*b[2])return true}return false};
    const bumps=[],n=2+Math.max(1,Math.round(w/14));
    for(let i=0;i<n;i++){const u=i/(n-1),rad=Math.min(h*.48,w*.2)*(.6+.4*(1-Math.abs(u-.5)*1.6)+r()*.15);bumps.push([w*(.16+.68*u)+(r()-.5)*5,h-3-rad*(.45+r()*.3),rad])}
    const c=mk(w,h),x=c.getContext('2d');
    for(let y=0;y<h;y++)for(let xx=0;xx<w;xx++){if(!inside(xx,y))continue;
      x.fillStyle=!inside(xx,y-1)||!inside(xx,y-2)&&(xx+y)%2?'#ffffff':!inside(xx,y+1)?'#a9c2dc':!inside(xx,y+2)||y>h*.78||y>h*.66&&(xx+y)%2?'#c9dbec':'#eef5fb';x.fillRect(xx,y,1,1)}
    return c}

  // a sea bird seen from the side, three wing positions; k = dark wing tips, w = white, s = grey underside, o = beak
  const GULL=[["k...........k","gw.........wg",".ww.......ww.","..www...www..","....swwwwo..."],
              [".............","............."," kgwww...wwwgk","....swwwwo...","............."],
              [".............",".............","....swwwwo...","..www...www..",".gw.......wg."]];
  const GC={k:'#27303c',g:'#4a5566',w:'#ffffff',s:'#b8c6d6',o:'#f0a030'};
  function makeGull(rows,sc){const c=mk(14*sc,5*sc),x=c.getContext('2d');rows.forEach((r,y)=>[...r].forEach((ch,xx)=>{if(GC[ch]){x.fillStyle=GC[ch];x.fillRect(xx*sc,y*sc,sc,sc)}}));return c}

  // the sailing ship, facing right: two masts with square sails, a jib to the bowsprit, a stern castle and a red pennant
  function makeShip(fr){const c=mk(54,42),x=c.getContext('2d');
    const p=(X,Y,col)=>{x.fillStyle=col;x.fillRect(X,Y,1,1)},hl=(a,b,Y,col)=>{x.fillStyle=col;x.fillRect(a,Y,b-a+1,1)};
    const line=(a,b,c2,d,col)=>{const n=Math.max(Math.abs(c2-a),Math.abs(d-b));for(let i=0;i<=n;i++)p(Math.round(a+(c2-a)*i/n),Math.round(b+(d-b)*i/n),col)};
    const SAIL='#f7f2e4',SS='#ddd3bc',SD='#b5a789',MAST='#4a2f1d',ROPE='#5b4636',HULL='#7c4a2a',HD='#5b3720',HL='#9a6236',GOLD='#e8b84a',RED='#c8473a';
    line(22,3,6,27,ROPE);line(36,8,23,4,ROPE);line(36,9,53,25,ROPE);
    x.fillStyle=MAST;x.fillRect(22,2,1,30);x.fillRect(36,7,1,25);
    for(let y=10;y<=28;y++){const a=37+Math.round((y-10)*.12),b=37+Math.round((y-10)*.76);hl(a,b,y,SAIL);p(b,y,SD);if(y===28)hl(a,b,y,SD)}
    const sail=(a,b,y0,y1)=>{hl(a-1,b+1,y0-1,MAST);for(let y=y0;y<=y1;y++){const s=Math.round(1.6*Math.sin(Math.PI*(y-y0)/(y1-y0))),L=a+s,R=b+s;
      hl(L,R,y,SAIL);hl(R-2,R,y,SS);p(L,y,SS);p(R,y,SD);if(y===y1)hl(L,R,y,SD);else if(y===y1-1)hl(L+1,R-1,y,SS)}};
    sail(16,28,6,13);sail(14,30,15,27);sail(31,41,10,16);sail(30,42,18,28);
    hl(23,fr?27:28,3,RED);hl(23,fr?28:26,4,RED);p(22,1,INK);
    // stern castle with two lit windows and a lantern
    hl(5,14,27,INK);for(let y=28;y<=31;y++){hl(5,14,y,HULL);p(5,y,INK);p(14,y,INK)}p(8,29,GOLD);p(11,29,GOLD);p(5,26,GOLD);
    // bow and bowsprit
    hl(44,48,29,INK);hl(43,47,30,HULL);p(48,30,INK);line(47,29,53,25,MAST);
    // hull
    for(let y=31;y<=40;y++){const a=6+Math.round((y-31)*.7),b=47-Math.round(Math.pow((y-31)/9,1.5)*10);
      hl(a,b,y,y===31||y===40?INK:y===32?GOLD:y===33?HL:y===36?HD:HULL);p(a,y,INK);p(b,y,INK)}
    for(const gx of[15,22,29,36])hl(gx,gx+1,34,INK);
    return c}

  // the title: thresholded so the letters stay crisp pixels, then a dark outline, a drop shadow and a sunny gold fill
  function makeTitle(){const lines=[['Little',18,19],['Harbor',34,54]],tw=W,th=62,c=mk(tw,th),x=c.getContext('2d');
    x.fillStyle='#fff';x.textAlign='center';x.textBaseline='alphabetic';
    for(const[t,s,y]of lines){x.font='700 '+s+'px "Pixelify Sans", ui-monospace, Menlo, monospace';x.fillText(t,tw/2,y)}
    const d=x.getImageData(0,0,tw,th).data,M=new Uint8Array(tw*th);let x0=tw,x1=0,y0=th,y1=0;
    for(let i=0;i<tw*th;i++)if(d[i*4+3]>=120){M[i]=1;const X=i%tw,Y=i/tw|0;if(X<x0)x0=X;if(X>x1)x1=X;if(Y<y0)y0=Y;if(Y>y1)y1=Y}
    if(x1<x0)return null;
    const ow=x1-x0+5,oh=y1-y0+6,o=mk(ow,oh),ox=o.getContext('2d'),m=(X,Y)=>X>=x0&&X<=x1&&Y>=y0&&Y<=y1&&M[Y*tw+X];
    let l2=24;while(l2<y1&&!M.subarray(l2*tw,l2*tw+tw).some(v=>v))l2++;
    const band=Y=>{const a=Y<l2?[y0,19]:[l2,y1];return(Y-a[0])/Math.max(1,a[1]-a[0])};
    for(let Y=y0-2;Y<=y1+3;Y++)for(let X=x0-2;X<=x1+2;X++){let col=null;
      if(m(X,Y)){const f=band(Y);col=f<.3?'#fff6d6':f<.62?'#f7c948':'#e3892c'}
      else if(m(X-1,Y)||m(X+1,Y)||m(X,Y-1)||m(X,Y+1)||m(X-1,Y-1)||m(X+1,Y-1)||m(X-1,Y+1)||m(X+1,Y+1))col=INK;
      else if(m(X,Y-2)||m(X-1,Y-2)||m(X+1,Y-2)||m(X,Y-3))col='rgba(20,40,80,.55)';
      if(col){ox.fillStyle=col;ox.fillRect(X-x0+2,Y-y0+2,1,1)}}
    return{img:o,mask:M,tw,x0,y0,x1,y1}}

  function setup(){const iw=innerWidth||390,ih=innerHeight||844,px=Math.max(1,Math.min(iw,ih)/190);
    W=Math.max(120,Math.round(iw/px));H=Math.max(120,Math.round(ih/px));cv.width=W;cv.height=H;g.imageSmoothingEnabled=false;
    HZ=Math.round(H*.6);TILT=Math.round(H*.78);D=(H-HZ)*.95;
    const HW=HZ+TILT;sky=dithered(W,HW+1,SKY,f=>Math.pow(f,1.25));
    sea=dithered(W,H-HZ+2,SEA,f=>Math.pow(f,.55));
    const r=rng(7);clouds=[];
    for(let i=0;i<11;i++){const u=i/10,wy=Math.round(u*(HW-30)+r()*10),near=1-wy/HW,w=Math.round(24+near*56+r()*16),h=Math.round(w*(.46+r()*.1));
      clouds.push({img:makeCloud(w,h,r),x:r()*(W+60),y:Math.min(wy,HW-h-3),v:2+near*5})}
    // a few small far clouds sitting just above the horizon
    for(let i=0;i<3;i++){const w=14+Math.round(r()*10),h=Math.round(w*.45);clouds.push({img:makeCloud(w,h,r),x:r()*W,y:HW-h-2-Math.round(r()*6),v:.8})}
    glints=[];const SH=H-HZ;for(let i=0;i<110;i++){const k=1+Math.floor(r()*SH);glints.push({k,x:r()*W,len:1+Math.round(k/SH*6),light:r()<.65,sp:1.2+r()*2.6,ph:r()*7})}
    gulls=[0,1,2].map(f=>[makeGull(GULL[f],2),makeGull(GULL[f],3)]);ships=[makeShip(0),makeShip(1)];title=makeTitle()}

  const shipAt=t=>{const u=(t-5)/10,z=.85*Math.exp((t-5)*.27),X=(-.75+1.85*Math.min(1,Math.max(0,u))+Math.max(0,u-1)*.4)*W;return{z,X}};

  function frame(now){raf=requestAnimationFrame(frame);
    const t=Math.max(0,(now-t0)/1000),dt=Math.min(.05,Math.max(0,t-last));last=t;
    if(phase==='play'&&t>=LEN){phase='end';hint('Tap to start',true)}
    if(phase==='play'&&t>3&&hintEl.textContent==='Tap to skip')hintEl.style.opacity=0;
    const cam=Math.round(TILT*ease((t-3.2)/5.3)),hz=HZ+TILT-cam;
    g.drawImage(sky,0,-cam);
    for(const c of clouds){const span=W+c.img.width+20,x=((c.x+c.v*t)%span+span)%span-c.img.width-10,y=c.y-cam;if(y<H&&y+c.img.height>0)g.drawImage(c.img,Math.round(x),y)}
    // a far island with a little lighthouse, sitting on the horizon
    if(hz<H+2){const ix=Math.round(W*.12);g.fillStyle='#7194b3';for(let i=0;i<34;i++){const h=Math.round(5.5*Math.pow(Math.sin(Math.PI*i/33),.7)+(i>6&&i<14?1.5*Math.sin(i):0));if(h>0)g.fillRect(ix+i,hz-h,1,h)}
      g.fillStyle='#e9eef2';g.fillRect(ix+24,hz-10,2,6);g.fillStyle='#c8473a';g.fillRect(ix+24,hz-11,2,1);g.fillRect(ix+24,hz-8,2,1);
      if(Math.sin(t*3)>.3){g.fillStyle='#fff3b0';g.fillRect(ix+23,hz-12,4,1)}}
    // two sea birds, the near one bigger, flying right and riding up out of view as the camera tilts down
    [[W*.04,20,H*.34,1.3,0,1],[W*.3,15,H*.2,1.1,1.7,0]].forEach(([x0,v,y0,w,ph,big],i)=>{
      const glide=Math.sin(t*.8+ph)>.45,f=glide?1:[0,1,2,1][Math.floor(t*(big?7:9)+ph*3)%4],x=x0+v*t,y=y0+Math.sin(t*w+ph)*4-cam*(big?1.2:1.05);
      const img=gulls[f][big];if(y>-12&&x<W+30)g.drawImage(img,Math.round(x),Math.round(y))});
    // the title rises up out of the sea; nothing below the horizon line is drawn, so it looks like it comes up from behind it
    if(title&&t>7.6){const r=outE((t-7.6)/3.2),img=title.img,tx=Math.round((W-img.width)/2),top=HZ-Math.round(H*.1)-img.height,ty=Math.round(hz+2+(top-HZ-2)*r);
      g.save();g.beginPath();g.rect(0,0,W,hz);g.clip();g.drawImage(img,tx,ty);
      const s=(t-11.4)*90;if(s>-10&&s<img.width+img.height){g.fillStyle='rgba(255,255,255,.8)';
        for(let Y=title.y0;Y<=title.y1;Y++)for(let X=title.x0;X<=title.x1;X++){const d=X-title.x0+(Y-title.y0)-s;if(d>=0&&d<4&&title.mask[Y*title.tw+X])g.fillRect(tx+X-title.x0+2,ty+Y-title.y0+2,1,1)}}
      g.restore()}
    // the sea, with twinkling light on the waves (longer streaks close up, tiny ones far away)
    if(hz<H){g.drawImage(sea,0,hz);
      for(const w of glints){const y=hz+w.k;if(y>=H)continue;const s=Math.sin(t*w.sp+w.ph);if(s<.25)continue;
        g.fillStyle=w.light?(w.k<(H-HZ)*.3?'#9cc4de':'#e4f2fa'):'#244f88';g.fillRect(Math.round(w.x+Math.sin(t*.4+w.ph)*2),y,w.len,1)}}
    // the ship sails away from us, across and towards the horizon, leaving a white wake
    if(t>5){const{z,X}=shipAt(t),s=2.6/z,ys=hz+D/z+Math.sin(t*2.2)*.9*Math.min(s,1.5),xs=W/2+X/z;
      if(phase==='play'||t<LEN+3){emit+=dt*70;while(emit>=1){emit--;const bow=Math.random()<.3;foam.push({X:X+(bow?50:-48)+(Math.random()-.5)*6,z:z+(Math.random()-.5)*.04,b:t,dx:(Math.random()-.5)*(bow?40:14),life:bow?.7:2.6})}}
      if(z<60){const img=ships[Math.floor(t*3)%2],w=Math.max(1,Math.round(54*s)),h=Math.max(1,Math.round(38*s));g.drawImage(img,0,0,54,38,Math.round(xs-27*s),Math.round(ys-h),w,h)}}
    foam=foam.filter(p=>t-p.b<p.life);
    for(let i=0;i<foam.length;i++){const p=foam[i],a=(t-p.b)/p.life,X=p.X+p.dx*(t-p.b),x=W/2+X/p.z,y=hz+D/p.z;if(y>=H||(a>.6&&(i+Math.floor(t*20))%2))continue;
      const sz=Math.max(1,Math.round(2.4/p.z*(1-a*.6)));g.fillStyle=a<.25?'#ffffff':a<.6?'#d6ecf7':'#a8cfe6';g.fillRect(Math.round(x-sz/2),Math.round(y-sz/2),sz,sz)}
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
    if(document.fonts&&document.fonts.load)document.fonts.load('700 34px "Pixelify Sans"').then(()=>{title=makeTitle()},()=>{});
    el.addEventListener('pointerdown',e=>{e.preventDefault();tap(e)});
    onKey=e=>tap(e);addEventListener('keydown',onKey,true);
    onResize=()=>setup();addEventListener('resize',onResize);
    t0=performance.now();last=0;raf=requestAnimationFrame(frame)}
})();
