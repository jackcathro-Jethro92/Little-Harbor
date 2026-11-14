// ---------- the towns' outdoor details: [prop id, x, y] on the map (art in js/render/townprops.js and js/render/props.js; set out by js/systems/towndecor.js) ----------
// They stand in the way (like furniture), except flat ones. Keep lanes, door stand tiles and gates clear (the smoke test walks to every door).
const TOWN_DECOR={
 carpenter:[['woodbear',27,154],['woodowl',29,154],['woodhorse',27,158],['chopblock',32,154],['logs',28,159],['totem',34,155],['woodowl',34,159]],   // (playtest #5) Alder's fenced yard: his carvings, a chopping block and a log stack, and a totem pole by the gate
 settlement:[['well',99,208],['bench',103,210],['signpost',102,205],['signpost',97,212],['signpost',86,215],['signpost',113,215],['signpost',102,223],
  ['shadetree',96,202],['shadetree',113,206],['shadetree',103,225],['shadetree',85,231],['shadetree',112,231],
  ['flowerbed',111,206],['flowerbed',89,212],['flowerbed',110,212],['flowerbed',112,225],['flowerbed',86,204],['flowerbed',107,203],['flowerbed',91,209],['flowerbed',103,213],['flowerbed',95,227],['flowerbed',90,228],
  ['hay',95,232],['hay',96,233],['cart',111,215],['crate',96,221],['barrel',97,221],['logs',85,220],['barrel',91,204],['crate',107,214]],
 bandits:[['campfire',18,229],['crate',14,227],['crate',15,227],['barrel',22,228],['barrel',22,229],['logs',19,232],['sacks',12,231],['cart',24,231]]};

// HARBOUR_BOATS (after playtest #5): boats moored in the village harbour and at the Walled Settlement's docks, for show. [ship (0 rowboat, 1 sloop, 2 schooner, 3 brig, as Murl sells them), x, y, facing 'l' or 'r'].
// They bob on the water and your own boat cannot sail through them (js/systems/harbourboats.js); the pier and the way out to sea stay clear (the tests check).
const HARBOUR_BOATS=[
 [0,153,128,'l'],[1,159,128,'r'],[2,147,129,'l'],[1,163,131,'r'],   // the village harbour, round the pier (your own boat waits at its end, (156,130))
 [0,154,220,'l'],[1,153,214,'l'],[2,161,215,'r'],[3,162,220,'r']];    // the Settlement Docks (the pier is x 149-159, y 215-220)
