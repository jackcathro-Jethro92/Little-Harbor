// ---------- the Character screen (playtest #5): your info, your equipment and your skills in one place, with three tabs along the top ----------
// The Character button (the C key) opens it on Info; the Bag's Equipment button and the E key open it on Equipment; the K key opens it on Skills. Each tab is one of the older screens (#ch, #eqs, #skills),
// so everything inside them works as before: this file only adds the tab bar, gives them one title and makes sure just one of them is open at a time.
const CHAR_TABS=[['info','Info','ch'],['equip','Equipment','eqs'],['skills','Skills','skills']];
let charTab='info';
CHAR_TABS.forEach(([,,el])=>{const box=$(el),title=box.firstElementChild,bar=document.createElement('div');bar.className='chtabs';
  CHAR_TABS.forEach(([t,n])=>{const b=document.createElement('button');b.textContent=n;b.dataset.tab=t;b.onclick=()=>openCharTab(t);bar.appendChild(b)});
  title.textContent='CHARACTER';title.after(bar)});
const _openInfo=openCharacter,_openEquip=openEquip,_openSkills=openSkills;
function openCharTab(t){if(BATTLE||SCENE)return;charTab=t;CHAR_TABS.forEach(([,,el])=>$(el).classList.remove('open'));['bag','qs'].forEach(i=>$(i).classList.remove('open'));
  if(t==='equip')_openEquip();else if(t==='skills')_openSkills();else _openInfo();
  document.querySelectorAll('.chtabs button').forEach(b=>b.classList.toggle('sel',b.dataset.tab===t))}
openCharacter=()=>openCharTab('info');openEquip=()=>openCharTab('equip');openSkills=()=>openCharTab('skills');
$('chbtn').onclick=()=>openCharTab('info');$('ch-eq').style.display='none';   // (the Equipment button on Info is now a tab)
$('beq').onclick=()=>{closeBag();openCharTab('equip')};
// Left and Right (or A and D) move between the tabs while the screen is open
addEventListener('keydown',e=>{const k=e.key.toLowerCase(),open=CHAR_TABS.findIndex(([,,el])=>$(el).classList.contains('open'));if(open<0)return;
  if(['arrowleft','arrowright','tab'].includes(k)&&!(open===1&&eqPick)){e.preventDefault();const n=(open+(k==='arrowleft'?CHAR_TABS.length-1:1))%CHAR_TABS.length;openCharTab(CHAR_TABS[n][0])}});
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='c'&&!document.querySelector('.open')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!dlgActive())openCharTab('info')});
