// ---------- shop stock (data table: add rows, not code) ----------
// Garrick's Forge in the Walled Settlement. [section, [[item id, price], ...]]. Shop goods were moved round in playtest #4 (P58): Garrick keeps ore, iron bars, weapons, tools and armour; rope and planks went to the carpenter,
// cloth and leather to the tailor, and gold and silver ore to the goldsmith. He now also buys unwanted weapons and tools back (P57). He buys at half price everything in his sell list.
const SMITH=[
 ['Materials',[['copper_ore',30],['tin_ore',30],['bronze_ore',50],['iron_bar',160]]],
 ['Weapons',[['sword',300],['hand_axe',400],['bronze_sword',450],['iron_sword',1100],['greatsword',3000]]],
 ['Tools',[['iron_pickaxe',600],['iron_axe',600]]],
 ['Old tools',[['pickaxe',200],['woodcutters_axe',200],['knife',60]]],   // only bought (noBuy): Bram sells these, but Garrick will take them off your hands once you have better
 ['Armour',[['cloth_hood',500],['cloth_tunic',1200],['cloth_shoes',450],['leather_cap',1500],['leather_jerkin',3500],['leather_boots',1300],['chain_coif',4500],['chain_hauberk',10000],['chain_boots',4000]]],
 ['Objects',[['standard_bench',100],['forge',400],['camp_kit',150]]]
];
// The carpenter near the Darkwood's south gate (playtest #4): planks and rope, and he buys logs and flax fiber (the raw wood and fiber). Furniture comes in batch G.
const CARPENTER=[
 ['Timber',[['softwood_plank',15],['medium_plank',30],['hardwood_plank',55],['rope',25]]],
 ['Furniture',[['bed_single',300],['bed_double',600],['bookcase',250],['table',150],['chair',60],['carpet_small',80],['carpet_large',200],['chest_drawers',350],['storage_crate',120],['weapon_rack',300],['tool_rack',250]]],
 ['Raw wood',[['softwood',16],['medium_wood',30],['hardwood',56],['fiber',8]]]   // only bought (noBuy)
];
// Seamstress Wynn in the Walled Settlement: cloth and leather (the look screens are separate, js/ui/look.js)
const TAILOR=[
 ['Fabric',[['cloth',40],['leather',70]]]
];
// Lucie's Gold & Gems in the Mountain Town (enchanted jewellery: effects are the `fx` field on each item)
const JEWELLER=[
 ['Ore',[['silver_ore',220],['gold_ore',400]]],   // only bought (noBuy): Lucie buys gold and silver ore, as Garrick used to, but does not sell it (mining stays the only source)
 ['Rings',[['ring_vigor',3500],['ring_might',4200],['ring_endurance',5200],['ring_harvest',3800]]],
 ['Amulets',[['amulet_vital',3200],['amulet_angler',4500],['amulet_ward',6000],['amulet_sage',7500]]]
];
// Astrid's Apothecary in the Walled Settlement: potions and poisons (the same items the player can brew at an alchemy station). She buys them back at half price.
const APOTHECARY=[
 ['Potions',[['healing_potion',60],['greater_healing',180],['stamina_tonic',50],['greater_stamina',150],['swiftness_potion',220]]],
 ['Poisons',[['poison_vial',120]]],
 ['Ingredients',[['moss',12],['holly',18],['basil',15],['forest_sprig',15],['red_cap',24],['death_cap',42],['blue_cap',36]]],   // herbs and mushrooms: she sells at three times what she pays (rate 1/3 below)
 ['Curios',[['centipede_fang',36]]]   // only bought (noBuy)
];
// Every trader the generic shop screen (openTrader in js/ui/shops.js) can show. sell = sections the trader buys back at half price.
const SHOPS={
 smith:{name:"Garrick's Forge",who:'Garrick',buyTag:'Ore, iron bars, blades, tools and armour.',sellTag:'Garrick buys ore, iron, weapons, tools and armour at half price.',none:'Bring ore, iron bars, weapons, tools or armour.',thanks:'A fine choice.',list:SMITH,sell:['Materials','Weapons','Tools','Old tools','Armour'],noBuy:['Old tools']},
 carpenter:{name:"Carpenter Alder's Workshop",who:'Alder',buyTag:'Planks, rope and furniture.',sellTag:'Alder buys planks, rope, furniture, logs and flax fiber at half price.',none:'Bring planks, rope, logs or flax fiber.',thanks:'Good timber, that.',list:CARPENTER,sell:['Timber','Furniture','Raw wood'],noBuy:['Raw wood']},
 tailor:{name:"Wynn's Cloth & Leather",who:'Wynn',buyTag:'Cloth and leather.',sellTag:'Wynn buys cloth and leather at half price.',none:'Wynn only buys cloth and leather.',thanks:'Lovely.',list:TAILOR,sell:['Fabric']},
 apothecary:{name:"Astrid's Apothecary",who:'Astrid',buyTag:'Potions to heal and quicken, poisons for your blade, and herbs and mushrooms to brew with.',sellTag:'Astrid buys potions and poisons at half price, and herbs, mushrooms and centipede fangs at a fair price.',none:'Bring potions, poisons, herbs, mushrooms or centipede fangs.',thanks:'Use it wisely.',list:APOTHECARY,sell:['Potions','Poisons','Ingredients','Curios'],noBuy:['Curios'],rate:{Ingredients:1/3,Curios:1/3}},   // `rate`: the share of the list price she pays for a section (default one half): herbs and fangs are sold at three times what she pays
 jeweller:{name:"Lucie's Gold & Gems",who:'Lucie',buyTag:'Enchanted rings and amulets. Wear one ring and one amulet.',sellTag:'Lucie buys jewellery and gold and silver ore at half price.',none:'Lucie buys rings, amulets and gold and silver ore.',thanks:'May it serve you well.',list:JEWELLER,sell:['Rings','Amulets','Ore'],noBuy:['Ore']}
};
// Tailor and barber in the Walled Settlement: gold per look field changed (the look screen is in js/ui/look.js).
const LOOK_PRICES={tailor:{shirt:50,jk:80,hc:40,hat:50,jon:30,pack:30},barber:{hair:40,hstyle:60}};

// Things Bram's shop only shows once the story has handed them out (or the player already has one): item id -> the flag that unlocks it. Quest 2 gives the sword and pickaxe (Garrick);
// Quest 3 (Murl) sends the player to Hale for the woodcutter's axe, so Bram stops selling it until then.
const SHOP_LOCKS={pickaxe:'q2_got_pickaxe',woodcutters_axe:'has_axe'};
