// ---------- tavern jobs (JOBS in js/data/taverns.js): taken from a tavern's notice board, done in the world, paid by the person who asked or at the board ----------
// S.jobs[id] is 'taken' or 'done' (saved). A delivery job (need, to) is handed in by talking to that person with everything in your bag; the others (enc, find) are paid at the board once their encounter is
// beaten and the item found. The board itself is a cork board of parchment notes, each pinned with a knife (#jobboard); tapping a note opens it full size with Accept or Hand in.
// The three encounters the jobs use are below: rock dragons round Halvard's axe on the rock slide north of the Mountain Town, two centipede nests in the Darkwood's northern corners (with a swarm of young
// centipedes round them that comes back fast until both nests are gone), and the ten bandits of the camp in the south-west (js/world/bandits.js).
const JOB_SPOTS={};
{const rock=nearestTile(26,52,(a,b)=>at(a,b)===48&&!npcAt(a,b)),axe=rock||[26,52];JOB_SPOTS.axe=axe;
 const near=(x,y,ok)=>nearestTile(x,y,(a,b)=>ok(at(a,b))&&!npcAt(a,b)&&!(a===axe[0]&&b===axe[1]))||[x,y];
 const dr=[[3,-1],[-3,1],[1,3]].map(([dx,dy])=>near(axe[0]+dx,axe[1]+dy,t=>t===48||t===50));
 // the nests: on the forest floor in the Darkwood's two northern corners (the paths reach both; the southern corners sit behind the story's gates)
 const nests=[near(FZ.x0+4,FZ.y0+5,t=>t===40||t===42),near(FZ.x1-5,FZ.y0+5,t=>t===40||t===42)];JOB_SPOTS.nests=nests;
 const{x:bx,y:by}=BANDIT_CAMP,ring=[[0,-2],[-4,-1],[4,-1],[-5,2],[5,2],[-2,4],[2,4],[-7,0],[7,1],[0,6]];
 ENCOUNTERS.push(
  {id:'job_axe',name:'Rock dragons on the rock slide',mode:'realtime',start:'job_axe_on',foes:dr.map(at=>({type:'rock_dragon_q',at}))},
  {id:'job_nests',name:'The Darkwood centipede nests',mode:'realtime',start:'job_nests_on',foes:nests.map(at=>({type:'centipede_nest',at}))},
  {id:'job_bandits',name:'The bandit camp',mode:'battle',start:'job_bandits_on',spot:'bandit_spot',foes:ring.map(([dx,dy],i)=>({foe:i===0?'bandit_chief':i%3===0?'bandit_archer':'bandit',at:[bx+dx,by+dy]}))})}
DLG.bandit_spot={start:'a',nodes:{a:{who:'Bandit',text:'[Placeholder] Oi! This is our camp. Turn around!'},b:{who:'Bandit',text:'[Placeholder] Look, lads, a traveller with a full purse!'},c:{who:'Bandit',text:'[Placeholder] You picked the wrong camp to wander into.'}}};
DLG.job_lucie_thanks={start:'a',nodes:{a:{who:'Lucie',text:'[Placeholder] A hundred of each! You are a marvel. Take this amulet; it mends you as you go.'}}};
DLG.job_astrid_thanks={start:'a',nodes:{a:{who:'Astrid',text:'[Placeholder] Everything I asked for! Here is my special draught. Drink it and feel stronger for good.'}}};
DLG.job_wynn_thanks={start:'a',nodes:{a:{who:'Seamstress Wynn',text:'[Placeholder] Fifty pelts! My winter collection is saved. Here is your 5000 gold, every coin earned.'}}};
const JOB_THANKS={lucie_gold:'job_lucie_thanks',astrid_materials:'job_astrid_thanks',winter_collection:'job_wynn_thanks'};
const jobState=id=>(S.jobs||{})[id],jobRow=id=>JOBS.find(j=>j.id===id);
// how far along a job is: a list of [label, have, want] rows, and whether it is ready to hand in
function jobProgress(j){const rows=[];
  if(j.need)Object.entries(j.need).forEach(([id,n])=>rows.push([ITEMS[id].n,Math.min(n,count(id)),n]));
  if(j.find)rows.push([ITEMS[j.find].n+' found',count(j.find)?1:0,1]);
  if(j.enc){const e=encRow(j.enc),n=e.foes.length,done=flag('enc_'+j.enc+'_done');
    const left=done?0:e.mode==='realtime'?(jobState(j.id)==='taken'?ENEMIES.filter(q=>q.group===e.id&&q.alive).length:n):n-encDown(e.id).length;
    rows.push([{job_axe:'Rock dragons beaten',job_nests:'Nests destroyed',job_bandits:'Bandits beaten'}[j.enc]||'Foes beaten',n-left,n])}
  return{rows,ready:rows.every(([,h,w])=>h>=w)}}
const rewardText=r=>[r.gold?r.gold.toLocaleString()+' gold':'',r.item?ITEMS[r.item].n:''].filter(Boolean).join(' and ');
function jobReward(j){const r=j.reward||{};if(r.gold)S.gold+=r.gold;if(r.item)S.bag[r.item]=(S.bag[r.item]||0)+1;S.jobs[j.id]='done';
  toast('Job done: '+j.title+'!',2800);say('You earned '+rewardText(r)+'.');ui();save()}
function acceptJob(j){S.jobs=S.jobs||{};if(jobState(j.id))return;S.jobs[j.id]='taken';if(j.enc)startEncounter(j.enc);jobsTick();toast('Job taken: '+j.title,2400);save()}
// handing in at the board: the encounter jobs (the item you found goes back to its owner)
function handInJob(j){if(jobState(j.id)!=='taken'||j.to||!jobProgress(j).ready)return false;if(j.find){S.bag[j.find]--;if(S.bag[j.find]<=0)delete S.bag[j.find]}jobReward(j);return true}
// talking to the person a delivery job is for: with everything in your bag they take it and pay you (otherwise they remind you what is still missing, and talk as usual)
function jobTalk(n){const j=JOBS.find(q=>q.to===n.n&&jobState(q.id)==='taken');if(!j)return false;const pr=jobProgress(j);
  if(!pr.ready){say(j.title+': '+pr.rows.filter(([,h,w])=>h<w).map(([l,h,w])=>l+' '+h+'/'+w).join(', '));return false}
  Object.entries(j.need).forEach(([id,k])=>{S.bag[id]-=k;if(S.bag[id]<=0)delete S.bag[id]});jobReward(j);const d=DLG[JOB_THANKS[j.id]];if(d)dlgSay(n.n,d.nodes[d.start].text);return true}
// Halvard's axe lies on the rock slide while the job is taken and it has not been picked up
const axeShown=()=>jobState('lost_axe')==='taken'&&!count('halvards_axe');
function jobPickup(x,y){if(sail||!axeShown()||x!==JOB_SPOTS.axe[0]||y!==JOB_SPOTS.axe[1])return false;S.bag.halvards_axe=1;toast("You found Halvard's axe!",2400);say('Now beat the rock dragons, then go back to the notice board.');ui();save();return true}
function jobDraw(E,cx,cy,t){if(!axeShown()||zoneOf(P.x,P.y)!==0)return;const[x,y]=JOB_SPOTS.axe;if(Math.abs(x-P.rx)>14||Math.abs(y-P.ry)>14)return;
  E.push({y:y-.4,f:()=>{const a=itemArt('halvards_axe');R(x*T-cx+3,y*T-cy+12,10,2,'rgba(0,0,0,.25)');if(a)g.drawImage(a,x*T-cx-2,y*T-cy-4+Math.round(Math.sin(t/300)),20,20);if((t/400|0)%3===0)R(x*T-cx+12,y*T-cy-2,2,2,'#fff8c0')}})}
// the swarm: while the nests job is taken and a nest still stands, young centipedes crowd round the nests and come back fast; when both nests are gone the swarm goes too
function jobsTick(){const on=jobState('centipede_nests')==='taken'&&!flag('enc_job_nests_done'),here=ENEMIES.some(e=>e.group==='job_swarm');
  if(on&&!here)JOB_SPOTS.nests.forEach(([x,y])=>[[2,0],[-2,1],[0,-2]].forEach(([dx,dy])=>{const s=nearestTile(x+dx,y+dy,(a,b)=>WK.includes(at(a,b))&&!npcAt(a,b)&&!enemyAt(a,b));if(s)spawnEnemy('centipede_swarm',s[0],s[1],{group:'job_swarm'})}));
  else if(!on&&here)dropEnemies('job_swarm')}
setInterval(jobsTick,2000);
// the Amulet of Healing (Lucie's job): a little health back every few seconds, out of battle
setInterval(()=>{const r=fx('regen');if(r>0&&!BATTLE&&S.hp>0&&S.hp<maxHp()){S.hp=Math.min(maxHp(),S.hp+r);ui()}},4000);

// ---------- the notice board screen: a cork board of parchment notes, each held by a knife ----------
const KNIFE_IMG=(()=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),r=(a,b,w,h,k)=>{x.fillStyle=k;x.fillRect(a,b,w,h)};
  // a hunting knife driven into the board at an angle: the wooden handle up at the right, a brass guard, and the steel blade going down-left into the paper
  for(let i=0;i<12;i++){r(6+i,25-i,3,2,'#2a2a30');r(7+i,25-i,2,1,i<2?'#9aa0a8':'#dfe4ea');r(7+i,26-i,1,1,'#8d939c')}
  for(let i=0;i<3;i++)r(16+i*1,11-i*1+3,4,4,'#2a1a0c');r(16,13,5,5,'#c8a050');r(17,14,3,3,'#e8c870');
  for(let i=0;i<7;i++){r(20+i,9-i,4,4,'#2a1a0c');r(21+i,10-i,2,2,i%2?'#7a4a26':'#9a6a3a')}r(27,2,3,3,'#c8a050');
  r(4,27,6,2,'rgba(0,0,0,.25)');return c.toDataURL()})();
let JB_AT=null,JB_SEL=null;
function openJobBoard(at){JB_AT=at;JB_SEL=null;jbRender();$('jobboard').classList.add('open')}
function closeJobBoard(){$('jobboard').classList.remove('open');JB_SEL=null}
function jbRender(){const list=JOBS.filter(j=>j.at===JB_AT||j.at==='any'),el=$('jb-notes'),dt=$('jb-paper');el.innerHTML='';
  $('jb-title').textContent=(SHOP_ROOMS.find(s=>s.id===JB_AT)||{}).name?'Notice board · '+SHOP_ROOMS.find(s=>s.id===JB_AT).name:'Notice board';
  if(!list.length){el.innerHTML='<p class="jb-none">The board is empty for now. Check back soon.</p>'}
  list.forEach((j,i)=>{const st=jobState(j.id),b=document.createElement('button');b.className='jb-note'+(st?' '+st:'');b.style.setProperty('--tilt',((i*37)%7-3)+'deg');
    b.innerHTML='<img class="jb-knife" alt="" src="'+KNIFE_IMG+'"><b>'+j.title+'</b><span>'+j.from+'</span><i>'+(st==='done'?'Done':st==='taken'?(jobProgress(j).ready?'Ready to hand in':'Taken'):rewardText(j.reward))+'</i>';
    b.onclick=()=>{JB_SEL=j.id;jbRender()};el.appendChild(b)});
  dt.classList.toggle('show',!!JB_SEL);el.style.display=JB_SEL?'none':'';
  if(JB_SEL){const j=jobRow(JB_SEL),st=jobState(j.id),pr=jobProgress(j);
    dt.innerHTML='<img class="jb-knife big" alt="" src="'+KNIFE_IMG+'"><h3>'+j.title+'</h3><p class="jb-from">From '+j.from+'</p><p>'+j.desc+'</p>'+
      (st==='taken'?'<ul>'+pr.rows.map(([l,h,w])=>'<li class="'+(h>=w?'ok':'')+'">'+l+': '+h+' / '+w+'</li>').join('')+'</ul>':'')+
      '<p class="jb-reward">Reward: '+rewardText(j.reward)+'</p>'+(st==='done'?'<p class="jb-stamp">DONE</p>':'')+
      (st==='taken'&&j.to?'<p class="jb-note2">Bring it all to '+j.to+'.</p>':st==='taken'&&!pr.ready?'<p class="jb-note2">Come back to this board when it is done.</p>':'')+'<div class="jb-btns"></div>';
    const bt=dt.querySelector('.jb-btns'),btn=(t,f)=>{const b=document.createElement('button');b.textContent=t;b.onclick=f;bt.appendChild(b)};
    if(!st)btn('Accept',()=>{acceptJob(j);jbRender()});
    if(st==='taken'&&!j.to&&pr.ready)btn('Hand in',()=>{handInJob(j);jbRender()});
    btn('Back',()=>{JB_SEL=null;jbRender()});const f=bt.querySelector('button');if(f)f.focus()}}
$('jb-close').onclick=closeJobBoard;
addEventListener('keydown',e=>{if(!$('jobboard').classList.contains('open'))return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(JB_SEL){JB_SEL=null;jbRender()}else closeJobBoard()}},true);
