// ---------- the sea festival decorations (roadmap 4.0): bunting, paper lanterns and a banner over the village harbour, drawn above the people ----------
// FESTIVAL_ON is switched by the `festival` row of VARIANTS (flag festival_on, js/story/opening.js). FESTIVAL_SPOTS says where things hang, in world tile coordinates: a string of flags from one end to the other (`bunting`),
// paper lanterns hanging along it (`lanterns`: how many) and a cloth banner between two points (`banner`). Drawing only: no tiles change, nobody is blocked.
let FESTIVAL_ON=false,FESTIVAL_BUILD=1,FLOAT_START=0,FLOAT_MS=8000,CHEER_UNTIL=0;   // FESTIVAL_BUILD 0..1 is how much of the decorations are up (the cinematic raises them); FLOAT_START starts the floating lanterns; CHEER_UNTIL makes the crowd hop
const FESTIVAL_SPOTS=[
 {bunting:[146,117,165,117],lanterns:3},{bunting:[146,121,165,121],lanterns:2},{bunting:[150,124,160,124],lanterns:2},{banner:[154,125,158,125]}
];
const FEST_COL=['#d8483c','#f0c040','#3a8ad0','#f4f0e0','#58b060'];
function festBunting(x0,y0,x1,y1,lan,cx,cy,t,fr){const ax=x0*T+8-cx,ay=y0*T-4-cy,bx=x1*T+8-cx,by=y1*T-4-cy,n=Math.max(4,Math.round((bx-ax)/7)),sag=7;
  const pt=k=>{const x=ax+(bx-ax)*k,y=ay+(by-ay)*k+Math.sin(k*Math.PI)*sag;return[x,y]};
  g.fillStyle='#6a4a2a';for(let i=0;i<=40*fr;i++){const[x,y]=pt(i/40);g.fillRect(x|0,y|0,1,1)}
  for(let i=1;i<n&&i/n<=fr;i++){const[x,y]=pt(i/n),w=Math.sin(t/260+i*1.7)>0?1:0,c=FEST_COL[i%FEST_COL.length];
    g.fillStyle=c;g.fillRect((x-2)|0,(y+1)|0,5,2);g.fillRect((x-1)|0,(y+3)|0,3,2);g.fillRect((x+w)|0,(y+5)|0,1,1);g.fillStyle='rgba(255,255,255,.35)';g.fillRect((x-2)|0,(y+1)|0,5,1)}
  const dk=typeof daylight==='function'?daylight().dark:0;
  for(let l=1;l<=lan&&fr>=.999;l++){const[x,y]=pt(l/(lan+1)),sw=Math.round(Math.sin(t/500+l*2)*1);
    if(dk>.15){const gr=g.createRadialGradient(x,y+9,1,x,y+9,13);gr.addColorStop(0,'rgba(255,200,110,'+(.55*dk)+')');gr.addColorStop(1,'rgba(255,200,110,0)');g.fillStyle=gr;g.fillRect(x-14,y-4,28,26)}
    g.fillStyle='#6a4a2a';g.fillRect((x)|0,(y)|0,1,3);g.fillStyle='#b8321e';g.fillRect((x-2+sw)|0,(y+3)|0,5,6);g.fillStyle='#e8503a';g.fillRect((x-1+sw)|0,(y+4)|0,3,4);g.fillStyle='#f6d070';g.fillRect((x-1+sw)|0,(y+3)|0,3,1);g.fillRect((x-1+sw)|0,(y+8)|0,3,1)}}
function festBanner(x0,y0,x1,y1,cx,cy,t){const ax=x0*T+2-cx,bx=x1*T+14-cx,y=y0*T-6-cy,w=bx-ax;
  g.fillStyle='#6a4a2a';g.fillRect(ax|0,(y-2)|0,2,22);g.fillRect((bx-2)|0,(y-2)|0,2,22);g.fillRect(ax|0,(y-2)|0,(w)|0,2);
  for(let i=0;i<w;i+=2){const o=Math.round(Math.sin(t/320+i*.25)*1);g.fillStyle=i%8<4?'#2e78b8':'#3a8ad0';g.fillRect((ax+2+i)|0,(y+o)|0,2,13);g.fillStyle='#f4f0e0';g.fillRect((ax+2+i)|0,(y+o+10)|0,2,1)}
  g.fillStyle='#f0c040';for(let k=0;k<3;k++){const px=ax+w/2-8+k*7;g.fillRect(px|0,(y+4)|0,3,3);g.fillRect((px+1)|0,(y+3)|0,1,5)}}   // three golden stars
function drawFestival(cx,cy,t){const B=FESTIVAL_BUILD,per=1/FESTIVAL_SPOTS.length;
  FESTIVAL_SPOTS.forEach((s,i)=>{const fr=Math.max(0,Math.min(1,(B-i*per*.75)/(per*1.25)));if(fr<=0)return;
    if(s.bunting)festBunting(s.bunting[0],s.bunting[1],s.bunting[2],s.bunting[3],s.lanterns||0,cx,cy,t,fr);else if(s.banner&&fr>=.99)festBanner(s.banner[0],s.banner[1],s.banner[2],s.banner[3],cx,cy,t)});
  if(B>=.99)[[151,129],[161,129],[147,131],[165,131]].forEach(([x,y],i)=>{if(at(x,y)===0)boatArt(0,false,i%2?'l':'r',x*T-cx,y*T-cy+Math.round(Math.sin(t/420+i*1.9)),'back')});   // boats from round the harbour moored for the festival
  if(FLOAT_START)drawFloatLanterns(cx,cy,t)}
// paper lanterns let go from the pier and drifting out over the water, rising slowly and glowing
function drawFloatLanterns(cx,cy,t){const k=(t-FLOAT_START)/FLOAT_MS;if(k<0||k>1.15)return;
  for(let i=0;i<16;i++){const ph=Math.max(0,k-i*.025),a=Math.min(1,ph*4)*(k>1?Math.max(0,1-(k-1)/.15):1),dir=(i%2?1:-1)*(.4+(i%5)*.18),x=156*T+8+dir*ph*70*(1+(i%3)*.2)-cx,y=129*T-ph*(60+(i%4)*14)-cy+Math.sin(t/500+i)*1.5;
    if(a<=0)continue;g.globalAlpha=a;const gr=g.createRadialGradient(x,y,1,x,y,12);gr.addColorStop(0,'rgba(255,200,110,.55)');gr.addColorStop(1,'rgba(255,200,110,0)');g.fillStyle=gr;g.fillRect(x-12,y-12,24,24);
    g.fillStyle='#b8321e';g.fillRect((x-2)|0,(y-3)|0,5,6);g.fillStyle='#f6d070';g.fillRect((x-1)|0,(y-2)|0,3,4);g.fillStyle='#e8503a';g.fillRect((x-2)|0,(y-3)|0,5,1);g.globalAlpha=1}}
