// ---------- skills screen ----------
function openSkills(){const el=$('sk-list');el.innerHTML='';
  SKILLS.forEach(k=>{const x=S.xp[k.id]||0,l=lvl(k.id),lo=l?LV[l-1]:0,hi=l<10?LV[l]:LV[9],p=l>=10?1:(x-lo)/(hi-lo),d=document.createElement('div');
    d.className='sk';d.style.setProperty('--c',k.c);
    let pips='';for(let i=1;i<=10;i++)pips+='<span class="pip'+(i%5===0?' big':'')+(i<=l?' on':'')+'"></span>';
    d.innerHTML='<h3><span>'+k.n+' '+l+'</span><span class="pips">'+pips+'</span></h3><div class="xpbar"><i style="width:'+Math.round(p*100)+'%"></i></div><p>'+(l>=10?'MAX LEVEL':Math.floor(x)+' / '+hi+' XP')+'</p><p>'+k.perk(l)+'</p>';
    el.appendChild(d)});
  $('skills').classList.add('open')}
const closeSkills=()=>$('skills').classList.remove('open');
$('skbtn').onclick=openSkills;$('sk-back').onclick=closeSkills;
addEventListener('keydown',e=>{if($('skills').classList.contains('open')&&['escape','backspace','x'].includes(e.key.toLowerCase())){e.preventDefault();closeSkills()}});
