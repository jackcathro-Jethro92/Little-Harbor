// ---------- the Mountain Town fills up: more houses, Lucie's jeweller, the Fighters Guild and the Gladiators' Arena ----------
// Runs after interiors.js (zones GZ and AZ are defined there). The town is walled x 15-39, y 59-78 with its gate at (26,78).
// Door stand tile of a house is (x+1, y+2); of the 5-wide guild and arena halls it is (x+2, y+2).
rect(16,66,38,67,(x,y)=>{if(at(x,y)===48)setT(x,y,6)}); // a cross street
const MT_HOUSES=[[22,62,'red'],[35,62,'thatch'],[18,74,'red']];
MT_HOUSES.forEach(([x,y,roof])=>{BL.push({x,y,w:3,roof});rect(x,y,x+2,y+1,(xx,yy)=>setT(xx,yy,5))});
BL.push({x:28,y:69,w:3,roof:'red',sign:'gold'});rect(28,69,30,70,(x,y)=>setT(x,y,5));                                  // Lucie's Gold & Gems
BL.push({x:28,y:72,w:5,hall:'guild'});rect(28,72,32,73,(x,y)=>setT(x,y,5));                                                // Fighters Guild
BL.push({x:34,y:72,w:5,hall:'arena'});rect(34,72,38,73,(x,y)=>setT(x,y,5));                                                // Gladiators' Arena
[[25,65],[27,65],[25,68],[27,68],[27,75],[29,75],[33,75],[35,75]].forEach(([x,y])=>{if([6,48].includes(at(x,y)))setT(x,y,7)}); // lanterns
// halls you can walk into: face the middle of the hall's lower row from its door stand tile
const ENTR=[{x:30,y:73,to:'guild',out:[30,74]},{x:36,y:73,to:'arena',out:[36,74]}];
// ---------- the Fighters Guild hall (zone 3): a wooden floor and a door in the bottom wall ----------
rect(GZ.x0,GZ.y0,GZ.x1,GZ.y1,(x,y)=>setT(x,y,(x===GZ.x0||x===GZ.x1||y===GZ.y0||y===GZ.y1)?22:21));setT(GZ.dx,GZ.y1,23);
// ---------- the Gladiators' Arena (zone 4): sand floor, stands with a cheering crowd on three sides, door in the bottom wall ----------
rect(AZ.x0,AZ.y0,AZ.x1,AZ.y1,(x,y)=>{const edge=x===AZ.x0||x===AZ.x1||y===AZ.y0||y===AZ.y1;setT(x,y,edge?22:(x===AZ.x0+1||x===AZ.x1-1||y===AZ.y0+1)&&y<AZ.y1-1?53:52)});setT(AZ.dx,AZ.y1,23);
// ---------- people ----------
const MT_NAMES=['Bergit','Halvard','Ingrid','Rolf','Sigrun','Tormund','Astrid','Leif'];
const MT_SAY=[['The mountain air keeps you young.','Have you seen the guild fighters train? Loud lot.'],['I mine copper when the snow allows.','Lucie sells gems that glow. Pricey, though!'],['Our walls have never been breached.','Come see a bout at the arena, it is a good show.'],['I carve stone for the temple.','The road south goes through the Darkwood. Take a lantern of courage.'],['My husband fights in the arena. I faint every time.','Warm soup if you are cold, traveler.'],['Winters are long up here.','The warden knows every face. Do not cause trouble.'],['I weave wool from the mountain goats.','There is gold in these hills, they say.'],['I wanted to be a gladiator once. Then I saw them.','Mind the steps, they are steep.']];
const MT_HOMES=[[18,62],[30,62],[18,69],[32,69],[22,72],...MT_HOUSES.map(([x,y])=>[x,y])];
MT_NAMES.forEach((n,i)=>{const[hx,hy]=MT_HOMES[i],x=hx+1,y=hy+2;
  NPC.push({id:'m'+i,n,x,y,hx:x,hy:y,f:'d',skin:(i*3+1)%5,hair:(i*5+3)%6,shirt:(i*2+4)%6,jk:(i*7+1)%6,hc:(i+2)%5,hat:['none','cap','none','straw','cap'][i%5],pack:i%3===0,jon:i%2===0,
    bio:{age:null,job:null,backstory:null,likes:[],quests:[]},say:MT_SAY[i]})});
const mkLook=(n,x,y,f,o)=>NPC.push({n,x,y,hx:x,hy:y,f,fixed:1,pack:false,bio:{age:null,job:null,backstory:null,likes:[],quests:[]},...o});
mkLook('Lucie',29,71,'d',{skin:0,hair:4,shirt:2,jk:3,hat:'none',jon:true,store:'jeweller',bio:{age:null,job:'Goldsmith',backstory:null,likes:[],quests:[]},say:['Gold, gems and a little magic.']});
mkLook('Warden Orrin',25,77,'u',{skin:3,hair:0,shirt:4,jk:5,hat:'cap',hc:2,jon:true,say:['Welcome to the Mountain Town. Keep your blade sheathed in the streets.','The arena is for fighting. The streets are not.']});
mkLook('Miner Gudrun',22,67,'r',{skin:1,hair:3,shirt:1,jk:2,hat:'cap',hc:3,jon:false,fixed:0,say:['Copper again today. Always copper.','Bring me bronze and I will talk your ear off.']});
mkLook('Old Stig',33,67,'l',{skin:2,hair:5,shirt:3,jk:4,hat:'straw',jon:false,fixed:0,say:['Eighty winters and I still climb these steps.','Back in my day the arena sand was real blood.']});
// inside the Fighters Guild
mkLook('Guildmaster Brenna',GZ.dx,GZ.y0+3,'d',{skin:2,hair:1,shirt:0,jk:5,hat:'none',jon:true,store:'guild',say:['Train hard, fight smart.']});
mkLook('Sergeant Voss',GZ.x0+2,GZ.y0+6,'r',{skin:3,hair:0,shirt:4,jk:0,hat:'cap',hc:1,jon:true,say:['Again! Feet apart, guard up!','A tired fighter is a dead fighter. Eat well.']});
mkLook('Hild',GZ.x1-2,GZ.y0+6,'l',{skin:0,hair:3,shirt:2,jk:3,hat:'none',jon:true,say:['I beat Iron Marcus once. He still talks about it.','Poison on your blade makes strong foes slow.']});
mkLook('Aldric',GZ.x0+2,GZ.y0+2,'d',{skin:1,hair:2,shirt:5,jk:4,hat:'cap',hc:0,jon:true,say:['The practice dummies never hit back. Good place to start.','Talk to Brenna if you want proper lessons.']});
addAn('dummy',GZ.x0+4,GZ.y0+7,0,0);addAn('dummy',GZ.x1-4,GZ.y0+7,0,0);
// inside the Arena: the Arena Master by the door and a crowd on the stands
mkLook('Arena Master Dorn',AZ.dx-2,AZ.y1-1,'r',{skin:2,hair:5,shirt:1,jk:2,hat:'none',jon:true,store:'arena',say:['Ready to fight?']});
['Rowdy fan','Loud fan','Gambler Finch','Little Wick','Mad Moll','Cheerful Ned'].forEach((n,i)=>mkLook(n,AZ.x0+2+i*2,AZ.y0+1,'d',{skin:i%5,hair:(i*2)%6,shirt:(i*3+1)%6,jk:(i*5)%6,hat:['cap','none','straw'][i%3],jon:i%2===0,say:['Blood and glory!','Hit him, hit him!','I bet on you, stranger!','Ooh, that one stung!','Did you see that swing?','Best seats in town, up here.'].slice(i,i+1)}));
// stale cut-tree records must not put a resource or stump back on top of the new buildings
Object.keys(S.cut).forEach(i=>{const x=i%MW,y=(i/MW)|0;if(x>=15&&x<=39&&y>=59&&y<=78)delete S.cut[i]});
