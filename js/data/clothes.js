// ---------- clothes from Wynn the tailor (Jack's note: clothes that change how your character looks) ----------
// One row per piece. slot: 'top' (what you wear underneath), 'over' (a jacket, coat or cloak) or 'hat'. art: the shape on your detailed picture (js/render/heroart.js: top, over, or the hat's acc name).
// col: the colour it comes in (a number in OPT.shirt for a top, OPT.jacket for an over, OPT.hat for a hat; Wynn can dye it afterwards). hat: the hat on your small walking figure (cap, straw, scarf).
// Each piece becomes an item (kind 'clothes') that sits in the Bag under Clothing; Wear and Take off there change both pictures (js/systems/clothes.js). Add a row to add a piece.
const CLOTHES=[
 {id:'plain_tee',n:'Plain tee',slot:'top',art:'tee',col:2,price:80,desc:'A soft cotton tee in sunny yellow.'},
 {id:'vest_top',n:'Deck vest',slot:'top',art:'tank',col:1,price:90,desc:'A sleeveless top for hot days on deck.'},
 {id:'linen_shirt',n:'Linen shirt',slot:'top',art:'shirt',col:5,price:120,desc:'A crisp white linen shirt.'},
 {id:'work_tunic',n:'Work tunic',slot:'top',art:'tunic',col:3,price:140,desc:'A sturdy green tunic, belted at the waist.'},
 {id:'striped_shirt',n:'Sailor stripes',slot:'top',art:'stripes',col:1,price:150,desc:'Blue and white stripes, as every sailor knows.'},
 {id:'wool_sweater',n:'Wool sweater',slot:'top',art:'sweater',col:0,price:180,desc:'A thick red sweater for cold mornings at sea.'},
 {id:'summer_dress',n:'Summer dress',slot:'top',art:'dress',col:4,price:220,desc:'A long purple dress that swishes when you walk.'},
 {id:'silk_shirt',n:'Silk shirt',slot:'top',art:'shirt',col:4,price:320,desc:'A fine purple silk shirt from the far coast.'},
 {id:'leather_vest',n:'Leather vest',slot:'over',art:'vest',col:6,price:150,desc:'A brown leather vest with deep pockets.'},
 {id:'flannel_shirt',n:'Flannel overshirt',slot:'over',art:'flannel',col:1,price:170,desc:'A red checked flannel, worn open.'},
 {id:'work_apron',n:'Work apron',slot:'over',art:'apron',col:6,price:120,desc:'A canvas apron for messy work.'},
 {id:'sea_coat',n:'Sea coat',slot:'over',art:'coat',col:0,price:260,desc:'A blue wool coat that keeps out the spray.'},
 {id:'long_coat',n:'Long coat',slot:'over',art:'longcoat',col:5,price:380,desc:'A dark coat down to the knees. Very dashing.'},
 {id:'travel_cloak',n:'Travel cloak',slot:'over',art:'cloak',col:2,price:300,desc:'A green hooded cloak for long roads.'},
 {id:'scholar_robe',n:"Scholar's robe",slot:'over',art:'robe',col:4,price:450,desc:'A purple robe with wide sleeves.'},
 {id:'fishing_cap',n:'Fishing cap',slot:'hat',art:'cap',col:1,hat:'cap',price:60,desc:'A red cap that keeps the sun out of your eyes.'},
 {id:'straw_hat',n:'Straw hat',slot:'hat',art:'straw',col:0,hat:'straw',price:80,desc:'A wide straw hat for the hottest days.'},
 {id:'wool_beanie',n:'Wool beanie',slot:'hat',art:'beanie',col:2,hat:'cap',price:70,desc:'A snug blue beanie.'},
 {id:'head_scarf',n:'Head scarf',slot:'hat',art:'scarf',col:3,hat:'scarf',price:60,desc:'A green scarf tied over the hair.'},
 {id:'bandana',n:'Bandana',slot:'hat',art:'bandana',col:1,hat:'scarf',price:70,desc:'A red bandana, knotted at the back.'},
 {id:'traveller_hood',n:"Traveller's hood",slot:'hat',art:'hood',col:2,hat:'scarf',price:110,desc:'A deep blue hood.'},
 {id:'tricorn_hat',n:'Tricorn hat',slot:'hat',art:'tricorn',col:1,hat:'cap',price:220,desc:'A three-cornered hat, like the old captains wore.'},
 {id:'captain_hat',n:"Captain's hat",slot:'hat',art:'captain',col:4,hat:'cap',price:260,desc:'A white peaked hat with a gold badge.'}];
CLOTHES.forEach(c=>{ITEMS[c.id]={n:c.n,kind:'clothes',price:c.price,wear:c,desc:c.desc}});
