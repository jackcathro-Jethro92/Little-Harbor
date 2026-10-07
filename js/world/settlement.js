// ---------- the Walled Settlement grows: more homes, townsfolk and Garrick's forge ----------
// Runs right after overworld.js (which builds the walls, the 8 first houses and the streets).
// Door stand tile of a house is (x+1, y+2), like everywhere else.
const SET_HOUSES=[[94,212,'thatch'],[103,212,'slate'],[94,222,'red'],[103,222,'thatch'],[87,229,'slate'],[94,229,'thatch'],[109,229,'red']];
SET_HOUSES.forEach(([x,y,roof])=>{BL.push({x,y,w:3,roof});rect(x,y,x+2,y+1,(xx,yy)=>setT(xx,yy,5))});
BL.push({x:103,y:229,w:3,roof:'slate',sign:'smith'});rect(103,229,105,230,(x,y)=>setT(x,y,5)); // Garrick's forge
[[102,231],[106,231],[95,216],[105,216],[95,219],[105,219],[99,208],[101,208]].forEach(([x,y],i)=>{if(at(x,y)===1)setT(x,y,i<2?11:i<6?7:11)}); // barrels at the forge, lanterns on the street
const SET_NAMES=['Wilf','Edda','Marek','Sunniva','Corin','Hesper','Dunstan','Lysa','Osric','Maren','Thom','Bryn','Alder','Fenna','Joss'];
const SET_SAY=[['Welcome to the settlement. Mind the cobbles.','The walls keep the wolves out, mostly.'],['Garrick makes the best blades this side of the mountains.','I bake bread before sunrise. Come by early!'],['My boy wants to sail. I want him to stay!','The docks are east, along the wide path.'],['Quiet times. I like it that way.','The Darkwood is west, past the woodcutters.'],['Ore is dear this year. Try the forge, they buy it.','Hale the woodcutter sends us good timber.'],['I grow herbs behind the house. Basil, mostly.','Lovely day, is it not?'],['Seen any pirates? Me neither, thank goodness.','Strangers always bring news.'],['Our little town gets bigger every year.','Fresh planks make a house last.'],['I patch nets for the docks.','The sea brings us everything, good and bad.'],['Have you met Garrick? Loud, but kind.','Rope and planks, that is what builds a town.'],['Trade is good with the harbor village.','Take care on the road. It is long.'],['Hush, the baby is finally asleep.','Home is where the hearth is.'],['I would like a sword someday. Just to hang on the wall.','Bring Garrick some iron. He will be grateful.'],['I keep chickens. They keep me up.','The gate guard never sleeps, I swear.'],['New face! Stay a while.','Stew tonight. There is plenty.']];
const SET_HOMES=[[87,203],[94,203],[103,203],[109,203],[87,212],[109,212],[87,222],[109,222],...SET_HOUSES.map(([x,y])=>[x,y])];
SET_NAMES.forEach((n,i)=>{const[hx,hy]=SET_HOMES[i%SET_HOMES.length],x=hx+1+(i>=SET_HOMES.length?1:0),y=hy+2;
  NPC.push({id:'s'+i,n,x,y,hx:x,hy:y,f:'d',skin:i%5,hair:(i*5+2)%6,shirt:(i*3+1)%6,jk:(i*7+3)%6,hc:i%5,hat:['cap','none','straw','none','cap'][i%5],pack:i%4===1,jon:i%3!==1,
    bio:{age:null,job:null,backstory:null,likes:[],quests:[]},say:SET_SAY[i]})});
NPC.push(
 {n:'Garrick',x:104,y:231,hx:104,hy:231,f:'d',skin:2,hair:3,shirt:5,jk:5,hat:'none',pack:false,jon:true,store:'smith',fixed:1,bio:{age:null,job:'Blacksmith',backstory:null,likes:[],quests:[]},say:['Metal, blades and tools. Take a look.']},
 {n:'Tilda',x:107,y:231,hx:107,hy:231,f:'l',skin:1,hair:2,shirt:0,jk:3,hat:'cap',pack:false,jon:true,say:['I am Garrick\'s apprentice. I work the bellows.','Bring ore and bars, and he pays fair.']},
 {n:'Gate Guard Bors',x:99,y:202,hx:99,hy:202,f:'d',skin:3,hair:0,shirt:4,jk:5,hat:'cap',hc:2,pack:false,fixed:1,say:['Halt. Oh, it is you. Carry on.','Keep to the road in the forest.']});
