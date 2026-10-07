// ---------- shop stock (data table: add rows, not code) ----------
// Garrick's Forge in the Walled Settlement. [section, [[item id, price], ...]]. He buys materials at half price.
const SMITH=[
 ['Materials',[['copper_ore',30],['tin_ore',30],['bronze_ore',50],['iron_bar',160],['rope',25],['softwood_plank',15],['medium_plank',30],['hardwood_plank',55]]],
 ['Weapons',[['bronze_sword',450],['iron_sword',1100],['greatsword',3000]]],
 ['Tools',[['iron_pickaxe',600],['iron_axe',600]]],
 ['Objects',[['standard_bench',100],['forge',400],['camp_kit',150]]]
];
// Lucie's Gold & Gems in the Mountain Town (enchanted jewellery: effects are the `fx` field on each item)
const JEWELLER=[
 ['Rings',[['ring_vigor',3500],['ring_might',4200],['ring_endurance',5200],['ring_harvest',3800]]],
 ['Amulets',[['amulet_vital',3200],['amulet_angler',4500],['amulet_ward',6000],['amulet_sage',7500]]]
];
// Every trader the generic shop screen (openTrader in js/ui/shops.js) can show. sell = sections the trader buys back at half price.
const SHOPS={
 smith:{name:"Garrick's Forge",who:'Garrick',buyTag:'Metal, blades and tools.',sellTag:'Garrick buys metal and timber at half price.',none:'Bring ore, iron bars, planks or rope.',thanks:'A fine choice.',list:SMITH,sell:['Materials']},
 jeweller:{name:"Lucie's Gold & Gems",who:'Lucie',buyTag:'Enchanted rings and amulets. Wear one ring and one amulet.',sellTag:'Lucie buys jewellery back at half price.',none:'Lucie only buys rings and amulets.',thanks:'May it serve you well.',list:JEWELLER,sell:['Rings','Amulets']}
};
