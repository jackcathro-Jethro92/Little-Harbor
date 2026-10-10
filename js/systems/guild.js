// ---------- the Fighters Guild: stepping into halls, Guildmaster Brenna, practice dummies ----------
const HALLS={guild:{z:GZ,id:3,msg:'You step into the Fighters Guild.',name:'Fighters Guild'},arena:{z:AZ,id:4,msg:'You walk out onto the sand. The crowd roars!',name:"Gladiators' Arena"},sanctum:{z:SZ,id:5,msg:'Cool, still air. Old painted walls watch you.',name:'The Sanctum'},
 seahall:{z:HZ,id:6,msg:'Cool stone, and the sound of running water.',name:'Temple Hall'},firegate:{z:PG,id:9,msg:'Torchlight on red lacquer. The far door leads to the courtyard.',name:'The Great Gate'},firehall:{z:PH,id:8,msg:'Warm red light and the crackle of the sacred flame.',name:'The Fire Hall'},vault:{z:VZ,id:7,msg:'You descend into the dark. Water laps all around.',name:'The Vault'}};
const fade=()=>{const f=$('flash');if(f){f.style.opacity=.7;setTimeout(()=>f.style.opacity=0,260)}};
function enterHall(e){fade();const h=HALLS[e.to],z=h.z;P.x=P.rx=z.dx;P.y=P.ry=z.y1-1;P.f='u';say(h.msg);toast(h.name);ui()}
function exitHall(fx,fy){const z=zoneOf(P.x,P.y),th=THROUGH.find(q=>q.x===fx&&q.y===fy),e=th||ENTR.find(q=>HALLS[q.to].id===z);fade();arenaStop();P.x=P.rx=e.out[0];P.y=P.ry=e.out[1];if(th){P.f=th.f||'u';say(th.msg||'You go through the door.');ui();return}P.f='d';say(z===5||z===6?'You step back out into the sunlight.':z===7?'You climb back up the stairs.':'You step back out into the Mountain Town.');ui()}
const TRAIN={cost:100,xp:60,maxLvl:6,rest:30}; // Brenna's lessons: gold for combat XP (up to this combat level), and a bed to heal
function guildMenu(){
  const o=['Train with Brenna ('+TRAIN.cost+'g)','Rest and heal ('+TRAIN.rest+'g)','Cancel'];
  menu('Guildmaster Brenna',o,c=>{
    if(c===o[0]){if(lvl('combat')>=TRAIN.maxLvl)return say('Brenna: You have outgrown my lessons. Prove yourself in the arena.');
      if(S.gold<TRAIN.cost)return say('Brenna: Lessons cost '+TRAIN.cost+' gold.');S.gold-=TRAIN.cost;say('Brenna: Again! Good. Again!');gainXp('combat',TRAIN.xp);ui();save()}
    else if(c===o[1]){if(S.hp>=maxHp()&&S.sta>=maxSta())return say('Brenna: You look fine to me.');
      if(S.gold<TRAIN.rest)return say('Brenna: A bunk costs '+TRAIN.rest+' gold.');S.gold-=TRAIN.rest;S.hp=maxHp();S.sta=maxSta();say('Brenna: Rested and ready.');ui();save()}})}
// practice dummy: a few stamina for a little combat XP, only for beginners
function hitDummy(){
  if(!eq('weapon'))return say('Equip a weapon first, then hit the dummy.');
  if(S.sta<STAM.swing)return say('Too tired to swing.');
  if(lvl('combat')>=3)return say('The dummy has taught you all it can. Try Brenna or the arena.');
  spend(STAM.swing);gainXp('combat',3);say('Thwack! You practise your swing.')}
