// ---------- HUD: message line, toast, HP and STA bars, status line ----------
function toast(t,ms=1600){const e=$('toast');e.textContent=t;e.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.opacity=0,ms)}
const say=t=>$('msg').textContent=t;
function bar(f,n,v,m,c){const q=Math.max(0,v/m);$(f).style.width=(q*100)+'%';$(f).style.background=q>.5?c[0]:q>.2?c[1]:c[2];$(n).textContent=Math.ceil(v)+'/'+m}
function ui(){S.hp=Math.min(S.hp,maxHp());S.sta=Math.min(S.sta,maxSta());$('day').textContent=S.day;$('gold').textContent=S.gold;$('inv').textContent=fishCount();$('sleep').style.visibility=(sail||inRoom(P.x,P.y))?'visible':'hidden';
  bar('hpf','hpn',S.hp,maxHp(),['#58d058','#f8d030','#e84828']);bar('staf','stan',S.sta,maxSta(),['#48a8f0','#f8a830','#e84828']);
  if(S.buff&&S.buff<=Date.now())S.buff=0;const st=[];if(S.buff)st.push('Swift '+Math.ceil((S.buff-Date.now())/1000)+'s');if(S.coat>0)st.push('Poison coat x'+S.coat);
  $('status').textContent=st.join('   ');$('status').style.display=st.length?'block':'none'}
function flashHit(){const w=$('wrap');w.style.boxShadow='inset 0 0 0 5px #d83828';setTimeout(()=>w.style.boxShadow='',180)}
