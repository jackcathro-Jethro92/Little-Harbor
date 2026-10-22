// ---------- the raid on the village (Quest 7): burning roofs, smoke and cannon fire, drawn above the people ----------
// RAID_ON is switched by the `village_raid` row of VARIANTS (flag village_attack, js/story/quest7.js). The four pirate ships offshore are ordinary `ship` entries of BL (tile 101 under them blocks boats) drawn by pirateShip
// (js/render/camp.js). Drawing only: nothing here blocks anyone. Some houses burn (a few flame tongues on the roof and a column of smoke), and every few seconds each ship fires: a flash at its side, a dark ball flying in an arc
// to a spot on the island, and a burst where it lands. The timing comes from the clock, so nothing is stored.
let RAID_ON=false;
const RAID_BURN=[1,3,4,7,2,5,8],RAID_SHOTS=[[0,150,108],[1,170,112],[2,150,121],[3,162,119],[0,153,114],[1,164,107],[2,146,116],[3,158,123]];   // houses that burn (index among the village houses; the first four are the original ones, and playtest #4 added three more beside the main road); [ship, target tile x, y] for each volley
const raidHouses=()=>BL.filter(b=>b.roof&&!b.sign&&!b.ship&&b.x>=140&&b.x<=176&&b.y>=99&&b.y<=125);
function raidFlames(x,y,w,t,seed){for(let i=0;i<5;i++){const fx=x+4+i*(w-8)/4,ph=t/95+seed*3+i*1.9,h=9+Math.sin(ph)*3+Math.sin(ph*1.7)*2;
    g.fillStyle='#c8321a';g.beginPath();g.moveTo(fx-4,y);g.lineTo(fx,y-h);g.lineTo(fx+4,y);g.fill();
    g.fillStyle='#f2a22e';g.beginPath();g.moveTo(fx-2.5,y);g.lineTo(fx,y-h*.7);g.lineTo(fx+2.5,y);g.fill();
    g.fillStyle='#ffe27a';g.fillRect(fx-1,y-h*.35,2,h*.35)}}
function raidSmoke(x,y,t,seed){for(let k=0;k<14;k++){const a=((t/80+seed*17+k*5)%70)/70,px=x+Math.sin(a*5+k)*4+a*20,py=y-4-a*76,r=3+a*11;   // thick black smoke (playtest #4: more of it, and darker)
    g.fillStyle='rgba(16,14,18,'+(.75*(1-a)).toFixed(2)+')';g.beginPath();g.arc(px,py,r,0,7);g.fill()}}
// the shops are shut: two planks nailed across each shop's door and a small CLOSED board hanging from them
function raidBoards(b,cx,cy){const x=(b.x+1)*T-cx,y=(b.y+1)*T-cy;if(x<-20||x>VW+20||y<-20||y>VH+20)return;const O='#2a1a0c';
  g.fillStyle=O;g.fillRect(x-1,y+2,18,4);g.fillRect(x-1,y+9,18,4);g.fillStyle='#a8743f';g.fillRect(x,y+3,16,2);g.fillRect(x,y+10,16,2);g.fillStyle='#d8b27a';g.fillRect(x,y+3,16,1);g.fillRect(x,y+10,16,1);
  g.fillStyle=O;g.fillRect(x+3,y+5,10,5);g.fillStyle='#f0e6c8';g.fillRect(x+4,y+6,8,3);g.fillStyle='#c8321a';g.fillRect(x+5,y+7,6,1)}
function drawRaid(cx,cy,t){const hs=raidHouses();BL.forEach(b=>{if(b.sign&&b.x>=140&&b.x<=176&&b.y>=99&&b.y<=125)raidBoards(b,cx,cy)});
  RAID_BURN.forEach((k,i)=>{const b=hs[k%Math.max(1,hs.length)];if(!b)return;const x=b.x*T-cx,y=b.y*T-cy;if(x<-60||x>VW+20||y<-70||y>VH+30)return;
    raidSmoke(x+24,y-10,t,i);raidFlames(x+2,y-4,44,t,i);raidFlames(x+6,y+14,36,t,i+7)});
  const ships=BL.filter(b=>b.raid);
  RAID_SHOTS.forEach(([si,tx,ty],n)=>{const sh=ships[si];if(!sh)return;const per=7600,ph=((t+n*1900)%per)/per;if(ph>.3)return;
    const sx=sh.x*T+24-cx,sy=sh.y*T+30-cy,ex=tx*T+8-cx,ey=ty*T+4-cy;
    if(ph<.04){g.fillStyle='#fff2b0';g.beginPath();g.arc(sx,sy,6-ph*60,0,7);g.fill();g.fillStyle='rgba(220,220,220,.7)';g.beginPath();g.arc(sx+(ex>sx?8:-8),sy-3,5+ph*80,0,7);g.fill()}
    else if(ph<.18){const k=(ph-.04)/.14,bx=sx+(ex-sx)*k,by=sy+(ey-sy)*k-Math.sin(k*Math.PI)*34;g.fillStyle='#1a1a1e';g.beginPath();g.arc(bx,by,2.2,0,7);g.fill();g.fillStyle='rgba(255,255,255,.4)';g.fillRect(bx-1,by-1,1,1)}
    else{const k=(ph-.18)/.12;if(k<1){g.fillStyle='rgba(255,170,60,'+(1-k).toFixed(2)+')';g.beginPath();g.arc(ex,ey,5+k*13,0,7);g.fill();g.fillStyle='rgba(255,240,170,'+(1-k).toFixed(2)+')';g.beginPath();g.arc(ex,ey,2+k*6,0,7);g.fill();
      g.fillStyle='rgba(70,60,50,'+(.8*(1-k)).toFixed(2)+')';for(let d=0;d<6;d++){const a=d*1.05+n;g.fillRect(ex+Math.cos(a)*k*18,ey+Math.sin(a)*k*14-k*8,2,2)}}}})}

// the Temple Tower after the raid (flag tower_raided, Quest 8): smoke rising from the pagoda and a few small fires in the courtyard
function drawTowerRaid(cx,cy,t){const px=212*T-cx,py=200*T-cy;if(px<-120||px>VW+120||py<-120||py>VH+80)return;
  [[-34,10],[34,18],[0,-6]].forEach(([dx,dy],i)=>raidSmoke(px+8+dx,py+dy,t,i+3));
  [[-60,40],[52,46],[-20,66]].forEach(([dx,dy],i)=>raidFlames(px+8+dx,py+dy,20,t,i+5))}

// the burnt village (flag village_burnt, set when the last pirate has fled in Quest 7): the houses that burned are blackened ruins with broken rafters, ash and a few dying embers (playtest #4)
function raidRuin(b,cx,cy,t,i){const x=b.x*T-cx,y=b.y*T-cy;if(x<-60||x>VW+20||y<-40||y>VH+30)return;const W=b.w*T,O='#120e0c';
  g.fillStyle=O;g.fillRect(x,y,W,T*2);for(let k=0;k<W;k+=3){const h=((k*13+i*7+(k>>2)*5)%11)-2;if(h>0)g.fillRect(x+k,y-h,2+(k%2),h)}   // broken rafters along the top
  g.fillStyle='#2a2220';g.fillRect(x+2,y+3,W-4,T*2-5);g.fillStyle='#3e322a';for(let k=3;k<W-8;k+=11){g.fillRect(x+k,y+4+((k+i)%3)*3,8,2);g.fillRect(x+k+3,y+14+((k+i)%4)*2,2,7)}   // fallen beams
  g.fillStyle='#6a625c';g.fillRect(x+4,y+T*2-6,10,3);g.fillRect(x+W-16,y+T*2-8,9,4);g.fillRect(x+20,y+T*2-5,8,2);   // ash
  const f=((t/260+i*3)|0)%4;g.fillStyle=f<2?'#e8632e':'#a8321a';g.fillRect(x+9,y+T*2-9,2,2);g.fillRect(x+W-22,y+T*2-7,2,2);   // embers
  for(let k=0;k<3;k++){const a=((t/160+i*13+k*22)%66)/66;g.fillStyle='rgba(110,106,108,'+(.35*(1-a)).toFixed(2)+')';g.beginPath();g.arc(x+W/2+Math.sin(a*4+k)*3,y-4-a*26,2+a*4,0,7);g.fill()}}
function drawRuins(cx,cy,t){const hs=raidHouses();RAID_BURN.forEach((k,i)=>{const b=hs[k%Math.max(1,hs.length)];if(b)raidRuin(b,cx,cy,t,i)})}
