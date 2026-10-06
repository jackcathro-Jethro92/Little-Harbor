// ---------- skills (data table: add a row to add a category) ----------
const LV=[100,380,770,1300,2150,3300,4800,6900,10000,15000]; // total XP needed for levels 1-10
const SKILLS=[
 {id:'fishing',n:'Fishing',c:'#3b82c4',perk:l=>'Bites '+3*l+'% sooner and better odds of rare fish.'},
 {id:'combat',n:'Combat',c:'#d9534f',perk:l=>'+'+8*l+'% weapon damage and +'+4*l+' max health.'},
 {id:'sailing',n:'Sailing',c:'#2f8f7a',perk:l=>'Travelling costs '+6*l+'% less stamina.'},
 {id:'mining',n:'Mining',c:'#8d8f87',perk:l=>'Ore needs '+Math.floor(l/3)+' fewer swings; '+4*l+'% chance of extra ore.'},
 {id:'woodcutting',n:'Woodcutting',c:'#7a5230',perk:l=>'Trees need '+Math.floor(l/3)+' fewer swings; '+4*l+'% chance of an extra log.'},
 {id:'foraging',n:'Foraging',c:'#5aa83c',perk:l=>'+'+4*l+'% chance of extra fiber and herbs.'},
 {id:'crafting',n:'Crafting',c:'#c9852e',perk:l=>'+'+3*l+'% chance of an extra item when crafting.'},
 {id:'cooking',n:'Cooking',c:'#d9833b',perk:l=>'Food restores '+4*l+'% more health and stamina.'},
 {id:'farming',n:'Farming',c:'#7aa83c',perk:l=>'+'+4*l+'% chance of extra produce from your garden.'},
 {id:'alchemy',n:'Alchemy',c:'#8a5ac8',perk:l=>'Potions are '+4*l+'% stronger and last '+4*l+'% longer.'}
];
