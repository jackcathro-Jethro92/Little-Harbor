// ---------- the dialogue box (roadmap step 2.2): a FireRed-style text box at the bottom of the picture, with a speaker name, a portrait and choices ----------
// Text lives in the table DLG, keyed by id, never inside game logic: DLG.some_id = {start:'a', nodes:{a:{who:'Murl', text:'...', next:'b'}, b:{who, text, choices:[{t:'Yes', set:'flag_name', go:'c'}, {t:'No'}]}, ...}}.
// runDialogue(id, onEnd) plays one; dlgSay(who, text, onEnd) shows a single line (every villager's chat uses it, with their words unchanged). A node may name a `portrait` (a character name);
// otherwise the speaker's own portrait is used when they have one (the PORTRAITS list below: story and working characters). Tap the box, press Use, Space or Enter to go on; Up and Down
// then Enter choose. Text appears letter by letter (a tap shows it all at once). Existing lines stay word for word; new story lines are placeholders until Jack writes them.
const DLG={};
const PORTRAITS=['Murl','Bram','Odo','Garrick','Astrid','Lucie','Seamstress Wynn','Barber Fenwick','Guildmaster Brenna','Arena Master Dorn','Hale','Wren','Captain Redd','Warden Orrin','Gate Guard Bors','You'];
let dlgNodes=null,dlgNode=null,dlgDone=null,dlgTimer=null,dlgSel=0,dlgFull='';
const dlgActive=()=>$('dlg').classList.contains('open');
function portraitFor(who){const name=who==='You'||who===undefined?'You':who;if(!PORTRAITS.includes(name))return null;
  const npc=name==='You'?null:NPC.find(n=>n.n===name);const base=name==='You'?S.look:npc?{...npc,...(NL[npc.n]||{})}:null;if(!base)return null;
  return {look:lo(name==='You'?{...S.look}:base),bg:name==='You'?'#8ec0e8':['#e8c898','#a8d0a0','#e0a8b0','#b8b0e0','#e8d8a0'][(name.length+name.charCodeAt(0))%5]}}
function drawPortrait(pt){const cv=$('dlg-pt'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);if(!pt){cv.style.display='none';return}cv.style.display='block';
  c.fillStyle=pt.bg;c.fillRect(0,0,cv.width,cv.height);const s=shadePerson({...pt.look,view:'f',frame:0});c.drawImage(s,3,3,18,16,0,0,cv.width,cv.height-2);
  c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,cv.height-2,cv.width,2)}
function dlgShow(node){dlgNode=node;dlgSel=0;clearInterval(dlgTimer);const who=node.who||'',pt=portraitFor(node.portrait||who),box=$('dlg');
  $('dlg-who').textContent=who&&who!=='You'?who:(who==='You'?S.name||'You':'');$('dlg-who').style.display=who?'inline-block':'none';drawPortrait(pt);box.classList.toggle('has-pt',!!pt);
  $('dlg-ch').innerHTML='';dlgFull=node.text||'';$('dlg-txt').textContent='';$('dlg-arrow').style.visibility='hidden';box.classList.add('open');
  let i=0;dlgTimer=setInterval(()=>{i+=2;$('dlg-txt').textContent=dlgFull.slice(0,i);if(i>=dlgFull.length)dlgTyped()},28);if(!dlgFull)dlgTyped()}
function dlgTyped(){clearInterval(dlgTimer);dlgTimer=null;$('dlg-txt').textContent=dlgFull;const n=dlgNode;
  if(n.choices&&n.choices.length){const ch=$('dlg-ch');n.choices.forEach((c,k)=>{const b=document.createElement('button');b.textContent=c.t;b.className=k===dlgSel?'sel':'';b.onclick=e=>{e.stopPropagation();dlgChoose(k)};ch.appendChild(b)})}
  else $('dlg-arrow').style.visibility='visible'}
function dlgChoose(k){const n=dlgNode,c=n.choices[k];if(c.set)setFlag(c.set);if(c.fn)c.fn();dlgGo(c.go)}
function dlgGo(id){if(id&&dlgNodes&&dlgNodes[id])return dlgShow(dlgNodes[id]);dlgEnd()}
function dlgEnd(){clearInterval(dlgTimer);dlgTimer=null;$('dlg').classList.remove('open');const f=dlgDone;dlgDone=null;dlgNodes=null;dlgNode=null;if(f)f()}
function dlgAdvance(){if(!dlgActive())return false;
  if(dlgTimer){dlgTyped();return true}                                                    // still typing: show it all
  if(dlgNode.choices&&dlgNode.choices.length){dlgChoose(dlgSel);return true}
  dlgGo(dlgNode.next);return true}
function runDialogue(id,onEnd){const d=DLG[id];if(!d)return false;cancel();releaseAll();dlgNodes=d.nodes;dlgDone=onEnd||null;dlgShow(d.nodes[d.start]);return true}
function dlgSay(who,text,onEnd){cancel();releaseAll();dlgNodes=null;dlgDone=onEnd||null;dlgShow({who,text})}
$('dlg').addEventListener('click',()=>dlgAdvance());
addEventListener('keydown',e=>{if(!dlgActive())return;const k=e.key;
  if(k===' '||k==='Enter'){e.preventDefault();e.stopPropagation();dlgAdvance()}
  else if((k==='ArrowDown'||k==='s'||k==='ArrowUp'||k==='w')&&dlgNode&&dlgNode.choices&&!dlgTimer){e.preventDefault();e.stopPropagation();const n=dlgNode.choices.length;dlgSel=(dlgSel+(k==='ArrowDown'||k==='s'?1:n-1))%n;[...$('dlg-ch').children].forEach((b,i)=>b.className=i===dlgSel?'sel':'')}
  else if(k==='Escape'){e.stopImmediatePropagation()}},true);
