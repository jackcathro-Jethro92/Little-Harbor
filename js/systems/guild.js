// ---------- the Fighters Guild: stepping into halls, Guildmaster Brenna, practice dummies ----------
function enterHall(e){const z=e.to==='guild'?GZ:AZ;P.x=P.rx=z.dx;P.y=P.ry=z.y1-1;P.f='u';say(e.to==='guild'?'You step into the Fighters Guild.':'You walk out onto the sand. The crowd roars!');toast(e.to==='guild'?'Fighters Guild':"Gladiators' Arena");ui()}
function exitHall(){const z=zoneOf(P.x,P.y),e=ENTR.find(q=>q.to===(z===3?'guild':'arena'));arenaStop();P.x=P.rx=e.out[0];P.y=P.ry=e.out[1];P.f='d';say('You step back out into the Mountain Town.');ui()}
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
