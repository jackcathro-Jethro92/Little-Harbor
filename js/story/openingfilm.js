// ---------- the opening cinematic of a new game (Jack's draft "Little Harbor Opening", https://claude.ai/artifact/NjGKjmiQGg9yf43JwbtKZH) ----------
// Six scenes, about a minute, drawn on their own picture (#ofilm, laid over the game's screen at the same 176 x 208 size): 1 dawn over the sea and the title; 2 the camera drops from the sky onto the
// decorated village; 3 the ceremony: Murl's speech on the stage (his lines fest_c1, fest_c2, fest_c3 in js/story/opening.js) and the newest fisher walks up through the crowd; 4 the first boat: Murl presents
// the ribboned rowboat at the pier (fest_c4); 5 night falls, fireworks over the harbour, and a seagull lands on your new boat; 6 the title again. The people are the real ones: your own character, Murl
// and the villagers in FEST_CROWD, in their own colours. The scene step {film:'intro'} plays it (js/story/opening.js uses it at the start of a new game); a tap, Skip or Escape ends it early.
const INTRO=(()=>{
const W=176,H=208;let cv=null,g2=null,cur=0,lt=0,last=0,raf=0,parts=[],firsts=[],onEnd=null;
const R2=(x,y,w,h,c)=>{g2.fillStyle=c;g2.fillRect(Math.round(x),Math.round(y),w,h)},P2=(x,y,c)=>R2(x,y,1,1,c);
const ease=t=>t<0?0:t>1?1:t*t*(3-2*t);
const mixc=(a,b,t)=>{const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
// ---- the people: you, Murl and the villagers, with the game's own sprites ----
const lookOf=name=>{const n=NPC.find(q=>q.n===name);return n?lo({...n,...(NL[n.n]||{})}):lo({})};
let ME,MURL,VILL;
function cast(){ME=playerLook();MURL=lookOf('Murl');const names=FEST_CROWD.filter(n=>NPC.some(q=>q.n===n));VILL=[...Array(12)].map((_,i)=>lookOf(names[i%names.length]))}
function dude(x,y,look,view,frame){g2.fillStyle='rgba(0,0,0,.28)';g2.fillRect(Math.round(x)+3,Math.round(y)+18,10,2);CharacterSprite.draw(g2,Math.round(x),Math.round(y),{...look,view,frame:frame||0})}
// ---- scenery ----
function sky(top,bot,y0,y1){for(let y=y0;y<y1;y++)R2(0,y,W,1,mixc(top,bot,(y-y0)/(y1-y0)))}
function sea(y0,y1,t,base,hi,refX){for(let y=y0;y<y1;y++){const d=(y-y0)/(y1-y0);R2(0,y,W,1,mixc(base[0],base[1],d))}
  for(let k=0;k<70;k++){const y=y0+2+((k*37)%(y1-y0-3)),x=((k*53+t*(6+k%5))%(W+20))-10,w=3+k%5;R2(x,y,w,1,hi)}
  if(refX!=null)for(let y=y0+1;y<y1;y+=2){const d=(y-y0)/(y1-y0),w=Math.max(1,10-d*6+Math.sin(t*3+y)*3);R2(refX-w/2+Math.sin(t*2+y*.7)*2,y,w,1,'#ffe9a8')}}
function gull(x,y,t,c){const f=Math.floor(t*6)%2;c=c||'#ffffff';if(f){P2(x-2,y,c);P2(x-1,y-1,c);P2(x,y,c);P2(x+1,y-1,c);P2(x+2,y,c)}else{P2(x-2,y-1,c);P2(x-1,y,c);P2(x,y,c);P2(x+1,y,c);P2(x+2,y-1,c)}}
function house(x,y,w,roof,lit){const C={thatch:['#c9a35c','#a98340','#e0c07c'],slate:['#5a6c80','#485a6e','#8aa0b5'],red:['#b0473a','#8e3328','#d0685a']}[roof],O='#24170c';
  R2(x-1,y+14,w+3,2,'rgba(0,0,0,.25)');R2(x,y+8,w,8,O);for(let i=1;i<w-1;i+=3)R2(x+i,y+9,2,6,['#7a5230','#704a2a'][i%2]);
  R2(x+2,y+10,4,4,lit?'#ffd890':'#efe3bd');R2(x+w-6,y+10,4,4,lit?'#ffd890':'#efe3bd');R2(x+(w>>1)-2,y+10,4,6,'#4a2e16');
  R2(x-2,y,w+4,9,O);for(let j=0;j<8;j++)R2(x-1,y+1+j,w+2,1,j<3?C[2]:j<6?C[0]:C[1]);R2(x+2,y-2,w-4,3,O);R2(x+3,y-1,w-6,2,C[2])}
function bunting(x0,y0,x1,y1,t,sag){let k=0;for(let x=x0;x<=x1;x++){const u=(x-x0)/(x1-x0),y=y0+(y1-y0)*u+Math.sin(u*Math.PI)*sag;P2(x,y,'#5a3a20');
  if((x-x0)%5===0){const c=['#d9534f','#f2c14e','#3b82c4','#4caf72','#f4f4f0'][k++%5];R2(x,y+1,3,1,c);R2(x+.5,y+2,2,1,c);P2(x+1,y+3,c)}}}
function lanternPole(x,y,t,glow){R2(x,y,1,16,'#4a2e16');R2(x-2,y-1,5,1,'#4a2e16');R2(x-2,y,5,4,'#c8553d');R2(x-1,y+1,3,2,'#ffd890');if(glow){g2.fillStyle='rgba(255,210,120,.18)';g2.beginPath();g2.arc(x+.5,y+2,9+Math.sin(t*5),0,7);g2.fill()}}
function pier(x,y,len,dir){for(let i=0;i<len;i++){const px=dir==='h'?x+i*4:x,py=dir==='h'?y:y+i*4;if(dir==='h'){R2(px,py,4,10,i%2?'#a8783f':'#b4844a');R2(px+3,py,1,10,'#7a5228');R2(px,py,4,1,'#c99a5e')}else{R2(px,py,14,4,i%2?'#a8783f':'#b4844a');R2(px,py+3,14,1,'#7a5228')}}}
function rowboat(x,y,t,ribbon){y+=Math.round(Math.sin(t*2.2));R2(x+1,y+9,22,2,'rgba(0,30,60,.35)');R2(x,y+3,24,7,'#3a2414');R2(x+1,y+3,22,5,'#a8703a');R2(x+2,y+4,20,3,'#e8d6b0');R2(x+22,y+4,3,4,'#3a2414');R2(x-1,y+4,2,4,'#3a2414');R2(x+6,y+4,1,3,'#7a4a26');R2(x+15,y+4,1,3,'#7a4a26');R2(x+1,y+8,22,1,'#5a3618');
  if(ribbon){R2(x+11,y+2,2,8,'#d9534f');R2(x,y+5,24,1,'#d9534f');R2(x+9,y,2,3,'#d9534f');R2(x+13,y,2,3,'#d9534f');P2(x+12,y+1,'#f08070')}}
function sailboat(x,y,t,flag){y+=Math.round(Math.sin(t*1.8+x));R2(x,y+10,18,4,'#3a2414');R2(x+1,y+10,16,3,'#8a5a2e');R2(x+8,y-8,1,18,'#4a2e16');
  g2.fillStyle='#f4ecd8';g2.beginPath();g2.moveTo(x+9,y-7);g2.lineTo(x+16,y+8);g2.lineTo(x+9,y+8);g2.fill();R2(x+8,y-10,4,2,flag);P2(x+12,y-9,flag)}
// ---- sparks and confetti ----
function burst(x,y,cols,n,spd,life){for(let i=0;i<n;i++){const a=Math.random()*6.283,s=spd*(.4+Math.random()*.6);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,c:cols[i%cols.length],l:life*(.7+Math.random()*.5),t:0,gr:0})}}
function confetti(x,y,n){for(let i=0;i<n;i++)parts.push({x:x+(Math.random()-.5)*60,y:y-Math.random()*20,vx:(Math.random()-.5)*10,vy:-10-Math.random()*25,c:['#d9534f','#f2c14e','#3b82c4','#4caf72','#f4f4f0','#e88ab0'][i%6],l:2.5,t:0,gr:30})}
function stepParts(dt){for(const p of parts){p.t+=dt;p.vy+=p.gr*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(!p.gr){p.vx*=.97;p.vy=p.vy*.97+6*dt}}parts=parts.filter(p=>p.t<p.l)}
function drawParts(){for(const p of parts){const a=1-p.t/p.l;if(p.flash){g2.fillStyle='rgba(255,240,200,'+(.5*a)+')';g2.beginPath();g2.arc(p.x,p.y,10,0,7);g2.fill();continue}
  g2.globalAlpha=Math.max(0,a);const s=(!p.gr&&a>.55)?2:1;R2(p.x,p.y,s,s,p.c);if(!p.gr&&a>.3){R2(p.x-p.vx*.05,p.y-p.vy*.05,1,1,p.c);R2(p.x-p.vx*.1,p.y-p.vy*.1,1,1,p.c)}g2.globalAlpha=1}}
// ---- words ----
function text(s,x,y,size,col,align,shadow){g2.font=`600 ${size}px 'Pixelify Sans', monospace`;g2.textAlign=align||'center';g2.textBaseline='top';if(shadow!==false){g2.fillStyle='rgba(0,0,0,.6)';g2.fillText(s,x+1,y+1)}g2.fillStyle=col;g2.fillText(s,x,y)}
let FACE=null;
function face(){if(FACE)return FACE;const a=npcArt('Murl');if(!a)return null;FACE=document.createElement('canvas');FACE.width=28;FACE.height=25;drawBust(FACE,a.art,a.bg);return FACE}
// the speech box, with Murl's portrait: one of his lines from DLG, wrapped to four rows
function box(id){const d=DLG[id];if(!d)return;const node=d.nodes[d.start],who=node.who,line=node.text;const y0=H-60;
  R2(4,y0,W-8,56,'#1b262c');R2(5,y0+1,W-10,54,'#f6eed8');R2(5,y0+1,W-10,1,'#ffffff');R2(8,y0+4,30,27,'#2a3a44');const f=face();if(f)g2.drawImage(f,9,y0+5);
  g2.font="600 9px 'Pixelify Sans', monospace";R2(42,y0+3,g2.measureText(who).width+8,10,'#3a63a8');text(who,46,y0+3,9,'#ffffff','left',false);
  g2.font="600 8px 'Pixelify Sans', monospace";const rows=[''];line.split(' ').forEach(w=>{const r=rows[rows.length-1],t2=r?r+' '+w:w;if(g2.measureText(t2).width>124&&r)rows.push(w);else rows[rows.length-1]=t2});
  rows.slice(0,4).forEach((r,i)=>text(r,43,y0+15+i*10,8,'#3a2a1a','left',false))}
function letterbox(a){const h=Math.round(14*a);R2(0,0,W,h,'#000');R2(0,H-h,W,h,'#000')}
// ---- the six scenes: d is the length in seconds, f(t, dt, first) draws a frame at t seconds (first remembers one-off events) ----
const SC=[
 {name:'Dawn',d:8,f:t=>{const k=ease(t/7);sky(mixc('#141a3a','#3a6ab8',k),mixc('#3a2a5a','#f2a86a',k),0,118);
   const sy=128-k*26;g2.fillStyle='rgba(255,220,150,'+(.25+.3*k)+')';g2.beginPath();g2.arc(88,sy,16+k*4,0,7);g2.fill();g2.fillStyle=mixc('#f08040','#ffe9a8',k);g2.beginPath();g2.arc(88,sy,9,0,7);g2.fill();
   for(let i=0;i<5;i++){const cx=(i*47+t*3)%220-20,cy=30+i*13;g2.fillStyle=mixc('#2a2a50','#f8c8a0',k*.8);g2.fillRect(cx,cy,26+i*3,3);g2.fillRect(cx+5,cy-2,14,2)}
   R2(0,104,60,14,mixc('#141a2a','#2f4a3a',k));R2(8,100,30,4,mixc('#141a2a','#2f4a3a',k));R2(12,96,4,4,mixc('#141a2a','#3a2a1a',k));
   sea(118,H,t,[mixc('#1a2a4a','#3478c8',k),mixc('#0a1428','#1f4f8a',k)],mixc('#3a4a7a','#8cc6f0',k),88);
   gull(30+t*14,60-Math.sin(t)*6,t);gull(50+t*12,70-Math.sin(t+1)*5,t+.3);gull(140-t*9,48,t+.6);
   const a=ease((t-2)/2)-ease((t-7)/1);if(a>0){g2.globalAlpha=a;text('LITTLE HARBOR',88,40,20,'#ffe9a8');text("~ a fisher's tale ~",88,64,9,'#ffffff');g2.globalAlpha=1}}},
 {name:'The festival',d:8,f:t=>{const cy=ease(t/6.5)*170;g2.save();g2.translate(0,-cy);
   sky('#5a9ae0','#bfe0f0',0,140);for(let i=0;i<4;i++){const cx=(i*60+t*4)%230-30;R2(cx,20+i*18,30,4,'#f4f8fc');R2(cx+6,17+i*18,16,3,'#f4f8fc')}
   gull(40+t*10,40,t);gull(120-t*8,64,t+.4);
   R2(0,140,W,240,'#71a948');for(let k=0;k<160;k++)P2((k*41)%W,140+(k*29)%120,['#86bb55','#5f9640'][k%2]);
   R2(0,196,W,10,'#c8925a');for(let k=0;k<40;k++)P2((k*23)%W,197+(k*7)%8,'#a87440');
   [[6,'thatch'],[48,'red'],[92,'slate'],[134,'thatch']].forEach(([x,r])=>house(x,168,34,r,false));
   bunting(0,160,88,162,t,6);bunting(88,162,176,158,t,6);for(const x of[24,64,112,152])lanternPole(x,180,t,false);
   for(let i=0;i<10;i++)dude(10+i*16,204+(i%2)*6,VILL[i],'b',0);
   R2(0,240,W,6,'#ead9a0');sea(246,380,t,['#3e8ed0','#2a63b0'],'#8cc6f0',null);
   pier(80,246,10,'v');sailboat(30,262,t,'#d9534f');sailboat(130,270,t,'#f2c14e');rowboat(100,300,t,true);g2.restore();
   const a=ease((t-1)/1)-ease((t-5)/1);if(a>0){g2.globalAlpha=a;R2(28,84,120,22,'rgba(20,30,40,.65)');text('THE SEA FESTIVAL',88,89,12,'#ffe9a8');g2.globalAlpha=1}}},
 {name:'The ceremony',d:15,f:(t,dt,first)=>{   // Murl's speech from the stage, then the newest fisher walks up and the crowd cheers
   R2(0,0,W,H,'#71a948');for(let k=0;k<200;k++)P2((k*41)%W,(k*29)%H,['#86bb55','#5f9640','#7ab24e'][k%3]);
   house(20,6,44,'red',false);house(112,6,44,'slate',false);bunting(0,30,176,30,t,8);
   R2(46,40,84,30,'#3a2414');R2(47,41,82,27,'#a8743f');for(let i=0;i<82;i+=6)R2(47+i,41,1,27,'#8a5a2e');R2(47,41,82,2,'#c99a5e');R2(58,68,60,4,'#8a5a2e');R2(64,72,48,3,'#7a4a26');
   lanternPole(40,34,t,false);lanternPole(134,34,t,false);
   const hop=t>13.2&&t<14.4?-Math.abs(Math.sin((t-13.2)*6))*2:0;dude(80,46+hop,MURL,'f',0);
   const pk=ease((t-10)/3),py=200-pk*112,moving=t>10&&t<13;dude(80,py,ME,'b',moving?[1,0,3,0][Math.floor(t*8)%4]:0);
   const cheer=t>13.2?Math.abs(Math.sin(t*7)):0;
   for(let i=0;i<6;i++){const x=6+i*28,y=128+(i%2)*10;if(Math.abs(x-80)<14)continue;dude(x,y-(cheer>.5&&i%2===Math.floor(t*4)%2?2:0),VILL[i+2],'b',0)}
   for(let i=0;i<5;i++){const x=20+i*34,y=150+(i%2)*8;dude(x,y-(cheer>.5&&i%2!==Math.floor(t*4)%2?2:0),VILL[(i+6)%VILL.length],'b',0)}
   if(!first.c&&t>13.3){first.c=1;confetti(88,40,70)}
   if(t>1&&t<4)box('fest_c1');else if(t>4.2&&t<7.6)box('fest_c2');else if(t>7.8&&t<10.2)box('fest_c3')}},
 {name:'Your first boat',d:10,f:(t,dt,first)=>{   // Murl presents the ribboned rowboat at the end of the pier
   sky('#6aa8e6','#cfe8f0',0,40);R2(0,34,W,6,'#5f8f4a');sea(40,H,t,['#3e8ed0','#245aa2'],'#9ad0f0',null);
   for(let x=0;x<W;x++)P2(x,40+Math.round(Math.sin(x*.3+t*2)),'#e8f6ff');
   pier(0,96,28,'h');for(let i=0;i<7;i++)R2(4+i*16,106,3,10,'#4a2e16');R2(0,96,W,1,'#c99a5e');bunting(0,86,112,88,t,4);lanternPole(30,80,t,false);lanternPole(100,80,t,false);
   rowboat(120,104,t,t<7.8);sailboat(20,140,t,'#3b82c4');sailboat(140,150,t,'#d9534f');gull(80+Math.sin(t)*30,24,t);
   const pk=ease((t-.4)/3),px=6+pk*86,mv=t>.4&&t<3.4;dude(px,80,ME,'r',mv?[1,0,3,0][Math.floor(t*8)%4]:0);
   dude(112,78,MURL,t<7.8?'l':'f',0);for(let i=0;i<3;i++)dude(6+i*14,80,VILL[i+9],'r',0);
   if(!first.r&&t>7.8){first.r=1;confetti(132,96,80);for(let i=0;i<8;i++)parts.push({x:132,y:106,vx:(Math.random()-.5)*40,vy:-30-Math.random()*20,c:'#d9534f',l:1.6,t:0,gr:60})}
   if(t>3.6&&t<7.6)box('fest_c4')}},
 {name:'Fireworks',d:9,f:(t,dt,first)=>{   // night falls, fireworks over the harbour, and a seagull lands on your new boat
   const k=ease(t/3);sky(mixc('#f0905a','#0c1230',k),mixc('#f8c890','#2a2a5a',k),0,110);if(k>.6)for(let i=0;i<40;i++)P2((i*37)%W,(i*23)%90,i%3?'#cfd8ff':'#ffffff');
   R2(0,92,W,18,mixc('#3a3a3a','#141820',k));[[4,'thatch'],[44,'red'],[92,'slate'],[132,'thatch']].forEach(([x,r])=>house(x,90,30,r,true));for(let x=10;x<W;x+=32)lanternPole(x,100,t,true);
   sea(116,H,t,[mixc('#3a78b8','#10203a',k),mixc('#1f4f8a','#060c1c',k)],mixc('#8cc6f0','#3a4a7a',k),null);pier(64,116,6,'v');rowboat(82,150,t,false);
   [2.4,3.1,3.7,4.6,5.2,6.0,6.6].forEach((s,i)=>{if(t>s&&!first['f'+i]){first['f'+i]=1;const x=30+((i*53)%120),y=24+((i*31)%40);burst(x,y,[['#f2c14e','#ffe9a8'],['#d9534f','#ffb0a0'],['#3b82c4','#a8d8ff'],['#4caf72','#b8f0a0'],['#e88ab0','#ffd6e4']][i%5],70,58,1.8);parts.push({x,y,vx:0,vy:0,c:'#ffffff',l:.25,t:0,gr:0,flash:1})}});
   for(const p of parts)if(!p.gr&&p.y<110){g2.globalAlpha=.25*(1-p.t/p.l);R2(p.x,232-p.y,1,2,p.c);g2.globalAlpha=1}
   const gk=ease((t-5.2)/2.2);if(t>5.2){if(gk<1)gull(170-gk*64,40+gk*108,t,'#f4f4f0');else{const bob=Math.round(Math.sin(t*2.2));R2(104,147+bob,3,3,'#f4f4f0');P2(103,147+bob,'#f4f4f0');P2(107,148+bob,'#e8a030');P2(105,147+bob,'#1a1410');R2(104,150+bob,1,1,'#e8a030')}}
   letterbox(ease((t-.2)/1))}},
 {name:'Begin',d:4,f:t=>{R2(0,0,W,H,'#000');g2.globalAlpha=ease((t-.4)/1.2);text('LITTLE HARBOR',88,80,16,'#ffe9a8');g2.globalAlpha=1}}];
// ---- playing it ----
function frame(now){if(!cv)return;const dt=Math.min(.05,(now-last)/1000);last=now;lt+=dt;stepParts(dt);
  if(lt>SC[cur].d){if(cur<SC.length-1){cur++;lt=0;parts=[]}else return stop(true)}
  g2.clearRect(0,0,W,H);SC[cur].f(lt,dt,firsts[cur]);drawParts();
  const fin=1-ease(lt/.5),fout=ease((lt-(SC[cur].d-.5))/.5),a=Math.max(fin,fout);if(a>0){g2.globalAlpha=a;R2(0,0,W,H,'#000');g2.globalAlpha=1}
  raf=requestAnimationFrame(frame)}
function play(done){cv=$('ofilm');g2=cv.getContext('2d');g2.imageSmoothingEnabled=false;cast();cur=0;lt=0;parts=[];firsts=SC.map(()=>({}));onEnd=done;cv.classList.add('on');last=performance.now();raf=requestAnimationFrame(frame)}
function stop(finished){cancelAnimationFrame(raf);if(cv)cv.classList.remove('on');cv=null;parts=[];const f=onEnd;onEnd=null;if(f&&finished)f()}
return{play,stop,SC,playing:()=>!!cv,at:(i,t)=>{cur=i;lt=t},drawAt:(i,t)=>{const c=$('ofilm');g2=c.getContext('2d');cast();parts=[];firsts=SC.map(()=>({}));g2.clearRect(0,0,W,H);SC[i].f(t,0,{});drawParts()}}})();
// the scene step that plays it: {film:'intro'} waits until it ends (or the scene is skipped)
SCSTEP.film=(id,c)=>{if(c.fast)return c.go();INTRO.play(()=>c.go());c.hold(()=>INTRO.stop(false))};
