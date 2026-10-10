// ---------- gathering data (add rows for new resources) ----------
const WOOD={soft:{item:'softwood',hits:2,min:2,max:3,xp:6},medium:{item:'medium_wood',hits:3,min:2,max:2,xp:10},hard:{item:'hardwood',hits:5,min:1,max:2,xp:18}};
const ORE={15:{item:'copper_ore',hits:3,min:1,max:2,xp:8},16:{item:'tin_ore',hits:3,min:1,max:2,xp:8},17:{item:'bronze_ore',hits:4,min:1,max:2,xp:14},123:{item:'gold_ore',hits:6,min:1,max:1,xp:30},124:{item:'silver_ore',hits:5,min:1,max:2,xp:20}};   // 15 copper, 16 tin, 17 bronze, 123 gold (rare), 124 silver (rare)
const FLAX={item:'fiber',hits:1,min:1,max:2,xp:3},STUB=m=>m===4?14:m===19?20:(m>=24&&m<=30||m===46)?31:18,REGROW=m=>m===46?99999:m===19?2:m===123?10:m===124?7:3;
const FORAGE={24:{item:'moss',xp:4},25:{item:'holly',xp:4},26:{item:'basil',xp:4},27:{item:'forest_sprig',xp:4},28:{item:'red_cap',xp:5},29:{item:'death_cap',xp:6},30:{item:'blue_cap',xp:6}}; // tiles 24-30, picked spot = 31 // tile types: 19 flax, 20 cut flax // used once crafting stations exist
const wood=(x,y)=>{const n=((Math.imul(x+7,73856093)^Math.imul(y+13,19349663))>>>0)%100;if(n%7===0&&n%2)return'hard';if(n%5===0)return'soft';return['soft','medium','hard'][n%3]};
