// ---------- the character screen: how you look, how you are doing, what you carry on you, and the Save button ----------
// Opens from the "Me" button next to Bag. Save opens the same save choices as the ☰ menu (a file, a save code or one of three slots). The game also still saves by itself.
function chPortrait(){const cv=$('ch-pt'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);
  c.fillStyle='#8ec0e8';c.fillRect(0,0,cv.width,cv.height);const s=shadePerson({...lo({...S.look}),view:'f',frame:0});c.drawImage(s,0,0,24,24,0,0,cv.width,cv.height)}
function openCharacter(){chPortrait();
  const L=S.look||{},eq=SLOTS.filter(([sl])=>S.eq[sl]).map(([sl,n])=>n+': '+ITEMS[S.eq[sl]].n);
  const boat=S.eq.boat&&ITEMS[S.eq.boat]?ITEMS[S.eq.boat].n:'None';
  const rows=[['Day',S.day],['Gold',S.gold.toLocaleString()+'g'],['Health',Math.ceil(S.hp)+' / '+maxHp()],['Stamina',Math.ceil(S.sta)+' / '+maxSta()],['Boat',boat]];
  $('ch-info').innerHTML=rows.map(r=>'<div><span>'+r[0]+'</span><b>'+r[1]+'</b></div>').join('');
  const top=SKILLS.map(k=>({n:k.n,l:lvl(k.id)})).filter(k=>k.l>0).sort((a,b)=>b.l-a.l).slice(0,3);
  $('ch-more').innerHTML='<h4>Carrying</h4><p>'+(eq.length?eq.join('<br>'):'Nothing in your hands yet.')+'</p><h4>Best skills</h4><p>'+(top.length?top.map(k=>k.n+' '+k.l).join(', '):'None yet. Go and try things!')+'</p>';
  $('ch').classList.add('open')}
const closeCharacter=()=>$('ch').classList.remove('open');
$('chbtn').onclick=openCharacter;$('ch-back').onclick=closeCharacter;
$('ch-save').onclick=()=>{closeCharacter();tmOpen('pause');tmView('save')};
addEventListener('keydown',e=>{if($('ch').classList.contains('open')&&['escape','backspace','x'].includes(e.key.toLowerCase())){e.preventDefault();closeCharacter()}});
