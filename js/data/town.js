// ---------- the towns' outdoor details: [prop id, x, y] on the map (art in js/render/townprops.js and js/render/props.js; set out by js/systems/towndecor.js) ----------
// They stand in the way (like furniture), except flat ones. Keep lanes, door stand tiles and gates clear (the smoke test walks to every door).
const TOWN_DECOR={
 settlement:[['well',99,208],['bench',103,210],['signpost',102,205],['signpost',97,212],['signpost',86,215],['signpost',113,215],['signpost',102,223],
  ['shadetree',96,202],['shadetree',113,206],['shadetree',103,225],['shadetree',85,231],['shadetree',112,231],
  ['flowerbed',111,206],['flowerbed',89,212],['flowerbed',110,212],['flowerbed',112,225],['flowerbed',86,204],['flowerbed',107,203],['flowerbed',91,209],['flowerbed',103,213],['flowerbed',95,227],['flowerbed',90,228],
  ['hay',95,232],['hay',96,233],['cart',111,215],['crate',96,221],['barrel',97,221],['logs',85,220],['barrel',91,204],['crate',107,214]],
 bandits:[['campfire',18,229],['crate',14,227],['crate',15,227],['barrel',22,228],['barrel',22,229],['logs',19,232],['sacks',12,231],['cart',24,231]]};
