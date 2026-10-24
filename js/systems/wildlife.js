// ---------- wild creatures (playtest #4): things in the open sea that attack a sailing boat, and the rock dragons of the mountains ----------
// SEA (P72): every tile you sail in open water has a small chance (SEA_CHANCE) of an attack out of nowhere, never within SEA_SAFE tiles of the village, never before the festival is over, never in a story scene, and
// never again until SEA_GAP more tiles have been sailed. A red "!" shows over your boat, the picture shakes, a line says something is rising, and about a second later the battle starts on the sea field: a
// shark (FOES.sea_shark) most of the time, or, far from home (more than SEA_FAR tiles from the village), often the ancient squid (FOES.sea_squid, with a wind-up and a crushing grip). They are wild, so Run works
// (the shark 50%, the squid 35%). Losing wakes you on your boat as usual. seaAttack('sea_shark') starts one by hand (the tests and the testing menu).
const SEA_CHANCE=.004,SEA_GAP=50,SEA_SAFE=22,SEA_FAR=85,SEA_HOME=[156,113];
let SEA_ALERT=0,seaQuiet=SEA_GAP;
const seaOpen=(x,y)=>{for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++)if(at(x+i,y+j)!==0)return false;return true};
function seaTick(){if(!sail||BATTLE||SCENE||dlgActive()||SEA_ALERT>performance.now()||!flag('festival_done'))return;
  if(--seaQuiet>0)return;const d=Math.hypot(P.x-SEA_HOME[0],P.y-SEA_HOME[1]);
  if(d<SEA_SAFE||!seaOpen(P.x,P.y)||Math.random()>SEA_CHANCE)return;
  seaAttack(d>SEA_FAR&&Math.random()<.6?'sea_squid':'sea_shark')}
function seaAttack(id){if(BATTLE||SCENE)return false;seaQuiet=SEA_GAP;cancel();releaseAll();const key='sea:'+id;
  SEA_ALERT=performance.now()+1300;$('c').classList.add('quake');setTimeout(()=>$('c').classList.remove('quake'),1100);
  say(id==='sea_squid'?'The water boils... something enormous rises beside the boat!':'A dark shape circles under the waves... a shark!');toast('!',900);
  setTimeout(()=>{SEA_ALERT=0;if(BATTLE||SCENE||!sail)return;BATTLES[key]={foes:[id],field:'sea'};
    startBattle(key,res=>{delete BATTLES[key];if(res==='ran')seaQuiet=SEA_GAP*2})},1300);return true}
// the "!" over your boat (js/render/draw.js calls this while SEA_ALERT is running)
function seaAlertMark(cx,cy,t){alertMark({x:P.rx,y:P.ry,alertAt:t,alertUntil:SEA_ALERT},cx,cy,t)}

// ---------- the rock dragons (P73): the mountain country north of the forest, between the Mountain Town and the Temple to the Mountains ----------
// Slow Komodo dragons made of stone (ENEMY_TYPES.rock_dragon): they chase you a few tiles, fight with claws and a fire breath that follows a wind-up, and come back the next day. Each is put on the nearest bare
// rock floor to its spot, off the dirt path.
const ROCK_DRAGONS=[[30,50],[14,47],[24,40],[36,33],[18,34]];
ROCK_DRAGONS.forEach(([x,y])=>{const s=nearestTile(x,y,(a,b)=>at(a,b)===48&&!npcAt(a,b)&&!enemyAt(a,b));if(s)spawnEnemy('rock_dragon',s[0],s[1],{group:'rock_dragons'})});

// ---------- wolves (Jack's note): grey wolves roam the grasslands outside the Walled Settlement ----------
// Only three (one in each coat but the pale), each on the nearest grass to its spot, well away from the roads and farms; they are fast and very strong (ENEMY_TYPES.wolf) and come back a while after you beat them.
const WOLVES=[['wolf_white',62,228],['wolf',98,237],['wolf_black',127,237]];   // a white wolf to the west, a grey one to the south and a black one to the south-east (a pale coat, 'wolf_pale', is ready too)
WOLVES.forEach(([k,x,y])=>{const s=nearestTile(x,y,(a,b)=>at(a,b)===1&&!npcAt(a,b)&&!enemyAt(a,b));if(s)spawnEnemy(k,s[0],s[1],{group:'wolves'})});
