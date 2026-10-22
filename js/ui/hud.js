// ---------- HUD: message line, toast, HP and STA bars, status line ----------
function toast(t,ms=1600){const e=$('toast');e.textContent=t;e.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.opacity=0,ms)}
const say=t=>$('msg').textContent=t;
function bar(f,n,v,m,c){const q=Math.max(0,v/m);$(f).style.width=(q*100)+'%';$(f).style.background=q>.5?c[0]:q>.2?c[1]:c[2];$(n).textContent=Math.ceil(v)+'/'+m}
function ui(){S.hp=Math.min(S.hp,maxHp());S.sta=Math.min(S.sta,maxSta());$('day').textContent=S.day;$('gold').textContent=S.gold;$('inv').textContent=fishCount();$('sleep').style.visibility=(sail||atTent()||inRoom(P.x,P.y)||inInn()||atBed()||(shipRoomOf(P.x,P.y)||{}).kind==='quarters')?'visible':'hidden';$('deck').style.visibility=(sail&&shipLevel()>=0)?'visible':'hidden';
  bar('hpf','hpn',S.hp,maxHp(),['#58d058','#f8d030','#e84828']);if(S.poison>0)$('hpn').textContent+=' PSN';bar('staf','stan',S.sta,maxSta(),['#48a8f0','#f8a830','#e84828']);
  if(S.buff&&S.buff<=Date.now())S.buff=0;const st=[];if(S.buff)st.push('Swift '+Math.ceil((S.buff-Date.now())/1000)+'s');if(S.coat>0)st.push('Poison coat x'+S.coat);
  $('status').textContent=st.join('   ');$('status').style.display=st.length?'block':'none'}
function flashHit(){const w=$('wrap');w.style.boxShadow='inset 0 0 0 5px #d83828';setTimeout(()=>w.style.boxShadow='',180)}

// what a potion or meal gave (playtest #4): a small card at the top with the health and stamina bars filling from where they were to where they are now, and the amount gained. Works on the map and in a battle.
function showGain(h0,s0){const rows=[['HP',h0,S.hp,maxHp(),'#58d058'],['STA',s0,S.sta,maxSta(),'#48a8f0']].filter(r=>r[2]>r[1]);if(!rows.length)return;
  const old=$('gain');if(old)old.remove();clearTimeout(showGain.t);
  const c=document.createElement('div');c.id='gain';
  rows.forEach(([l,a,b,m,col])=>{const r=document.createElement('div');r.className='gr';
    r.innerHTML='<span class="gl">'+l+'</span><span class="gb"><i class="old" style="width:'+Math.round(100*a/m)+'%;background:#d0d0d0"></i><i class="new" style="width:'+Math.round(100*a/m)+'%;background:'+col+'"></i></span><span class="gn">+'+Math.round(b-a)+'</span>';c.appendChild(r)});
  document.body.appendChild(c);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{c.querySelectorAll('.new').forEach((el,i)=>{el.style.width=Math.round(100*rows[i][2]/rows[i][3])+'%'})}));
  showGain.t=setTimeout(()=>{c.style.opacity=0;setTimeout(()=>c.remove(),600)},2600)}
