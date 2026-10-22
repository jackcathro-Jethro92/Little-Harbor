// ---------- the furniture of the shop rooms (batch G1): props, floors and walls ported from Jack's interior designer ----------
// The designer tool (https://claude.ai/artifact/3ABF4QvjFtSdhJYrJc1UEc) draws every prop with a small function d(r, t), where r(x, y, w, h, colour) fills a rectangle in 16-pixel tiles and t is a slow tick (250 ms) for flicker. These are the same
// functions, so a room looks in the game just as it does in the tool. DEF: id -> {n name, w and h in tiles, c category, z (0 = lies flat on the floor, so you walk over it), g glow [x, y, radius, colour], d art}.
// A placed prop is [id, x, y] with an optional 4th number (1 = mirrored) and 5th (quarter turns, 0 to 3), as the tool exports it. FLOORS and WALLS name the ten floors and eight walls; floorTile and wallTile draw one tile.
const PROPS=(()=>{const O='#2a1b0e',rr=c=>(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
const DEF={
 table:{n:'Table',w:2,h:1,c:'Furniture',d:r=>{r(0,5,32,10,O);r(1,6,30,6,'#a8743f');r(1,6,30,1,'#c9965a');r(2,12,3,4,'#6b4423');r(27,12,3,4,'#6b4423')}},
 chair:{n:'Chair',w:1,h:1,c:'Furniture',d:r=>{r(3,2,10,3,O);r(4,3,8,1,'#a8743f');r(3,7,10,5,O);r(4,8,8,3,'#a8743f');r(4,12,2,4,'#6b4423');r(10,12,2,4,'#6b4423')}},
 bed:{n:'Bed',w:1,h:2,c:'Furniture',d:r=>{r(0,0,16,32,O);r(1,1,14,30,'#a8743f');r(2,2,12,26,'#e8e0d0');r(3,3,10,6,'#fff');r(2,12,12,16,'#c8553d');r(2,12,12,2,'#e8785f')}},
 bookshelf:{n:'Bookshelf',w:1,h:2,c:'Furniture',d:r=>{r(0,0,16,32,O);r(1,1,14,30,'#6b4423');for(let i=0;i<3;i++){r(2,3+i*10,12,8,'#3d2a14');['#c8553d','#3b82c4','#4caf72','#f2c14e'].forEach((c,k)=>r(3+k*3,4+i*10,2,7,c))}}},
 rug:{n:'Rug',w:3,h:2,c:'Furniture',z:0,d:r=>{r(0,0,48,32,O);r(1,1,46,30,'#9c3b30');r(3,3,42,26,'#c8553d');for(let i=8;i<42;i+=10)for(let j=8;j<26;j+=9)r(i,j,4,4,'#e8c06a')}},
 chest:{n:'Chest',w:1,h:1,c:'Furniture',d:r=>{r(1,5,14,10,O);r(2,6,12,8,'#8a5a2e');r(2,6,12,3,'#a8743f');r(7,9,2,3,'#f2c14e')}},
 plant:{n:'Plant',w:1,h:1,c:'Furniture',d:r=>{r(4,9,8,6,O);r(5,10,6,4,'#c9965a');r(3,2,4,7,'#3f8f3a');r(7,0,4,9,'#5aa83c');r(10,3,4,6,'#3f8f3a')}},
 anvil:{n:'Anvil',w:1,h:1,c:'Smithy',d:r=>{r(3,9,10,5,O);r(4,10,8,3,'#4a4a52');r(1,3,14,6,O);r(2,4,12,4,'#6e707a');r(2,4,12,1,'#a9aab2');r(0,4,2,3,O)}},
 furnace:{n:'Furnace',w:3,h:3,c:'Smithy',d:(r,t)=>{r(0,4,48,44,O);r(1,5,46,42,'#7a7c76');for(let y=10;y<46;y+=8)r(1,y,46,1,'#5a5b55');r(10,18,28,26,O);r(11,19,26,24,'#1a0e08');r(12,32,24,10,'#e8632e');r(14,28,20,8,'#f2a22e');r(17,24,14,8,'#ffe27a');r(18+t%3,21,4,5,'#fff6c9');r(19,0,10,5,O);r(20,0,8,5,'#6e6f69')}},
 bellows:{n:'Bellows',w:2,h:1,c:'Smithy',d:r=>{r(0,4,28,10,O);r(1,5,26,8,'#8a5a2e');[5,12,19].forEach(x=>r(x,5,1,8,'#5a3a1e'));r(28,7,4,3,O);r(28,8,3,1,'#5a5b63')}},
 quench:{n:'Quench barrel',w:1,h:2,c:'Smithy',d:r=>{r(0,6,16,26,O);r(1,7,14,24,'#6b4423');r(1,10,14,1,'#4a3018');r(1,26,14,1,'#4a3018');r(2,8,12,4,'#3a6a9a');r(3,9,5,1,'#9ad3f0')}},
 toolrack:{n:'Tool rack',w:3,h:1,c:'Smithy',d:r=>{r(0,0,48,3,O);r(1,0,46,2,'#7a5230');for(let i=0;i<4;i++){r(6+i*11,2,2,12,'#5a5b63');r(5+i*11,12,4,3,O)}}},
 weapons:{n:'Weapon rack',w:3,h:1,c:'Smithy',d:r=>{r(0,0,48,3,O);r(1,0,46,2,'#7a5230');for(let i=0;i<3;i++){r(8+i*14,3,3,11,'#c9d2da');r(6+i*14,13,7,2,'#d8b878')}}},
 coal:{n:'Coal bin',w:2,h:1,c:'Smithy',d:r=>{r(0,2,32,14,O);r(1,3,30,12,'#2a2a30');[[4,5],[12,7],[20,5],[8,10],[24,10]].forEach(([x,y])=>{r(x,y,5,4,'#3a3a44');r(x+1,y+1,2,1,'#5a5a66')})}},
 counter4:{n:'Counter (4)',w:4,h:1,c:'Shop',d:r=>{r(0,0,64,22,O);r(1,1,62,6,'#d9a867');r(1,1,62,1,'#f0c88a');r(1,7,62,14,'#8a5a2e');for(let i=5;i<62;i+=14)r(i,9,1,10,'#6b4423');r(1,19,62,2,'#5a3a1e')}},
 counter6:{n:'Counter (6)',w:6,h:1,c:'Shop',d:r=>{r(0,0,96,22,O);r(1,1,94,6,'#d9a867');r(1,1,94,1,'#f0c88a');r(1,7,94,14,'#8a5a2e');for(let i=5;i<94;i+=14)r(i,9,1,10,'#6b4423');r(1,19,94,2,'#5a3a1e')}},
 shelf:{n:'Shelf',w:2,h:1,c:'Shop',d:r=>{r(0,10,32,3,O);r(0,10,32,2,'#7a5230');r(3,3,5,7,'#8fd0f0');r(11,5,6,5,'#c9965a');r(21,4,6,6,'#b8c2cc');r(23,2,2,2,'#f2c14e')}},
 crate:{n:'Crate',w:1,h:1,c:'Shop',d:r=>{r(1,1,14,14,O);r(2,2,12,12,'#a8743f');r(2,2,12,2,'#c9965a');r(7,2,2,12,'#7a5230');r(2,8,12,1,'#7a5230')}},
 barrel:{n:'Barrel',w:1,h:1,c:'Shop',d:r=>{r(1,0,14,16,O);r(2,1,12,14,'#8a5a2e');r(2,4,12,1,'#4a3018');r(2,11,12,1,'#4a3018');r(3,1,3,14,'#a8743f')}},
 sack:{n:'Sack',w:1,h:1,c:'Shop',d:r=>{r(3,5,10,9,O);r(4,6,8,7,'#d8c88a');r(6,3,4,3,O);r(7,4,2,2,'#d8c88a')}},
 window:{n:'Window',w:2,h:1,c:'Wall',d:r=>{r(0,0,28,22,O);r(2,2,24,18,'#8fd0f0');r(2,2,24,6,'#b8e4f8');r(13,2,2,18,O);r(2,10,24,2,O);r(-2,20,32,3,'#a8743f')}},
 lantern:{n:'Lantern',w:1,h:1,c:'Wall',d:(r,t)=>{r(7,0,2,3,O);r(5,3,6,9,O);r(6,4,4,7,t%4?'#ffd96a':'#ffe9a0');r(7,5,2,3,'#fff6c9')}},
 banner:{n:'Banner',w:1,h:2,c:'Wall',d:r=>{r(2,0,12,28,O);r(3,1,10,24,'#c8553d');r(3,25,4,4,'#c8553d');r(9,25,4,4,'#c8553d');r(6,8,4,8,'#f2c14e')}},
 swords:{n:'Crossed swords',w:2,h:1,c:'Wall',d:r=>{for(let i=0;i<12;i++){r(4+i,2+i,2,2,'#c9d2da');r(26-i,2+i,2,2,'#c9d2da')}r(2,12,6,2,'#d8b878');r(24,12,6,2,'#d8b878')}},
 door:{n:'Door',w:1,h:1,c:'Wall',d:r=>{r(1,0,14,16,O);r(2,1,12,15,'#6b4423');r(3,2,10,13,'#8a5a2e');r(10,8,2,2,'#f2c14e');r(0,14,16,2,'#9c3b30')}}
,stool:{n:'Stool',w:1,h:1,c:'Furniture',d:r=>{r(4,6,8,3,O);r(5,6,6,2,'#a8743f');r(5,9,2,6,'#6b4423');r(9,9,2,6,'#6b4423')}},
 bench:{n:'Bench',w:2,h:1,c:'Furniture',d:r=>{r(0,5,32,6,O);r(1,6,30,3,'#a8743f');r(2,11,3,5,'#6b4423');r(27,11,3,5,'#6b4423')}},
 wardrobe:{n:'Wardrobe',w:1,h:2,c:'Furniture',d:r=>{r(0,0,16,32,O);r(1,1,14,30,'#8a5a2e');r(2,2,6,26,'#a8743f');r(9,2,5,26,'#a8743f');r(7,14,1,4,'#f2c14e');r(8,14,1,4,'#f2c14e')}},
 dresser:{n:'Dresser',w:2,h:1,c:'Furniture',d:r=>{r(0,3,32,13,O);r(1,4,30,11,'#8a5a2e');[2,17].forEach(x=>[5,10].forEach(y=>{r(x,y,13,4,'#a8743f');r(x+5,y+1,3,1,'#f2c14e')}))}},
 desk:{n:'Desk',w:2,h:1,c:'Furniture',d:r=>{r(0,4,32,11,O);r(1,5,30,6,'#a8743f');r(4,6,8,4,'#efe3bd');r(20,6,2,3,'#222');r(24,7,5,3,'#c8553d');r(2,11,3,5,'#6b4423');r(27,11,3,5,'#6b4423')}},
 roundtable:{n:'Round table',w:2,h:2,c:'Furniture',d:r=>{r(8,2,16,28,O);r(4,6,24,20,O);r(2,10,28,12,O);r(9,3,14,26,'#a8743f');r(5,7,22,18,'#a8743f');r(3,11,26,10,'#a8743f');r(9,5,14,2,'#c9965a');r(14,26,4,6,'#6b4423')}},
 armchair:{n:'Armchair',w:1,h:1,c:'Furniture',d:r=>{r(2,2,12,12,O);r(3,3,10,10,'#9c3b30');r(3,3,10,3,'#c8553d');r(1,7,3,7,O);r(2,8,1,5,'#c8553d');r(12,7,3,7,O);r(13,8,1,5,'#c8553d')}},
 fireplace:{n:'Fireplace',w:3,h:2,c:'Furniture',g:[24,22,44,'rgba(255,150,50,A)'],d:(r,t)=>{r(0,0,48,32,O);r(1,1,46,30,'#7a7c76');r(0,0,48,5,'#8a5a2e');r(12,8,24,22,O);r(13,9,22,20,'#1a0e08');r(15,20,18,8,'#e8632e');r(18,16,12,8,'#f2a22e');r(21,13+t%2,6,6,'#ffe27a')}},
 cat:{n:'Sleeping cat',w:1,h:1,c:'Furniture',d:r=>{r(3,9,10,5,O);r(4,10,8,3,'#d9803f');r(10,8,4,4,O);r(11,9,2,2,'#d9803f');r(11,8,1,1,O);r(13,8,1,1,O);r(2,12,3,2,O)}},
 vase:{n:'Flower vase',w:1,h:1,c:'Furniture',d:r=>{r(5,8,6,7,O);r(6,9,4,5,'#3b82c4');r(6,3,1,6,'#3f8f3a');r(9,4,1,5,'#3f8f3a');r(4,1,4,3,'#e8785f');r(8,2,4,3,'#f2c14e')}},
 treepot:{n:'Potted tree',w:1,h:2,c:'Furniture',d:r=>{r(3,22,10,9,O);r(4,23,8,7,'#c9965a');r(7,14,2,9,'#6b4423');r(2,2,12,14,O);r(3,3,10,12,'#3f8f3a');r(4,4,5,4,'#5aa83c')}},
 grindstone:{n:'Grindstone',w:1,h:1,c:'Smithy',d:r=>{r(5,3,8,10,O);r(6,4,6,8,'#9aa0a8');r(7,5,2,4,'#c9cac1');r(2,12,12,3,O);r(3,12,10,2,'#6b4423');r(12,6,3,2,O)}},
 forgebench:{n:'Forge bench',w:3,h:1,c:'Smithy',d:r=>{r(0,3,48,13,O);r(1,4,46,5,'#a8743f');r(1,9,46,6,'#8a5a2e');r(6,1,6,3,'#8d8f97');r(8,3,2,1,O);r(20,2,10,2,'#5a5b63');r(36,1,3,3,'#c9d2da')}},
 ingotrack:{n:'Ingot rack',w:2,h:1,c:'Smithy',d:r=>{r(0,2,32,13,O);r(1,3,30,11,'#6b4423');[['#b8c2cc',3],['#d9803f',10],['#cfe3ef',17],['#c9a227',24]].forEach(([c,x])=>{r(x,4,5,3,c);r(x,8,5,3,c)})}},
 trough:{n:'Water trough',w:2,h:1,c:'Smithy',d:r=>{r(0,4,32,10,O);r(1,5,30,8,'#6b4423');r(2,6,28,5,'#3a6a9a');r(3,7,10,1,'#9ad3f0')}},
 armor:{n:'Armour stand',w:1,h:2,c:'Smithy',d:r=>{r(4,2,8,6,O);r(5,3,6,4,'#9aa0a8');r(3,8,10,12,O);r(4,9,8,10,'#8d8f97');r(5,10,2,4,'#c9cac1');r(7,20,2,9,'#6b4423');r(3,29,10,3,O)}},
 horseshoes:{n:'Horseshoes',w:1,h:1,c:'Smithy',d:r=>{[[2,8],[8,6],[5,11]].forEach(([x,y])=>{r(x,y,6,5,O);r(x+1,y+1,4,3,'#9aa0a8');r(x+2,y+3,2,2,O)})}},
 potions:{n:'Potion shelf',w:2,h:1,c:'Shop',d:r=>{r(0,10,32,3,O);r(0,10,32,2,'#7a5230');[['#d83828',3],['#4a9ae0',9],['#7a3ac8',15],['#58d058',21],['#f2c14e',26]].forEach(([c,x])=>{r(x,3,4,7,O);r(x+1,4,2,5,c);r(x+1,2,2,2,'#c8b890')})}},
 display:{n:'Display case',w:2,h:1,c:'Shop',d:r=>{r(0,2,32,13,O);r(1,3,30,11,'#bfe6f6');r(1,3,30,2,'#e4f6fc');r(4,8,8,2,'#c9d2da');r(5,7,2,1,'#d8b878');r(18,7,3,5,'#d83828');r(23,8,5,4,'#f2c14e');r(1,12,30,2,'#8a5a2e')}},
 scale:{n:'Scales',w:1,h:1,c:'Shop',d:r=>{r(7,2,2,10,O);r(2,3,12,2,O);r(1,5,5,2,'#d8b878');r(10,5,5,2,'#d8b878');r(4,12,8,3,O)}},
 sacks:{n:'Sack pile',w:2,h:1,c:'Shop',d:r=>{r(2,6,12,9,O);r(3,7,10,7,'#d8c88a');r(18,4,12,11,O);r(19,5,10,9,'#e0d098');r(22,2,4,3,O);r(7,4,3,3,O)}},
 baskets:{n:'Fruit basket',w:1,h:1,c:'Shop',d:r=>{r(2,8,12,7,O);r(3,9,10,5,'#c9965a');r(4,5,3,4,'#d83828');r(8,5,3,4,'#f2c14e');r(6,4,3,3,'#58d058')}},
 mannequin:{n:'Mannequin',w:1,h:2,c:'Shop',d:r=>{r(5,2,6,6,O);r(6,3,4,4,'#d8c88a');r(3,8,10,14,O);r(4,9,8,12,'#3b82c4');r(7,22,2,8,'#6b4423');r(3,29,10,3,O)}},
 stove:{n:'Stove',w:2,h:1,c:'Kitchen',g:[8,8,24,'rgba(255,140,40,A)'],d:r=>{r(0,3,32,13,O);r(1,4,30,11,'#6e707a');r(4,5,8,2,'#2a2a30');r(18,2,10,5,O);r(19,3,8,3,'#3a3a44');r(4,11,6,3,'#e8632e')}},
 cauldron:{n:'Cauldron',w:1,h:1,c:'Kitchen',g:[8,12,22,'rgba(255,140,40,A)'],d:(r,t)=>{r(2,6,12,9,O);r(3,7,10,7,'#3a3a44');r(3,6,10,2,'#7ac28a');r(5,13,6,3,'#e8632e');r(6+t%3,4,2,2,'#c8f0c0')}},
 kcounter:{n:'Kitchen counter',w:3,h:1,c:'Kitchen',d:r=>{r(0,0,48,20,O);r(1,1,46,5,'#e0d8c0');r(1,6,46,13,'#a8743f');r(6,2,8,3,'#8a5a2e');r(26,0,8,5,O);r(27,1,6,3,'#c9965a')}},
 bar:{n:'Bar counter',w:5,h:1,c:'Kitchen',d:r=>{r(0,0,80,22,O);r(1,1,78,6,'#7a5230');r(1,1,78,1,'#a8743f');[10,30,52].forEach(x=>{r(x,0,4,5,O);r(x+1,1,2,3,'#e8c06a')});r(1,7,78,14,'#5a3a1e');for(let i=4;i<78;i+=12)r(i,9,1,10,'#3d2a14')}},
 keg:{n:'Keg',w:1,h:1,c:'Kitchen',d:r=>{r(2,3,12,12,O);r(3,4,10,10,'#8a5a2e');r(3,7,10,1,'#4a3018');r(3,11,10,1,'#4a3018');r(7,9,2,2,'#f2c14e')}},
 pots:{n:'Hanging pots',w:2,h:1,c:'Kitchen',d:r=>{r(0,0,32,2,O);[[4,'#8d8f97'],[14,'#6a6c74'],[23,'#a8743f']].forEach(([x,c])=>{r(x+2,2,1,4,O);r(x,6,7,6,O);r(x+1,7,5,4,c)})}},
 oven:{n:'Brick oven',w:2,h:2,c:'Kitchen',g:[16,22,34,'rgba(255,140,40,A)'],d:(r,t)=>{r(0,6,32,26,O);r(1,7,30,24,'#a63f30');for(let y=11;y<30;y+=5)r(1,y,30,1,'#7c2c22');r(8,16,16,14,O);r(9,17,14,12,'#1a0e08');r(11,23,10,5,'#e8632e');r(13,20+t%2,6,5,'#f2a22e');r(12,0,8,7,O);r(13,0,6,7,'#6c6a66')}},
 fishrack:{n:'Fish rack',w:2,h:1,c:'Kitchen',d:r=>{r(0,2,32,2,O);[3,9,15,21,27].forEach((x,i)=>{r(x,4,1,3,O);r(x-1,7,4,7,'#b8c2cc');r(x,8,2,2,'#e8eef2');r(x-1,13,1,2,'#8a9aa8')})}},
 alchemy:{n:'Alchemy table',w:2,h:1,c:'Study',g:[16,6,22,'rgba(160,100,255,A)'],d:(r,t)=>{r(0,6,32,9,O);r(1,7,30,5,'#7a5230');r(2,12,3,4,'#4a3018');r(27,12,3,4,'#4a3018');r(5,1,6,6,O);r(6,2,4,4,'#58d058');r(14,0,6,7,O);r(15,1,4,5,'#a060f0');r(15+t%2,0,2,2,'#e0c8ff');r(23,2,5,5,O);r(24,3,3,3,'#d83828')}},
 bookstand:{n:'Book stand',w:1,h:1,c:'Study',d:r=>{r(4,8,8,6,'#8a5a2e');r(2,3,12,6,O);r(3,4,10,4,'#efe3bd');r(8,4,1,4,'#6b4423')}},
 globe:{n:'Globe',w:1,h:1,c:'Study',d:r=>{r(3,2,10,10,O);r(4,3,8,8,'#3b82c4');r(5,4,3,3,'#4caf72');r(9,7,2,2,'#4caf72');r(5,12,6,3,O)}},
 maptable:{n:'Map table',w:2,h:1,c:'Study',d:r=>{r(0,4,32,11,O);r(1,5,30,6,'#d8c88a');r(4,6,10,1,'#8a5a2e');r(14,7,8,1,'#8a5a2e');r(22,6,2,2,'#d83828');r(2,11,3,5,'#6b4423');r(27,11,3,5,'#6b4423')}},
 scrolls:{n:'Scroll rack',w:1,h:1,c:'Study',d:r=>{r(2,2,12,12,O);r(3,3,10,10,'#6b4423');[[4,4],[8,4],[4,8],[8,8]].forEach(([x,y])=>{r(x,y,4,3,'#efe3bd');r(x,y+1,1,1,'#c8553d')})}},
 crystal:{n:'Crystal ball',w:1,h:1,c:'Study',g:[8,7,22,'rgba(150,100,255,A)'],d:r=>{r(4,10,8,5,O);r(5,11,6,3,'#5a3a1e');r(4,3,8,8,O);r(5,4,6,6,'#a8d0ff');r(6,5,2,2,'#e8f4ff')}},
 herbs:{n:'Herb table',w:2,h:1,c:'Study',d:r=>{r(0,6,32,9,O);r(1,7,30,5,'#a8743f');r(2,12,3,4,'#6b4423');r(27,12,3,4,'#6b4423');[[4,'#4f8a3a'],[10,'#6bc04d'],[17,'#3f7f35'],[23,'#78b552']].forEach(([x,c])=>{r(x,1,5,7,c);r(x+2,1,1,7,'#2f5a24')})}},
 anchor:{n:'Anchor',w:1,h:1,c:'Nautical',d:r=>{r(7,1,2,11,'#6a6c74');r(4,3,8,2,'#6a6c74');r(6,0,4,2,'#6a6c74');r(3,10,3,2,'#6a6c74');r(10,10,3,2,'#6a6c74');r(5,12,6,2,'#6a6c74')}},
 wheel:{n:'Ship wheel',w:1,h:1,c:'Nautical',d:r=>{r(2,5,12,6,O);r(5,2,6,12,O);r(3,6,10,4,'#a8743f');r(6,3,4,10,'#a8743f');r(3,3,10,10,'#7a5230');r(5,5,6,6,O);r(6,6,4,4,'#f2c14e')}},
 net:{n:'Fishing net',w:2,h:1,c:'Nautical',d:r=>{for(let x=0;x<32;x+=4)r(x,2,1,13,'#c9a35c');for(let y=2;y<15;y+=4)r(0,y,32,1,'#c9a35c');r(3,6,3,3,'#d83828');r(22,9,3,3,'#f2c14e')}},
 rods:{n:'Rod rack',w:2,h:1,c:'Nautical',d:r=>{r(0,10,32,3,O);r(0,10,32,2,'#7a5230');[4,10,16,22].forEach(x=>{r(x,0,2,11,'#8a5a2e');r(x+1,0,1,2,'#fff')})}},
 buoy:{n:'Lifebuoy',w:1,h:1,c:'Nautical',d:r=>{r(2,2,12,12,O);r(3,3,10,10,'#d83828');r(3,7,10,2,'#efe3bd');r(7,3,2,10,'#efe3bd');r(5,5,6,6,O)}},
 rope:{n:'Rope coil',w:1,h:1,c:'Nautical',d:r=>{r(3,5,10,9,O);r(4,6,8,7,'#c9a35c');r(6,8,4,3,'#8a6a35');r(4,6,8,1,'#e0c07c')}},
 hammock:{n:'Hammock',w:2,h:1,c:'Nautical',d:r=>{r(0,2,3,12,'#6b4423');r(29,2,3,12,'#6b4423');r(3,5,26,3,O);r(4,6,24,5,'#d8c88a');r(8,10,16,2,'#b8a870')}},
 porthole:{n:'Porthole',w:1,h:1,c:'Nautical',d:r=>{r(2,2,12,12,'#8a6a35');r(4,4,8,8,'#8fd0f0');r(4,4,8,3,'#c8ecf8');r(7,4,2,8,'#8a6a35');r(4,7,8,2,'#8a6a35')}},
 swin:{n:'Small window',w:1,h:1,c:'Wall',d:r=>{r(1,2,14,12,O);r(3,4,10,8,'#8fd0f0');r(7,4,2,8,O);r(3,7,10,1,O)}},
 curtains:{n:'Curtains',w:2,h:1,c:'Wall',d:r=>{r(0,0,28,2,'#6b4423');r(0,2,7,20,'#9c3b30');r(21,2,7,20,'#9c3b30');r(2,2,1,20,'#7c2c22');r(24,2,1,20,'#7c2c22')}},
 painting:{n:'Painting',w:1,h:1,c:'Wall',d:r=>{r(2,2,12,10,'#d8b878');r(3,3,10,8,'#4a82b8');r(3,8,10,3,'#4caf72');r(10,4,2,2,'#f2c14e')}},
 paintingw:{n:'Wide painting',w:2,h:1,c:'Wall',d:r=>{r(2,2,28,11,'#d8b878');r(3,3,26,9,'#7ab8e0');r(3,8,26,4,'#4a8a3a');r(8,6,6,3,'#2f6f4a');r(22,4,3,3,'#f2c14e')}},
 shield:{n:'Shield',w:1,h:1,c:'Wall',d:r=>{r(3,1,10,12,O);r(4,2,8,10,'#3b82c4');r(7,2,2,10,'#f2c14e');r(5,5,6,2,'#f2c14e');r(5,12,6,1,O)}},
 clock:{n:'Wall clock',w:1,h:1,c:'Wall',d:r=>{r(3,1,10,12,'#6b4423');r(4,2,8,8,'#efe3bd');r(7,3,1,4,O);r(7,6,3,1,O);r(6,11,4,3,'#f2c14e')}},
 mirror:{n:'Mirror',w:1,h:1,c:'Wall',d:r=>{r(3,0,10,14,'#d8b878');r(4,1,8,12,'#cfe8f0');r(5,2,2,5,'#fff')}},
 wmap:{n:'Wall map',w:2,h:1,c:'Wall',d:r=>{r(0,2,28,12,O);r(1,3,26,10,'#d8c88a');r(5,5,8,5,'#a8c878');r(15,7,8,4,'#a8c878');r(20,5,2,2,'#d83828')}},
 sconce:{n:'Torch sconce',w:1,h:1,c:'Light',g:[8,5,30,'rgba(255,170,60,A)'],d:(r,t)=>{r(6,6,4,8,'#6b4423');r(5,5,6,2,O);r(6,1+t%2,4,5,'#f2a22e');r(7,2,2,3,'#ffe27a')}},
 lamp:{n:'Floor lamp',w:1,h:2,c:'Light',g:[8,7,40,'rgba(255,220,120,A)'],d:r=>{r(7,10,2,18,O);r(4,26,8,4,O);r(3,2,10,9,O);r(4,3,8,7,'#ffd96a');r(5,4,4,3,'#fff6c9')}},
 candle:{n:'Candle',w:1,h:1,c:'Light',g:[8,6,18,'rgba(255,200,100,A)'],d:(r,t)=>{r(6,8,4,6,O);r(7,9,2,5,'#efe3bd');r(7,5+t%2,2,3,'#f2a22e');r(7,6,1,1,'#ffe27a')}},
 brazier:{n:'Brazier',w:1,h:1,c:'Light',g:[8,6,34,'rgba(255,140,40,A)'],d:(r,t)=>{r(3,9,10,5,O);r(4,10,8,3,'#4a4a52');r(5,3+t%2,6,7,'#e8632e');r(6,2,4,6,'#f2a22e');r(7,4,2,4,'#ffe27a')}},
 candelabra:{n:'Candelabra',w:1,h:1,c:'Light',g:[8,4,26,'rgba(255,200,100,A)'],d:(r,t)=>{r(7,6,2,8,'#c9a227');r(3,5,10,2,'#c9a227');r(2,10,12,3,O);[3,7,11].forEach(x=>{r(x,2,2,3,'#efe3bd');r(x,0+t%2,2,2,'#f2a22e')})}},
 dbl:{n:'Double door',w:2,h:1,c:'Doors',d:r=>{r(1,0,30,16,O);r(2,1,14,15,'#8a5a2e');r(16,1,14,15,'#8a5a2e');r(15,1,2,15,O);r(13,8,2,2,'#f2c14e');r(17,8,2,2,'#f2c14e');r(0,14,32,2,'#9c3b30')}},
 stairs:{n:'Stairs',w:1,h:2,c:'Doors',d:r=>{r(0,0,16,32,O);for(let i=0;i<6;i++){r(1,1+i*5,14,4,'#a8743f');r(1,4+i*5,14,2,'#6b4423')}}},
 arch:{n:'Archway',w:2,h:1,c:'Doors',d:r=>{r(0,0,32,16,'#7a7c76');r(4,3,24,13,O);r(2,5,2,11,O);r(28,5,2,11,O);r(6,2,20,3,O);r(5,6,22,10,'#2a1b14')}},
 trap:{n:'Trapdoor',w:1,h:1,c:'Doors',z:0,d:r=>{r(1,2,14,12,O);r(2,3,12,10,'#6b4423');r(2,7,12,1,'#4a3018');r(6,5,4,2,'#f2c14e')}},
jewelcase:{n:'Jewel case',w:3,h:1,c:'Goldsmith',d:r=>{r(0,2,48,16,O);r(1,3,46,13,'#bfe6f6');r(1,3,46,2,'#e4f6fc');[[4,'#d83828'],[12,'#4a9ae0'],[20,'#58d058'],[28,'#f2c14e'],[36,'#a060f0']].forEach(([x,c])=>{r(x,8,5,4,O);r(x+1,9,3,2,c);r(x+1,9,1,1,'#fff')});r(1,13,46,3,'#8a5a2e')}},
 gembench:{n:'Jeweller bench',w:2,h:1,c:'Goldsmith',g:[5,3,22,'rgba(255,220,120,A)'],d:r=>{r(0,5,32,10,O);r(1,6,30,5,'#a8743f');r(2,11,3,5,'#6b4423');r(27,11,3,5,'#6b4423');r(4,0,2,6,O);r(2,0,6,2,'#c9a227');r(14,6,5,4,O);r(15,7,3,2,'#cfe8f0');r(22,7,6,2,'#c9d2da')}},
 safe:{n:'Iron safe',w:1,h:1,c:'Goldsmith',d:r=>{r(1,1,14,14,O);r(2,2,12,12,'#5a5b63');r(3,3,10,10,'#7a7c86');r(7,6,4,4,O);r(8,7,2,2,'#f2c14e');r(3,3,10,1,'#9a9ca6')}},
 goldstack:{n:'Gold ingots',w:1,h:1,c:'Goldsmith',d:r=>{[[1,10],[8,10],[4,6]].forEach(([x,y])=>{r(x,y,7,4,O);r(x+1,y,5,3,'#f2c14e');r(x+1,y,5,1,'#ffe27a')})}},
 bust:{n:'Jewel bust',w:1,h:1,c:'Goldsmith',d:r=>{r(5,2,6,5,O);r(6,3,4,3,'#d8b878');r(3,7,10,6,O);r(4,8,8,4,'#4a3018');r(5,8,6,1,'#f2c14e');r(7,9,2,2,'#d83828');r(4,13,8,2,O)}},
 crucible:{n:'Crucible',w:1,h:1,c:'Goldsmith',g:[8,8,22,'rgba(255,190,60,A)'],d:(r,t)=>{r(3,9,10,6,O);r(4,10,8,4,'#4a4a52');r(5,5,6,5,O);r(6,6,4,3,'#f2c14e');r(7,5+t%2,2,2,'#fff6c9');r(5,13,6,2,'#e8632e')}},
 rings:{n:'Ring tray',w:1,h:1,c:'Goldsmith',d:r=>{r(2,6,12,8,O);r(3,7,10,6,'#6b2a2a');r(4,8,3,3,'#f2c14e');r(5,9,1,1,'#6b2a2a');r(9,9,3,3,'#cfe3ef');r(10,10,1,1,'#6b2a2a')}},
 chandelier:{n:'Chandelier',w:2,h:1,c:'Goldsmith',g:[16,8,44,'rgba(255,210,110,A)'],d:(r,t)=>{r(15,0,2,5,O);r(2,5,28,2,'#c9a227');r(6,7,2,3,'#c9a227');r(24,7,2,3,'#c9a227');[3,9,15,21,27].forEach(x=>{r(x,2,2,3,'#efe3bd');r(x,0+t%2,2,2,'#f2a22e')})}},
 dummy:{n:'Training dummy',w:1,h:2,c:'Guild',d:r=>{r(7,10,2,18,'#6b4423');r(4,8,8,10,O);r(5,9,6,8,'#d8c88a');r(5,2,6,6,O);r(6,3,4,4,'#d8c88a');r(1,9,14,3,O);r(2,10,12,1,'#8a5a2e');r(3,28,10,3,O);r(6,12,4,1,'#c8553d')}},
 target:{n:'Archery target',w:1,h:1,c:'Guild',d:r=>{r(1,1,14,14,O);r(2,2,12,12,'#efe3bd');r(4,4,8,8,'#d83828');r(6,6,4,4,'#efe3bd');r(7,7,2,2,'#f2c14e');r(10,5,1,5,'#c9a06a')}},
 sparring:{n:'Sparring mat',w:3,h:3,c:'Guild',z:0,d:r=>{r(0,0,48,48,O);r(2,2,44,44,'#9c3b30');r(6,6,36,36,'#c8553d');r(23,6,2,36,'#9c3b30');r(6,23,36,2,'#9c3b30')}},
 notices:{n:'Notice board',w:2,h:1,c:'Guild',d:r=>{r(0,0,32,18,O);r(1,1,30,16,'#a8743f');r(4,3,7,9,'#efe3bd');r(14,4,6,8,'#f2e8c8');r(23,3,6,10,'#efe3bd');r(7,3,1,1,'#d83828');r(16,4,1,1,'#d83828');r(25,3,1,1,'#d83828')}},
 punchbag:{n:'Punch bag',w:1,h:2,c:'Guild',d:r=>{r(7,0,2,6,O);r(4,6,8,18,O);r(5,7,6,16,'#a8743f');r(5,7,2,16,'#c9965a');r(5,12,6,1,'#6b4423');r(5,18,6,1,'#6b4423')}},
 weights:{n:'Weights',w:1,h:1,c:'Guild',d:r=>{r(1,5,3,7,O);r(2,6,1,5,'#5a5b63');r(12,5,3,7,O);r(13,6,1,5,'#5a5b63');r(3,8,10,2,'#8d8f97')}},
 trophies:{n:'Trophy shelf',w:2,h:1,c:'Guild',d:r=>{r(0,10,32,3,O);r(0,10,32,2,'#7a5230');[[4,5],[13,3],[22,5]].forEach(([x,h])=>{r(x,10-h-2,6,h+2,O);r(x+1,10-h-1,4,h+1,'#f2c14e');r(x+2,10,2,1,O)})}},
 bows:{n:'Bow rack',w:2,h:1,c:'Guild',d:r=>{r(0,0,32,2,O);[4,12,20].forEach(x=>{r(x,2,2,13,'#8a5a2e');r(x+3,3,1,11,'#efe3bd')});r(27,3,3,11,O);r(28,4,1,9,'#c9a06a')}},
 spears:{n:'Spear barrel',w:1,h:1,c:'Guild',d:r=>{r(2,8,12,8,O);r(3,9,10,7,'#8a5a2e');[4,7,10].forEach(x=>{r(x,0,1,10,'#c9a06a');r(x-1,0,3,2,'#c9d2da')})}},
 produce:{n:'Produce stand',w:2,h:1,c:'Grocery',d:r=>{r(0,4,32,12,O);r(1,5,30,10,'#a8743f');r(3,2,5,4,'#e8762f');r(10,3,6,4,'#6fae4c');r(18,2,5,5,'#d83828');r(25,3,5,4,'#f2c14e');r(1,10,30,1,'#7a5230')}},
 vegbin:{n:'Vegetable bin',w:1,h:1,c:'Grocery',d:r=>{r(1,6,14,9,O);r(2,7,12,7,'#8a5a2e');r(3,4,10,4,'#b08850');r(5,5,2,2,'#c9a06a');r(9,4,2,2,'#c9a06a')}},
 bread:{n:'Bread baskets',w:2,h:1,c:'Grocery',d:r=>{r(0,6,32,9,O);r(1,7,30,7,'#c9965a');[[4,'#d9a050'],[12,'#e0b060'],[21,'#d9a050']].forEach(([x,c])=>{r(x,3,6,5,c);r(x+1,4,1,2,'#a8743f');r(x+3,4,1,2,'#a8743f')})}},
 cheese:{n:'Cheese',w:1,h:1,c:'Grocery',d:r=>{r(2,7,9,6,O);r(3,8,7,4,'#f2c14e');r(5,9,1,1,'#c9a227');r(9,5,6,6,O);r(10,6,4,4,'#ffe27a')}},
 sausages:{n:'Hanging sausages',w:2,h:1,c:'Grocery',d:r=>{r(0,0,32,2,O);[3,9,15,21,27].forEach(x=>{r(x,2,1,2,O);r(x-1,4,3,9,'#a04030');r(x-1,6,3,1,'#6b2a20')})}},
 butcher:{n:'Butcher counter',w:3,h:1,c:'Grocery',d:r=>{r(0,0,48,20,O);r(1,1,46,5,'#efe3bd');r(6,2,9,4,'#c83030');r(7,3,3,1,'#f0a0a0');r(28,2,10,3,'#c9d2da');r(1,6,46,13,'#8a5a2e')}},
 milk:{n:'Milk cans',w:1,h:1,c:'Grocery',d:r=>{r(3,4,5,11,O);r(4,5,3,9,'#c9d2da');r(3,3,5,2,'#8d8f97');r(9,6,5,9,O);r(10,7,3,7,'#c9d2da');r(9,5,5,2,'#8d8f97')}},
 icebox:{n:'Ice box',w:1,h:2,c:'Grocery',d:r=>{r(0,0,16,32,O);r(1,1,14,30,'#cfe3ef');r(2,2,12,12,'#e6f2f8');r(2,16,12,13,'#e6f2f8');r(11,6,2,3,'#8d8f97');r(11,21,2,3,'#8d8f97')}},
 eggs:{n:'Egg basket',w:1,h:1,c:'Grocery',d:r=>{r(2,8,12,7,O);r(3,9,10,5,'#c9965a');[[4,6],[7,5],[10,6]].forEach(([x,y])=>{r(x,y,3,4,'#f4f4f0');r(x,y+1,1,2,'#d8d0c0')})}},
 garlic:{n:'Hanging garlic',w:1,h:1,c:'Grocery',d:r=>{r(7,0,2,3,O);r(4,3,4,5,'#efe3bd');r(8,4,4,5,'#e8e0d0');r(5,8,2,2,'#c9a06a');r(9,9,2,2,'#c9a06a');r(5,2,1,2,'#3f8f3a');r(10,3,1,2,'#3f8f3a')}},
 bolts:{n:'Cloth shelves',w:2,h:2,c:'Tailor',d:r=>{r(0,0,32,32,O);r(1,1,30,30,'#6b4423');[['#3b82c4','#9c3b30','#4caf72','#f2c14e'],['#a060f0','#efe3bd','#d8683c','#58b0a0'],['#c8553d','#4a82b8','#e8c06a','#6a6c74']].forEach((row,i)=>row.forEach((c,k)=>{r(3+k*7,3+i*10,6,8,O);r(4+k*7,4+i*10,4,6,c)}))}},
 cutting:{n:'Cutting table',w:3,h:1,c:'Tailor',d:r=>{r(0,4,48,11,O);r(1,5,46,6,'#d9a867');r(4,5,18,5,'#3b82c4');r(5,6,6,1,'#5aa0e0');r(28,6,8,2,'#c9d2da');r(38,7,6,3,'#f2c14e');r(2,11,3,5,'#6b4423');r(43,11,3,5,'#6b4423')}},
 treadle:{n:'Sewing machine',w:1,h:1,c:'Tailor',d:r=>{r(2,3,12,5,O);r(3,4,10,3,'#2a2a30');r(11,2,3,4,O);r(3,8,2,7,O);r(11,8,2,7,O);r(5,12,6,3,'#c9a227');r(4,9,8,1,'#6b4423')}},
 fitmirror:{n:'Fitting mirror',w:1,h:2,c:'Tailor',d:r=>{r(1,0,14,32,O);r(2,1,12,28,'#cfe8f0');r(4,3,2,8,'#fff');r(2,29,3,3,O);r(11,29,3,3,O)}},
 spools:{n:'Thread rack',w:2,h:1,c:'Tailor',d:r=>{r(0,0,32,16,'#6b4423');r(1,1,30,14,'#4a3018');['#d83828','#f2c14e','#4caf72','#3b82c4','#a060f0','#efe3bd'].forEach((c,i)=>{r(3+(i%3)*10,2+((i/3)|0)*7,5,6,c);r(3+(i%3)*10,2+((i/3)|0)*7,5,1,'#fff')})}},
 clothes:{n:'Clothes rail',w:2,h:1,c:'Tailor',d:r=>{r(0,0,32,2,O);[[3,'#3b82c4'],[12,'#9c3b30'],[21,'#4caf72']].forEach(([x,c])=>{r(x+3,2,1,2,O);r(x,4,8,11,O);r(x+1,5,6,9,c)})}},
 hats:{n:'Hat stand',w:1,h:1,c:'Tailor',d:r=>{r(7,8,2,7,O);r(5,13,6,2,O);r(4,3,8,3,'#6b4423');r(2,5,12,2,'#6b4423');r(5,2,6,2,'#8a5a2e')}},
 platform:{n:'Fitting platform',w:1,h:1,c:'Tailor',z:0,d:r=>{r(1,3,14,11,O);r(2,4,12,9,'#a8743f');r(2,4,12,2,'#c9965a')}},
 bchair:{n:'Barber chair',w:1,h:2,c:'Barber',d:r=>{r(2,2,12,18,O);r(3,3,10,16,'#9c3b30');r(3,3,10,4,'#c8553d');r(0,10,3,7,'#8d8f97');r(13,10,3,7,'#8d8f97');r(4,20,8,5,'#8d8f97');r(6,25,4,5,'#4a4a52');r(3,30,10,2,O)}},
 bpole:{n:'Barber pole',w:1,h:2,c:'Barber',d:r=>{r(5,2,6,26,O);for(let y=3;y<27;y+=6){r(6,y,4,2,'#d83828');r(6,y+2,4,2,'#efe3bd');r(6,y+4,4,2,'#3b82c4')}r(4,0,8,3,'#c9a227');r(4,28,8,3,'#c9a227')}},
 basin:{n:'Wash basin',w:1,h:1,c:'Barber',d:r=>{r(2,6,12,8,O);r(3,7,10,5,'#efe3bd');r(4,8,8,3,'#8fd0f0');r(7,2,2,5,'#c9a227');r(9,2,3,1,'#c9a227')}},
 bmirror:{n:'Barber mirror',w:2,h:1,c:'Barber',d:r=>{r(0,0,32,12,'#8a5a2e');r(2,1,28,10,'#cfe8f0');r(5,2,2,6,'#fff');r(0,12,32,3,O);[[4,'#58d058'],[11,'#4a9ae0'],[18,'#d83828'],[25,'#f2c14e']].forEach(([x,c])=>{r(x,8,3,4,O);r(x+1,9,1,3,c)})}},
 razors:{n:'Razor tray',w:1,h:1,c:'Barber',d:r=>{r(2,7,12,6,O);r(3,8,10,4,'#c9d2da');r(4,9,6,1,'#8d8f97');r(10,9,3,2,'#6b4423')}},
 towels:{n:'Towel stack',w:1,h:1,c:'Barber',d:r=>{r(3,5,10,10,O);r(4,6,8,3,'#efe3bd');r(4,9,8,3,'#8fd0f0');r(4,12,8,2,'#efe3bd')}},
 logs:{n:'Log stack',w:2,h:1,c:'Lumber',d:r=>{r(0,4,32,12,O);[2,9,16,23].forEach(x=>{r(x,6,6,6,'#8a5a2e');r(x+1,7,4,4,'#d9b27a');r(x+2,8,2,2,'#a8743f')});[5,12,19].forEach(x=>{r(x,1,6,6,O);r(x+1,2,4,4,'#d9b27a');r(x+2,3,2,2,'#a8743f')})}},
 planks:{n:'Plank pile',w:2,h:1,c:'Lumber',d:r=>{r(0,4,32,12,O);[5,8,11,14].forEach((y,i)=>{r(1,y,30,3,i%2?'#c49a62':'#d9b27a');r(1,y+2,30,1,'#a8743f')})}},
 sawhorse:{n:'Sawhorse',w:2,h:1,c:'Lumber',d:r=>{r(2,4,28,4,O);r(3,5,26,2,'#a8743f');r(4,8,2,8,'#6b4423');r(26,8,2,8,'#6b4423');r(6,1,20,5,O);r(7,2,18,3,'#8a5a2e');r(9,2,1,3,'#d9b27a')}},
 bandsaw:{n:'Saw mill',w:2,h:2,c:'Lumber',d:r=>{r(0,10,32,22,O);r(1,11,30,20,'#6e707a');r(9,0,14,13,O);r(10,1,12,11,'#c9cac1');r(13,4,6,5,'#6e707a');r(24,14,6,9,'#3a3a44');r(2,18,10,6,'#8a5a2e');r(3,19,8,2,'#d9b27a')}},
 chopblock:{n:'Chopping block',w:1,h:1,c:'Lumber',d:r=>{r(3,7,10,8,O);r(4,8,8,6,'#a8743f');r(4,8,8,2,'#d9b27a');r(7,0,2,9,'#7a5230');r(6,0,5,4,'#9aa0a8')}},
 barrow:{n:'Wheelbarrow',w:1,h:1,c:'Lumber',d:r=>{r(2,7,12,6,O);r(3,8,10,4,'#8a5a2e');r(11,11,4,4,O);r(12,12,2,2,'#6a6c74');r(2,13,2,2,O);r(0,6,4,2,'#6b4423')}},
 sawdust:{n:'Sawdust',w:1,h:1,c:'Lumber',z:0,d:r=>{r(2,8,12,6,'#e0c07c');r(4,6,8,4,'#ebd08c');r(3,12,3,1,'#c9a860');r(9,9,3,1,'#c9a860')}},
 saws:{n:'Hanging saws',w:2,h:1,c:'Lumber',d:r=>{r(0,0,32,2,O);r(2,3,28,3,'#c9d2da');for(let i=0;i<14;i++)r(2+i*2,6,1,2,'#c9d2da');r(4,10,24,3,'#aab2ba');for(let i=0;i<12;i++)r(4+i*2,13,1,2,'#aab2ba');r(0,3,3,5,'#6b4423')}},
 logcart:{n:'Log cart',w:2,h:1,c:'Lumber',d:r=>{r(0,8,32,6,O);r(1,9,30,4,'#8a5a2e');r(3,1,26,8,O);[4,11,18,25].forEach(x=>{r(x,2,6,6,'#a8743f');r(x+1,3,4,4,'#d9b27a')});r(4,12,6,6,O);r(5,13,4,4,'#6a6c74');r(22,12,6,6,O);r(23,13,4,4,'#6a6c74')}},
 tallshelf:{n:'Stocked shelves',w:2,h:2,c:'Shop',d:r=>{r(0,0,32,32,O);r(1,1,30,30,'#6b4423');[3,13,23].forEach((y,i)=>{r(2,y,28,8,'#4a3018');[['#d83828','#f2c14e','#4a9ae0','#58d058'],['#efe3bd','#8d8f97','#d8683c','#a060f0'],['#c9965a','#d8c88a','#3b82c4','#c8553d']][i].forEach((c,k)=>{r(4+k*7,y+1,5,6,c);r(4+k*7,y+1,5,1,'#fff')})})}},
 toolwall:{n:'Tool wall',w:3,h:1,c:'Shop',d:r=>{r(0,0,48,3,O);r(1,0,46,2,'#7a5230');r(6,3,2,12,'#7a5230');r(4,13,6,3,'#9aa0a8');r(16,3,2,12,'#7a5230');r(14,3,6,3,'#9aa0a8');r(26,3,2,13,'#7a5230');r(24,3,6,4,O);r(36,3,6,3,'#c9d2da');for(let i=0;i<5;i++)r(36+i,6+i,1,1,'#c9d2da')}},
 coinbox:{n:'Coin box',w:1,h:1,c:'Shop',d:r=>{r(2,6,12,8,O);r(3,7,10,6,'#6b4423');r(3,7,10,2,'#8a5a2e');r(7,9,2,3,'#f2c14e');r(4,3,3,3,'#f2c14e');r(8,4,3,2,'#f2c14e')}},
 chalk:{n:'Sale board',w:1,h:1,c:'Shop',d:r=>{r(1,1,14,13,'#8a5a2e');r(2,2,12,11,'#2f3a2e');r(4,4,8,1,'#efe3bd');r(4,7,5,1,'#efe3bd');r(4,10,8,1,'#f2c14e')}},
carpbench:{n:'Woodworking bench',w:3,h:1,c:'Carpenter',d:r=>{r(0,4,48,11,O);r(1,5,46,5,'#d9b27a');r(1,5,46,1,'#ecd0a0');r(1,10,46,4,'#a8743f');r(40,2,5,7,O);r(41,3,3,5,'#6a6c74');r(8,3,10,3,O);r(9,3,8,2,'#8a5a2e');r(10,2,2,2,'#c9965a');r(22,4,3,2,'#f0d8a0');r(28,4,4,2,'#f0d8a0');r(2,11,3,5,'#6b4423');r(43,11,3,5,'#6b4423')}},
 lathe:{n:'Wood lathe',w:2,h:1,c:'Carpenter',d:r=>{r(0,6,32,9,O);r(1,7,30,6,'#6e707a');r(4,4,24,4,O);r(5,5,22,2,'#d9b27a');r(2,3,5,8,O);r(3,4,3,6,'#4a4a52');r(25,3,5,8,O);r(26,4,3,6,'#4a4a52');r(2,13,3,3,O);r(27,13,3,3,O)}},
 timber:{n:'Timber rack',w:2,h:2,c:'Carpenter',d:r=>{r(0,0,32,32,O);r(1,1,30,30,'#4a3018');['#d9b27a','#c49a62','#a8743f','#d9b27a','#8a5a2e'].forEach((c,i)=>{r(3+i*5,3,4,27,c);r(3+i*5,3,1,27,'#ecd0a0')});r(0,0,32,3,'#6b4423');r(0,28,32,3,'#6b4423')}},
 chairframe:{n:'Chair in progress',w:1,h:1,c:'Carpenter',d:r=>{r(3,1,2,13,'#d9b27a');r(11,1,2,13,'#d9b27a');r(3,5,10,2,'#c49a62');r(3,9,10,2,'#d9b27a');r(3,13,2,2,'#c49a62');r(11,13,2,2,'#c49a62');r(4,2,8,1,'#ecd0a0')}},
 cabframe:{n:'Cabinet frame',w:1,h:2,c:'Carpenter',d:r=>{r(0,0,16,32,O);r(1,1,14,30,'#5a3f28');r(1,1,3,30,'#d9b27a');r(12,1,3,30,'#d9b27a');r(1,1,14,3,'#d9b27a');r(1,14,14,2,'#c49a62');r(1,28,14,3,'#d9b27a')}},
 chisels:{n:'Chisel rack',w:2,h:1,c:'Carpenter',d:r=>{r(0,0,32,3,O);r(1,0,30,2,'#7a5230');[4,9,14,19].forEach(x=>{r(x,3,3,6,'#8a5a2e');r(x+1,9,1,5,'#c9d2da')});r(25,3,6,5,O);r(26,4,4,3,'#a8743f');r(27,8,2,6,'#8a5a2e')}},
 clamps:{n:'Clamps',w:2,h:1,c:'Carpenter',d:r=>{r(0,0,32,2,O);[3,14,23].forEach((x,i)=>{r(x,2,2,12,'#8d8f97');r(x-2,4,6,2,'#8d8f97');r(x-2,10+i%2,6,2,'#6a6c74');r(x-3,12,3,3,'#c8553d')})}},
 shavings:{n:'Wood shavings',w:1,h:1,c:'Carpenter',z:0,d:r=>{[[2,9,5],[8,6,4],[5,12,5],[10,11,4]].forEach(([x,y,w])=>{r(x,y,w,2,'#f0d8a0');r(x+1,y-1,w-2,1,'#f8e8bc');r(x,y+1,1,1,'#d9b27a')})}},
 varnish:{n:'Varnish cans',w:1,h:1,c:'Carpenter',d:r=>{r(2,7,6,8,O);r(3,8,4,6,'#8d8f97');r(3,9,4,2,'#c8553d');r(9,9,5,6,O);r(10,10,3,4,'#8d8f97');r(10,6,1,5,'#6b4423');r(9,4,3,3,'#8a5a2e')}},
 plans:{n:'Plans table',w:2,h:1,c:'Carpenter',d:r=>{r(0,4,32,11,O);r(1,5,30,6,'#3b82c4');r(4,6,10,1,'#cfe8f0');r(4,8,6,1,'#cfe8f0');r(16,6,2,4,'#cfe8f0');r(20,7,8,1,'#cfe8f0');r(24,5,4,3,'#c9d2da');r(2,11,3,5,'#6b4423');r(27,11,3,5,'#6b4423')}},
 drawers:{n:'Drawer stack',w:1,h:1,c:'Carpenter',d:r=>{r(2,3,12,12,O);r(3,4,10,4,'#c9965a');r(3,9,10,4,'#c9965a');r(7,5,2,1,'#f2c14e');r(7,10,2,1,'#f2c14e')}},
 sofa:{n:'Sofa',w:2,h:1,c:'Furniture',d:r=>{r(0,2,32,14,O);r(1,3,30,5,'#4a82b8');r(1,3,30,2,'#6aa2d8');r(1,8,30,6,'#3b6fa0');r(0,5,4,10,O);r(1,6,2,8,'#4a82b8');r(28,5,4,10,O);r(29,6,2,8,'#4a82b8');r(4,14,3,2,'#6b4423');r(25,14,3,2,'#6b4423')}},
 grandclock:{n:'Grandfather clock',w:1,h:2,c:'Furniture',d:r=>{r(2,0,12,32,O);r(3,1,10,30,'#8a5a2e');r(4,3,8,8,'#efe3bd');r(7,4,1,4,O);r(7,7,3,1,O);r(5,14,6,13,'#4a3018');r(7,18,2,6,'#f2c14e');r(3,29,10,3,'#6b4423')}},
 rocker:{n:'Rocking chair',w:1,h:1,c:'Furniture',d:r=>{r(3,1,2,10,'#a8743f');r(4,2,7,1,'#c9965a');r(3,7,10,2,'#a8743f');r(11,5,2,5,'#a8743f');r(1,12,14,2,O);r(2,12,12,1,'#8a5a2e')}},
 cradle:{n:'Cradle',w:1,h:1,c:'Furniture',d:r=>{r(1,5,14,8,O);r(2,6,12,6,'#c9965a');r(3,7,10,3,'#efe3bd');r(3,7,10,1,'#8fd0f0');r(0,13,16,2,'#8a5a2e')}},
 sideboard:{n:'Sideboard',w:3,h:1,c:'Furniture',d:r=>{r(0,0,48,16,O);r(1,1,46,3,'#c9965a');r(1,4,46,11,'#8a5a2e');[[3,13],[18,13],[33,13]].forEach(([x])=>{r(x,5,12,9,'#a8743f');r(x+5,8,2,2,'#f2c14e')})}},
reception:{n:'Reception desk',w:3,h:1,c:'Inn',d:r=>{r(0,0,48,20,O);r(1,1,46,5,'#d9a867');r(1,6,46,13,'#8a5a2e');r(6,0,5,3,'#f2c14e');r(18,1,9,4,'#efe3bd');r(19,2,7,1,'#6b4423');r(31,1,1,4,'#222');r(38,2,4,3,'#c9a227')}},
 keyrack:{n:'Key rack',w:1,h:1,c:'Inn',d:r=>{r(1,1,14,12,'#6b4423');r(2,2,12,10,'#4a3018');[4,8,11].forEach(x=>{r(x,3,1,5,'#c9a227');r(x-1,8,3,3,'#c9a227')})}},
 luggage:{n:'Luggage',w:1,h:1,c:'Inn',d:r=>{r(1,6,11,8,O);r(2,7,9,6,'#8a5a2e');r(2,7,9,2,'#a8743f');r(5,9,2,2,'#f2c14e');r(10,3,5,8,O);r(11,4,3,6,'#6b4423');r(12,2,1,2,O)}},
 coatrack:{n:'Coat rack',w:1,h:1,c:'Inn',d:r=>{r(7,2,2,12,'#6b4423');r(3,3,10,2,'#6b4423');r(2,5,4,7,'#3b82c4');r(10,5,4,7,'#9c3b30');r(4,13,8,2,O)}},
 nightstand:{n:'Nightstand',w:1,h:1,c:'Inn',g:[8,2,14,'rgba(255,200,100,A)'],d:(r,t)=>{r(3,5,10,10,O);r(4,6,8,8,'#a8743f');r(5,8,6,3,'#c9965a');r(7,9,2,1,'#f2c14e');r(7,2,2,4,'#efe3bd');r(7,1+t%2,2,1,'#f2a22e')}},
 washstand:{n:'Wash stand',w:1,h:1,c:'Inn',d:r=>{r(2,7,12,8,O);r(3,8,10,6,'#a8743f');r(4,5,8,3,O);r(5,5,6,2,'#8fd0f0');r(10,1,4,6,O);r(11,2,2,4,'#efe3bd')}},
 runner:{n:'Hall runner',w:1,h:3,c:'Inn',z:0,d:r=>{r(2,0,12,48,O);r(3,0,10,48,'#9c3b30');r(5,0,6,48,'#c8553d');for(let y=4;y<46;y+=8)r(7,y,2,2,'#e8c06a')}},
 roomdoor:{n:'Room door',w:1,h:1,c:'Inn',d:r=>{r(1,0,14,16,O);r(2,1,12,15,'#6b4423');r(3,2,10,13,'#8a5a2e');r(5,3,6,3,'#c9a227');r(7,4,2,1,O);r(10,9,2,2,'#f2c14e')}},
 footchest:{n:'Chest at bed foot',w:2,h:1,c:'Inn',d:r=>{r(0,4,32,11,O);r(1,5,30,9,'#6b4423');r(1,5,30,3,'#8a5a2e');r(14,8,4,3,'#f2c14e')}},
 vanity:{n:'Vanity',w:1,h:1,c:'Inn',d:r=>{r(2,7,12,8,O);r(3,8,10,6,'#a8743f');r(4,0,8,8,O);r(5,1,6,6,'#cfe8f0');r(6,2,1,3,'#fff')}},
 screen:{n:'Folding screen',w:2,h:1,c:'Inn',d:r=>{r(0,0,32,16,O);[1,11,21].forEach(x=>{r(x,1,10,14,'#b8473a');r(x+4,4,2,6,'#f2c14e')})}},
 longtable:{n:'Long table',w:3,h:1,c:'Tavern',d:r=>{r(0,4,48,11,O);r(1,5,46,6,'#a8743f');r(1,5,46,1,'#c9965a');[6,20,36].forEach(x=>{r(x,2,3,3,'#e8c06a');r(x,4,3,1,O)});r(28,6,5,2,'#efe3bd');r(40,6,5,2,'#efe3bd');r(2,11,3,5,'#6b4423');r(43,11,3,5,'#6b4423')}},
 booth:{n:'Booth seat',w:2,h:1,c:'Tavern',d:r=>{r(0,0,32,16,O);r(1,1,30,6,'#9c3b30');r(1,7,30,7,'#7c2c22');r(2,14,3,2,'#4a3018');r(27,14,3,2,'#4a3018')}},
 backbar:{n:'Back bar shelves',w:3,h:1,c:'Tavern',g:[24,8,40,'rgba(255,200,100,A)'],d:r=>{r(0,0,48,2,O);r(0,8,48,2,O);['#58d058','#d83828','#4a9ae0','#f2c14e','#a060f0','#58d058','#d83828','#4a9ae0'].forEach((c,i)=>{r(2+i*6,2,4,6,O);r(3+i*6,3,2,4,c);r(2+i*6,10,4,5,O);r(3+i*6,11,2,3,['#f2c14e','#58d058'][i%2])})}},
 dartboard:{n:'Dartboard',w:1,h:1,c:'Tavern',d:r=>{r(2,2,12,12,O);r(3,3,10,10,'#efe3bd');r(4,4,8,8,'#d83828');r(6,6,4,4,'#3a8a4a');r(7,7,2,2,'#f2c14e');r(10,7,5,1,'#c9d2da')}},
 cardtable:{n:'Card table',w:2,h:1,c:'Tavern',d:r=>{r(0,4,32,11,O);r(1,5,30,6,'#2f6a42');r(5,6,3,4,'#efe3bd');r(10,7,3,4,'#efe3bd');r(18,6,3,3,'#f2c14e');r(24,7,3,3,'#f2c14e');r(2,11,3,5,'#6b4423');r(27,11,3,5,'#6b4423')}},
 piano:{n:'Piano',w:2,h:1,c:'Tavern',d:r=>{r(0,2,32,14,O);r(1,3,30,5,'#2a2a30');r(2,8,28,4,'#efe3bd');for(let x=4;x<28;x+=4)r(x,8,2,2,'#222');r(2,12,3,4,O);r(27,12,3,4,O)}},
 stage:{n:'Stage',w:3,h:2,c:'Tavern',z:0,d:r=>{r(0,0,48,32,O);r(1,1,46,24,'#a8743f');r(1,1,46,3,'#c9965a');for(let x=8;x<46;x+=10)r(x,4,1,21,'#8a5a2e');r(1,25,46,6,'#6b4423')}},
 boar:{n:'Boar head',w:1,h:1,c:'Tavern',d:r=>{r(3,2,10,8,'#8a5a2e');r(4,3,8,6,'#6b4423');r(3,7,2,2,'#efe3bd');r(11,7,2,2,'#efe3bd');r(5,5,1,1,O);r(10,5,1,1,O);r(4,10,8,3,'#a8743f')}},
 fishmount:{n:'Mounted fish',w:2,h:1,c:'Tavern',d:r=>{r(1,3,30,10,'#6b4423');r(5,5,18,6,'#6a9ac8');r(5,5,18,1,'#9ac8e8');r(22,6,6,4,'#6a9ac8');r(8,6,1,1,O)}},
 spit:{n:'Spit roast',w:2,h:1,c:'Tavern',g:[16,10,30,'rgba(255,140,40,A)'],d:(r,t)=>{r(0,0,32,16,O);r(1,1,30,14,'#7a7c76');r(2,9,28,5,'#e8632e');r(4,7+t%2,24,3,'#f2a22e');r(8,3,16,5,'#a8602a');r(2,5,28,1,'#8d8f97')}},
 cask:{n:'Ale cask',w:1,h:1,c:'Tavern',d:r=>{r(1,3,14,10,O);r(2,4,12,8,'#8a5a2e');r(2,6,12,1,'#4a3018');r(2,9,12,1,'#4a3018');r(7,10,2,2,'#c9a227');r(2,12,3,3,'#6b4423');r(11,12,3,3,'#6b4423')}},
 tankards:{n:'Tankards',w:1,h:1,c:'Tavern',d:r=>{r(2,8,5,6,O);r(3,9,3,4,'#e8c06a');r(2,7,5,2,'#fff');r(9,8,5,6,O);r(10,9,3,4,'#e8c06a');r(9,7,5,2,'#fff')}},
 lute:{n:'Lute',w:1,h:1,c:'Tavern',d:r=>{r(7,1,2,9,'#8a5a2e');r(6,1,4,2,O);r(3,8,10,7,O);r(4,9,8,5,'#c9965a');r(6,10,3,3,O)}}
};

// beds in sizes (single, double, king) and colours, built from one pattern each
const BC={red:['#c8553d','#e8785f'],blue:['#3b82c4','#6aa8e0'],green:['#4caf72','#7ad094'],white:['#e8e4d8','#ffffff'],gold:['#c9a227','#f0d060']};
const cap=k=>k[0].toUpperCase()+k.slice(1);
['red','blue','green','white'].forEach(k=>{const[c,c2]=BC[k];
 DEF['bs_'+k]={n:'Single bed ('+k+')',w:1,h:2,c:'Beds',d:r=>{r(0,0,16,32,O);r(1,1,14,30,'#a8743f');r(1,1,14,3,'#6b4423');r(2,4,12,24,'#e8e0d0');r(3,5,10,6,'#fff');r(2,12,12,16,c);r(2,12,12,2,c2);r(1,28,14,3,'#8a5a2e')}};
 DEF['bd_'+k]={n:'Double bed ('+k+')',w:2,h:2,c:'Beds',d:r=>{r(0,0,32,32,O);r(1,1,30,30,'#a8743f');r(1,1,30,3,'#6b4423');r(2,4,28,24,'#e8e0d0');r(4,5,11,6,'#fff');r(17,5,11,6,'#fff');r(2,13,28,15,c);r(2,13,28,2,c2);r(1,28,30,3,'#8a5a2e')}}});
['red','blue','green','gold'].forEach(k=>{const[c,c2]=BC[k];
 DEF['bk_'+k]={n:'King bed ('+k+')',w:3,h:2,c:'Beds',d:r=>{r(0,0,48,32,O);r(1,1,46,30,'#a8743f');r(1,1,46,4,'#6b4423');[6,22,38].forEach(x=>r(x,2,3,2,'#f2c14e'));r(2,5,44,23,'#e8e0d0');[4,18,32].forEach(x=>r(x,6,12,7,'#fff'));r(2,14,44,14,c);r(2,14,44,2,c2);r(5,19,38,1,c2);r(1,28,46,3,'#8a5a2e')}}});
DEF.canopy={n:'Canopy bed (double)',w:2,h:2,c:'Beds',d:r=>{r(0,0,32,32,O);r(1,4,30,26,'#a8743f');r(2,5,28,23,'#e8e0d0');r(4,6,11,6,'#fff');r(17,6,11,6,'#fff');r(2,14,28,14,'#a060b0');r(2,14,28,2,'#c890d0');r(0,0,3,32,'#6b4423');r(29,0,3,32,'#6b4423');r(3,0,26,5,'#a060b0');[3,9,15,21,26].forEach(x=>r(x,5,3,3,'#a060b0'))}};
DEF.canopyk={n:'Canopy bed (king)',w:3,h:2,c:'Beds',d:r=>{r(0,0,48,32,O);r(1,4,46,26,'#a8743f');r(2,5,44,23,'#e8e0d0');[4,18,32].forEach(x=>r(x,6,12,6,'#fff'));r(2,14,44,14,'#c9a227');r(2,14,44,2,'#f0d060');r(0,0,3,32,'#6b4423');r(45,0,3,32,'#6b4423');r(3,0,42,5,'#9c3b30');[3,10,17,24,31,38,43].forEach(x=>r(x,5,3,4,'#9c3b30'))}};
DEF.bunk={n:'Bunk bed',w:1,h:2,c:'Beds',d:r=>{r(0,0,16,32,O);r(1,1,14,30,'#6b4423');r(2,2,10,12,'#e8e0d0');r(3,3,8,3,'#fff');r(2,6,10,8,'#4a82b8');r(2,17,10,11,'#e8e0d0');r(3,18,8,3,'#fff');r(2,21,10,7,'#c8553d');r(12,2,3,27,'#8a5a2e');r(0,15,16,2,'#8a5a2e')}};
DEF.cot={n:'Cot',w:1,h:2,c:'Beds',d:r=>{r(1,2,14,28,O);r(2,3,12,26,'#c9a06a');r(2,3,12,4,'#8a6a4a');r(2,10,12,18,'#8a6a4a');r(2,10,12,2,'#a8845a');r(1,29,3,3,O);r(12,29,3,3,O)}};
const FLOORS={wood:'Wood',light:'Light wood',dark:'Dark planks',stone:'Stone',cobble:'Cobblestone',tile:'Checker tile',marble:'Marble',carpet:'Red carpet',sand:'Sand',dirt:'Packed earth'};
const WALLS={stone:'Stone',wood:'Timber',plaster:'Plaster',white:'Whitewash',brick:'Red brick',ship:'Ship planks',log:'Log cabin',cave:'Cave rock'};
function floorTile(r,x,y,k,tx,ty){const sm=(tx*7+ty*3)%5===0;
 if(k==='wood'||k==='dark'||k==='light'){const b={wood:['#b98a55','#a07040'],dark:['#7a5a38','#5e4228'],light:['#d9b27a','#c49a62']}[k];r(x,y,16,16,b[0]);[3,8,13].forEach(o=>r(x,y+o,16,1,b[1]));r(x+(ty%2?4:11),y,1,16,b[1])}
 else if(k==='stone'){r(x,y,16,16,'#8d8f87');r(x,y,16,1,'#a9aaa3');r(x,y,1,16,'#6b6d66');if(sm)r(x+5,y+6,3,2,'#a9aaa3')}
 else if(k==='cobble'){r(x,y,16,16,'#6e6a60');[[1,1],[9,1],[5,8],[0,9],[12,9]].forEach(([a,b],i)=>{r(x+a,y+b,6,6,'#9a9488');r(x+a,y+b,6,1,'#b4aea2');r(x+a+4,y+b+4,2,2,'#7a7468')})}
 else if(k==='tile'){r(x,y,16,16,(tx+ty)%2?'#d8d4c4':'#9aa0a8');r(x,y,16,1,'#6b6d66');r(x,y,1,16,'#6b6d66')}
 else if(k==='marble'){r(x,y,16,16,'#e6e4de');r(x,y,16,1,'#c9c7c0');r(x,y,1,16,'#c9c7c0');if(sm){r(x+4,y+3,6,1,'#cfd0d6');r(x+8,y+4,3,1,'#cfd0d6')}}
 else if(k==='carpet'){r(x,y,16,16,'#9c3b30');r(x+1,y+1,14,14,'#b8473a');r(x+7,y+7,2,2,'#e8c06a');r(x,y,16,1,'#7c2c22')}
 else if(k==='sand'){r(x,y,16,16,'#ead9a0');if(sm){r(x+3,y+5,2,1,'#cdb77a');r(x+10,y+11,2,1,'#cdb77a')}r(x+((tx*3+ty)%13),y+((tx+ty*5)%13),1,1,'#d6c088')}
 else{r(x,y,16,16,'#8a6a45');if(sm)r(x+4,y+5,3,2,'#6e5232');r(x+((tx*5+ty)%12),y+((ty*3+tx)%12),2,1,'#a3825a')}}
function wallTile(r,x,y,k,tx,ty){
 if(k==='stone'){r(x,y,16,16,'#6b6d66');r(x,y+7,16,1,'#4f514b');r(x+(ty%2?4:12),y,1,8,'#4f514b');r(x+(ty%2?12:4),y+8,1,8,'#4f514b')}
 else if(k==='wood'){r(x,y,16,16,'#7a5a38');for(let i=3;i<16;i+=4)r(x+i,y,1,16,'#573a21')}
 else if(k==='plaster'){r(x,y,16,16,'#e9d9b8');if(tx%4===0)r(x,y,2,16,'#6e4b2c');if(ty===0)r(x,y,16,2,'#6e4b2c')}
 else if(k==='white'){r(x,y,16,16,'#f0ece0');if(tx%3===0)r(x,y,2,16,'#5a3f28');if(ty===0)r(x,y,16,2,'#5a3f28')}
 else if(k==='brick'){r(x,y,16,16,'#a05a46');for(let j=3;j<16;j+=4)r(x,y+j,16,1,'#7a4034');for(let j=0;j<4;j++)r(x+((j%2)*4+4)%16,y+j*4,1,3,'#7a4034');r(x+8,y+4,1,3,'#7a4034')}
 else if(k==='ship'){r(x,y,16,16,'#5a3f28');for(let j=3;j<16;j+=5)r(x,y+j,16,1,'#3d2a14');r(x+3,y+1,1,1,'#c9a35c');r(x+12,y+6,1,1,'#c9a35c');r(x+6,y+11,1,1,'#c9a35c')}
 else if(k==='log'){r(x,y,16,16,'#8a5a2e');for(let j=0;j<16;j+=5){r(x,y+j,16,1,'#4a3018');r(x,y+j+1,16,1,'#a8743f')}r(x+((ty*5)%12),y+2,2,2,'#6b4423')}
 else{r(x,y,16,16,'#5a5b63');r(x+((tx*5+ty)%10),y+2,5,4,'#6a6b73');r(x+((tx*3+ty*7)%9),y+9,6,4,'#4a4b53')}
 if(ty===2){r(x,y+12,16,4,'#3a3b36');r(x,y+11,16,1,'#8d8f87')}}

return {DEF,FLOORS,WALLS,floorTile,wallTile,rr}})();
// ---- drawing a prop: each (prop, turn, mirror, tick) is painted once on a small canvas (with 4 spare pixels all round, because some art overhangs its tiles) and then copied ----
const PSPR=new Map(),propDim=(id,rot)=>{const d=PROPS.DEF[id];return (rot||0)%2?[d.h,d.w]:[d.w,d.h]};
function propSprite(id,rot,flip,tick){const d=PROPS.DEF[id],ph=d.d.length>1?tick%12:0,key=id+'|'+rot+'|'+flip+'|'+ph,hit=PSPR.get(key);if(hit)return hit;
  const W=d.w*T,H=d.h*T,k=(rot||0)%4,[ew,eh]=k%2?[H,W]:[W,H],cv=document.createElement('canvas');cv.width=ew+8;cv.height=eh+8;const c=cv.getContext('2d');
  c.translate(4+ew/2,4+eh/2);c.rotate(k*Math.PI/2);if(flip)c.scale(-1,1);c.translate(-W/2,-H/2);d.d(PROPS.rr(c),ph);PSPR.set(key,cv);return cv}
const drawProp=(p,sx,sy,tick)=>g.drawImage(propSprite(p.id,p.rot,p.flip,tick),Math.round(sx)-4,Math.round(sy)-4);
// where a prop's glow sits, in pixels from the room's top-left (the designer's glowAt)
function propGlow(p){const d=PROPS.DEF[p.id];if(!d.g)return null;const W=d.w*T,H=d.h*T,k=(p.rot||0)%4,[ew,eh]=k%2?[H,W]:[W,H];let vx=d.g[0]-W/2,vy=d.g[1]-H/2;if(p.flip)vx=-vx;const a=k*Math.PI/2,cs=Math.round(Math.cos(a)),sn=Math.round(Math.sin(a));
  return{x:p.x*T+ew/2+vx*cs-vy*sn,y:p.y*T+eh/2+vx*sn+vy*cs,r:d.g[2],c:d.g[3]}}
// a tile of a room's floor (tiles 184 to 193) or wall (194 to 201), drawn with the designer's functions on the room's own coordinates (the wall's skirting depends on the row inside the room)
function interiorTile(mm,sx,sy,tx,ty){const r=intrOf(tx,ty),rx=r?tx-r.x0:tx,ry=r?ty-r.y0:ty;if(mm<194)PROPS.floorTile(R,sx,sy,Object.keys(PROPS.FLOORS)[mm-184],rx,ry);else PROPS.wallTile(R,sx,sy,Object.keys(PROPS.WALLS)[mm-194],rx,ry)}
