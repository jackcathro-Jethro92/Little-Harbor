// ---------- the storm over the Temple of the Sea (Quest 9): rain, a dark sky and lightning, drawn over everything outdoors ----------
// STORM_ON is switched by the `storm` row of VARIANTS (flag storm_on, js/story/quest9.js), which also moors the pirate ships round the island. Drawing only: slanting rain streaks that scroll with the clock, a cold dark tint,
// and every nine seconds a flash of lightning (two quick flashes and a jagged bolt). Nothing is saved and nothing blocks anyone.
let STORM_ON=false;
function drawStorm(cx,cy,t){g.fillStyle='rgba(8,14,32,.36)';g.fillRect(0,0,VW,VH);
  g.fillStyle='rgba(190,212,245,.5)';for(let k=0;k<70;k++){const x=((k*37+t*.12)%(VW+20))-10,y=(k*53+t*.75)%VH;g.fillRect(x|0,y|0,1,5);g.fillRect((x-1)|0,(y+4)|0,1,2)}
  g.fillStyle='rgba(150,180,225,.35)';for(let k=0;k<40;k++){const x=((k*71+t*.18+17)%(VW+30))-15,y=(k*29+t*1.05)%VH;g.fillRect(x|0,y|0,1,7)}
  const c=t%9000,seed=(t/9000)|0;
  if(c<160||(c>300&&c<380)){g.fillStyle='rgba(235,242,255,'+(c<160?.5:.32)+')';g.fillRect(0,0,VW,VH);
    if(c<160){g.strokeStyle='rgba(255,255,255,.95)';g.lineWidth=2;g.beginPath();let x=30+((seed*47)%110),y=0;g.moveTo(x,y);for(let i=0;i<7;i++){x+=((seed*13+i*29)%23)-11;y+=24+(i%3)*5;g.lineTo(x,y)}g.stroke()}}}
