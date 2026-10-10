// ---------- the title menu: continue, new game, and saving or loading a game to a file, a code or one of three slots (roadmap step 2.1b) ----------
// The game saves by itself in the browser (KEY in js/save.js). This screen lets players keep a safe copy: Save to a file (download), a Save code (text to copy and paste) and three Slots kept in the
// browser. Loading checks that it is really a Little Harbor save (and not from a newer game), keeps a backup of the game it replaces, and then reloads the page so the whole world is rebuilt from the
// loaded save. It opens when the game starts (not after a load or a new game, so you go straight in) and from the ☰ button or Escape during play. No reminders to save.
const SLOT_N=3,SLOTK=n=>KEY+'-slot-'+n,STARTED='lh-started';
const hasGame=()=>{try{return !!S.seen&&!!localStorage.getItem(KEY)}catch(e){return false}};
const slotInfo=n=>{try{const o=JSON.parse(localStorage.getItem(SLOTK(n))||'null');return o&&o.data?o:null}catch(e){return null}};
let tmMode='title';
function saveText(){save();return localStorage.getItem(KEY)||JSON.stringify(S)}
function saveFileObj(){return{game:'little-harbor',format:1,saved:new Date().toISOString(),day:S.day,data:JSON.parse(saveText())}}
const saveCode=()=>'LH1:'+btoa(unescape(encodeURIComponent(JSON.stringify(saveFileObj()))));
// turns a file's or code's text into a save, or throws a friendly sentence
function parseSave(text){text=(text||'').trim();if(!text)throw 'There is nothing to load.';
  try{if(text.startsWith('LH1:'))text=decodeURIComponent(escape(atob(text.slice(4).replace(/\s+/g,''))))}catch(e){throw 'That code is damaged. Copy it again, all of it.'}
  let o;try{o=JSON.parse(text)}catch(e){throw 'That is not a Little Harbor save.'}
  const d=o&&o.game==='little-harbor'?o.data:o;
  if(!d||typeof d!=='object'||!d.look||typeof d.look!=='object'||!Number.isFinite(d.day)||d.day<1)throw 'That is not a Little Harbor save.';
  if(d.v!==undefined&&d.v>SAVE_V)throw 'That save is from a newer version of the game. Update the game first.';
  return d}
function installSave(d){try{const cur=localStorage.getItem(KEY);if(cur)localStorage.setItem(KEY+'-backup-before-load',cur);localStorage.setItem(KEY,JSON.stringify(d));sessionStorage.setItem(STARTED,'1')}catch(e){return tmNote('Could not store the save on this device.')}location.reload()}
function newGame(){try{const cur=localStorage.getItem(KEY);if(cur)localStorage.setItem(KEY+'-backup-new-game',cur);localStorage.removeItem(KEY);sessionStorage.setItem(STARTED,'1')}catch(e){}location.reload()}
function download(name,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function copyText(text,ta){const done=()=>tmNote('Copied. Paste it somewhere safe.');
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,()=>{ta.select();document.execCommand&&document.execCommand('copy');done()});else{ta.select();try{document.execCommand('copy')}catch(e){}done()}}
// ----- the screen -----
const tmEl=()=>$('title'),tmBody=()=>$('title-body');
function tmNote(t){const n=$('title-note');if(n)n.textContent=t||''}
function tmButton(label,fn,dis){const b=document.createElement('button');b.className='tm';b.textContent=label;b.disabled=!!dis;b.onclick=fn;tmBody().appendChild(b);return b}
function tmText(t,cls){const p=document.createElement('div');p.className=cls||'tmt';p.textContent=t;tmBody().appendChild(p);return p}
function tmView(v){const body=tmBody();body.innerHTML='';tmNote('');
  const title=$('title-h');title.textContent=v==='main'?'Little Harbor':v==='save'?'Save game':v==='load'?'Load game':v==='code'?'Save code':v==='paste'?'Paste a save code':'New game';
  if(v==='main'){
    if(tmMode==='title')tmButton('Continue',tmResume,!hasGame());else tmButton('Resume',tmResume);
    tmButton('New game',()=>hasGame()?tmView('new'):tmStartFresh());
    tmButton('Save game',()=>tmView('save'),!hasGame());
    tmButton('Load game',()=>tmView('load'));
    tmText(hasGame()?'Day '+S.day+'  ·  '+S.gold+' gold':'No saved game on this device yet.')}
  else if(v==='new'){tmText('Start a new game? Your current game is kept as a backup first, but you will not see it in the menu.');tmButton('Yes, start a new game',newGame);tmButton('No, go back',()=>tmView('main'))}
  else if(v==='save'){
    tmButton('Save to a file',()=>{download('little-harbor-day'+S.day+'.json',JSON.stringify(saveFileObj()));tmNote('Your save was downloaded. Keep the file safe.')});
    tmButton('Show a save code',()=>tmView('code'));
    tmText('Slots (kept in this browser)','tmh');
    for(let n=1;n<=SLOT_N;n++){const i=slotInfo(n);tmButton('Slot '+n+(i?'  ·  Day '+i.day+', '+i.gold+' gold':'  ·  empty')+'  ·  Save here',()=>{try{localStorage.setItem(SLOTK(n),JSON.stringify({saved:new Date().toISOString(),day:S.day,gold:S.gold,data:saveText()}));tmView('save');tmNote('Saved to slot '+n+'.')}catch(e){tmNote('Could not save to the slot.')}})}
    tmButton('Back',()=>tmView('main'))}
  else if(v==='code'){tmText('Copy this whole code and keep it somewhere safe (a note or a message to yourself). Paste it into "Load game" to carry on.');
    const ta=document.createElement('textarea');ta.readOnly=true;ta.value=saveCode();ta.className='tmta';body.appendChild(ta);ta.onfocus=()=>ta.select();
    tmButton('Copy the code',()=>copyText(ta.value,ta));tmButton('Back',()=>tmView('save'))}
  else if(v==='load'){
    const fi=document.createElement('input');fi.type='file';fi.accept='.json,.txt,application/json,text/plain';fi.style.display='none';fi.onchange=()=>{const f=fi.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{tmConfirmLoad(parseSave(r.result))}catch(e){tmNote(String(e))}};r.onerror=()=>tmNote('Could not read that file.');r.readAsText(f)};body.appendChild(fi);
    tmButton('Load from a file',()=>fi.click());tmButton('Paste a save code',()=>tmView('paste'));
    tmText('Slots (kept in this browser)','tmh');
    for(let n=1;n<=SLOT_N;n++){const i=slotInfo(n);tmButton('Slot '+n+(i?'  ·  Day '+i.day+', '+i.gold+' gold':'  ·  empty')+(i?'  ·  Load':''),()=>{try{tmConfirmLoad(parseSave(i.data))}catch(e){tmNote(String(e))}},!i)}
    tmButton('Back',()=>tmView('main'))}
  else if(v==='paste'){tmText('Paste the whole save code here.');const ta=document.createElement('textarea');ta.className='tmta';body.appendChild(ta);
    tmButton('Load this code',()=>{try{tmConfirmLoad(parseSave(ta.value))}catch(e){tmNote(String(e))}});tmButton('Back',()=>tmView('load'))}}
function tmConfirmLoad(d){if(!hasGame())return installSave(d);const body=tmBody();body.innerHTML='';$('title-h').textContent='Load this game?';tmNote('');
  tmText('Day '+d.day+(Number.isFinite(d.gold)?', '+d.gold+' gold':'')+'. It will replace your current game (which is kept as a backup first).');
  tmButton('Yes, load it',()=>installSave(d));tmButton('No, go back',()=>tmView('load'))}
function tmOpen(mode){tmMode=mode;mode==='title'?cinemaStart():cinemaStop();cancel&&cancel();holdAllStop();tmView('main');tmEl().classList.add('open')}
function tmClose(){cinemaStop();tmEl().classList.remove('open')}
function tmStartFresh(){tmClose();sessionStorage.setItem(STARTED,'1');enterGame()}
function tmResume(){tmClose();sessionStorage.setItem(STARTED,'1');if(tmMode==='title')enterGame()}
const holdAllStop=()=>{try{releaseAll()}catch(e){}};
function enterGame(){if(!S.seen)openLook();else say('Welcome back. Day '+S.day+'. Version '+BUILD+'.')}
// the menu button and the Escape key
$('menubtn').addEventListener('click',()=>{if(document.querySelector('.open'))return;tmOpen('pause')});
addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(tmEl().classList.contains('open')){if(tmMode==='pause')tmResume();return}if(document.querySelector('.open'))return;tmOpen('pause')});
// start of the game: show the title menu once per visit (a reload after loading or starting a new game goes straight in)
function showTitleOrStart(){let started=false;try{started=!!sessionStorage.getItem(STARTED)}catch(e){}if(started)enterGame();else tmOpen('title')}
