// ---------- the enemy table (roadmap 3.1): real-time creatures that chase you and that you fight with Use and a weapon ----------
// ENEMY_TYPES.some_id = {n:'Name', hp, dmg, cd, speed, chase, region, leash, art, xp, gold:[min,max], drops:[[item, chance 0-1, count],...], respawn, die:'text when it falls'}
//   hp          health                        dmg   damage of each hit (halved while poisoned)        cd     moves it waits between hits (one move is about 0.6 s)
//   speed       moves wait this many ticks (1 = every tick, 2 = half as fast)        chase  it follows you when you are this many tiles away or less, and otherwise wanders
//   region      'island' keeps it on the tiles of the island it was built on (the spirit); anything else lets it walk on any walkable tile within `leash` tiles of where it started
//   art         the drawing in ENEMY_ART (js/render/entities.js)    xp  Combat xp for the kill    gold / drops  what it leaves behind    respawn  ticks until it returns (0 = stays dead)    die  the message
// Enemies are created with spawnEnemy('id', x, y, {group:'name'}) (js/systems/combat.js); when every enemy of a `group` is beaten, enemyBeaten('name') fires the triggers waiting for it.
// Turn-based fighters (pirates, the pirate boss, guild fighters) will use a battle screen instead (step 3.6) and get their own rows here for their numbers and drops.
// The giant centipede (the Darkwood): a human-sized relative of Japan's giant centipede (the ōmukade): a long reddish-brown body of plates, a flame-orange head with big dark fangs, yellow legs and long feelers.
const ENEMY_TYPES={
 centipede:{n:'Giant centipede',hp:30,dmg:7,cd:2,speed:1,chase:6,leash:5,art:'centipede',xp:40,gold:[5,15],drops:[['centipede_fang',.5,1]],respawn:90,die:'The giant centipede curls up and goes still.'},
 spirit:{n:'Spirit',hp:12,dmg:6,cd:2,speed:1,chase:7,region:'island',art:'ghost',xp:20,respawn:40,die:'The spirit fades away... for now.'}
};
