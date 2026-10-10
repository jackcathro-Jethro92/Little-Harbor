// ---------- light: a day and night tint, warm glow from windows, lanterns and fires, and a soft vignette (graphics step 1.7) ----------
// A purely visual clock: one full day takes DAY_MS (10 minutes) of real time, starting in the morning when the game opens and again when you sleep. It is not saved and changes no rule.
// Outdoors the picture is tinted (warm at dusk and dawn, a soft blue at night); at night windows, lanterns, camp fires and stations glow. Rooms and the Darkwood are not tinted.
// For testing, a game link ending in  ?time=night  (or day, dusk, dawn) freezes the time of day for that visit.
const DAY_MS=600000,FORCE_TIME=(new URLSearchParams(location.search).get('time')||'');
let dayStart=performance.now()-DAY_MS*.08;               // the game opens in the morning
const lightMorning=()=>{dayStart=performance.now()-DAY_MS*.08};
function dayPhase(){const f={dawn:.93,day:.3,dusk:.62,night:.82}[FORCE_TIME];return f!==undefined?f:(((performance.now()-dayStart)/DAY_MS)%1+1)%1}
// returns {dark: 0..1 how night it is, warm: 0..1 how much dusk or dawn orange}
function daylight(){const p=dayPhase(),ramp=(a,b,x)=>Math.max(0,Math.min(1,(x-a)/(b-a)));
  const dark=p<.55?0:p<.7?ramp(.55,.7,p):p<.9?1:1-ramp(.9,1,p),warm=p>=.5&&p<.7?Math.sin(ramp(.5,.7,p)*Math.PI):p>=.88?Math.sin(ramp(.88,1,p)*Math.PI)*.8:0;return{dark,warm}}
const lerp=(a,b,k)=>Math.round(a+(b-a)*k);
function applyLight(cx,cy,t){const z=zoneOf(P.x,P.y);
  if(z===0){const{dark,warm}=daylight(),tint=(r,g2,b,k)=>{g.globalCompositeOperation='multiply';g.fillStyle='rgb('+lerp(255,r,k)+','+lerp(255,g2,k)+','+lerp(255,b,k)+')';g.fillRect(0,0,VW,VH);g.globalCompositeOperation='source-over'};   // outdoors: tint the whole picture
    if(warm>.02)tint(255,196,150,warm*.55);if(dark>.02)tint(110,124,190,dark*.72);if(dark>.12)nightGlow(cx,cy,t,dark)}
  if(z!==2&&z!==7){const gr=g.createLinearGradient(0,0,VW,VH);gr.addColorStop(0,'rgba(255,236,190,.07)');gr.addColorStop(1,'rgba(40,30,80,.06)');g.fillStyle=gr;g.fillRect(0,0,VW,VH);   // soft light from the top-left
    const v=g.createRadialGradient(VW/2,VH/2,VH*.38,VW/2,VH/2,VH*.78);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(10,10,30,.16)');g.fillStyle=v;g.fillRect(0,0,VW,VH)}}   // and a gentle vignette
function glow(x,y,r,a,col){const gr=g.createRadialGradient(x,y,1,x,y,r);gr.addColorStop(0,'rgba('+col+','+a.toFixed(2)+')');gr.addColorStop(1,'rgba('+col+',0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)}
function nightGlow(cx,cy,t,dark){g.globalCompositeOperation='lighter';const a=dark*.55,fl=1+Math.sin(t/150)*.06;
  BL.forEach(b=>{const x=b.x*T-cx,y=b.y*T-cy;if(x<-40||y<-40||x>VW+40||y>VH+40)return;
    if(b.decor==='campfire'){glow(x+8,y+8,26*fl,a*.9,'255,150,60');return}
    if(b.w===3&&b.roof&&!b.tent&&!b.hall){const W=48,dx=((W/2-5)|0);[4,W-12].forEach(wx=>{if(Math.abs(wx-dx)<9)return;glow(x+wx+4,y+21,15,a*.75,'255,190,90')});glow(x+dx+5,y+27,12,a*.5,'255,200,110')}});
  const x0=(cx/T|0)-1,y0=(cy/T|0)-1;
  for(let ty=y0;ty<=y0+VH/T+2;ty++)for(let tx=x0;tx<=x0+VW/T+2;tx++)if(at(tx,ty)===7&&zoneOf(tx,ty)===0)glow(tx*T-cx+8,ty*T-cy+6,18*fl,a*.8,'255,200,110');
  S.placed.forEach(p=>{if(p.id==='camp_kit'||p.id==='cooking_station'||p.id==='forge'||p.id==='alchemy_station')glow(p.x*T-cx+8,p.y*T-cy+9,20*fl,a*.8,p.id==='alchemy_station'?'190,140,255':'255,160,70')});
  g.globalCompositeOperation='source-over'}
