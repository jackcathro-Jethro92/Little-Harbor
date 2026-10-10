// ---------- the quest log (roadmap step 2.8): opens from the Quests button on the character screen ----------
// QUESTS is the table the log reads: {id, name, steps:['what to do at step 0', 'what to do at step 1', ...]}. The quest files add their rows; there are no real quests yet.
// S.story.q and S.story.step say which one is current and where (questSet / questStep in js/systems/flags.js); questDone(id) moves it to Finished.
const QUESTS=[];
function openQuests(){const s=storyState(),el=$('qs-list'),cur=QUESTS.find(q=>q.id===s.q),fin=s.done.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean);let h='';
  h+='<h4>CURRENT</h4>'+(cur?'<div class="q"><b>'+cur.name+'</b><span>'+(cur.steps[s.step]||cur.steps[cur.steps.length-1]||'')+'</span></div>':'<div class="q"><span>No quest right now. Explore, and talk to people.</span></div>');
  if(fin.length)h+='<h4>FINISHED</h4>'+fin.map(q=>'<div class="q done"><b>'+q.name+'</b></div>').join('');
  el.innerHTML=h;$('qs').classList.add('open')}
const closeQuests=()=>$('qs').classList.remove('open');
$('ch-quests').onclick=openQuests;$('qs-back').onclick=closeQuests;
addEventListener('keydown',e=>{if($('qs').classList.contains('open')&&['escape','backspace','x'].includes(e.key.toLowerCase())){e.preventDefault();e.stopImmediatePropagation();closeQuests()}},true);
