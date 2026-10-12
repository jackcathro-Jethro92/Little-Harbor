// ---------- the enemy table (roadmap 3.1): creatures that wander the map, chase you, and start a turn-based battle when they touch you ----------
// ENEMY_TYPES.some_id = {n:'Name', hp, dmg, hit:[min,max], cd, speed, chase, region, leash, art, xp, gold:[min,max], drops:[[item, chance 0-1, count],...], respawn, die:'text when it falls'}
//   hp          health in the battle     hit  the damage of each of its hits in the battle (if left out: from half of `dmg` up to `dmg`)     cd  moves it waits after you run away from it (one move is about 0.6 s)
//   speed       moves wait this many ticks (1 = every tick, 2 = half as fast)        chase  it follows you when you are this many tiles away or less, and otherwise wanders
//   region      'island' keeps it on the tiles of the island it was built on (the spirit); anything else lets it walk on any walkable tile within `leash` tiles of where it started
//   art         the drawing in ENEMY_ART (js/render/entities.js), used on the map and on the battle screen    xp  Combat xp for the win    gold / drops  what it leaves behind    respawn  ticks until it returns (0 = stays dead)    die  the message
// Creatures are created with spawnEnemy('id', x, y, {group:'name'}) (js/systems/combat.js); when every creature of a `group` is beaten, enemyBeaten('name') fires the triggers waiting for it.
// People who fight (pirates, the pirate boss, guild fighters) have their own rows in js/data/battles.js (FOES); both kinds use the same battle screen.
// The giant centipede (the Darkwood): a human-sized relative of Japan's giant centipede (the ōmukade): a long reddish-brown body of plates, a flame-orange head with big dark fangs, yellow legs and long feelers.
const ENEMY_TYPES={
 centipede:{n:'Giant centipede',hp:30,dmg:7,hit:[3,6],cd:2,speed:1,chase:6,leash:5,art:'centipede',xp:40,gold:[5,15],drops:[['centipede_fang',.5,1]],respawn:90,die:'The giant centipede curls up and goes still.'},
 spirit:{n:'Spirit',hp:12,dmg:6,hit:[2,5],cd:2,speed:1,chase:7,region:'island',art:'ghost',xp:20,respawn:40,die:'The spirit fades away... for now.'}
};
