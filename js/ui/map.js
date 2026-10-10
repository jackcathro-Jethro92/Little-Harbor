// ---------- map screen and exploration fog ----------
function reveal(){if(zoneOf(P.x,P.y))return;const r=9;for(let y=P.y-r;y<=P.y+r;y+=2)for(let x=P.x-r;x<=P.x+r;x+=2){if(x<0||y<0||x>=MW||y>=MH||(x-P.x)**2+(y-P.y)**2>r*r)continue;FOG[(y>>2)*FW+(x>>2)]=1}}
const TC={0:'#2f6fc4',1:'#78a34c',2:'#ead9a0',3:'#a9763f',4:'#3b6e2e',5:'#8a5a3a',6:'#c8934e',7:'#9a9b93',8:'#7a5230',9:'#5aaeb0',10:'#8d5c36',11:'#8a5a2e',12:'#8d8f87',13:'#7a7a86',14:'#7a5230',15:'#c97a3a',16:'#cfe3ef',17:'#c9a227',18:'#8d8f87',19:'#6fae4c',20:'#8aa05a',32:'#6e7078',54:'#6e7078',102:'#2b6444',103:'#d4cbb6',104:'#a9aba2',105:'#a4a69d',106:'#3e4a5e',107:'#5a3a24',108:'#cfc28a',117:'#9a9a92',118:'#9a9a92',119:'#2a2a30',120:'#6a5a48',121:'#a8a8a0',122:'#9a9a8c',56:'#8a8a82',64:'#d8cfb8',78:'#a8a8a0',82:'#34343c',94:'#e8e4da',97:'#f0ece2',83:'#1e1e26',84:'#e8641c',85:'#6a6a72',86:'#26242c',87:'#e8641c',79:'#b8b8ae',80:'#9a9a92',81:'#9a9a92',65:'#e0d8c0',66:'#b8322a',67:'#2a9ab0',57:'#c4c4b8',58:'#a89a88',55:'#6e7078',48:'#a08c78',49:'#5e4f45',50:'#b09b82',35:'#8a8b94',36:'#55555d'};
// TESTING: show the whole map regardless of exploration (set to false to bring the fog back; your explored areas are kept either way)
const TEST_SHOW_FULL_MAP=true;
function showMap(){const c=$('mc'),x=c.getContext('2d');c.width=MW*2;c.height=WH*2;x.fillStyle='#141b26';x.fillRect(0,0,c.width,c.height);
  for(let y=0;y<WH;y++)for(let xx=0;xx<MW;xx++){if(!TEST_SHOW_FULL_MAP&&!FOG[(y>>2)*FW+(xx>>2)])continue;const t=M[y*MW+xx];x.fillStyle=(zoneOf(xx,y)||(t>=21&&t<=23))?TC[0]:TC[t]||TC[1];x.fillRect(xx*2,y*2,2,2)}
  x.font='bold 11px sans-serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='#000';x.fillStyle='#fff';
  LAND.forEach(([n,lx,ly])=>{if(TEST_SHOW_FULL_MAP||FOG[(ly>>2)*FW+(lx>>2)]){x.strokeText(n,lx*2,ly*2);x.fillText(n,lx*2,ly*2)}});
  if(!zoneOf(P.x,P.y)){x.fillStyle='#e8403a';x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.arc(P.x*2,P.y*2,4,0,7);x.fill();x.stroke()}
  $('mapov').classList.add('open')}
$('map-h').textContent=TEST_SHOW_FULL_MAP?'TESTING: the whole map is shown. Your red dot is you.':'Only places you have sailed or walked near are shown.';
$('mapbtn').onclick=showMap;$('map-back').onclick=()=>$('mapov').classList.remove('open');
addEventListener('keydown',e=>{if($('mapov').classList.contains('open')&&['escape','backspace','x'].includes(e.key.toLowerCase())){e.preventDefault();$('mapov').classList.remove('open')}});
