// ---------- the design kit's home furniture, sold by the carpenter (playtest #5, P95) ----------
// Every row becomes an item (id 'f_' + the prop id, kind 'furniture') that is placed from the Bag like the first eleven pieces in js/data/items.js, and is listed in the carpenter's shop under its section.
// The items themselves are made from this table in js/systems/furniture.js, once the pictures (js/render/props.js) are loaded.
// [prop id from js/render/props.js, price, section, extra]. extra: bed:1 lets you sleep beside it at camp; store:[cap, title] makes it a storage piece. The name comes from the design kit.
// Workshop and shop fittings (forges, counters, the tailor's and barber's things and so on) are left out: they belong to the shops, not to a home.
const FURN_KIT=[
 // Furniture
 ['bed',260,'Furniture',{bed:1}],['stool',40,'Furniture'],['bench',90,'Furniture'],['wardrobe',320,'Furniture',{store:[20,'Wardrobe']}],['desk',200,'Furniture'],['roundtable',220,'Furniture'],
 ['armchair',160,'Furniture'],['sofa',300,'Furniture'],['rocker',140,'Furniture'],['sideboard',280,'Furniture',{store:[20,'Sideboard']}],['chest',120,'Furniture',{store:[10,'Chest']}],['footchest',160,'Furniture',{store:[10,'Chest']}],
 ['cradle',150,'Furniture'],['nightstand',70,'Furniture'],['vanity',180,'Furniture'],['washstand',90,'Furniture'],['coatrack',60,'Furniture'],['screen',120,'Furniture'],
 ['longtable',240,'Furniture'],['booth',200,'Furniture'],['cardtable',160,'Furniture'],['piano',900,'Furniture'],['kcounter',220,'Furniture'],['stove',350,'Furniture'],['oven',420,'Furniture'],['icebox',260,'Furniture'],
 // Beds
 ['bs_red',300,'Beds',{bed:1}],['bs_green',300,'Beds',{bed:1}],['bs_white',300,'Beds',{bed:1}],['bd_red',600,'Beds',{bed:1}],['bd_green',600,'Beds',{bed:1}],['bd_white',600,'Beds',{bed:1}],
 ['bk_red',900,'Beds',{bed:1}],['bk_blue',900,'Beds',{bed:1}],['bk_green',900,'Beds',{bed:1}],['bk_gold',1200,'Beds',{bed:1}],['canopy',1000,'Beds',{bed:1}],['canopyk',1400,'Beds',{bed:1}],
 ['bunk',350,'Beds',{bed:1}],['cot',120,'Beds',{bed:1}],['hammock',150,'Beds',{bed:1}],
 // Decor
 ['plant',40,'Decor'],['vase',50,'Decor'],['treepot',90,'Decor'],['grandclock',450,'Decor'],['cat',80,'Decor'],['globe',220,'Decor'],['bookstand',110,'Decor'],['maptable',260,'Decor'],['scrolls',120,'Decor'],
 ['crystal',400,'Decor'],['anchor',150,'Decor'],['wheel',180,'Decor'],['rods',120,'Decor'],['rope',30,'Decor'],['net',90,'Decor'],['buoy',60,'Decor'],['fishmount',160,'Decor'],['boar',180,'Decor'],
 ['woodbear',300,'Decor'],['woodowl',120,'Decor'],['totem',400,'Decor'],['woodhorse',150,'Decor'],
 ['lute',140,'Decor'],['tankards',40,'Decor'],['cask',80,'Decor'],['barrel',60,'Decor'],['baskets',50,'Decor'],['flowerbed',40,'Decor'],['hay',30,'Decor'],['luggage',70,'Decor'],['armor',260,'Decor'],['dummy',150,'Decor'],
 // Lights
 ['lamp',120,'Lights'],['candle',30,'Lights'],['candelabra',140,'Lights'],['brazier',160,'Lights'],['sconce',60,'Lights']];
